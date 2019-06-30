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
    public class LoginManager : MainClass
    {

        #region Global variables 

        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(LoginManager));

        #endregion

        #region Login

        /// <summary>
        /// Verify the Login Credentials
        /// </summary>
        /// <param name="login">object</param>
        /// <returns>object</returns>
        public LoginResult VerifyLoginCredentials(LoginModel login)
        {
            LoginResult result = new LoginResult();
            try
            {
                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple("MRV_EmpAuthenticate", new { UserName = login.UserName, Password = login.Password }, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<Message>().ToList().FirstOrDefault();
                    result.logindetail = reader.Read<LoginDetail>().ToList().FirstOrDefault();
                    Message oMessage = reader.Read<Message>().ToList().FirstOrDefault();
                    Message oMessagea = reader.Read<Message>().ToList().FirstOrDefault();
                    result.Flag = reader.Read<LoginSecure>().ToList().FirstOrDefault();
                    //result.RoleAccess = reader.Read<RoleAccessDetails>().ToList();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = login.UserName, ModuleName = "Login", MethodName = "VerifyLoginCredentials", Exception = ex.Message });
                logger.Error(ex.Message);
            }

            return result;
        }

        #endregion

        #region Forget Password

        /// <summary>
        /// Based on the ich Code and Sap Code corresponding password for the user.
        /// </summary>
        /// <param name="ichCode">string</param>
        /// <param name="sapCode">string</param>
        /// <returns>object</returns>
        public LoginResult SetForgetPassword(string ichCode, string sapCode)
        {
            LoginResult oLoginResult = new LoginResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRF_ForgotPassword", new { ICHCode = ichCode, SAPCode = sapCode }, commandType: CommandType.StoredProcedure);
                    oLoginResult.message = result.Read<Message>().FirstOrDefault();
                    oLoginResult.ForgetPassword = result.Read<ForgetPasswordModel>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = sapCode, ModuleName = "Login", MethodName = "SetForgetPassword", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oLoginResult;

        }

        public ValidResetPwdUrlResult ValidResetPwd(string UId)
        {
            ValidResetPwdUrlResult oLoginResult = new ValidResetPwdUrlResult();
            try
            {
                using (var connection = Connection())
                {
                    var result = connection.QueryMultiple("MRG_AttemptPassword", new { UId = UId }, commandType: CommandType.StoredProcedure);
                    oLoginResult.ValidResetPwdUrlModel = result.Read<ValidResetPwdUrlModel>().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                //SaveErrorMessageInFile(oErrorMessage = new ErrorMessage { UserId = sapCode, ModuleName = "Login", MethodName = "SetForgetPassword", Exception = ex.Message });
                logger.Error(ex.Message);
            }
            return oLoginResult;

        }

        #endregion

    }
}
