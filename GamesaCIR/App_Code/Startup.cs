using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartup(typeof(GamesaCIR.App_Code.Startup))]

namespace GamesaCIR.App_Code
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {
            //  var idProvider = new CustomUserId();

            //   GlobalHost.DependencyResolver.Register(typeof(IUserIdProvider), () => idProvider);

            app.MapSignalR();
        }

        //public void Configuration(IAppBuilder app)
        //{
        //    var config = new HubConfiguration();
        //    config.EnableJSONP = true;
        //    app.MapSignalR(config);

        //    //app.UseCors(CorsOptions.AllowAll);
        //    //app.MapSignalR();            
        //}

    }
}
