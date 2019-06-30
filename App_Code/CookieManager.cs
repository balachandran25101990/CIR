using CIR.DomainModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace GamesaCIR.App_Code
{
    public static class CookieManager
    {
        public static string CookieName = "GAM";

        public static void CreateCookie(string cookieName, string cookieJson)
        {
            HttpCookie cookie = new HttpCookie(cookieName);
            HttpContext.Current.Response.Cookies.Add(cookie);
            cookie.Value = cookieJson;
            HttpContext.Current.Response.Cookies.Add(cookie);
        }

        public static void RemoveCookie(string cookieName)
        {
            if (HttpContext.Current.Request.Cookies[cookieName] != null)
            {
                HttpCookie cookie = new HttpCookie(cookieName);
                cookie.Expires = DateTime.Now.AddDays(-1d);
                HttpContext.Current.Response.Cookies.Add(cookie);
            }
        }
        public static LoginResult GetCookie(string cookieName)
        {
            if (HttpContext.Current.Request.Cookies[cookieName] != null)
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                string cookieValue = HttpContext.Current.Request.Cookies[cookieName].Value.ToString();
                LoginResult cookieJson = serializer.Deserialize<LoginResult>(cookieValue);
                return cookieJson;
            }
            else
                return null;
        }
    }
}