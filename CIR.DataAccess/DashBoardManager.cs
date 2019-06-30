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
   public  class DashBoardManager : MainClass
    {

        #region Global Variables
        
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DashBoardManager));

        #endregion

        #region FE Details

        /// <summary>
        /// Get the Dashboard details for FE.
        /// </summary>
        /// <param name="dashBoardParameter">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DashboardModel GetDashBoardDetailsForFE(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            DashboardModel oDashBoardModel = new DashboardModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_Dashboard", new
                    {
                        DType = dashBoardParameter.DType,
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        DateFrm = dashBoardParameter.DateFrm,
                        DateTo = dashBoardParameter.DateTo,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDashBoardModel.MessageInfo = result.Read<Message>().FirstOrDefault();
                    oDashBoardModel.DashBoardData = result.Read<DashBoard>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetDashBoardDetailsForFE", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oDashBoardModel;
        }

        /// <summary>
        /// Get the Pending details For FE
        /// </summary>
        /// <param name="dashBoardParameter">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DashboardModel GetPendingDetailsForFE(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            DashboardModel oDashBoardModel = new DashboardModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_DashboardDetail", new
                    {
                        DType = dashBoardParameter.DType,
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        DateFrm = dashBoardParameter.DateFrm,
                        DateTo = dashBoardParameter.DateTo,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDashBoardModel.PendingDetailsForFE = result.Read<PendingDetailsForFE>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetDashBoardDetailsForFE", Exception = ex.Message });
                logger.Error(ex.Message);

            }
            return oDashBoardModel;
        }

        /// <summary>
        /// Get the details for FE except my pending
        /// </summary>
        /// <param name="dashBoardParameter">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DashboardModel GetDashBoardDetailsForFEExceptMyPending(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            DashboardModel oDashBoardModel = new DashboardModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_DashboardDetailNew", new
                    {
                        DType = dashBoardParameter.DType,
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        DateFrm = dashBoardParameter.DateFrm,
                        DateTo = dashBoardParameter.DateTo,
                        Desig = dashBoardParameter.Desig,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDashBoardModel.PendingDetailsForFE = result.Read<PendingDetailsForFE>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetDashBoardDetailsForFE", Exception = ex.Message });
                logger.Error(ex.Message);

            }
            return oDashBoardModel;
        }

        #endregion

        #region FSR Details

        /// <summary>
        /// Get the dashboard details for FSR.
        /// </summary>
        /// <param name="dashBoardParameter">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DashboardModel GetDashBoardDetailsForFSR(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            DashboardModel oDashBoardModel = new DashboardModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_CIMDashboard", new
                    {
                        DType = dashBoardParameter.DType,
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        DateFrm = dashBoardParameter.DateFrm,
                        DateTo = dashBoardParameter.DateTo,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDashBoardModel.MessageInfo = result.Read<Message>().FirstOrDefault();
                    oDashBoardModel.DashBoardData = result.Read<DashBoard>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetDashBoardDetailsForFE", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oDashBoardModel;
        }

        /// <summary>
        /// Get the details for FSR except my pending
        /// </summary>
        /// <param name="dashBoardParameter">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns></returns>
        public DashboardModel GetPendingdetailsForFSRExceptMyPending(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            DashboardModel oDashBoardModel = new DashboardModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_CIMDashboardDetailNew", new
                    {
                        DType = dashBoardParameter.DType,
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        DateFrm = dashBoardParameter.DateFrm,
                        DateTo = dashBoardParameter.DateTo,
                        Desig = dashBoardParameter.Desig,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDashBoardModel.PendingDetailsForFE = result.Read<PendingDetailsForFE>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetDashBoardDetailsForFE", Exception = ex.Message });
                logger.Error(ex.Message);

            }
            return oDashBoardModel;
        }

        /// <summary>
        /// Get the pending details for FSR
        /// </summary>
        /// <param name="dashBoardParameter">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DashboardModel GetPendingDetailsForFSR(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            DashboardModel oDashBoardModel = new DashboardModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_CIMDashboardDetail", new
                    {
                        DType = dashBoardParameter.DType,
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        DateFrm = dashBoardParameter.DateFrm,
                        DateTo = dashBoardParameter.DateTo,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    oDashBoardModel.PendingDetailsForFE = result.Read<PendingDetailsForFE>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetDashBoardDetailsForFE", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oDashBoardModel;
        }

        #endregion

        #region FE Details

        /// <summary>
        /// Get the Dashboard details for FE.
        /// </summary>
        /// <param name="dashBoardParameter">object</param>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public DashboardModel GetPendingDetailsForVersionUpdt(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            DashboardModel oDashBoardModel = new DashboardModel();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_versionupdatedashboard", new
                    {
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                 //   oDashBoardModel.MessageInfo = result.Read<Message>().FirstOrDefault();
                    oDashBoardModel.DashBoardData = result.Read<DashBoard>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetDashBoardDetailsForFE", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oDashBoardModel;
        }
        

        #endregion

        #region Notification details

        /// <summary>
        /// Get the Notification details based on the login User Id.
        /// </summary>
        /// <param name="loginUserId">string</param>
        /// <returns>object</returns>
        public Notification GetNotificationDetails(string loginUserId)
        {
            Notification oNotification = new Notification();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("CFG_MyPendings", new { UId = loginUserId }, commandType: CommandType.StoredProcedure);
                    oNotification.NotificationDetails = result.Read<NotificationModel>().FirstOrDefault();
                    oNotification.PendingDetails = result.Read<PendingDetailsForFE>().ToList();

                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = loginUserId, ModuleName = "DashBoard", MethodName = "GetNotificationDetails", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oNotification;
        }

        #endregion

        #region SMP Data Dashboard

        public List<DashBoard> GetSMPDataDashboard(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            List<DashBoard> dashboard = new List<DashBoard>();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_SMPDataDashboard", new
                    {
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        Type = dashBoardParameter.StatusType,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    dashboard = result.Read<DashBoard>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return dashboard;
        }

        public List<SMPDashboardDetail> GetSMPDataDashboardDetails(DashBoardParameter dashBoardParameter, string loginUserId)
        {
            List<SMPDashboardDetail> sMPDashboardDetail = new List<SMPDashboardDetail>();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("Rpt_SMPDashboardDetail", new
                    {
                        DType = dashBoardParameter.DType,
                        Month = dashBoardParameter.Month,
                        Year = dashBoardParameter.Year,
                        DateFrm = dashBoardParameter.DateFrm,
                        StatusType = dashBoardParameter.StatusType,
                        DateTo = dashBoardParameter.DateTo,
                        UId = loginUserId
                    }, commandType: CommandType.StoredProcedure);
                    sMPDashboardDetail = result.Read<SMPDashboardDetail>().ToList();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return sMPDashboardDetail;
        }

        #endregion

    }
}
