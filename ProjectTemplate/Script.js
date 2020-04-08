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
                loadRequests();
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
            document.getElementById('menteeArea').style.display = "block";
            var q = document.getElementById("Profile");
            q.style.display = "none";

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

            document.getElementById("fname").value = activeUser.fname;
            document.getElementById("lname").value = activeUser.lname;
            document.getElementById("Email").value = activeUser.email;
            document.getElementById("Psw").value = activeUser.pass;
            document.getElementById("dep").value = activeUser.department;
            document.getElementById("role").value = activeUser.role;
            document.getElementById("myers").value = activeUser.mb;
            document.getElementById("disc").value = activeUser.disc;


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
            var e = document.getElementsByTagName("input")
            e.disabled = true;

            document.getElementById("fname").value = mentor.fname;
            document.getElementById("lname").value = mentor.lname;
            document.getElementById("Email").value = mentor.email;
            document.getElementById("Psw").value = mentor.pass;
            document.getElementById("dep").value = mentor.department;
            document.getElementById("role").value = mentor.role;
            document.getElementById("myers").value = mentor.mb;
            document.getElementById("disc").value = mentor.disc;
            

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

            document.getElementById("fname").value = mentee.fname;
            document.getElementById("lname").value = mentee.lname;
            document.getElementById("Email").value = mentee.email;
            document.getElementById("Psw").value = mentee.pass;
            document.getElementById("dep").value = mentee.department;
            document.getElementById("role").value = mentee.role;
            document.getElementById("myers").value = mentee.mb;
            document.getElementById("disc").value = mentee.disc;

        },
        error: function (e) {
            console.log(e.responseText);
            alert("load user error");
        }
    });
}

function loadRequests() {
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
            mentorRequests = msg.d;
            console.log(mentorRequests);
            var stmt
            for (var i = 0; i < mentorRequests.length; i++) {
                stmt = stmt + '<li id="' + i + '"onclick=moreInfo(' + i + ')><h3>' + mentorRequests[i].fname +
                    ' ' + mentorRequests[i].lname + '</h3><button onclick="acceptRequest(' + mentorRequests[i].id +
                    ')">Acccept</button><button onclick="rejectRequest((' + mentorRequests[i].id + ')">Reject</button></li>';

            }
            document.getElementById('mentorList').innerHTML = stmt;
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function moreInfo(index) {
    var Requests;
    var webMethod = "ProjectServices.asmx/LoadRequests";
    var parameters = "{}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            Requests = msg.d;
            console.log(Requests);
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });

    let li = document.getElementById(index);
    let p = document.createElement('p');

    p.innerHTML = 'Message from User: ' + Requests[index].request;
    li.appendChild(p);
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
            alert('ran webmethod at least');
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
            alert('ran webmethod at least');
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}