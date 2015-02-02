using System;
using System.Data.Entity;
using System.Linq;
using Jt76Base.Common.Services;
using Jt76Base.Data.Database;
using Jt76Base.Data.Factories;
using Jt76Base.Data.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Jt76Base.Tests.Common.Services
{
    [TestClass]
    public class DbLoggingServiceTests
    {
        public Mock<Jt76DbContext> Context { get; set; }
        public Mock<BreezeRepository> Repository { get; set; }

        [TestInitialize]
        public void Initialize()
        {
            Context = CommonSetups.GetJt76DbContext();
            Repository = CommonSetups.GetBreezeRepository(Context.Object);
        }

        [TestCleanup]
        public void CleanUp()
        {
        }

        [TestMethod]
        public void LogErrorTest()
        {
            Error createdError = null;
            var loggingService = new DbLoggingService(Repository.Object);
            var strGuid = Guid.NewGuid().ToString();

            //ensure test validity
            Assert.AreEqual(3, Repository.Object.Errors.Count());

            Error foundError =
                Repository.Object.Errors.FirstOrDefault(x => x.StrAdditionalInformation.Contains(strGuid));
            if (foundError != null)
                Assert.Fail("Value already in the repository");

            //action
            try
            {
                ErrorFactory.GetThrownException();
                Assert.Fail();
            }
            catch (DivideByZeroException e)
            {
                createdError = ErrorFactory.GetErrorFromException(e, ErrorLevels.Message, "LogErrorTest" + strGuid);
                bool result = loggingService.LogError(e, ErrorLevels.Message, "LogErrorTest" + strGuid);
            }

            //ensure action
            Assert.AreEqual(4, Repository.Object.Errors.Count());

            foundError = Repository.Object.Errors.FirstOrDefault(x => x.StrAdditionalInformation.Contains(strGuid));
            if (createdError != null && foundError != null)
            {
                if (!Repository.Object.ModelEquals(createdError, foundError))
                    Assert.Fail("Non Equal Objects");
            }
            else
                Assert.Fail("No test error found");
        }

        //[TestMethod]
        public void LogMessageTest()
        {
            var loggingService = new DbLoggingService(Repository.Object);

            //ensure test validity
            string strGuid = Guid.NewGuid().ToString();
            Assert.AreEqual(3, Repository.Object.LogMessages.Count());

            LogMessage foundLogMessage =
                Repository.Object.LogMessages.FirstOrDefault(x => x.StrLogMessage.Contains(strGuid));
            if (foundLogMessage != null)
                Assert.Fail("Value already in the repository");

            var createdLogMessage = new LogMessage
            {
                DtCreated = DateTime.UtcNow,
                Id = 0,
                StrLogMessage = "Test Log Message " + strGuid
            };
            bool result = loggingService.LogMessage("Test Log Message " + strGuid);

            //ensure action
            Assert.AreEqual(4, Repository.Object.LogMessages.Count());

            foundLogMessage = Repository.Object.LogMessages.FirstOrDefault(x => x.StrLogMessage.Contains(strGuid));
            if (foundLogMessage != null)
            {
                if (!Repository.Object.ModelEquals(foundLogMessage, createdLogMessage))
                    Assert.Fail("Non Equal Objects for Object Entry");
            }
            else
                Assert.Fail("No test logMessage found");
        }
    }
}