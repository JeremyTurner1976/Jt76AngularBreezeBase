using System.Diagnostics;
using System.Reflection;
using System.Web.Mvc;

namespace Jt76Base.Ui.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            return View();
        }

        public ActionResult LockScreen()
        {
            Debug.WriteLine(GetType().FullName + "." + MethodBase.GetCurrentMethod().Name);

            return View();
        }
    }
}
