using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GamesaCIR.App_Code
{
    public class UserDetail
    {
        public string ConnectionId { get; set; }
        public string UserName { get; set; }
        public string UserNameId { get; set; }
        public string Sites { get; set; }
        public string States { get; set; }
        public string Img { get; set; }
        public string ServerTime { get; set; }
        public string Desg { get; set; }
        public string status { get; set; }  //1-active 0-idle
        public string PendingMSg { get; set; }
    }
}