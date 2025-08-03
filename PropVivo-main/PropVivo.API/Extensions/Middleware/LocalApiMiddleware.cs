using System.Security.Authentication;

namespace PropVivo.API.Extensions.Middleware
{
    public class LocalApiMiddleware
    {
        private readonly string _env;
        private readonly bool _isProdVault = false;
        private readonly RequestDelegate _next;

        public LocalApiMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _env = (configuration.GetValue<string>("Env") ?? string.Empty).ToLower();
            _isProdVault = (configuration.GetValue<string>("KeyName") ?? string.Empty).ToLower().Equals("pvintegrated-prodkeys");
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/api/webhooks/incoming-call"))
            {
                await _next.Invoke(context);
                return;
            }
            
            if (!context.Request.Host.Value.ToLower().Contains("localhost"))
                throw new AuthenticationException("User is not authorized.");

            if (_isProdVault)
                throw new AuthenticationException("User is not authorized.");

            if (_env.Contains("prod"))
                throw new AuthenticationException("User is not authorized.");

            if (!_env.Contains("dev") && !_env.Contains("prod"))
                throw new AuthenticationException("User is not authorized.");

            await _next.Invoke(context);
        }
    }
}