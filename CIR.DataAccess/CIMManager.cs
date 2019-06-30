using CIR.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace CIR.DataAccess
{
    public class CIMManager : MainClass
    {

        #region Global Variables
        
        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(CIMManager));

        #endregion

        #region CIM Get details

        /// <summary>
        /// Get the CIM details based on CIM Id.
        /// </summary>
        /// <param name="cimId">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CIRModelResult GetCIMDetails(string cimId, string loginUserId)
        {
            CIRModelResult oCIRModelResult = new CIRModelResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFG_CIM", new
                    {
                        CIMID = cimId,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oCIRModelResult.CIRDetail = result.Read<CIRModel>().FirstOrDefault();
                    oCIRModelResult.CIRActionDetail = result.Read<CIRAction>().ToList();
                    oCIRModelResult.CIRFileDetail = result.Read<CIRFiles>().ToList();
                    oCIRModelResult.CIRComments = result.Read<CIRComments>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "GetCIMDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oCIRModelResult;
        }

        #endregion

        #region CIM

        /// <summary>
        /// Save the CIM details.
        /// </summary>
        /// <param name="oCirModel">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CIRResult SaveCIRDetails(CIRModel oCirModel, string loginUserId)
        {
            CIRResult oCIRResult = new CIRResult();

            try
            {
                using (var conn = Connection())
                {
                    var result = conn.QueryMultiple("CFS_CIM", new
                    {
                        CIMId = oCirModel.CIMId == null ? "0" : oCirModel.CIMId,
                        CIMNumber = oCirModel.CIMNumber == null ? "" : oCirModel.CIMNumber,
                        TbnId = oCirModel.TbnId == null ? "0" : oCirModel.TbnId,
                        DOF = oCirModel.DateOfFailure,
                        AlarmCode = oCirModel.AlarmCode,
                        EmpId = oCirModel.EmpId,
                        SwVersion = oCirModel.SwVersion,
                        HwVersion = oCirModel.HwVersion,
                        WTGStatus = oCirModel.WTGStatus == null ? "0" : oCirModel.WTGStatus,
                        WTGStartTime = oCirModel.WTGStartTime,
                        WTGStopTime = oCirModel.WTGStopTime,
                        Production = oCirModel.Production == null ? "0" : oCirModel.Production,
                        RunHrs = oCirModel.RunHrs == null ? "0" : oCirModel.RunHrs,
                        FnSytem = oCirModel.FuncSystem == null ? "0" : oCirModel.FuncSystem,
                        CompGroup = oCirModel.ComponentGroup == null ? "0" : oCirModel.ComponentGroup,
                        ComponentMake = oCirModel.ComponentMake,
                        FailureDuring = oCirModel.FailureDuring == null ? "0" : oCirModel.FailureDuring,
                        SerialNumber = oCirModel.SerialNumber,
                        FOM = oCirModel.FOM == null ? "0" : oCirModel.FOM,
                        UId = loginUserId,
                        Partcode = oCirModel.PartCode == null ? "" : oCirModel.PartCode,
                        WONumber = oCirModel.WONumber == null ? "" : oCirModel.WONumber,
                        TSite = oCirModel.TSite == null ? "0" : oCirModel.TSite,
                        DOC = oCirModel.DOC == null ? "" : oCirModel.DOC,
                        Turbine = oCirModel.TTurbine == null ? "" : oCirModel.TTurbine,
                        Customer = oCirModel.Customer == null ? "" : oCirModel.Customer,
                        Temp = oCirModel.TempName == null ? "" : oCirModel.TempName,
                        Dust = oCirModel.Dust == null ? "" : oCirModel.Dust,
                        Corrosion = oCirModel.Corrosion == null ? "" : oCirModel.Corrosion,
                        THeight = oCirModel.THeightName == null ? "" : oCirModel.THeightName,
                        Blade = oCirModel.Blade == null ? "" : oCirModel.Blade,
                        Generator = oCirModel.Generator == null ? "" : oCirModel.Generator,
                        GearBox = oCirModel.GearBox == null ? "" : oCirModel.GearBox,
                        CmrId = oCirModel.CmrId == null ? "0" : oCirModel.CmrId,
                        TempID = oCirModel.TempId == null ? "0" : oCirModel.TempId,
                        DustID = oCirModel.DustId == null ? "0" : oCirModel.DustId,
                        CorrosionId = oCirModel.CorrosionId == null ? "0" : oCirModel.CorrosionId,
                        THeightid = oCirModel.THeightId == null ? "0" : oCirModel.THeightId,
                        BladeId = oCirModel.BladeId == null ? "0" : oCirModel.BladeId,
                        GRiD = oCirModel.GRId == null ? "0" : oCirModel.GRId,
                        GBId = oCirModel.GBId == null ? "0" : oCirModel.GBId,
                        AlarmDesc = oCirModel.AlarmDesc == null ? "" : oCirModel.AlarmDesc,
                        WTGType = oCirModel.WTGType == null ? "" : oCirModel.WTGType,
                        WTGTypeId = oCirModel.WTGTypeID == null ? "0" : oCirModel.WTGTypeID
                    }, commandType: CommandType.StoredProcedure);
                    oCIRResult.MessageInfo = result.Read<Message>().FirstOrDefault();
                    if (oCIRResult.MessageInfo.Clear == "True")
                    {
                        oCIRResult.CIRData = result.Read<CIRModel>().FirstOrDefault();
                    }
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "SaveCIRDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oCIRResult;
        }

        #endregion

        #region CIM Problem

        /// <summary>
        /// save the CIr Problem details.
        /// </summary>
        /// <param name="cirProblem">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveCIMProblem(CIRProblem cirProblem, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var conn = Connection())
                {
                    var result = conn.QueryMultiple("CFS_CIMProblem", new
                    {
                        CIMID = cirProblem.CIMId,
                        ProblemDesc = cirProblem.Problem,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveCIRProblem", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region CIM Action

        /// <summary>
        /// Save the CIM Action Details 
        /// </summary>
        /// <param name="cirAction">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>SafetyAlert</returns>
        public Message SaveCIMAction(CIRAction cirAction, string loginUserId)
        {
            Message oMessageInfo = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIMActions", new
                    {
                        CAId = cirAction.CAId,
                        CIMID = cirAction.CIMId,
                        Action = cirAction.ActionDesc,
                        DelFlag = cirAction.DelFlag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessageInfo = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "SaveCIMAction", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessageInfo;
        }

        #endregion

        #region CIM Consequence

        /// <summary>
        /// Save the CIM Consequence 
        /// </summary>
        /// <param name="cirConsequence">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveConsequence(CIRConsequence cirConsequence, string loginUserId)
        {
            Message oMessageInfo = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIMConsequencialProblem", new
                    {
                        CIMID = cirConsequence.CIMId,
                        Consequence = cirConsequence.Consequence,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessageInfo = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "SaveConsequence", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessageInfo;
        }

        #endregion

        #region CIM 5W2H

        /// <summary>
        /// Save the CIM 5W2H details
        /// </summary>
        /// <param name="cir5w2h">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveCIM5W2H(CIR5W2H cir5w2h, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIM5W2H", new
                    {
                        CIMId = cir5w2h.CIMId,
                        What = cir5w2h.What,
                        When = cir5w2h.When,
                        Who = cir5w2h.Who,
                        Where = cir5w2h.Where,
                        Why = cir5w2h.Why,
                        Howtodo = cir5w2h.HowToDo,
                        Howmuch = cir5w2h.HowMuch,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "SaveCIM5W2H", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Files

        /// <summary>
        /// Save the CIM file details 
        /// </summary>
        /// <param name="cimId">string</param>
        /// <param name="fileName">string</param>
        /// <param name="description">string</param>
        /// <param name="isImage">bool</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CIRFilesResult SaveCIMFiles(string cimId, string fileName, string description, bool isImage, string loginUserId)
        {
            CIRFilesResult oCIRFileResult = new CIRFilesResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIMFiles", new
                    {
                        CIMId = cimId,
                        Filename = fileName,
                        IsImage = isImage,
                        Desc = description,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oCIRFileResult.MessageInfo = result.Read<Message>().FirstOrDefault();
                    oCIRFileResult.CIRFiles = result.Read<CIRFiles>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "SaveCIMFiles", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oCIRFileResult;
        }

        /// <summary>
        /// Delete the File and images.
        /// </summary>
        /// <param name="cimId">string</param>
        /// <param name="cfId">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message DeleteFile(string cimId, string cfId, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIMFiles", new
                    {
                        CIMId = cimId,
                        CFId = cfId,
                        UId = loginUserId,
                        DelFlag = "1"
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "DeleteFile", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Comments

        /// <summary>
        /// Save the CIm Comments.
        /// </summary>
        /// <param name="cimId">string</param>
        /// <param name="caId">string</param>
        /// <param name="comments">string</param>
        /// <param name="assignedTo">string</param>
        /// <param name="toDpt">string</param>
        /// <param name="cStatus">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveCIMComments(string cimId, string caId, string comments, string assignedTo, string toDpt, string cStatus, string delFlag, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIMApproval", new
                    {
                        CIMID = cimId,
                        CAId = caId,
                        Comments = comments,
                        AssignedTo = assignedTo == null ? "0" : assignedTo,
                        CStatus = cStatus,
                        DelFlag = delFlag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "SaveCIMComments", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Suggestion

        /// <summary>
        /// Save the suggestion details.
        /// </summary>
        /// <param name="cimId">string</param>
        /// <param name="description">string</param>
        /// <param name="fileName">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveSuggestion(string cimId, string description, string fileName, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIMSuggestion", new
                    {
                        CIMID = cimId,
                        SFilename = fileName,
                        SDesc = description,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIM", MethodName = "SaveSuggestion", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

    }
}
