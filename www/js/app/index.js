var TalentSearch = TalentSearch || {};

// Begin boilerplate code generated with Cordova project.

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", function(e){
            if($.mobile.activePage.is('#page-signin')){
                /* 
                 Event preventDefault/stopPropagation not required as adding backbutton
                  listener itself override the default behaviour. Refer below PhoneGap link.
                */
                //e.preventDefault();
                navigator.app.exitApp();
            }
            else {
                navigator.app.backHistory()
            }
            }, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

// End boilerplate code.

$(document).on("mobileinit", function (event, ui) {
    $.mobile.defaultPageTransition = "slide";
});



app.signInController = new TalentSearch.SignInController();
app.venueController = new TalentSearch.VenueController();
app.selectionController = new TalentSearch.SelectionController();
app.interviewerController = new TalentSearch.InterviewerController();
//$(document).delegate("#page-signup", "pagebeforeshow", function () {
//    // Reset the signup form.
//    app.signInController.resetSignUpForm();
//});

$(document).on("pagecontainerbeforeshow", function (event, ui) {
    if (typeof ui.toPage == "object") {
        switch (ui.toPage.attr("id")) {
            case "page-signin":
                // Reset the signup form.
                app.signInController.resetSignInForm();
                break;
        }
    }
});

$(document).on("pagebeforechange", function (event, ui) {
    if (typeof ui.toPage == "object") {
        switch (ui.toPage.attr("id")) {
            case "page-venue":
                //app.signInController.sessionCheck(event, ui);
                break;
            case "page-selection":
                //app.signInController.sessionCheck(event, ui);
                break;
            case "page-interviewer":
                //app.signInController.sessionCheck(event, ui);
                break;
        }
    }
});


$(document).delegate("#page-signin", "pagebeforecreate", function () {

    app.signInController.init();

    app.signInController.$btnSubmit.off("tap").on("tap", function () {
        app.signInController.onSignInCommand();
    });

});

$(document).delegate("#page-venue", "pagebeforecreate", function () {

    app.venueController.init();

    app.venueController.$btnSubmit.off("tap").on("tap", function () {
        app.venueController.onSignInCommand();
    });

});

$(document).delegate("#page-selection", "pagebeforecreate", function () {

    app.selectionController.init();

    app.selectionController.$btnSubmit.off("tap").on("tap", function () {
        app.selectionController.onSignInCommand();
    });

});
$(document).delegate("#page-interviewer", "pagebeforecreate", function () {

    app.interviewerController.init();

    app.interviewerController.$btnSubmit.off("tap").on("tap", function () {
        app.interviewerController.onSignInCommand();
    });

});


$(document).on("click", "#page-home .logout", function() {
    window.sessionStorage.removeItem("sessionId");
    window.sessionStorage.removeItem("sessionTime");
    window.sessionStorage.removeItem("role");
    $.mobile.changePage("#page-signin", "slide", true, true);
});