using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Controllers;
using Newtonsoft.Json.Serialization;
using System.Web.Http.Filters;

namespace Jt76Base.Ui
{
    public static class WebApiConfig
    {
        public class ValidateModelAttribute : ActionFilterAttribute
        {
            public override void OnActionExecuting(HttpActionContext actionContext)
            {
                if (actionContext.ModelState.IsValid == false)
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(
                        HttpStatusCode.BadRequest, actionContext.ModelState);
                }
            }
        }

        public static void Register(HttpConfiguration config)
        {
            Debug.WriteLine("WebApiConfig.Register()");

            //register validation error json returns (breeze now handles this)
            //config.Filters.Add(new ValidateModelAttribute());

            // Web API configuration and services

            //make this return camelcased Json
            //JsonMediaTypeFormatter jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            //jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            ////add other supported media types
            //config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            //config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/json"));
            //config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/xml"));

            //config.Routes.MapHttpRoute("ErrorsRoute", "api/v1/errors/{id}",
            //    new { controller = "ErrorsApi", id = RouteParameter.Optional }
            //    );

            //config.Routes.MapHttpRoute("LogMessagesRoute", "api/v1/logMessages/{id}",
            //    new { controller = "LogMessagesApi", id = RouteParameter.Optional }
            //    );

            config.Routes.MapHttpRoute("DefaultApi", "api/v1/{controller}/{id}", new { id = RouteParameter.Optional }
                );
        }
    }
}
