// JavaScript source code
var activeID;
var activeUser;
var mentorRequests;

function TestButtonHandler() {
    var webMethod = "ProjectServices.asmx/TestConnection";
    var parameters = "{}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var responseFromServer = msg.d;
            alert(responseFromServer);
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function createNewAccount() {
    let fname
    let lname
    let pass
    let email
    let dept
    let role
    let myer
    let disc
    let resume

    var webMethod = "ProjectServices.asmx/CreateAccount";
    var parameters = "{\"fname\":\"" + encodeURI(fname) + "\", \"lname\":\"" + encodeURI(lname) + "\","
        + "\"pass\":\"" + encodeURI(pass) + "\", \"email\":\"" + encodeURI(email) + "\"," +
        "\"dept\":\"" + encodeURI(dept) + "\", \"role\":\"" + encodeURI(role) + "\"," +
        "\"myer\":\"" + encodeURI(myer) + "\"," + "\"disc\":\"" + encodeURI(disc) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            alert("Account Created");
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function LogOn(email, pass) {
    //the url of the webservice we will be talking to
    var webMethod = "ProjectServices.asmx/LogOn";
    //the parameters we will pass the service (in json format because curly braces)
    //note we encode the values for transmission over the web.  All the \'s are just
    //because we want to wrap our keynames and values in double quotes so we have to
    //escape the double quotes (because the overall string we're creating is in double quotes!)
    var parameters = "{\"email\":\"" + encodeURI(email) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";

    //jQuery ajax method
    $.ajax({
        //post is more secure than get, and allows
        //us to send big data if we want.  really just
        //depends on the way the service you're talking to is set up, though
        type: "POST",
        //the url is set to the string we created above
        url: webMethod,
        //same with the data
        data: parameters,
        //these next two key/value pairs say we intend to talk in JSON format
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //jQuery sends the data and asynchronously waits for a response.  when it
        //gets a response, it calls the function mapped to the success key here

        success: function (id) {
            if (id.d) {
                //server replied true
                activeID = id.d;
                console.log(activeID)
                alert("Logged In!")
                //var x = document.getElementById("buttonsID");
                //location.replace("homepage.html");
                
                LoadUser();
                
                
                //var y = document.getElementById("Logon");
                //y.style.display = "none";

            }
            else {
                //server replied false, so let the user know
                //the logon failed
                alert("logon failed");
            }
        },
        error: function (e) {
            //if something goes wrong in the mechanics of delivering the
            //message to the server or the server processing that message,
            //then this function mapped to the error key is executed rather
            //than the one mapped to the success key.  This is just a garbage
            //alert because I'm lazy
            alert("boo...");
        }
    });
}

function LoadUser() {
    var id = activeID;
    console.log(id);
    var webMethod = "ProjectServices.asmx/LoadUser";
    var parameters = "{\"ID\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (id) {
            activeUser = id.d;
            console.log("Active User's first name", activeUser.fname);
            //location.replace("homepage.html");
            var x = document.getElementById("Logon");
            x.style.display = "none";
            var y = document.getElementById("NavigationBar");
            y.style.display = "block";
            var z = document.getElementById("iFrame");
            z.style.display = "block";
            var q = document.getElementById("Profile");
            q.style.display = "none";
            var admin = document.getElementById('admin');
            admin.style.display = "none";
            document.getElementById('adRequests').style.display = "none";
            document.getElementById('adHeading').style.display = "none";
            var z = document.getElementById("menteeDiv");
            z.style.display = "none";
            var m = document.getElementById("fullMentee");
            m.style.display = "none";

            if (activeUser.id == "115") {
                var a = document.getElementById("adminNav");
                a.style.display = "block";
            }
            else {
                var b = document.getElementById("adminNav");
                b.style.display = "none";
            }
            if (activeUser.mentorStatus != 1) {
                var c = document.getElementById("requestMentor");
                c.style.display = "block";
                document.getElementById("connectTab").style.display = 'none';
            }
            else {
                var d = document.getElementById("requestMentor");
                d.style.display = "none";
            }
        },
        error: function (e) {
            console.log(e.responseText);
            alert("load user error");
        }
    });
}

