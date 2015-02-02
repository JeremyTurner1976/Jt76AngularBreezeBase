using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Jt76Base.Common.Services;
using Jt76Base.Data.Database;
using Jt76Base.Data.Factories;
using Jt76Base.Data.Models;
using Jt76Base.Ui;
using Moq;

namespace Jt76Base.Tests
{
    public static class CommonSetups
    {
        internal static Moq.Mock<Jt76DbContext> GetJt76DbContext()
        {
            // Create a mock set and context
            Mock<DbSet<Error>> errorSet = new Mock<DbSet<Error>>()
                .SetupData(JtMockFactory.GetErrorMocks(3).ToList());

            // Create a mock set and context
            Mock<DbSet<LogMessage>> logMessageSet = new Mock<DbSet<LogMessage>>()
                .SetupData(JtMockFactory.GetLogMessageMocks(3).ToList());

            var context = new Mock<Jt76DbContext>();

            context.Setup(c => c.Errors).Returns(errorSet.Object);
            context.Setup(c => c.LogMessages).Returns(logMessageSet.Object);

            return context;
        }

        internal static Moq.Mock<BreezeRepository> GetBreezeRepository(Jt76DbContext context)
        {
            var repository = new Mock<BreezeRepository>();
            repository.Setup(c => c.Context).Returns(context);
            return repository;
        }

        internal static Jt76Base.Ui.UiService GetUiService()
        {
            Mock<Jt76DbContext> context = GetJt76DbContext();
            Mock<BreezeRepository> repository = GetBreezeRepository(context.Object);

            //Email Logger
            var configService = new ConfigService();
            var fileService = new FileService();
            var emailService = new ConfigEmailService(configService, fileService);
            var emailLoggingService = new EmailLoggingService(emailService);

            //File Logger
            var fileLoggingService = new FileLoggingService(fileService);

            //Db Logger
            var dbLoggingService = new DbLoggingService(repository.Object);

            var uiService = new UiService(dbLoggingService, emailLoggingService, fileLoggingService);
            return uiService;
        }
    }
}
