using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.Text;
using System.Security.Cryptography;
using System.Configuration;

namespace GamesaCIR.Helper
{
    public class clsProLib
    {
        #region Variables
        string LogFile = HttpContext.Current.Server.MapPath("ErrorLogs.txt");
        public Sessions sessions = new Sessions();
        const string St = "&lt;&lt;", En = "&gt;&gt;";
        #endregion

        #region Constructors
        public clsProLib()
        {
        }
        #endregion

        #region Error Log Methods
        public void CreateLog(string FileName, string MethodName, string ErrMsg)
        {
            try
            {
                if (EnableLogs == false || (string.IsNullOrEmpty(ErrMsg.Trim()))) return;

                FileStream fs = new FileStream(LogFile, FileMode.OpenOrCreate, FileAccess.Write);
                StreamWriter sw = new StreamWriter(fs);
                sw.BaseStream.Seek(0, SeekOrigin.End);

                sw.WriteLine(DateTime.Now.ToString("dd/MMM/yyyy hh:mm:ss tt --> ") + "File: " + FileName + ", Method: " + MethodName + ", Error: " + ErrMsg);
                sw.Flush();
                sw.Close();
            }
            catch { }
        }

        void SetErrorLog(string _method, string _errMsg)
        {
            CreateLog("proLib", _method, _errMsg);
        }

        public string ConvertDBDate(String Date)
        {
            string[] cc = Date.Split('/');
            return cc[2].ToString() + "/" + cc[1].ToString() + "/" + cc[0].ToString();
        }

        public string ConvertDBDate(String Date, string InputFormat, string OutputFormat)
        {
            DateTime dt1 = DateTime.ParseExact(Date, InputFormat, System.Globalization.CultureInfo.InvariantCulture);
            return dt1.ToString(OutputFormat);
        }

        public bool ValidDate(String fromDate, String toDate, string format)
        {
            DateTime dt1 = DateTime.ParseExact(fromDate, format, System.Globalization.CultureInfo.InvariantCulture);
            DateTime dt2 = DateTime.ParseExact(toDate, format, System.Globalization.CultureInfo.InvariantCulture);
            double days = (dt2 - dt1).TotalDays;
            if (days < 0)
                return false;
            else
                return true;
        }

        #endregion

        #region Encrypt & Decrypt Methods
        public string Encrypt(string InputText)
        {
            try
            {
                if (!string.IsNullOrEmpty(InputText))
                {
                    return RMaxCrypto.Crypto.Encrypt(InputText);
                }
            }
            catch (Exception ex) { SetErrorLog("Encrypt", ex.Message); }
            return string.Empty;
        }

        public string Decrypt(string InputText)
        {
            try
            {
                if (!string.IsNullOrEmpty(InputText))
                {
                    return RMaxCrypto.Crypto.Decrypt(InputText);
                }
            }
            catch (Exception ex) { SetErrorLog("Decrypt", ex.Message); }
            return string.Empty;
        }

        public string ByteArrayToString(String s)
        {
            byte[] data, hash;
            data = Encoding.UTF8.GetBytes(s);
            using (SHA512 shaM = new SHA512Managed())
            {
                hash = shaM.ComputeHash(data);
            }
            StringBuilder hex = new StringBuilder(hash.Length * 2);
            foreach (byte b in hash)
                hex.AppendFormat("{0:x2}", b);
            return hex.ToString();
        }
        #endregion

        #region Sessions Methods
        public string UId
        {
            get { string x = sessions.Get("_LoginUserId"); return (x.Trim() == "") ? "0" : x; }
            set { sessions.Add("_LoginUserId", value); }
        }

        public string LoginUserName
        {
            get { return sessions.Get("_LoginUserName"); }
            set { sessions.Add("_LoginUserName", value); }
        }

        public string Role
        {
            get { return sessions.Get("_RoleId"); }
            set { sessions.Add("_RoleId", value); }
        }

