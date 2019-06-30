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
    public class CustomerDataImprovementController : Controller
    {

        #region Global Variables

        MainClass mc = new MainClass();
        MasterManager oMasterManager = new MasterManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CustomerDataImprovementController));

        #endregion

        #region Global Methods

        public CustomerDataImprovementController()
        {
            if (CookieManager.GetCookie("GAM") != null)
            {
                ViewBag.Name = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee;
                ViewBag.MenuDetails = mc.GetMenu(CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            }
            else
            {
                RedirectToAction("TimeOut", "Login");
            }
        }

        #endregion

        #region Spare Parts

        #region Actions

        [CheckRoleAccess]
        public ActionResult SpareParts()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetSpareParts(SparePartsModel sparemodel)
        {
            List<SparePartsDetails> result = oMasterManager.GetSpareParts(sparemodel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetSpareParts(SparePartsModel sparemodel)
        {
            SparePartsResult result = oMasterManager.SetSpareResult(sparemodel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult FileUploadSpareParts()
        {
            if (System.Web.HttpContext.Current.Request.Files.AllKeys.Any())
            {
                var pic = System.Web.HttpContext.Current.Request.Files["UploadedImage"];
                HttpPostedFileBase filebase = new HttpPostedFileWrapper(pic);
                var fileName = Path.GetFileName(filebase.FileName);
                var path = Path.Combine(Server.MapPath("~/SpareUploadImage/"), fileName);
                filebase.SaveAs(path);
            }
            return Json("File Uploaded Successfully!");
        }

        #endregion

        #endregion

        #region Design Modification Status

        #region Actions

        [CheckRoleAccess]
        public ActionResult DMStatus()
        {
            return View();
        }

        #endregion

        #region Methods

        public void UploadExcelDMStatus()
        {
            Session["UploadExcelUrl"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["UploadExcelUrl"] = hpfBase;
            }
        }


        public JsonResult GetDMExcel(DMExcelModel DMexcel)
        {
            DMExcelGetResult result = oMasterManager.GetDMStatusUploadExcel(DMexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DMExcelUpload(string DSId)
        {
            OleDbConnection con = new OleDbConnection();
            DMSetExcelResult result = new DMSetExcelResult();
            DMExcelModel DMSetexcel = new DMExcelModel();
            OleDbCommand cmd = new OleDbCommand();
            string connectionstring = "", extension = "";
            try
            {
                string strTurbineDataEntryExcelUploadUrl = ConfigurationManager.AppSettings["TurbineFileUploadDataEntyUrl"].ToString();
                if (Session["UploadExcelUrl"] != null)
                {
                    HttpPostedFileBase UploadedEcelFile = Session["UploadExcelUrl"] as HttpPostedFileBase;
                    extension = UploadedEcelFile.FileName.Split('.')[UploadedEcelFile.FileName.Split('.').Length - 1];
                    if (extension == "xlsx" || extension == "xls")
                    {
                        var stream = UploadedEcelFile.InputStream;
                        string uploadurl = string.Format("{0}TurbineDataEntryTemplate/{1}", strTurbineDataEntryExcelUploadUrl, UploadedEcelFile.FileName);
                        using (var filestream = System.IO.File.Create(uploadurl))
                            stream.CopyTo(filestream);
                        if (extension == "xls")
                            connectionstring = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploadurl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                        else if (extension == "xlsx")
                            connectionstring = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploadurl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";

                        con.ConnectionString = connectionstring;
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.Connection = con;
                        OleDbDataAdapter oledbDa = new OleDbDataAdapter(cmd);
                        con.Open();
                        DataTable dt = con.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                        string getExcelSheetName = dt.Rows[0]["Table_Name"].ToString();
                        cmd.CommandText = "SELECT * FROM [" + getExcelSheetName + "]";
                        oledbDa.SelectCommand = cmd;
                        dt = new DataTable();
                        oledbDa.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            DMSetexcel.Turbine = dt;
                            DMSetexcel.FileName = UploadedEcelFile.FileName;
                            DMSetexcel.Remarks = "";
                            DMSetexcel.Submit = "0";
                            DMSetexcel.DSId = DSId;
                            DMSetexcel.RowId = "0";
                            DMSetexcel.Delflag = "0";

                            result = oMasterManager.SetDMStatusUploadExcel(DMSetexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        }
                        else
                        {
                            result.message = new Message();
                            result.message.Msg = "Excel File Should not Empty!";
                            result.message.Clear = "False";
                        }
                        con.Close();
                    }
                    else
                    {
                        result.message = new Message();
                        result.message.Msg = "Upload .xlsx / .xls file only!";
                        result.message.Clear = "False";
                    }
                }
                else
                {
                    result.message = new Message();
                    result.message.Msg = "Upload Excel File!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new Message();
                result.message.Msg = "Error in uploading the excel file.";
                result.message.Clear = "False";
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DMSaveExcel(string DSId,string Remarks)
        {
            OleDbConnection con = new OleDbConnection();
            DMSetExcelResult result = new DMSetExcelResult();
            DMExcelModel DMSetexcel = new DMExcelModel();
            OleDbCommand cmd = new OleDbCommand();
            string connectionstring = "", extension = "";
            try
            {
                string strTurbineDataEntryExcelUploadUrl = ConfigurationManager.AppSettings["TurbineFileUploadDataEntyUrl"].ToString();
                if (Session["UploadExcelUrl"] != null)
                {
                    HttpPostedFileBase UploadedEcelFile = Session["UploadExcelUrl"] as HttpPostedFileBase;
                    Session["UploadExcelUrl"] = null;
                    extension = UploadedEcelFile.FileName.Split('.')[UploadedEcelFile.FileName.Split('.').Length - 1];
                    string uploadurl = string.Format("{0}TurbineDataEntryTemplate/{1}", strTurbineDataEntryExcelUploadUrl, UploadedEcelFile.FileName);
                    if (extension == "xlsx" || extension == "xls")
                    {   
                        if (extension == "xls")
                            connectionstring = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploadurl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                        else if (extension == "xlsx")
                            connectionstring = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploadurl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";

                        con.ConnectionString = connectionstring;
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.Connection = con;
                        OleDbDataAdapter oledbDa = new OleDbDataAdapter(cmd);
                        con.Open();
                        DataTable dt = con.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                        string getExcelSheetName = dt.Rows[0]["Table_Name"].ToString();
                        cmd.CommandText = "SELECT * FROM [" + getExcelSheetName + "]";
                        oledbDa.SelectCommand = cmd;
                        dt = new DataTable();
                        oledbDa.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            DMSetexcel.Turbine = dt;
                            DMSetexcel.FileName = UploadedEcelFile.FileName;
                            DMSetexcel.Remarks = Remarks;
                            DMSetexcel.Submit = "1";
                            DMSetexcel.DSId = DSId;
                            DMSetexcel.RowId = "0";
                            DMSetexcel.Delflag = "0";

                            result = oMasterManager.SetDMStatusUploadExcel(DMSetexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        }
                        else
                        {
                            result.message = new Message();
                            result.message.Msg = "Excel File Should not Empty!";
                            result.message.Clear = "False";
                        }
                        con.Close();
                    }
                    else
                    {
                        result.message = new Message();
                        result.message.Msg = "Upload .xlsx / .xls file only!";
                        result.message.Clear = "False";
                    }
                }
                else
                {
                    result.message = new Message();
                    result.message.Msg = "Upload Excel File!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetDMExcel(DMExcelModel DMexcel)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("SlNo", typeof(string));
            dt.Columns.Add("Turbine", typeof(string));
            dt.Columns.Add("DMTitle", typeof(string));
            dt.Columns.Add("Status", typeof(string));
            dt.Columns.Add("AnalyzingStatus", typeof(string));
            dt.Columns.Add("Description", typeof(string));
            DMexcel.Turbine = dt;
            DMSetExcelResult result = oMasterManager.SetDMStatusUploadExcel(DMexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTurbineDataEntry(TurbineDataEntryModel TurbineDataEntryModel)
        {
            List<TurbineDataEntryDetails> result = oMasterManager.GetTurbineDataEntry(TurbineDataEntryModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetTubineDataEntry(TurbineDataEntryModel TurbineDataEntryModel)
        {
            TurbineDataEntryResult result = oMasterManager.SetTurbineDataEntry(TurbineDataEntryModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Design Modification Master

        #region Actions

        [CheckRoleAccess]
        public ActionResult DMMaster()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetDMMaster(DMMasterModel DMMastermodel)
        {
            List<DMMasterDetail> result = oMasterManager.GetDMMaster(DMMastermodel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetDMMaster(DMMasterModel DMMastermodel)
        {
            DMMasterResult result = oMasterManager.SetDMMaster(DMMastermodel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

    }
}