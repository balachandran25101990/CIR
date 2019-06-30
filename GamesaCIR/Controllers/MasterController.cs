using CIR.DataAccess;
using CIR.DomainModel;
using GamesaCIR.App_Code;
using GamesaCIR.Filters;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using ClosedXML.Excel;
using System.IO;
using System.ComponentModel;
using GamesaCIR.Controllers;
using System.Web.Script.Serialization;

namespace GamesaCIR.Controllers
{
    public class MasterController : Controller
    {
        #region Global variables

        MainClass oMainClass = new MainClass();
        MasterManager oMasterManager = new MasterManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MasterController));
        dbLib db = new dbLib();
        #endregion

        #region Global Methods

        public MasterController()
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

        #region Category Master

        #region Actions

        [CheckRoleAccess]
        public ActionResult Category()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetCategory(string refId, string categoryId, string view)
        {
            List<CategoryModel> result = oMasterManager.GetCategory(refId, categoryId, view, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetCategory(string id, string mcId, string refId, string category, string active, string delFlag)
        {
            Message result = oMasterManager.SetCategory(id, mcId, refId, category, active, delFlag, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Department

        #region Actions

        [CheckRoleAccess]
        public ActionResult Department()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetDepartment(DepartmentModel department)
        {
            List<DepartmentDetails> result = oMasterManager.GetDepartment(department, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetDepartment(DepartmentModel department)
        {
            DepartmentResult result = oMasterManager.SetDepartment(department, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Designation

        #region Actions

        [CheckRoleAccess]
        public ActionResult Designation()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetDesignation(DesignationModel designation)
        {
            List<DesignationDetails> result = oMasterManager.GetDesignation(designation, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetDesignation(DesignationModel designation)
        {
            DesignationResult result = oMasterManager.SetDesignation(designation, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDetailsIsAutoAssignOrNot()
        {
            DesignationDetails result = oMasterManager.GetDetailsIsAutoAssigneOrNot(CookieManager.GetCookie(CookieManager.CookieName).logindetail.DsgId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Employee

        #region Actions

        [CheckRoleAccess]
        public ActionResult Employee()
        {

            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetEmployee(EmployeeModel employee)
        {
            EmployeeDetails result = oMasterManager.GetEmployee(employee, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                foreach (EmployeeDetails details in result.EmployeeDetail)
                {
                    if (details.Pwd != null)
                        details.Pwd = RMaxCrypto.Crypto.DecryptII(details.Pwd);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetEmployee(EmployeeModel employee)
        {
            if (employee.Pwd != null)
                employee.Pwd = RMaxCrypto.Crypto.EncryptII(employee.Pwd);
            EmployeeResult result = oMasterManager.SetEmployee(employee, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                foreach (EmployeeDetails details in result.employeedetails)
                {
                    if (details.Pwd != null)
                        details.Pwd = RMaxCrypto.Crypto.DecryptII(details.Pwd);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEmployeeExcel(EmployeeExcelModel employeeexcel)
        {
            EmployeeExcelGetResult result = oMasterManager.GetEmployeeExcel(employeeexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            foreach (EmployeeExcelDetails details in result.employeeexceldetails)
            {
                if (details.Pwd != null)
                    details.Pwd = RMaxCrypto.Crypto.DecryptII(details.Pwd);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetEmployeeExcel(EmployeeExcelModel employeeexcel)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Employee Name", typeof(string));
            dt.Columns.Add("ICH Code", typeof(string));
            dt.Columns.Add("SAP Code", typeof(string));
            dt.Columns.Add("Department", typeof(string));
            dt.Columns.Add("Designation", typeof(string));
            dt.Columns.Add("Mobile", typeof(string));
            dt.Columns.Add("Email", typeof(string));
            dt.Columns.Add("Role", typeof(string));
            dt.Columns.Add("Password", typeof(string));
            dt.Columns.Add("MultiSite", typeof(string));
            dt.Columns.Add("FuncSys", typeof(string));
            dt.Columns.Add("WorkingAt", typeof(string));
            employeeexcel.Employee = dt;
            EmployeeExcelSetResult result = oMasterManager.SetEmployeeExcel(employeeexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public void UploadExcel()
        {
            Session["_ExcelEmployee"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["_ExcelEmployee"] = hpfBase;
            }
        }

        public JsonResult EmployeeExcelUpload(string EUId)
        {

            EmployeeExcelSetResult result = new EmployeeExcelSetResult();
            EmployeeExcelModel employeeexcel = new EmployeeExcelModel();
            try
            {
                OleDbCommand cmd = new OleDbCommand();
                string connectionString = "", extension = "";
                string strUploadUrl = ConfigurationManager.AppSettings["FileUploadUrl"].ToString();
                if (Session["_ExcelEmployee"] != null)
                {
                    HttpPostedFileBase uploadedExcelFile = Session["_ExcelEmployee"] as HttpPostedFileBase;
                    extension = uploadedExcelFile.FileName.Split('.')[uploadedExcelFile.FileName.Split('.').Length - 1];
                    if (extension == "xls" || extension == "xlsx")
                    {
                        var stream = uploadedExcelFile.InputStream;
                        string uploaderUrl = string.Format("{0}Employee/{1}", strUploadUrl, uploadedExcelFile.FileName);
                        using (var fileStream = System.IO.File.Create(uploaderUrl))
                            stream.CopyTo(fileStream);
                        if (extension == "xls")
                            connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                        else if (extension == "xlsx")
                        {

                            connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                        }

                        OleDbConnection con = new OleDbConnection(connectionString);
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.Connection = con;
                        OleDbDataAdapter dAdapter = new OleDbDataAdapter(cmd);
                        con.Open();
                        DataTable dt = con.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                        string getExcelSheetName = dt.Rows[0]["Table_Name"].ToString();
                        cmd.CommandText = "SELECT * FROM [" + getExcelSheetName + "]";
                        dAdapter.SelectCommand = cmd;
                        dt = new DataTable();
                        dAdapter.Fill(dt);
                       
                         if (dt.Rows.Count > 0)
                        {
                            employeeexcel.Employee = dt;
                            employeeexcel.FileName = uploadedExcelFile.FileName;
                            employeeexcel.Remarks = "";
                            employeeexcel.Submit = "0";
                            employeeexcel.EUId = EUId;
                            employeeexcel.RowId = "0";
                            employeeexcel.Delflag = "0";

                            result = oMasterManager.SetEmployeeExcel(employeeexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        }
                        else
                        {
                            result.message = new ExcelMessage();
                            result.message.Message = "Excel File Should not Empty!";
                            result.message.Clear = "False";
                        }
                        con.Close();
                    }
                    else
                    {
                        result.message = new ExcelMessage();
                        result.message.Message = "Upload .xlsx / .xls file only!";
                        result.message.Clear = "False";
                    }
                }
                else
                {
                    result.message = new ExcelMessage();
                    result.message.Message = "Upload Excel File!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new ExcelMessage();
                result.message.Message = ex.Message;// "Error in uploading the excel file.";
                result.message.Clear = "False";
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EmployeeExcelSubmit(string EUId, string Remarks)
        {
            EmployeeExcelSetResult result = new EmployeeExcelSetResult();
            EmployeeExcelModel employeeexcel = new EmployeeExcelModel();
            OleDbCommand cmd = new OleDbCommand();
            try
            {
                string connectionString = "", extension = "";
                string strUploadUrl = ConfigurationManager.AppSettings["FileUploadUrl"].ToString();
                if (Session["_ExcelEmployee"] != null)
                {
                    HttpPostedFileBase uploadedExcelFile = Session["_ExcelEmployee"] as HttpPostedFileBase;
                    Session["_ExcelEmployee"] = null;
                    extension = uploadedExcelFile.FileName.Split('.')[uploadedExcelFile.FileName.Split('.').Length - 1];
                    string uploaderUrl = string.Format("{0}Employee/{1}", strUploadUrl, uploadedExcelFile.FileName);
                    if (extension == "xls" || extension == "xlsx")
                    {
                        if (extension == "xls")
                            connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                        else if (extension == "xlsx")
                            connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";

                        OleDbConnection con = new OleDbConnection(connectionString);
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.Connection = con;
                        OleDbDataAdapter dAdapter = new OleDbDataAdapter(cmd);
                        con.Open();
                        DataTable dt = con.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                        string getExcelSheetName = dt.Rows[0]["Table_Name"].ToString();
                        cmd.CommandText = "SELECT * FROM [" + getExcelSheetName + "]";
                        dAdapter.SelectCommand = cmd;
                        dt = new DataTable();
                        dAdapter.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            foreach (DataRow row in dt.Rows)
                                row["Password"] = RMaxCrypto.Crypto.EncryptII(row["Password"].ToString());
                            employeeexcel.Employee = dt;
                            employeeexcel.FileName = uploadedExcelFile.FileName;
                            employeeexcel.Remarks = Remarks;
                            employeeexcel.Submit = "1";
                            employeeexcel.EUId = EUId;
                            employeeexcel.RowId = "0";
                            employeeexcel.Delflag = "0";

                            result = oMasterManager.SetEmployeeExcel(employeeexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        }
                        else
                        {
                            result.message = new ExcelMessage();
                            result.message.Message = "Excel File Should not Empty!";
                            result.message.Clear = "False";
                        }
                        con.Close();
                    }
                    else
                    {
                        result.message = new ExcelMessage();
                        result.message.Message = "Upload .xlsx / .xls file only!";
                        result.message.Clear = "False";
                    }
                }
                else
                {
                    result.message = new ExcelMessage();
                    result.message.Message = "Upload Excel File!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FillDataEmp(string Data, string SessionId)
        {
            try
            {
                DataTable dtContent = null;
                dtContent = JsonConvert.DeserializeObject<DataTable>(Data);

                dtContent.TableName = SessionId;
                Session[SessionId] = dtContent;
                return Json("OK", JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json("ERROR", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DownloadExcelEmp(string id = "")
        {
            DataTable _downloadData = Session[id] as DataTable;
            if (_downloadData != null)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(_downloadData);
                    wb.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    wb.Style.Font.Bold = true;

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename= " + id + ".xlsx");

                    using (MemoryStream MyMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(MyMemoryStream);
                        MyMemoryStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Master Collection

        #region Actions

        [CheckRoleAccess]
        public ActionResult MasterCollection()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetMasterCollection(CollectionModel collection)
        {
            List<CollectionDetails> result = oMasterManager.GetMasterCollection(collection, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSubMasterCollection(CollectionModel collection)
        {
            List<CollectionData> result = oMasterManager.GetSubMasterCollection(collection, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMasterCollectionFomName(FOMName collection)
        {
            FOMNameDetails result = oMasterManager.GetFOMName(collection, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMasterCollectionSpecification(CollectionModel collection)
        {
            CollectionSpecficationResult result = oMasterManager.GetMastercollectionSpecification(collection, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetMasterCollection(CollectionModel collection)
        {
            CollectionResult result = oMasterManager.SetMasterCollection(collection, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Role and Role access

        #region Actions

        [CheckRoleAccess]
        public ActionResult RoleAndRoleAccess()
        {
            return View();
        }

        #endregion

        #region Methods 

        #region Role

        public JsonResult GetRole(RoleModel role)
        {
            List<RoleDetails> result = oMasterManager.GetRole(role, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetRole(RoleModel role)
        {
            RoleResult result = oMasterManager.SetRole(role, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Role Access

        public JsonResult GetRoleAccess(RoleAccessModel roleaccess)
        {
            List<RoleAccessDetails> result = oMasterManager.GetRoleAccess(roleaccess, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            if (roleaccess.ViewType != "1")
                result = result.Where(x => x.RefId == roleaccess.PgeId).ToList();
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetRoleAccess(RoleAccessModel roleaccess)
        {
            Message result = oMasterManager.SetRoleAccess(roleaccess, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #endregion

        #region Turbine 

        #region Actions

        [CheckRoleAccess]
        public ActionResult Turbine()
        {
            return View();
        }

        #endregion

        #region Methods

        public void UploadTurbineExcel()
        {
            Session["_ExcelTurbine"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["_ExcelTurbine"] = hpfBase;
            }
        }

        public JsonResult GetTurbine(TurbineModel turbine)
        {
            TurbineDetails result = oMasterManager.GetTurbine(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            //var result = Json(result1, JsonRequestBehavior.AllowGet);
            try
            {
                if (result.TurbineDetail.Count != 0)
                {
                    result.TurbineDetail[0].EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetTurbineEntry(TurbineModel turbine)
        {
            TurbineDetails result1 = oMasterManager.GetTurbine(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            var result = Json(result1, JsonRequestBehavior.AllowGet);
            try
            {
                if (result1.TurbineDetail.Count != 0)
                {
                    result1.TurbineDetail[0].EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            result.MaxJsonLength = 2147483644;
            return result;
            //return Json(new { result }, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetTurbineExcelDown(TurbineModel turbine)
        {
            List<TurbineExcelDownload> result = oMasterManager.GetTurbineExcel(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                if (result.Count != 0)
                {
                    // result[0].EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetTurbine(TurbineModel turbine)
        {
            turbine.DOC = ConvertDate(turbine.DOC);
            TurbineResult result = oMasterManager.SetTurbine(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTurbineExcel(TurbineExcelModel turbineexcel)
        {
            TurbineExcelGetResult result = oMasterManager.GetTurbineExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetTurbineExcel(TurbineExcelModel turbineexcel)
        {
            //DataTable dt = new DataTable();
            //dt.Columns.Add("Turbine Id", typeof(string));
            //dt.Columns.Add("CmrGroupName", typeof(string));
            //dt.Columns.Add("Customer", typeof(string));
            //dt.Columns.Add("Site", typeof(string));
            //dt.Columns.Add("Function Location", typeof(string));
            //dt.Columns.Add("Tower Height", typeof(string));
            //dt.Columns.Add("Capacity", typeof(string));
            //dt.Columns.Add("Blade", typeof(string));
            //dt.Columns.Add("Generator", typeof(string));
            //dt.Columns.Add("Generator SlNo", typeof(string));
            //dt.Columns.Add("Gear Box", typeof(string));
            //dt.Columns.Add("Gear Box SlNo", typeof(string));
            //dt.Columns.Add("DOC", typeof(string));
            //dt.Columns.Add("Temprature", typeof(string));
            //dt.Columns.Add("Dust", typeof(string));
            //dt.Columns.Add("Corrosion", typeof(string));
            //dt.Columns.Add("WTGType", typeof(string));
            //dt.Columns.Add("SWVersion", typeof(string));
            //dt.Columns.Add("HWVersion", typeof(string));
            //dt.Columns.Add("Scada Name", typeof(string));
            //dt.Columns.Add("Location", typeof(string));
            //turbineexcel.Turbine = dt;
            DataTable dtOriginalData = (DataTable)Session["OriginalData"];
            turbineexcel.Turbine = dtOriginalData;
            TurbineExcelSetResult result = oMasterManager.SetTurbineExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TurbineExcelUpload(string TUId)
        {
            OleDbConnection con = new OleDbConnection();
            TurbineExcelSetResult result = new TurbineExcelSetResult();
            TurbineExcelModel turbineexcel = new TurbineExcelModel();
            OleDbCommand cmd = new OleDbCommand();
            string connectionString = "", extension = "";
            try
            {
                string strUploadUrl = ConfigurationManager.AppSettings["FileUploadUrl"].ToString();
                if (Session["_ExcelTurbine"] != null)
                {
                    HttpPostedFileBase uploadedExcelFile = Session["_ExcelTurbine"] as HttpPostedFileBase;
                    extension = uploadedExcelFile.FileName.Split('.')[uploadedExcelFile.FileName.Split('.').Length - 1];
                    if (extension == "xls" || extension == "xlsx")
                    {
                        var stream = uploadedExcelFile.InputStream;
                        string uploaderUrl = string.Format("{0}Turbine/{1}", strUploadUrl, uploadedExcelFile.FileName);
                        using (var fileStream = System.IO.File.Create(uploaderUrl))
                            stream.CopyTo(fileStream);
                        if (extension == "xls")
                            connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                        else if (extension == "xlsx")
                            connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";


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

                        dAdapter.Fill(dt);
                        DataTable dtOriginalData = new DataTable();
                        dtOriginalData.Columns.Add("TurbineId", typeof(string));
                        dtOriginalData.Columns.Add("CmrGroupName", typeof(string));
                        dtOriginalData.Columns.Add("Customer", typeof(string));
                        dtOriginalData.Columns.Add("TSite", typeof(string));
                        dtOriginalData.Columns.Add("FnLoc", typeof(string));
                        dtOriginalData.Columns.Add("THeight", typeof(string));
                        dtOriginalData.Columns.Add("TCapacity", typeof(string));
                        dtOriginalData.Columns.Add("Blade", typeof(string));
                        dtOriginalData.Columns.Add("Generator", typeof(string));
                        dtOriginalData.Columns.Add("GRSlno", typeof(string));
                        dtOriginalData.Columns.Add("GearBox", typeof(string));
                        dtOriginalData.Columns.Add("GBSlno", typeof(string));
                        dtOriginalData.Columns.Add("DOC", typeof(string));
                        dtOriginalData.Columns.Add("Temp", typeof(string));
                        dtOriginalData.Columns.Add("Dust", typeof(string));
                        dtOriginalData.Columns.Add("WTGType", typeof(string));
                        dtOriginalData.Columns.Add("Corrosion", typeof(string));
                        dtOriginalData.Columns.Add("SWVersion", typeof(string));
                        dtOriginalData.Columns.Add("HWVersion", typeof(string));
                        dtOriginalData.Columns.Add("ScadaName", typeof(string));
                        dtOriginalData.Columns.Add("Location", typeof(string));
                        foreach (DataRow row in dt.Rows)
                        {
                            if (row["Turbine"].ToString() != "")
                            {
                                DataRow dr = dtOriginalData.NewRow();
                                dr["TurbineId"] = row["Turbine"].ToString();
                                dr["CmrGroupName"] = row["Customer Group Name"].ToString();
                                dr["Customer"] = row["Customer"].ToString();
                                dr["TSite"] = row["Site"].ToString();
                                dr["FnLoc"] = row["Functional Location"].ToString();
                                dr["THeight"] = row["Tower Height"].ToString();
                                dr["TCapacity"] = row["Tower Capacity"].ToString();
                                dr["Blade"] = row["Blade"].ToString();
                                dr["Generator"] = row["Generator"].ToString();
                                dr["GRSlno"] = row["Generator Serial Number"].ToString();
                                dr["GearBox"] = row["Gear Box"].ToString();
                                dr["GBSlno"] = row["Gear Box Serial Number"].ToString();
                                dr["DOC"] = row["Date Of Construction"].ToString();
                                dr["Temp"] = row["Temp"].ToString();
                                dr["Dust"] = row["Dust"].ToString();
                                dr["WTGType"] = row["WTG Type"].ToString();
                                dr["Corrosion"] = row["Corrosion"].ToString();
                                dr["SWVersion"] = row["Software Version"].ToString();
                                dr["HWVersion"] = row["Hardware Version"].ToString();
                                dr["ScadaName"] = row["Scada Name"].ToString();
                                dr["Location"] = row["Location"].ToString();
                                dtOriginalData.Rows.Add(dr);
                            }
                        }
                        if (dtOriginalData.Rows.Count > 0)
                        {
                            turbineexcel.Turbine = dtOriginalData;
                            turbineexcel.FileName = uploadedExcelFile.FileName;
                            turbineexcel.Remarks = "";
                            turbineexcel.Submit = "0";
                            turbineexcel.TUId = TUId;
                            turbineexcel.RowId = "0";
                            turbineexcel.Delflag = "0";
                            Session["OriginalData"] = dtOriginalData;
                            result = oMasterManager.SetTurbineExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        }
                        else
                        {
                            result.message = new ExcelMessage();
                            result.message.Message = "Excel File Should not Empty!";
                            result.message.Clear = "False";
                        }

                    }
                    else
                    {
                        result.message = new ExcelMessage();
                        result.message.Message = "Upload .xlsx / .xls file only!";
                        result.message.Clear = "False";
                    }
                }
                else
                {
                    result.message = new ExcelMessage();
                    result.message.Message = "Upload Excel File!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new ExcelMessage();
                if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "1")
                    result.message.Message = ex.Message;
                else
                    result.message.Message = "Excel Upload Error";
                result.message.Clear = "False";
            }
            finally
            {
                con.Close();
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TurbineExcelSubmit(string TUId, string Remarks)
        {
            TurbineExcelSetResult result = new TurbineExcelSetResult();
            TurbineExcelModel turbineexcel = new TurbineExcelModel();
            //OleDbConnection con = new OleDbConnection();
            //OleDbCommand cmd = new OleDbCommand();
            //string connectionString = "", extension = "";
            try
            {

                DataTable dtOriginalData = (DataTable)Session["OriginalData"];

                //string strUploadUrl = ConfigurationManager.AppSettings["FileUploadUrl"].ToString();

                //if (Session["_ExcelTurbine"] != null)
                //{
                //    HttpPostedFileBase uploadedExcelFile = Session["_ExcelTurbine"] as HttpPostedFileBase;
                //    Session["_ExcelTurbine"] = null;
                //    extension = uploadedExcelFile.FileName.Split('.')[uploadedExcelFile.FileName.Split('.').Length - 1];
                //    string uploaderUrl = string.Format("{0}Turbine/{1}", strUploadUrl, uploadedExcelFile.FileName);
                //    if (extension == "xls" || extension == "xlsx")
                //    {
                //        if (extension == "xls")
                //            connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                //        else if (extension == "xlsx")
                //            connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";

                //        con.ConnectionString = connectionString;
                //        cmd.CommandType = System.Data.CommandType.Text;
                //        cmd.Connection = con;
                //        OleDbDataAdapter dAdapter = new OleDbDataAdapter(cmd);
                //        con.Open();
                //        DataTable dt = con.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, new object[] { null, null, null, "TABLE" });
                //        string getExcelSheetName = dt.Rows[0]["Table_Name"].ToString();
                //        cmd.CommandText = "SELECT * FROM [" + getExcelSheetName + "]";
                //        dAdapter.SelectCommand = cmd;
                //        dt = new DataTable();
                //        dt.Columns.Add("Turbine", typeof(string));
                //        dt.Columns.Add("CustomerGroup", typeof(string));
                //        dt.Columns.Add("Customer", typeof(string));
                //        dt.Columns.Add("Site", typeof(string));
                //        dt.Columns.Add("Functional Location", typeof(string));
                //        dt.Columns.Add("Tower Height", typeof(string));
                //        dt.Columns.Add("Tower Capacity", typeof(string));
                //        dt.Columns.Add("Blade", typeof(string));
                //        dt.Columns.Add("Generator", typeof(string));
                //        dt.Columns.Add("Generator Serial Number", typeof(string));
                //        dt.Columns.Add("Gear Box", typeof(string));
                //        dt.Columns.Add("Gear Box Serial Number", typeof(string));
                //        dt.Columns.Add("Date Of Construction", typeof(string));
                //        dt.Columns.Add("Temp", typeof(string));
                //        dt.Columns.Add("Dust", typeof(string));
                //        dt.Columns.Add("WTG Type", typeof(string));
                //        dt.Columns.Add("Corrosion", typeof(string));
                //        dt.Columns.Add("Software Version", typeof(string));
                //        dt.Columns.Add("Hardware Version", typeof(string));
                //        dt.Columns.Add("ScadaName", typeof(string));
                //        dt.Columns.Add("Location", typeof(string));
                //        for (int i = 0; i < dt.Columns.Count; i++)
                //            dt.Columns[i].DataType = typeof(string);
                //        dAdapter.Fill(dt);
                if (dtOriginalData.Rows.Count > 0)
                {
                    turbineexcel.Turbine = dtOriginalData;
                    turbineexcel.FileName = "";
                    turbineexcel.Remarks = Remarks;
                    turbineexcel.Submit = "1";
                    turbineexcel.TUId = TUId;
                    turbineexcel.RowId = "0";
                    turbineexcel.Delflag = "0";
                    result = oMasterManager.SetTurbineExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                }
                //        else
                //        {
                //            result.message = new ExcelMessage();
                //            result.message.Message = "Excel File Should not Empty!";
                //            result.message.Clear = "False";
                //        }
                //        con.Close();
                //    }
                //    else
                //    {
                //        result.message = new ExcelMessage();
                //        result.message.Message = "Upload .xlsx / .xls file only!";
                //        result.message.Clear = "False";
                //    }
                //}
                //else
                //{
                //    result.message = new ExcelMessage();
                //    result.message.Message = "Upload Excel File!";
                //    result.message.Clear = "False";
                //}
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new ExcelMessage();
                if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "1")
                    result.message.Message = ex.Message;
                else
                    result.message.Message = "Excel Upload Error";
                result.message.Clear = "False";
            }
            //finally
            //{
            //    con.Close();
            //}
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FillData(string Data, string SessionId)
        {
            try
            {
                DataTable dtContent = null;
                dtContent = JsonConvert.DeserializeObject<DataTable>(Data);
                if (SessionId == "TurbineMast" && dtContent != null && dtContent.Rows.Count > 0)
                {
                    dtContent.Columns.RemoveAt(5);
                    if (dtContent.Columns.Contains("$$hashKey"))
                    {
                        dtContent.Columns.Remove("$$hashKey");
                    }
                }

                dtContent.TableName = SessionId;
                Session[SessionId] = dtContent;
                return Json("OK", JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json("ERROR", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DownloadExcel(string id = "")
        {
            DataTable _downloadData = Session[id] as DataTable;
            if (_downloadData != null)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(_downloadData);
                    wb.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    wb.Style.Font.Bold = true;

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename= " + id + ".xlsx");
                    using (MemoryStream MyMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(MyMemoryStream);
                        MyMemoryStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Manufacturer

        #region Actions

        [CheckRoleAccess]
        public ActionResult Manufacturer()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetManufacturers(ManufacturerModel manufacturer)
        {
            List<ManufacturerDetails> result = oMasterManager.GetManufacturers(manufacturer, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetManufacturers(ManufacturerModel manufacturer)
        {
            ManufacturerResult result = oMasterManager.SetManufacturers(manufacturer, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Turbine  Version Update

        #region Actions

        [CheckRoleAccess]
        public ActionResult TurbineVersionUpdate()
        {
            return View();
        }

        #endregion

        #region Methods

        public void UploadTurbineVerUpdateExcel()
        {
            Session["_ExcelTurbineVersion"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["_ExcelTurbineVersion"] = hpfBase;
            }
        }

        public JsonResult GetTurbineVerUpdate(TurbineModel turbine)
        {
            TurbineDetails result = oMasterManager.GetTurbine(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                if (result.TurbineDetail.Count != 0)
                {
                    result.TurbineDetail[0].EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTurbineVerUpdateExcelDown(TurbineModel turbine)
        {
            List<TurbineExcelDownload> result = oMasterManager.GetTurbineExcel(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            try
            {
                if (result.Count != 0)
                {
                    //  result[0].EngineerSapId = CookieManager.GetCookie(CookieManager.CookieName).logindetail.Employee + " - " + CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult SetTurbineVerUpdate(TurbineModel turbine)
        //{
        //    turbine.DOC = ConvertDate(turbine.DOC);
        //    TurbineResult result = oMasterManager.SetTurbine(turbine, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
        //    return Json(new { result }, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult GetTurbineVerUpdateExcel(TurbineVersUpdtModel turbineexcel)
        {
            TurbineVersionUpdateExcelGetResult result = oMasterManager.GetTurbineVersionUpdExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTurbineVerUpdateLoadStatus(TurbineVersUpdtModel turbineexcel)
        {
            List<TurbineVersionUpdateGetStatuss> result = oMasterManager.GetLoadStatus(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetTurbineVerUpdateExcel(string dt, string RowId, string FileName, string Remarks, string Submit, string TUId, string Delflag)
        {

            TurbineVersionUpdateSetResult result = new TurbineVersionUpdateSetResult();
            TurbineVersUpdtModel turbineexcel = new TurbineVersUpdtModel();
            try
            {
                DataTable dtOriginalData = new DataTable();
                dtOriginalData.Columns.Add("Turbine", typeof(string));
                dtOriginalData.Columns.Add("SCADAName", typeof(string));
                dtOriginalData.Columns.Add("Location", typeof(string));
                dtOriginalData.Columns.Add("FunctionLocation", typeof(string));
                dtOriginalData.Columns.Add("SWVersion", typeof(string));
                dtOriginalData.Columns.Add("FWVersion", typeof(string));
                dtOriginalData.Columns.Add("InstallationDate", typeof(string));
                dtOriginalData.Columns.Add("Generator", typeof(string));
                dtOriginalData.Columns.Add("Blade", typeof(string));
                dtOriginalData.Columns.Add("TemperatureType", typeof(string));
                dtOriginalData.Columns.Add("Towerheight", typeof(string));
                dtOriginalData.Columns.Add("Rotordiameter", typeof(string));
                dtOriginalData.Columns.Add("SiteName", typeof(string));
                dtOriginalData.Columns.Add("State", typeof(string));
                dtOriginalData.Columns.Add("CustomerGroup", typeof(string));
                dtOriginalData.Columns.Add("Customer", typeof(string));
                dtOriginalData.Columns.Add("DOC", typeof(string));
                DataTable dtContent = null;
                dtContent = JsonConvert.DeserializeObject<DataTable>(dt);
                //DataTable dta =(DataTable) Session["OriginalData"];
                foreach (DataRow row in dtContent.Rows)
                {
                    if (row["TurbineId"].ToString() != "")
                    {
                        if (TUId == "0" && RowId == row["RowId"].ToString()) { }
                        else
                        {
                            DataRow dr = dtOriginalData.NewRow();
                            dr["Turbine"] = row["TurbineId"].ToString();
                            dr["SCADAName"] = row["SCADAName"].ToString();
                            dr["Location"] = row["Location"].ToString();
                            dr["FunctionLocation"] = row["FunctionLocation"].ToString();
                            dr["SWVersion"] = row["SwVersion"].ToString();
                            dr["FWVersion"] = row["hwVersion"].ToString();
                            dr["InstallationDate"] = row["InstallationDate"].ToString();
                            dr["Generator"] = row["Generator"].ToString();
                            dr["Blade"] = row["Blade"].ToString();
                            dr["TemperatureType"] = row["TemperatureType"].ToString();
                            dr["Towerheight"] = row["Towerheight"].ToString();
                            dr["Rotordiameter"] = row["Rotordiameter"].ToString();
                            dr["SiteName"] = row["SiteName"].ToString();
                            dr["State"] = row["State"].ToString();
                            dr["CustomerGroup"] = row["CustomerGroup"].ToString();
                            dr["Customer"] = row["Customer"].ToString();
                            dr["DOC"] = row["DOC"].ToString();
                            dtOriginalData.Rows.Add(dr);
                        }
                    }
                }
                if (dtOriginalData.Rows.Count > 0)
                {
                    turbineexcel.TurbineUpdate = dtOriginalData;
                    turbineexcel.FileName = FileName;
                    turbineexcel.Remarks = Remarks;
                    turbineexcel.Submit = Submit;
                    turbineexcel.TUId = TUId;
                    turbineexcel.Delflag = Delflag;
                    turbineexcel.RowId = RowId;

                    result = oMasterManager.SetTurbineVersionUpdateExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

                }
                else
                {
                    result.message = new VersionUpdtExcelMessage();
                    result.message.Message = "Excel File Should not Empty!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new VersionUpdtExcelMessage();
                if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "1")
                    result.message.Message = ex.Message;
                else
                    result.message.Message = "Excel Upload Error";
                result.message.Clear = "False";
            }


            // DataTable dtOriginalData = (DataTable)Session["OriginalData"];
            //if (turbineexcel.Delflag == "1")
            //{
            //    for (int i = dtOriginalData.Rows.Count-1; i >= 0; i--)
            //    {
            //        DataRow dr = dtOriginalData.Rows[i];
            //        if (i + 1 == Convert.ToInt32(turbineexcel.RowId)) dr.Delete();
            //    }

            //    Session["OriginalData"] = dtOriginalData;
            //}
            //turbineexcel.TurbineUpdate = dtOriginalData;
            //TurbineVersionUpdateSetResult result = oMasterManager.SetTurbineVersionUpdateExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);


            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetTurbineVerUpdatePostExcel(TurbineVersUpdtModel turbineexcel)
        {
            // DataTable dtOriginalData = (DataTable)Session["OriginalData"];

            //   turbineexcel.TurbineUpdate = dtOriginalData;


            // turbineexcel.TurbineUpdate = dtOriginalData;
            // turbineexcel.FileName = FileName;
            //turbineexcel.Remarks = Remarks;
            //turbineexcel.Submit = Submit;
            //turbineexcel.TUId = TUId;
            //turbineexcel.RowId = "0";
            //turbineexcel.Delflag = "0";
            //turbineexcel.Status = Status;
            //turbineexcel.AssignTo = AssignTo;
            TurbineVersionUpdateSetResult result = oMasterManager.SetTurbineVersionUpdatePostExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TurbineVerUpdateExcelUpload(string TUId)
        {
            OleDbConnection con = new OleDbConnection();
            TurbineVersionUpdateSetResult result = new TurbineVersionUpdateSetResult();
            TurbineVersUpdtModel turbineexcel = new TurbineVersUpdtModel();
            OleDbCommand cmd = new OleDbCommand();
            string connectionString = "", extension = "";
            try
            {
                string strUploadUrl = ConfigurationManager.AppSettings["FileUploadUrl"].ToString();
                if (Session["_ExcelTurbineVersion"] != null)
                {
                    HttpPostedFileBase uploadedExcelFile = Session["_ExcelTurbineVersion"] as HttpPostedFileBase;
                    extension = uploadedExcelFile.FileName.Split('.')[uploadedExcelFile.FileName.Split('.').Length - 1];
                    if (extension == "xls" || extension == "xlsx")
                    {
                        var stream = uploadedExcelFile.InputStream;
                        string uploaderUrl = string.Format("{0}Turbine/{1}", strUploadUrl, uploadedExcelFile.FileName);
                        using (var fileStream = System.IO.File.Create(uploaderUrl))
                            stream.CopyTo(fileStream);
                        if (extension == "xls")
                            connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                        else if (extension == "xlsx")
                            connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";


                        con.ConnectionString = connectionString;
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.Connection = con;
                        OleDbDataAdapter dAdapter = new OleDbDataAdapter(cmd);
                        con.Open();
                        DataTable dt = con.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                        string getExcelSheetName = dt.Rows[0]["Table_Name"].ToString();


                        //   Excel._Worksheet workSheet = (Microsoft.Office.Interop.Excel.Worksheet)wb.Sheets[1];//["Sheet1"];//wb .ActiveSheet  //(Microsoft .Office .Interop .Excel) excelApp.ActiveSheet;


                        //String[] SheetsName = new String[dt.Rows.Count];
                        //int i = 0;


                        //foreach (DataRow row in dt.Rows)
                        //{
                        //    SheetsName[i] = row["TABLE_NAME"].ToString();
                        //    i++;
                        //}
                        //string getExcelSheetName1 = SheetsName[dt.Rows.Count - 1].ToString();
                        cmd.CommandText = "SELECT * FROM [" + getExcelSheetName + "]";
                        dAdapter.SelectCommand = cmd;
                        dt = new DataTable();

                        dAdapter.Fill(dt);
                        DataTable dtOriginalData = new DataTable();
                        dtOriginalData.Columns.Add("Turbine", typeof(string));
                        dtOriginalData.Columns.Add("SCADAName", typeof(string));
                        dtOriginalData.Columns.Add("Location", typeof(string));
                        dtOriginalData.Columns.Add("FunctionLocation", typeof(string));
                        dtOriginalData.Columns.Add("SWVersion", typeof(string));
                        dtOriginalData.Columns.Add("FWVersion", typeof(string));
                        dtOriginalData.Columns.Add("InstallationDate", typeof(string));
                        dtOriginalData.Columns.Add("Generator", typeof(string));
                        dtOriginalData.Columns.Add("Blade", typeof(string));
                        dtOriginalData.Columns.Add("TemperatureType", typeof(string));
                        dtOriginalData.Columns.Add("Towerheight", typeof(string));
                        dtOriginalData.Columns.Add("Rotordiameter", typeof(string));
                        dtOriginalData.Columns.Add("SiteName", typeof(string));
                        dtOriginalData.Columns.Add("State", typeof(string));
                        dtOriginalData.Columns.Add("CustomerGroup", typeof(string));
                        dtOriginalData.Columns.Add("Customer", typeof(string));
                        dtOriginalData.Columns.Add("DOC", typeof(string));
                        foreach (DataRow row in dt.Rows)
                        {

                            if (row["Turbine"].ToString() != "")
                            {
                                DataRow dr = dtOriginalData.NewRow();
                                try { dr["Turbine"] = row["Turbine"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["SCADAName"] = row["SCADA Name"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["Location"] = row["Location"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["FunctionLocation"] = row["Function Location"].ToString(); }
                                catch (Exception exx) { }

                                try { dr["SWVersion"] = row["Software version available"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["FWVersion"] = row["CCU Firmware"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["InstallationDate"] = row["Installation date"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["Generator"] = row["Generator"].ToString(); }
                                catch (Exception exx) { dr["Generator"] = ""; }
                                try { dr["Blade"] = row["Blade"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["TemperatureType"] = row["Temperature Type"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["Towerheight"] = row["Tower height"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["Rotordiameter"] = row["Rotor diameter"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["SiteName"] = row["Site"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["State"] = row["State"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["CustomerGroup"] = row["Customer Group"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["Customer"] = row["Customer"].ToString(); }
                                catch (Exception exx) { }
                                try { dr["DOC"] = row["DoC"].ToString(); }
                                catch (Exception exx) { }
                                dtOriginalData.Rows.Add(dr);
                            }
                        }
                        if (dtOriginalData.Rows.Count > 0)
                        {
                            turbineexcel.TurbineUpdate = dtOriginalData;
                            turbineexcel.FileName = uploadedExcelFile.FileName;
                            turbineexcel.Remarks = "";
                            turbineexcel.Submit = "0";
                            turbineexcel.TUId = TUId;
                            turbineexcel.RowId = "0";
                            turbineexcel.Delflag = "0";
                            //  Session["OriginalData"] = dtOriginalData;
                            result = oMasterManager.SetTurbineVersionUpdateExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        }
                        else
                        {
                            result.message = new VersionUpdtExcelMessage();
                            result.message.Message = "Excel File Should not Empty!";
                            result.message.Clear = "False";
                        }

                    }
                    else
                    {
                        result.message = new VersionUpdtExcelMessage();
                        result.message.Message = "Upload .xlsx / .xls file only!";
                        result.message.Clear = "False";
                    }
                }
                else
                {
                    result.message = new VersionUpdtExcelMessage();
                    result.message.Message = "Upload Excel File!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)

            {
                logger.Error(ex.Message);
                result.message = new VersionUpdtExcelMessage();
                if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "1")
                    result.message.Message = ex.Message;
                else
                    result.message.Message = "Excel Upload Error";
                result.message.Clear = "False";
            }
            finally
            {
                con.Close();
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TurbineVerUpdateExcelSubmit(string dt, string FileName, string TUId, string Remarks, string Status, string AssignTo, string Submit, string TbnIds)
        {
            TurbineVersionUpdateSetResult result = new TurbineVersionUpdateSetResult();
            TurbineVersUpdtModel turbineexcel = new TurbineVersUpdtModel();
            try
            {
                DataTable dtOriginalData = new DataTable();
                dtOriginalData.Columns.Add("Turbine", typeof(string));
                dtOriginalData.Columns.Add("SCADAName", typeof(string));
                dtOriginalData.Columns.Add("Location", typeof(string));
                dtOriginalData.Columns.Add("FunctionLocation", typeof(string));
                dtOriginalData.Columns.Add("SWVersion", typeof(string));
                dtOriginalData.Columns.Add("FWVersion", typeof(string));
                dtOriginalData.Columns.Add("InstallationDate", typeof(string));
                dtOriginalData.Columns.Add("Generator", typeof(string));
                dtOriginalData.Columns.Add("Blade", typeof(string));
                dtOriginalData.Columns.Add("TemperatureType", typeof(string));
                dtOriginalData.Columns.Add("Towerheight", typeof(string));
                dtOriginalData.Columns.Add("Rotordiameter", typeof(string));
                dtOriginalData.Columns.Add("SiteName", typeof(string));
                dtOriginalData.Columns.Add("State", typeof(string));
                dtOriginalData.Columns.Add("CustomerGroup", typeof(string));
                dtOriginalData.Columns.Add("Customer", typeof(string));
                dtOriginalData.Columns.Add("DOC", typeof(string));
                DataTable dtContent = null;
                dtContent = JsonConvert.DeserializeObject<DataTable>(dt);
                //DataTable dta =(DataTable) Session["OriginalData"];
                foreach (DataRow row in dtContent.Rows)
                {
                    if (row["TurbineId"].ToString() != "")
                    {
                        DataRow dr = dtOriginalData.NewRow();
                        dr["Turbine"] = row["TurbineId"].ToString();
                        dr["SCADAName"] = row["SCADAName"].ToString();
                        dr["Location"] = row["Location"].ToString();
                        dr["FunctionLocation"] = row["FunctionLocation"].ToString();
                        dr["SWVersion"] = row["SwVersion"].ToString();
                        dr["FWVersion"] = row["hwVersion"].ToString();
                        dr["InstallationDate"] = row["InstallationDate"].ToString();
                        dr["Generator"] = row["Generator"].ToString();
                        dr["Blade"] = row["Blade"].ToString();
                        dr["TemperatureType"] = row["TemperatureType"].ToString();
                        dr["Towerheight"] = row["Towerheight"].ToString();
                        dr["Rotordiameter"] = row["Rotordiameter"].ToString();
                        dr["SiteName"] = row["SiteName"].ToString();
                        dr["State"] = row["State"].ToString();
                        dr["CustomerGroup"] = row["CustomerGroup"].ToString();
                        dr["Customer"] = row["Customer"].ToString();
                        dr["DOC"] = row["DOC"].ToString();
                        dtOriginalData.Rows.Add(dr);
                    }
                }
                if (dtOriginalData.Rows.Count > 0)
                {
                    turbineexcel.TurbineUpdate = dtOriginalData;
                    turbineexcel.FileName = FileName;
                    turbineexcel.Remarks = Remarks;
                    turbineexcel.Submit = Submit;
                    turbineexcel.TUId = TUId;
                    turbineexcel.RowId = "0";
                    turbineexcel.Delflag = "0";
                    turbineexcel.Status = Status;
                    turbineexcel.AssignTo = AssignTo;
                    turbineexcel.TbnId = TbnIds;
                    result = oMasterManager.SetTurbineVersionUpdateExcel(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

                }
                else
                {
                    result.message = new VersionUpdtExcelMessage();
                    result.message.Message = "Excel File Should not Empty!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new VersionUpdtExcelMessage();
                if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "1")
                    result.message.Message = ex.Message;
                else
                    result.message.Message = "Excel Upload Error";
                result.message.Clear = "False";
            }
            //finally
            //{
            //    con.Close();
            //}
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FillDataTurbineVerUpdate(string Data, string SessionId)
        {
            try
            {
                DataTable dtContent = null;
                dtContent = JsonConvert.DeserializeObject<DataTable>(Data);
                // if (SessionId == "TurbineMast" && dtContent != null && dtContent.Rows.Count > 0)
                {
                    //dtContent.Columns.RemoveAt(5);
                    //if (dtContent.Columns.Contains("c"))
                    //{
                    //    dtContent.Columns.Remove("$$hashKey");
                    //}
                }

                dtContent.TableName = SessionId;
                Session[SessionId] = dtContent;
                return Json("OK", JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json("ERROR", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DownloadTurbineVerUpdateExcel(string id = "")
        {
            DataTable _downloadData = Session[id] as DataTable;
            if (_downloadData != null)
            {
                using (XLWorkbook wb = new XLWorkbook())
                {
                    wb.Worksheets.Add(_downloadData);
                    wb.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                    wb.Style.Font.Bold = true;

                    Response.Clear();
                    Response.Buffer = true;
                    Response.Charset = "";
                    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    Response.AddHeader("content-disposition", "attachment;filename= " + id + ".xlsx");
                    using (MemoryStream MyMemoryStream = new MemoryStream())
                    {
                        wb.SaveAs(MyMemoryStream);
                        MyMemoryStream.WriteTo(Response.OutputStream);
                        Response.Flush();
                        Response.End();
                    }
                }
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadFileName(TurbineVersUpdtModel turbineexcel)
        {
            List<TurbineVersionUpdateExcelDetails> result = oMasterManager.GetLoadFilename(turbineexcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region SMP Data System

        [CheckRoleAccess]
        public ActionResult SMPData()
        {
            return View();
        }

        public void UploadSMPDataExcel()
        {
            Session["_ExcelSMPDataSystem"] = null;
            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpfBase = Request.Files[file] as HttpPostedFileBase;
                Session["_ExcelSMPDataSystem"] = hpfBase;
            }
        }

        public JsonResult GetSMPDataExcel(SMPDataUpdtModel SMPDataExcel)
       {
            SMPDataExcelGetResult result = oMasterManager.GetSMPDataUpdExcel(SMPDataExcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SMPDataExcelUpload(string SUId)
        {
            OleDbConnection con = new OleDbConnection();

            SMPDataExcelSetResult result = new SMPDataExcelSetResult();
            SMPDataExcelModel SMPExcel = new SMPDataExcelModel();

            OleDbCommand cmd = new OleDbCommand();
            string connectionString = "", extension = "";
            try
            {
                string strUploadUrl = ConfigurationManager.AppSettings["FileUploadUrl"].ToString();
                if (Session["_ExcelSMPDataSystem"] != null)
                {
                    HttpPostedFileBase uploadedExcelFile = Session["_ExcelSMPDataSystem"] as HttpPostedFileBase;
                    extension = uploadedExcelFile.FileName.Split('.')[uploadedExcelFile.FileName.Split('.').Length - 1];
                    if (extension == "xls" || extension == "xlsx")
                    {
                        var stream = uploadedExcelFile.InputStream;
                        string uploaderUrl = string.Format("{0}/{1}", strUploadUrl, uploadedExcelFile.FileName);
                        using (var fileStream = System.IO.File.Create(uploaderUrl))
                            stream.CopyTo(fileStream);
                        if (extension == "xls")
                            connectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                        else if (extension == "xlsx")
                            connectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + uploaderUrl + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";


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
                        dAdapter.Fill(dt);

                        if (dt.Rows.Count > 0)
                        {
                            DataTable dtNewTable = new DataTable();
                            dtNewTable.Columns.Add("TurbineId", typeof(string));
                            dtNewTable.Columns.Add("State", typeof(string));
                            dtNewTable.Columns.Add("Site", typeof(string));
                            dtNewTable.Columns.Add("Model", typeof(string));
                            dtNewTable.Columns.Add("Location", typeof(string));
                            dtNewTable.Columns.Add("FnLoc", typeof(string));
                            dtNewTable.Columns.Add("FunctionalDescription", typeof(string));
                            dtNewTable.Columns.Add("PlannedDate", typeof(string));
                            dtNewTable.Columns.Add("CompletedOn", typeof(string));
                            dtNewTable.Columns.Add("ValidationDate", typeof(string));
                            dtNewTable.Columns.Add("ValidationStatus", typeof(string));
                            dtNewTable.Columns.Add("DeviationPlanVsActual", typeof(string));
                            dtNewTable.Columns.Add("ReportsGeneratedOn", typeof(string));
                            dtNewTable.Columns.Add("RecommendedActionsState", typeof(string));
                            dtNewTable.Columns.Add("RecommendedActions", typeof(string));
                            dtNewTable.Columns.Add("RecommendedActionsObservations", typeof(string));
                            dtNewTable.Columns.Add("RecommendedActionsWONumber", typeof(string));
                            dtNewTable.Columns.Add("RecommendedActionsCompletedDate", typeof(string));
                            if (dt.Rows.Count > 0)
                            {
                                dt.Rows.RemoveAt(1);
                                dt.Rows.RemoveAt(2);
                            }
                            foreach (DataRow dr in dt.Rows)
                            {
                                DataRow newDr = dtNewTable.NewRow();
                                if (!string.IsNullOrEmpty(dr[0].ToString()) && !string.IsNullOrEmpty(dr[5].ToString()))
                                {
                                    newDr["TurbineId"] = dr[5].ToString().Trim();
                                    newDr["State"] = dr[1].ToString().Trim();
                                    newDr["Site"] = dr[2].ToString().Trim();
                                    newDr["Model"] = dr[3].ToString().Trim();
                                    newDr["Location"] = dr[4].ToString().Trim();
                                    newDr["FnLoc"] = dr[6].ToString().Trim();
                                    newDr["FunctionalDescription"] = dr[7].ToString().Trim();
                                    newDr["PlannedDate"] = dr[8].ToString().Trim();
                                    newDr["CompletedOn"] = dr[9].ToString().Trim();
                                    newDr["ValidationDate"] = dr[10].ToString().Trim();
                                    newDr["ValidationStatus"] = dr[11].ToString().Trim();
                                    newDr["DeviationPlanVsActual"] = dr[12].ToString().Trim();
                                    newDr["ReportsGeneratedOn"] = dr[13].ToString().Trim();
                                    newDr["RecommendedActionsState"] = dr[14].ToString().Trim();
                                    newDr["RecommendedActions"] = dr[15].ToString().Trim();
                                    newDr["RecommendedActionsObservations"] = dr[16].ToString().Trim();
                                    newDr["RecommendedActionsWONumber"] = dr[17].ToString().Trim();
                                    newDr["RecommendedActionsCompletedDate"] = dr[18].ToString().Trim();
                                    dtNewTable.Rows.Add(newDr);
                                }
                            }
                            SMPExcel.SMPDataUpload = dtNewTable;
                            SMPExcel.FileName = uploadedExcelFile.FileName;
                            SMPExcel.Comments = "";
                            SMPExcel.Submit = "0";
                            SMPExcel.SUId = SUId;
                            SMPExcel.RowId = "0";
                            SMPExcel.Delflag = "0";
                            result = oMasterManager.SetSMPDataUpdateExcel(SMPExcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                        }
                        else
                        {
                            result.message = new SMPDataUpdateExcelMessage();
                            result.message.Message = "Excel File Should not Empty!";
                            result.message.Clear = "False";
                        }
                    }
                    else
                    {
                        result.message = new SMPDataUpdateExcelMessage();
                        result.message.Message = "Upload .xlsx / .xls file only!";
                        result.message.Clear = "False";
                    }
                }
                else
                {
                    result.message = new SMPDataUpdateExcelMessage();
                    result.message.Message = "Upload Excel File!";
                    result.message.Clear = "False";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new SMPDataUpdateExcelMessage();
                if (CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId == "1")
                    result.message.Message = ex.Message;
                else
                    result.message.Message = "Excel Upload Error";
                result.message.Clear = "False";
            }
            finally
            {
                con.Close();
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SMPDataExcelSubmit(string SUId, string Remarks, string FileName, string smpData, string fileNameManual, string comments, string status, string assignTo)
        {

            SMPDataExcelSetResult result = new SMPDataExcelSetResult();
            SMPDataExcelModel SMPExcel = new SMPDataExcelModel();
            try
            {
                DataTable smpDataExcel = null;
                smpDataExcel = JsonConvert.DeserializeObject<DataTable>(smpData);
                DataTable dtNewTable = new DataTable();
                dtNewTable.Columns.Add("TurbineId", typeof(string));
                dtNewTable.Columns.Add("State", typeof(string));
                dtNewTable.Columns.Add("Site", typeof(string));
                dtNewTable.Columns.Add("Model", typeof(string));
                dtNewTable.Columns.Add("Location", typeof(string));
                dtNewTable.Columns.Add("FnLoc", typeof(string));
                dtNewTable.Columns.Add("FunctionalDescription", typeof(string));
                dtNewTable.Columns.Add("PlannedDate", typeof(string));
                dtNewTable.Columns.Add("CompletedOn", typeof(string));
                dtNewTable.Columns.Add("ValidationDate", typeof(string));
                dtNewTable.Columns.Add("ValidationStatus", typeof(string));
                dtNewTable.Columns.Add("DeviationPlanVsActual", typeof(string));
                dtNewTable.Columns.Add("ReportsGeneratedOn", typeof(string));
                dtNewTable.Columns.Add("RecommendedActionsState", typeof(string));
                dtNewTable.Columns.Add("RecommendedActions", typeof(string));
                dtNewTable.Columns.Add("RecommendedActionsObservations", typeof(string));
                dtNewTable.Columns.Add("RecommendedActionsWONumber", typeof(string));
                dtNewTable.Columns.Add("RecommendedActionsCompletedDate", typeof(string));
                foreach (DataRow row in smpDataExcel.Rows)
                {
                    if (!string.IsNullOrEmpty(row["TurbineId"].ToString()))
                    {
                        DataRow dr = dtNewTable.NewRow();
                        dr["TurbineId"] = row["TurbineId"].ToString();
                        dr["State"] = row["State"].ToString();
                        dr["Site"] = row["Site"].ToString();
                        dr["Model"] = row["Model"].ToString();
                        dr["Location"] = row["Location"].ToString();
                        dr["FnLoc"] = row["FnLoc"].ToString();
                        dr["FunctionalDescription"] = row["FunctionalDescription"].ToString();
                        dr["PlannedDate"] = row["PlannedDate"].ToString();
                        dr["CompletedOn"] = row["CompletedOn"].ToString();
                        dr["ValidationDate"] = row["ValidationDate"].ToString();
                        dr["ValidationStatus"] = row["ValidationStatus"].ToString();
                        dr["DeviationPlanVsActual"] = row["DeviationPlanVsActual"].ToString();
                        dr["ReportsGeneratedOn"] = row["ReportsGeneratedOn"].ToString();
                        dr["RecommendedActionsState"] = row["RecommendedActionsState"].ToString();
                        dr["RecommendedActions"] = row["RecommendedActions"].ToString();
                        dr["RecommendedActionsObservations"] = row["RecommendedActionsObservations"].ToString();
                        dr["RecommendedActionsWONumber"] = row["RecommendedActionsWONumber"].ToString();
                        dr["RecommendedActionsCompletedDate"] = row["RecommendedActionsCompleted"].ToString();
                        dtNewTable.Rows.Add(dr);
                    }
                }

                if (dtNewTable != null && dtNewTable.Rows.Count > 0)
                {
                    SMPExcel.Delflag = "0";
                    SMPExcel.SMPDataUpload = dtNewTable;
                    SMPExcel.FileNameManual = fileNameManual;
                    SMPExcel.FileName = FileName;
                    SMPExcel.Comments = comments;
                    SMPExcel.Submit = "1";
                    SMPExcel.SUId = SUId;
                    SMPExcel.RowId = "0";
                    SMPExcel.Delflag = "0";
                    SMPExcel.Status = status;
                    SMPExcel.AssignTo = assignTo;
                    result = oMasterManager.SetSMPDataUpdateExcel(SMPExcel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                }
                else
                {
                    result.message = new SMPDataUpdateExcelMessage();
                    result.message.Message = "Excel File Should not Empty!";
                    result.message.Clear = "False";
                }
                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.message = new SMPDataUpdateExcelMessage();
                result.message.Message = "Error in uploading the excel file.";
                result.message.Clear = "False";
                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SMPDataSingleSave(SMPDataExcelDetails smpDataExcelDetails)
        {
            Message result = oMasterManager.SMPDataSingleSaveDetail(smpDataExcelDetails, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetSMPAssignDetails(string uploadId, string statusId, string viewType)
        {
            List<ExcelStatusOrAssignDetails> result = oMasterManager.GetSMPAssignDetails(uploadId, statusId, viewType, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCommentsForSMPData(string uploadId)
        {
            List<SMPDataComments> result = oMasterManager.GetCommentsForSMPData(uploadId, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}