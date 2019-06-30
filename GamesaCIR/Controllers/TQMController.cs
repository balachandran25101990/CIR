using CIR.DataAccess;
using CIR.DomainModel;
using GamesaCIR.App_Code;
using GamesaCIR.Helper;
using GamesaCIR.Filters;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GamesaCIR.Controllers
{
    public class TQMController : Controller
    {

        #region Global Variables

        MainClass oMainClass = new MainClass();
        ChatManager oChatManager = new ChatManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ChatController));
        clsProLib pl = new clsProLib();
        TQMManager oTQMManager = new TQMManager();

        #endregion

        #region Action

        public TQMController()
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

        // GET: TQM
        public ActionResult Kaizen()
        {
            return View();
        }

        public ActionResult Suggestion()
        {
            return View();
        }

        [CheckRoleAccess]
        public ActionResult QITProject()
        {
            return View();
        }

        [CheckRoleAccess]
        public ActionResult TQMReliabilityReport()
        {
            return View();
        }

        [CheckRoleAccess]
        public ActionResult SCMReport()
        {
            return View();
        }

        #region QIT Project Methods

        public ActionResult FileUploadQITProject()
        {
            Session["File"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["File"] = hpfBase;
            }
            return View();
        }

        public JsonResult SetQITProject(string categoryId, string refId, string title, string tagTitle, string delFlag)
        {
            Message result = new Message();
            try
            {
                string strFilePath = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                HttpPostedFileBase uploadedFile = Session["File"] as HttpPostedFileBase;
                string uploaderUrl = "";
                if (Session["File"] != null)
                {
                    string strExtension = uploadedFile.FileName.Split('.')[uploadedFile.FileName.Split('.').Length - 1];
                    var stream = uploadedFile.InputStream;
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png" || strExtension.ToLower() == "doc" || strExtension.ToLower() == "docx" || strExtension.ToLower() == "ppt" || strExtension.ToLower ()=="pptx")
                    {
                        if (Directory.Exists(strFilePath + "QIT Project/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "QIT Project/", uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "QIT Project/");
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "QIT Project/", uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oTQMManager.SetQITProject("0", categoryId, uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                        Session.Remove("File");
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf/ doc/ ppt files only.",
                            Clear = "False"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetQITProject(string categoryId, string refId, string viewType)
        {
            List<QITPrjoect> result = oTQMManager.GetQITProject(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf") //1-pdf 2-doc 3-ppt 0-img
                        item.IsImage = "1";
                    else if (strFileExtension.ToLower() == "doc" || strFileExtension.ToLower() == "docx")
                        item.IsImage = "2";
                    else if (strFileExtension.ToLower() == "ppt" || strFileExtension.ToLower() == "pptx")
                        item.IsImage = "3";
                    else
                        item.IsImage = "0";
                    item.Filname = strPathUrl + "QIT Project/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteQITProject(string delFlag, string QITProjectId)
        {
            Message result = oTQMManager.SetQITProject(QITProjectId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region TQM Reliability report Methods

        public ActionResult FileUploadTQMReliabilityreport()
        {
            Session["File"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["File"] = hpfBase;
            }
            return View();
        }

        public JsonResult SetTQMReliabilityReport(string categoryId, string refId, string title, string tagTitle, string delFlag)
        {
            Message result = new Message();
            try
            {
                string strFilePath = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                HttpPostedFileBase uploadedFile = Session["File"] as HttpPostedFileBase;
                string uploaderUrl = "";
                if (Session["File"] != null)
                {
                    string strExtension = uploadedFile.FileName.Split('.')[uploadedFile.FileName.Split('.').Length - 1];
                    var stream = uploadedFile.InputStream;
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png" || strExtension.ToLower() == "doc" || strExtension.ToLower() == "docx" || strExtension.ToLower() == "ppt" || strExtension.ToLower() == "pptx")
                    {
                        if (Directory.Exists(strFilePath + "TQM Reliability Report/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "TQM Reliability Report/", uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "TQM Reliability Report/");
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "TQM Reliability Report/", uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oTQMManager.SetTQMReliabilityReport("0", categoryId, uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                        Session.Remove("File");
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf/ doc/ ppt files only.",
                            Clear = "False"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTQMReliabilityReport(string categoryId, string refId, string viewType)
        {
            List<TQMReliabilityReport > result = oTQMManager.GetTQMReliabilityReport(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf") //1-pdf 2-doc 3-ppt 0-img
                        item.IsImage = "1";
                    else if (strFileExtension.ToLower() == "doc" || strFileExtension.ToLower() == "docx")
                        item.IsImage = "2";
                    else if (strFileExtension.ToLower() == "ppt" || strFileExtension.ToLower() == "pptx")
                        item.IsImage = "3";
                    else
                        item.IsImage = "0";
                    item.Filname = strPathUrl + "TQM Reliability Report/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteTQMReliabilityReport(string delFlag, string TQMReliabilityrptId)
        {
            Message result = oTQMManager.SetTQMReliabilityReport (TQMReliabilityrptId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region SCM report Methods

        public ActionResult FileUploadSCMreport()
        {
            Session["FileSCM"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["FileSCM"] = hpfBase;
            }
            return View();
        }

        public JsonResult SetSCMReport(string categoryId, string refId, string title, string tagTitle, string delFlag)
        {
            Message result = new Message();
            try
            {
                string strFilePath = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                HttpPostedFileBase uploadedFile = Session["FileSCM"] as HttpPostedFileBase;
                string uploaderUrl = "";
                if (Session["FileSCM"] != null)
                {
                    string strExtension = uploadedFile.FileName.Split('.')[uploadedFile.FileName.Split('.').Length - 1];
                    var stream = uploadedFile.InputStream;
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png" || strExtension.ToLower() == "doc" || strExtension.ToLower() == "docx" || strExtension.ToLower() == "ppt" || strExtension.ToLower() == "pptx")
                    {
                        if (Directory.Exists(strFilePath + "SCM Report/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "SCM Report/", uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "SCM Report/");
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "SCM Report/", uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oTQMManager.SetSCMReport("0", categoryId, uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                        Session.Remove("FileSCM");
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf/ doc/ ppt files only.",
                            Clear = "False"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSCMReport(string categoryId, string refId, string viewType)
        {
            List<SCMReport > result = oTQMManager.GetSCMReport(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf") //1-pdf 2-doc 3-ppt 0-img
                        item.IsImage = "1";
                    else if (strFileExtension.ToLower() == "doc" || strFileExtension.ToLower() == "docx")
                        item.IsImage = "2";
                    else if (strFileExtension.ToLower() == "ppt" || strFileExtension.ToLower() == "pptx")
                        item.IsImage = "3";
                    else
                        item.IsImage = "0";
                    item.Filname = strPathUrl + "SCM Report/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteSCMReport(string delFlag, string SCMRptId)
        {
            Message result = oTQMManager.SetSCMReport (SCMRptId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}