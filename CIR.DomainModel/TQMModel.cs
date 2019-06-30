using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{
    #region QIT Prjoect
    public class QITPrjoect
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public string IsImage { get; set; }
    }
    #endregion

    #region TQM Reliability Report
    public class TQMReliabilityReport
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public string IsImage { get; set; }
    }
    #endregion

    #region SCM Report
    public class SCMReport
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public string IsImage { get; set; }
    }
    #endregion

}
