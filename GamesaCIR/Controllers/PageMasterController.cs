using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CIR.DomainModel;
using CIR.DataAccess;
using GamesaCIR.Filters;
using GamesaCIR.App_Code;

namespace GamesaCIR.Controllers
{
    public class PageMasterController : Controller
    {

        #region Global Variables

        MasterManager oMasterManager = new MasterManager();
        MainClass mc = new MainClass();

        #endregion

        #region Global Methods

        public PageMasterController()
        {
            if (CookieManager.GetCookie("GAM") != null)
            {
                ViewBag.Name = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee;
                ViewBag.MenuDetails = mc.GetMenu(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            }
            else
                RedirectToAction("TimeOut", "Login");
        }

        #endregion

        #region Page Master

        [CheckRoleAccess]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetPage(PageModel page)
        {
            List<PageDetails> result = oMasterManager.GetPageMaster(page, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetPage(PageModel page)
        {
            PageResult result = oMasterManager.SetPageMaster(page, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

    }
}