﻿using System.Configuration;
using System.Net.Configuration;
using Jt76Base.Common.ObjectExtensions;
using Jt76Base.Common.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Jt76Base.Tests.Common
{
    [TestClass()]
    public class ConfigServiceTests
    {
        [TestMethod()]
        public void GetSectionGroupTest()
        {
            var configService = new ConfigService();
            ConfigurationSectionGroup sections = configService.GetSectionGroup(ConfigService.JtAppSettings.GroupEmailSection.ToNameString());
            Assert.IsTrue(sections != null);
            Assert.IsTrue(sections.Sections.Count > 0);
            Assert.AreEqual(sections.Sections[0].GetType(), typeof(SmtpSection));
        }

        [TestMethod()]
        public void GetAppSettingTest()
        {
            var configService = new ConfigService();
            string strAppSetting = configService.GetAppSetting("UnobtrusiveJavaScriptEnabled");
            Assert.IsTrue(!string.IsNullOrEmpty(strAppSetting));
            Assert.IsTrue(string.Equals(strAppSetting, "true"));
        }
    }
}