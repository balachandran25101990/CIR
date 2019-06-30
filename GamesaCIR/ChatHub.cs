using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;
using GamesaCIR.App_Code;
using System.Threading;
using System.Net.Http;
using System.Net.Http.Headers;


namespace GamesaCIR
{
    public class ChatHub : Hub
    {

        #region Data Members
        static List<UserDetail> ConnectedUsers = new List<UserDetail>();
        static List<MessageDetail> CurrentMessage = new List<MessageDetail>();

        #endregion

        #region Methods

        //  public void Connect(string userName)
        public void Connect(string userName, string UsernameId, string Sites,string State, string Imgid, string serverTime, string dsgName, string status, string penmsg)
        {
            var id = Context.ConnectionId;


            if (ConnectedUsers.Count(x => x.ConnectionId == id) == 0)
            {
                // ConnectedUsers.Add(new UserDetail { ConnectionId = id, UserName = userName });
                ConnectedUsers.Add(new UserDetail { ConnectionId = id, UserName = userName, UserNameId = UsernameId, Sites = Sites,States=State, Img = Imgid, ServerTime = serverTime, Desg = dsgName, status = status, PendingMSg = penmsg });

                // send to caller
                Clients.Caller.onConnected(id, userName, ConnectedUsers, CurrentMessage);

                // send to all except caller client
                Clients.AllExcept(id).onNewUserConnected(id, userName, ConnectedUsers);

            }

        }

        public void SendMessageToAll(string userName, string message)
        {
            // store last 100 messages in cache
            AddMessageinCache(userName, message);

            // Broad cast message
            Clients.All.messageReceived(userName, message);
        }    

        // public void SendPrivateMessage(string toUserId, string message)
        public void SendPrivateMessage(string toUserId, string message, string touserid, string fromuserid, string attach, string view, string uid, string url)
        {
            string fromUserId = Context.ConnectionId;

            var toUser = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == toUserId);
            var fromUser = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == fromUserId);
            //if (touserid != null && fromuserid != null)
             if (message != "|" && message != "||")
            {
                ThreadPool.QueueUserWorkItem(delegate
                {
                    HttpClient client = new HttpClient();
                    string strBaseUrl = System.Configuration.ConfigurationManager.AppSettings["baseUrl"].ToString();
                    client.BaseAddress = new Uri(strBaseUrl);
                    StringContent queryString = new StringContent(message);
                    // Add an Accept header for JSON format.
                    client.DefaultRequestHeaders.Accept.Add(
                            new MediaTypeWithQualityHeaderValue("application/json"));

                    HttpResponseMessage response = client.PostAsync("api/Chats/SetChatMessage?Id=0&FromId=" + fromuserid + "&ToId=" + touserid + "&Msg=" + message + "&Attachment=" + attach + "&MsgView=0&AttachView=0&Refid=&view=" + view + "&Delflag=0&UsrDelflag=0&UId=" + uid + "", queryString).Result;

                    if (response.IsSuccessStatusCode)
                    {

                        //var users = response.Content.ReadAsAsync &
                        //lt; IEnumerable & lt; Users & gt; &gt; ().Result;
                        //usergrid.ItemsSource = users;

                    }
                    else
                    {
                        //MessageBox.Show("Error Code" +
                        //response.StatusCode + " : Message - " + response.ReasonPhrase);
                    }
                });
            }

            if (toUser != null && fromUser != null)
            {
                // send to 
                Clients.Client(toUserId).sendPrivateMessage(fromUserId, fromUser.UserName, message,fromuserid,attach,url);  //touser
                if (message != "|" && message != "||") { Clients.Client(toUserId).displayNotification(message,touserid, fromuserid, fromUser.UserName,attach);  //touser
                }


                // send to caller user
                Clients.Caller.sendPrivateMessage(toUserId, fromUser.UserName, message, fromuserid, attach, url); //from user
              //  Clients.All.displayNotification("succ");
            }

        

        }

        public  override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                ConnectedUsers.Remove(item);

                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item);//.UserName,item.UserNameId,item.Img,item.ServerTime,item.Sites,item.States);

            }

            return base.OnDisconnected(stopCalled);
        }


        #endregion

        #region private Messages

        private void AddMessageinCache(string userName, string message)
        {
            CurrentMessage.Add(new MessageDetail { UserName = userName, Message = message });

            if (CurrentMessage.Count > 100)
                CurrentMessage.RemoveAt(0);
        }

        #endregion

    }
}