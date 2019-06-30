using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CIR.DataAccess;
using CIR.DomainModel;
using System.Web.Http.Results;
using System.Web.Mvc;
namespace GamesaCIR.Controllers.api
{

    public class ChatsController : ApiController
    {

        ChatManager oChatManager = new ChatManager();

        [System.Web.Http.HttpPost]
        public HttpResponseMessage SetChatMessage(string Id, string FromId, string ToId, string Msg, string Attachment, string MsgView,
            string AttachView, string Refid, string view, string Delflag, string UsrDelflag, string UId)
        {
            try
            {
                Message oMessage = oChatManager.SetChatAPI(Id, FromId, ToId, Msg, Attachment, MsgView,
             AttachView, Refid, view, Delflag, UsrDelflag, UId);
                return Request.CreateResponse(HttpStatusCode.OK, oMessage);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [System.Web.Http.HttpGet]
        public HttpResponseMessage GetChatMessage(string toId, string uid, string view)
        {
            try
            {
                List<ChatModel> result = oChatManager.GetChatAPI(toId, uid, view);
                return Request.CreateResponse(HttpStatusCode.OK, result);
                //  return Json(new { result }, JsonRequestBehavior.AllowGet);// System.Web.Mvc.JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);

            }
        }
    }

}