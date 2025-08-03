namespace PropVivo.API.Extensions
{
    public static class CorsPolicyExtensions
    {
        public static void ConfigureCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                //Defining the "Default" policy here.
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:3000") // Frontend URL
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials(); // Essential for SignalR
                });
            });
        }
    }
}