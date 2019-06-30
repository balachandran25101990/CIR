using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class Message
    {
        public string Msg { get; set; }
        public string Clear { get; set; }
        public string EMPLOYEE { get; set; }
    }

    public class LoginDetail
    {
        public string EmpID { get; set; }
        public string Employee { get; set; }
        public string CntDate { get; set; }
        public string RoleId { get; set; }
        public string SAPID { get; set; }
        public string DsgId { get; set; }
        public string EmpMobile { get; set; }
        public string chatfileurl { get; set; }
        public string EmailId { get; set; }
        public string Sites { get; set; }
        public string States { get; set; }
        public string EmpImage { get; set; }
        public string ServerTime { get; set; }
        public string Designation { get; set; }

    }

    public class LoginResult
    {
        public Message message { get; set; }
        public LoginDetail logindetail { get; set; }
        public List<RoleAccessDetails> RoleAccess { get; set; }
        public ForgetPasswordModel ForgetPassword { get; set; }
        public LoginSecure Flag { get; set; }
    }

    public class LoginSecure
    {
        public bool AttemptFlag { get; set; }
        public bool LoginFlag { get; set; }
        public bool ExpiryFlag { get; set; }
        
    }
    public class ForgetPasswordModel
    {
        public string Pwd { get; set; }
        public string PName { get; set; }
        public string OEmail { get; set; }
    }
    public class ValidResetPwdUrlResult
    {
        public ValidResetPwdUrlModel ValidResetPwdUrlModel { get; set; }
    }
    public class ValidResetPwdUrlModel
    {
        public string AttemptFlag { get; set; }
        public string UId { get; set; }
    }
}
