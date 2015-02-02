using System;
using System.Diagnostics;
using System.Reflection;
using System.Text;
using Jt76Base.Common.ObjectExtensions;
using Jt76Base.Data.Database;
using Jt76Base.Data.Factories;
using Jt76Base.Data.Models;

namespace Jt76Base.Common.Services
{
    //interface
    public interface ILoggingService
    {
        bool LogError(Exception e, ErrorLevels errorLevel = ErrorLevels.Default,
            string strAdditionalInformation = "Additional Information Default");

        bool LogMessage(string strLogMessage);
    }

    //EmailLoggingService
    public class EmailLoggingService : ILoggingService
    {
        private readonly IEmailService _emailService;

        public EmailLoggingService(IEmailService emailService)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            _emailService = emailService;
        }

        public bool LogError(Exception e, ErrorLevels errorLevel = ErrorLevels.Default,
            string strAdditionalInformation = "Additional Information Default")
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            var sb = new StringBuilder();
            sb.AppendLine(strAdditionalInformation);
            sb.AppendLine(errorLevel.ToNameString());
            sb.AppendLine(ErrorFactory.GetErrorAsString(e));

            _emailService.SendMeMail(sb.ToString());
            //async can wait for !Result.Contains(false) if a valid return is wanted
            return true;
        }

        public bool LogMessage(string strLogMessage)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            _emailService.SendMeMail(strLogMessage);
            //async can wait for !Result.Contains(false) if a valid return is wanted
            return true;
        }
    }

    //DbLoggingService
    public class DbLoggingService : ILoggingService
    {
        private readonly BreezeRepository _breezeRepository;

        public DbLoggingService(BreezeRepository breezeRepository)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            _breezeRepository = breezeRepository;
        }

        public bool LogError(Exception e, ErrorLevels errorLevel = ErrorLevels.Default,
            string strAdditionalInformation = "Additional Information Default")
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            Error newError = ErrorFactory.GetErrorFromException(e, errorLevel, strAdditionalInformation);

            return _breezeRepository.SaveError(newError);
        }

        public bool LogMessage(string strLogMessage)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            var logMessage = new LogMessage
            {
                StrLogMessage = strLogMessage,
                DtCreated = DateTime.UtcNow
            };

            return _breezeRepository.SaveLogMessage(logMessage);
        }
    }

    //FileLoggingService
    public class FileLoggingService : ILoggingService
    {
        private readonly IFileService _fileService;

        public FileLoggingService(IFileService fileService)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            _fileService = fileService;
        }

        public bool LogError(Exception e, ErrorLevels errorLevel = ErrorLevels.Default,
            string strAdditionalInformation = "Additional Information Default")
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            var sb = new StringBuilder();
            sb.AppendLine("______________________________ERROR_________________________________");
            sb.AppendLine(strAdditionalInformation);
            sb.AppendLine(errorLevel.ToNameString());
            sb.AppendLine(ErrorFactory.GetErrorAsString(e));
            sb.AppendLine();
            sb.AppendLine();

            _fileService.SaveTextToDirectoryFile(DirectoryFolders.Jt76Errors, sb.ToString());
            return true;
        }

        public bool LogMessage(string strLogMessage)
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            var sb = new StringBuilder();
            sb.AppendLine(strLogMessage);

            _fileService.SaveTextToDirectoryFile(DirectoryFolders.Jt76Logs, sb.ToString());
            return true;
        }
    }
}