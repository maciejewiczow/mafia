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
using MafiaGameAPI.Helpers;
using Microsoft.AspNetCore.SignalR;
using System.Net.Http;

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
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };
                    opts.RequireHttpsMetadata = false;
                    opts.TokenValidationParameters.IssuerSigningKey.KeyId = "AccessTokenKey";

                    opts.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var path = context.HttpContext.Request.Path;

                            if (path.StartsWithSegments("/hubs"))
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
                        ValidateLifetime = true,
                        RequireSignedTokens = true,
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };
                    opts.RequireHttpsMetadata = false;
                    opts.TokenValidationParameters.IssuerSigningKey.KeyId = "RefreshTokenKey";
                })
                .AddJwtBearer(nameof(TokenType.TurnCallbackToken), opts =>
                {
                    opts.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.FromMinutes(5),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetValue<String>("TurnFunction:CallbackTokenSignature"))),
                        ValidateLifetime = true,
                        RequireSignedTokens = true,
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };
                    opts.RequireHttpsMetadata = false;
                    opts.TokenValidationParameters.IssuerSigningKey.KeyId = "CallbackTokenKey";
                });

            services.AddHttpClient<HttpClient>("TurnFunction", client =>
            {
                client.BaseAddress = new Uri(Configuration.GetValue<String>("TurnFunction:BaseAddress"));
                client.DefaultRequestHeaders.Add("x-functions-key", Configuration.GetValue<String>("TurnFunction:FunctionKey"));
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

                opts.AddPolicy(
                    nameof(TokenType.TurnCallbackToken),
                    new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .AddAuthenticationSchemes(nameof(TokenType.TurnCallbackToken))
                        .RequireClaim("type", TokenType.TurnCallbackToken.ToString())
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
                services.AddSwaggerGen();
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

            builder.AddHubOptions<GameChatHub>(opts =>
            {
                opts.ClientTimeoutInterval = TimeSpan.MaxValue;

                if (_env.IsDevelopment())
                {
                    opts.EnableDetailedErrors = true;
                    opts.HandshakeTimeout = TimeSpan.MaxValue;
                }
            });

            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IGameRoomsService, GameRoomsService>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();

            services.AddScoped<IChatRepository, ChatRepository>();
            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<IGameRoomsRepository, GameRoomsRepository>();
            services.AddScoped<IUsersRepository, UsersRepository>();

            services.AddScoped<IValidationHelper, ValidationHelper>();

            services.AddScoped<IMongoClient>(m =>
            {
                ConventionRegistry.Register("CamelCase", new ConventionPack { new CamelCaseElementNameConvention() }, type => true);

                var section = Configuration.GetSection("ConnectionStrings:Mongo");
                var user = section["Username"];
                var pass = section["Password"];

                var userPassFormat = (String.IsNullOrWhiteSpace(user) && String.IsNullOrWhiteSpace(pass)) ? "" : "{0}:{1}@";

                var userPass = String.Format(userPassFormat, user, pass);

                return new MongoClient(String.Format(section["Base"], userPass));
            });

            services.AddSingleton<IUserIdProvider, UserIdentityNameBasedIdProvider>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            if (env.IsDevelopment())
            {
                app.UseCors(FrontendOrigin);
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameChatHub>("/api/hubs/gameChat");
            });
        }
    }
}
