/* global fetch */

APIEndpoint = './sampledata/';
APPBase = '';
ApplicationName = "Smart Systems App";
LogoURL = "./images/logo.png";
ReverseLogoURL = "./images/logo-rev.png";
//ServerURL = "http://185.223.30.230:5000";
ServerURL = "http://localhost:9000";
IconURL = "./images/icon.png";

function APICall(url = ``, data = {}, method='POST', contentType = "application/json") {
//    console.log("url::: "+url);
//    console.log("data::: "+data);
//    console.log("data::: "+data.organizationId);
//    console.log("method::: "+method);
//    console.log("contentType::: "+contentType);
    /*//console.log("parentId::: "+data.parentId);
    //console.log("name::: "+data.name);
    //console.log("icon::: "+data.icon);
    console.log("url::: "+url);
    console.log("method::: "+method);
    console.log("contentType::: "+contentType);
    console.log("data::: "+data);
    console.log("JSON.stringify(data)::: "+JSON.stringify(data));
    console.log("data.fileUpload::: "+JSON.stringify(data.fileUpload));*/
    // Default options are marked with *
    if(!sessionStorage.getItem("token") && window.location.pathname.toLowerCase().indexOf("user-login")<0 ){
        sessionStorage.clear();
        //MessageAlert("success", "Authentication failed!!!", "Authentication");
        window.location.href = "./user-login";
    }
    
    if(sessionStorage.getItem("token")===null){
        sessionStorage.setItem("token", "");
        url = ServerURL + url;
    }else{
        if(url.indexOf("json")>0){
            url = APIEndpoint + url;
        }else{
            url = ServerURL + url;
        }
    }
    
//console.log("1. data  "+data);    
    data = (((method==='POST' || method==='PUT' || method==='DELETE') && contentType !== "multipart/form-data, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ? JSON.stringify(data) : data);
    if(method==='GET'){
        data = null;
    }
/*//return fetch(APIEndpoint+ url, {*/
//console.log("1. data  "+data);    
//console.log("2. contentType  "+contentType);    
//console.log("3. url  "+url);    
//console.log("4. method  "+method);
//console.log("5. token  "+sessionStorage.getItem("token"));
    return fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        withCredentials: true,
        credentials: "include", // *include, same-origin, omit
        headers: new Headers({
            'Accept': "*/*", //contentType,
            'Authorization': 'Bearer '+(sessionStorage.getItem("token")),
            'Content-Type': contentType,
            'Connection': 'keep-alive',
            'Accept-Encoding': 'gzip, deflate, br'
        }),
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: data // body data type must match "Content-Type" header
        //body: JSON.stringify(data) // body data type must match "Content-Type" header
     })
    .then(function(response)  {
//console.log("response: "+JSON.stringify(response));
        var dataReturned =response.clone().json();
        FilterResponse(dataReturned);
        return response.json();
    })
    .catch(error => {
        console.error(error);
        //this.setState({ loading: false });
    });
}


FilterResponse = function(obj){
    obj.then(data=>{
        //sanitize here
        if(data){
            if(data.data){
                if(data.data === "token error"){
                    sessionStorage.clear();
                    window.location.href = "./user-login";
                }
            }
        }
    });
};

MessageAlert = function(type, msg, title = ""){
    var msgObj = {title: title, message: msg, position: "topCenter"};
    if(type === "info"){
        iziToast.info(msgObj);    
    }
    else if(type === "success"){
        iziToast.success(msgObj);    
    }
    else if(type === "warning"){
        iziToast.warning(msgObj);    
    }
    else if(type === "error"){
        iziToast.error(msgObj);    
    }else{
        iziToast.show(msgObj);
    }
}

  function Numberformat(value, fractions){
      if(!fractions){
          fractions = 0;
      }
    return value.toLocaleString(navigator.language, { minimumFractionDigits: fractions });
  }

  RegularizeDate = function (datestr) {
    try {
        return new Date(parseInt(datestr.substr(6)));
    } catch (e) {
        return "";
    }
};

ToReadableDate = function (datestr) {
    return datestr.toString("d/M/yyyy");
};

ShowModal = function (modal_id) {
    $('#' + modal_id).modal("show");
};

HideModal = function (modal_id) {
    $('#' + modal_id).modal("hide");
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function GetFormattedDate(textval){
    try {
        var date = new Date(textval);
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        return [pad_with_zeroes(day,2), pad_with_zeroes(month,2), year].join('/');
    }    
    catch(e){
        return "";
    }
}

function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;
}

_DatatableObject = null;

function isURL(str) {
    return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str); 
  }

  function isObject(obj) {
    return obj === Object(obj);
  }