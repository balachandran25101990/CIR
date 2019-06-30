using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{

    #region Report

    public class ReportModel
    {
        public List<SummaryReport> SummaryReports { get; set; }
        public Message oMessage { get; set; }
        public List<DetailReport> DetailReports { get; set; }
        public List<ExcelDetailReport> ExcelReport { get; set; }
    }

    public class ReportDetails
    {
        public string RptType { get; set; }
        public string StateId { get; set; }
        public string SiteId { get; set; }
        public string TurbineTypeId { get; set; }
        public string DptId { get; set; }
        public string CStatusId { get; set; }
        public string TbnId { get; set; }
        public string State { get; set; }
        public string Site { get; set; }
        public string TurbineType { get; set; }
        public string Dept { get; set; }
        public string CStatus { get; set; }
        public string Turbine { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string WONumber { get; set; }
        public string CIROrCIMNumber { get; set; }
        public string File { get; set; }
        public string DesignationId { get; set; }
        public string EmployeeId { get; set; }

    }

    #endregion

    #region Summary Report

    public class SummaryReport
    {
        public string SlNo { get; set; }
        public string State { get; set; }
        public string WTGType { get; set; }
        public string TSite { get; set; }
        public string Department { get; set; }
        public string CStatus { get; set; }
        public string Status { get; set; }
        public string Turbine { get; set; }
        public string Reports { get; set; }
        public string Designation { get; set; }
    }

    #endregion

    #region Detail Report

    public class DetailReport
    {
        public string Slno { get; set; }
        public string CID { get; set; }
        public string CIMID { get; set; }
        public string CNumber { get; set; }
        public string Turbine { get; set; }
        public string State { get; set; }
        public string TSite { get; set; }
        public string CStatus { get; set; }
        public string CreatedOn { get; set; }
        public string AssignedTo { get; set; }
        public string Rpttype { get; set; }
        public string EMPName { get; set; }
        public string EMPDesg { get; set; }
        public string PD { get; set; }
    }

    public class ExcelDetailReport
    {
        public string CIMNumber { get; set; }
        public string CIRNumber { get; set; }
        public string Turbine { get; set; }
        public string Customer { get; set; }
        public string SiteName { get; set; }
        public string FnLoc { get; set; }
        public string Capacity { get; set; }
        public string TowerHeight { get; set; }
        public string Blade { get; set; }
        public string Generator { get; set; }
        public string GRSlno { get; set; }
        public string GearBox { get; set; }
        public string GBSlno { get; set; }
        public string Temprature { get; set; }
        public string Dust { get; set; }
        public string Corrosion { get; set; }
        public string DOC { get; set; }
        public string WONumber { get; set; }
        public string DateOfFailure { get; set; }
        public string Alarmcode { get; set; }
        public string Employee { get; set; }
        public string SwVersion { get; set; }
        public string HwVersion { get; set; }
        public string WTGStartTime { get; set; }
        public string WTGStopTime { get; set; }
        public string Production { get; set; }
        public string RunHrs { get; set; }
        public string FuncSystem { get; set; }
        public string ComponentGroup { get; set; }
        public string PartCode { get; set; }
        public string ComponentMake { get; set; }
        public string FailureDuring { get; set; }
        public string SerialNumber { get; set; }
        public string ProblemDesc { get; set; }
        public string What { get; set; }
        public string When1 { get; set; }
        public string Where1 { get; set; }
        public string Why { get; set; }
        public string Who { get; set; }
        public string HowToDo { get; set; }

        public string HowMuch { get; set; }
        public string Consequence { get; set; }
        public string CStatus { get; set; }
        public string ActionPerformed { get; set; }
        public string Comments { get; set; }
        public string Files { get; set; }

        public string EMPName { get; set; }
        public string EMPDesg { get; set; }
        public string PD { get; set; }
    }

    #endregion

    #region Analytics Report    

    public class AnalyticsModel
    {
        public List<AnalyticsPoint> AnalyticsPoint { get; set; }
        public List<AnalyticsPointDetails> AnalyticsPointDetails { get; set; }
    }

    public class AnalyticsPoint
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Count { get; set; }
    }

    public class AnalyticsPointDetails
    {
        public string CIRNumber { get; set; }
        public string Turbine { get; set; }
        public string StateName { get; set; }
        public string CStatus { get; set; }
        public string EName { get; set; }
    }

    public class AnalyticsReport
    {
        public string DateFrm { get; set; }
        public string DateTo { get; set; }
        public string Filter { get; set; }
        public string State { get; set; }
        public string Site { get; set; }
        public string WTGType { get; set; }
    }

    #endregion

    #region CIR Pending Analytics Report

    public class CIRPendingAnalyticsModel
    {
        public List<CIRPendingAnalyticsPoint> AnalyticsPoint { get; set; }
        public List<CIRPendingAnalyticsPointDetails> AnalyticsPointDetails { get; set; }
    }

    public class CIRPendingAnalyticsPoint
    {
        public string FEPending { get; set; }
        public string FOMPending { get; set; }
        public string PTSPending { get; set; }
        public string FSLPending { get; set; }
        public string FSSPending { get; set; }
        public string QualityPending { get; set; }
        public string DMPending { get; set; }
        public string RCPending { get; set; }
    }

    public class CIRPendingAnalyticsPointDetails
    {
        public string Id { get; set; }
        public string IText { get; set; }
        public string FEPending { get; set; }
        public string FOMPending { get; set; }
        public string PTSPending { get; set; }
        public string FSLPending { get; set; }
        public string FSSPending { get; set; }
        public string QualityPending { get; set; }
        public string DMPending { get; set; }
        public string RCPending { get; set; }
    }

    #endregion

    #region DMAnalyticsReport

    public class DMAnalyticsModel
    {
        public string Title { get; set; }
        public string Status { get; set; }
    }
    public class DMAnalyticsDetail
    {
        public string Title { get; set; }
        public string Completed { get; set; }
        public string Pending { get; set; }
    }
    public class DMAnalyticsMessage
    {
        public string Msg { get; set; }
        public string Clear { get; set; }
    }
    public class DMAnalyticsHeading
    {
        public string Heading { get; set; }
    }
    public class DMAnalyticsCompPending
    {
        public string Completed { get; set; }
        public string Pending { get; set; }
    }
    public class DMAnalyticsReult
    {
        public List<DMAnalyticsHeading> DMAnalyticsHeading { get; set; }
        public List<DMAnalyticsMessage> DMAnalyticsMessage { get; set; }
        public List<DMAnalyticsDetail> DMAnalyticsDetail { get; set; }
        public List<DMAnalyticsCompPending> DMAnalyticsCompPending { get; set; }
    }
    #endregion

}
