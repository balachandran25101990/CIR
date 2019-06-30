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
    public class KMPManager : MainClass
    {

        #region Global Variables

        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(KMPManager));

        #endregion

        //#region Alarm FAQ

        ///// <summary>
        ///// Save the Alarm FAQ details (Add and Delete)
        ///// </summary>
        ///// <param name="id">string</param>
        ///// <param name="categoryId">string</param>
        ///// <param name="fileName">string</param>
        ///// <param name="refId">string</param>
        ///// <param name="title">string</param>
        ///// <param name="tagTitle">string</param>
        ///// <param name="delFlag">string</param>
        ///// <param name="loginUserId">string</param>
        ///// <returns>object</returns>
        //public Message SetAlarmFAQ(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        //{
        //    Message oMessageResult = new Message();
        //    try
        //    {
        //        using (var connection = Connection())
        //        {
        //            var reader = connection.QueryMultiple("KMS_AlarmFAQ", new
        //            {
        //                Id = id,
        //                Refid = refId,
        //                CatId = categoryId,
        //                Filname = fileName,
        //                Title = title,
        //                TagTitle = tagTitle,
        //                Delflag = delFlag,
        //                UId = loginUserId
        //            }, commandType: CommandType.StoredProcedure);
        //            oMessageResult = reader.Read<Message>().ToList().FirstOrDefault();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.Error(ex.Message);
        //    }
        //    return oMessageResult;
        //}

        ///// <summary>
        ///// Get the Alarm FAQ details 
        ///// </summary>
        ///// <param name="categoryId">string</param>
        ///// <param name="refId">string</param>
        ///// <param name="viewType">string</param>
        ///// <param name="loginUserId">string</param>
        ///// <returns>list(object)</returns>
        //public List<AlarmDetailsNew> GetAlarmFAQ(string categoryId, string refId, string viewType, string loginUserId)
        //{
        //    List<AlarmDetailsNew> IsAlarmDetailsNew = new List<AlarmDetailsNew>();
        //    try
        //    {
        //        using (var connection = Connection())
        //        {
        //            var reader = connection.QueryMultiple("KMG_AlarmFAQ", new
        //            {
        //                REFID = refId,
        //                CatId = categoryId,
        //                view = viewType,
        //                UId = loginUserId
        //            }, commandType: CommandType.StoredProcedure);
        //            IsAlarmDetailsNew = reader.Read<AlarmDetailsNew>().ToList();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.Error(ex.Message);
        //    }
        //    return IsAlarmDetailsNew;
        //}

        //#endregion


        #region Alarm FAQ

        /// <summary>
        /// Get the Alarm code details and also alarm reason details.
        /// </summary>
        /// <param name="alrmCode">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public AlarmFAQModel GetAlarmDetails(string alrmCode, string loginUserId)
        {
            AlarmFAQModel oAlarmFAQModel = new AlarmFAQModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_AlarmFAQ", new { AFQID = alrmCode, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    oAlarmFAQModel.AlarmDetail = result.Read<AlarmDetails>().ToList();
                    oAlarmFAQModel.AlarmReasonDetail = result.Read<AlarmReasonDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "AlarmFAQ", MethodName = "GetAlarmDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oAlarmFAQModel;
        }

        #endregion

        #region Change Note

        /// <summary>
        /// Save the Change Note details (Add and Delete)
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
        public Message SetChangeNote(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMS_ChangeNote", new
                    {
                        Id = id,
                        Refid = refId,
                        CatId = categoryId,
                        Filname = fileName,
                        Title = title,
                        TagTitle = tagTitle,
                        Delflag = delFlag,
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

        /// <summary>
        /// Get the Change Note details 
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<ChangeNote > GetChangeNote(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<ChangeNote> IsChangeNote = new List<ChangeNote>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_ChangeNote", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    IsChangeNote = reader.Read<ChangeNote >().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return IsChangeNote;
        }

        #endregion


        #region Field alert Document

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
        public Message SetFieldAlertDocument(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMS_FieldAlertDocUpload", new
                    {
                        Id = id,
                        Refid = refId,
                        CatId = categoryId,
                        Filname = fileName,
                        Title = title,
                        TagTitle = tagTitle,
                        Delflag = delFlag,
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

        /// <summary>
        /// Get the Field alert document details 
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<FieldAlertDocument> GetFieldAlertDocument(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<FieldAlertDocument> lstFieldAlertDocument = new List<FieldAlertDocument>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_FieldAlertDocUpload", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstFieldAlertDocument = reader.Read<FieldAlertDocument>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return lstFieldAlertDocument;
        }

        #endregion

        #region Service Bullet In

        /// <summary>
        /// Save the Service Bullet in details (Add and Delete)
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
        public Message SetServiceBulletIn(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMS_ServiceBullet", new
                    {
                        Id = id,
                        Refid = refId,
                        CatId = categoryId,
                        Filname = fileName,
                        Title = title,
                        TagTitle = tagTitle,
                        Delflag = delFlag,
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

        /// <summary>
        /// Get the service bullet In details
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<ServiceBulletIn> GetServiceBulletIn(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<ServiceBulletIn> lstServiceBulletIn = new List<ServiceBulletIn>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_ServiceBullet", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstServiceBulletIn = reader.Read<ServiceBulletIn>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return lstServiceBulletIn;
        }

        #endregion

        #region WTG Software and Hardware

        /// <summary>
        /// Save the WTG Software and Hardware download details.
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
        public Message SetWTGSoftwareHardware(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMS_SWFWDocument", new
                    {
                        Id = id,
                        Refid = refId,
                        CatId = categoryId,
                        Filname = fileName,
                        Title = title,
                        TagTitle = tagTitle,
                        Delflag = delFlag,
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

        /// <summary>
        /// Get the WTG Software and Hardware details
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<WTGSoftwareHardware> GetWTGSoftwareHardware(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<WTGSoftwareHardware> lstWTGSoftwareHardware = new List<WTGSoftwareHardware>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_SWFWDocument", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstWTGSoftwareHardware = reader.Read<WTGSoftwareHardware>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return lstWTGSoftwareHardware;
        }

        #endregion

        #region Safety Alert

        /// <summary>
        /// Save the safety alert details 
        /// </summary>
        /// <param name="id">string</param>
        /// <param name="categoryId">string</param>
        /// <param name="fileName">string</param>
        /// <param name="refId">string</param>
        /// <param name="title">string</param>
        /// <param name="tagTitle">string</param>
        /// <param name="delFlag">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns></returns>
        public Message SetSafetyAlert(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMS_SafetyAlert", new
                    {
                        Id = id,
                        Refid = refId,
                        CatId = categoryId,
                        Filname = fileName,
                        Title = title,
                        TagTitle = tagTitle,
                        Delflag = delFlag,
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

        /// <summary>
        /// Get the Safety alert details.
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>List(object)</returns>
        public List<SafetyAlert> GetSafetyAlert(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<SafetyAlert> lstSafetyAlert = new List<SafetyAlert>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_SafetyAlert", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstSafetyAlert = reader.Read<SafetyAlert>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return lstSafetyAlert;
        }

        #endregion

        #region Customer Information Document

        /// <summary>
        /// Save the Customer Information document details. 
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
        public Message SetCustomerInfo(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMS_CustomerInformationDoc", new
                    {
                        Id = id,
                        Refid = refId,
                        CatId = categoryId,
                        Filname = fileName,
                        Title = title,
                        TagTitle = tagTitle,
                        Delflag = delFlag,
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

        /// <summary>
        /// Get the Customer Information document details.
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<CustomerInfo> GetCustomerInfo(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<CustomerInfo> lstCustomerInfo = new List<CustomerInfo>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_CustomerInformationDoc", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstCustomerInfo = reader.Read<CustomerInfo>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return lstCustomerInfo;
        }

        #endregion

    }
}
