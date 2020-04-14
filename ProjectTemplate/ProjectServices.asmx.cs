using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;
using System.Web.Http;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace ProjectTemplate
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]

	public class ProjectServices : System.Web.Services.WebService
	{

        public string sessionID;
        ////////////////////////////////////////////////////////////////////////
        ///replace the values of these variables with your database credentials
        ////////////////////////////////////////////////////////////////////////
        private string dbID = "codeagainsthuman";
        private string dbPass = "!!Codeagainsthuman";
        private string dbName = "codeagainsthumanity";
        ////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////
        ///call this method anywhere that you need the connection string!
        ////////////////////////////////////////////////////////////////////////

        private string getConString()
        {
            return "SERVER=107.180.1.16; PORT=3306; DATABASE=" + dbName + "; UID=" + dbID + "; PASSWORD=" + dbPass;
        }
        ////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////
        //don't forget to include this decoration above each method that you want
        //to be exposed as a web service!
        [WebMethod(EnableSession = true)]
        /////////////////////////////////////////////////////////////////////////
        public string TestConnection()
        {
            try
            {
                string testQuery = "select * from test";

                ////////////////////////////////////////////////////////////////////////
                ///here's an example of using the getConString method!
                ////////////////////////////////////////////////////////////////////////
                MySqlConnection con = new MySqlConnection(getConString());
                ////////////////////////////////////////////////////////////////////////

                MySqlCommand cmd = new MySqlCommand(testQuery, con);
                MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                DataTable table = new DataTable();
                adapter.Fill(table);
                return "Success!";
            }
            catch (Exception e)
            {
                return "Something went wrong, please check your credentials and db name and try again.  Error: " + e.Message;
            }
        }



        [WebMethod(EnableSession = true)]
        public string GetSessionId()
        {
            return Session["StaffId"].ToString();
        }
        /*[WebMethod]
        public void ProcessRequest(HttpContext context)
            {
                if (context.Request.Files.Count > 0)
                {
                    HttpFileCollection files = context.Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFile file = files[i];
                        string fname = context.Server.MapPath("~/uploads/" + file.FileName);
                        file.SaveAs(fname);
                    }
                    context.Response.ContentType = "text/plain";
                }
            }*/

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public string LogOn(string email, string pass)
        {
            //we return this flag to tell them if they logged in or not

            //our connection string comes from our web.config file like we talked about earlier
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlSelect = "SELECT StaffId, Admin FROM Staff WHERE Email=@emailValue and password=@passValue;";

            //set up our connection object to be ready to use our connection string
            MySqlConnection con = new MySqlConnection(getConString());
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, con);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@emailValue", HttpUtility.UrlDecode(email));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            //a data adapter acts like a bridge between our command object and 
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's 
            //a legit account

            if (sqlDt.Rows.Count > 0)
            {
                //if we found an account, store the id and admin status in the session
                //so we can check those values later on other method calls to see if they 
                //are 1) logged in at all, and 2) and admin or not

                string accountID = sqlDt.Rows[0]["StaffId"].ToString();
                Session["Admin"] = sqlDt.Rows[0]["Admin"];
                Session["StaffId"] = sqlDt.Rows[0]["StaffId"].ToString();
                sessionID = sqlDt.Rows[0]["StaffId"].ToString();
                return accountID;

            }

            return null;

        }

        //EXAMPLE OF A SELECT, AND RETURNING "COMPLEX" DATA TYPES
        [WebMethod(EnableSession = true)]
        public Staff[] GetAccounts()
        {
            //check out the return type.  It's an array of Account objects.  You can look at our custom Account class in this solution to see that it's 
            //just a container for public class-level variables.  It's a simple container that asp.net will have no trouble converting into json.  When we return
            //sets of information, it's a good idea to create a custom container class to represent instances (or rows) of that information, and then return an array of those objects.  
            //Keeps everything simple.

            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
                DataTable sqlDt = new DataTable("accounts");

                string sqlSelect = "select StaffId, LastName, FirstName, email, password, Department, StaffTitle, MentorId, myerBriggs, disc, Resume, LinkedIn from Staff order by LastName;";

                MySqlConnection sqlConnection = new MySqlConnection(getConString());
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.
                List<Staff> accounts = new List<Staff>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                        accounts.Add(new Staff
                        {
                            id = sqlDt.Rows[i]["StaffId"].ToString(),
                            fname = sqlDt.Rows[i]["FirstName"].ToString(),
                            lname = sqlDt.Rows[i]["LastName"].ToString(),
                            email = sqlDt.Rows[i]["Email"].ToString(),
                            pass = sqlDt.Rows[i]["password"].ToString(),
                            department = sqlDt.Rows[i]["Department"].ToString(),
                            role = sqlDt.Rows[i]["StaffTitle"].ToString(),
                            mb = sqlDt.Rows[i]["myerBriggs"].ToString(),
                            disc = sqlDt.Rows[i]["disc"].ToString(),
                            resume = sqlDt.Rows[i]["resume"].ToString(),
                            linkedin = sqlDt.Rows[i]["LinkedIn"].ToString(),
                            mid = sqlDt.Rows[i]["MentorId"].ToString()
                        });
                }
                //convert the list of accounts to an array and return!
                return accounts.ToArray();

        }


        [WebMethod(EnableSession = true)]
        public Staff LoadUser(string ID)
        {

            DataTable sqlDt = new DataTable("staff");
            string sqlSelect = "select * " +
                "from Staff " +
                "where StaffId = @uidvalue";

            MySqlConnection sqlConnection = new MySqlConnection(getConString());
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@uidvalue", HttpUtility.UrlDecode(ID));

            //gonna use this to fill a data table
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //filling the data table
            sqlDa.Fill(sqlDt);
            Staff activeUser = new Staff
            {
                id = ID,
                fname = sqlDt.Rows[0]["FirstName"].ToString(),
                lname = sqlDt.Rows[0]["LastName"].ToString(),
                email = sqlDt.Rows[0]["Email"].ToString(),
                pass = sqlDt.Rows[0]["password"].ToString(),
                department = sqlDt.Rows[0]["Department"].ToString(),
                role = sqlDt.Rows[0]["Department"].ToString(),
                mb = sqlDt.Rows[0]["myerBriggs"].ToString(),
                disc = sqlDt.Rows[0]["disc"].ToString(),
                resume = sqlDt.Rows[0]["resume"].ToString(),
                linkedin = sqlDt.Rows[0]["LinkedIn"].ToString(),
                mid = sqlDt.Rows[0]["MentorId"].ToString()


            };
            //convert the list of accounts to an array and return!
            return activeUser;


        }


        [HttpGet]
        [WebMethod]
        public async Task<string> GetAsync(string uri)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                return await reader.ReadToEndAsync();
            }
        }

        [WebMethod(EnableSession = true)]
        public Staff LoadMentor(string ID)
        {

            DataTable sqlDt = new DataTable("staff");
            string sqlSelect = "SELECT B.* FROM codeagainsthumanity.Staff AS A LEFT OUTER JOIN codeagainsthumanity.Staff AS B ON A.MentorID = B.StaffID where A.StaffID = @uidvalue;";
            MySqlConnection sqlConnection = new MySqlConnection(getConString());
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@uidvalue", HttpUtility.UrlDecode(ID));

            //gonna use this to fill a data table
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //filling the data table
            sqlDa.Fill(sqlDt);
            Staff mentor = new Staff
            {
                id = ID,
                fname = sqlDt.Rows[0]["FirstName"].ToString(),
                lname = sqlDt.Rows[0]["LastName"].ToString(),
                email = sqlDt.Rows[0]["Email"].ToString(),
                pass = sqlDt.Rows[0]["password"].ToString(),
                department = sqlDt.Rows[0]["Department"].ToString(),
                role = sqlDt.Rows[0]["StaffTitle"].ToString(),
                mb = sqlDt.Rows[0]["myerBriggs"].ToString(),
                disc = sqlDt.Rows[0]["disc"].ToString(),
                resume = sqlDt.Rows[0]["resume"].ToString(),
                linkedin = sqlDt.Rows[0]["LinkedIn"].ToString()
            };
            //convert the list of accounts to an array and return!
            return mentor;

        }

        [WebMethod(EnableSession = true)]
        public Staff LoadMentee(string ID)
        {

            DataTable sqlDt = new DataTable("staff");
            string sqlSelect = "SELECT B.* FROM codeagainsthumanity.Staff AS A LEFT OUTER JOIN codeagainsthumanity.Staff AS B ON A.StaffID = B.MentorID where A.StaffID = @uidvalue;";

            MySqlConnection sqlConnection = new MySqlConnection(getConString());
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@uidvalue", HttpUtility.UrlDecode(ID));

            //gonna use this to fill a data table
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //filling the data table
            sqlDa.Fill(sqlDt);
            Staff mentee = new Staff
            {
                id = ID,
                fname = sqlDt.Rows[0]["FirstName"].ToString(),
                lname = sqlDt.Rows[0]["LastName"].ToString(),
                email = sqlDt.Rows[0]["Email"].ToString(),
                pass = sqlDt.Rows[0]["password"].ToString(),
                department = sqlDt.Rows[0]["Department"].ToString(),
                role = sqlDt.Rows[0]["StaffTitle"].ToString(),
                mb = sqlDt.Rows[0]["myerBriggs"].ToString(),
                disc = sqlDt.Rows[0]["disc"].ToString(),
                resume = sqlDt.Rows[0]["resume"].ToString(),
                linkedin = sqlDt.Rows[0]["LinkedIn"].ToString()
            };
            //convert the list of accounts to an array and return!
            return mentee;

        }

        
        public string CreateAccount(string fname, string lname, string email, string pass, string myer,
            string dept, string role, string disc)
        {
            string sqlSelect = "insert into Staff (Lastname, Firstname, Email, password, Department, StaffTitle, myerBriggs, disc) " +
                "values (@lastValue, @firstValue, @emailValue, @passValue, @deptValue, @roleValue, @myerValue, @discValue);";

            MySqlConnection sqlConnection = new MySqlConnection(getConString());
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@lastValue", HttpUtility.UrlDecode(lname));
            sqlCommand.Parameters.AddWithValue("@firstValue", HttpUtility.UrlDecode(fname));
            sqlCommand.Parameters.AddWithValue("@emailValue", HttpUtility.UrlDecode(email));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));
            sqlCommand.Parameters.AddWithValue("@deptValue", HttpUtility.UrlDecode(dept));
            sqlCommand.Parameters.AddWithValue("@roleValue", HttpUtility.UrlDecode(role));
            sqlCommand.Parameters.AddWithValue("@myerValue", HttpUtility.UrlDecode(myer));
            sqlCommand.Parameters.AddWithValue("@discValue", HttpUtility.UrlDecode(disc));

            var response = GetAsync("https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78d26vdxwlrqb7&redirect_uri=http%3A%2F%2Flocalhost%3A50287%2Findex.html&state=fooobar&scope=r_liteprofile%20r_emailaddress%20w_member_social");
            //this time, we're not using a data adapter to fill a data table.  We're just                                                  %3A = :    %2F = /
            //opening the connection, telling our command to "executescalar" which says basically
            //execute the query and just hand me back the number the query returns (the ID, remember?).
            //don't forget to close the connection!
            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
            return response.ToString();
        }

        [WebMethod(EnableSession = true)]
        public Staff[] ListMentees()
        {

            DataTable sqlDt = new DataTable("staff");
            string sqlSelect = "select * from Staff where MentorId is null and Mentor=0;";

            MySqlConnection sqlConnection = new MySqlConnection(getConString());
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);


            //gonna use this to fill a data table
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //filling the data table
            sqlDa.Fill(sqlDt);
            List<Staff> mentees = new List<Staff>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                mentees.Add(new Staff
                {
                    id = sqlDt.Rows[i]["StaffId"].ToString(),
                    fname = sqlDt.Rows[i]["FirstName"].ToString(),
                    lname = sqlDt.Rows[i]["LastName"].ToString(),
                    email = sqlDt.Rows[i]["Email"].ToString(),
                    pass = sqlDt.Rows[i]["password"].ToString(),
                    department = sqlDt.Rows[i]["Department"].ToString(),
                    role = sqlDt.Rows[i]["StaffTitle"].ToString(),
                    mb = sqlDt.Rows[i]["myerBriggs"].ToString(),
                    disc = sqlDt.Rows[i]["disc"].ToString()
                });
            }
            //convert the list of accounts to an array and return!
            return mentees.ToArray();

        }
        
        [WebMethod(EnableSession = true)]
        public void RequestMentee(string menteeId, string message="")
        {
            string sqlSelect = string.Empty;
            if (message != "")
            {
                sqlSelect = "insert into requests(StaffId, MentorId, request) values(@menteeValue, @mentorValue, @messageValue);";
            }
            else
            {
                sqlSelect = "insert into requests(StaffId, MentorId) values (@menteeValue, @mentorValue);";
            }
            

            //set up our connection object to be ready to use our connection string
            MySqlConnection con = new MySqlConnection(getConString());
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, con);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@mentorValue", HttpUtility.UrlDecode(GetSessionId()));
            sqlCommand.Parameters.AddWithValue("@menteeValue", HttpUtility.UrlDecode(menteeId));
            sqlCommand.Parameters.AddWithValue("@messageValue", HttpUtility.UrlDecode(message));


            con.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            con.Close();
        }

        [WebMethod(EnableSession = true)]
        public Staff[] LoadRequests()
        {

            DataTable sqlDt = new DataTable("staff");
            string sqlSelect = "select distinct Staff.StaffId, FirstName, LastName, Department, StaffTitle, myerBriggs, disc, request from Staff left join requests " +
                "on Staff.StaffId = requests.MentorId where Staff.StaffId in (select MentorId from requests where StaffId = @uidvalue and " +
                "status = 'Pending');";

            MySqlConnection sqlConnection = new MySqlConnection(getConString());
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@uidvalue", GetSessionId());

            //gonna use this to fill a data table
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //filling the data table
            sqlDa.Fill(sqlDt);

            List<Staff> potentialMentors = new List<Staff>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                potentialMentors.Add(new Staff
                {
                    id = sqlDt.Rows[i]["StaffId"].ToString(),
                    fname = sqlDt.Rows[i]["FirstName"].ToString(),
                    lname = sqlDt.Rows[i]["LastName"].ToString(),
                    department = sqlDt.Rows[i]["Department"].ToString(),
                    role = sqlDt.Rows[i]["StaffTitle"].ToString(),
                    mb = sqlDt.Rows[i]["myerBriggs"].ToString(),
                    disc = sqlDt.Rows[i]["disc"].ToString(),
                    request = sqlDt.Rows[i]["request"].ToString()
                });
            }
            //convert the list of accounts to an array and return!
            return potentialMentors.ToArray();
        }

        [WebMethod(EnableSession = true)]
        public void AcceptRequest(string mentorId)
        {
            string sqlUpdate = "update requests set status = 'Accepted' where StaffId = @menteeValue and MentorId = @mentorValue;" +
                " update requests set status = 'Rejected' where StaffId = @menteeValue and status != 'Accepted';";

            string sqlConnect = "update Staff set MentorId=@mentorValue where StaffId=@menteeValue;";

            //set up our connection object to be ready to use our connection string
            MySqlConnection con = new MySqlConnection(getConString());
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlConnect, con);
            MySqlCommand sqlCommand2 = new MySqlCommand(sqlUpdate, con);


            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@menteeValue", HttpUtility.UrlDecode(GetSessionId()));
            sqlCommand.Parameters.AddWithValue("@mentorValue", HttpUtility.UrlDecode(mentorId));
            sqlCommand2.Parameters.AddWithValue("@menteeValue", HttpUtility.UrlDecode(GetSessionId()));
            sqlCommand2.Parameters.AddWithValue("@mentorValue", HttpUtility.UrlDecode(mentorId));


            con.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                sqlCommand.ExecuteNonQuery();
                sqlCommand2.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            con.Close();

        }

        [WebMethod(EnableSession = true)]
        public void RejectRequest(string mentorId)
        {
            string sqlUpdate = " update requests set status = 'Rejected' where StaffId = @menteeValue and MentorId = @mentorValue;";

            //set up our connection object to be ready to use our connection string
            MySqlConnection con = new MySqlConnection(getConString());
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlUpdate, con);


            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@menteeValue", HttpUtility.UrlDecode(GetSessionId()));
            sqlCommand.Parameters.AddWithValue("@mentorValue", HttpUtility.UrlDecode(mentorId));


            con.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            con.Close();

        }
    }
}
