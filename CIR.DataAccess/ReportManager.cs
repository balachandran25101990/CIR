using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using CIR.DomainModel;
using System.Data;

namespace CIR.DataAccess
{
    public class ReportManager : MainClass
    {

        #region Global Variables 
        
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(ReportManager));

        #endregion

        #region Summary report details

        /// <summary>
        /// Get the Summary report detais based on the search parameter.
        /// </summary>
        /// <param name="reportDetails">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public ReportModel GetSummaryReportDetails(ReportDetails reportDetails, string loginUserId)
        {
            ReportModel oReportModel = new ReportModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_Summary", new
                    {
                        RptType = reportDetails.RptType,
                        StateId = reportDetails.StateId,
                        SiteId = reportDetails.SiteId,
                        TurbinTypeId = reportDetails.TurbineTypeId,
                        DptId = reportDetails.DptId,
                        CStatusId = reportDetails.CStatusId,
                        TbnId = reportDetails.TbnId == null ? "0" : reportDetails.TbnId,
                        State = reportDetails.State,
                        Site = reportDetails.Site,
                        TurbineType = reportDetails.TurbineType,
                        Dept = reportDetails.Dept,
                        CStatus = reportDetails.CStatus,
                        Turbine = reportDetails.Turbine,
                        DateFrom = reportDetails.DateFrom,
                        DateTo = reportDetails.DateTo,
                        UId = loginUserId,
                    }, commandType: CommandType.StoredProcedure);
                    oReportModel.SummaryReports = result.Read<SummaryReport>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Report", MethodName = "GetSummaryReportDetails", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oReportModel;
        }

        #endregion

        #region Detail Report Details

        /// <summary>
        /// Get the Detail report details based on the report search parameter.
        /// </summary>
        /// <param name="reportDetails">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public ReportModel GetDetailReportDetails(ReportDetails reportDetails, string loginUserId)
        {
            ReportModel oReportModel = new ReportModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_CIR_CIM_Detail", new
                    {
                        FormType = reportDetails.RptType,
                        State = reportDetails.StateId == null ? "0" : reportDetails.StateId,
                        Site = reportDetails.SiteId == null ? "0" : reportDetails.SiteId,
                        TurbineType = reportDetails.TurbineTypeId == null ? "0" : reportDetails.TurbineTypeId,
                        Dept = reportDetails.DptId == null ? "0" : reportDetails.DptId,
                        Turbine = reportDetails.TbnId == null ? "0" : reportDetails.TbnId,
                        CStatus = reportDetails.CStatusId == null ? "0" : reportDetails.CStatusId,
                        CId = reportDetails.CIROrCIMNumber,
                        DateFrom = reportDetails.DateFrom,
                        DateTo = reportDetails.DateTo,
                        WONumber = reportDetails.RptType == "1" ? "" : reportDetails.WONumber,
                        File = reportDetails.File,
                        UId = loginUserId,
                        DsgId = reportDetails.DesignationId == null ? "0" : reportDetails.DesignationId,
                        EmpId = reportDetails.EmployeeId
                    }, commandType: CommandType.StoredProcedure);
                    oReportModel.oMessage = result.Read<Message>().FirstOrDefault();
                    oReportModel.DetailReports = result.Read<DetailReport>().ToList();
                    oReportModel.ExcelReport = result.Read<ExcelDetailReport>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Report", MethodName = "GetDetailReportDetails", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oReportModel;
        }



        #endregion

        #region CIR Analytics Report Details

        /// <summary>
        /// Get the CIR Analytics Details
        /// </summary>
        /// <param name="reportDetails">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public AnalyticsModel GetCIRAnalyticsDetails(AnalyticsReport reportDetails, string loginUserId)
        {
            AnalyticsModel oReportModel = new AnalyticsModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_CIRAnalytics", new
                    {
                        DateFrm = reportDetails.DateFrm,
                        DateTo = reportDetails.DateTo,
                        Filter = reportDetails.Filter == null ? "0" : reportDetails.Filter,
                        State = reportDetails.State == null ? "0" : reportDetails.State,
                        Site = reportDetails.Site == null ? "0" : reportDetails.Site,
                        WTGType = reportDetails.WTGType == null ? "0" : reportDetails.WTGType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);

                    oReportModel.AnalyticsPoint = result.Read<AnalyticsPoint>().ToList();

                    if (reportDetails.WTGType != null && reportDetails.WTGType != "0" && reportDetails.WTGType != "")
                    {
                        oReportModel.AnalyticsPointDetails = result.Read<AnalyticsPointDetails>().ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return oReportModel;
        }

        #endregion

        #region CIR Pending Analytics Report Details
        
        /// <summary>
        /// Get the CIR Pending Analytics Details.
        /// </summary>
        /// <param name="reportDetails">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CIRPendingAnalyticsModel GetCIRPendingAnalyticsDetails(AnalyticsReport reportDetails, string loginUserId)
        {
            CIRPendingAnalyticsModel oReportModel = new CIRPendingAnalyticsModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_CIRPENDINGAnalyticsnew", new
                    {
                        DateFrm = reportDetails.DateFrm,
                        DateTo = reportDetails.DateTo,
                        Filter = reportDetails.Filter == null ? "0" : reportDetails.Filter,
                        State = reportDetails.State == null ? "0" : reportDetails.State,
                        Site = reportDetails.Site == null ? "0" : reportDetails.Site,
                        WTGType = reportDetails.WTGType == null ? "0" : reportDetails.WTGType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);

                    oReportModel.AnalyticsPointDetails = result.Read<CIRPendingAnalyticsPointDetails>().ToList();
                    oReportModel.AnalyticsPoint = result.Read<CIRPendingAnalyticsPoint>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return oReportModel;
        }

        #endregion

        #region DMAnalytics report details
        // <summary>
        /// Get the Summary report detais based on the search parameter.
        /// </summary>
        /// <param name="reportDetails">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DMAnalyticsReult GetDMAnalyticsReportDetails(DMAnalyticsModel reportDetails, string loginUserId)
        {
            DMAnalyticsReult oReportModel = new DMAnalyticsReult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_TurbineDM", new
                    {
                        Title = reportDetails.Title,
                        Status = reportDetails.Status,
                        UId = loginUserId,
                    }, commandType: CommandType.StoredProcedure);
                    
                    oReportModel.DMAnalyticsHeading = result.Read<DMAnalyticsHeading>().ToList();
                    oReportModel.DMAnalyticsMessage = result.Read<DMAnalyticsMessage>().ToList();
                    oReportModel.DMAnalyticsDetail = result.Read<DMAnalyticsDetail>().ToList();
                    oReportModel.DMAnalyticsCompPending = result.Read<DMAnalyticsCompPending>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Report", MethodName = "GetSummaryReportDetails", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oReportModel;
        }
        #endregion
    }
}
