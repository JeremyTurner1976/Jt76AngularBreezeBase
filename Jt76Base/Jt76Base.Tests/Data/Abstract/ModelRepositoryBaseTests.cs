using System;
using Jt76Base.Data.Database;
using Jt76Base.Data.Factories;
using Jt76Base.Data.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Jt76Base.Tests.Data.Abstract
{
    [TestClass]
    public class ModelRepositoryBaseTests
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
        public void ModelEqualsTest()
        {
            Error createdError = null;
            Error createdErrorTwo = null;

            string strGuid = Guid.NewGuid().ToString();

            try
            {
                ErrorFactory.GetThrownException();
                Assert.Fail();
            }
            catch (DivideByZeroException e)
            {
                createdError = ErrorFactory.GetErrorFromException(e, ErrorLevels.Message, "LogErrorTest" + strGuid);
            }

            //ensure validity
            Error copiedError = createdError;

            //action
            Assert.AreEqual(createdError, copiedError);
            bool result = Repository.Object.ModelEquals(createdError, copiedError);
            Assert.IsTrue(result);

            strGuid = Guid.NewGuid().ToString();
            try
            {
                ErrorFactory.GetThrownException();
                Assert.Fail();
            }
            catch (DivideByZeroException e)
            {
                createdErrorTwo = ErrorFactory.GetErrorFromException(e, ErrorLevels.Message, "LogErrorTest" + strGuid);
            }
            //ensure validity
            Assert.AreNotEqual(createdError, createdErrorTwo);

            //action
            result = Repository.Object.ModelEquals(createdError, createdErrorTwo);
            Assert.AreEqual(false, result);
        }
    }
}