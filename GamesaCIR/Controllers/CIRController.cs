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

namespace GamesaCIR.Controllers
{
    public class CIRController : Controller
    {

        #region Global Variables

        MainClass oMainClass = new MainClass();
        MasterManager oMasterManager = new MasterManager();
        CIRManager oCIRManager = new CIRManager();
        AdminManager oAdminManager = new AdminManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CIRController));

        #endregion

        #region Global Methods

        public CIRController()
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

        public JsonResult GetAccess()
        {
            var result = CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId;
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public string ConvertDateTime(string dateTime)
        {
            if (dateTime != null && dateTime.Trim() != string.Empty)
            {
                try
                {
                    string strDate = dateTime.Split(' ')[0];
                    string strTime = dateTime.Split(' ')[1];
                    return strDate.Split('/')[2] + "-" + strDate.Split('/')[1] + "-" + strDate.Split('/')[0] + " " + strTime;
                }
                catch
                {
                    return "";
                }
            }
            else
                return "";

        }

        public string ConvertDate(string date)
        {
            if (date != null && date.Trim() != string.Empty)
            {
                try
                {
                    return date.Split('/')[2] + "-" + date.Split('/')[1] + "-" + date.Split('/')[0];
                }
                catch
                {
                    return "";
                }
            }
            else return "";
        }

        #endregion

        #region CIR 

        [CheckRoleAccess]
        public ActionResult Index()
        {
            if (Session["CIRId"] != null)
            {
                ViewBag.CIRId = Session["CIRId"];
                ViewBag.IsMyPending = Session["IsMyPending"];
                Session.Remove("CIRId");
                Session.Remove("IsMyPending");
            }
            else
            {
                ViewBag.CIRId = "0";
                ViewBag.IsMyPending = "0";
            }
            return View();
        }

        public JsonResult GetSearchDetails(string txt, string refId, string viewType)
        {
            List<CIRAutoComplete> lstCIRAutoComplete = oCIRManager.GetAutoCompleteDetails(txt, refId == "" ? "0" : refId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(lstCIRAutoComplete, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCIRDetails(string cirId)
        {
            CIRModelResult result = oCIRManager.GetCIRDetails(cirId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                if (result.CIRDetail != null)
                {
                    if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "5")
                    {
                        result.CIRDetail.Employee = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee;
                        result.CIRDetail.EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                    }
                    result.CIRDetail.DsgId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId;
                    result.CIRDetail.FEMobileNo = CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpMobile;
                    Session["CIRNumberPhotoId"] = result.CIRDetail.CIRId;
                    Session["CIRNumberPhotoNumber"] = result.CIRDetail.CIRNumber;
                }
                if (result.CIRFileDetail != null)
                {
                    if (result.CIRFileDetail.Count > 0)
                    {
                        string strGamesaImagesUrl = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                        foreach (var item in result.CIRFileDetail)
                        {
                            if (Convert.ToBoolean(item.IsImage))
                            {
                                item.CIRNumber = result.CIRDetail.CIRNumber;
                                item.FileName = item.CFileName;
                                item.CFileName = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                                item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.FileName;

                            }
                            else
                            {
                                item.FileName = item.CFileName;
                                item.CIRNumber = result.CIRDetail.CIRNumber;
                                item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTurbine(TurbineModel turbine)
        {
            TurbineDetails lstTurbineDetails = oMasterManager.GetTurbine(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            CIRDetails result = new CIRDetails();
            result.TurbineDetails = lstTurbineDetails.TurbineDetail.ToList().FirstOrDefault();
            if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "5")
            {
                result.TurbineDetails.Employee = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                result.TurbineDetails.EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
            }
            result.TurbineDetails.FEMobileNo = CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpMobile;
            result.CIRNumber = oCIRManager.GetUniqueNumberGeneration(turbine.TurbineId, turbine.formType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveCIR(CIRModel cirModel)
        {
            cirModel.DateOfFailure = ConvertDate(cirModel.DateOfFailure);
            cirModel.CIRId = cirModel.CIRId == null ? "0" : cirModel.CIRId;
            cirModel.WTGStartTime = ConvertDateTime(cirModel.WTGStartTime);
            cirModel.WTGStopTime = ConvertDateTime(cirModel.WTGStopTime);
            cirModel.EmpId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID;
            CIRResult result = oCIRManager.SaveCIRDetails(cirModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);

        }

        #endregion

        #region CIR Problem

        public JsonResult SaveCIRProblem(CIRProblem cirProblem)
        {
            var result = oCIRManager.SaveCIRProblem(cirProblem, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region CIR Action

        public JsonResult SaveCIRAction(CIRAction cirAction)
        {
            var result = oCIRManager.SaveCIRAction(cirAction, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);

        }

        #endregion

        #region Consequential problem

        public JsonResult SaveCIRConsequence(CIRConsequence cirConsequence)
        {
            var result = oCIRManager.SaveConsequence(cirConsequence, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region 5W2H

        public JsonResult Save5W2H(CIR5W2H cir5w2h)
        {
            var result = oCIRManager.SaveCIR5W2H(cir5w2h, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Image Upload and Files

        public ActionResult ImageUploadForCIR()
        {
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["ImageOrDocumentForCIR"] = hpfBase;
            }
            return View();
        }

        public ActionResult FileUpload()
        {
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["File"] = hpfBase;
            }
            return View();
        }

        public JsonResult SaveFilesOnly(string cirId, string description, string cirNumber)
        {
            CIRFilesResult result = new CIRFilesResult();
            try
            {
                string strFileName = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                bool bIsImage = false;

                HttpPostedFileBase uploadedFile = Session["File"] as HttpPostedFileBase;
                string uploaderUrl = "";

                if (uploadedFile != null)
                {
                    if (uploadedFile.ContentLength < 5242880)
                    {
                        string strExtension = uploadedFile.FileName.Split('.')[uploadedFile.FileName.Split('.').Length - 1];
                        bIsImage = false;
                        var stream = uploadedFile.InputStream;
                        string strFilePath = ConfigurationManager.AppSettings["FileExtractSource"].ToString();
                        long sizeOfFilePath = GetDirectorySize(strFilePath + "\\" + cirNumber);
                        if (sizeOfFilePath < 20971520)
                        {
                            result = oCIRManager.SaveCIRFiles(cirId, uploadedFile.FileName, description, bIsImage, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                            if (Directory.Exists(strFileName + "" + cirNumber))
                            {
                                uploaderUrl = string.Format("{0}{1}", strFileName + "" + cirNumber + "/", uploadedFile.FileName);
                                using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                                {
                                    stream.CopyTo(fileStream);

                                }
                            }
                            else
                            {

                                DirectoryInfo di = Directory.CreateDirectory(strFileName + "" + cirNumber);

                                uploaderUrl = string.Format("{0}{1}", strFileName + "" + cirNumber + "/", uploadedFile.FileName);
                                using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                                {

                                    stream.CopyTo(fileStream);
                                }
                            }
                        }
                        else
                        {
                            result.MessageInfo = new Message()
                            {
                                Clear = "False",
                                Msg = "Maximum File size for the CIR is 20 MB. Please delete something and add again."
                            };
                        }

                        stream.Flush();
                        stream.Close();
                        Session.Remove("File");
                    }
                    else
                    {
                        result.MessageInfo = new Message()
                        {
                            Clear = "False",
                            Msg = "Maximum File size for a image/File is 5 MB. Please use some other images."
                        };
                    }
                    // System.IO.File.Move(uploaderUrl, uploaderUrl.Replace(uploaderUrl.Split('/')[uploaderUrl.Split('/').Length - 1], "") + result.CIRFiles.CFId + "_" + uploaderUrl.Split('/')[uploaderUrl.Split('/').Length - 1]);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveFiles(string cirId, string description, string cirNumber)
        {
            CIRFilesResult result = new CIRFilesResult();
            try
            {
                string strFileName = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                bool bIsImage = false;

                HttpPostedFileBase uploadedFile = Session["ImageOrDocumentForCIR"] as HttpPostedFileBase;
                string uploaderUrl = "";

                if (uploadedFile != null)
                {
                    if (uploadedFile.ContentLength < 5242880)
                    {
                        string strExtension = uploadedFile.FileName.Split('.')[uploadedFile.FileName.Split('.').Length - 1];
                        if (strExtension == "jpg" || strExtension == "jpeg" || strExtension == "png" || strExtension == "gif")
                            bIsImage = true;
                        if (strExtension.ToLower() == "jpg" || strExtension.ToLower() == "jpeg" || strExtension.ToLower() == "png" || strExtension.ToLower() == "gif")
                        {
                            var stream = uploadedFile.InputStream;
                            string strFilePath = ConfigurationManager.AppSettings["FileExtractSource"].ToString();
                            long sizeOfFilePath = GetDirectorySize(strFilePath + "\\" + cirNumber);
                            if (sizeOfFilePath < 20971520) // 20MB
                            {
                                result = oCIRManager.SaveCIRFiles(cirId, uploadedFile.FileName, description, bIsImage, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                                if (Directory.Exists(strFileName + "" + cirNumber))
                                {

                                    uploaderUrl = string.Format("{0}{1}", strFileName + "" + cirNumber + "/", uploadedFile.FileName);
                                    using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                                    {
                                        stream.CopyTo(fileStream);

                                    }
                                }
                                else
                                {
                                    DirectoryInfo di = Directory.CreateDirectory(strFileName + "" + cirNumber);
                                    uploaderUrl = string.Format("{0}{1}", strFileName + "" + cirNumber + "/", uploadedFile.FileName);
                                    using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                                    {

                                        stream.CopyTo(fileStream);
                                    }
                                }
                            }
                            else
                            {
                                result.MessageInfo = new Message()
                                {
                                    Clear = "False",
                                    Msg = "Maximum File size for the CIR is 20 MB. Please delete something and add again."
                                };
                            }
                            stream.Flush();
                            stream.Close();


                        }
                        else
                        {
                            result.MessageInfo = new Message()
                            {
                                Clear = "False",
                                Msg = "Ensure the valid image file for uploading."
                            };
                        }
                        Session.Remove("ImageOrDocument");
                    }
                    else
                    {
                        result.MessageInfo = new Message()
                        {
                            Clear = "False",
                            Msg = "Maximum File size for a image/File is 5 MB. Please use some other images."
                        };
                    }
                    // System.IO.File.Move(uploaderUrl, uploaderUrl.Replace(uploaderUrl.Split('/')[uploaderUrl.Split('/').Length - 1], "") + result.CIRFiles.CFId + "_" + uploaderUrl.Split('/')[uploaderUrl.Split('/').Length - 1]);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        private long GetDirectorySize(string filePath)
        {
            long size = 0;
            try
            {
                string[] lstFiles = Directory.GetFiles(filePath, "*.*");
                foreach (string name in lstFiles)
                {
                    // 3.
                    // Use FileInfo to get length of each file.
                    FileInfo info = new FileInfo(name);
                    size += info.Length;

                }
                return size;
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return 0;
            }

        }

        public JsonResult DeleteFiles(string cirId, string CFId, string fileName, string CIRNumber)
        {
            var result = oCIRManager.DeleteFile(cirId, CFId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                if (result.Clear == "True")
                {
                    string strDeletePath = System.Configuration.ConfigurationManager.AppSettings["FileExtractSource"].ToString();
                    if (System.IO.File.Exists(strDeletePath + "\\" + CIRNumber + "\\" + fileName))
                    {
                        System.IO.File.Delete(strDeletePath + "\\" + CIRNumber + "\\" + fileName);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Comments

        public JsonResult SaveCIRComments(string cirId, string crId, string comments, string assignedTo, string toDpt, string cStatus, string convertToNCR, string delFlag)
        {
            convertToNCR = convertToNCR == "True" ? "1" : "0";
            var result = oCIRManager.SaveCIRComments(cirId, crId, comments, assignedTo, toDpt, cStatus, convertToNCR, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            if (result.Clear == "True")
            {
                SendMail(cirId);

            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Mail Send

        public void SendMail(string cirId)
        {
            //Reading sender Email credential from web.config file
            try
            {
                string strHostAddress = ConfigurationManager.AppSettings["Host"].ToString();
                string strFromMailId = ConfigurationManager.AppSettings["FromMail"].ToString();
                string strPassword = ConfigurationManager.AppSettings["Password"].ToString();
                CIRModelResult result = oCIRManager.GetCIRDetails(cirId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

                if (result.CIRDetail != null)
                {
                    result.CIRDetail.Employee = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee;
                    result.CIRDetail.EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                }
                if (result.CIRFileDetail != null)
                {
                    if (result.CIRFileDetail.Count > 0)
                    {
                        string strGamesaImagesUrl = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                        foreach (var item in result.CIRFileDetail)
                        {
                            if (Convert.ToBoolean(item.IsImage))
                                item.CFileName = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;

                        }
                    }
                }


                MailMessage msg = new MailMessage();
                msg.Subject = "Reg CIR : " + result.CIRDetail.CIRNumber;
                msg.From = new MailAddress(strFromMailId);


                TurbineModel oTurbineModel = new TurbineModel()
                {
                    Site = result.CIRDetail.TSiteID,
                    View = "1",
                    TurbineId = result.CIRDetail.TbnId,
                    Text = ""
                };

                TurbineDetails lstTurbineDetails = oMasterManager.GetTurbine(oTurbineModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                TurbineDetails oTurbineDetails = new TurbineDetails();
                if (lstTurbineDetails.TurbineDetail.Count != 0)
                {
                    oTurbineDetails = lstTurbineDetails.TurbineDetail[0];
                }





                string strTurbineData = "<table cellpadding='0' cellspacing='0' width='100%' style='border:1px #e9e9e9 solid;'>"
                                            + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                   "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Date of Failure : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.DateOfFailure + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Customer : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.CustomerName + "</span>" +
                                                "</td>" +
                                            "</tr>"
                                            + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Alarm Code : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.ACode + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Alarm Description : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.AlarmDesc + "</span>" +
                                                "</td>" +
                                            "</tr>"
                                            + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Engineer Sap Id : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.EngineerSapId + "</span>" +
                                                "</td>" +
                                                                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Site : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.SiteName + "</span>" +
                                                "</td>" +

                                            "</tr>"
                                            + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>S/W version : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.SwVersion + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>DOC : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.DOC + "</span>" +
                                                "</td>" +

                                            "</tr>"
                                            + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>F/W version : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.HwVersion + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>WTG Type : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.WTGTypeName + "</span>" +
                                                "</td>" +

                                            "</tr>"
                                            + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>WTG Status : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.WTGStatus + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Temp : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.Tempname + "</span>" +
                                                "</td>" +

                                            "</tr>"
                                            + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>WTG Stop Time : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.WTGStopTime + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Dust : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.DustName + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>WTG Run Time : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.WTGStartTime + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Corrosion : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.Corrosion + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Production : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.Production + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>THeight : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.THeight + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                        "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Run Hours : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.RunHrs + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                     "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Blade : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.BladeName + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Functional System : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.FuncSystem + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Generator : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.Generator + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                 "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                        "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Component Group : </span>" +
                                                 "</td>" +
                                                 "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                     "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.ComponentGroup + "</span>" +
                                                 "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>FOM : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.FOMName + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Part Code : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.PartCode + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                     "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Gear Box : </span>" +
                                                 "</td>" +
                                                 "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                     "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + oTurbineDetails.GearBox + "</span>" +
                                                 "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                     "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Component Make: </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.ComponentMake + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Engineer Name : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.Employee + " - " + result.CIRDetail.EngineerSapId + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                           + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Failure During: </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.FailureDuring + "</span>" +
                                                "</td>" +
                                                 "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Approval Status : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.CStatus + "</span>" +
                                                "</td>" +

                                           "</tr>"
                                          + "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Serial Number: </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.SerialNumber + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Mobile No : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.FOMMobileNo + "</span>" +
                                                "</td>" +

                                           "</tr>" +
                                           "<tr>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>WO Number: </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.WONumber + "</span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>EmailId : </span>" +
                                                "</td>" +
                                                "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.FOMEmail+ "</span>" +
                                                "</td>" +
                                            "</tr>" +
                                      "</table>";

                string strProblem = "<table cellpadding='0' cellspacing='0' width='100%' style='border:1px #e9e9e9 solid;'>" +
                                        "<tr>" +
                                            "<td style='height:35px; width:100%;'>" +
                                                "<p style='font-size:13px; margin:10px; color:#808080; text-align:left;'>" + result.CIRDetail.ProblemDesc + "</p>" +
                                            "</td>" +
                                        "</tr>"
                                    + "</table>";

                string strActionPerformed = "<table cellpadding='0' cellspacing='0' width='100%' style='border:1px #e9e9e9 solid;'>" +
                                                    "<tr>" +
                                                       "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:15%;'>" +
                                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>SNo</span>" +
                                                       "</th>" +
                                                       "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:85%;'>" +
                                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Action Performed</span>" +
                                                       "</th>" +
                                                    "</tr>" +
                                            "<tbody>";

                foreach (var item in result.CIRActionDetail)
                {
                    strActionPerformed += "<tr>" +
                                             "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:15%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.Slno + "</span>" +
                                             "</td>" +
                                             "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:15%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.ActionDesc + "</span>" +
                                             "</td>" +
                                          "</tr>";
                }

                strActionPerformed += "</tbody></table>";

                string strCondequenceProblem = "<table cellpadding='0' cellspacing='0' width='100%' style='border:1px #e9e9e9 solid;'>" +
                                                    "<tr>" +
                                                       "<td style='height:35px; width:100%;'>" +
                                                            "<p style='font-size:13px; margin:10px; color:#808080; text-align:left;'>" + result.CIRDetail.Consequence + "</p>" +
                                                        "</td>" +
                                                    "</tr>" +
                                               "</table>";

                string str5w2h = "<table cellpadding='0' cellspacing='0' width='100%' style='border:1px #e9e9e9 solid;'>" +
                                    "<tr>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>What : </span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.What + "</span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>When : </span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.When1 + "</span>" +
                                        "</td>" +
                                    "</tr>"
                                    + "<tr>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Who : </span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.Who + "</span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Where : </span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.Where1 + "</span>" +
                                        "</td>" +
                                      "</tr>"
                                    + "<tr>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Why : </span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.Why + "</span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>How To Do : </span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.HowTodo + "</span>" +
                                        "</td>" +
                                      "</tr>"
                                    + "<tr>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>How much : </span>" +
                                        "</td>" +
                                        "<td style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:30%;'>" +
                                            "<span style='font-size:13px; margin-left:10px; color:#808080;'>" + result.CIRDetail.Howmuch + "</span>" +
                                        "</td>" +
                                      "</tr>"
                                  + "</table>";



                string strComments = "<table cellpadding='0' cellspacing='0' width='100%' style='border:1px #e9e9e9 solid;'>" +
                                            "<tr>" +
                                                "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:5%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>#</span>" +
                                                "</th>" +
                                                "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:25%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Comments</span>" +
                                                "</th>" +
                                                "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:15%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>From</span>" +
                                                "</th>" +
                                                "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Assigned To</span>" +
                                                "</th>" +
                                                 "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:15%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Assigned Date</span>" +
                                                "</th>" +
                                                "<th align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                    "<span style='font-size:13px; margin-left:10px; color:#ff6a00;'>Comments On</span>" +
                                                "</th>" +
                                            "</tr>" +
                                         "</thead>";

                int iCommentsCount = result.CIRComments.Count;
                foreach (var item in result.CIRComments)
                {
                    if (iCommentsCount != Convert.ToInt32(item.Slno))
                    {
                        strComments += "<tr>" +
                                          "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:5%;'>" +
                                                "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.Slno + "</span>" +
                                          "</td>" +
                                          "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:25%;'>" +
                                                "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.Comments + "</span>" +
                                          "</td>" +
                                          "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:15%;'>" +
                                                "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.Frm + "</span>" +
                                          "</td>" +
                                          "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.AssignedTo + "</span>" +
                                          "</td>" +
                                          "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:15%;'>" +
                                                "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.AssignedDate + "</span>" +
                                          "</td>" +
                                          "<td align='left' style='border-bottom:1px solid #e9e9e9; border-right:1px #eaeced solid; height:35px; width:20%;'>" +
                                                "<span style='font-size:13px; margin-left:10px; color:#464646;'>" + item.CommentsOn + "</span>" +
                                          "</td>" +
                                       "</tr>";
                    }
                }

                strComments += "</tbody></table>";
                string strApplicationUrl = System.Configuration.ConfigurationManager.AppSettings["AppUrl"].ToString();
                string strEncryptUrl = RMaxCrypto.Crypto.Encrypt(result.CIRDetail.CIRId);
                MailModel oMailModel = oAdminManager.GetMailDetailsTosendMail("1", cirId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                msg.Body = "Dear " + oMailModel.MailFromAddress.FrmEmployee + "<br />&emsp;&emsp;&emsp;Kindly find the CIR from " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID + "<br /><br />" +
                    "<body style='background:#eaeced;'>" +
                    "<div style='max-width:772px; background:#fff; margin:auto; min-height:100px; padding:0px 18px 18px 18px;'>" +
                        "<table style='width:100%;' cellpadding='0' cellspacing='0'>" +
                            "<tr>" +
                                "<td style='height:10px;' align='right' >" +
                                    "<p style='font-size:11px; color:grey;'>Unable to see here, please <a href='" + strApplicationUrl + "/CIRMail/Index?" + strEncryptUrl + "'>click here</a> to see it in the browser </p>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td style='height:100px;'>" +
                                    "<table align='center' style='width:100%;' cellpadding='0' cellspacing='0'>" +
                                        "<tr>" +
                                            "<td style='width:50%; height:70px; border-bottom:1px #ccc dotted;'>" +
                                                 "<img src='" + strApplicationUrl + "/Content/img/logo.png' />" +
                                            "</td>" +
                                            "<td align='right' style='width:50%; height:7px;border-bottom:1px #ccc dotted;'>" +
                                                "<span style='margin:0px; font-size:13px; background:#ffd800; padding:5px 10px 5px 10px;'>CIR No: " + result.CIRDetail.CIRNumber + "</span>" +
                                            "</td>" +
                                        "</tr>" +
                                   "</table>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center' style='border-bottom:1px #ccc dotted; height:35px;'>" +
                                    "<p style='font-size:16px; margin:0px; font-weight:bold; color:#383838;'>CIR Report</p>" +
                                 "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center'>" +
                                    "<p style='font-size:15px; margin:0px; color:#383838; background:#eaeced; padding:10px; text-align:left;'>Turbine Data - " + result.CIRDetail.Turbine + "</p>" +
                                        strTurbineData +
                                 "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center'>" +
                                "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center'>" +
                                    "<br />" +
                                    "<p style='font-size:15px; margin:0px; color:#383838; background:#eaeced; padding:10px; text-align:left;'>Problem</p>" +
                                        strProblem +
                                 "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center'>" +
                                    "<br />" +
                                    "<p style='font-size:15px; margin:0px; color:#383838; background:#eaeced; padding:10px; text-align:left;'>Action Performed</p>" +
                                        strActionPerformed +
                                 "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center'>" +
                                    "<br />" +
                                    "<p style='font-size:15px; margin:0px; color:#383838; background:#eaeced; padding:10px; text-align:left;'>Consequential Problem</p>" +
                                        strCondequenceProblem +
                                 "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center'>" +
                                    "<br />" +
                                    "<p style='font-size:15px; margin:0px; color:#383838; background:#eaeced; padding:10px; text-align:left;'>5W2H</p>" +
                                        str5w2h +
                                 "</td>" +
                            "</tr>" +
                             "<tr>" +
                                "<td align='center'>" +
                                    "<br />" +
                                    "<p style='font-size:15px; margin:0px; color:#383838; background:#eaeced; padding:10px; text-align:left;'>Comments</p>" +
                                        strComments +
                                 "</td>" +
                            "</tr>" +
                        "</table>" +
                    "</div>" +
                    "</body>";

                msg.IsBodyHtml = true;

                foreach (var item in oMailModel.MailToAddress)
                {

                    if (item.OEmail != "")
                    {
                        if (Convert.ToBoolean(item.MailTo))
                        {
                            msg.To.Add(new MailAddress(item.OEmail));
                        }
                        if (Convert.ToBoolean(item.BCC))
                        {
                            msg.Bcc.Add(new MailAddress(item.OEmail));
                        }
                        if (Convert.ToBoolean(item.CC))
                        {
                            msg.CC.Add(new MailAddress(item.OEmail));
                        }
                    }
                }
                //msg.CC.Add(new MailAddress(strCCMail));
                //msg.To.Add(new MailAddress("chandran.diviias.bala@gmail.com"));
                //msg.CC.Add(new MailAddress("balachandrandivpri@gmail.com"))
                //vijay@ravemaxpro.co.in
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.UseDefaultCredentials = false;
                smtp.EnableSsl = true;
                NetworkCredential nc = new NetworkCredential(strFromMailId, strPassword);
                    smtp.Credentials = nc;

                smtp.Send(msg);



            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
        }



        #endregion

        #region DownLoad File

        public void DownloadFile(string fileName, string cirNumber)
        {
            WebClient myWebClient = new WebClient();
            // Concatenate the domain with the Web resource filename.
            string strDownloadUrl = System.Configuration.ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
            //= strDownloadUrl + fileName;
            //Console.WriteLine("Downloading File \"{0}\" from \"{1}\" .......\n\n", fileName, myStringWebResource);
            // Download the Web resource and save it into the current filesystem folder.
            myWebClient.DownloadFile("D://Temp//CIR-10000009/" + fileName, fileName);

        }

        #endregion

        #region Photo Capture

        public ActionResult Photo()
        {
            if (CookieManager.GetCookie("GAM") != null)
            {
                ViewBag.Name = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee;
                ViewBag.MenuDetails = oMainClass.GetMenu(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            }
            else
                RedirectToAction("TimeOut", "Login");
            return View();
        }

        public ActionResult Capture()
        {
            try
            {
                var stream = Request.InputStream;
                string dump;

                using (var reader = new StreamReader(stream))
                {
                    dump = reader.ReadToEnd();
                    if (dump != "")
                    {
                        DateTime nm = DateTime.Now;

                        string date = nm.ToString("yyyymmddMMss");
                        var path = Server.MapPath("~/WebImages/" + date + "cir.png");
                        System.IO.File.WriteAllBytes(path, String_To_Bytes2(dump));
                        Session["path"] = date + "cir.png";
                        Session["val"] = date + "cir.png";
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return View();
        }

        private byte[] String_To_Bytes2(string strInput)
        {
            int numBytes = (strInput.Length) / 2;
            byte[] bytes = new byte[numBytes];
            try
            {



                for (int x = 0; x < numBytes; ++x)
                {
                    bytes[x] = Convert.ToByte(strInput.Substring(x * 2, 2), 16);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return bytes;
        }

        public void SavePhoto(string description)
        {
            try
            {
                if (Session["val"].ToString() != string.Empty)
                {
                    string uploaderUrl = "";
                    CIRFilesResult result = new CIRFilesResult();
                    result = oCIRManager.SaveCIRFiles(Session["CIRNumberPhotoId"].ToString(), Session["path"].ToString(), description, true, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                    string strDestinationFilePath = System.Configuration.ConfigurationManager.AppSettings["FileExtractSource"].ToString();
                    if (Directory.Exists(Session["path"].ToString() + "" + Session["CIRNumberPhotoNumber"]))
                    {

                        uploaderUrl = string.Format("{0}{1}", Session["path"].ToString() + "" + Session["CIRNumberPhotoNumber"].ToString() + "/", Session["path"].ToString());
                        System.IO.File.Copy(Server.MapPath("~/WebImages/" + Session["path"]), strDestinationFilePath + "\\" + Session["cirNumber"].ToString());
                        System.IO.File.Delete(Server.MapPath("~/WebImages/" + Session["path"]));

                    }
                    else
                    {
                        DirectoryInfo di = Directory.CreateDirectory(strDestinationFilePath + "/" + Session["CIRNumberPhotoNumber"].ToString());
                        System.IO.File.Copy(Server.MapPath("~/WebImages/" + Session["path"]), strDestinationFilePath + "\\" + Session["CIRNumberPhotoNumber"].ToString() + "\\" + Session["path"]);
                        System.IO.File.Delete(Server.MapPath("~/WebImages/" + Session["path"]));
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
        }

        [HttpPost]
        public JsonResult GetTakenImage()
        {
            var result = Session["path"].ToString();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetDecriptionForCamera(string description)
        {
            SavePhoto(description);
            return Json(JsonRequestBehavior.AllowGet);
        }


        #endregion

    }
}