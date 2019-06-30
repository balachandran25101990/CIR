using CIR.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using System.Net.Mail;
using System.IO;
using System.Net;
using System.Configuration;

namespace CIR.DataAccess
{
    public class MasterManager : MainClass
    {
        #region Global variables

        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MasterManager));

        #endregion

        #region Category

        /// <summary>
        /// Get the Category details based on the Viewtype 5 and 6.
        /// </summary>
        /// <param name="refId">string</param>
        /// <param name="view">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<CategoryModel> GetCategory(string refId, string categoryId, string view, string loginUserId)
        {
            List<CategoryModel> result = new List<CategoryModel>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRG_Category", new
                    {
                        RefId = refId,
                        Catid = categoryId,
                        View = view,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<CategoryModel>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the category details based on the mcId and RefId
        /// </summary>
        /// <param name="id">string</param>
        /// <param name="mcId">string</param>
        /// <param name="refId">string</param>
        /// <param name="category">string</param>
        /// <param name="active">string</param>
        /// <param name="delFlag">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Message SetCategory(string id, string mcId, string refId, string category, string active, string delFlag, string loginUserId)
        {
            Message oMessageResult = new Message();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRS_Category", new
                    {
                        Id = id,
                        MCId = mcId,
                        RefId = refId,
                        Category = category,
                        Active = active,
                        Delflag = delFlag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oMessageResult = reader.Read<Message>().ToList().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Employee", MethodName = "SetEmployee", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oMessageResult;
        }

        #endregion

        #region Department 

        /// <summary>
        /// get the Department details based on the View Type
        /// </summary>
        /// <param name="department">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<DepartmentDetails> GetDepartment(DepartmentModel department, string loginUserId)
        {
            List<DepartmentDetails> lstDepartmentDetails = new List<DepartmentDetails>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRG_Department", new
                    {
                        DptId = department.DptId,
                        View = department.View,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstDepartmentDetails = reader.Read<DepartmentDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Department", MethodName = "GetDepartment", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return lstDepartmentDetails;
        }

        /// <summary>
        /// Saving the department details(Add, Update and delete)
        /// </summary>
        /// <param name="department">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DepartmentResult SetDepartment(DepartmentModel department, string loginUserId)
        {
            DepartmentResult oDepartmentResult = new DepartmentResult();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRS_Department", new
                    {
                        DptId = department.DptId,
                        Name = department.Name,
                        Desc = department.Desc,
                        Code = department.Code,
                        Active = department.Active,
                        Delflag = department.Delflag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDepartmentResult.message = reader.Read<Message>().ToList().FirstOrDefault();
                    oDepartmentResult.departmentdetails = reader.Read<DepartmentDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Department", MethodName = "SetDepartment", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return oDepartmentResult;
        }

        #endregion

        #region Designation

        /// <summary>
        /// Get the designation details based on the different Viewtype.
        /// </summary>
        /// <param name="designation">object</param>
        /// <param name="UId">string</param>
        /// <returns>list</returns>
        public List<DesignationDetails> GetDesignation(DesignationModel designation, string loginUserId)
        {
            List<DesignationDetails> lstDesignationDetails = new List<DesignationDetails>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRG_Designation", new
                    {
                        DsgId = designation.DsgId,
                        View = designation.View,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstDesignationDetails = reader.Read<DesignationDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Designation", MethodName = "GetDesignation", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return lstDesignationDetails;
        }

        /// <summary>
        /// Save the designation details (Add, update and delete)
        /// </summary>
        /// <param name="designation">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public DesignationResult SetDesignation(DesignationModel designation, string loginUserId)
        {
            DesignationResult result = new DesignationResult();

            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRS_Designation", new
                    {
                        DsgId = designation.DsgId,
                        Name = designation.Name,
                        Desc = designation.Desc,
                        Code = designation.Code,
                        Active = designation.Active,
                        Delflag = designation.Delflag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.designationdetails = reader.Read<DesignationDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Designation", MethodName = "SetDesignation", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Get the details is Auto assignd or not based on designation Id.
        /// </summary>
        /// <param name="designationId">string</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DesignationDetails GetDetailsIsAutoAssigneOrNot(string designationId, string loginUserId)
        {
            DesignationDetails oDesignationDetails = new DesignationDetails();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_Designation", new
                    {
                        View = "2",
                        DsgId = designationId,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDesignationDetails = result.Read<DesignationDetails>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Designation", MethodName = "GetDetailsIsAutoAssigneOrNot", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oDesignationDetails;
        }

        #endregion

        #region Design Modification

        /// <summary>
        /// get the Design Modification details based on the View Type
        /// </summary>
        /// <param name="Design Modification">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<DMMasterDetail> GetDMMaster(DMMasterModel DMMastermodel, string loginUserId)
        {
            List<DMMasterDetail> lstDMMasterDetail = new List<DMMasterDetail>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRG_DesignModification", new
                    {
                        View = DMMastermodel.View,
                        RefId = DMMastermodel.RefId,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstDMMasterDetail = reader.Read<DMMasterDetail>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return lstDMMasterDetail;
        }

        public DMMasterResult SetDMMaster(DMMasterModel DMMastermodel, string LoginUserId)
        {
            DMMasterResult DMMasterResult = new DMMasterResult();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRS_DesignModification", new
                    {
                        DMId = DMMastermodel.DMId,
                        RefId = DMMastermodel.RefId,
                        Title = DMMastermodel.Title,
                        SBNo = DMMastermodel.SBNo,
                        TDNo = DMMastermodel.TDNo,
                        MENNo = DMMastermodel.MENNo,
                        Desc = DMMastermodel.Desc,
                        Active = DMMastermodel.Active,
                        Delflag = DMMastermodel.Delflag,
                        UId = LoginUserId
                    }, commandType: CommandType.StoredProcedure);
                    DMMasterResult.message = reader.Read<Message>().ToList().FirstOrDefault();
                    DMMasterResult.DMMasterDetailArray = reader.Read<DMMasterDetail>().ToList();
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return DMMasterResult;
        }

        #endregion

        #region Employee

        /// <summary>
        /// Get the employee details.
        /// </summary>
        /// <param name="employee">object</param>
        /// <param name="UId">string</param>
        /// <returns>list</returns>
        public EmployeeDetails GetEmployee(EmployeeModel employee, string loginUserId)
        {
            EmployeeDetails result = new EmployeeDetails();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRG_Employee", new
                    {
                        EmpId = employee.EmpId,
                        Text = employee.Text,
                        View = employee.View,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    result.EmployeeDetail = reader.Read<EmployeeDetails>().ToList();
                    result.EmployeeExcelDownloadDetails = reader.Read<EmployeeExcelDownloadDetails>().ToList();

                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Employee", MethodName = "GetEmployee", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the employee details.
        /// </summary>
        /// <param name="employee">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public EmployeeResult SetEmployee(EmployeeModel employee, string loginUserId)
        {
            EmployeeResult oEmployeeResult = new EmployeeResult();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRS_Employee", new
                    {
                        EmpId = employee.EmpId,
                        EmpName = employee.EmpName,
                        ICHCode = employee.ICHCode,
                        SAPCode = employee.SAPCode,
                        DptId = employee.DptId,
                        DsgId = employee.DsgId,
                        OMobile = employee.OMobile,
                        OEmail = employee.OEmail,
                        RleId = employee.RleId,
                        Pwd = employee.Pwd,
                        Active = employee.Active,
                        Delflag = employee.Delflag,
                        FnSystem = employee.FnSystem,
                        MultiSite = employee.MultiSite == null ? "False" : employee.MultiSite,
                        WorkingAt = employee.WorkingAt,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oEmployeeResult.message = reader.Read<Message>().ToList().FirstOrDefault();
                    oEmployeeResult.employeedetails = reader.Read<EmployeeDetails>().ToList();
                }

            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Employee", MethodName = "SetEmployee", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oEmployeeResult;
        }

        /// <summary>
        /// Get Employee Excel details
        /// </summary>
        /// <param name="employeeexcel">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public EmployeeExcelGetResult GetEmployeeExcel(EmployeeExcelModel employeeexcel, string loginUserId)
        {
            EmployeeExcelGetResult result = new EmployeeExcelGetResult();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("XLG_EmployeeUpload", new
                    {
                        EUNo = employeeexcel.EUNo,
                        ViewType = employeeexcel.ViewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    result.headerdetails = reader.Read<EmployeeExcelHeaderDetails>().ToList().FirstOrDefault();
                    result.employeeexceldetails = reader.Read<EmployeeExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Employee", MethodName = "GetEmployeeExcel", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the Employee excel details 
        /// </summary>
        /// <param name="employeeexcel"></param>
        /// <param name="UId"></param>
        /// <returns></returns>
        public EmployeeExcelSetResult SetEmployeeExcel(EmployeeExcelModel employeeexcel, string loginUserId)
        {
            EmployeeExcelSetResult result = new EmployeeExcelSetResult();

            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("XLS_EmployeeUpload", new
                    {
                        Employee = employeeexcel.Employee,
                        FileName = employeeexcel.FileName,
                        Remarks = employeeexcel.Remarks,
                        Submit = employeeexcel.Submit,
                        EUId = employeeexcel.EUId,
                        RowId = employeeexcel.RowId,
                        Delflag = employeeexcel.Delflag,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<ExcelMessage>().ToList().FirstOrDefault();
                    result.employeeexceldetails = reader.Read<EmployeeExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Employee", MethodName = "GetEmployeeExcel", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region Manufactures

        /// <summary>
        /// Get the Manufactures list 
        /// </summary>
        /// <param name="manufacturer">object</param>
        /// <param name="UId">string</param>
        /// <returns>list</returns>
        public List<ManufacturerDetails> GetManufacturers(ManufacturerModel manufacturer, string loginUserId)
        {
            List<ManufacturerDetails> result = new List<ManufacturerDetails>();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRG_Manufacturers", new { MType = manufacturer.MType, Text = manufacturer.Text, View = manufacturer.View, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<ManufacturerDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Manufactures", MethodName = "GetManufacturers", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the manufactures (Add, Edit and delete)
        /// </summary>
        /// <param name="manufacturer">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public ManufacturerResult SetManufacturers(ManufacturerModel manufacturer, string loginUserId)
        {
            ManufacturerResult result = new ManufacturerResult();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRS_Manufacturers", new { MfrId = manufacturer.MfrId, MType = manufacturer.MType, Name = manufacturer.Name, Desc = manufacturer.Desc, Active = manufacturer.Active, Delflag = manufacturer.Delflag, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.manufacturerdetails = reader.Read<ManufacturerDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "Manufactures", MethodName = "SetManufacturers", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region Master Collection

        /// <summary>
        /// Get the Master Collection details.
        /// </summary>
        /// <param name="collection">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<CollectionDetails> GetMasterCollection(CollectionModel collection, string loginUserId)
        {
            List<CollectionDetails> result = new List<CollectionDetails>();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRG_MasterCollection", new { RefId = collection.RefId, View = collection.View, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<CollectionDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "MasterCollection", MethodName = "GetMasterCollection", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return result;
        }

        /// <summary>
        /// Get the FOM Name Details based on the Turbine ID
        /// </summary>
        /// <param name="collection">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
		public FOMNameDetails GetFOMName(FOMName collection, string loginUserId)
        {
            FOMNameDetails result = new FOMNameDetails();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("CFG_AssignTo", new { TbnID = collection.TbnId, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result.lst1 = reader.Read<FOMNameDetail>().ToList();
                    result.lst2 = reader.Read<FOMNameDetail>().ToList();

                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "MasterCollection", MethodName = "GetMasterCollection", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return result;
        }

        /// <summary>
        /// Get the Sub Master Collection details.
        /// </summary>
        /// <param name="collection">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<CollectionData> GetSubMasterCollection(CollectionModel collection, string loginUserId)
        {
            List<CollectionData> lstCollectionData = new List<CollectionData>();
            List<CollectionDetails> lstMasterCollectionDetails = new List<CollectionDetails>();
            List<CollectionDetails> lstSubMasterCllectionDetails = new List<CollectionDetails>();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRG_MasterCollection", new { RefId = collection.RefId, View = collection.View, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    lstMasterCollectionDetails = reader.Read<CollectionDetails>().ToList();
                    lstSubMasterCllectionDetails = reader.Read<CollectionDetails>().ToList();
                }


                foreach (var item in lstMasterCollectionDetails)
                {
                    CollectionData oCollectionData = new CollectionData();
                    oCollectionData.MCId = item.MCId;
                    oCollectionData.Name = item.Name;
                    oCollectionData.SubMasterDetails = new List<CollectionDetails>();
                    foreach (var subMaster in lstSubMasterCllectionDetails)
                    {
                        if (item.MCId == subMaster.RefId)
                        {
                            oCollectionData.SubMasterDetails.Add(subMaster);
                        }
                    }
                    lstCollectionData.Add(oCollectionData);
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "MasterCollection", MethodName = "GetSubMasterCollection", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return lstCollectionData;
        }

        /// <summary>
        /// Get Master Collection Specification details.
        /// </summary>
        /// <param name="collection">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CollectionSpecficationResult GetMastercollectionSpecification(CollectionModel collection, string loginUserId)
        {
            CollectionSpecficationResult oCollectionSpecificatioResult = new CollectionSpecficationResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_MasterCollection", new { RefId = collection.RefId, View = collection.View, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    oCollectionSpecificatioResult.CollectionDetails = result.Read<CollectionDetails>().ToList();
                    oCollectionSpecificatioResult.CollectionDetailsSpecification = result.Read<CollectionDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "MasterCollection", MethodName = "GetMastercollectionSpecification", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oCollectionSpecificatioResult;
        }

        /// <summary>
        /// Save the Master Collection details (Add, Update and delete)
        /// </summary>
        /// <param name="collection">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public CollectionResult SetMasterCollection(CollectionModel collection, string loginUserId)
        {
            CollectionResult result = new CollectionResult();

            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRS_MasterCollection", new { MCId = collection.MCId, RefId = collection.RefId, Name = collection.Name, Desc = collection.Desc, InRef = collection.SubRefId == null ? "" : collection.SubRefId, Active = collection.Active, Delflag = collection.Delflag, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.collectiondetails = reader.Read<CollectionDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "MasterCollection", MethodName = "SetMastercollection", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region Page Master

        /// <summary>
        /// Get the Page master details.
        /// </summary>
        /// <param name="page">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<PageDetails> GetPageMaster(PageModel page, string loginUserId)
        {
            List<PageDetails> result = new List<PageDetails>();

            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRG_Page", new { PgeId = page.PgeId, View = page.View, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<PageDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "PageMaster", MethodName = "GetPageMaster", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the Page Master Details (Add, update and delete)
        /// </summary>
        /// <param name="page">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public PageResult SetPageMaster(PageModel page, string loginUserId)
        {
            PageResult result = new PageResult();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRS_Page", new { PgeId = page.PgeId, RefId = page.RefId, Name = page.Name, Action = page.Action, Controller = page.Controller, Url = "", Menu = page.Menu, Active = page.Active, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.pagedetails = reader.Read<PageDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "PageMaster", MethodName = "SetPageMaster", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return result;
        }

        #endregion

        #region Role

        /// <summary>
        /// Get the Role details.
        /// </summary>
        /// <param name="role">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<RoleDetails> GetRole(RoleModel role, string loginUserId)
        {
            List<RoleDetails> result = new List<RoleDetails>();

            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRG_Role", new { RleId = role.RleId, View = role.View, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<RoleDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "RoleAccess", MethodName = "GetRole", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the Role details (add, Update and delete)
        /// </summary>
        /// <param name="role">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public RoleResult SetRole(RoleModel role, string loginUserId)
        {
            RoleResult result = new RoleResult();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRS_Role", new { RleId = role.RleId, Name = role.Name, Active = role.Active, Delflag = role.Delflag, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.roledetails = reader.Read<RoleDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "RoleAccess", MethodName = "SetRole", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region Role Access

        /// <summary>
        /// Get the Role access details.
        /// </summary>
        /// <param name="roleaccess">object</param>
        /// <param name="UId">string</param>
        /// <returns>list</returns>
        public List<RoleAccessDetails> GetRoleAccess(RoleAccessModel roleaccess, string UId)
        {
            List<RoleAccessDetails> result = new List<RoleAccessDetails>();

            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRG_RoleAccess", new { RleId = roleaccess.Rleid, ViewType = roleaccess.ViewType, UId = UId }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<RoleAccessDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = UId, ModuleName = "RoleAccess", MethodName = "GetRoleAccess", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the Role Access details(Add, Update and Delete)
        /// </summary>
        /// <param name="roleaccess">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public Message SetRoleAccess(RoleAccessModel roleaccess, string UId)
        {
            Message result = new Message();

            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRS_RoleAccess", new { Rleid = roleaccess.Rleid, Access = roleaccess.Access, UId = UId }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<Message>().ToList().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = UId, ModuleName = "RoleAccess", MethodName = "SetRoleAccess", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region SpareParts

        /// <summary>
        /// get the SpareParts details based on the View Type
        /// </summary>
        /// <param name="SpareParts">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>list</returns>
        public List<SparePartsDetails> GetSpareParts(SparePartsModel sparepartsmodel, string LoginUserId)
        {
            List<SparePartsDetails> lstsparepartsdetails = new List<SparePartsDetails>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRG_DMTools", new
                    {
                        //DMId = sparepartsmodel.DMId,
                        //RefMCId = sparepartsmodel.RefMCId,
                        UId = LoginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstsparepartsdetails = reader.Read<SparePartsDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return lstsparepartsdetails;
        }

        /// <summary>
        /// Save the Spare parts details (add, update and delete).
        /// </summary>
        /// <param name="sparepartsmodel">object</param>
        /// <param name="LoginUserId">string</param>
        /// <returns>object</returns>
        public SparePartsResult SetSpareResult(SparePartsModel sparepartsmodel, string LoginUserId)
        {
            SparePartsResult sparepartsresult = new SparePartsResult();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("MRS_DMTools", new
                    {
                        DTId = sparepartsmodel.DTId,
                        DMId = sparepartsmodel.DMId,
                        RefMCId = sparepartsmodel.RefMCId,
                        ToolsPartsMaterials = sparepartsmodel.ToolsPartsMaterials,
                        FileName = sparepartsmodel.FileName,
                        Desc = sparepartsmodel.Desc,
                        Delflag = sparepartsmodel.Delflag,
                        UId = LoginUserId
                    }, commandType: CommandType.StoredProcedure);
                    sparepartsresult.message = reader.Read<Message>().ToList().FirstOrDefault();
                    sparepartsresult.SparePartsArray = reader.Read<SparePartsDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return sparepartsresult;
        }

        #endregion

        #region Turbine

        /// <summary>
        /// List all the Turbine details.
        /// </summary>
        /// <param name="turbine">object</param>
        /// <param name="UId">string</param>
        /// <returns>list(object)</returns>
        public TurbineDetails GetTurbine(TurbineModel turbine, string UId)
        {
            TurbineDetails result = new TurbineDetails();
            try
            {
                var Parameter = new { Site = turbine.Site, Text = turbine.Text == null ? "" : turbine.Text, View = turbine.View, UId = UId, TbnID = turbine.TurbineId };
                var SPName = "MRG_Turbine";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandTimeout:900, commandType: CommandType.StoredProcedure);
                    result.TurbineDetail = reader.Read<TurbineDetails>().ToList();
                    //result.TurbineExcelDownloads = reader.Read<TurbineExcelDownload>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        public List<TurbineExcelDownload> GetTurbineExcel(TurbineModel turbine, string UId)
        {
            List<TurbineExcelDownload> result = new List<TurbineExcelDownload>();
            try
            {
                var Parameter = new { Site = turbine.Site, Text = turbine.Text == null ? "" : turbine.Text, View = turbine.View, UId = UId, TbnID = turbine.TurbineId };
                var SPName = "MRG_Turbine";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    //result.TurbineDetail = reader.Read<TurbineDetails>().ToList();
                    //result.TurbineExcelDownload = reader.Read<TurbineExcelDownload>().ToList();
                    result = reader.Read<TurbineExcelDownload>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the Turbine details On single save button was clicked.
        /// </summary>
        /// <param name="turbine">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public TurbineResult SetTurbine(TurbineModel turbine, string UId)
        {
            TurbineResult result = new TurbineResult();
            try
            {
                var Parameter = new
                {
                    TbnId = turbine.TbnId,
                    TurbineId = turbine.TurbineId,
                    CmrGroupId = turbine.CmrGroupId,
                    CmrId = turbine.CmrId,
                    DOC = turbine.DOC,
                    Site = turbine.Site,
                    FnLoc = turbine.FnLoc,
                    Capacity = turbine.Capacity,
                    THeight = turbine.THeight,
                    Blade = turbine.Blade,
                    GRId = turbine.GRId,
                    GRSlno = turbine.GRSlno,
                    GBId = turbine.GBId,
                    GBSlno = turbine.GBSlno,
                    Temp = turbine.Temp,
                    Dust = turbine.Dust,
                    Corrosion = turbine.Corrosion,
                    Active = turbine.Active,
                    Delflag = turbine.Delflag,
                    WTGType = turbine.WTGType,
                    SwVersion = turbine.SWVersion,
                    HwVersion = turbine.HWVersion,
                    ScadaName = turbine.ScadaName,
                    Location = turbine.Location,
                    UId = UId
                };
                var SPName = "MRS_Turbine";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.turbinedetails = reader.Read<TurbineDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Get the Turbine excel details Upload and saving.
        /// </summary>
        /// <param name="turbineexcel">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public TurbineExcelGetResult GetTurbineExcel(TurbineExcelModel turbineexcel, string UId)
        {
            TurbineExcelGetResult result = new TurbineExcelGetResult();
            try
            {
                var Parameter = new { TUNo = turbineexcel.TUNo, ViewType = turbineexcel.ViewType, UId = UId };
                var SPName = "XLG_TurbineUpload";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.headerdetails = reader.Read<TurbineExcelHeaderDetails>().ToList().FirstOrDefault();
                    result.turbineexceldetails = reader.Read<TurbineExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the Turbine entry excel details.
        /// </summary>
        /// <param name="turbineexcel">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public TurbineExcelSetResult SetTurbineExcel(TurbineExcelModel turbineexcel, string UId)
        {
            TurbineExcelSetResult result = new TurbineExcelSetResult();
            try
            {
                var Parameter = new { Turbine = turbineexcel.Turbine, FileName = turbineexcel.FileName, Remarks = turbineexcel.Remarks, Submit = turbineexcel.Submit, TUId = turbineexcel.TUId, RowId = turbineexcel.RowId, Delflag = turbineexcel.Delflag, UId = UId };
                var SPName = "XLS_TurbineUpload";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<ExcelMessage>().ToList().FirstOrDefault();
                    result.turbineexceldetails = reader.Read<TurbineExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region turbine version update

        public TurbineVersionUpdateExcelGetResult GetTurbineVersionUpdExcel(TurbineVersUpdtModel turbineexcel, string UId)
        {
            TurbineVersionUpdateExcelGetResult result = new TurbineVersionUpdateExcelGetResult();
            try
            {
                var Parameter = new { TUNo = turbineexcel.TUNo, ViewType = turbineexcel.ViewType, UId = UId };
                var SPName = "xlg_turbineuploadupdate";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.headerdetails = reader.Read<TurbineExcelHeaderDetails>().ToList().FirstOrDefault();
                    result.turbineexceldetails = reader.Read<TurbineVersionUpdateExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        public List<TurbineVersionUpdateExcelDetails> GetLoadFilename(TurbineVersUpdtModel turbineexcel, string loginUserId)
        {
            List<TurbineVersionUpdateExcelDetails> result = new List<TurbineVersionUpdateExcelDetails>();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("xlg_turbineuploadupdate", new { TUNo = turbineexcel.TUNo, ViewType = turbineexcel.ViewType, UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    result = reader.Read<TurbineVersionUpdateExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "MasterCollection", MethodName = "GetMasterCollection", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return result;
        }

        public List<TurbineVersionUpdateGetStatuss> GetLoadStatus(TurbineVersUpdtModel turbineexcel, string UId)
        {
            List<TurbineVersionUpdateGetStatuss> result = new List<TurbineVersionUpdateGetStatuss>();
            try
            {
                var Parameter = new { TUNo = turbineexcel.TUNo, ViewType = turbineexcel.ViewType, UId = UId };
                var SPName = "xlg_turbineuploadupdate";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result = reader.Read<TurbineVersionUpdateGetStatuss>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        public TurbineVersionUpdateSetResult SetTurbineVersionUpdateExcel(TurbineVersUpdtModel turbineexcel, string UId)
        {
            TurbineVersionUpdateSetResult result = new TurbineVersionUpdateSetResult();
            try
            {
                var Parameter = new { TurbineUpdate = turbineexcel.TurbineUpdate, FileName = turbineexcel.FileName, Remarks = turbineexcel.Remarks, Submit = turbineexcel.Submit, TUId = turbineexcel.TUId, RowId = turbineexcel.RowId, Delflag = turbineexcel.Delflag, Status = turbineexcel.Status, AssignTo = turbineexcel.AssignTo, TbnIds = turbineexcel.TbnId, UId = UId };

                var SPName = "xls_turbineuploadupdate";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<VersionUpdtExcelMessage>().ToList().FirstOrDefault();
                    result.turbineexceldetails = reader.Read<TurbineVersionUpdateExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        public TurbineVersionUpdateSetResult SetTurbineVersionUpdatePostExcel(TurbineVersUpdtModel turbineexcel, string UId)
        {
            TurbineVersionUpdateSetResult result = new TurbineVersionUpdateSetResult();
            try
            {
                var Parameter = new { FileName = turbineexcel.FileName, Remarks = turbineexcel.Remarks, Submit = turbineexcel.Submit, TUId = turbineexcel.TUId, RowId = turbineexcel.RowId, Delflag = turbineexcel.Delflag, Status = turbineexcel.Status, AssignTo = turbineexcel.AssignTo, UId = UId };

                var SPName = "xls_turbineuploadupdate";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<VersionUpdtExcelMessage>().ToList().FirstOrDefault();
                    result.turbineexceldetails = reader.Read<TurbineVersionUpdateExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region Turbine Data Entry

        /// <summary>
        /// Get the turbine Data entry details.
        /// </summary>
        /// <param name="TurbineDataEntryModel">object</param>
        /// <param name="LoginUserId">string</param>
        /// <returns>list(object)</returns>
        public List<TurbineDataEntryDetails> GetTurbineDataEntry(TurbineDataEntryModel TurbineDataEntryModel, string LoginUserId)
        {
            List<TurbineDataEntryDetails> lstTurbineDataEntry = new List<TurbineDataEntryDetails>();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMG_TurbineDM", new
                    {
                        //TbnId = TurbineDataEntryModel.TbnId,
                        UId = LoginUserId
                    }, commandType: CommandType.StoredProcedure);
                    lstTurbineDataEntry = reader.Read<TurbineDataEntryDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return lstTurbineDataEntry;
        }

        /// <summary>
        /// Save the Turbine data entry details (Add, Update and Delete).
        /// </summary>
        /// <param name="TurbineDataEntrymodel">object</param>
        /// <param name="LoginUserId">string</param>
        /// <returns>object</returns>
        public TurbineDataEntryResult SetTurbineDataEntry(TurbineDataEntryModel TurbineDataEntrymodel, string LoginUserId)
        {
            TurbineDataEntryResult Turbinedataentryresult = new TurbineDataEntryResult();
            try
            {
                using (var connection = Connection())
                {
                    var reader = connection.QueryMultiple("KMS_TurbineDM", new
                    {
                        TDId = TurbineDataEntrymodel.TDId,
                        DMId = TurbineDataEntrymodel.DMId,
                        TbnId = TurbineDataEntrymodel.TbnId,
                        StsId = TurbineDataEntrymodel.StsId,
                        AnalyzingStatus = TurbineDataEntrymodel.AnalyzingStatus,
                        Desc = TurbineDataEntrymodel.Desc,
                        Delflag = TurbineDataEntrymodel.Delflag,
                        UId = LoginUserId
                    }, commandType: CommandType.StoredProcedure);
                    Turbinedataentryresult.message = reader.Read<Message>().ToList().FirstOrDefault();
                    Turbinedataentryresult.TurbineDataEntryArray = reader.Read<TurbineDataEntryDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Turbinedataentryresult;
        }

        /// <summary>
        /// Get the Turbine Data entry details uploaded via excel.
        /// </summary>
        /// <param name="turbineexcel">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public TurbineExcelGetResult GetTurbineDataEntryExcel(TurbineExcelModel turbineexcel, string UId)
        {
            TurbineExcelGetResult result = new TurbineExcelGetResult();
            try
            {
                var Parameter = new { TUNo = turbineexcel.TUNo, ViewType = turbineexcel.ViewType, UId = UId };
                var SPName = "XLG_TurbineUpload";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.headerdetails = reader.Read<TurbineExcelHeaderDetails>().ToList().FirstOrDefault();
                    result.turbineexceldetails = reader.Read<TurbineExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        /// <summary>
        /// Save the Turbine Data entry details via excel sheet.
        /// </summary>
        /// <param name="turbineexcel">object</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public DMSetExcelResult SetDMStatusUploadExcel(DMExcelModel DMSetexcel, string UId)
        {
            DMSetExcelResult result = new DMSetExcelResult();
            try
            {
                var Parameter = new { DMStatus = DMSetexcel.Turbine, FileName = DMSetexcel.FileName, Remarks = DMSetexcel.Remarks, Submit = DMSetexcel.Submit, DSId = DMSetexcel.DSId, RowId = DMSetexcel.RowId, Delflag = DMSetexcel.Delflag, UId = UId };
                var SPName = "XLS_DMStatusUpload";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.DMSetExcelDetails = reader.Read<DMSetExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }
        public DMExcelGetResult GetDMStatusUploadExcel(DMExcelModel DMexcel, string UId)
        {
            DMExcelGetResult result = new DMExcelGetResult();
            try
            {
                var Parameter = new { DSNo = DMexcel.DSNo, View = DMexcel.ViewType, UId = UId };
                var SPName = "XLG_DMStatusUpload";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.headerdetails = reader.Read<DMExcelHeaderDetails>().ToList().FirstOrDefault();
                    result.DMExcelDetails = reader.Read<DMExcelDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region SMP Data System

        public SMPDataExcelGetResult GetSMPDataUpdExcel(SMPDataUpdtModel SMPDataExcel, string UId)
        {
            SMPDataExcelGetResult result = new SMPDataExcelGetResult();
            try
            {
                var Parameter = new { SUNo = SMPDataExcel.SUNo, ViewType = SMPDataExcel.ViewType, Level = SMPDataExcel.Level, UId = UId };
                var SPName = "XLG_SMPDataUpload";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    if (SMPDataExcel.ViewType == "2" || SMPDataExcel.ViewType == "3" || SMPDataExcel.ViewType == "4")
                    {
                        result.SMPStatusOrAssignDetails = reader.Read<ExcelStatusOrAssignDetails>().ToList();
                    }
                    else
                    {
                        result.headerdetails = reader.Read<SMPDataExcelHeaderDetails>().ToList().FirstOrDefault();
                        result.SMPDataExcelDetails = reader.Read<SMPDataExcelDetails>().ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        public SMPDataExcelSetResult SetSMPDataUpdateExcel(SMPDataExcelModel SMPDataExcel, string UId)
        {
            SMPDataExcelSetResult result = new SMPDataExcelSetResult();
            try
            {
                var Parameter = new
                {
                    SMPDataUpload = SMPDataExcel.SMPDataUpload,
                    FileName = SMPDataExcel.FileName,
                    Name = SMPDataExcel.FileNameManual,
                    Remarks = SMPDataExcel.Comments,
                    Submit = SMPDataExcel.Submit,
                    SUId = SMPDataExcel.SUId,
                    RowId = SMPDataExcel.RowId,
                    Delflag = SMPDataExcel.Delflag,
                    Status = SMPDataExcel.Status,
                    AssignTo = SMPDataExcel.AssignTo,
                    UId = UId
                };
                var SPName = "XLS_SMPDataUpload";
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<SMPDataUpdateExcelMessage>().ToList().FirstOrDefault();
                    result.SMPDataExcelDetails = reader.Read<SMPDataExcelDetails>().ToList();
                }
                if ((result.message.Clear == "1" || result.message.Clear == "True") && SMPDataExcel.Submit == "1")
                {
                    SMPDataMail smpDataMail = SendMailForSMPData(result.message.SUId, SMPDataExcel.Status, UId);
                    if (smpDataMail != null)
                    {
                        MailMessage mailMessage = new System.Net.Mail.MailMessage();
                        mailMessage.To.Add(smpDataMail.To);
                        mailMessage.CC.Add(smpDataMail.CC);
                        SendMailMessage(mailMessage, ConfigurationManager.AppSettings["Host"], ConfigurationManager.AppSettings["port"], ConfigurationManager.AppSettings["FromMail"], ConfigurationManager.AppSettings["Password"], ConfigurationManager.AppSettings["EnableSSL"], smpDataMail.BodyMsg, smpDataMail.SubjectMsg, smpDataMail.ToUserName);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        public Message SMPDataSingleSaveDetail(SMPDataExcelDetails smpExcelDetails, string loginUserId)
        {
            Message message = new Message();
            try
            {
                var Parameter = new
                {
                    SDId = smpExcelDetails.RowId,
                    TbnId = smpExcelDetails.TbnId,
                    StateId = smpExcelDetails.StateId,
                    SiteId = smpExcelDetails.SiteId,
                    ModelId = smpExcelDetails.ModelId,
                    Location = smpExcelDetails.Location,
                    FnLoc = smpExcelDetails.FnLoc,
                    FunctionalDescription = smpExcelDetails.FunctionalDescription,
                    PlannedDate = ConvertDate(smpExcelDetails.PlannedDate),
                    CompletedOn = ConvertDate(smpExcelDetails.CompletedOn),
                    ValidationDate = ConvertDate(smpExcelDetails.ValidationDate),
                    ValidationStatusId = smpExcelDetails.ValidationStatusId,
                    DeviationPlanVsActual = smpExcelDetails.DeviationPlanVsActual,
                    ReportsGeneratedOn = ConvertDate(smpExcelDetails.ReportsGeneratedOn),
                    RecommendedActionsState = smpExcelDetails.RecommendedActionsState,
                    RecommendedActions = smpExcelDetails.RecommendedActions,
                    RecommendedActionsObservations = smpExcelDetails.RecommendedActionsObservations,
                    RecommendedActionsWONumber = smpExcelDetails.RecommendedActionsWONumber,
                    RecommendedActionsCompletedDate = ConvertDate(smpExcelDetails.RecommendedActionsCompleted),
                    Delflag = smpExcelDetails.DelFlag,
                    UId = loginUserId
                };
                var SPName = "XLS_SMPDataDetail";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    message = reader.Read<Message>().ToList().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return message;
        }

        public List<ExcelStatusOrAssignDetails> GetSMPAssignDetails(string uploadId, string statusId, string viewType, string loginUserId)
        {
            List<ExcelStatusOrAssignDetails> excelStatusOrAssignDetails = new List<ExcelStatusOrAssignDetails>();
            try
            {
                using (var Conn = Connection())
                {
                    var result = Conn.QueryMultiple("MRG_SMPStatus", new
                    {
                        UploadId = uploadId,
                        Status = statusId,
                        ViewType = viewType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    excelStatusOrAssignDetails = result.Read<ExcelStatusOrAssignDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return excelStatusOrAssignDetails;
        }

        public List<SMPDataComments> GetCommentsForSMPData(string uploadId, string loginUserId)
        {
            List<SMPDataComments> sMPDataComments = new List<SMPDataComments>();
            try
            {
                using (var Conn = Connection())
                {
                    var result = Conn.QueryMultiple("XLG_SMPDataComments", new
                    {
                        SUId = uploadId,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    sMPDataComments = result.Read<SMPDataComments>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return sMPDataComments;
        }

        public SMPDataMail SendMailForSMPData(string suId, string statusId, string loginUserId)
        {
            SMPDataMail result = new SMPDataMail();

            try
            {
                var Parameter = new { SUId = suId, Status = statusId, UId = loginUserId };
                var SPName = "MRG_SMPDataMail";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result = reader.Read<SMPDataMail>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region Mail Send For SMP Data

        public string SendMailMessage(MailMessage message, string smtpServer = "", string smtpServerPort = "", string smtpUserName = "", string smtpPassword = "", string enableSsl = "", string body = "", string title = "", string userName = "")
        {
            StringBuilder errorMsg = new StringBuilder();
            bool boolssl = true;
            int intPort = 587;
            try
            {
                if (string.IsNullOrEmpty(smtpServer))
                    smtpServer = "smtp.gmail.com";
                if (string.IsNullOrEmpty(smtpUserName))
                    smtpUserName = "itnoreplymax@gmail.com";
                if (string.IsNullOrEmpty(smtpPassword))
                    smtpPassword = "Nothing@123";
                if (!string.IsNullOrEmpty(smtpServerPort))
                    intPort = int.Parse(smtpServerPort);
                if (!string.IsNullOrEmpty(enableSsl))
                    bool.TryParse(enableSsl, out boolssl);
                string strMessage = "", St = "&lt;&lt;", En = "&gt;&gt;";
                strMessage = MailMessage();
                strMessage = strMessage.Replace(St + "Details" + En, body);
                strMessage = strMessage.Replace(St + "UserName" + En, userName);
                strMessage = strMessage.Replace(St + "LogoImage" + En, ConfigurationManager.AppSettings["AppUrl"].ToString() + "MailTemplate/image/logo.png");
                
                message.Body = strMessage;
                message.IsBodyHtml = true;
                message.Subject = title;
                message.From = new MailAddress(smtpUserName);
                var smtp = new SmtpClient(smtpServer);
                if (!string.IsNullOrEmpty(smtpUserName))
                {
                    smtp.Credentials = new NetworkCredential(smtpUserName, smtpPassword);
                }
                smtp.Port = intPort;
                smtp.EnableSsl = boolssl;
                smtp.Send(message);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            finally
            {
                // Remove the pointer to the message object so the GC can close the thread.
                message.Dispose();
            }

            return errorMsg.ToString();
        }

        public string MailMessage()
        {
            try
            {
                string str = string.Empty;
                string path = System.AppDomain.CurrentDomain.BaseDirectory.ToString() + "\\MailTemplate\\";
                string tmp = "Mail.html";
                FileStream fs = new FileStream(path + tmp, FileMode.Open, FileAccess.Read);
                StreamReader sr = new StreamReader(fs);
                str = sr.ReadToEnd(); sr.Close(); fs.Close();
                return str;
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return "";
        }

        #endregion


    }
}
