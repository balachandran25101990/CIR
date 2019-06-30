using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using ChatApplication;

namespace GamesaCIR
{
    public class MvcApplication : System.Web.HttpApplication
    {      

        protected void Application_Start(object sender, EventArgs e)
        {
            // RouteTable.Routes.MapHubs();
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            GlobalConfiguration.Configure(WebApiConfig.Register);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            log4net.Config.XmlConfigurator.Configure();
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Server.MapPath("~/Web.config")));

            //GlobalConfiguration.Configure(config =>
            // {
            //     config.MapHttpAttributeRoutes();

            //     config.Routes.MapHttpRoute(
            //         name: "DefaultApi",
            //         routeTemplate: "api/{controller}/{action}/{id}",
            //         defaults: new { controller = "File", action = "UploadFile", id = RouteParameter.Optional }
            //     );
            // });
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }



    }
}
