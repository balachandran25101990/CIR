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
  public  class TQMManager:MainClass
    {

        #region Global Variables

        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(TQMManager));

        #endregion

        #region QIT Project

        /// <summary>
        /// Save the QIT Project details (Add and Delete)
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
        public Message SetQITProject(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("TQS_QITProject", new
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
        /// Get the QIT Project details 
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<QITPrjoect > GetQITProject(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<QITPrjoect> lstFieldAlertDocument = new List<QITPrjoect>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("TQG_QITProject", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstFieldAlertDocument = reader.Read<QITPrjoect>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return lstFieldAlertDocument;
        }

        #endregion

        #region TQM Reliability Report

        /// <summary>
        /// Save theTQM Reliability Report(Add and Delete)
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
        public Message SetTQMReliabilityReport(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("TQS_TQMReliability", new
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
        /// Get the TQM Reliability Report details 
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<TQMReliabilityReport> GetTQMReliabilityReport(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<TQMReliabilityReport > IsTQMReliabilityReport = new List<TQMReliabilityReport >();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("TQG_TQMReliability", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    IsTQMReliabilityReport = reader.Read<TQMReliabilityReport>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return IsTQMReliabilityReport;
        }

        #endregion

        #region SCM Report

        /// <summary>
        /// Save the SCM Report(Add and Delete)
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
        public Message SetSCMReport(string id, string categoryId, string fileName, string refId, string title, string tagTitle, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("TQS_SCMReport", new
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
        /// Get the SCM Report  
        /// </summary>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="viewType">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<SCMReport> GetSCMReport(string categoryId, string refId, string viewType, string loginUserId)
        {
            List<SCMReport > IsSCMReport = new List<SCMReport>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("TQG_SCMReport", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        view = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    IsSCMReport = reader.Read<SCMReport>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return IsSCMReport;
        }

        #endregion
    }
}
