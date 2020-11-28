using System;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using MafiaGameAPI.Services;
using MafiaGameAPI.Repositories;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Hubs;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Conventions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MafiaGameAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }
        private IWebHostEnvironment _env;

        readonly string FrontendOrigin = "frontend";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddAuthentication()
                .AddJwtBearer(nameof(TokenType.AccessToken), opts =>
                {
                    opts.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.FromMinutes(5),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetValue<String>("AccessToken:Signature"))),
                        ValidateLifetime = true,
                        RequireSignedTokens = true,
                    };

                    if (_env.IsDevelopment())
                    {
                        opts.RequireHttpsMetadata = false;
                        opts.TokenValidationParameters.ValidateIssuer = false;
                        opts.TokenValidationParameters.ValidateAudience = false;
                    }

                    opts.TokenValidationParameters.IssuerSigningKey.KeyId = "AccessTokenKey";

                    opts.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var path = context.HttpContext.Request.Path;

                            if ((path.StartsWithSegments("/hubs")))
                            {
                                context.Token = context.Request.Query["access_token"].ToString();
                            }
                            else
                            {
                                var header = context.Request.Headers["Authorization"].ToString()?.Split(' ');

                                if (header.Length == 2)
                                    context.Token = header[1];
                            }

                            return Task.CompletedTask;
                        }
                    };
                })
                .AddJwtBearer(nameof(TokenType.RefreshToken), opts =>
                {
                    opts.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.FromMinutes(5),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetValue<String>("RefreshToken:Signature"))),
                        ValidateLifetime = false,
                        RequireSignedTokens = true,
                    };

                    if (_env.IsDevelopment())
                    {
                        opts.RequireHttpsMetadata = false;
                        opts.TokenValidationParameters.ValidateIssuer = false;
                        opts.TokenValidationParameters.ValidateAudience = false;
                    }

                    opts.TokenValidationParameters.IssuerSigningKey.KeyId = "RefreshTokenKey";
                });

            services.AddAuthorization(opts =>
            {
                opts.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes(nameof(TokenType.AccessToken))
                    .RequireClaim("type", TokenType.AccessToken.ToString())
                    .Build();

                opts.AddPolicy(
                    nameof(TokenType.RefreshToken),
                    new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .AddAuthenticationSchemes(nameof(TokenType.RefreshToken))
                        .RequireClaim("type", TokenType.RefreshToken.ToString())
                        .Build()
                );
            });

            if (_env.IsDevelopment())
            {
                services.AddCors(options =>
                {
                    options.AddPolicy(
                        name: FrontendOrigin,
                        builder => builder.WithOrigins("http://localhost:3000")
                                .AllowAnyMethod()
                                .AllowCredentials()
                                .AllowAnyHeader()
                    );
                });
            }

            services.AddControllers()
                .AddNewtonsoftJson(opts =>
                {
                    opts.SerializerSettings.Converters.Add(new StringEnumConverter());
                    opts.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                });

            var builder = services.AddSignalR()
                .AddNewtonsoftJsonProtocol(opts =>
                {
                    opts.PayloadSerializerSettings.Converters.Add(new StringEnumConverter());
                    opts.PayloadSerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                });

            if (_env.IsDevelopment())
            {
                builder.AddHubOptions<GameHub>(opts =>
                {
                    opts.EnableDetailedErrors = true;
                    opts.ClientTimeoutInterval = TimeSpan.MaxValue;
                    opts.HandshakeTimeout = TimeSpan.MaxValue;
                });

                builder.AddHubOptions<ChatHub>(opts =>
                {
                    opts.EnableDetailedErrors = true;
                    opts.ClientTimeoutInterval = TimeSpan.MaxValue;
                    opts.HandshakeTimeout = TimeSpan.MaxValue;
                });
            }

            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IGameRoomsService, GameRoomsService>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();

            services.AddScoped<IChatRepository, ChatRepository>();
            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<IGameRoomsRepository, GameRoomsRepository>();
            services.AddScoped<IUsersRepository, UsersRepository>();

            services.AddScoped<IMongoClient>(m =>
            {
                var camelCaseConvention = new ConventionPack { new CamelCaseElementNameConvention() };
                ConventionRegistry.Register("CamelCase", camelCaseConvention, type => true);

                var section = Configuration.GetSection("ConnectionStrings:Mongo");
                var user = section["Username"];
                var pass = section["Password"];

                var userPassFormat = (String.IsNullOrWhiteSpace(user) && String.IsNullOrWhiteSpace(pass)) ? "" : "{0}:{1}@";

                var userPass = String.Format(userPassFormat, user, pass);

                return new MongoClient(String.Format(section["Base"], userPass));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors(FrontendOrigin);

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/hubs/game");
                endpoints.MapHub<ChatHub>("/hubs/chat");
            });
        }
    }
}
