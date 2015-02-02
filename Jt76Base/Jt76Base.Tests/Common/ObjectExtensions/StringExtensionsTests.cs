using System;
using System.Collections.Generic;
using System.Linq;
using Jt76Base.Common.ObjectExtensions;
using Jt76Base.Data.Factories;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Jt76Base.Tests.Common.ObjectExtensions
{
    [TestClass]
    public class StringExtensionsTests
    {
        [TestMethod]
        public void SplitOnNewLinesTest()
        {
            const int nCount = 4;
            var strMock = JtMockFactory.GetFakerParagraphs(nCount);

            var mockItems = strMock.SplitOnNewLines();
            var enumerable = mockItems as IList<string> ?? mockItems.ToList();

            Assert.IsTrue(enumerable.Count() == nCount);
            foreach (var item in enumerable)
                Assert.IsTrue(!string.IsNullOrEmpty(item));
        }

        [TestMethod]
        public void SplitOnBreaksTest()
        {
            const int nCount = 5;

            try
            {
                ErrorFactory.GetThrownException();
                Assert.Fail();
            }
            catch (DivideByZeroException e)
            {
                var strMock = ErrorFactory.GetErrorAsHtml(e);

                var mockItems = strMock.SplitOnBreaks();
                var enumerable = mockItems as IList<string> ?? mockItems.ToList();

                Assert.IsTrue(enumerable.Count() >= nCount);
                foreach (var item in enumerable)
                    Assert.IsTrue(!string.IsNullOrEmpty(item));
            }
        }

        [TestMethod()]
        public void StripNewlinesTest()
        {
            const int nCount = 4;
            var strMock = JtMockFactory.GetFakerParagraphs(nCount);

            Assert.IsTrue(strMock.Contains(Environment.NewLine));

            var strReturn = strMock.StripNewlines();

            Assert.IsFalse(strReturn.Contains(Environment.NewLine));
        }

        [TestMethod()]
        public void DigitsOnlyTest()
        {
            const int nDigitCount = 10;
            const string strMock = "qwertyuiop1234567890asdfghjkl";
            var strReturn = strMock.DigitsOnly();
            Assert.AreEqual(strReturn.Length, nDigitCount);
        }
    }
}