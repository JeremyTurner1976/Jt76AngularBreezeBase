using System.Diagnostics;
using System.Web.Mvc;

namespace Jt76Base.Ui
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            Debug.WriteLine("FilterConfig.RegisterGlobalFilters");

            filters.Add(new HandleErrorAttribute());
        }
    }
}
