using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Jt76Base.Common.ObjectExtensions
{
    public static class StringExtensions
    {
        public static IEnumerable<string> SplitOnNewLines(this string strSource)
        {
            return strSource.Split(new[] {"\r\n", "\n"}, StringSplitOptions.RemoveEmptyEntries);
        }

        public static IEnumerable<string> SplitOnBreaks(this string strSource)
        {
            return strSource.Split(new[] {"<br/>"}, StringSplitOptions.RemoveEmptyEntries);
        }

        public static string StripNewlines(this string input)
        {
            return Regex.Replace(input, "\n", "    ", RegexOptions.Compiled);
        }

        public static string DigitsOnly(this string input)
        {
            return string.IsNullOrEmpty(input) ? input : new string(input.Where(char.IsDigit).ToArray());
        }
    }
}