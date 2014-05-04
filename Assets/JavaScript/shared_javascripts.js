function GetDateAndTime(){
    var timestamp = new Date().getTime();
    var date = new Date(timestamp);
    var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    var datevalues = [
        date.getFullYear(),
        months[date.getMonth()], // + 1 if in number format
        date.getDate(),
        days[date.getDay()], // + 1 if in number format
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];
    return datevalues;
};

function SetDateAndTime(){
    var DateDiv = document.getElementById("Date");
    var TimeDiv = document.getElementById("Time");
    var TimeStamp = GetDateAndTime();
    var Second = TimeStamp[6];
    var Minute = TimeStamp[5];
    var Hour = TimeStamp[4];
    if (Second.toString().length == 1){
        Second = "0" + Second
    };
    if (Minute.toString().length == 1){
        Minute = "0" + Minute
    };
    if (Hour > 12){
        Hour = (Hour - 12);
    } else if (Hour == 0){
        Hour = 12;
    };
    DateDiv.innerHTML = TimeStamp[3] + ", " + TimeStamp[1] + " " + TimeStamp[2] + ", " + TimeStamp[0];
    TimeDiv.innerHTML = Hour + ":" + Minute + ":" + Second;
    setTimeout(function(){
        setTimeout(SetDateAndTime(), 1);
    }, 1);
};

function DetectDevice(){
    var NavUserAgent = navigator.userAgent;
    var isMobile = {
        Android: function(){
            return NavUserAgent.match(/Android/i);
        },
        BlackBerry: function(){
            return NavUserAgent.match(/BlackBerry/i);
        },
        iOS: function(){
            return NavUserAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function(){
            return NavUserAgent.match(/Opera Mini/i);
        },
        Windows: function(){
            return NavUserAgent.match(/IEMobile/i);
        },
        Any: function(){
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        },
        Type: function(){
            return ((isMobile.Android() && 'Android') || (isMobile.BlackBerry() && 'BlackBerry') || (isMobile.iOS() && 'iOS') || (isMobile.Opera() && 'Opera') || (isMobile.Windows() && 'Windows') || "Desktop");
        }
    };
    return isMobile;
};

function SetDeviceDisplay(){
    var DeviceInformationDiv = document.getElementById('DeviceInformation');
    var DeviceTypeDiv = document.getElementById("DeviceType");
    DeviceTypeDiv.innerHTML = DetectDevice().Type();
};

function CreateCookie(name, value, days, secure){
    var secured = "";
    if (secure){
        secured = secured + "; secure";
    };
    if (days){
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires="+date.toGMTString();
    }
    else {
        var expires = "";
    };
    var CookieValue = name + "=" + value + expires + "; path=/;" + secured;
    document.cookie = CookieValue;
};

function ReadCookie(name){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0){
            return c.substring(nameEQ.length,c.length);
        };
    }
    return null;
};

function EraseCookie(name){
    CreateCookie(name, "", -1);
};

function iFrameOnly(){
	if (self == top){
		window.location.replace("../index.html")
	};
};

function LoadDateAndTime(){
    var DeviceInformationDiv = document.getElementById('DeviceInformation');
    if (DeviceInformationDiv){
        SetDateAndTime();
        SetDeviceDisplay();
    }
    else {
        setTimeout(LoadDateAndTime(), 10000);
    };
};

function CollapseComments(){
    var UpCaret = "&#9650;";
    var DownCaret = "&#9660;";
    var ToggleComments = document.getElementById('ToggleComments');
    ToggleComments.innerHTML = DownCaret;
    animatedcollapse.addDiv('Comments', 'fade=1;')
    animatedcollapse.ontoggle=function($, divobj, state){ //fires each time a DIV is expanded/contracted
        //$: Access to jQuery
        //divobj: DOM reference to DIV being expanded/ collapsed. Use "divobj.id" to get its ID
        //state: "block" or "none", depending on state
        if (state == "block"){
            ToggleComments.innerHTML = UpCaret;
            window.scrollTo(document.body.scrollLeft, document.body.scrollHeight);
        }
        else {
            ToggleComments.innerHTML = DownCaret;
        };
    };
    animatedcollapse.init();
};

function ImagePreview(PreviewImage, FileInput){
    var oFReader = new FileReader();
    var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    oFReader.onload = function(oFREvent){
        PreviewImage.src = oFREvent.target.result;
    };
    FileInput.onchange = function(){
        var filepath = FileInput.value;
        var startIndex = (filepath.indexOf('\\') >= 0 ? filepath.lastIndexOf('\\') : filepath.lastIndexOf('/'));
        var filename = filepath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        PreviewImage.alt = filename;
        if (FileInput.files.length === 0){
            return;
        };
        var oFile = FileInput.files[0];
        if (!rFilter.test(oFile.type)){
            alert("You must select a valid image file!");
            return;
        };
        oFReader.readAsDataURL(oFile);
    };
};

function DownloadImage(Url, Name){
    if (Url != document.URL){
        var link = document.createElement("a");
        link.download = Name;
        link.href = Url;
        link.click();
    };
};

function SetPreviewImage(Src, Name){
    var PreviewImage = document.getElementById("PreviewImage");
    PreviewImage.src = Src;
    if (PreviewImage.src.indexOf("data:") < 0){
        PreviewImage.src = ""
    };
    PreviewImage.alt = Name;
};

function SetBackgroundImage(Src, Name){
    var BackgroundImage = document.getElementById("BackgroundImage");
    BackgroundImage.src = Src;
    if (BackgroundImage.src.indexOf("data:") < 0){
        BackgroundImage.src = ""
    };
    BackgroundImage.alt = Name;
};

function CloseBackgroundImagePanel(){
    var BackgroundSettingsFrame = document.getElementById('BackgroundSettingsFrame')
    var BackgroundImage = document.getElementById("BackgroundImage");
    var PreviewImage = document.getElementById("PreviewImage");
    BackgroundSettingsFrame.style.display = 'none';
    SetPreviewImage(BackgroundImage.src, BackgroundImage.alt);
};

function SaveBackground(){
    var BackgroundImage = document.getElementById("BackgroundImage");
    var BackgroundImageSrc = BackgroundImage.src
    if (BackgroundImageSrc.indexOf("data:") < 0){
        BackgroundImageSrc = ""
    };
    EncodedData = encodeURIComponent(BackgroundImageSrc + "|" + BackgroundImage.alt);
//    alert(EncodedData);
    CreateCookie("BackgroundImage", EncodedData, 365, false);
  //  alert(ReadCookie("BackgroundImage"));
};

function LoadBackground(){
    var BackgroundImage = document.getElementById("BackgroundImage");
    var PreviewImage = document.getElementById("PreviewImage");
    var BackgroundData = ReadCookie("BackgroundImage");
    var CookieValues = decodeURIComponent(BackgroundData.split("|"));
    alert("A " + CookieValues[0]);
    alert("B " + CookieValues[1]);
    SetPreviewImage(CookieValues[0], CookieValues[1]);
};
    