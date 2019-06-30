using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{

    #region Admin

    public class AdminModel
    {
        public string Add { get; set; }
        public string View { get; set; }
        public string Update { get; set; }
        public string Delete { get; set; }
        public string Download { get; set; }
        public Message MessageInfo { get; set; }
    }

    #endregion

    #region Notification

    public class NotificationModel
    {
        public string MyPendings { get; set; }

    }

    public class Notification
    {
        public NotificationModel NotificationDetails { get; set; }
        public List<PendingDetailsForFE> PendingDetails { get; set; }
    }

    #endregion

    #region KMP File Approval

    public class KMPFile
    {
        public int Slno { get; set; }
        public string KFId { get; set; }
        public string PgeId { get; set; }
        public string KPage { get; set; }
        public string KFilename { get; set; }
        public string KFileFullPath { get; set; }
        public string IconName { get; set; }
        public string IconNameFullPath { get; set; }
        public string KPath { get; set; }
        public string KDesc { get; set; }
        public string KGId { get; set; }
        public string KMPgroup { get; set; }
    }

    public class KMPFileApproval
    {
        public int Slno { get; set; }
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public bool IsImage { get; set; }
        public string STATUS { get; set; }
    }

    #endregion

    #region Master Collection 

    public class CollectionModel
    {
        public string MCId { get; set; }
        public string RefId { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string Delflag { get; set; }
        public string View { get; set; }
        public string SubRefId { get; set; }
    }

    public class CollectionDetails
    {
        public int SlNo { get; set; }
        public string MCId { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string SubRefId { get; set; }
        public string IsParent { get; set; }
        public string RefId { get; set; }
    }

    public class CollectionData
    {
        public int SlNo { get; set; }
        public string MCId { get; set; }
        public string Name { get; set; }
        public string Desc { get; set; }
        public string Active { get; set; }
        public string SubRefId { get; set; }
        public string IsParent { get; set; }
        public List<CollectionDetails> SubMasterDetails { get; set; }
    }

    public class CollectionResult
    {
        public Message message { get; set; }
        public List<CollectionDetails> collectiondetails { get; set; }
    }

    public class CollectionSpecficationResult
    {
        public List<CollectionDetails> CollectionDetails { get; set; }
        public List<CollectionDetails> CollectionDetailsSpecification { get; set; }
    }

    public class FOMName
    {
        public string TbnId { get; set; }
    }

    public class FOMNameDetail
    {
        public string EmpId { get; set; }
        public string Emp_Name { get; set; }
    }

    public class FOMNameDetails
    {
        public List<FOMNameDetail> lst1 { get; set; }
        public List<FOMNameDetail> lst2 { get; set; }
    }

    #endregion

    #region Email

    public class EmailDetails
    {
        public int Slno { get; set; }
        public string ERId { get; set; }
        public string EmpId { get; set; }
        public string Emailto { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
        public string Employee { get; set; }
        public string CStatus { get; set; }
    }

    public class EmailModel
    {
        public string Status { get; set; }
        public string DepartmentId { get; set; }
        public string RoleId { get; set; }
        public string FunctionalSystem { get; set; }
        public string CStatus { get; set; }
    }

    public class EmailModelResult
    {
        public List<EmailDetails> EmployeeEmailDetails { get; set; }
        public string CStatus { get; set; }
        public Message MessageInfo { get; set; }
    }

    public class MailModel
    {
        public FromMail MailFromAddress { get; set; }
        public List<ToMail> MailToAddress { get; set; }
    }

    public class FromMail
    {
        public string FrmEmployee { get; set; }
        public string FromDesignation { get; set; }
        public string TSite { get; set; }
    }

    public class ToMail
    {
        public string Employee { get; set; }
        public string Designation { get; set; }
        public string OEmail { get; set; }
        public string MailTo { get; set; }
        public string BCC { get; set; }
        public string CC { get; set; }

    }

    #endregion

    #region Hierarchy 

    public class HierarchyModel
    {
        public string DsgId { get; set; }
        public string Designation { get; set; }
        public string AutoAssigned { get; set; }
        public string Status { get; set; }
        public string FromDesignation { get; set; }
        public string ToDesignation { get; set; }
        public string DelFlag { get; set; }
        public string CHId { get; set; }
    }

    public class HierarchyResult
    {
        public Message MessageInfo { get; set; }
        public List<HierarchyModel> HierarchyDetails { get; set; }
        public List<HierarchyDetails> HierarchyDetail { get; set; }
    }

    public class HierarchyDetails
    {
        public int SlNo { get; set; }
        public string CHId { get; set; }
        public string Frmdsg { get; set; }
        public string Todsg { get; set; }
        public string Frmdesig { get; set; }
        public string Todesig { get; set; }
        public string CStatus { get; set; }
        public string AutoAssign { get; set; }
        public string CSts { get; set; }
    }

    public class StatusModel
    {
        public string StsId { get; set; }
        public string Status { get; set; }
        public string AutoAssign { get; set; }
        public string view { get; set; }
        public string DsgId { get; set; }
        public string IDType { get; set; }
        public string Id { get; set; }
    }

    public class StatusModelResult
    {
        public List<StatusModel> StatusModels { get; set; }
        public List<StatusModel> StatusModelsWithDelete { get; set; }
        public StatusModel Status { get; set; }
        public string DsgId { get; set; }
    }

    #endregion

    #region Menu Details

    public class MasterMenuDetails
    {
        public string MdlId { get; set; }
        public string Module { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
        public bool MenuLink { get; set; }
    }

    public class SubMenuDetails
    {
        public string PgeId { get; set; }
        public string RefId { get; set; }
        public string Page { get; set; }
        public string Url { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
        public bool MenuLink { get; set; }
    }

    public class Menu
    {
        public string MdlId { get; set; }
        public string Module { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
        public bool MenuLink { get; set; }
        public List<SubMenuDetails> SubMenu { get; set; }
    }

    public class MenuResult
    {
        public List<MasterMenuDetails> MainMenu { get; set; }
        public List<SubMenuDetails> SubMenu { get; set; }
    }

    #endregion

    #region Page Access

    public class PageAccessModel
    {
        public string Access { get; set; }
    }

    public class PageMessage
    {
        public string Msg { get; set; }
        public string ServerDate { get; set; }
    }

    public class PageAccessResult
    {
        public PageMessage message { get; set; }
        public PageAccessModel pageaccess { get; set; }

    }

    #endregion

    #region Page 

    public class PageModel
    {
        public string PgeId { get; set; }
        public string RefId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Menu { get; set; }
        public string Active { get; set; }
        public string View { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
    }

    public class PageDetails
    {
        public string SlNo { get; set; }
        public string MdlId { get; set; }
        public string Module { get; set; }
        public string Url { get; set; }
        public string Menu { get; set; }
        public string Active { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
    }

    public class PageResult
    {
        public Message message { get; set; }
        public List<PageDetails> pagedetails { get; set; }
    }

    #endregion

    #region Site Map 

    public class SiteMapModel
    {
        public int SlNo { get; set; }
        public string State { get; set; }
        public string AssignedDate { get; set; }
        public string Employee { get; set; }
        public string View { get; set; }
        public string Site { get; set; }
    }

    public class GetEmpSiteMapModel
    {
        public int Slno { get; set; }
        public string StateId { get; set; }
        public string StateName { get; set; }
        public string AssignedDate { get; set; }
        public string EmpId { get; set; }
        public string SiteId { get; set; }
        public string Site { get; set; }
        public string Employee { get; set; }
    }

    public class UnAssignedSiteModel
    {
        public string EmpId { get; set; }
        public string Employee { get; set; }
        public string Status { get; set; }
        public string Code { get; set; }
        public string WBranch { get; set; }
    }

    public class AssignedSiteModel
    {
        public string SiteId { get; set; }
        public string SiteName { get; set; }
        public string Status { get; set; }
    }
    public class GetEmpSiteMapResult
    {
        public List<GetEmpSiteMapModel> GetEmpSiteMapModel { get; set; }
        public List<Message> GetMessage { get; set; }
    }

    public class SiteMapResult
    {
        public Message MessageInfo { get; set; }
        public List<SiteMapModel> SiteMapModels { get; set; }
        public List<AssignedSiteModel> AssignedSiteModels { get; set; }
        public List<UnAssignedSiteModel> UnAssignedSiteModels { get; set; }
    }

    #endregion


}
