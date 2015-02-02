using System.Diagnostics;
using System.Web.Http;
using Jt76Base.Ui;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof(BreezeWebApiConfig), "RegisterBreezePreStart")]

namespace Jt76Base.Ui
{
    public static class BreezeWebApiConfig
    {
        public static void RegisterBreezePreStart()
        {
            Debug.WriteLine("BreezeWebApiConfig.RegisterBreezePreStart()");

            GlobalConfiguration.Configuration.Routes.MapHttpRoute(
                name: "Jt76Api",
                routeTemplate: "Api/V1/{controller}/{action}"
            );
        }
    }
}