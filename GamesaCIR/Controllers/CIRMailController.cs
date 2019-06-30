using CIR.DataAccess;
using CIR.DomainModel;
using GamesaCIR.App_Code;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GamesaCIR.Controllers
{
    public class CIRMailController : Controller
    {

        #region Global Variables

        CIRManager oCIRManager = new CIRManager();
        CIMManager oCIMManager = new CIMManager();
        MasterManager oMasterManager = new MasterManager();
        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(CIRMailController));

        #endregion

        #region CIR Mail

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CIMMail()
        {
            return View();
        }

        public JsonResult GetCIRMail(string encodeCirId)
        {

            CIRModelResult result = null;
            try
            {
                string enCirId = RMaxCrypto.Crypto.Decrypt(encodeCirId);
                result = oCIRManager.GetCIRDetails(enCirId, "1");
                if (result.CIRFileDetail.Count > 0)
                {
                    string strGamesaImagesUrl = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                    foreach (var item in result.CIRFileDetail)
                    {
                        if (Convert.ToBoolean(item.IsImage))
                        {
                            item.CIRNumber = result.CIRDetail.CIRNumber;
                            item.FileName = item.CFileName;
                            item.CFileName = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.FileName;

                        }
                        else
                        {
                            item.FileName = item.CFileName;
                            item.CIRNumber = result.CIRDetail.CIRNumber;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCIR(string encodeCirId)
        {

            CIRModelResult result = null;
            try
            {   
                result = oCIRManager.GetCIRDetails(encodeCirId, "1");
                if (result.CIRFileDetail.Count > 0)
                {
                    string strGamesaImagesUrl = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                    foreach (var item in result.CIRFileDetail)
                    {
                        if (Convert.ToBoolean(item.IsImage))
                        {
                            item.CIRNumber = result.CIRDetail.CIRNumber;
                            item.FileName = item.CFileName;
                            item.CFileName = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.FileName;

                        }
                        else
                        {
                            item.FileName = item.CFileName;
                            item.CIRNumber = result.CIRDetail.CIRNumber;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCIM(string encodeCirId)
        {
            CIRModelResult result = null;
            try
            {
                string enCirId = RMaxCrypto.Crypto.Decrypt(encodeCirId);
                result = oCIMManager.GetCIMDetails(enCirId, "1");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCIRD(string cirId)
        {
            CIRModelResult result = null;
            try
            {
                result = oCIRManager.GetCIRDetails(cirId, "1");
                if (result.CIRFileDetail.Count > 0)
                {
                    string strGamesaImagesUrl = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                    foreach (var item in result.CIRFileDetail)
                    {
                        if (Convert.ToBoolean(item.IsImage))
                        {
                            item.CIRNumber = result.CIRDetail.CIRNumber;
                            item.FileName = item.CFileName;
                            item.CFileName = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.FileName;

                        }
                        else
                        {
                            item.FileName = item.CFileName;
                            item.CIRNumber = result.CIRDetail.CIRNumber;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIRNumber + "/" + item.CFileName;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCIMD(string cimId)
        {
            CIRModelResult result = null;
            try
            {
                result = oCIMManager.GetCIMDetails(cimId, "1");
                if (result.CIRFileDetail.Count > 0)
                {
                    string strGamesaImagesUrl = ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                    foreach (var item in result.CIRFileDetail)
                    {
                        if (Convert.ToBoolean(item.IsImage))
                        {
                            item.CIRNumber = result.CIRDetail.CIMNumber;
                            item.FileName = item.CFileName;
                            item.CFileName = strGamesaImagesUrl + "" + result.CIRDetail.CIMNumber + "/" + item.CFileName;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIMNumber + "/" + item.FileName;

                        }
                        else
                        {
                            item.FileName = item.CFileName;
                            item.CIRNumber = result.CIRDetail.CIMNumber;
                            item.FileNameFullPath = strGamesaImagesUrl + "" + result.CIRDetail.CIMNumber + "/" + item.CFileName;
                        }

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

        #region Employee Without Loging

        public JsonResult GetEmployee(EmployeeModel employee)
        {
            EmployeeDetails result = oMasterManager.GetEmployee(employee, "1");
            try
            {
                foreach (EmployeeDetails details in result.EmployeeDetail)
                {
                    if (details.Pwd != null)
                        details.Pwd = RMaxCrypto.Crypto.DecryptII(details.Pwd);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Turbine Without Loging

        public JsonResult GetTurbine(TurbineModel turbine)
        {
            TurbineDetails result = oMasterManager.GetTurbine(turbine, "1");
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}