function loadProfile() {
    var id = activeID;
    console.log(id);
    var webMethod = "ProjectServices.asmx/LoadUser";
    var parameters = "{\"ID\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (id) {
            activeUser = id.d;
            console.log("Active User's email", activeUser.email);

            var a = document.getElementById("Logon");
            a.style.display = "none";
            var b = document.getElementById("NavigationBar");
            b.style.display = "block";
            var c = document.getElementById("iFrame");
            c.style.display = "none";
            var d = document.getElementById("Profile");
            d.style.display = "block";
            var z = document.getElementById("menteeDiv");
            z.style.display = "none";
            var m = document.getElementById("fullMentee");
            m.style.display = "none";
            var admin = document.getElementById("admin");
            admin.style.display = "none";
            document.getElementById('adRequests').style.display = "none";
            document.getElementById('adHeading').style.display = "none";

            document.getElementById("fname").value = activeUser.fname;
            document.getElementById("lname").value = activeUser.lname;
            document.getElementById("Email").value = activeUser.email;
            document.getElementById("Psw").value = activeUser.pass;
            document.getElementById("dep").value = activeUser.department;
            document.getElementById("role").value = activeUser.role;
            document.getElementById("myers").value = activeUser.mb;
            document.getElementById("disc").value = activeUser.disc;
            document.getElementById("resume").setAttribute("href", activeUser.resume);
            document.getElementById("linkedin").setAttribute("href", activeUser.linkedin);

        },
        error: function (e) {
            console.log(e.responseText);
            alert("load user error");
        }
    });
}


function MentorProfile() {
    var id = activeID;
    console.log(id);
    var webMethod = "ProjectServices.asmx/LoadMentor";
    var parameters = "{\"ID\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (id) {
            mentor = id.d;
            console.log("Mentor's email", mentor.email);

            var a = document.getElementById("Logon");
            a.style.display = "none";
            var b = document.getElementById("NavigationBar");
            b.style.display = "block";
            var c = document.getElementById("iFrame");
            c.style.display = "none";
            var d = document.getElementById("Profile");
            d.style.display = "block";
            document.getElementById('menteeArea').style.display = "block";
            var e = document.getElementsByTagName("input")
            e.disabled = true;
            var z = document.getElementById("menteeDiv");
            z.style.display = "none";
            var m = document.getElementById("fullMentee");
            m.style.display = "none";
            var admin = document.getElementById("admin");
            admin.style.display = "none";
            document.getElementById('adRequests').style.display = "none";
            document.getElementById('adHeading').style.display = "none";

            document.getElementById("fname").value = mentor.fname;
            document.getElementById("lname").value = mentor.lname;
            document.getElementById("Email").value = mentor.email;
            document.getElementById("Psw").value = mentor.pass;
            document.getElementById("dep").value = mentor.department;
            document.getElementById("role").value = mentor.role;
            document.getElementById("myers").value = mentor.mb;
            document.getElementById("disc").value = mentor.disc;
            document.getElementById("resume").setAttribute("href", mentor.resume);
            document.getElementById("linkedin").setAttribute("href", mentor.linkedin);

            loadRequests();

        },
        error: function (e) {
            console.log(e.responseText);
            alert("load user error");
        }
    });
}

function MenteeProfile() {
    var id = activeID;
    console.log(id);
    var webMethod = "ProjectServices.asmx/LoadMentee";
    var parameters = "{\"ID\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (id) {
            mentee = id.d;
            console.log("Mentor's email", mentee.email);

            var a = document.getElementById("Logon");
            a.style.display = "none";
            var b = document.getElementById("NavigationBar");
            b.style.display = "block";
            var c = document.getElementById("iFrame");
            c.style.display = "none";
            var d = document.getElementById("Profile");
            d.style.display = "block";
            var e = document.getElementsByTagName("input")
            e.disabled = true;
            var z = document.getElementById("menteeDiv");
            z.style.display = "none";
            var m = document.getElementById("fullMentee");
            m.style.display = "none";
            var admin = document.getElementById("admin");
            admin.style.display = "none";
            document.getElementById('adRequests').style.display = "none";
            document.getElementById('adHeading').style.display = "none";

            document.getElementById("fname").value = mentee.fname;
            document.getElementById("lname").value = mentee.lname;
            document.getElementById("Email").value = mentee.email;
            document.getElementById("Psw").value = mentee.pass;
            document.getElementById("dep").value = mentee.department;
            document.getElementById("role").value = mentee.role;
            document.getElementById("myers").value = mentee.mb;
            document.getElementById("disc").value = mentee.disc;
            document.getElementById("resume").setAttribute("href", mentee.resume);
            document.getElementById("linkedin").setAttribute("href", mentee.linkedin);
        },
        error: function (e) {
            console.log(e.responseText);
            alert("load user error");
        }
    });
}

