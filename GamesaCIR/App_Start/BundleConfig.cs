using System.Web;
using System.Web.Optimization;

namespace GamesaCIR
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                       "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/Scripts/angular.js*",
                      "~/CIRScripts/Common/AngularModule.js",
                      "~/CIRScripts/Common/AngularService.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/bootstrap-datepicker.js",
                      "~/Scripts/bootstrap-timepicker.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/bootstrap-datetimepicker.js",
                      "~/Scripts/dataTables.js",
                      "~/Scripts/jquery.table2excel.js",
                      "~/Scripts/tooltip.js",
                      "~/Scripts/transition.js"));

            bundles.Add(new ScriptBundle("~/bundles/ImagesScroll").Include(
                        "~/Scripts/jquery.easing.1.3.js",
                        "~/Scripts/jquery.kinetic.js",
                        "~/Scripts/jquery.kineticScrollbar.js",
                        "~/Scripts/jquery.mousewheel.js",
                        "~/Scripts/jquery.mousewheel.min.js",
                        "~/Scripts/jquery.tmpl.min.js"
                        ));

            bundles.Add(new StyleBundle("~/Content/login/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/design-sheet.css"));

            bundles.Add(new StyleBundle("~/Content/Master/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/jquery-ui.css",
                      "~/Content/design-sheet.css",
                      "~/Content/bs_leftnavi.css",
                      "~/Content/responsive-tabs.css",
                      "~/Content/animate.css",
                      "~/Content/bootstrap-datepicker.css",
                      "~/Content/bootstrap-timepicker.css",
                      "~/Content/simple-sidebar.css",
                      "~/Content/reset.css",
                      "~/Content/style.css",
                      "~/Content/bootstrap-datetimepicker.css",
                      "~/Content/dataTables.css",
                      "~/Content/font-awesome.css",
                      "~/Content/toastr.css",
                      "~/Content/angular-datatables.css"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/Master/js").Include(
                     "~/Scripts/bootstrap.min.js",
                     "~/Scripts/responsiveTabs.js",
                     "~/Scripts/respond.js",
                     "~/Scripts/toastr.js",
                     "~/CIRScripts/Common/jsMaster.js",
                     "~/Scripts/angular-datatables.js"));

            bundles.Add(new ScriptBundle("~/bundles/DatatablesJquery").Include(
                    "~/Scripts/DatatablesJs/jquery.dataTables.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/DatatablesAngular").Include(
                    "~/Scripts/DatatablesJs/angular-datatables.directive.js",
                    "~/Scripts/DatatablesJs/angular-datatables.instances.js",
                    "~/Scripts/DatatablesJs/angular-datatables.util.js",
                    "~/Scripts/DatatablesJs/angular-datatables.renderer.js",
                    "~/Scripts/DatatablesJs/angular-datatables.factory.js",
                    "~/Scripts/DatatablesJs/angular-datatables.options.js",
                    "~/Scripts/DatatablesJs/angular-datatables.js"
                ));

            bundles.Add(new StyleBundle("~/bundles/DatatablesCss").Include(
                     "~/Scripts/DatatablesCss/jquery.dataTables.css"));

            bundles.Add(new ScriptBundle("~/bundles/CustomerInfoDocument/js").Include(
                    "~/CIRScripts/KMPController.js"
                ));
        }
    }
}
