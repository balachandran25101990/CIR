using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using GamesaCIR.App_Code;
using CIR.DomainModel;
using GamesaCIR.Filters;
using CIR.DataAccess;
using GamesaCIR.Helper;
using System.Web.Mvc;
using System.IO;


namespace GamesaCIR.Controllers
{
    public class ChatController :Controller
    {

        #region Global Variables

        MainClass oMainClass = new MainClass();
        ChatManager oChatManager = new ChatManager();
        MainClass mc = new MainClass();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ChatController));
        clsProLib pl = new clsProLib();

        #endregion

        #region Global Methods

        public ChatController()
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

        #region Chat 


        public ActionResult Index()
        {
            ViewBag.Id = pl.UId;
            ViewBag.Name = pl.LoginUserName;
            ViewBag.Site = pl.Sites;
            ViewBag.State = pl.States;
            string strbaseUrl = ConfigurationManager.AppSettings["baseUrl"].ToString();
            if (pl.EmpImage == "" || pl.EmpImage == "0")
            {
                //   ViewBag.Title = "/cir/Content/img/default-profile.png";
                ViewBag.Title = strbaseUrl + "/Content/img/default-profile.png";
            }
            else
            {
                string strFilePath = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                strFilePath = strFilePath + "Employee Profile Picture/" + pl.EmpImage;
                ViewBag.Title = strFilePath;
            }

            ViewBag.ServerTime = pl.ServerTime;
            if (pl.DesgName == "0" || pl.DesgName == "") { ViewBag.DesgName = ""; }
            else ViewBag.DesgName = pl.DesgName;


            return View();
        }
        //public ActionResult Index()
        //{
        //    ViewBag.Id = pl.UId;
        //    ViewBag.Name = pl.LoginUserName;
        //    ViewBag.Tag = pl.Sites;
        //    return View();
        //}
        public ActionResult Index1()
        {
            ViewBag.Id = pl.UId;
            ViewBag.Name = pl.LoginUserName;
            return View();
        }

        public JsonResult SetChat(ChatModel chatmodel)
        {
            //cirModel.DateOfFailure = ConvertDate(cirModel.DateOfFailure);
            //cirModel.CIRId = cirModel.CIRId == null ? "0" : cirModel.CIRId;
            //cirModel.WTGStartTime = ConvertDateTime(cirModel.WTGStartTime);
            //cirModel.WTGStopTime = ConvertDateTime(cirModel.WTGStopTime);
            //cirModel.EmpId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID;
            ChatResult result = oChatManager.SaveChat(chatmodel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);

        }

        public JsonResult Getchat(string toId, string view)
        {
            List<ChatModel> result = oChatManager.GetChat(toId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID, view);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FileUploadprofile()
        {
            Message result = new Message();
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["File"] = hpfBase;
                result = EmpImageUpload("Available");
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
        public Message EmpImageUpload(string status)
        {
            Message result = new Message();
            try
            {
                string strFilePath = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                HttpPostedFileBase uploadedFile = Session["File"] as HttpPostedFileBase;
                string uploaderUrl = "";
                if (uploadedFile != null)
                {
                    string strExtension = uploadedFile.FileName.Split('.')[uploadedFile.FileName.Split('.').Length - 1];
                    var stream = uploadedFile.InputStream;
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
                    {
                        if (Directory.Exists(strFilePath + "Employee Profile Picture/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Employee Profile Picture/", pl.UId + ".jpg");

                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                            pl.EmpImage = pl.UId + ".jpg";
                        }
                        else
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Employee Profile Picture/");
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Employee Profile Picture/", pl.UId + ".jpg");
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                            pl.EmpImage = pl.UId + ".jpg";
                        }
                        result = oChatManager.EmpImageUpload(pl.UId + ".jpg", status, pl.UId);
                        string strFilePath2 = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                        strFilePath2 = strFilePath2 + "Employee Profile Picture/" + pl.UId + ".jpg";
                        ViewBag.Title = strFilePath2;
                        stream.Flush();
                        stream.Close();
                        Session.Remove("File");
                    }
                    else
                    {
                        return result = new Message()
                        {
                            Msg = "Please upload only the  files only.",
                            Clear = "False"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            //result = new Message()
            //{
            //    Msg = "Error in upload",
            //    Clear = "False"
            //};
            return result;
        }

        public JsonResult GetUser(string SearchId, string view)
        {
            List<ChatModel> result;
            result = oChatManager.GetUser(view, SearchId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}