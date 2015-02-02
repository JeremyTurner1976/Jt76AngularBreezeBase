using System;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Reflection;
using Jt76Base.Data.Models;

namespace Jt76Base.Data.Database
{
    public interface IDbContext : IDisposable
    {
    }

    public class Jt76DbContext : DbContext, IDbContext
    {
        public Jt76DbContext() : base("Jt76Connection")
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            //anything that is lazy loaded attempts to generate the object
            //so turn this off and eager load instead
            Configuration.LazyLoadingEnabled = false;

            //handles the change manager in a very straight forward way
            Configuration.ProxyCreationEnabled = false;

            var bTestDirectory = AppDomain.CurrentDomain.ToString().Contains("UnitTest");

            if (!bTestDirectory)
            {
                //Code First Migration Flag
                System.Data.Entity.Database.SetInitializer(new MigrateDatabaseToLatestVersion<Jt76DbContext, JtMigrationsConfiguration>());

                //Implement any custom attributes, this will be null when mocking the db context
                ObjectContext objectContext = ((IObjectContextAdapter)this).ObjectContext;
                if (objectContext != null)
                {
                    //this can be used to set custom attributes on entity items with this attribute
                    //can also be set on the item itself

                    //moment.js and multiline class/textarea input is used for this output instead

                    //[CustomAttributes.DateTimeKindAttribute(DateTimeKind.Utc)]
                    //objectContext.ObjectMaterialized +=
                    //    (sender, e) => CustomAttributes.DateTimeKindAttribute.Apply(e.Entity);

                    //[CustomAttributes.CleanedHtmlString]
                    //objectContext.ObjectMaterialized +=
                    //    (sender, e) => CustomAttributes.CleanedHtmlString.Apply(e.Entity);
                }
            }
        }

        //This will force some of the db constraints to be parts of the model
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //this will set the max length of the property the same as it is on the db
            //modelBuilder.Properties<string>().Configure(p => p.IsMaxLength());

            // Use singular table names
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            //modelBuilder.Configurations.Add(new MapGroupsConfiguration());
        }

        //Error
        public virtual DbSet<Error> Errors { get; set; }

        //LogMessage
        public virtual DbSet<LogMessage> LogMessages { get; set; }
    }
}