using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CIR.DomainModel;
using CIR.DataAccess;
using GamesaCIR.App_Code;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading;
using GamesaCIR.Filters;
using System.Text;
using GamesaCIR.App_Code;
using CIR.DomainModel;
using GamesaCIR.Filters;
using CIR.DataAccess;
using GamesaCIR.Helper;

namespace GamesaCIR.Controllers
{
    public class BlogController : Controller
    {

        #region Global Variables

        MainClass oMainClass = new MainClass();

        clsProLib pl = new clsProLib();
        #endregion

        #region Global Methods

        public BlogController()
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

        #region Blog Region

        public ActionResult Index()
        {
            ViewBag.Name = pl.LoginUserName;
            return View();
        }

        #endregion

    }
}