using CIR.DataAccess;
using CIR.DomainModel;
using GamesaCIR.App_Code;
using GamesaCIR.Filters;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GamesaCIR.Controllers
{
    public class AdminController :  Controller
    { 

        #region Global Variables

        MainClass oMainClass = new MainClass();
        AdminManager oAdminManager = new AdminManager();
        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(AdminController));

        #endregion

        #region Global Methods

        public AdminController()
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

        public JsonResult GetPageAccess(string pageName)
        {
            AdminModel result = oAdminManager.GetPageAccessDetails(pageName, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get the Status.
        /// </summary>
        /// <param name="statusModel"></param>
        /// <returns></returns>
        public JsonResult GetStatus(StatusModel statusModel)
        {
            if (statusModel.view != "0")
                statusModel.DsgId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId;

            StatusModelResult result = oAdminManager.GetStatus(statusModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Set the Status based on the quality designation.
        /// </summary>
        /// <param name="statusModel"></param>
        /// <returns></returns>
        public JsonResult SetStatusBasedOnDesignation(StatusModel statusModel)
        {
            bool bIsQuality = false;
            try
            {
                if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId == "6")
                {
                    if (statusModel.StsId == "6")
                    {
                        bIsQuality = true;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return Json(new { bIsQuality }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Change Password

        public ActionResult ChangePassword()
        {
            return View();
        }

        public JsonResult SaveChangePassword(string oldPassword, string newPassword)
        {
            var result = oAdminManager.SaveChangePassword(RMaxCrypto.Crypto.EncryptII(oldPassword), RMaxCrypto.Crypto.EncryptII(newPassword),"0", CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region KMP File

        [CheckRoleAccess]
        public ActionResult KMPFile()
        {
            return View();
        }

        [HttpPost]
        public JsonResult FileUpload()
        {
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["File"] = hpfBase;

            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveFiles(string pageName, string pageId, string kgId)
        {
            Message result = new Message();
            try
            {
                HttpPostedFileBase uploadedFile = Session["File"] as HttpPostedFileBase;
                string strFileName = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                string uploaderUrl = "";


                if (uploadedFile != null)
                {
                    result = oAdminManager.SaveKMPFiles("0", pageId, "", "", uploadedFile.FileName, kgId, "0", CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

                    var streamFile = uploadedFile.InputStream;
                    if (Directory.Exists(strFileName + "" + pageName))
                    {

                        uploaderUrl = string.Format("{0}{1}", strFileName + "" + pageName + "/", uploadedFile.FileName);
                        using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                        {
                            streamFile.CopyTo(fileStream);

                        }


                    }
                    else
                    {
                        DirectoryInfo di = Directory.CreateDirectory(strFileName + "" + pageName);

                        uploaderUrl = string.Format("{0}{1}", strFileName + "" + pageName + "/", uploadedFile.FileName);
                        using (var fileStream = new FileStream((uploaderUrl), FileMode.Create))
                        {

                            streamFile.CopyTo(fileStream);
                        }
                    }
                    Session.Remove("File");
                    return Json(new { result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    result = new Message()
                    {
                        Msg = "Ensure File!",
                        Clear = "False"
                    };
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteFiles(string KFId, string fileName, string iconName, string pageName)
        {

            var result = oAdminManager.SaveKMPFiles(KFId, "0", "", "", "", "0", "1", CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                if (result.Clear == "True")
                {
                    string strDeletePath = System.Configuration.ConfigurationManager.AppSettings["FileExtractSource"].ToString();
                    if (System.IO.File.Exists(strDeletePath + "\\" + pageName + "\\" + fileName))
                    {
                        System.IO.File.Delete(strDeletePath + "\\" + pageName + "\\" + fileName);
                    }
                    if (System.IO.File.Exists(strDeletePath + "\\" + pageName + "\\" + iconName))
                    {
                        System.IO.File.Delete(strDeletePath + "\\" + pageName + "\\" + iconName);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFiles(string pageId, string kgId)
        {
            var result = oAdminManager.GetKMPFiles(pageId, kgId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                string strGamesaImagesUrl = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                foreach (var item in result)
                {
                    item.KFileFullPath = strGamesaImagesUrl + "" + item.KPage + "/" + item.KFilename;
                    item.IconNameFullPath = strGamesaImagesUrl + "" + item.KPage + "/" + item.IconName;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region KMP Approval

        [CheckRoleAccess]
        public ActionResult KMPApproval()
        {
            return View();
        }

        public JsonResult GetKMPFileApproval(string categoryId, string refId, string status, string viewType)
        {
            List<KMPFileApproval> result = oAdminManager.GetKMPFileApproval(categoryId, refId, status,  viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetKMPFileApproval(List<KMPFileApproval> fileDetails, string viewType)
        {
            string detailsId = "";
            foreach (var item in fileDetails)
            {
                if (item.STATUS == "1")
                    detailsId += item.Id + ",";
            }
            Message result = oAdminManager.SetKMPFileApproval(detailsId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Email

        #region Actions

        [CheckRoleAccess]
        public ActionResult Email()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetEmail(EmailModel emailModel)
        {
            List<EmailDetails> result = oAdminManager.GetEmail(emailModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetEmail(List<EmailDetails> EmployeeEmailDetails, string CStatus)
        {
            DataTable dt = new DataTable();
            try
            {
                dt.Columns.Add("ERId", typeof(string));
                dt.Columns.Add("EmpId", typeof(string));
                dt.Columns.Add("EmailTo", typeof(string));
                dt.Columns.Add("CC", typeof(string));
                dt.Columns.Add("BCC", typeof(string));

                if (EmployeeEmailDetails != null)
                {
                    foreach (var item in EmployeeEmailDetails)
                    {
                        DataRow dr = dt.NewRow();
                        dr["ERId"] = item.ERId;
                        dr["EmpId"] = item.EmpId;
                        dr["EmailTo"] = item.Emailto;
                        dr["CC"] = item.CC;
                        dr["BCC"] = item.BCC;
                        dt.Rows.Add(dr);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            Message result = oAdminManager.SetEmail(dt, CStatus, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Hierarchy

        #region Actions

        [CheckRoleAccess]
        public ActionResult Hierarchy()
        {
            return View();
        }

        #endregion

        #region Methods

        /// <summary>
        /// Get the Designation details based on the Hierarchy.
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDesignationDetails()
        {
            HierarchyResult result = oAdminManager.GetDesignationDetails(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Save the Hierarchy details
        /// </summary>
        /// <param name="hierarchyModel"></param>
        /// <returns></returns>
        public JsonResult SetHierarchyDetails(HierarchyModel hierarchyModel)
        {
            Message result = oAdminManager.SetHierarchyDetails(hierarchyModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Get the Hierarchy Details
        /// </summary>
        /// <returns></returns>
        public JsonResult GetHierarchyDetails()
        {
            HierarchyResult result = oAdminManager.GetHierarchyDetails(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Site Mapping

        #region Actions

        [CheckRoleAccess]
        public ActionResult SiteMap()
        {

            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetEmployeeMappedDetails(SiteMapModel siteMapModel)
        {
            SiteMapResult result = oAdminManager.GetEmployeeMappedDetails(siteMapModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetEmpSiteMappingDetails(GetEmpSiteMapModel siteMapModel)
        {
            GetEmpSiteMapResult result = oAdminManager.GetEmpSiteMappingDetails(siteMapModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAssignedAndUnAssignedEmployeeDetails(string siteId, string stateId, string view)
        {
            SiteMapModel oSiteMapModel = new SiteMapModel()
            {
                Site = siteId,
                State = stateId,
                View = view
            };
            SiteMapResult result = oAdminManager.GetEmployeeMappedDetails(oSiteMapModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetSiteMapping(SiteMapModel siteMapModel)
        {
            Message result = oAdminManager.SetSiteMapping(siteMapModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Version Update

        public ActionResult VersionUpdate()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadFiles()
        {
            //File Save Location
            string fname = "" ;
            string connectionString = "";
            // Checking no of files injected in Request object  
            if (Request.Files.Count > 0)
            {
                try
                {
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        //string path = AppDomain.CurrentDomain.BaseDirectory + "Uploads/";  
                        //string filename = Path.GetFileName(Request.Files[i].FileName);  

                        HttpPostedFileBase file = files[i];
                        

                        // Checking for Internet Explorer  
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = file.FileName;
                        }

                        // Get the complete folder path and store the file inside it.  
                        
                        fname = Path.Combine(Server.MapPath("~/VersionUpdate/"), fname);
                        file.SaveAs(fname);
                    }

                    // Oledb connection decalartion.
                    OleDbConnection con = new OleDbConnection();
                    //Oledb Command decalaration.
                    OleDbCommand cmd = new OleDbCommand();
                    string myFilePath = Server.MapPath("~/VersionUpdate/" + fname);
                    string extension = Path.GetExtension(myFilePath);

                    if (extension == "xls")
                        connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + myFilePath + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                    else if (extension == "xlsx")
                        connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + myFilePath + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";


                    con.ConnectionString = connectionString;
                    cmd.CommandType = System.Data.CommandType.Text;
                    cmd.Connection = con;
                    OleDbDataAdapter dAdapter = new OleDbDataAdapter(cmd);
                    con.Open();
                    DataTable dt = con.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                    string getExcelSheetName = dt.Rows[0]["Table_Name"].ToString();
                    cmd.CommandText = "SELECT * FROM [" + getExcelSheetName + "]";
                    dAdapter.SelectCommand = cmd;
                    dt = new DataTable();
                    dt.Columns.Add("Turbine", typeof(string));

                    // Returns message that successfully uploaded  
                    return Json("File Uploaded Successfully!");
                }
                catch (Exception ex)
                {
                    return Json("Error occurred. Error details: " + ex.Message);
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }

        #endregion

        #region Log Error for JS

        [HttpPost]
        public JsonResult LogFile(string errorData)
        {
            Logger.Error(errorData);
            return Json(new { }, JsonRequestBehavior.AllowGet);
        }

        #endregion

    }
}