        public string ServerDate
        {
            get { return sessions.Get("_ServerDate"); }
            set { sessions.Add("_ServerDate", value); }
        }
        public string Sites
        {
            get { string x = sessions.Get("_Sites"); return (x.Trim() == "") ? "0" : x; }
            set { sessions.Add("_Sites", value); }
        }
        public string States
        {
            get { string x = sessions.Get("_States"); return (x.Trim() == "") ? "0" : x; }
            set { sessions.Add("_States", value); }
        }
        public string ServerTime
        {
            get { string x = sessions.Get("_ServerTime"); return (x.Trim() == "") ? "0" : x; }
            set { sessions.Add("_ServerTime", value); }
        }
        public string DesgName
        {
            get { string x = sessions.Get("_DesgName"); return (x.Trim() == "") ? "0" : x; }
            set { sessions.Add("_DesgName", value); }
        }
        public string EmpImage
        {
            get { string x = sessions.Get("_EmpImage"); return (x.Trim() == "") ? "0" : x; }
            set { sessions.Add("_EmpImage", value); }
        }

        #endregion

        #region Email Alert Methods

        //Activation Mail Template
        public string ActivationMailTemplate(string _name, string _email, string _password)
        {
            try
            {
                string str = string.Empty;
                string spath = HttpContext.Current.Server.MapPath(@"~\EmailTemplate\");
                string tmp = "AccountRegistration.htm";

                FileStream fs = new FileStream(spath + tmp, FileMode.Open, FileAccess.Read);
                StreamReader sr = new StreamReader(fs);
                str = sr.ReadToEnd(); sr.Close(); fs.Close();
                /// Send mail to receiver.
                str = str.Replace(St + "name" + En, _name);
                str = str.Replace(St + "UserName" + En, _email);
                str = str.Replace(St + "Password" + En, _password);
                str = str.Replace(St + "actlink" + En, WebUrl + "/AccountActivation?a=" + Encrypt(_email));
                return str;
            }
            catch (Exception ex) { SetErrorLog("ActivationMailTemplate", ex.Message); }
            return "";
        }

        public bool SendEmail(string ToEmilId, string BccEmailIds, string CCEmailIds, string Subject, string Msg)
        {
            try
            {
                /// SMTP Configurations.
                RMax.EmailNotification Email = new RMax.EmailNotification();
                Email.Server = WebConfigurationManager.AppSettings["Host"].ToString();
                Email.PortNo = Convert.ToInt32(WebConfigurationManager.AppSettings["port"].ToString());
                Email.From = WebConfigurationManager.AppSettings["FromMail"].ToString();
                Email.Password = WebConfigurationManager.AppSettings["Password"].ToString();

                Email.To = ToEmilId;
                if (BccEmailIds.Trim() != "") { Email.BCc = BccEmailIds; }
                if (CCEmailIds.Trim() != "") { Email.Cc = CCEmailIds; }

                /// Email Message.
                Email.Subject = Subject;
                Email.Body = Msg;
                Email.MailFormat = RMax.EmailFormat.Html;
                Email.SendMail();
                return true;
            }
            catch (Exception ex) { SetErrorLog("SendEmail", ex.Message); }
            return false;
        }
        #endregion

        #region Properties
        /// Project Title
        public string ProjectTitle
        {
            get
            {
                string x = "";
                try { x = WebConfigurationManager.ConnectionStrings["ProjectTitle"].ToString(); }
                catch (Exception ex) { SetErrorLog("ProjectTitle", ex.Message); }
                return x;
            }
        }

        private bool EnableLogs
        {
            get
            {
                string x = "";
                try
                {
                    x = WebConfigurationManager.AppSettings["EnableLogs"].ToString();
                    return (x.ToLower() == "true" || x == "1") ? true : false;
                }
                catch (Exception ex) { SetErrorLog("EnableLogs", ex.Message); }
                return false;
            }
        }

        public string WebUrl
        {
            get
            {
                string x = string.Empty;
                try { x = WebConfigurationManager.AppSettings["weburl"].ToString(); }
                catch (Exception ex) { SetErrorLog("WebUrl", ex.Message); }
                return x;
            }
        }

        public string UploadUrl
        {
            get
            {
                string x = string.Empty;
                try { x = WebConfigurationManager.AppSettings["FileUploadUrl"].ToString(); }
                catch (Exception ex) { SetErrorLog("FileUploadUrl", ex.Message); }
                return x;
            }
        }

        public string TurbineDataEntryExcelUploadUrl
        {
            get
            {
                string x = string.Empty;
                try { x = WebConfigurationManager.AppSettings["TurbineFileUploadDataEntyUrl"].ToString(); }
                catch (Exception ex) { SetErrorLog("FileUploadUrl", ex.Message); }
                return x;
            }
        }
        public string ContactUs_Email
        {
            get
            {
                return WebConfigurationManager.AppSettings["ContactUsEmail"].ToString(); ;
            }
        }

        public string LID
        {
            get { return ConfigurationManager.AppSettings["LocationId"].ToString(); }

        }

        public string DefaultStateId
        {
            get
            {
                string x = "";
                try { x = WebConfigurationManager.AppSettings["RptDefaultStateId"].ToString(); }
                catch (Exception ex) { SetErrorLog("RptDefaultStateId", ex.Message); }
                return x;
            }
        }

        /// Email configuration validation.
        public string IsValidEmailConfiguration()
        {
            try
            {
                if (WebConfigurationManager.AppSettings["smtp"].ToString().Trim() == "")
                {
                    return "Email configuration is failed - Ensure SMTP server!";
                }
                else if (WebConfigurationManager.AppSettings["port"].ToString().Trim() == "")
                {
                    return "Email configuration is failed - Ensure Port Number!";
                }
                else if (WebConfigurationManager.AppSettings["baseEmail"].ToString().Trim() == "")
                {
                    return "Email configuration is failed - Ensure base email address!";
                }
                else if (WebConfigurationManager.AppSettings["emailPwd"].ToString().Trim() == "")
                {
                    return "Email configuration is failed - Ensure base email password!";
                }
                else
                {
                    return "1";
                }
            }
            catch (Exception ex) { SetErrorLog("IsValidEmailConfiguration", ex.Message); }
            return "Ensure email configuration!";
        }

        ///Email address validation.
        public bool IsEmailId(string EmailId)
        {
            try
            {
                string strRegex = @"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}" +
                      @"\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\" +
                      @".)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$";
                Regex re = new Regex(strRegex);
                if (re.IsMatch(EmailId)) { return true; }
            }
            catch (Exception ex) { SetErrorLog("IsEmailId", ex.Message); }
            return false;
        }

        /// Mobile number validation.
        public bool IsValidMobile(string inputNumber)
        {
            try
            {
                if (inputNumber.StartsWith("0"))
                    return false;
                Match m = Regex.Match(inputNumber, @"\d+");

                if (m.Length != 10)
                {
                    return false;
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// User request's error message.
        public string UnableToProcess
        {
            get { return "Sorry! unable to process your request. Try later!"; }
        }
        #endregion
    }

    public class Sessions
    {
        public void Add(string key, string data)
        {
            try { HttpContext.Current.Session.Add(key, data); }
            catch { }
        }

        public string Get(string key)
        {
            try
            {
                if (HttpContext.Current.Session[key] != null)
                {
                    return HttpContext.Current.Session[key].ToString();
                }
            }
            catch { }//(Exception ex) { CreateLogs("Get Session", ex.Message); }
            return "";
        }

        public bool Remove(string key)
        {
            try
            {
                if (HttpContext.Current.Session[key] != null)
                {
                    HttpContext.Current.Session.Remove(key);
                    return true;
                }
            }
            catch { }
            return false;
        }
    }
}