function loadMentees() {
    var webMethod = "ProjectServices.asmx/ListMentees";
    var parameters = "{}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (mentees) {
            var z = document.getElementById("Profile");
            z.style.display = "none";
            var c = document.getElementById("iFrame");
            c.style.display = "none";
            var z = document.getElementById("menteeDiv");
            z.style.display = "block";
            var m = document.getElementById("fullMentee");
            m.style.display = "block";
            var admin = document.getElementById("admin");
            admin.style.display = "none";
            document.getElementById('adRequests').style.display = "none";
            document.getElementById('adHeading').style.display = "none";
           

            var availableMentees = mentees.d;
            var ul = document.getElementById('mentees');
            var stmt = ''
            for (var i = 0; i < availableMentees.length; i++) {
                stmt = stmt + '<li class="mentee" onclick="fullMentee(' + i + ')"><h4>' + availableMentees[i].fname + ' ' + availableMentees[i].lname + '</h4>' +
                    '<p>' + availableMentees[i].department + '--' + availableMentees[i].role + '</p></li>';
                console.log(stmt);
                ul.innerHTML = stmt;
            }
            
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
            console.log(e.responseText);
        }
    });
   
}


function loadRequests() {
    var webMethod = "ProjectServices.asmx/LoadRequests";
    var parameters = "{}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            mentorRequests = msg.d;
            console.log(mentorRequests);
            var stmt = '';
            for (var i = 0; i < mentorRequests.length; i++) {
                stmt = stmt + '<li id="' + i + '"><h3><a onclick="moreInfo(' + i +  ')">' + mentorRequests[i].fname +
                    ' ' + mentorRequests[i].lname + '</a></h3><button onclick="acceptRequest(' + mentorRequests[i].id +
                    ')">Accept</button><button onclick="rejectRequest(' + mentorRequests[i].id + ')">Reject</button></li>';

            }
            document.getElementById('mentorList').innerHTML = stmt;
            if (mentorRequests.length > 0) {
                document.getElementById('mentorHeading').innerHTML = "New Mentor Requests!";
            }
            else {
                document.getElementById('mentorHeading').innerHTML = "";
            }
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function moreInfo(index) {
    var webMethod = "ProjectServices.asmx/LoadRequests";
    var parameters = "{}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var Requests = msg.d;
            console.log(Requests);
            /*let li = document.getElementById(index);
            let p = document.createElement('p');

            console.log(Requests[index].request);
            p.innerHTML = 'Message from User: ' + Requests[index].request;
            li.appendChild(p);*/

            document.getElementById("fname").value = Requests[index].fname;
            document.getElementById("lname").value = Requests[index].lname;
            document.getElementById("dep").value = Requests[index].department;
            document.getElementById("role").value = Requests[index].role;
            document.getElementById("myers").value = Requests[index].mb;
            document.getElementById("disc").value = Requests[index].disc;
            document.getElementById("resume").setAttribute("href", Requests[index].resume);
            document.getElementById("linkedin").setAttribute("href", Requests[index].linkedin);
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function fullMentee(index) {
    console.log(index);
    var availableMentees;
    var webMethod = "ProjectServices.asmx/ListMentees";
    var parameters = "{}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (mentees) {
            availableMentees = mentees.d;
            console.log(availableMentees);

            div = document.getElementById('fullMentee');
            div.style.display = 'block';

            // name = document.getElementById('fullname');
            job = document.getElementById('job');
            mb = document.getElementById('mb');
            email = document.getElementById('email');

            console.log(availableMentees);
            console.log(availableMentees[index]);

            document.getElementById('fullname').innerHTML = availableMentees[index].fname + ' ' + availableMentees[index].lname;
            job.innerHTML = availableMentees[index].department + ' - ' + availableMentees[index].role;
            mb.innerHTML = availableMentees[index].mb;
            document.getElementById('menteeDisc').innerHTML = availableMentees[index].disc;
            email.innerHTML = availableMentees[index].email;
            email.href = 'mailto:' + availableMentees[index].email;

            buttonDiv = document.getElementById('buttonDiv');
            buttonDiv.innerHTML = '<button id="connectButton" type="button" onclick="connectMentee(' + availableMentees[index].id + ')">Connect with ' +
                availableMentees[index].fname + '</button>';
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
            console.log(e.responseText);
        }
    });
    
}

function acceptRequest(id) {
    var webMethod = "ProjectServices.asmx/AcceptRequest";
    var parameters = "{\"mentorId\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            MentorProfile();
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });

}

function rejectRequest(id) {
    var webMethod = "ProjectServices.asmx/RejectRequest";
    var parameters = "{\"mentorId\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            loadRequests();
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function becomeMentor() {
    var webMethod = "ProjectServices.asmx/RequestBecomeMentor";
    var parameters = "{}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            alert("Request Sent to Admin!");
            console.log("Request sent to admin");
            var a = document.getElementById('requestMentor');
            a.innerHTML = "Pending Mentor Request";
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
            console.log(e.responseText);
        }
    });
}

