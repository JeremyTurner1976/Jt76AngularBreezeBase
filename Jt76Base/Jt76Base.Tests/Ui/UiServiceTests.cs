using System;
using System.Data.Entity;
using System.Linq;
using Jt76Base.Common.Services;
using Jt76Base.Data.Database;
using Jt76Base.Data.Factories;
using Jt76Base.Data.Models;
using Jt76Base.Ui;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Jt76Base.Tests.Ui
{
    [TestClass]
    public class UiServiceTests
    {
        //Facade Pattern - Provides a unified interface to a set of interfaces in a subsystem
        //as such no functionality is tested only expecting a true result and no exceptions

        public UiService UiService { get; set; }

        [TestInitialize]
        public void Initialize()
        {
            UiService = CommonSetups.GetUiService();
        }

        [TestCleanup]
        public void CleanUp()
        {
        }

        [TestMethod]
        public void ParseErrorAsHtmlTest()
        {
            try
            {
                ErrorFactory.GetThrownException();
                Assert.Fail();
            }
            catch (Exception e)
            {
                var strHtml = UiService.ParseErrorAsHtml(e);
                Assert.IsTrue(!string.IsNullOrEmpty(strHtml));
            }
        }

        [TestMethod]
        public void LogMessageTest()
        {
            const string strLogMessage = "This is a leg message comming from the UiService.";

            var bResult = UiService.LogMessage(strLogMessage);
            Assert.IsTrue(bResult);
        }

        [TestMethod]
        public void HandleErrorTest()
        {
            try
            {
                ErrorFactory.GetThrownException();
                Assert.Fail();
            }
            catch (Exception e)
            {
                var result = UiService.HandleError(e);
                Assert.IsTrue(result);
            }
        }

        [TestMethod()]
        public void SendMeMailTest()
        {
            const string strLogMessage = "This is a leg message comming from the UiService.";

            UiService.SendMeMail(strLogMessage);

            //visually ensure you got the mail, this is being sent to the PrimaryDeveloperEmail only
        }
    }
}