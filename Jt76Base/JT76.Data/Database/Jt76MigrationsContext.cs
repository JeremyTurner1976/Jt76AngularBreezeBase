using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using Jt76Base.Data.Factories;

namespace Jt76Base.Data.Database
{
    //latest version of the db
    public class JtMigrationsConfiguration : DbMigrationsConfiguration<Jt76DbContext>
    {
        public JtMigrationsConfiguration()
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            //DANGEROUS property
            //Essentially says the data does not matter when performing a migration
            //tells entity to delete and update at will, which is dangerous for live data
            AutomaticMigrationDataLossAllowed = false;
            //DANGEROUS set to true if getting a migration exception AND you are sure the data can be scrubbed
            //THEN ensure you set this to false following the migration

            //says to use automatic migrations
            //the seed below will create a fresh db with initial data, if none exists
            AutomaticMigrationsEnabled = true;
        }


        protected override void Seed(Jt76DbContext context)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            base.Seed(context);

#if DEBUG

            if (!context.Errors.Any())
            {
                var errorList = JtMockFactory.GetErrorMocks(25);
                foreach (var error in errorList)
                    context.Errors.Add(error);

                context.SaveChanges();
            }

            if (!context.LogMessages.Any())
            {
                var logMessageList = JtMockFactory.GetLogMessageMocks(25);
                foreach (var logMessage in logMessageList)
                    context.LogMessages.Add(logMessage);

                context.SaveChanges();
            }

#endif
        }
    }
}