
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
    public class ChatManager : MainClass
    {
        #region Global Variables
        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(ChatManager));
        #endregion

        #region Chat

        /// <summary>
        /// Save the Field alert Document details (Add and Delete)
        /// </summary>
        /// <param name="id">string</param>
        /// <param name="categoryId">string</param>
        /// <param name="fileName">string</param>
        /// <param name="refId">string</param>
        /// <param name="title">string</param>
        /// <param name="tagTitle">string</param>
        /// <param name="delFlag">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message EmpImageUpload(string Path, string Status, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("mrs_employeeimage", new
                    {
                        Path = Path,
                        Status = Status,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessageResult = reader.Read<Message>().ToList().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return oMessageResult;
        }

        public ChatResult SaveChat(ChatModel oChatModel, string loginUserId)
        {
            ChatResult oChatResult = new ChatResult();

            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("kms_Chat", new
                    {
                        Id = oChatModel.Id,
                        FromId = oChatModel.FromId,
                        ToId = oChatModel.ToId,
                        Msg = oChatModel.Msg,
                        Attachment = oChatModel.Attachment,
                        MsgView = oChatModel.MsgView,
                        AttachView = oChatModel.Attachview,
                        Refid = oChatModel.Refid,
                        view=oChatModel.view,
                        Delflag = oChatModel.Delflag,
                        UsrDelflag = oChatModel.UsrDelflag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oChatResult.MessageInfo = result.Read<Message>().FirstOrDefault();
                    //if (oChatResult.MessageInfo.Clear == "True")
                    //{
                    //    oChatResult.CIRData = result.Read<ChatModel>().FirstOrDefault();
                    //}
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "CIR", MethodName = "SaveCIRDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oChatResult;
        }

        public List<ChatModel> GetChat(string ToId, string loginUserId, string view)
        {
            List<ChatModel> IsGetChatModel = new List<ChatModel>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_Chat", new
                    {
                        UId = loginUserId,
                        ToId = ToId,
                        View = view
                    }, commandType: CommandType.StoredProcedure);
                    IsGetChatModel = reader.Read<ChatModel>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return IsGetChatModel;
        }


        public List<ChatModel> GetUser(string view, string searchId, string loginUserId)
        {
            List<ChatModel> IsGetChatModel = new List<ChatModel>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("kmg_chatusers", new
                    {
                        UId = loginUserId,
                        View = view,
                        SId = searchId
                    }, commandType: CommandType.StoredProcedure);
                    IsGetChatModel = reader.Read<ChatModel>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return IsGetChatModel;
        }
        #endregion

        #region Web API Details

        public Message SetChatAPI(string Id, string FromId, string ToId, string Msg, string Attachment, string MsgView,
           string AttachView, string Refid, string view, string Delflag, string UsrDelflag, string UId)
        {


            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("KMS_Chat", new
                    {
                        Id = Id,
                        FromId = FromId,
                        ToId = ToId,
                        Msg = Msg,
                        Attachment = Attachment,
                        MsgView = MsgView,
                        AttachView = AttachView,
                        Refid = Refid,
                        view = view,
                        Delflag = Delflag,
                        UsrDelflag = UsrDelflag,
                        UId = UId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Admin", MethodName = "GetPageAccess", Exception = ex.Message });
                string str = ex.Message;
            }
            return oMessage;
        }

        public List<ChatModel> GetChatAPI(string ToId, string loginUserId, string view)
        {
            List<ChatModel> IsGetChatModel = new List<ChatModel>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_Chat", new
                    {
                        UId = loginUserId,
                        ToId = ToId,
                        View = view
                    }, commandType: CommandType.StoredProcedure);
                    IsGetChatModel = reader.Read<ChatModel>().ToList();
                }
            }
            catch (Exception ex)
            {
                string str = ex.Message;
            }
            return IsGetChatModel;
        }

        public Message EmpImageUploadAPI(string Path, string Status, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("mrs_employeeimage", new
                    {
                        Path = Path,
                        Status = Status,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessageResult = reader.Read<Message>().ToList().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                string str = ex.Message;
            }
            return oMessageResult;
        }

        public List<ChatModel> GetUserAPI(string view, string searchId, string loginUserId)
        {
            List<ChatModel> IsGetChatModel = new List<ChatModel>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("kmg_chatusers", new
                    {
                        UId = loginUserId,
                        View = view,
                        SId = searchId
                    }, commandType: CommandType.StoredProcedure);
                    IsGetChatModel = reader.Read<ChatModel>().ToList();
                }
            }
            catch (Exception ex)
            {
                string str = (ex.Message);
            }
            return IsGetChatModel;
        }

        #endregion
    }
}
