using System;

namespace Jt76Base.Common.ObjectExtensions
{
    public static class EnumExtensions
    {
        public static string ToNameString(this Enum enumSource)
        {
            var type = enumSource.GetType();
            return Enum.GetName(type, enumSource);
        }
    }
}
