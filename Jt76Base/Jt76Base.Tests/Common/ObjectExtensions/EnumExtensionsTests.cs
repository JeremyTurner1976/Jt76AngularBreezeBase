using Jt76Base.Common.ObjectExtensions;
using Jt76Base.Common.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Jt76Base.Tests.Common.ObjectExtensions
{
    [TestClass()]
    public class EnumExtensionsTests
    {
        [TestMethod()]
        public void ToNameStringTest()
        {
            const DirectoryFolders enumItem = DirectoryFolders.Jt76Test;
            const string strCompareString = "Jt76Test";

            Assert.AreEqual(enumItem.ToNameString(), strCompareString);
        }
    }
}
