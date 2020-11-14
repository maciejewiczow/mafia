using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MafiaGameAPI.Services;
using MafiaGameAPI.Repositories;
using MongoDB.Driver;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddAuthentication()
                .AddJwtBearer("AccessToken", opts =>
                {
                    opts.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.FromMinutes(5),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetValue<String>("AccessToken:Signature"))),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        RequireSignedTokens = true,
                    };
                    opts.Audience = "http://localhost:5000";
                    opts.RequireHttpsMetadata = false;
                })
                .AddJwtBearer("RefreshToken", opts =>
                {
                    opts.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.FromMinutes(5),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetValue<String>("RefreshToken:Signature"))),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        RequireSignedTokens = true,
                    };
                    opts.Audience = "http://localhost:5000";
                    opts.RequireHttpsMetadata = false;
                });

            services.AddAuthorization(opts =>
            {
                opts.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes("AccessToken")
                    .RequireClaim("type", TokenType.AccessToken.ToString())
                    .Build();

                opts.AddPolicy(
                    nameof(TokenType.RefreshToken),
                    new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .AddAuthenticationSchemes("RefreshToken")
                        .RequireClaim("type", TokenType.RefreshToken.ToString())
                        .Build()
                );
            });

            services.AddControllers();

            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IGameRoomsService, GameRoomsService>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IChatRepository, ChatRepository>();
            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<IGameRoomsRepository, GameRoomsRepository>();
            services.AddScoped<IMongoClient>(m =>
            {
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

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}
