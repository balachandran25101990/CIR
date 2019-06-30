using System;
using System.Collections.Generic;
using System.Data;
using System.Web;

public class dbLib : sqlLib
{
    #region Variables
    #endregion

    #region Constructor
    public dbLib()
    {
    }
    #endregion

    #region Employee Authentications
    public DataSet EmpAuthenticate(string UserName, string Password)
    {
        ProcedureName = "mrv_empauthenticate";
        AddParameter("UserName", UserName);
        AddParameter("Password", Password);
        return ExecuteProcedure;
    }

    public DataSet ChangePassword(string OldPassword, string NewPassword, string Flag, string EmpId)
    {
        ProcedureName = "MRS_ChangePassword";
        AddParameter("OldPassword", OldPassword);
        AddParameter("NewPassword", NewPassword);
        AddParameter("Flag", Flag);
        AddParameter("EmpId", EmpId);
        return ExecuteProcedure;
    }

    public DataSet GetLastUpdate(string UId)
    {
        ProcedureName = "CFS_UserLogs";
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion


    #region master collections
    public DataSet GetMasterCollection(string View, string RefId, string UId)
    {
        ProcedureName = "MRG_Mastercollection";
        AddParameter("View", View);
        AddParameter("RefId", RefId);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion


    #region Auco completed
    public DataSet GetAutocomplete(string View, string RefId, string Text, string UId)
    {
        ProcedureName = "MRG_Autocomplete";
        AddParameter("View", View);
        AddParameter("RefId", RefId);
        AddParameter("Text", Text);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    public DataSet GetAutocompleteId(string View, string RefId, string Text, string UId)
    {
        ProcedureName = "MRG_WAutocomplete";
        AddParameter("View", View);
        AddParameter("RefId", RefId);
        AddParameter("Text", Text);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion


    #region Turbine
    public DataSet GetTurbine(string Site, string View, string RefId, string Text, string TbnID, string UId)
    {
        ProcedureName = "MRG_turbine";
        AddParameter("Site", Site);
        AddParameter("View", View);
        AddParameter("Text", Text);
        AddParameter("TbnID", TbnID);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion


    #region Employee
    public DataSet GetEmployee(string EmpId, string View, string Text, string UId)
    {
        ProcedureName = "MRG_Employee";
        AddParameter("EmpId", EmpId);
        AddParameter("View", View);
        AddParameter("Text", Text);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion

    #region CIR
    public DataSet SetCIRTurbineData(string CIRID, string CIRNumber, string TbnID, string DOF, string AlarmCode,
          string EmpId, string SwVersion, string HwVersion, string WTGStatus, string WTGStartTime, string WTGStopTime,
          string Production, string RunHrs, string FnSystem, string CompGroup, string Partcode, string ComponentMake,
          string FailureDuring, string SerialNumber, string FOM, string WONumber, string AlarmDesc, string Delflag,
          string UId)
    {
        ProcedureName = "CFS_CIR";
        AddParameter("CIRID", CIRID);
        AddParameter("CIRNumber", CIRNumber);
        AddParameter("TbnID", TbnID);
        AddParameter("DOF", DOF);
        AddParameter("AlarmCode", AlarmCode);
        AddParameter("EmpId", EmpId);
        AddParameter("SwVersion", SwVersion);
        AddParameter("HwVersion", HwVersion);
        AddParameter("WTGStatus", WTGStatus);
        AddParameter("WTGStartTime", WTGStartTime);
        AddParameter("WTGStopTime", WTGStopTime);
        AddParameter("Production", Production);
        AddParameter("RunHrs", RunHrs);
        AddParameter("FnSystem", FnSystem);
        AddParameter("CompGroup", CompGroup);
        AddParameter("Partcode", Partcode);
        AddParameter("ComponentMake", ComponentMake);
        AddParameter("FailureDuring", FailureDuring);
        AddParameter("SerialNumber", SerialNumber);
        AddParameter("FOM", FOM);
        AddParameter("WONumber", WONumber);
        AddParameter("AlarmDesc", AlarmDesc);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    public DataSet SetCIRProblem(string CIRID, string ProblemDesc, string UId)
    {
        ProcedureName = "CFS_CIRProblem";
        AddParameter("CIRID", CIRID);
        AddParameter("ProblemDesc", ProblemDesc);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetCIRActions(string CAId, string CIRID, string Action, string Delflag, string UId)
    {
        ProcedureName = "CFS_CIRActions";
        AddParameter("CAId", CAId);
        AddParameter("CIRID", CIRID);
        AddParameter("Action", Action);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetCIRConsequencialProblem(string CIRID, string Consequence, string UId)
    {
        ProcedureName = "CFS_CIRConsequencialProblem";
        AddParameter("CIRID", CIRID);
        AddParameter("Consequence", Consequence);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetCIR5W2H(string CIRID, string What, string When1, string Where, string Why, string Who,
                               string Howtodo, string Howmuch, string UId)
    {
        ProcedureName = "CFS_CIR5W2H";
        AddParameter("CIRID", CIRID);
        AddParameter("What", What);
        AddParameter("When", When1);
        AddParameter("Where", Where);
        AddParameter("Why", Why);
        AddParameter("Who", Who);
        AddParameter("Howtodo", Howtodo);
        AddParameter("Howmuch", Howmuch);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetCIRFiles(string CFId, string CIRID, string Filename, string IsImage, string Desc, string Delflag, string UId)
    {
        ProcedureName = "CFS_CIRFiles";
        AddParameter("CFId", CFId);
        AddParameter("CIRID", CIRID);
        AddParameter("Filename", Filename);
        AddParameter("IsImage", IsImage);
        AddParameter("Desc", Desc);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    public DataSet SetCIRComments(string CIRID, string Comments, string AssignedTo, string Delflag, string UId)
    {
        ProcedureName = "CFS_WCIRApproval";
        AddParameter("CIRID", CIRID);
        AddParameter("Comments", Comments);
        AddParameter("AssignedTo", AssignedTo);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion

    #region FSR
    public DataSet SetFSRTurbineData(string CIMID, string CIMNumber, string TbnID, string DOF, string AlarmCode,
          string EmpId, string SwVersion, string HwVersion, string WTGStatus, string WTGStartTime, string WTGStopTime,
          string Production, string RunHrs, string FnSytem, string CompGroup, string Partcode, string ComponentMake,
          string FailureDuring, string SerialNumber, string FOM, string WONumber, string TSite, string DOC, string Turbine,
          string Customer, string Temp, string Dust, string Corrosion, string THeight, string Blade, string Generator,
          string GearBox, string WTGType, string CmrId, string TempID, string DustID, string CorrosionId, string THeightid,
          string BladeId, string GRiD, string GBId, string WTGTypeId, string AlarmDesc, string Delflag, string UId)
    {
        ProcedureName = "CFS_CIM";
        AddParameter("CIMID", CIMID);
        AddParameter("CIMNumber", CIMNumber);
        AddParameter("TbnID", TbnID);
        AddParameter("DOF", DOF);
        AddParameter("AlarmCode", AlarmCode);
        AddParameter("EmpId", EmpId);
        AddParameter("SwVersion", SwVersion);
        AddParameter("HwVersion", HwVersion);
        AddParameter("WTGStatus", WTGStatus);
        AddParameter("WTGStartTime", WTGStartTime);
        AddParameter("WTGStopTime", WTGStopTime);
        AddParameter("Production", Production);
        AddParameter("RunHrs", RunHrs);
        AddParameter("FnSytem", FnSytem);
        AddParameter("CompGroup", CompGroup);
        AddParameter("Partcode", Partcode);
        AddParameter("ComponentMake", ComponentMake);
        AddParameter("FailureDuring", FailureDuring);
        AddParameter("SerialNumber", SerialNumber);
        AddParameter("FOM", FOM);
        AddParameter("WONumber", WONumber);
        AddParameter("TSite", TSite);
        AddParameter("DOC", DOC);
        AddParameter("Turbine", Turbine);
        AddParameter("Customer", Customer);
        AddParameter("Temp", Temp);
        AddParameter("Dust", Dust);
        AddParameter("Corrosion", Corrosion);
        AddParameter("THeight", THeight);
        AddParameter("Blade", Blade);
        AddParameter("Generator", Generator);
        AddParameter("GearBox", GearBox);
        AddParameter("WTGType", WTGType);
        AddParameter("CmrId", CmrId);
        AddParameter("TempID", TempID);
        AddParameter("DustID", DustID);
        AddParameter("CorrosionId", CorrosionId);
        AddParameter("THeightid", THeightid);
        AddParameter("BladeId", BladeId);
        AddParameter("GRiD", GRiD);
        AddParameter("GBId", GBId);
        AddParameter("WTGTypeId", WTGTypeId);
        AddParameter("AlarmDesc", AlarmDesc);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetFSRProblem(string CIMID, string ProblemDesc, string UId)
    {
        ProcedureName = "CFS_CIMProblem";
        AddParameter("CIMID", CIMID);
        AddParameter("ProblemDesc", ProblemDesc);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    public DataSet SetFSRActions(string CAId, string CIMID, string Action, string Delflag, string UId)
    {
        ProcedureName = "CFS_CIMActions";
        AddParameter("CAId", CAId);
        AddParameter("CIMID", CIMID);
        AddParameter("Action", Action);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetFSRConsequencialProblem(string CIMID, string Consequence, string UId)
    {
        ProcedureName = "CFS_CIMConsequencialProblem";
        AddParameter("CIMID", CIMID);
        AddParameter("Consequence", Consequence);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetFSR5W2H(string CIMID, string What, string When1, string Where, string Why, string Who,
                               string Howtodo, string Howmuch, string UId)
    {
        ProcedureName = "CFS_CIM5W2H";
        AddParameter("CIMID", CIMID);
        AddParameter("What", What);
        AddParameter("When", When1);
        AddParameter("Where", Where);
        AddParameter("Why", Why);
        AddParameter("Who", Who);
        AddParameter("Howtodo", Howtodo);
        AddParameter("Howmuch", Howmuch);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetFSRFiles(string CFId, string CIMID, string Filename, string IsImage, string Desc, string Delflag, string UId)
    {
        ProcedureName = "CFS_CIMFiles";
        AddParameter("CFId", CFId);
        AddParameter("CIMID", CIMID);
        AddParameter("Filename", Filename);
        AddParameter("IsImage", IsImage);
        AddParameter("Desc", Desc);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetFSRComments(string CIMID, string Comments, string AssignedTo, string Delflag, string UId)
    {
        ProcedureName = "CFS_WCIMApproval";
        AddParameter("CIMID", CIMID);
        AddParameter("Comments", Comments);
        AddParameter("AssignedTo", AssignedTo);
        AddParameter("Delflag", Delflag);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion

    #region Migration
    public DataSet DataMigration(string UId)
    {
        ProcedureName = "MRG_datamigration";
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion

    #region CIR Rejection
    public DataSet GetCIR(string CIRNumber, string CIRID, string UId)
    {
        ProcedureName = "cfg_CIR";
        AddParameter("CIRNumber", CIRNumber);
        AddParameter("CIRID", CIRID);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet GetRejectCIR(string UId)
    {
        ProcedureName = "cfg_rejectedcir";
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetRejectCIR(string CIRId, string UId)
    {
        ProcedureName = "cfs_rejectedcirack";
        AddParameter("CIRId", CIRId);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
    #endregion

    #region FSR Rejection
    public DataSet GetRejectFSR(string UId)
    {
        ProcedureName = "cfg_rejectedcim";
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet SetRejectFSR(string CIMId, string UId)
    {
        ProcedureName = "cfs_rejectedcimack";
        AddParameter("CIMId", CIMId);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }

    public DataSet GetFSR(string CIMNumber, string CIMID, string UId)
    {
        ProcedureName = "cfg_CIM";
        AddParameter("CIMNumber", CIMNumber);
        AddParameter("CIMID", CIMID);
        AddParameter("UId", UId);
        return ExecuteProcedure;
    }
#endregion
}