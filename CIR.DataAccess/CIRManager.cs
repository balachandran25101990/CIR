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
    public class CIRManager : MainClass
    {

        #region Global Variables
        
        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(CIRManager));

        #endregion 

        #region Common Methods 

        /// <summary>
        /// Get the auto complete details for CIR and FSR.
        /// </summary>
        /// <param name="txt">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<CIRAutoComplete> GetAutoCompleteDetails(string txt, string refId, string viewType, string loginUserId)
        {
            List<CIRAutoComplete> lstAutoCompleteDetails = new List<CIRAutoComplete>();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_AutoComplete", new
                    {
                        View = viewType,
                        Text = txt,
                        RefId = refId,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstAutoCompleteDetails = result.Read<CIRAutoComplete>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "GetAutoCompleteDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return lstAutoCompleteDetails;
        }

        #endregion

        #region CIR 

        /// <summary>
        /// Get the CIR details based on the CIR Id.
        /// </summary>
        /// <param name="cirId">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CIRModelResult GetCIRDetails(string cirId, string loginUserId)
        {
            CIRModelResult oCIRModelResult = new CIRModelResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFG_CIR", new
                    {
                        CIRID = cirId,
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
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "GetCIRDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oCIRModelResult;
        }

        /// <summary>
        /// Generation of Unique Number based on the turbine  Id.
        /// </summary>
        /// <param name="turbineId">string</param>
        /// <param name="formType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public UniqueNumber GetUniqueNumberGeneration(string turbineId, string formType, string loginUserId)
        {
            UniqueNumber oUniquenumber = new UniqueNumber();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFG_UniqueNumber", new
                    {
                        TbnId = turbineId,
                        FormType = formType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oUniquenumber = result.Read<UniqueNumber>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "GetUniqueNumberGeneration", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oUniquenumber;
        }

        /// <summary>
        /// Save the CIR details.
        /// </summary>
        /// <param name="oCirModel">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CIRResult SaveCIRDetails(CIRModel oCirModel, string loginUserId)
        {
            CIRResult oCIRResult = new CIRResult();

            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIR", new
                    {
                        CIRId = oCirModel.CIRId,
                        CIRNumber = oCirModel.CIRNumber,
                        WONumber = oCirModel.WONumber,
                        TbnId = oCirModel.TbnId,
                        DOF = oCirModel.DateOfFailure,
                        AlarmCode = oCirModel.AlarmCode == null ? "0" : oCirModel.AlarmCode,
                        EmpId = oCirModel.EmpId,
                        SwVersion = oCirModel.SwVersion == null ? "0" : oCirModel.SwVersion,
                        HwVersion = oCirModel.HwVersion == null ? "0" : oCirModel.HwVersion,
                        WTGStatus = oCirModel.WTGStatus == null ? "0" : oCirModel.WTGStatus,
                        WTGStartTime = oCirModel.WTGStartTime,
                        WTGStopTime = oCirModel.WTGStopTime,
                        Production = oCirModel.Production,
                        RunHrs = oCirModel.RunHrs == null ? "0" : oCirModel.RunHrs,
                        FnSystem = oCirModel.FuncSystem == null ? "0" : oCirModel.FuncSystem,
                        CompGroup = oCirModel.ComponentGroup == null ? "0" : oCirModel.ComponentGroup,
                        ComponentMake = oCirModel.ComponentMake,
                        FailureDuring = oCirModel.FailureDuring == null ? "0" : oCirModel.FailureDuring,
                        SerialNumber = oCirModel.SerialNumber,
                        FOM = oCirModel.FOM == null ? "0" : oCirModel.FOM,
                        AlarmDesc = oCirModel.AlarmDesc,
                        UId = loginUserId,
                        Partcode = oCirModel.PartCode
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
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveCIRDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oCIRResult;
        }

        #endregion

        #region CIR Problem

        /// <summary>
        /// Save the CIR Problem details
        /// </summary>
        /// <param name="cirProblem">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveCIRProblem(CIRProblem cirProblem, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var conn = Connection())
                {
                    var result = conn.QueryMultiple("CFS_CIRProblem", new
                    {
                        CIRID = cirProblem.CIRId,
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

        #region CIR Action

        /// <summary>
        /// Save the Cir Action details.
        /// </summary>
        /// <param name="cirAction">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveCIRAction(CIRAction cirAction, string loginUserId)
        {
            Message oMessageInfo = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIRActions", new
                    {
                        CAId = cirAction.CAId,
                        CIRID = cirAction.CIRId,
                        Action = cirAction.ActionDesc,
                        DelFlag = cirAction.DelFlag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessageInfo = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveCIRAction", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessageInfo;
        }

        #endregion

        #region CIR Consequence

        /// <summary>
        /// Save the Consequence details
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
                    var result = connection.QueryMultiple("CFS_CIRConsequencialProblem", new
                    {
                        CIRID = cirConsequence.CIRId,
                        Consequence = cirConsequence.Consequence,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessageInfo = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveConsequence", Exception = ex.Message });Logger.Error(ex.Message);
                Logger.Error(ex.Message);
            }
            return oMessageInfo;
        }

        #endregion

        #region CIR 5W2H

        /// <summary>
        /// Save the CIR 5W2H details.
        /// </summary>
        /// <param name="cir5w2h">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveCIR5W2H(CIR5W2H cir5w2h, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIR5W2H", new
                    {
                        CIRId = cir5w2h.CIRId,
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
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveCIR5W2H", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Files

        /// <summary>
        /// Save the CIR File details.
        /// </summary>
        /// <param name="cirId">string</param>
        /// <param name="fileName">string</param>
        /// <param name="description">string</param>
        /// <param name="isImage">bool</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CIRFilesResult SaveCIRFiles(string cirId, string fileName, string description, bool isImage, string loginUserId)
        {
            CIRFilesResult oCIRFileResult = new CIRFilesResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIRFiles", new
                    {
                        CIRId = cirId,
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
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveCIRFiles", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oCIRFileResult;
        }

        /// <summary>
        /// Delete the file details.
        /// </summary>
        /// <param name="cirId">string</param>
        /// <param name="cfId">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message DeleteFile(string cirId, string cfId, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIRFiles", new
                    {
                        CIRId = cirId,
                        CFId = cfId,
                        UId = loginUserId,
                        DelFlag = "1"
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "DeleteFile", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Comments

        /// <summary>
        /// Save the CIR Comments details
        /// </summary>
        /// <param name="cirId">string</param>
        /// <param name="caId">string</param>
        /// <param name="comments">string</param>
        /// <param name="assignedTo">string</param>
        /// <param name="toDpt">string</param>
        /// <param name="cStatus">string</param>
        /// <param name="convertToNCR">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveCIRComments(string cirId, string caId, string comments, string assignedTo, string toDpt, string cStatus, string convertToNCR, string delflag, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFS_CIRApproval", new
                    {
                        CIRID = cirId,
                        CAId = caId,
                        Comments = comments,
                        AssignedTo = assignedTo == null ? "0" : assignedTo,
                        CStatus = cStatus,
                        ConvertToNCR = convertToNCR,
                        Delflag = delflag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveCIRComments", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

    }
}
