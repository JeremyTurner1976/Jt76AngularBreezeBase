using System.Diagnostics;
using System.Web.Optimization;

namespace Jt76Base.Ui
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            Debug.WriteLine("BundleConfig.RegisterBundles()");

            //PRODUCTION: WebEssentials VS tool to minify all files, and include only the minified versions here

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/Vendor/bootstrap.css",
                "~/Content/Vendor/font-awesome.css",
                "~/Content/Vendor/ionicons.css",
                "~/Content/Vendor/animate.css",
                "~/Content/Vendor/breeze.directives.css",
                "~/Content/Vendor/angular-loading-bar.css",
                "~/Content/Vendor/simplify.css",
                "~/Content/toastr.css",
                "~/Content/site.css"

                //"~/Content/Vendor/morris.css.css",
                //"~/Content/Vendor/datepicker.css",
                //"~/Content/Vendor/owl.carousel.css",
                //"~/Content/Vendor/owl.theme.default.min.css"
            ));

            bundles.Add(new ScriptBundle("~/bundles/wrapBootstrap").Include(
                "~/Scripts/Vendor/jquery-1.11.1.js",
                "~/Scripts/Vendor/bootstrap.js",
                "~/Scripts/Vendor/skycons.js",
                "~/Scripts/Vendor/modernizr.js",

                "~/Scripts/Vendor/jquery.flot.min.js",
                "~/Scripts/Vendor/jquery.flot.stack.js",
                
                "~/Scripts/Vendor/morris.js",
                "~/Scripts/Vendor/rapheal.js",
                //"~/Scripts/Vendor/datepicker.js",
                //"~/Scripts/Vendor/sparkline.js",
                "~/Scripts/Vendor/jquery.popupoverlay.js"//,
                //"~/Scripts/Vendor/jquery.easypiechart.js",
                //"~/Scripts/Vendor/jquery.sortable.js",
                //"~/Scripts/Vendor/owl.carousel.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/NugetVendor/angular.js",
                "~/Scripts/NugetVendor/angular-animate.js",
                "~/Scripts/NugetVendor/angular-route.js",
                "~/Scripts/NugetVendor/angular-sanitize.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/thirdParty").Include(
                "~/Scripts/NugetVendor/moment.js", //date and time handler
                "~/Scripts/NugetVendor/toastr.js", //toaster
                "~/Scripts/Vendor/ui-bootstrap-tpls-0.10.0.js", //pagination
                "~/Scripts/Vendor/angular-loading-bar.js",

                "~/Scripts/Vendor/breeze.debug.js",
                "~/Scripts/Vendor/breeze.min.js",
                "~/Scripts/Vendor/breeze.angular.js",
                "~/Scripts/Vendor/breeze.directives.js",
                "~/scripts/Vendor/breeze.saveErrorExtensions.js"
            ));

            //Angular App Directory 
            bundles.Add(new ScriptBundle("~/bundles/jt76Base").Include(
                "~/Jt76Base/app.js",
                "~/Jt76Base/config.js",
                "~/Jt76Base/config.exceptionHandler.js",
                "~/Jt76Base/config.route.js"
            )
            .IncludeDirectory("~/Jt76Base/Repositories", "*.js", true)
            .IncludeDirectory("~/Jt76Base/Services", "*.js", true)
            .IncludeDirectory("~/Jt76Base/Common", "*.js", true)
            .IncludeDirectory("~/Jt76Base/Layout", "*.js", true)
            .IncludeDirectory("~/Jt76Base/Modules", "*.js", true));


                
        }
    }
}
