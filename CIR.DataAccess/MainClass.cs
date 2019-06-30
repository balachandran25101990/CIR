
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data.SqlClient;
using System.Data;
using CIR.DomainModel;
using System.IO;
using System.Configuration;

namespace CIR.DataAccess
{
    public class MainClass
    {
        #region Global Variables

        log4net.ILog logger = log4net.LogManager.GetLogger(typeof(MainClass));

        #endregion

        #region Global Methods

        /// <summary>
        /// Connection string
        /// </summary>
        /// <returns>string</returns>
        public static string ConnectionWin()
        {
            //var connectionString = "server=192.168.1.100;database=GamesaCIR;uid=rmsysmax;pwd=001!bioravE;connection timeout=600;pooling=true;Min Pool Size=1;";
            //var connectionString = "server=192.168.1.100;database=GamesaCIR;uid=maxchandar;pwd=max@123;connection timeout=600;pooling=true;Min Pool Size=1;";
            //string  connectionString = "server=192.168.1.100;database=CIR;uid=maxchandar;pwd=max@123;connection timeout=600;pooling=true;Min Pool Size=1;";
            //var connectionString = "server=SCATEST\\SQLEXPRESS1;database=GamesaCIR;uid=gamesadb;pwd=gamesa#db;connection timeout=600;pooling=true;Min Pool Size=1;";           
            //var connectionString = "server=202.71.144.100;database=GamesaCIR1;uid=gamadmin;pwd=g@mes@05;connection timeout=600;pooling=true;Min Pool Size=1;";

            var connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            //var connectionString = "server=202.71.144.100;database=GamesaCIR;uid=gamadmin;pwd=g@mes@05;connection timeout=600;pooling=true;Min Pool Size=1;";
            return connectionString;
        }

        /// <summary>`
        /// Connection string for Web
        /// </summary>
        /// <returns>object</returns>
        public static IDbConnection Connection()
        {
            //var connectionString = "server=192.168.1.100;database=GamesaCIR;uid=rmsysmax;pwd=001!bioravE;connection timeout=600;pooling=true;Min Pool Size=1;";
            //var connectionString = "server=192.168.1.100;database=CIR;uid=maxchandar;pwd=max@123;connection timeout=600;pooling=true;Min Pool Size=1;";
            //var connectionString = "server=SCATEST\\SQLEXPRESS1;database=GamesaCIR;uid=gamesadb;pwd=gamesa#db;connection timeout=600;pooling=true;Min Pool Size=1;";
            //var connectionString = "server=202.71.144.100;database=GamesaCIR1;uid=gamadmin;pwd=g@mes@05;connection timeout=600;pooling=true;Min Pool Size=1;";
            var connectionString = ConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;
            //var connectionString = "server=202.71.144.100;database=GamesaCIR;uid=gamadmin;pwd=g@mes@05;connection timeout=600;pooling=true;Min Pool Size=1;";
            var connection = new SqlConnection(connectionString);
            connection.Open();
            return connection;
        }



        #endregion

        #region Common Methods

        /// <summary>
        /// Get the Menu details based on the logged in UserId.
        /// </summary>
        /// <param name="UId">string</param>
        /// <returns>list(object)</returns>
        public List<Menu> GetMenu(string UId)
        {
            MenuResult result = new MenuResult();
            List<Menu> lstMenu = new List<Menu>();
            try
            {
                var Parameter = new { UId = UId };
                var SPName = "MRG_Menu";
                Menu oMenu = new Menu();

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.MainMenu = reader.Read<MasterMenuDetails>().ToList();
                    result.SubMenu = reader.Read<SubMenuDetails>().ToList();
                }

                foreach (MasterMenuDetails details in result.MainMenu)
                {
                    oMenu = new Menu();
                    oMenu.MdlId = details.MdlId;
                    oMenu.Module = details.Module;
                    oMenu.Action = details.Action;
                    oMenu.Controller = details.Controller;
                    oMenu.MenuLink = details.MenuLink;
                    oMenu.SubMenu = result.SubMenu.Where(x => x.RefId == details.MdlId).ToList();
                    lstMenu.Add(oMenu);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return lstMenu;
        }

        /// <summary>
        /// Get the Page Access details based on the Page and login UserId
        /// </summary>
        /// <param name="Page">string</param>
        /// <param name="UId">string</param>
        /// <returns>object</returns>
        public PageAccessResult GetPageAccess(string Page, string UId)
        {
            PageAccessResult result = new PageAccessResult();
            try
            {
                var Parameter = new { Page = Page, UId = UId };
                var SPName = "MRG_PageAccess";

                using (var conn = Connection())
                {
                    var reader = conn.QueryMultiple(SPName, Parameter, commandType: CommandType.StoredProcedure);
                    result.message = reader.Read<PageMessage>().ToList().FirstOrDefault();
                    result.pageaccess = reader.Read<PageAccessModel>().ToList().FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
            return result;
        }

        public string ConvertDate(string date)
        {
            if (date != null && date.Trim() != string.Empty)
            {
                try
                {
                    return date.Split('/')[2] + "-" + date.Split('/')[1] + "-" + date.Split('/')[0];
                }
                catch
                {
                    return "";
                }
            }
            else return "";
        }

        #endregion

        #region Error Log

        /// <summary>
        /// Save the Error Message details in to one file based on the server location.
        /// </summary>
        /// <param name="errorMessage">object</param>
        public static void SaveErrorMessageInFile(ErrorMessage errorMessage)
        {
            try
            {
                string strFilePath = System.Configuration.ConfigurationManager.AppSettings["FileExtractSource"].ToString();
                File.AppendAllText(strFilePath + "\\ErrorMessage.txt", string.Format("{0} - {1} - {2} - {3} - {4} ;", errorMessage.UserId, errorMessage.ModuleName, errorMessage.Exception, errorMessage.MethodName, errorMessage.ErrorCapturedOn = DateTime.Now.ToLongDateString() + Environment.NewLine));
            }
            catch
            {
                throw;
            }
        }

        #endregion
    }
}
