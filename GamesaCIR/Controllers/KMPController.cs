using CIR.DataAccess;
using CIR.DomainModel;
using GamesaCIR.App_Code;
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
    public class KMPController : Controller
    {

        #region Global Variables

        MainClass oMainClass = new MainClass();
        KMPManager oKMPManager = new KMPManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(KMPController));

        #endregion

        #region Global Methods

        public KMPController()
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

        //#region AlarmFAQ

        //#region Actions

        //[CheckRoleAccess]
        //public ActionResult AlarmFAQ()
        //{
        //    return View();
        //}

        //#endregion

        //#region Methods

        //public void FileUploadAlarmFAQ()
        //{
        //    try
        //    {
        //        Session["File"] = null;
        //        foreach (string file in Request.Files)
        //        {
        //            HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
        //            if (hpfBase.FileName != "")
        //            {
        //                Session["File"] = hpfBase;
        //            }
        //        }
        //    }
        //    catch (Exception) { }
        //}

        //public JsonResult SetAlarmFAQ(string categoryId, string refId, string title, string tagTitle, string delFlag)
        //{
        //    Message result = new Message();
        //    try
        //    {
        //        string strFilePath = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
        //        HttpPostedFileBase uploadedFile = Session["File"] as HttpPostedFileBase;
        //        string uploaderUrl = "";
        //        if (Session["File"] != null)
        //        {
        //            string strExtension = uploadedFile.FileName.Split('.')[uploadedFile.FileName.Split('.').Length - 1];
        //            var stream = uploadedFile.InputStream;
        //            if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
        //            {
        //                if (Directory.Exists(strFilePath + "Alarm FAQ/"))
        //                {
        //                    uploaderUrl = string.Format("{0}{1}", strFilePath + "Alarm FAQ/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
        //                    using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
        //                    {
        //                        stream.CopyTo(fileStream);
        //                    }
        //                }
        //                else
        //                {
        //                    DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Alarm FAQ/");
        //                    uploaderUrl = string.Format("{0}{1}", strFilePath + "Alarm FAQ/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
        //                    using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
        //                    {
        //                        stream.CopyTo(fileStream);
        //                    }
        //                }
        //                result = oKMPManager.SetAlarmFAQ("0", categoryId, uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
        //                stream.Flush();
        //                stream.Close();
        //            }
        //            else
        //            {
        //                result = new Message()
        //                {
        //                    Msg = "Please upload only the image/ pdf files only.",
        //                    Clear = "False"
        //                };
        //            }
        //        }
        //        else
        //        {
        //            result = new Message()
        //            {
        //                Msg = "Your transaction is failed",
        //                Clear = "False"
        //            };

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.Error(ex.Message);
        //    }
        //    return Json(new { result }, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult GetAlarmFAQ(string categoryId, string refId, string viewType)
        //{
        //    List<AlarmDetailsNew> result = oKMPManager.GetAlarmFAQ(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
        //    string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
        //    foreach (var item in result)
        //    {
        //        if (item.Filname != null)
        //        {
        //            string[] strExtension = item.Filname.Split('.');
        //            string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
        //            if (strFileExtension.ToLower() == "pdf")
        //                item.IsImage = false;
        //            else
        //                item.IsImage = true;
        //            item.Filname = strPathUrl + "Alarm FAQ/" + item.Filname;
        //        }
        //    }
        //    return Json(new { result }, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult DeleteAlarmFAQ(string delFlag, string AlarmFAQId)
        //{
        //    Message result = oKMPManager.SetAlarmFAQ(AlarmFAQId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
        //    return Json(new { result }, JsonRequestBehavior.AllowGet);
        //}

        //#endregion

        //#endregion

        #region AlarmFAQ

        #region Actions

        [CheckRoleAccess]
        public ActionResult AlarmFAQ()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetAlarmDescriptionDetails(string alarmCode)
        {
            AlarmFAQModel result = oKMPManager.GetAlarmDetails(alarmCode, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Change Note

        #region Actions

        [CheckRoleAccess]
        public ActionResult ChangeNote()
        {
            return View();
        }

        #endregion

        #region Methods

        public void FileUploadChangeNote()
        {
            try
            {
                Session["File"] = null;
                foreach (string file in Request.Files)
                {
                    HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                    if (hpfBase.FileName != "")
                    {
                        Session["File"] = hpfBase;
                    }
                }
            }
            catch (Exception) { }
        }

        public JsonResult SetChangeNote(string categoryId, string refId, string title, string tagTitle, string delFlag)
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
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
                    {
                        if (Directory.Exists(strFilePath + "Change Note/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Change Note/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Change Note/");
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Change Note/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oKMPManager.SetChangeNote("0", categoryId, uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf files only.",
                            Clear = "False"
                        };
                    }
                }
                else
                {
                    result = new Message()
                    {
                        Msg = "Your transaction is failed",
                        Clear = "False"
                    };

                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetChangeNote(string categoryId, string refId, string viewType)
        {
            List<ChangeNote> result = oKMPManager.GetChangeNote(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf")
                        item.IsImage = false;
                    else
                        item.IsImage = true;
                    item.Filname = strPathUrl + "Change Note/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteChangeNote(string delFlag, string ChangeNoteId)
        {
            Message result = oKMPManager.SetChangeNote(ChangeNoteId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Customer Info Document

        #region Actions

        [CheckRoleAccess]
        public ActionResult CustomerInfoDocument()
        {
            return View();
        }

        #endregion

        #region Methods

        public void FileUpload()
        {
            try
            {
                Session["File"] = null;
                foreach (string file in Request.Files)
                {
                    HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                    if (hpfBase.FileName != "")
                    {
                        Session["File"] = hpfBase;
                    }
                }
            }
            catch (Exception) { }
        }

        public JsonResult SetCustomerInfo(string categoryId, string refId, string title, string tagTitle, string delFlag)
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
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
                    {
                        if (Directory.Exists(strFilePath + "Customer Information Document/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Customer Information Document/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {

                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Customer Information Document/");

                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Customer Information Document/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oKMPManager.SetCustomerInfo("0", categoryId, uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf files only.",
                            Clear = "False"
                        };
                    }
                }
                else
                {
                    result = new Message()
                    {
                        Msg = "Your transaction is failed",
                        Clear = "False"
                    };

                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerInfo(string categoryId, string refId, string viewType)
        {
            List<CustomerInfo> result = oKMPManager.GetCustomerInfo(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf")
                        item.IsImage = false;
                    else
                        item.IsImage = true;
                    item.Filname = strPathUrl + "Customer Information Document/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCustomerInfo(string delFlag, string FieldAlertDocumentId)
        {
            Message result = oKMPManager.SetCustomerInfo(FieldAlertDocumentId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Field Alert Document

        #region Actions

        [CheckRoleAccess]
        public ActionResult FieldAlertDocument()
        {
            return View();
        }

        #endregion

        #region Methods

        public void FileUploadFieldAlertDocument()
        {
            try
            {
                Session["File"] = null;
                foreach (string file in Request.Files)
                {
                    HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                    if (hpfBase.FileName != "")
                    {
                        Session["File"] = hpfBase;
                    }
                }
            }
            catch (Exception) { }
        }

        public JsonResult SetFieldAlertDocument(string categoryId, string refId, string title, string tagTitle, string delFlag)
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
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
                    {
                        if (Directory.Exists(strFilePath + "Field Alert Document/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Field Alert Document/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {
                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Field Alert Document/");
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Field Alert Document/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oKMPManager.SetFieldAlertDocument("0", categoryId, uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf files only.",
                            Clear = "False"
                        };
                    }
                }
                else
                {
                    result = new Message()
                    {
                        Msg = "Your transaction is failed",
                        Clear = "False"
                    };
                  
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFieldAlertDocument(string categoryId, string refId, string viewType)
        {
            List<FieldAlertDocument> result = oKMPManager.GetFieldAlertDocument(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf")
                        item.IsImage = false;
                    else
                        item.IsImage = true;
                    item.Filname = strPathUrl + "Field Alert Document/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteFieldAlertDocument(string delFlag, string FieldAlertDocumentId)
        {
            Message result = oKMPManager.SetFieldAlertDocument(FieldAlertDocumentId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Safety Alert

        #region Actions

        [CheckRoleAccess]
        public ActionResult SafetyAlert()
        {
            return View();
        }

        #endregion

        #region Methods

        public void FileUploadSafetyAlert()
        {
            try
            {
                Session["File"] = null;
                foreach (string file in Request.Files)
                {
                    HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                    if (hpfBase.FileName != "")
                    {
                        Session["File"] = hpfBase;
                    }
                }
            }
            catch (Exception) { }
        }

        public JsonResult SetSafetyAlert(string categoryId, string refId, string title, string tagTitle, string delFlag)
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
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
                    {
                        if (Directory.Exists(strFilePath + "Safety Alert/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Safety Alert/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {

                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Safety Alert/");

                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Safety Alert/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oKMPManager.SetSafetyAlert("0", categoryId, uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf files only.",
                            Clear = "False"
                        };
                    }
                }
                else
                {
                    result = new Message()
                    {
                        Msg = "Your transaction is failed",
                        Clear = "False"
                    };
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSafetyAlert(string categoryId, string refId, string viewType)
        {
            List<SafetyAlert> result = oKMPManager.GetSafetyAlert(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf")
                        item.IsImage = false;
                    else
                        item.IsImage = true;
                    item.Filname = strPathUrl + "Safety Alert/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteSafetyAlert(string delFlag, string FieldAlertDocumentId)
        {
            Message result = oKMPManager.SetSafetyAlert(FieldAlertDocumentId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Service Bullet In

        #region Actions

        [CheckRoleAccess]
        public ActionResult ServiceBulletIn()
        {
            return View();
        }

        #endregion

        #region Methods

        public void FileUploadServiceBulletIn()
        {
            try
            {
                Session["File"] = null;
                foreach (string file in Request.Files)
                {
                    HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                    if (hpfBase.FileName != "")
                    {
                        Session["File"] = hpfBase;
                    }
                }
            }
            catch (Exception) { }
        }

        public JsonResult SetServiceBulletIn(string categoryId, string refId, string title, string tagTitle, string delFlag)
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
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
                    {
                        if (Directory.Exists(strFilePath + "Service Bullet in/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Service Bullet in/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {

                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Service Bullet in/");

                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Service Bullet in/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oKMPManager.SetServiceBulletIn("0", categoryId, uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf files only.",
                            Clear = "False"
                        };
                    }
                }
                else
                {
                    result = new Message()
                    {
                        Msg = "Your transaction is failed",
                        Clear = "False"
                    };

                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetServiceBulletIn(string categoryId, string refId, string viewType)
        {
            List<ServiceBulletIn> result = oKMPManager.GetServiceBulletIn(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf")
                        item.IsImage = false;
                    else
                        item.IsImage = true;
                    item.Filname = strPathUrl + "Service Bullet in/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteBulletIn(string delFlag, string FieldAlertDocumentId)
        {
            Message result = oKMPManager.SetServiceBulletIn(FieldAlertDocumentId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region WTG Hardware and Software

        #region Actions

        [CheckRoleAccess]
        public ActionResult WTGHWSW()
        {
            return View();
        }

        #endregion

        #region Methods

        public void FileUploadWTGHWSW()
        {
            try
            {
                Session["File"] = null;
                foreach (string file in Request.Files)
                {
                    HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                    if (hpfBase.FileName != "")
                    {
                        Session["File"] = hpfBase;
                    }
                }
            }
            catch (Exception) { }
        }

        public JsonResult SetWTGSoftwareHardware(string categoryId, string refId, string title, string tagTitle, string delFlag)
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
                    if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "svg" || strExtension.ToLower() == "gif" || strExtension.ToLower() == "pdf" || strExtension.ToLower() == "png")
                    {
                        if (Directory.Exists(strFilePath + "Software Hardware Download/"))
                        {
                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Software Hardware Download/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        else
                        {

                            DirectoryInfo di = Directory.CreateDirectory(strFilePath + "Software Hardware Download/");

                            uploaderUrl = string.Format("{0}{1}", strFilePath + "Software Hardware Download/", uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName);
                            using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                            {
                                stream.CopyTo(fileStream);
                            }
                        }
                        result = oKMPManager.SetWTGSoftwareHardware("0", categoryId, uploadedFile.FileName.Contains("&") ? uploadedFile.FileName.Replace("&", "_") : uploadedFile.FileName, refId, title, tagTitle, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        stream.Flush();
                        stream.Close();
                    }
                    else
                    {
                        result = new Message()
                        {
                            Msg = "Please upload only the image/ pdf files only.",
                            Clear = "False"
                        };
                    }
                }
                else
                {
                    result = new Message()
                    {
                        Msg = "Your transaction is failed",
                        Clear = "False"
                    };

                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWTGSoftwareHardware(string categoryId, string refId, string viewType)
        {
            List<WTGSoftwareHardware> result = oKMPManager.GetWTGSoftwareHardware(categoryId, refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            string strPathUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            foreach (var item in result)
            {
                if (item.Filname != null)
                {
                    string[] strExtension = item.Filname.Split('.');
                    string strFileExtension = item.Filname.Split('.')[strExtension.Length - 1];
                    if (strFileExtension.ToLower() == "pdf")
                        item.IsImage = false;
                    else
                        item.IsImage = true;
                    item.Filname = strPathUrl + "Software Hardware Download/" + item.Filname;
                }
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteWTGSoftwareHardware(string delFlag, string FieldAlertDocumentId)
        {
            Message result = oKMPManager.SetWTGSoftwareHardware(FieldAlertDocumentId, "0", "", "0", "", "", delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region IEC Standards 

        #region Actions

        [CheckRoleAccess]
        public ActionResult IECStandard()
        {
            return View();
        }

        #endregion

        #endregion

        #region Customer Chat

        #region Actions

        [CheckRoleAccess]
        public ActionResult CustomerChat()
        {
            return View();
        }

        #endregion

        #endregion

        #region Customer Suggestion

        #region Actions

        [CheckRoleAccess]
        public ActionResult CustomerSuggestion()
        {
            return View();
        }

        #endregion

        #endregion

        #region Field Engineerin chat

        [CheckRoleAccess]
        public ActionResult FieldEngineeringChat()
        {
            return View();
        }

        #endregion

    }
}