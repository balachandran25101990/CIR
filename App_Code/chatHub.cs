using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace GamesaCIR.App_Code
{

   // [HubName("editor")]
    public class chatHub : Hub
    {
        public void sendMessage(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            //Clients.All.addNewMessageToPage(name, message);
            Clients.All.broadcastMessage(name, message);
        }
    }



}