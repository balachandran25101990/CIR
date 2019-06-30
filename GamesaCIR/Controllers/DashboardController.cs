using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CIR.DataAccess;
using CIR.DomainModel;
using GamesaCIR.Filters;
using GamesaCIR.App_Code;

namespace GamesaCIR.Controllers
{
    public class DashboardController : Controller
    {

        #region Global Variables

        MainClass oMainClass = new MainClass();
        DashBoardManager oDashBoardManager = new DashBoardManager();

        #endregion

        #region Global Methods

        public DashboardController()
        {
            if (CookieManager.GetCookie("GAM") != null)
            {
                ViewBag.Name = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee;
                ViewBag.MenuDetails = oMainClass.GetMenu(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            }
            else
                RedirectToAction("TimeOut", "Login");
        }

        #endregion

        #region Common Methods

        #endregion

        #region DashBoard Details

        [CheckRoleAccess]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetMenu()
        {
            List<Menu> result = new List<Menu>();
            List<Menu> lstMenuList = oMainClass.GetMenu(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDashBoardDetailsForFE(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetDashBoardDetailsForFE(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            result.DsgId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId;
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPendingdetailsForFEExceptMyPending(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetDashBoardDetailsForFEExceptMyPending(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            result.DsgId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId;
            result.IsMyPending = "1";
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPendingDetailsForVersionUpdt(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetPendingDetailsForVersionUpdt(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            result.DsgId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId;
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDashBoardDetailsForFSR(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetDashBoardDetailsForFSR(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            result.DsgId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId;
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPendingdetailsForFSRExceptMyPending(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetPendingdetailsForFSRExceptMyPending(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            result.DsgId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId;
            result.IsMyPending = "1";
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPendingDetailsForFE(DashBoardParameter dashBoardParameter)
        {

            var result = oDashBoardManager.GetPendingDetailsForFE(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPendingDetailsForFSR(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetPendingDetailsForFSR(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRedirectToCIR(string CIRId, string IsMyPending)
        {
            Session["CIRId"] = CIRId;
            Session["IsMyPending"] = IsMyPending;
            return Json(JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRedirectToCIM(string cimId, string IsMyPending)
        {
            Session["CIMId"] = cimId;
            Session["IsMyPending"] = IsMyPending;
            return Json(JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Notification Details

        public JsonResult GetNotificationDetails()
        {
            var result = oDashBoardManager.GetNotificationDetails(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);

        }

        #endregion

        #region SMP Data Dashboard

        [HttpPost]
        public JsonResult GetSMPDataDashboard(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetSMPDataDashboard(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetSMPDataDashboardDetails(DashBoardParameter dashBoardParameter)
        {
            var result = oDashBoardManager.GetSMPDataDashboardDetails(dashBoardParameter, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

    }
}