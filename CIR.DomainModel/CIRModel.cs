using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CIR.DomainModel
{

    public class CIRModel
    {
        public string CIRId { get; set; }
        public string CIRNumber { get; set; }
        public string CIMId { get; set; }
        public string CIMNumber { get; set; }
        public string TbnId { get; set; }
        public string Turbine { get; set; }
        public string DateOfFailure { get; set; }
        public string ACode { get; set; }
        public string AlarmCode { get; set; }
        public string EmpId { get; set; }
        public string Employee { get; set; }
        public string SwVersion { get; set; }
        public string HwVersion { get; set; }
        public string WTGStatus { get; set; }
        public string WTGStatusId { get; set; }
        public string WTGStartTime { get; set; }
        public string WTGStopTime { get; set; }
        public string Production { get; set; }
        public string FSId { get; set; }
        public string RunHrs { get; set; }
        public string FuncSystem { get; set; }
        public string ComponentGroup { get; set; }
        public string CGId { get; set; }
        public string PartCode { get; set; }
        public string ComponentMake { get; set; }
        public string FailureDuring { get; set; }
        public string FDId { get; set; }
        public string SerialNumber { get; set; }
        public string CorrosionId { get; set; }
        public string Corrosion { get; set; }
        public string FOM { get; set; }
        public string FOMName { get; set; }
        public string FOMEmail { get; set; }
        public string FOMMobileNo { get; set; }
        public string ProblemDesc { get; set; }
        public string What { get; set; }
        public string When1 { get; set; }
        public string Where1 { get; set; }
        public string Why { get; set; }
        public string Who { get; set; }
        public string HowTodo { get; set; }
        public string Howmuch { get; set; }
        public string CStatus { get; set; }
        public string WTGType { get; set; }
        public string WTGTypeID { get; set; }
        public string Blade { get; set; }
        public string Temp { get; set; }
        public string Dust { get; set; }
        public string DOC { get; set; }
        public string Customer { get; set; }
        public string TSite { get; set; }
        public string THeight { get; set; }
        public string Generator { get; set; }
        public string GearBox { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public string TSiteID { get; set; }
        public string StateId { get; set; }
        public string StateName { get; set; }
        public string Consequence { get; set; }
        public string EngineerSapId { get; set; }
        public string WONumber { get; set; }
        public string DsgId { get; set; }
        public string SFilename { get; set; }
        public string SDesc { get; set; }
        public string SWVersionId { get; set; }
        public string HwVersionId { get; set; }
        public string AlarmDesc { get; set; }
        //public string WTGTypeId { get; set; }
        //public string WTGType { get; set; }
        public string TTurbine { get; set; }
        //public string TSite { get; set; }
        //public string Customer { get; set; }
        public string CmrId { get; set; }
        public string TDOC { get; set; }
        public string TempName { get; set; }
        public string TempId { get; set; }
        public string DustName { get; set; }
        public string DustId { get; set; }
        public string CorrosionName { get; set; }
        // public string CorrosionId { get; set; }
        public string THeightName { get; set; }
        public string THeightId { get; set; }
        public string BladetName { get; set; }
        public string BladeId { get; set; }
        public string GeneratorName { get; set; }
        public string GRId { get; set; }
        public string GearBoxName { get; set; }
        public string GBId { get; set; }
        public string SiteID { get; set; }
        public string EName { get; set; }
        public string FEMobileNo { get; set; }
        public string PDateOfFailure { get; set; }
        public string PDOC { get; set; }
        public string PWTGStartTime { get; set; }
        public string PWTGStopTime { get; set; }
    }

    public class CIRAutoComplete
    {
        public string Id { get; set; }
        public string TextValue { get; set; }
    }

    public class ErrorMessage
    {
        public string ModuleName { get; set; }
        public string UserId { get; set; }
        public string Exception { get; set; }
        public string Message { get; set; }
        public string ErrorCapturedOn { get; set; }
        public string MethodName { get; set; }
    }

    public class CIRDetails
    {
        public TurbineDetails TurbineDetails { get; set; }
        public UniqueNumber CIRNumber { get; set; }
        public UniqueNumber CIMNumber { get; set; }
    }

    public class CIRGeneration
    {
        public string TbnId { get; set; }
        public string CIRNumber { get; set; }
        public string CIMNumber { get; set; }
    }

    public class UniqueNumber
    {
        public string UniqueNo { get; set; }
    }

    public class CIRProblem
    {
        public string CIRId { get; set; }
        public string Problem { get; set; }
        public string CIMId { get; set; }
    }

    public class CIRResult
    {
        public CIRModel CIRData { get; set; }
        public Message MessageInfo { get; set; }

    }

    public class CIRAction
    {
        public string Slno { get; set; }
        public string CAId { get; set; }
        public string CIRId { get; set; }
        public string ActionDesc { get; set; }
        public string DelFlag { get; set; }
        public string CIMId { get; set; }
    }

    public class CIRConsequence
    {
        public string CIRId { get; set; }
        public string Consequence { get; set; }
        public string CIMId { get; set; }
    }

    public class CIR5W2H
    {
        public string CIRId { get; set; }
        public string What { get; set; }
        public string When { get; set; }
        public string Who { get; set; }
        public string Where { get; set; }
        public string Why { get; set; }
        public string HowToDo { get; set; }
        public string HowMuch { get; set; }
        public string CIMId { get; set; }

    }

    public class CIRModelResult
    {
        public CIRModel CIRDetail { get; set; }
        public List<CIRAction> CIRActionDetail { get; set; }
        public List<CIRFiles> CIRFileDetail { get; set; }
        public List<CIRComments> CIRComments { get; set; }
    }

    public class CIRFiles
    {
        public string CFId { get; set; }
        public string CIRId { get; set; }
        public string CIRNumber { get; set; }
        public string IsImage { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public string CFileName { get; set; }
        public string CDesc { get; set; }
        public string CIMId { get; set; }
        public string CIMNumber { get; set; }
        public string FileNameFullPath { get; set; }

    }

    public class CIRComments
    {
        public string Slno { get; set; }
        public string CAId { get; set; }
        public string Comments { get; set; }
        public string Frm { get; set; }
        public string CommentsOn { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedDate { get; set; }
    }

    public class CIRFilesResult
    {
        public CIRFiles CIRFiles { get; set; }
        public Message MessageInfo { get; set; }
    }

}
