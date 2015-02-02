using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Remoting.Messaging;
using System.Web.Http;
using Antlr.Runtime.Misc;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using ForecastIO;
using Jt76Base.Data.Database;
using Jt76Base.Data.Factories;
using Jt76Base.Data.Models;
using Newtonsoft.Json.Linq;

namespace Jt76Base.Ui.Controllers
{
    [BreezeController]
    public class BreezeController : ApiController
    {
        private readonly BreezeRepository _breezeBrepository;
        private readonly IUiService _uiService;

        public BreezeController(BreezeRepository breezeRepository, IUiService uiService)
        {
            _breezeBrepository = breezeRepository;
            _uiService = uiService;
        }

        [HttpGet]
        public string Metadata()
        {
            return _breezeBrepository.Metadata;
        }

        [HttpPost]
        public SaveResult SaveChanges([FromBody]JObject saveBundle)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            return _breezeBrepository.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<Error> Errors()
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            return _breezeBrepository.Errors;
        }

        [HttpGet]
        public IQueryable<LogMessage> LogMessages()
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            return _breezeBrepository.LogMessages;
        }


        /// <summary>
        /// Used to return data that will only be loaded once per the life of the application
        /// </summary>
        /// <returns>static data</returns>
        [HttpGet]
        public object Lookups()
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            var errorLevels = Enum.GetNames(typeof(ErrorLevels)).AsQueryable().Select(x => new { strErrorLevel = x });
            return new { errorLevels };
        }

        [HttpGet]
        public object LocalWeather(float fLatitude = 47.4886f, float fLongitude = -117.5786f)
        {
            //https://github.com/f0xy/forecast.io-csharp  // API Key, Lat, Long, Unit
            var request = new ForecastIORequest("ec8fab02bc1bf58c04e74c58bc2c3525", fLatitude, fLongitude, Unit.us);
            var response = request.Get();

            List<DailyForecast> tempList = new ListStack<DailyForecast>();
            var strSummary = response.daily.summary;
            var currently = response.currently;
            tempList.AddRange(response.daily.data);

            var currentWeather = new { currently.summary, currently.icon, currently.temperature};
            var dailyWeather = tempList.AsQueryable().Select(x => new { x.summary, x.icon, x.temperatureMin, x.temperatureMinTime, x.temperatureMax, x.temperatureMaxTime }).ToList();

            return new { strSummary, currentWeather, dailyWeather };
        }

        //Actions
        [HttpPost]
        public HttpResponseMessage SendEmail([FromBody] string strMessage)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            _uiService.SendMeMail(strMessage);
            return new HttpResponseMessage(HttpStatusCode.Accepted);
        }

        // Diagnostic
        [HttpGet]
        public string Ping()
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            return "Pong";
        }
    }
}