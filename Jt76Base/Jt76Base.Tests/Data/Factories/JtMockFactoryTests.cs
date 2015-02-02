using System;
using System.Diagnostics;
using System.Linq;
using Jt76Base.Data.Factories;
using Jt76Base.Data.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Jt76Base.Tests.Data.Factories
{
    [TestClass]
    public class JtMockFactoryTests
    {
        [TestMethod]
        public void GetErrorMocksTest()
        {
            var mocks = JtMockFactory.GetErrorMocks(3);
            Assert.IsTrue(mocks.Any());

            Error mockItem = mocks.First();

            Assert.IsTrue(mockItem != null);
            Debug.Assert(mockItem != null, "mockItem != null");
            Assert.IsTrue(mockItem.HasNoEmptyStrings());
        }

        [TestMethod]
        public void GetLogMessageMocksTest()
        {
            var mocks = JtMockFactory.GetLogMessageMocks(3);
            Assert.IsTrue(mocks.Any());

            LogMessage mockItem = mocks.First();

            Assert.IsTrue(mockItem != null);
            Debug.Assert(mockItem != null, "mockItem != null");
            Assert.IsTrue(mockItem.HasNoEmptyStrings());
        }

        [TestMethod]
        public void GetFakerParagraphsTest()
        {
            const int nCount = 4;
            string strMock = JtMockFactory.GetFakerParagraphs(nCount);

            string[] mockItems = strMock.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

            Assert.IsTrue(mockItems.Count() == nCount);
            foreach (string item in mockItems)
                Assert.IsTrue(!string.IsNullOrEmpty(item));
        }
    }
}