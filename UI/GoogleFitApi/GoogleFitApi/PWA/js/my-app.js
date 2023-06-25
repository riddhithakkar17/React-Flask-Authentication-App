var app = new Framework7({
    // App root element
    el: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.siliconmenu.pwa',
    // Enable swipe panel
    material: true,
    routes: [
        {
            name: 'index',
            path: '/index/',
            url: '/index.html'
        },
        {
            name: 'about',
            path: '/about/',
            url: '/pages/About.html'
        },
        {
            name: 'login',
            path: '/login/',
            url: '/pages/login.html'
        },
        {
            name: 'register',
            path: '/register/',
            url: '/pages/register.html'
        }
    ]
});



var panel = app.panel.create({
    el: '.MainMenu'
    //swipe: true
});

var mainView = app.views.create('.view-main');

var elem = document.documentElement;

function NavTo(url) {
    mainView.router.navigate(url);
}

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

// Handle The Browser Back BTN
window.onload = function () {
    if (typeof history.pushState === "function") {
        history.pushState("jibberish", null, null);
        window.onpopstate = function () {
            history.pushState('newjibberish', null, null);
            if ($('.popup.modal-in').length > 0) {
                app.popup.close();
            }
            else {
                if (LatestPageName == 'index') {
                    location.reload();
                }
                else if (LatestPageName == 'waittobeready') {
                    NavTo('/index/');
                }
                else {
                    mainView.router.back();
                }
            }
            // Handle the back (or forward) buttons here
            // Will NOT handle refresh, use onbeforeunload for this.
        };
    }
    else {
        var ignoreHashChange = true;
        window.onhashchange = function () {
            if (!ignoreHashChange) {
                ignoreHashChange = true;
                window.location.hash = Math.random();
                // Detect and redirect change here
                // Works in older FF and IE9
                // * it does mess with your hash symbol (anchor?) pound sign
                // delimiter on the end of the URL
            }
            else {
                ignoreHashChange = false;
            }
        };
    }
}

function ViewMainPage()
{
    $('#JoinNow').fadeOut();
}


function PostObject(Method, dataobj) {
    let objToPost = new Object();
    objToPost.RequestModel = dataobj;
    objToPost.AppVersion = AppVersion;
    objToPost.Lang = Lang;
    ShowLoading();
    $.ajax({
        type: "POST",
        url: "/api/PWA/" + Method,
        data: JSON.stringify(objToPost),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        cache: false,
        success: function (msg) {
            HideLoading();
            if (msg.Success == undefined) {
                ParseDataResult(Method, msg);
            }
            else if (msg.Success) {
                ParseDataResult(Method, msg);
            }
            else {
                ShowErrorMessage(msg.ErrorMessage);
            }
        },
        error: function (msg) {

        }
    });
}

function PostObjectWithToken(Method, dataobj) {
    let objToPost = new Object();
    objToPost.RequestModel = dataobj;
    objToPost.AppVersion = AppVersion;
    objToPost.Lang = Lang;
    ShowLoading();
    $.ajax({
        type: "POST",
        url: "/api/PWA/" + Method,
        data: JSON.stringify(objToPost),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        cache: false,
        headers: {
            'Auth': Token
        },
        success: function (msg) {
            HideLoading();
            if (msg.Success == undefined) {
                ParseDataResult(Method, msg);
            }
            else if (msg.Success) {
                ParseDataResult(Method, msg);
            }
            else {
                ShowErrorMessage(msg.ErrorMessage);
            }
        },
        error: function (msg) {

        }
    });
}

function ShowErrorMessage(ErrorMessage) {
    AlertX(ErrorMessage, 'Error');
}

function SendGetRequest(MethodName, QueryString) {
    let ur = MethodName;
    if (QueryString != "") {
        ur += "?" + QueryString;
    }
    ShowLoading();
    $.ajax({
        type: "GET",
        url: "/api/PWA/" + ur,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        cache: false,
        success: function (msg) {
            HideLoading();
            ParseDataResult(MethodName, msg);
        },
        error: function (msg) {

        }
    });
}

function SendGetRequestWithToken(MethodName, QueryString) {

    let ur = MethodName;
    if (QueryString != "") {
        ur += "?" + QueryString;
    }
    ShowLoading();
    $.ajax({
        type: "GET",
        url: "/api/PWA/" + ur,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        cache: false,
        headers: {
            'Auth': Token
        },
        success: function (msg) {
            HideLoading();
            ParseDataResult(MethodName, msg);
        },
        error: function (msg) {

        }
    });
}

function ParseDataResult(MethodName, Data) {
    if (MethodName == 'GetDesk') {

    }

}