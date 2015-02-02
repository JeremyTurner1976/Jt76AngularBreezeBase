using System;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Jt76Base.Data.Abstract;
using Jt76Base.Data.Models;
using Newtonsoft.Json.Linq;

namespace Jt76Base.Data.Database
{
    public interface IBreezeRepository
    {
        SaveResult SaveChanges(JObject saveBundle);
        bool SaveError(Object newObject);
        bool SaveLogMessage(Object newObject);
    }

    public class BreezeRepository : ModelRepositoryBase
    {
        //Production: The timed service will also handle purges of old data, and other DB timed events

        private readonly EFContextProvider<Jt76DbContext> _contextProvider = new EFContextProvider<Jt76DbContext>();

        public virtual Jt76DbContext Context { get { return _contextProvider.Context; } }

        public string Metadata
        {
            get { return _contextProvider.Metadata(); }
        }

        public SaveResult SaveChanges(JObject saveBundle)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            foreach (var item in saveBundle["entities"])
            {
                item["DtCreated"] = DateTime.UtcNow;
            }
            return _contextProvider.SaveChanges(saveBundle);
        }

        //Errors
        public IQueryable<Error> Errors
        {
            get { return Context.Errors; }
        }

        public bool SaveError(Error newItem)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            var cleanedError = (Error)newItem.ForceValidData();
            Context.Errors.Add(cleanedError);

            return Context.SaveChanges() > 0;
        }

        //Log Messages
        public IQueryable<LogMessage> LogMessages
        {
            get { return Context.LogMessages; }
        }

        public bool SaveLogMessage(LogMessage newItem)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            var cleanedLogMessage = (LogMessage)newItem.ForceValidData();
            Context.LogMessages.Add(cleanedLogMessage);
            return Context.SaveChanges() > 0;
        }
    }
}
