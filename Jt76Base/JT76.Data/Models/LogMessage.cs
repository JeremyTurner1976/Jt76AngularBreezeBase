using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Jt76Base.Data.Abstract;

namespace Jt76Base.Data.Models
{
    public class LogMessage : ModelBase
    {
        [Required(ErrorMessage = "The field 'Log Message' is required.")]
        [StringLength(2000, MinimumLength = 10, 
            ErrorMessage = "The field 'Log Message' must be a sentence with a minimum length of 10 and a maximum length of 2000")]
        [DisplayName("Log Message")]
        public string StrLogMessage { get; set; }
    }
}