// loads the requests on the admin side and will accept/reject
function adminRequests() {
    var webMethod = "ProjectServices.asmx/LoadMentorRequests";
    var parameters = "{}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            mentorReq = msg.d;
            console.log(mentorReq);
            document.getElementById('adRequests').style.display = "block";
            document.getElementById('adHeading').style.display = "block";
            var stmt = '';
            ad = document.getElementById('adRequests');

            for (var i = 0; i < mentorReq.length; i++) {
                console.log(mentorReq[i].id)
                stmt = stmt + '<li id="' + i + '">' + ' ' + mentorReq[i].fname + ' ' + mentorReq[i].lname + '<button onclick="acceptMentorRequest(' + mentorReq[i].id + ')">Accept</button><button onclick="rejectMentorRequest(' + mentorReq[i].id + ')">Reject</button></li>';
                console.log(mentorReq[i]);
            }
            console.log(stmt);
            ad.innerHTML = stmt;

            if (mentorReq.length > 0) {
                document.getElementById('adRequests').innerhtml = mentorReq.length + " New Requests to be a Mentor";
                document.getElementById('adHeading').innerHTML = "New Requests to be a Mentor";
            }
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

// admin accepts request from user to be a mentor and changes value of mentor in DB to 1
function acceptMentorRequest(id) {
    var webMethod = "ProjectServices.asmx/AcceptMentorRequest";
    var parameters = "{\"ID\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            alert('Accepted');
            adminRequests();

        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function rejectMentorRequest(id) {
    var webMethod = "ProjectServices.asmx/RejectMentorRequest";
    var parameters = "{\"ID\":\"" + encodeURI(id) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            alert('Rejected');
            adminRequests();
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}


function getAccounts() {
    console.log("in function");
    var webMethod = "ProjectServices.asmx/GetAccounts";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg.d);
            if (msg.d.length > 0) {
                //let's put our accounts that we get from the
                //server into our accountsArray variable
                //so we can use them in other functions as well
                var accountsArray = msg.d;
                console.log(accountsArray);
                //this clears out the div that will hold our account info
                $("#admin").empty();
                var z = document.getElementById("Profile");
                z.style.display = "none";
                var a = document.getElementById('iFrame');
                a.style.display = "none";
                var b = document.getElementById('report');
                b.style.display = "none";
                var c = document.getElementById('admin');
                c.style.display = "block";
                var z = document.getElementById("menteeDiv");
                z.style.display = "none";
                var m = document.getElementById("fullMentee");
                m.style.display = "none";
                //again, we assume we're not an admin unless we see data from the server
                //that we know only admins can see
                admin = false;
        
                var labels = "<table class = 'labelTable'><th><td>" + "Staff Id" + "</td>" + "<td>" + "Last Name " + "</td>" + "<td>" + "First Name" + "</td>" + "<td>" + "Email" + "</td>" + "<td>" + "Password" + "</td>" + "<td>" + "Deparment" + "</td>" + "<td>" + "Staff Title" + "</td>" + "<td>" + "Mentor ID" + "</td>" + "<td>" + "Myer Briggs" + "</td>" + "<td>" + "DISC" + "</td>" +"</th></table>";
                $("#admin").append(labels);

                console.log('right before for loop');
                for (var i = 0; i < accountsArray.length; i++) {
                    console.log('in for loop');
                    //we grab on to a specific html element in jQuery
                    //by using a  # followed by that element's id.
                    //if they have access to admin-level info (like userid and password) then
                    //create output that has an edit option
                    if (accountsArray[i].id != null) {
                        acct = "<div class='accountRow' id='acct" + accountsArray[i].id + "'>" + " " + "<table class = 'accountTable'>"
                            + "<td>" + accountsArray[i].id + "</td>" + "<td>" + accountsArray[i].lname + "</td>" + "<td>" + accountsArray[i].fname + "</td>" +
                            "<td>" + accountsArray[i].email + "</td> " + "<td>" + accountsArray[i].pass + "</td>" +
                            "<td>" + accountsArray[i].department + "</td>" + "<td>" + accountsArray[i].role + "</td>" +
                            "<td>" + accountsArray[i].mid + "</td>" + "<td>" + accountsArray[i].mb + "</td>" +
                            "<td>" + accountsArray[i].disc + "</td>" + "</table></div>"
                        console.log(accountsArray[i].username)
                        admin = true;
                    }
                    else {
                        " "
                    }
 

                    $("#admin").append(
                        //anything we throw at our panel in the form of text
                        //will be added to the contents of that panel.  Here
                        //we're putting together a div that holds info on the
                        //account as well as an edit link if the user is an admin
                        acct
                    );
                }
                console.log(acct);
                
            }
            adminRequests();
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

function connectMentee(id) {
    var webMethod = "ProjectServices.asmx/RequestMentee";
    var parameters = "{\"menteeId\":\"" + encodeURI(id) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            loadMentees();
            let button = document.getElementById('connectButton');
            button.innerHTML = 'Requested!'
            button.disabled = true;
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
            console.log(e.responseText);
        }
    });
}
