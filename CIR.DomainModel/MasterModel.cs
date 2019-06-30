using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{

    #region Department 

    public class DepartmentModel
    {
        public string DptId { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public string Code { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
    }

    public class DepartmentDetails
    {
        public int SlNo { get; set; }
        public string DeptId { get; set; }
        public string Dept { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string Code { get; set; }
    }

    public class DepartmentResult
    {
        public Message message { get; set; }
        public List<DepartmentDetails> departmentdetails { get; set; }
    }

    #endregion

    #region Designation

    public class DesignationModel
    {
        public string DsgId { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public string Code { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
    }

    public class DesignationDetails
    {
        public int SlNo { get; set; }
        public string DsgId { get; set; }
        public string Designation { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string Code { get; set; }
        public string AutoAssign { get; set; }
    }

    public class DesignationResult
    {
        public Message message { get; set; }
        public List<DesignationDetails> designationdetails { get; set; }
    }

    #endregion

    #region Design Modification 

    public class DMMasterModel
    {
        public string DMId { get; set; }
        public string RefId { get; set; }
        public string Title { get; set; }
        public string SBNo { get; set; }
        public string TDNo { get; set; }
        public string MENNo { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string View { get; set; }
        public string Delflag { get; set; }
    }

    public class DMMasterDetail
    {
        public int SlNo { get; set; }
        public string DMId { get; set; }
        public string Title { get; set; }
        public string SBNo { get; set; }
        public string TDNo { get; set; }
        public string MENNo { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string DM { get; set; }
    }

    public class DMMasterResult
    {
        public Message message { get; set; }
        public List<DMMasterDetail> DMMasterDetailArray { get; set; }
    }

    #endregion

    #region Employee

    public class EmployeeModel
    {
        public string EmpId { get; set; }
        public string EmpName { get; set; }
        public string ICHCode { get; set; }
        public string SAPCode { get; set; }
        public string DptId { get; set; }
        public string DsgId { get; set; }
        public string OMobile { get; set; }
        public string OEmail { get; set; }
        public string RleId { get; set; }
        public string Pwd { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
        public string Text { get; set; }
        public string FnSystem { get; set; }
        public string FuncSystem { get; set; }
        public string MultiSite { get; set; }
        public string WorkingAt { get; set; }
    }

    public class EmployeeDetails
    {
        public int Slno { get; set; }
        public string EmpId { get; set; }
        public string Employee { get; set; }
        public string ICHCode { get; set; }
        public string SAPCode { get; set; }
        public string DptId { get; set; }
        public string Dept { get; set; }
        public string DsgID { get; set; }
        public string Desig { get; set; }
        public string Email { get; set; }
        public string OMobile { get; set; }
        public string RleId { get; set; }
        public string Role { get; set; }
        public string Active { get; set; }
        public string Pwd { get; set; }
        public string FnSystem { get; set; }
        public string FuncSystem { get; set; }
        public string MultiSite { get; set; }
        public string WorkingAt { get; set; }

        public List<EmployeeDetails> EmployeeDetail { get; set; }
        public List<EmployeeExcelDownloadDetails> EmployeeExcelDownloadDetails { get; set; }
    }
    public class EmployeeExcelDownloadDetails
    {
        public int Slno { get; set; }
        public string Employee { get; set; }
        public string ICHCode { get; set; }
        public string SAPCode { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string Email { get; set; }
        public string OfficialMobile { get; set; }
        public string Role { get; set; }
        public string Active { get; set; }
        public string FunctionalSystem { get; set; }
        public string MultiSite { get; set; }
        public string WorkingAt { get; set; }
    }

    public class EmployeeResult
    {
        public Message message { get; set; }
        public List<EmployeeDetails> employeedetails { get; set; }
    }

    public class EmployeeExcelModel
    {
        public string EUNo { get; set; }
        public string ViewType { get; set; }
        public DataTable Employee { get; set; }
        public string FileName { get; set; }
        public string Remarks { get; set; }
        public string Submit { get; set; }
        public string EUId { get; set; }
        public string RowId { get; set; }
        public string Delflag { get; set; }
        public string MultiSite { get; set; }
        public string FunctionalSystem { get; set; }
    }

    public class EmployeeExcelHeaderDetails
    {
        public string EUId { get; set; }
        public string EFilename { get; set; }
        public string EUNo { get; set; }
        public string Posted { get; set; }
        public string PostedBy { get; set; }
        public string PostedOn { get; set; }
        public string Remarks { get; set; }
        public string UploadedBy { get; set; }
        public string Total { get; set; }
        public string New { get; set; }
        public string Modified { get; set; }
        public string Invalid { get; set; }
    }

    public class EmployeeExcelDetails
    {
        public string RowId { get; set; }
        public string EName { get; set; }
        public string ICHCode { get; set; }
        public string SAPCode { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string ERole { get; set; }
        public string Pwd { get; set; }
        public string OfficialMobileNo { get; set; }
        public string OfficialEmailId { get; set; }
        public string EMsg { get; set; }
        public string Color { get; set; }
        public string MultiSite { get; set; }
        public string FuncSys { get; set; }
        public string WorkingAt { get; set; }
    }

    public class ExcelMessage
    {
        public string Message { get; set; }
        public string Clear { get; set; }
        public string Total { get; set; }
        public string NewRecords { get; set; }
        public string ModifyRecords { get; set; }
        public string InvalidRecords { get; set; }
    }


    public class VersionUpdtExcelMessage
    {
        public string Message { get; set; }
        public string Clear { get; set; }
        public string Total { get; set; }
        public string Modified { get; set; }
        public string Invalid { get; set; }
    }

    public class EmployeeExcelSetResult
    {
        public ExcelMessage message { get; set; }
        public List<EmployeeExcelDetails> employeeexceldetails { get; set; }
    }

    public class EmployeeExcelGetResult
    {
        public EmployeeExcelHeaderDetails headerdetails { get; set; }
        public List<EmployeeExcelDetails> employeeexceldetails { get; set; }
    }

    #endregion

    #region Manufacturer 

    public class ManufacturerModel
    {
        public string MfrId { get; set; }
        public string MType { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
        public string Text { get; set; }
    }

    public class ManufacturerDetails
    {
        public string SlNo { get; set; }
        public string MfrId { get; set; }
        public string Manufacturer { get; set; }
        public string Code { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
    }

    public class ManufacturerResult
    {
        public Message message { get; set; }
        public List<ManufacturerDetails> manufacturerdetails { get; set; }
    }

    #endregion

    #region Role and Role Access

    public class RoleAccessModel
    {
        public string Rleid { get; set; }
        public string PgeId { get; set; }
        public string Access { get; set; }
        public string ViewType { get; set; }
    }

    public class RoleAccessDetails
    {
        public string RAId { get; set; }
        public string RleId { get; set; }
        public string View { get; set; }
        public string Add { get; set; }
        public string Update { get; set; }
        public string Delete { get; set; }
        public string Download { get; set; }
        public string PgeID { get; set; }
        public string Page { get; set; }
        public string RefId { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
        public string PageName { get; set; }
    }

    public class RoleModel
    {
        public string RleId { get; set; }
        public string Name { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
    }

    public class RoleDetails
    {
        public int Slno { get; set; }
        public string RoleId { get; set; }
        public string Role { get; set; }
        public string Active { get; set; }
    }

    public class RoleResult
    {
        public Message message { get; set; }
        public List<RoleDetails> roledetails { get; set; }
    }

    #endregion

    #region Spart Parts

    public class SparePartsModel
    {
        public string DTId { get; set; }
        public string DMId { get; set; }
        public string RefMCId { get; set; }
        public string ToolsPartsMaterials { get; set; }
        public string FileName { get; set; }
        public string Desc { get; set; }
        public string Delflag { get; set; }
    }

    public class SparePartsDetails
    {
        public string Slno { get; set; }
        public string DTId { get; set; }
        public string DMId { get; set; }
        public string DM { get; set; }
        public string TypeId { get; set; }
        public string Tool { get; set; }
        public string Type { get; set; }
        public string Filename { get; set; }
        public string Desc { get; set; }
    }
    public class SparePartsResult
    {
        public Message message { get; set; }
        public List<SparePartsDetails> SparePartsArray { get; set; }
    }

    #endregion

    #region Turbine Entry 

    public class TurbineDataEntryModel
    {
        public string TStateId { get; set; }
        public string TSiteId { get; set; }
        public string TStatusId { get; set; }
        public string APStatusId { get; set; }
        public string TbnId { get; set; }
        public string TDId { get; set; }
        public string DMId { get; set; }
        public string Desc { get; set; }
        public string Delflag { get; set; }
        public string StsId { get; set; }
        public string AnalyzingStatus { get; set; }
    }

    public class TurbineDataEntryDetails
    {
        public string SlNo { get; set; }
        public string DMId { get; set; }
        public string TbnId { get; set; }
        public string TurbineId { get; set; }
        public string TDId { get; set; }
        public string DMTitle { get; set; }
        public string Desc { get; set; }
        public string Delflag { get; set; }
        public string TState { get; set; }
        public string TStateId { get; set; }
        public string TSite { get; set; }
        public string TSiteId { get; set; }
        public string TStatus { get; set; }
        public string TStatusId { get; set; }
        public string APStatus { get; set; }
        public string APStatusId { get; set; }
    }

    public class TurbineDataEntryResult
    {
        public Message message { get; set; }
        public List<TurbineDataEntryDetails> TurbineDataEntryArray { get; set; }
    }

    #endregion

    #region Turbine

    public class TurbineModel
    {
        public string TbnId { get; set; }
        public string TurbineId { get; set; }
        public string CmrGroupId { get; set; }
        public string CmrId { get; set; }
        public string Site { get; set; }
        public string FnLoc { get; set; }
        public string Capacity { get; set; }
        public string THeight { get; set; }
        public string Blade { get; set; }
        public string GRId { get; set; }
        public string GRSlno { get; set; }
        public string GBId { get; set; }
        public string GBSlno { get; set; }
        public string DOC { get; set; }
        public string Temp { get; set; }
        public string Dust { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string Text { get; set; }
        public string View { get; set; }
        public string formType { get; set; }
        public string Corrosion { get; set; }
        public string CorrosionId { get; set; }
        public string SWVersion { get; set; }
        public string HWVersion { get; set; }
        public string WTGType { get; set; }
        public string Location { get; set; }
        public string ScadaName { get; set; }
    }

    public class TurbineDetails
    {
        public int Slno { get; set; }
        public string TbnId { get; set; }
        public string TurbineId { get; set; }
        public string CmrGroupId { get; set; }
        public string CmrGroupName { get; set; }
        public string CmrId { get; set; }
        public string CustomerName { get; set; }
        public string TSite { get; set; }
        public string SiteName { get; set; }
        public string FnLoc { get; set; }
        public string Capacity { get; set; }
        public string THeight { get; set; }
        public string TowerHeightName { get; set; }
        public string Blade { get; set; }
        public string BladeName { get; set; }
        public string GRId { get; set; }
        public string Generator { get; set; }
        public string GRSlno { get; set; }
        public string GBId { get; set; }
        public string GearBox { get; set; }
        public string GBSlno { get; set; }
        public string DOC { get; set; }
        public string Temp { get; set; }
        public string Dust { get; set; }
        public string Tempname { get; set; }
        public string DustName { get; set; }
        public string Active { get; set; }
        public string WTGTypeName { get; set; }
        public string WTGType { get; set; }
        public string WTGTypeID { get; set; }
        public string EngineerSapId { get; set; }
        public string Employee { get; set; }
        public string FOM { get; set; }
        public string CorrosionId { get; set; }
        public string EMAIL { get; set; }
        public string FOMMobile { get; set; }
        public string Corrosion { get; set; }
        public string StateName { get; set; }
        public string StateId { get; set; }
        public string SwVersion { get; set; }
        public string HwVersion { get; set; }
        public string SwVersionId { get; set; }
        public string HwVersionID { get; set; }
        public string FEMobileNo { get; set; }
        public string PDOC { get; set; }
        public string ScadaName { get; set; }
        public string Location { get; set; }
        public List<TurbineDetails> TurbineDetail { get; set; }
    }

    public class TurbineExcelDownload
    {
        public int Slno { get; set; }
        public string TurbineId { get; set; }
        public string CustomerName { get; set; }
        public string SiteName { get; set; }
        public string FnLoc { get; set; }
        public string Capacity { get; set; }
        public string TowerHeightName { get; set; }
        public string BladeName { get; set; }
        public string Generator { get; set; }
        public string GRSlno { get; set; }
        public string GearBox { get; set; }
        public string GBSlno { get; set; }
        public string DOC { get; set; }
        public string Tempname { get; set; }
        public string DustName { get; set; }
        //public string Status { get; set; }
        public string WTGTypeName { get; set; }
        public string Corrosion { get; set; }
        // public string FOM { get; set; }
        //  public string Email { get; set; }
        //  public string FOMMobile { get; set; }
        public string SwVersion { get; set; }
        public string HwVersion { get; set; }
        //  public string PDOC { get; set; }
        // public string CmrGroupName { get; set; }
        public string ScadaName { get; set; }
        public string Location { get; set; }
        //  public string EngineerSapId { get; set; }

    }

    public class TurbineResult
    {
        public Message message { get; set; }
        public List<TurbineDetails> turbinedetails { get; set; }
    }

    public class TurbineExcelModel
    {
        public string TUNo { get; set; }
        public string ViewType { get; set; }
        public DataTable Turbine { get; set; }
        public string FileName { get; set; }
        public string Remarks { get; set; }
        public string Submit { get; set; }
        public string TUId { get; set; }
        public string RowId { get; set; }
        public string Delflag { get; set; }
    }

    public class TurbineVersUpdtModel
    {
        public string TUNo { get; set; }
        public string ViewType { get; set; }
        public DataTable TurbineUpdate { get; set; }
        public string FileName { get; set; }
        public string Remarks { get; set; }
        public string Submit { get; set; }
        public string TUId { get; set; }
        public string RowId { get; set; }
        public string Delflag { get; set; }
        public string Status { get; set; }
        public string AssignTo { get; set; }
        public string TbnId { get; set; }
    }

    public class TurbineExcelHeaderDetails
    {
        public string TUId { get; set; }
        public string TFilename { get; set; }
        public string TUNo { get; set; }
        public string Posted { get; set; }
        public string PostedBy { get; set; }
        public string PostedOn { get; set; }
        public string Remarks { get; set; }
        public string UploadedBy { get; set; }
        public string Total { get; set; }
        public string New { get; set; }
        public string Modified { get; set; }
        public string Invalid { get; set; }
        public string Pending { get; set; }
        public string Status { get; set; }
        public string AssignTo { get; set; }
        public string Cancel { get; set; }
    }

    public class TurbineExcelDetails
    {
        public string RowId { get; set; }
        public string TurbineId { get; set; }
        public string CmrGroupName { get; set; }
        public string Customer { get; set; }
        public string TSite { get; set; }
        public string FnLoc { get; set; }
        public string Capacity { get; set; }
        public string THeight { get; set; }
        public string Blade { get; set; }
        public string Generator { get; set; }
        public string GRSlno { get; set; }
        public string GearBox { get; set; }
        public string GBSlno { get; set; }
        public string DOC { get; set; }
        public string Temp { get; set; }
        public string Dust { get; set; }
        public string EMsg { get; set; }
        public string Color { get; set; }
        public string Corrosion { get; set; }
        public string WTGType { get; set; }
        public string SWVersion { get; set; }
        public string HWVersion { get; set; }
        public string ScadaName { get; set; }
        public string Location { get; set; }
    }

    public class TurbineVersionUpdateExcelDetails
    {
        public string RowId { get; set; }
        public string TurbineId { get; set; }
        public string TbnId { get; set; }
        public string SwVersion { get; set; }
        public string hwVersion { get; set; }
        // public string SwVersionId { get; set; }
        // public string hwVersionId { get; set; }
        public string InstallationDate { get; set; }
        public string EMsg { get; set; }
        public string Color { get; set; }
        public string TUNo { get; set; }
        public string TUId { get; set; }
        public string FileName { get; set; }
        public string SCADAName { get; set; }
        public string Location { get; set; }
        public string FunctionLocation { get; set; }
        public string Generator { get; set; }
        public string Blade { get; set; }
        public string TemperatureType { get; set; }
        public string TowerHeight { get; set; }
        public string Rotordiameter { get; set; }
        public string SiteName { get; set; }
        public string State { get; set; }
        public string CustomerGroup { get; set; }
        public string Customer { get; set; }
        public string DOC { get; set; }
    }


    public class TurbineMessage
    {
        public string Message { get; set; }
        public string Clear { get; set; }
        public string Total { get; set; }
        public string NewRecords { get; set; }
        public string ModifyRecords { get; set; }
        public string InvalidRecords { get; set; }
    }

    public class TurbineExcelSetResult
    {
        public ExcelMessage message { get; set; }
        public List<TurbineExcelDetails> turbineexceldetails { get; set; }
    }

    public class TurbineVersionUpdateSetResult
    {
        public VersionUpdtExcelMessage message { get; set; }
        public List<TurbineVersionUpdateExcelDetails> turbineexceldetails { get; set; }
    }

    public class TurbineExcelGetResult
    {
        public TurbineExcelHeaderDetails headerdetails { get; set; }
        public List<TurbineExcelDetails> turbineexceldetails { get; set; }
    }
    public class TurbineVersionUpdateExcelGetResult
    {
        public TurbineExcelHeaderDetails headerdetails { get; set; }
        public List<TurbineVersionUpdateExcelDetails> turbineexceldetails { get; set; }
    }
    //public class TurbineVersionUpdateGetStatus
    //{
    //    public List<TurbineVersionUpdateGetStatuss> StatusValue { get; set; }
    //}



    #endregion

    #region Category 

    public class CategoryModel
    {
        public int Slno { get; set; }
        public string Id { get; set; }
        public string MCId { get; set; }
        public string RefId { get; set; }
        public string Category { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
    }

    public class CategoryDetails
    {
        public string Id { get; set; }
        public string MCId { get; set; }
        public string RefId { get; set; }
        public string Category { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
        //public int MCId { get; set; }
        //public string Id { get; set; }
        //public string NAME { get; set; }
        //public string CATEGORY { get; set; }
        //public string RefId { get; set; }
        //public string Delflag { get; set; }
        //public string Active { get; set; }
    }

    public class CategoryResult
    {
        public Message message { get; set; }
        public List<CategoryDetails> categorydetails { get; set; }
    }
    //public class Message1
    //{
    //    public string Message { get; set; }
    //    public string Success { get; set; }
    //}

    #endregion

    #region DMStatusExcel
    public class TurbineVersionUpdateGetStatuss
    {
        public string StsId { get; set; }
        public string Status { get; set; }
    }

    public class DMExcelGetResult
    {
        public DMExcelHeaderDetails headerdetails { get; set; }
        public List<DMExcelDetails> DMExcelDetails { get; set; }
    }
    public class DMExcelModel
    {
        public string DSId { get; set; }
        public string ViewType { get; set; }
        public DataTable Turbine { get; set; }
        public string FileName { get; set; }
        public string Remarks { get; set; }
        public string Submit { get; set; }
        public string DSNo { get; set; }
        public string RowId { get; set; }
        public string Delflag { get; set; }
    }
    public class DMExcelHeaderDetails
    {
        public string DSId { get; set; }
        public string TFilename { get; set; }
        public string DSNo { get; set; }
        public string Posted { get; set; }
        public string PostedBy { get; set; }
        public string PostedOn { get; set; }
        public string Remarks { get; set; }
        public string UploadedBy { get; set; }
        public string Total { get; set; }
        public string New { get; set; }
        public string Modified { get; set; }
        public string Invalid { get; set; }
    }
    public class DMExcelDetails
    {
        public string RowId { get; set; }
        public string TurbineId { get; set; }
        public string Customer { get; set; }
        public string AnalyzingStatus { get; set; }
        public string Site { get; set; }
        public string Turbine { get; set; }
        public string DMTitle { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
    }



    public class DMSetExcelDetails
    {
        public string EMsg { get; set; }
        public string Color { get; set; }
        public string RowId { get; set; }
        public string Turbine { get; set; }
        public string Status { get; set; }
        public string AnalyzingStatus { get; set; }
        public string Description { get; set; }
        public string SlNo { get; set; }
        public string DSId { get; set; }
        public string DMId { get; set; }
        public string TbnId { get; set; }
        public string TurbineId { get; set; }
        public string TDId { get; set; }
        public string DMTitle { get; set; }
        public string Desc { get; set; }
        public string Delflag { get; set; }
        public string TState { get; set; }
        public string TStateId { get; set; }
        public string TSite { get; set; }
        public string TSiteId { get; set; }
        public string TStatus { get; set; }
        public string TStatusId { get; set; }
    }

    public class DMSetExcelResult
    {
        public Message message { get; set; }
        public List<DMSetExcelDetails> DMSetExcelDetails { get; set; }
    }
    #endregion

    #region SMP Data Excel

    public class SMPDataExcelModel
    {
        public DataTable SMPDataUpload { get; set; }
        public string FileName { get; set; }
        public string FileNameManual { get; set; }
        public string Comments { get; set; }
        public string Submit { get; set; }
        public string SUId { get; set; }
        public string RowId { get; set; }
        public string Delflag { get; set; }
        public string Status { get; set; }
        public string AssignTo { get; set; }
    }

    public class SMPDataUpdateExcelMessage
    {
        public string Message { get; set; }
        public string Clear { get; set; }
        public string Total { get; set; }
        public string Modified { get; set; }
        public string Invalid { get; set; }
        public string FileName { get; set; }
        public string SUId { get; set; }
    }

    public class SMPDataExcelDetails
    {
        public string RowId { get; set; }
        public string TbnId { get; set; }
        public string TurbineId { get; set; }
        public string State { get; set; }
        public string StateId { get; set; }
        public string Site { get; set; }
        public string SiteId { get; set; }
        public string Model { get; set; }
        public string ModelId { get; set; }
        public string Location { get; set; }
        public string FnLoc { get; set; }
        public string FunctionalDescription { get; set; }
        public string PlannedDate { get; set; }
        public string CompletedOn { get; set; }
        public string ValidationDate { get; set; }
        public string ValidationStatus { get; set; }
        public string ValidationStatusId { get; set; }
        public string DeviationPlanVsActual { get; set; }
        public string ReportsGeneratedOn { get; set; }
        public string RecommendedActionsState { get; set; }
        public string RecommendedActions { get; set; }
        public string RecommendedActionsObservations { get; set; }
        public string RecommendedActionsWONumber { get; set; }
        public string RecommendedActionsCompleted { get; set; }
        public string ErrMsg { get; set; }
        public string Color { get; set; }
        public string DelFlag { get; set; }
    }

    public class SMPDataUpdtModel
    {
        public string SUNo { get; set; }
        public string ViewType { get; set; }
        public DataTable SMPDataUpdate { get; set; }
        public string FileName { get; set; }
        public string Remarks { get; set; }
        public string Submit { get; set; }
        public string SUId { get; set; }
        public string RowId { get; set; }
        public string Delflag { get; set; }
        public string Status { get; set; }
        public string AssignTo { get; set; }
        public string Level { get; set; }
        public string Text { get; set; }

    }

    public class SMPDataExcelHeaderDetails
    {
        public string SUId { get; set; }
        public string Filename { get; set; }
        public string SUNo { get; set; }
        public string Remarks { get; set; }
        public string UploadedBy { get; set; }
        public string Total { get; set; }
        public string New { get; set; }
        public string Modify { get; set; }
        public string Invalid { get; set; }
        public string EmpName { get; set; }
        public string Status { get; set; }
        public string ManualFileName { get; set; }
        public bool IsSaveEditable { get; set; }
        public string EmpId { get; set; }
        public string StatusId { get; set; }
        public bool IsAdmin { get; set; }
    }


    public class SMPDataExcelGetResult
    {
        public SMPDataExcelHeaderDetails headerdetails { get; set; }
        public List<SMPDataExcelDetails> SMPDataExcelDetails { get; set; }
        public List<ExcelStatusOrAssignDetails> SMPStatusOrAssignDetails { get; set; }
    }

    public class ExcelStatusOrAssignDetails
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class SMPDataExcelSetResult
    {
        public SMPDataUpdateExcelMessage message { get; set; }
        public List<SMPDataExcelDetails> SMPDataExcelDetails { get; set; }
    }

    public class SMPDataComments
    {
        public string From { get; set; }
        public string To { get; set; }
        public string FromComments { get; set; }
        public string Status { get; set; }
        public string AssignedDate { get; set; }
        public string CommentsDate { get; set; }
    }

    #endregion

    #region SMP Data Mail

    public class SMPDataMail
    {
        public string ToUserName { get; set; }
        public string CC { get; set; }
        public string To { get; set; }
        public string SubjectMsg { get; set; }
        public string BodyMsg { get; set; }
    }

    #endregion
}
