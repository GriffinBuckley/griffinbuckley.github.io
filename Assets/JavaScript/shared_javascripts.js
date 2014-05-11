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
        PreviewImage.src = "";
    };
    PreviewImage.alt = Name;
};

function SetBackgroundImage(Src, Name){
    var BackgroundSettingsFrame = document.getElementById('BackgroundSettingsFrame');
    var BackgroundImage = document.getElementById("BackgroundImage");
    var BackgroundImageBlur = document.getElementById("BackgroundImageBlur");
    BackgroundImage.src = Src;
    if (BackgroundImage.src.indexOf("data:") < 0){
        BackgroundImage.src = "";
    };
    BackgroundImage.alt = Name;
    if (BackgroundImage.src == document.URL){
        BackgroundImage.style.display = "none";
    }
    else {
        BackgroundImage.style.display = "block";
    };
    if (BackgroundSettingsFrame.style.display == "block" && BackgroundImage.style.display != "none"){
        SetBackgroundImageBlur();
    }
    else {
        BackgroundImageBlur.style.display = "none";
    };
};

function SetBackgroundImageBlur(){
    var BackgroundImage = document.getElementById("BackgroundImage");
    var BackgroundImageBlur = document.getElementById("BackgroundImageBlur");
    BackgroundImageBlur.src = BackgroundImage.src;
    BackgroundImage.style.display = "none";
    BackgroundImageBlur.style.display = "block";
};

function OpenBackgroundImagePanel(){
    var BackgroundSettingsFrame = document.getElementById('BackgroundSettingsFrame');
    BackgroundSettingsFrame.style.display = "block";
    SetBackgroundImageBlur();
};

function CloseBackgroundImagePanel(){
    var BackgroundSettingsFrame = document.getElementById('BackgroundSettingsFrame');
    var BackgroundImage = document.getElementById("BackgroundImage");
    BackgroundSettingsFrame.style.display = "none";
    SetBackgroundImage(BackgroundImage.src, BackgroundImage.alt);
    SetPreviewImage(BackgroundImage.src, BackgroundImage.alt);
};

function SaveBackground(){
    var BackgroundImage = document.getElementById("BackgroundImage");
    var BackgroundImageSrc = BackgroundImage.src;
    if (BackgroundImageSrc.indexOf("data:") < 0){
        BackgroundImageSrc = "";
    };
    var EncodedBackgroundImage = encodeURIComponent(BackgroundImageSrc);
    localStorage.setItem("BackgroundImage", EncodedBackgroundImage);
    localStorage.setItem("BackgroundName", BackgroundImage.alt);
};

function LoadBackground(LoadBackgroundImage){
    if (localStorage.getItem("BackgroundImage")){
        var BackgroundSettingsFrame = document.getElementById('BackgroundSettingsFrame');
        var ImageInput = document.getElementById("ImageInput");
        var BackgroundImage = decodeURIComponent(localStorage.getItem("BackgroundImage"));
        var BackgroundName = decodeURIComponent(localStorage.getItem("BackgroundName"));
        SetPreviewImage(BackgroundImage, BackgroundName);
        ImageInput.value = "";
    };
    if (LoadBackgroundImage){
        SetBackgroundImage(BackgroundImage, BackgroundName);
     };
};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-50827811-1', 'griffinbuckley.github.io');
ga('send', 'pageview');