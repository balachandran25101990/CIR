using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIR.DomainModel
{

    //#region Alarm FAQ Model


    //public class AlarmFAQModel
    //{
    //    public List<AlarmDetails> AlarmDetail { get; set; }
    //    public List<AlarmReasonDetails> AlarmReasonDetail { get; set; }
    //}

    //public class AlarmDetails
    //{
    //    public string AFQID { get; set; }
    //    public string AFQCODE { get; set; }
    //    public string AFQAlarmDesc { get; set; }
    //    public string AFQDesc { get; set; }
    //    public string AFQCategory { get; set; }
    //}

    //public class AlarmReasonDetails
    //{
    //    public string Slno { get; set; }
    //    public string ADID { get; set; }
    //    public string AFQID { get; set; }
    //    public string Reason { get; set; }
    //    public string CheckSolution { get; set; }
    //    public string DocCode { get; set; }
    //    public string Reference { get; set; }
    //}

    //public class AlarmDetailsNew
    //{
    //    public int Id { get; set; }
    //    public string FRefid { get; set; }
    //    public string CatId { get; set; }
    //    public string Title { get; set; }
    //    public string TagTitle { get; set; }
    //    public string Filname { get; set; }
    //    public string FileName1 { get; set; }
    //    public bool IsImage { get; set; }
    //}


    //#endregion


    #region Alarm FAQ Model

    public class AlarmFAQModel
    {
        public List<AlarmDetails> AlarmDetail { get; set; }
        public List<AlarmReasonDetails> AlarmReasonDetail { get; set; }
    }

    public class AlarmDetails
    {
        public string AFQID { get; set; }
        public string AFQCODE { get; set; }
        public string AFQAlarmDesc { get; set; }
        public string AFQDesc { get; set; }
        public string AFQCategory { get; set; }
    }

    public class AlarmReasonDetails
    {
        public string Slno { get; set; }
        public string ADID { get; set; }
        public string AFQID { get; set; }
        public string Reason { get; set; }
        public string CheckSolution { get; set; }
        public string DocCode { get; set; }
        public string Reference { get; set; }
    }

    #endregion


    #region Change Note

    public class ChangeNote
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public bool IsImage { get; set; }
    }


    #endregion

    #region Field Alert Document

    public class FieldAlertDocument
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public bool IsImage { get; set; }
    }

    #endregion

    #region Service Bullet In

    public class ServiceBulletIn
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public bool IsImage { get; set; }
    }

    #endregion

    #region Software Hardware Download

    public class WTGSoftwareHardware
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public bool IsImage { get; set; }
    }

    #endregion

    #region Safety Alert

    public class SafetyAlert
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public bool IsImage { get; set; }
    }

    #endregion

    #region Customet Information Document

    public class CustomerInfo
    {
        public int Id { get; set; }
        public string FRefid { get; set; }
        public string CatId { get; set; }
        public string Title { get; set; }
        public string TagTitle { get; set; }
        public string Filname { get; set; }
        public string FileName1 { get; set; }
        public bool IsImage { get; set; }
    }

    #endregion

}
