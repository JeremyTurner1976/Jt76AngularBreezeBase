using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Jt76Base.Data.Abstract;

namespace Jt76Base.Data.Models
{
    public class Error : ModelBase
    {
        [Required(ErrorMessage = "The field 'Message' is required.")]
        [StringLength(255, MinimumLength = 10,
            ErrorMessage = "The field 'Message' must be a sentence with a minimum length of 10 and a maximum length of 255")]
        [DisplayName("Message")]
        public string StrMessage { get; set; }

        [Required(ErrorMessage = "The field 'Level' is required.")]
        [StringLength(50, MinimumLength = 5,
            ErrorMessage = "The field 'Level' must be a sentence with a minimum length of 5 and a maximum length of 50")]
        [DisplayName("Level")]
        public string StrErrorLevel { get; set; }

        [Required(ErrorMessage = "The field 'Source' is required.")]
        [StringLength(255, MinimumLength = 5,
            ErrorMessage = "The field 'Source' must be a sentence with a minimum length of 5 and a maximum length of 255")]
        [DisplayName("Source")]
        public string StrSource { get; set; }

        [Required(ErrorMessage = "The field 'Additional Information' is required.")]
        [StringLength(255, MinimumLength = 5,
            ErrorMessage = "The field 'Additional Information' must be a sentence with a minimum length of 5 and a maximum length of 255")]
        [DisplayName("Additional Information")]
        public string StrAdditionalInformation { get; set; }

        [Required(ErrorMessage = "The field 'StackTrace' is required.")]
        [StringLength(4000, MinimumLength = 5,
            ErrorMessage = "The field 'StackTrace' must be a sentence with a minimum length of 5 and a maximum length of 4000")]
        [DisplayName("StackTrace")]
        public string StrStackTrace { get; set; }
    }
}