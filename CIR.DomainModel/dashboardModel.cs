using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{
    public class DashboardModel
    {
        public Message MessageInfo { get; set; }
        public DashBoardFE DashBoardFEDetails { get; set; }
        public List<PendingDetailsForFE> PendingDetailsForFE { get; set; }
        public List<DashBoard> DashBoardData { get; set; }
        public string DsgId { get; set; }
        public string IsMyPending { get; set; }

    }

    public class DashBoardFE
    {
        public string CIRGenerated { get; set; }
        public string TotalRejected { get; set; }
        public string TotalInProcess { get; set; }
        public string TotalNCRConverted { get; set; }
        public string TotalDeleted { get; set; }
        public string TotalPending { get; set; }
    }

    public class DashBoard
    {
        public string Title { get; set; }
        public string Value { get; set; }
        public bool Link { get; set; }
        public string Desig { get; set; }
    }

    public class DashBoardParameter
    {
        public string DType { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string DateFrm { get; set; }
        public string DateTo { get; set; }
        public string Desig { get; set; }
        public string StatusType { get; set; }
    }

    public class PendingDetailsForFE
    {
        public string CIRID { get; set; }
        public string CIRNumber { get; set; }
        public string AssignedBy { get; set; }
        public string RejectedBy { get; set; }
        public string AssignedDate { get; set; }
        public string CIMID { get; set; }
        public string CIMNumber { get; set; }
    }

    public class SMPDashboardDetail
    {
        public string SUId { get; set; }
        public string SMPUploadNo { get; set; }
        public string AssignedBy { get; set; }
        public string RejectedBy { get; set; }
        public string AssignedDate { get; set; }
        public string Level { get; set; }
        public string Name { get; set; }

    }

}
