using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.IO;
using CIR.DomainModel;
using CIR.DataAccess;
using GamesaCIR.Helper;
using GamesaCIR.App_Code;
using System.Configuration;

namespace GamesaCIR.Controllers.api
{
    public class FileController : ApiController
    {
        clsProLib pl = new clsProLib();
        //[HttpPost]
        public KeyValuePair<bool, string> UploadFile()
        {
            try
            {
                if (HttpContext.Current.Request.Files.AllKeys.Any())
                {
                    // Get the uploaded image from the Files collection
                    var httpPostedFile = HttpContext.Current.Request.Files["UploadedImage"];
                    
                    if (httpPostedFile != null)
                    {

                        string strFileName = ConfigurationManager.AppSettings["FileCIRUploadUrl"].ToString();
                        // Validate the uploaded image(optional)
                        string SAPID = CookieManager.GetCookie(CookieManager.CookieName).logindetail.SAPID;
                        strFileName = strFileName + "/ChatFiles/" + SAPID;
                        if (!Directory.Exists(strFileName ))
                        {
                            Directory.CreateDirectory(strFileName);

                        }
                        // Get the complete file path
                        //var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/UploadedFiles"), httpPostedFile.FileName);
                        var fileSavePath =  Path.Combine(strFileName, httpPostedFile.FileName);

                     //   CookieManager.CreateCookie("chatfileurl", fileSavePath);

                     
                        // Save the uploaded file to "UploadedFiles" folder
                        httpPostedFile.SaveAs(fileSavePath);

                        //download 
                        var downloadurl= ConfigurationManager.AppSettings["ImagesIISUrl"].ToString();
                        downloadurl = downloadurl + "/ChatFiles/" + SAPID;
                        var fileSavePath1 = downloadurl+"/" + httpPostedFile.FileName;// Path.Combine(downloadurl, httpPostedFile.FileName);

                        return new KeyValuePair<bool, string>(true, fileSavePath1);// "File uploaded successfully.");
                    }

                    return new KeyValuePair<bool, string>(true, "Could not get the uploaded file.");
                }

                return new KeyValuePair<bool, string>(true, "No file found to upload.");
            }
            catch (Exception ex)
            {
                return new KeyValuePair<bool, string>(false, "An error occurred while uploading the file. Error Message: " + ex.Message);
            }
        }
    }
}