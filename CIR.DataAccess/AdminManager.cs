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
    public class AdminManager : MainClass
    {

        #region Global Variables

        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(AdminManager));

        #endregion

        #region Change Password

        /// <summary>
        /// Saving the change password
        /// </summary>
        /// <param name="oldPassword">string</param>
        /// <param name="newPassword">string</param>
        /// /// <param name="Flag">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveChangePassword(string oldPassword, string newPassword, string Flag, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRS_ChangePassword", new
                    {
                        OldPassword = oldPassword,
                        NewPassword = newPassword,
                        Flag = Flag,
                        EmpId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Mail

        /// <summary>
        /// Get  the mail recipients to send the mail for CIR and FSR
        /// </summary>
        /// <param name="rptType"></param>
        /// <param name="id"></param>
        /// <param name="loginUserId"></param>
        /// <returns></returns>
        public MailModel GetMailDetailsTosendMail(string rptType, string id, string loginUserId)
        {
            MailModel oMailModel = new MailModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFG_CIRCIMEmailRecipients", new
                    {
                        Id = id,
                        RptType = rptType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    Message oMessage = result.Read<Message>().FirstOrDefault();
                    oMailModel.MailFromAddress = result.Read<FromMail>().FirstOrDefault();
                    oMailModel.MailToAddress = result.Read<ToMail>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return oMailModel;
        }

        #endregion

        #region KMP Files

        /// <summary>
        /// Save the KMP File Details (Add, Update and Delete)
        /// </summary>
        /// <param name="KFId">string</param>
        /// <param name="pageId">string</param>
        /// <param name="description">string</param>
        /// <param name="iconName">string</param>
        /// <param name="fileName">string</param>
        /// <param name="kgId">string</param>
        /// <param name="delFlag">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SaveKMPFiles(string KFId, string pageId, string description, string iconName, string fileName, string kgId, string delFlag, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("KMS_KMPFiles", new { KFId = KFId, PgeId = pageId, Filename = fileName, KGId = kgId, IconName = iconName, UId = loginUserId, Delflag = delFlag, Desc = description }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        /// <summary>
        /// Get the KMP File Details
        /// </summary>
        /// <param name="pageId">string</param>
        /// <param name="kgId">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<KMPFile> GetKMPFiles(string pageId, string kgId, string loginUserId)
        {
            List<KMPFile> lstKMPFiles = new List<KMPFile>();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("KMG_KMPFiles", new { PgeId = pageId, KGId = kgId, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    lstKMPFiles = result.Read<KMPFile>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Admin", MethodName = "GetKMPfiles", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return lstKMPFiles;
        }

        #endregion

        #region KMP File Approval

        /// <summary>
        /// Get the KMP File Approval files.
        /// </summary>
        /// <param name="pageId">string</param>
        /// <param name="categoryId">string</param>
        /// <param name="refId">string</param>
        /// <param name="status">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<KMPFileApproval> GetKMPFileApproval(string categoryId, string refId, string status, string viewType, string loginUserId)
        {
            List<KMPFileApproval> lstKMPFileApproval = new List<KMPFileApproval>();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_KMPFileAprroval", new
                    {
                        REFID = refId,
                        CatId = categoryId,
                        Status = status,
                        View = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstKMPFileApproval = result.Read<KMPFileApproval>().ToList();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return lstKMPFileApproval;
        }

        /// <summary>
        /// Save the KMP File Approval (add based on status)
        /// </summary>
        /// <param name="detailsId">string</param>
        /// <param name="pageId">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns></returns>
        public Message SetKMPFileApproval(string detailsId, string viewType, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRS_KMPFileAprroval", new
                    {
                        Id = detailsId,
                        View = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Page Access

        /// <summary>
        /// Get the Page Access details 
        /// </summary>
        /// <param name="pageName">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public AdminModel GetPageAccessDetails(string pageName, string loginUserId)
        {

            AdminModel oAdminModel = new AdminModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_PageAccess", new
                    {
                        Page = pageName,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oAdminModel.MessageInfo = result.Read<Message>().FirstOrDefault();
                    oAdminModel = result.Read<AdminModel>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Admin", MethodName = "GetPageAccess", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oAdminModel;
        }

        #endregion

        #region Email 

        /// <summary>
        /// Get the Email details.
        /// </summary>
        /// <param name="emailModel">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<EmailDetails> GetEmail(EmailModel emailModel, string loginUserId)
        {
            List<EmailDetails> lstEmailDetails = new List<EmailDetails>();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_EmailRecipients", new
                    {
                        Dept = emailModel.DepartmentId == null ? "0" : emailModel.DepartmentId,
                        Role = emailModel.RoleId == null ? "0" : emailModel.RoleId,
                        FnSys = emailModel.FunctionalSystem == null ? "0" : emailModel.FunctionalSystem,
                        CStatus = emailModel.CStatus == null ? "0" : emailModel.CStatus,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstEmailDetails = result.Read<EmailDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Email", MethodName = "GetEmail", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return lstEmailDetails;
        }

        /// <summary>
        /// Save the Email details.
        /// </summary>
        /// <param name="dtEmployeeEmailDetails">dataTable</param>
        /// <param name="cStatus">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SetEmail(DataTable dtEmployeeEmailDetails, string cStatus, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRS_EmailRecipients", new
                    {
                        Recipients = dtEmployeeEmailDetails,
                        EType = "1",
                        CStatus = cStatus == null ? "0" : cStatus,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Email", MethodName = "SetEmail", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Site Mapping

        /// <summary>
        /// Get the Employee Mapped details based on the site.
        /// </summary>
        /// <param name="siteMapModel">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public SiteMapResult GetEmployeeMappedDetails(SiteMapModel siteMapModel, string loginUserId)
        {
            SiteMapResult oSiteMapResult = new SiteMapResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_SiteMapping", new { Site = siteMapModel.Site, State = siteMapModel.State, View = siteMapModel.View, UId = loginUserId }, commandType: CommandType.StoredProcedure);

                    if (siteMapModel.View == "0")
                    {
                        oSiteMapResult.UnAssignedSiteModels = result.Read<UnAssignedSiteModel>().ToList();
                        oSiteMapResult.AssignedSiteModels = result.Read<AssignedSiteModel>().ToList();
                    }
                    else
                    {
                        oSiteMapResult.SiteMapModels = result.Read<SiteMapModel>().ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "SiteMap", MethodName = "GetEmployeeMappedDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oSiteMapResult;
        }

        public GetEmpSiteMapResult GetEmpSiteMappingDetails(GetEmpSiteMapModel siteMapModel, string loginUserId)
        {
            Message oMessage = new Message();
            GetEmpSiteMapResult oSiteMapResult = new GetEmpSiteMapResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_EmpSites", new { Site = siteMapModel.SiteId, State = siteMapModel.StateId, EmpId = siteMapModel.EmpId, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    oSiteMapResult.GetMessage = result.Read<Message>().ToList();
                    oSiteMapResult.GetEmpSiteMapModel = result.Read<GetEmpSiteMapModel>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "SiteMap", MethodName = "GetEmployeeMappedDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oSiteMapResult;
        }
        /// <summary>
        /// Save the SIte Mapping details (add, update and delete)
        /// </summary>
        /// <param name="siteMapModel">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SetSiteMapping(SiteMapModel siteMapModel, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRS_SiteMapping", new { Site = siteMapModel.Site, Employees = siteMapModel.Employee, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "SiteMap", MethodName = "SetSiteMapping", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        #endregion

        #region Hierarchy 

        /// <summary>
        /// Get the Designation details based on  the login user Id
        /// </summary>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public HierarchyResult GetDesignationDetails(string loginUserId)
        {

            HierarchyResult oHierarchyResult = new HierarchyResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_Designation", new { View = "0", UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    oHierarchyResult.HierarchyDetails = result.Read<HierarchyModel>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Hierarchy", MethodName = "GetDesignationDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oHierarchyResult;
        }

        /// <summary>
        /// Save the Hiearcrchy details (Add, update and delete)
        /// </summary>
        /// <param name="hierarchyModel">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SetHierarchyDetails(HierarchyModel hierarchyModel, string loginUserId)
        {
            Message oMessage = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRS_CIRHierarchy", new { CHId = hierarchyModel.CHId, FrmDsg = hierarchyModel.FromDesignation, ToDsg = hierarchyModel.ToDesignation, AutoAssign = hierarchyModel.AutoAssigned, CStatus = hierarchyModel.Status, UId = loginUserId, DelFlag = hierarchyModel.DelFlag }, commandType: CommandType.StoredProcedure);
                    oMessage = result.Read<Message>().FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Hierarchy", MethodName = "SetHierarchyDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oMessage;
        }

        /// <summary>
        /// Get the hierarchy details
        /// </summary>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public HierarchyResult GetHierarchyDetails(string loginUserId)
        {
            HierarchyResult oHierarchyResult = new HierarchyResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_CIRHierarchy", new { View = "1", UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    oHierarchyResult.HierarchyDetail = result.Read<HierarchyDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Hierarchy", MethodName = "GetHierarchyDetails", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oHierarchyResult;
        }

        /// <summary>
        /// Get the Status based on the site.
        /// </summary>
        /// <param name="statusModel">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>objecct</returns>
        public StatusModelResult GetStatus(StatusModel statusModel, string loginUserId)
        {
            StatusModelResult oStatusModelResult = new StatusModelResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_Status", new { View = statusModel.view, DsgId = statusModel.DsgId == null ? "0" : statusModel.DsgId, CStatus = statusModel.StsId, UId = loginUserId, IDType = statusModel.IDType == null ? "0" : statusModel.IDType, ID = statusModel.Id }, commandType: CommandType.StoredProcedure);
                    if (statusModel.view != "2")
                    {
                        oStatusModelResult.StatusModels = result.Read<StatusModel>().ToList();
                        oStatusModelResult.StatusModelsWithDelete = result.Read<StatusModel>().ToList();
                    }
                    else
                    {
                        oStatusModelResult.Status = result.Read<StatusModel>().FirstOrDefault();
                    }
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Hierarchy", MethodName = "GetStatus", Exception = ex.Message });
                Logger.Error(ex.Message);
            }
            return oStatusModelResult;
        }

        #endregion

    }
}
