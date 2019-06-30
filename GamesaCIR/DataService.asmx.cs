using System.Collections;
using System.Data;
using System.Web;
using System.Web.UI;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Net.Mail;
using System.Configuration;
using System.Net;
using System.IO;
using GamesaCIR.Helper;
using System;

namespace GamesaCIR
{
    [WebService(Namespace = "http://tempuri.org")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.Web.Script.Services.ScriptService]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class Sample : System.Web.Services.WebService
    {

        #region Variables
        private dbLib db = new dbLib();
        clsProLib pl = new clsProLib();
        log4net.ILog Logger = log4net.LogManager.GetLogger(typeof(Sample));
        #endregion

        public bool ChkSvcAuthentication(string UserName, string Password)
        {
            if (UserName == ConfigurationSettings.AppSettings["SvcUsrName"].ToString() && Password == ConfigurationSettings.AppSettings["SvcPwd"].ToString())
            {
                return true;
            }
            else return false;
        }

        #region Image Upload
        [WebMethod(Description = "Image upload into site. ImgTag => [1: files]")]
        [ScriptMethod(UseHttpGet = true)]
        public bool ImageUpload(int ImgTag, byte[] ImageFilePath, string FileName, string Subfolder)
        {
            try
            {

                string dir = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();// System.Web.Hosting.HostingEnvironment.MapPath(string.Format("~/Files"));

                switch (ImgTag)
                {
                    case 1:
                        dir = string.Format("{0}/" + Subfolder, dir);
                        break;
                }

                if (Directory.Exists(dir) == false)
                {
                    Directory.CreateDirectory(dir);
                }
                try
                {
                    if (File.Exists(dir + "/" + FileName))
                    {
                        File.Delete(dir + "/" + FileName);
                    }
                    else
                    {

                    }
                }
                catch { }

                MemoryStream ms = new MemoryStream(ImageFilePath);
                FileStream fs = new FileStream(dir + "/" + FileName, FileMode.Create, FileAccess.ReadWrite);
                ms.WriteTo(fs);
                ms.Close();
                fs.Close();
                fs.Dispose();
                return true;
            }
            catch
            {
                //    CreateLog("ImageUpload", ex.Message); 
            }
            return false;
        }
        #endregion

        #region EmpAuthenticate
        [WebMethod(Description = "EmpAuthenticate")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet EmpAuthenticate(string UserName, string Password,string Attempt, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.EmpAuthenticate(UserName, Password);   
                return ds;
            }
            else return null;
        }
        #endregion

        #region EmpAuthenticatePwd
        [WebMethod(Description = "EmpAuthenticatePwd")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet EmpAuthenticatePwd(string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.EmpAuthenticatePwd(UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region ChangePassword
        [WebMethod(Description = "ChangePassword")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet ChangePassword(string OldPassword, string NewPassword, string Flag, string EmpId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.ChangePassword(OldPassword, NewPassword, Flag, EmpId);
                return ds;
            }
            else return null;
        }
        #endregion


        #region PwdAttemptMail
        [WebMethod(Description = "PwdAttemptMail")]
        [ScriptMethod(UseHttpGet = true)]
        public bool SendPwdAttemptMail(string Username,string EmailId, string UID, string SvcUserName, string SvcPassword)
        {
            try
            {
                if (ChkSvcAuthentication(SvcUserName, SvcPassword))
                {                    
                        string y = "", St = "&lt;&lt;", En = "&gt;&gt;";
                        y = Changpwd();
                        y = y.Replace(St + "Username" + En, Username);
                        string b = pl.Encrypt(EmailId);
                        y = y.Replace(St + "ref" + En, RMaxCrypto.Crypto.EncryptII(UID));

                        pl.SendEmail(EmailId, "", "", "Reset Password", y);
                        return true;                    
                   
                }
                else return false;
            }
            catch(Exception ex)
            {
                return false;
            }
            return false;
            
        }
        #endregion


        public string Changpwd()
        {
            try
            {
                string str = string.Empty;
                //string path = HttpContext.Current.Server.MapPath(@"~\Template\");
                string path = System.Web.HttpContext.Current.Server.MapPath(@"~\MailTemplate\");
                string tmp = "Changepwd_P.html";

                FileStream fs = new FileStream(path + tmp, FileMode.Open, FileAccess.Read);
                StreamReader sr = new StreamReader(fs);
                str = sr.ReadToEnd(); sr.Close(); fs.Close();
                return str;
            }
            catch { }
            return "";
        }
        #region GetLastUpdate
        [WebMethod(Description = "GetLastUpdate")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetLastUpdate(string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetLastUpdate(UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetMasterCollection
        [WebMethod(Description = "GetMasterCollection")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetMasterCollection(string View, string RefId, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetMasterCollection(View, RefId, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetAutocomplete
        [WebMethod(Description = "GetAutocomplete")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetAutocomplete(string View, string RefId, string Text, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetAutocomplete(View, RefId, Text, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetAutocompleteId
        [WebMethod(Description = "GetAutocompleteId")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetAutocompleteId(string View, string RefId, string Text, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetAutocompleteId(View, RefId, Text, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetTurbine
        [WebMethod(Description = "GetTurbine")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetTurbine(string Site, string View, string RefId, string Text, string TbnID, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetTurbine(Site, View, RefId, Text, TbnID, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetEmployee
        [WebMethod(Description = "GetEmployee")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetEmployee(string EmpId, string View, string Text, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetEmployee(EmpId, View, Text, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIRTurbineData
        [WebMethod(Description = "SetCIRTurbineData")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetCIRTurbineData(string CIRID, string CIRNumber, string TbnID, string DOF, string AlarmCode,
              string EmpId, string SwVersion, string HwVersion, string WTGStatus, string WTGStartTime, string WTGStopTime,
              string Production, string RunHrs, string FnSystem, string CompGroup, string Partcode, string ComponentMake,
              string FailureDuring, string SerialNumber, string FOM, string WONumber, string AlarmDesc, string Delflag,
            string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetCIRTurbineData(CIRID, CIRNumber, TbnID, DOF, AlarmCode, EmpId, SwVersion, HwVersion, WTGStatus, WTGStartTime, WTGStopTime,
               Production, RunHrs, FnSystem, CompGroup, Partcode, ComponentMake, FailureDuring, SerialNumber, FOM, WONumber, AlarmDesc, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIRProblem
        [WebMethod(Description = "SetCIRProblem")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetCIRProblem(string CIRID, string ProblemDesc, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetCIRProblem(CIRID, ProblemDesc, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIRActions
        [WebMethod(Description = "SetCIRActions")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetCIRActions(string CAId, string CIRID, string Action, string Delflag, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetCIRActions(CAId, CIRID, Action, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIRConsequencialProblem
        [WebMethod(Description = "SetCIRConsequencialProblem")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetCIRConsequencialProblem(string CIRID, string Consequence, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetCIRConsequencialProblem(CIRID, Consequence, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIR5W2H
        [WebMethod(Description = "SetCIR5W2H")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetCIR5W2H(string CIRID, string What, string When1, string Where, string Why, string Who,
                                   string Howtodo, string Howmuch, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetCIR5W2H(CIRID, What, When1, Where, Why, Who, Howtodo, Howmuch, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIRFiles
        [WebMethod(Description = "SetCIRFiles")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetCIRFiles(string CFId, string CIRID, string Filename, string IsImage, string Desc, string Delflag, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetCIRFiles(CFId, CIRID, Filename, IsImage, Desc, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIRComments
        [WebMethod(Description = "SetCIRComments")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetCIRComments(string CIRID, string Comments, string AssignedTo, string Delflag, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetCIRComments(CIRID, Comments, AssignedTo, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetCIRTurbineData
        [WebMethod(Description = "SetCIRTurbineData")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetFSRTurbineData(string CIMID, string CIMNumber, string TbnID, string DOF, string AlarmCode,
              string EmpId, string SwVersion, string HwVersion, string WTGStatus, string WTGStartTime, string WTGStopTime,
              string Production, string RunHrs, string FnSytem, string CompGroup, string Partcode, string ComponentMake,
              string FailureDuring, string SerialNumber, string FOM, string WONumber, string TSite, string DOC, string Turbine,
              string Customer, string Temp, string Dust, string Corrosion, string THeight, string Blade, string Generator,
              string GearBox, string WTGType, string CmrId, string TempID, string DustID, string CorrosionId, string THeightid,
              string BladeId, string GRiD, string GBId, string WTGTypeId, string AlarmDesc, string Delflag,
            string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetFSRTurbineData(CIMID, CIMNumber, TbnID, DOF, AlarmCode, EmpId, SwVersion, HwVersion, WTGStatus, WTGStartTime, WTGStopTime,
               Production, RunHrs, FnSytem, CompGroup, Partcode, ComponentMake, FailureDuring, SerialNumber, FOM, WONumber, TSite, DOC, Turbine,
                 Customer, Temp, Dust, Corrosion, THeight, Blade, Generator, GearBox, WTGType, CmrId, TempID, DustID, CorrosionId, THeightid,
                BladeId, GRiD, GBId, WTGTypeId, AlarmDesc, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetFSRProblem
        [WebMethod(Description = "SetFSRProblem")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetFSRProblem(string CIMID, string ProblemDesc, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetFSRProblem(CIMID, ProblemDesc, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetFSRActions
        [WebMethod(Description = "SetFSRActions")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetFSRActions(string CAId, string CIMID, string Action, string Delflag, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetFSRActions(CAId, CIMID, Action, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetFSRConsequencialProblem
        [WebMethod(Description = "SetFSRConsequencialProblem")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetFSRConsequencialProblem(string CIMID, string Consequence, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetFSRConsequencialProblem(CIMID, Consequence, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetFSR5W2H
        [WebMethod(Description = "SetFSR5W2H")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetFSR5W2H(string CIMID, string What, string When1, string Where, string Why, string Who,
                                   string Howtodo, string Howmuch, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetFSR5W2H(CIMID, What, When1, Where, Why, Who, Howtodo, Howmuch, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetFSRFiles
        [WebMethod(Description = "SetFSRFiles")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetFSRFiles(string CFId, string CIMID, string Filename, string IsImage, string Desc, string Delflag, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetFSRFiles(CFId, CIMID, Filename, IsImage, Desc, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetFSRComments
        [WebMethod(Description = "SetFSRComments")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetFSRComments(string CIMID, string Comments, string AssignedTo, string Delflag, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetFSRComments(CIMID, Comments, AssignedTo, Delflag, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region DataMigration
        [WebMethod(Description = "DataMigration")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet DataMigration(string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.DataMigration(UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetCIR
        [WebMethod(Description = "GetCIR")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetCIR(string CIRNumber, string CIRID, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetCIR(CIRNumber, CIRID, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetRejectCIR
        [WebMethod(Description = "GetRejectCIR")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetRejectCIR(string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetRejectCIR(UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetRejectCIR
        [WebMethod(Description = "SetRejectCIR")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetRejectCIR(string CIRId, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetRejectCIR(CIRId, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetFSR
        [WebMethod(Description = "GetFSR")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetFSR(string CIMNumber, string CIMID, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetFSR(CIMNumber, CIMID, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region GetRejectFSR
        [WebMethod(Description = "GetRejectFSR")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetRejectFSR(string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetRejectFSR(UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region SetRejectFSR
        [WebMethod(Description = "SetRejectFSR")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet SetRejectFSR(string CIMId, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.SetRejectFSR(CIMId, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region Field Alert Document--categ
        [WebMethod(Description = "GetCategory")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetCategory(string Refid, string View, string Catid, string Uid, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetCategory(Refid, View, Catid, Uid);
                return ds;
            }
            else return null;
        }
        #endregion

        #region Field Alert Document
        [WebMethod(Description = "FetchFieldalertdoc")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet FetchFieldalertdoc(string Genral, string Type, string Tagsearch, string Titlesearch, string Controlsearch, string Grp, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.FetchFieldalertdoc(Genral, Type, Tagsearch, Titlesearch, Controlsearch, Grp, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region FetchServiceBullet
        [WebMethod(Description = "FetchServiceBullet")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet FetchServiceBullet(string Genral, string Type, string Tagsearch, string Titlesearch, string Controlsearch, string Grp, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.FetchServiceBullet(Genral, Type, Tagsearch, Titlesearch, Controlsearch, Grp, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region FetchSafetyAlert
        [WebMethod(Description = "FetchSafetyAlert")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet FetchSafetyAlert(string Genral, string Type, string Tagsearch, string Titlesearch, string Controlsearch, string Grp, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.FetchSafetyAlert(Genral, Type, Tagsearch, Titlesearch, Controlsearch, Grp, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region FetchSWFWDocument
        [WebMethod(Description = "FetchSWFWDocument")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet FetchSWFWDocument(string Genral, string Type, string Tagsearch, string Titlesearch, string Controlsearch, string Grp, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.FetchSWFWDocument(Genral, Type, Tagsearch, Titlesearch, Controlsearch, Grp, UId);
                return ds;
            }
            else return null;
        }
        #endregion

        #region FetchCustomerInformationDoc
        [WebMethod(Description = "FetchCustomerInformationDoc")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet FetchCustomerInformationDoc(string Genral, string Type, string Tagsearch, string Titlesearch, string Controlsearch, string Grp, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.FetchCustomerInformationDoc(Genral, Type, Tagsearch, Titlesearch, Controlsearch, Grp, UId);
                return ds;
            }
            else return null;
        }

        #endregion

        #region Page Access

        [WebMethod(Description = "GetPageAccess")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet GetPageAccess(string pageName, string SvcUserName, string SvcPassword, string UId)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.GetPageAccessDetails(pageName, UId);
                return ds;
            }
            else return null;
        }

        #endregion

        #region FetchChangenote
        [WebMethod(Description = "FetchChangenote")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet FetchChangenote(string Genral, string Type, string Tagsearch, string Titlesearch, string Controlsearch, string Grp, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.FetchChangenote(Genral, Type, Tagsearch, Titlesearch, Controlsearch, Grp, UId);
                return ds;
            }
            else return null;
        }
        #endregion
        #region FetchAlarmFAQ
        [WebMethod(Description = "FetchAlarmFAQ")]
        [ScriptMethod(UseHttpGet = true)]
        public DataSet FetchAlarmFAQ(string Genral, string Type, string Tagsearch, string Titlesearch, string Controlsearch, string Grp, string UId, string SvcUserName, string SvcPassword)
        {
            if (ChkSvcAuthentication(SvcUserName, SvcPassword))
            {
                DataSet ds = db.FetchAlarmFAQ(Genral, Type, Tagsearch, Titlesearch, Controlsearch, Grp, UId);
                return ds;
            }
            else return null;
        }
        #endregion

    }
}
