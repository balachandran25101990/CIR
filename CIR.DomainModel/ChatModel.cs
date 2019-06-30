using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{
   public  class ChatModel
    {
        public string Id { get; set; }
        public string FromId { get; set; }
        public string ToId { get; set; }
        public string Msg { get; set; }
        public string Attachment { get; set; }
        public string MsgView { get; set; }
        public string Attachview { get; set; }
        public string Refid { get; set; }
        public string Delflag { get; set; }
        public string UsrDelflag { get; set; }
        public string Name { get; set; }
        public string EmpImage { get; set; }
        public string DsgName { get; set; }
        public string Sites { get; set; }
        public string MsgCount { get; set; }
        public string view { get; set; }
        public string SAPcode { get; set; }
    }

    public class ChatResult
    {
        public ChatModel CIRData { get; set; }
        public Message MessageInfo { get; set; }

    }
  
}
