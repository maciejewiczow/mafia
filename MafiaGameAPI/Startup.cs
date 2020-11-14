using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MafiaGameAPI.Services;
using MafiaGameAPI.Repositories;
using MongoDB.Driver;

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

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
