using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using CIR.DomainModel;
using CIR.DataAccess;
using GamesaCIR.Helper;
using GamesaCIR.App_Code;
using System.Web.Script.Serialization;
using System.Configuration;
using System.Web.Mail;
using System.Net.Mail;
using System.Net;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.UI.WebControls;
using System.Data;
using System.Web.Configuration;

namespace GamesaCIR.Controllers
{
    public class LoginController : Controller
    {
        #region Global Variables

        clsProLib pl = new clsProLib();
        AdminManager oAdminManager = new AdminManager();
        LoginManager oLoginManager = new LoginManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(LoginController));

        #endregion

        #region Login

        public ActionResult Index()
        {
            CookieManager.RemoveCookie("GAM");
            HttpContext.Session.Clear();
            HttpContext.Response.ExpiresAbsolute = DateTime.Now;
            HttpContext.Response.Expires = 0;
            HttpContext.Response.CacheControl = "no-cache";
            return View();
        }

        public JsonResult LoginCredentials(LoginModel login)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            login.Password = RMaxCrypto.Crypto.EncryptII(login.Password);
            LoginResult result = oLoginManager.VerifyLoginCredentials(login);
            try
            {
                if (result.message.Clear.ToLower() == "1" || result.message.Clear.ToLower() == "true")
                {
                    pl.UId = result.logindetail.EmpID;
                    pl.LoginUserName = result.logindetail.Employee;
                    pl.Role = result.logindetail.RoleId;
                    pl.ServerDate = result.logindetail.CntDate;
                    pl.Sites = result.logindetail.Sites;
                    pl.States = result.logindetail.States;
                    pl.EmpImage = result.logindetail.EmpImage;
                    pl.ServerTime = result.logindetail.ServerTime;
                    pl.DesgName = result.logindetail.Designation;
                    string jsonText = serializer.Serialize(result);
                    CookieManager.CreateCookie("GAM", jsonText);
                }
                if (result.message.Clear.ToLower() == "0" || result.message.Clear.ToLower() == "False")
                {
                    HttpContext.Session.Clear();
                    HttpContext.Response.ExpiresAbsolute = DateTime.Now;
                    HttpContext.Response.Expires = 0;
                    HttpContext.Response.CacheControl = "no-cache";
                }
                if (result.Flag != null)
                {
                    if (result.Flag.AttemptFlag == true)
                    {
                        Session["AttemptFlag"] = "True";
                        string a = Session["AttemptFlag"].ToString();
                        string y = "", St = "&lt;&lt;", En = "&gt;&gt;";
                        y = Changpwd();
                        y = y.Replace(St + "Username" + En, result.logindetail.Employee);
                        y = y.Replace(St + "LogoImage" + En, ConfigurationManager.AppSettings["AppUrl"].ToString() + "MailTemplate/image/logo.png");
                        string b = pl.Encrypt(result.logindetail.EmailId);
                        y = y.Replace(St + "ref" + En, RMaxCrypto.Crypto.EncryptII(result.logindetail.EmpID));

                        pl.SendEmail(result.logindetail.EmailId, "", "", "Reset Password", y);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }


            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Timeout

        public ActionResult TimeOut()
        {
            CookieManager.RemoveCookie("GAM");
            return View();
        }

        #endregion

        #region Message

        public ActionResult Message()
        {
            return View();
        }

        #endregion

        #region ChangePassword

        public ActionResult ChangePassword()
        {
            return View();
        }

        #endregion

        #region Forget Password


        public JsonResult SetForgetPassword(string sapCode, string ichCode)
        {
            var result = oLoginManager.SetForgetPassword(ichCode, sapCode);
            if (result.message.Clear == "True")
            {
                SendMail(result.ForgetPassword);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public void SendMail(ForgetPasswordModel forgetPassword)
        {
            //Reading sender Email credential from web.config file
            try
            {
                string strHostAddress = ConfigurationManager.AppSettings["Host"].ToString();
                string strFromMailId = ConfigurationManager.AppSettings["FromMail"].ToString();
                string strPassword = ConfigurationManager.AppSettings["Password"].ToString();

                System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage();
                msg.Subject = "Password Assistance For Gamesa.";
                msg.From = new MailAddress(strFromMailId);


                string strApplicationUrl = System.Configuration.ConfigurationManager.AppSettings["AppUrl"].ToString();
                string strPasswordFor = forgetPassword.Pwd;
                string strDecryptPassword = RMaxCrypto.Crypto.DecryptII(strPasswordFor);
                msg.Body = "Dear " + forgetPassword.PName + "<br />&emsp;&emsp;&emsp; Your Password is : " + strDecryptPassword;
                msg.IsBodyHtml = true;
                msg.To.Add(new MailAddress(forgetPassword.OEmail));
                //vijay@ravemaxpro.co.in
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.UseDefaultCredentials = false;
                smtp.EnableSsl = true;
                NetworkCredential nc = new NetworkCredential(strFromMailId, strPassword);
                smtp.Credentials = nc;
                smtp.Send(msg);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
        }

        public JsonResult SaveChangePassword(string oldPassword, string newPassword, string flag, string UId)
        {
            var result = oAdminManager.SaveChangePassword(RMaxCrypto.Crypto.EncryptII(oldPassword), RMaxCrypto.Crypto.EncryptII(newPassword), flag, UId);
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveChangePasswordAttemptFlag(string oldPassword, string newPassword, string flag, string UId)
        {
            string a = "==";
            string b = UId + a;
            var result = oAdminManager.SaveChangePassword(RMaxCrypto.Crypto.EncryptII(oldPassword), RMaxCrypto.Crypto.EncryptII(newPassword), flag, RMaxCrypto.Crypto.DecryptII(b));
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        //public void changepwdsendmail(string username)
        //{
        //    string y = "", St = "&lt;&lt;", En = "&gt;&gt;";
        //    y = Changpwd();
        //    y = y.Replace(St + "Username" + En, pl.LoginUserName);
        //    string b = RMaxCrypto.Crypto.EncryptII(username);
        //    y = y.Replace(St + "email" + En, b);

        //    pl.SendEmail(username, "", "", "Reset Password", y);
        //}

        public string Changpwd()
        {
            try
            {
                string str = string.Empty;
                //string path = HttpContext.Current.Server.MapPath(@"~\Template\");
                string path = HttpContext.Server.MapPath(@"~\MailTemplate\");
                string tmp = "Changepwd_P.html";

                FileStream fs = new FileStream(path + tmp, FileMode.Open, FileAccess.Read);
                StreamReader sr = new StreamReader(fs);
                str = sr.ReadToEnd(); sr.Close(); fs.Close();
                return str;
            }
            catch { }
            return "";
        }
        //public bool SendEmail(string ToEmilId, string BccEmailIds, string CCEmailIds, string Subject, string Msg)
        //{
        //    try
        //    {
        //        /// SMTP Configurations.
        //        //RMax.EmailNotification Email = new RMax.EmailNotification();
        //        //Email.Server = WebConfigurationManager.AppSettings["smtp"].ToString();
        //        //Email.PortNo = Convert.ToInt32(WebConfigurationManager.AppSettings["port"].ToString());
        //        //Email.From = WebConfigurationManager.AppSettings["baseEmail"].ToString();
        //        //Email.Password = RMaxCrypto.Crypto.DecryptII(WebConfigurationManager.AppSettings["Pwd"].ToString());

        //        //Email.To = ToEmilId;
        //        //if (BccEmailIds.Trim() != "") { Email.BCc = BccEmailIds; }
        //        //if (CCEmailIds.Trim() != "") { Email.Cc = CCEmailIds; }

        //        ///// Email Message.
        //        //Email.Subject = Subject;
        //        //Email.Body = Msg;
        //        //Email.MailFormat = RMax.EmailFormat.Html;
        //        //Email.sd = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
        //        //Email.SendMail();

        //        string strHostAddress = ConfigurationManager.AppSettings["Host"].ToString();
        //        string strFromMailId = ConfigurationManager.AppSettings["FromMail"].ToString();
        //        string strPassword = ConfigurationManager.AppSettings["Password"].ToString();

        //        System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage();
        //        msg.Subject = "Password Assistance For Gamesa.";
        //        msg.From = new MailAddress(strFromMailId);

        //        string strApplicationUrl = System.Configuration.ConfigurationManager.AppSettings["AppUrl"].ToString();       

        //        SmtpClient smtp = new SmtpClient();
        //        smtp.Host = "smtp.gmail.com";
        //        smtp.Port = 587;
        //        smtp.UseDefaultCredentials = false;
        //        smtp.EnableSsl = true;
        //        NetworkCredential nc = new NetworkCredential(strFromMailId, strPassword);
        //        smtp.Credentials = nc;
        //        smtp.Send(msg);
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //    return false;
        //}
        #endregion

        #region ChangePwdAttempt
        public ActionResult ChangePwdAttempt()
        {
            string UId = Request.QueryString["ref"];
            Session["ResetUId"] = UId;
            if (UId == null || UId == "" || UId == "null")
            {
                return RedirectToAction("index", "login");
            }
            return View();
        }
        public JsonResult ValidResetPwd(string UId)
        {   
            string a = "==";
            string b = UId + a;
            var result = oLoginManager.ValidResetPwd(RMaxCrypto.Crypto.DecryptII(b));
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}