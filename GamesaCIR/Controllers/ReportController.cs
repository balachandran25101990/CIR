using CIR.DataAccess;
using CIR.DomainModel;
using ClosedXML.Excel;
using GamesaCIR.App_Code;
using GamesaCIR.Filters;
using GamesaCIR.Helper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Web.Mvc;
using System.Reflection;
using System.ComponentModel;
using Ionic.Zip;

namespace GamesaCIR.Controllers
{
    public class ReportController : Controller
    {

        #region Global Variables

        MainClass mc = new MainClass();
        clsProLib pl = new clsProLib();
        ReportManager oReportManager = new ReportManager();
        CIRManager OCIRManager = new CIRManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ReportController));

        #endregion

        #region Global Methods

        public ReportController()
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

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }

        private DataTable GenerateTransposedTable(DataTable inputTable)
        {
            DataTable outputTable = new DataTable();

            // Add columns by looping rows

            // Header row's first column is same as in inputTable
            outputTable.Columns.Add(inputTable.Columns[0].ColumnName.ToString());

            // Header row's second column onwards, 'inputTable's first column taken
            foreach (DataRow inRow in inputTable.Rows)
            {
                string newColName = inRow[0].ToString();
                outputTable.Columns.Add(newColName);
            }

            // Add rows by looping columns        
            for (int rCount = 1; rCount <= inputTable.Columns.Count - 1; rCount++)
            {
                DataRow newRow = outputTable.NewRow();

                // First column is inputTable's Header row's second column
                newRow[0] = inputTable.Columns[rCount].ColumnName.ToString();
                for (int cCount = 0; cCount <= inputTable.Rows.Count - 1; cCount++)
                {
                    string colValue = inputTable.Rows[cCount][rCount].ToString();
                    newRow[cCount + 1] = colValue;
                }
                outputTable.Rows.Add(newRow);
            }

            return outputTable;
        }

        public JsonResult FillData(string SessionId)
        {
            try
            {
                DataTable dtContent = null;
                //dtContent = JsonConvert.DeserializeObject<DataTable>(Data);
                dtContent = Session["DetailRpt"] as DataTable;

                if (SessionId == "DetailRpt" && dtContent != null && dtContent.Rows.Count > 0)
                {
                    //if (dtContent.Rows[0][0].ToString().Trim() == string.Empty)
                    //{
                    //    dtContent.Columns.RemoveAt(0);
                    //}
                    //else
                    //{
                    //    dtContent.Columns.RemoveAt(1);
                    //}
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

        #region Summary Report 

        #region Actions

        [CheckRoleAccess]
        public ActionResult Index()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetSummaryDetails(ReportDetails reportDetails)
        {
            reportDetails.DateFrom = ConvertDate(reportDetails.DateFrom);
            reportDetails.DateTo = ConvertDate(reportDetails.DateTo);
            ReportModel result = oReportManager.GetSummaryReportDetails(reportDetails, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FillDataSumRpt(string Data, string SessionId)
        {
            try
            {
                DataTable dtContent = null;
                dtContent = JsonConvert.DeserializeObject<DataTable>(Data);
                if (SessionId == "SummaryRpt" && dtContent != null && dtContent.Rows.Count > 0)
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

        public JsonResult DownloadExcelSumRpt(string id = "")
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

        #region Report Print Details

        #region Actions

        public ActionResult ReportPrintDetails()
        {
            return View();
        }

        #endregion

        #endregion

        #region Detail Report

        #region Actions

        public ActionResult DetailReport()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetDetailReportDetails(ReportDetails reportDetails)
        {
            try
            {
                reportDetails.DateFrom = ConvertDate(reportDetails.DateFrom);
                reportDetails.DateTo = ConvertDate(reportDetails.DateTo);
                ReportModel result = oReportManager.GetDetailReportDetails(reportDetails, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

                var jsonResult = Json(new { result }, JsonRequestBehavior.AllowGet);
                jsonResult.MaxJsonLength = int.MaxValue;
                DataTable table = ConvertToDataTable(result.ExcelReport);
                Session["DetailRpt"] = table;
                return jsonResult;
            }
            catch
            {
                return null;
            }
        }
        public DataTable ConvertToDataTable<T>(IList<T> data)
        {
            try
            {
                PropertyDescriptorCollection properties =
               TypeDescriptor.GetProperties(typeof(T));
                DataTable table = new DataTable();
                foreach (PropertyDescriptor prop in properties)
                    table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                foreach (T item in data)
                {
                    DataRow row = table.NewRow();
                    foreach (PropertyDescriptor prop in properties)
                        row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                    table.Rows.Add(row);
                }
                return table;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public string SessionClearDetailRpt(string clear)
        {
            if ((Session["DetailRpt"] != null) || (Session["DetailRpt"] != ""))
            {
                Session["DetailRpt"] = "";
            }
            return null;
        }

        #endregion

        #endregion

        public ActionResult DownloadZipFiles(FormCollection form)
        {
            try
            {

                using (ZipFile zip = new ZipFile())
                {
                    zip.AlternateEncodingUsage = ZipOption.AsNecessary;

                    string strFilePath = System.Configuration.ConfigurationManager.AppSettings["FileExtractSource"].ToString();
                    CIRModelResult result = OCIRManager.GetCIRDetails(form[0], CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

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
                        foreach (var item in result.CIRFileDetail)
                        {
                            if (form.AllKeys[0] == "hdnCIRNumber")
                            {
                                if (Convert.ToBoolean(item.IsImage))
                                    zip.AddFile(strFilePath + "\\" + item.CIRNumber + "\\" + item.FileName);
                            }
                            else
                            {
                                if (!Convert.ToBoolean(item.IsImage))
                                    zip.AddFile(strFilePath + "\\" + item.CIRNumber + "\\" + item.FileName);
                            }
                        }
                        Response.Clear();
                        Response.BufferOutput = false;
                        string zipName = String.Format("Zip_{0}.zip", DateTime.Now.ToString("yyyy-MMM-dd-HHmmss"));
                        Response.ContentType = "application/zip";
                        Response.AddHeader("content-disposition", "attachment; filename=" + zipName);
                        zip.Save(Response.OutputStream);
                        Response.End();
                    }
                }
                return Json(JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return Json(JsonRequestBehavior.AllowGet);

            }
        }

        #region CIR Analytics

            #region Actions

        public ActionResult CIRAnalytics()
        {
            ViewBag.DefaultStateId = pl.DefaultStateId;
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetCIRAnalyticsDetails(AnalyticsReport rptDetails)
        {
            rptDetails.DateFrm = ConvertDate(rptDetails.DateFrm);
            rptDetails.DateTo = ConvertDate(rptDetails.DateTo);
            AnalyticsModel result = oReportManager.GetCIRAnalyticsDetails(rptDetails, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region CIR Pending Analytics

        #region Actions

        public ActionResult CIRPendingAnalytics()
        {
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetCIRPendingAnalyticsDetails(AnalyticsReport rptDetails)
        {
            rptDetails.DateFrm = ConvertDate(rptDetails.DateFrm);
            rptDetails.DateTo = ConvertDate(rptDetails.DateTo);
            CIRPendingAnalyticsModel result = oReportManager.GetCIRPendingAnalyticsDetails(rptDetails, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region Stacked Bar Chart Analytics

        #region Actions

        public ActionResult CIRStackedAnalytics()
        {
            //ViewBag.DefaultStateId = pl.DefaultStateId;
            return View();
        }

        #endregion

        #region Methods

        public JsonResult GetCIRStackedAnalyticsDetails(AnalyticsReport rptDetails)
        {
            string Data1 = "";
            DataTable dtNew = null;

            rptDetails.DateFrm = ConvertDate(rptDetails.DateFrm);
            rptDetails.DateTo = ConvertDate(rptDetails.DateTo);
            CIRPendingAnalyticsModel result = oReportManager.GetCIRPendingAnalyticsDetails(rptDetails, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);

            if (result.AnalyticsPointDetails != null && result.AnalyticsPointDetails.Count > 0)
            {
                DataTable dt = ToDataTable<CIRPendingAnalyticsPointDetails>(result.AnalyticsPointDetails);
                dtNew = GenerateTransposedTable(dt);
                if (dtNew.Rows.Count > 0)
                {
                    string _tmpLabel = "", _tmpDataValue = "";
                    DataTable dtFinal = new DataTable();
                    dtFinal.Clear();
                    dtFinal.Columns.Add("Label");
                    dtFinal.Columns.Add("Data");
                   /// dtFinal.Columns.Add("BackgroundColor");

                    for (int i = 0; i < dtNew.Rows.Count; i++)
                    {
                        _tmpLabel = _tmpDataValue = "";
                        for (int rCount = 1; rCount < dtNew.Columns.Count; rCount++)
                        {
                            _tmpLabel = dtNew.Rows[i][0].ToString();
                            _tmpDataValue += _tmpDataValue.Length > 0 ? "," + dtNew.Rows[i][rCount].ToString() : dtNew.Rows[i][rCount].ToString();
                        }
                        DataRow _row = dtFinal.NewRow();
                        _row["Label"] = _tmpLabel;
                        _row["Data"] = _tmpDataValue;
                        dtFinal.Rows.Add(_row);
                    }
                    Data1 = JsonConvert.SerializeObject(dtFinal);
                }
            }
            return Json(new { Data1, result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion

        #region DMAnalyticsReport

        public ActionResult DMAnalyticsReport()
        {
            return View();
        }

        public JsonResult GetDMAnalyticsDetails(DMAnalyticsModel reportDetails)
        {
            string Data1 = "";
            DataTable dtNew = null;
            DMAnalyticsReult result = oReportManager.GetDMAnalyticsReportDetails(reportDetails, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
            if (result.DMAnalyticsDetail != null && result.DMAnalyticsDetail.Count > 0)
            {
                DataTable dt = ToDataTable<DMAnalyticsDetail>(result.DMAnalyticsDetail);
                dtNew = GenerateTransposedTable(dt);
                if (dtNew.Rows.Count > 0)
                {
                    string _tmpLabel = "", _tmpDataValue = "";
                    DataTable dtFinal = new DataTable();
                    dtFinal.Clear();
                    dtFinal.Columns.Add("Label");
                    dtFinal.Columns.Add("Data");

                    for (int i = 0; i < dtNew.Rows.Count; i++)
                    {
                        _tmpLabel = _tmpDataValue = "";
                        for (int rCount = 1; rCount < dtNew.Columns.Count; rCount++)
                        {
                            _tmpLabel = dtNew.Rows[i][0].ToString();
                            _tmpDataValue += _tmpDataValue.Length > 0 ? "," + dtNew.Rows[i][rCount].ToString() : dtNew.Rows[i][rCount].ToString();
                        }
                        DataRow _row = dtFinal.NewRow();
                        _row["Label"] = _tmpLabel;
                        _row["Data"] = _tmpDataValue;
                        dtFinal.Rows.Add(_row);
                    }
                    Data1 = JsonConvert.SerializeObject(dtFinal);
                }
            }
            return Json(new { Data1,result }, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}