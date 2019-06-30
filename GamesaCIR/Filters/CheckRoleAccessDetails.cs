using CIR.DataAccess;
using CIR.DomainModel;
using GamesaCIR.App_Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GamesaCIR.Filters
{
    public class CheckRoleAccess : ActionFilterAttribute
    {
        public MasterManager oMasterManager = new MasterManager();

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            ActionDescriptor oActionDescriptor = filterContext.ActionDescriptor;
            if (CookieManager.GetCookie(CookieManager.CookieName) != null)
            {
                string strActionName = oActionDescriptor.ActionName;
                string strControllerName = oActionDescriptor.ControllerDescriptor.ControllerName;
                RoleAccessModel oRoleAccessModel = new RoleAccessModel()
                {
                     Rleid = CookieManager.GetCookie(CookieManager.CookieName).logindetail.RoleId,
                     ViewType = "0"
                };
                List<RoleAccessDetails> lstRoleAccessDetails = oMasterManager.GetRoleAccess(oRoleAccessModel, CookieManager.GetCookie(CookieManager.CookieName).logindetail.EmpID);
                bool bIsError = true;
                foreach (var item in lstRoleAccessDetails)
                {
                    
                    if (item.Controller.ToLower() == strControllerName.ToLower() && item.Action.ToLower() == strActionName.ToLower() && item.View == "1")
                    {
                        bIsError = false;
                    }
                }
                if (bIsError)
                {
                    filterContext.HttpContext.Response.Redirect("~/Login/Message");
                }
            }
            else
            {
                filterContext.HttpContext.Response.Redirect("~/Login/TimeOut");
            }

            base.OnActionExecuting(filterContext);
        }
    }
}