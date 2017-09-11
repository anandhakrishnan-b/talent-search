var TalentSearch = TalentSearch || {};

TalentSearch.SignInController = function() {

    this.$page = null;
    this.$btnSubmit = null;
    this.$txtUserId = null;
    this.$txtPassword = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.SignInController.prototype.init = function() {
    this.$page = $("#page-signin");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$txtUserId = $("#txt-userId", this.$page);
    this.$txtPassword = $("#txt-password", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-signin";
};

TalentSearch.SignInController.prototype.sessionCheck = function(e, data) {
    console.log(window.sessionStorage.getItem("sessionTime"));
    var today = new Date();
    console.log(today.getTime());
    if (window.sessionStorage.getItem("sessionTime") == null || window.sessionStorage.getItem("sessionTime") != null &&
        window.sessionStorage.getItem("sessionTime") < today.getTime()) {
        console.log("session check 1");
        window.sessionStorage.removeItem("sessionId");
        window.sessionStorage.removeItem("sessionTime");
        window.sessionStorage.removeItem("role");
        window.sessionStorage.removeItem("userId");
        $.mobile.changePage("#page-signin", "slide", true, true);
        this.$ctnErr.html("<div class='error'>Session Timed Out, please login again</div>");
        return false;
    }
    return true;
    console.log("session check 2");
}


TalentSearch.SignInController.prototype.resetSignInForm = function() {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);


    this.$txtUserId.removeClass(invalidInputStyle);
    this.$txtPassword.removeClass(invalidInputStyle);


    this.$txtUserId.val("");
    this.$txtPassword.val("");

};

TalentSearch.SignInController.prototype.onSignInCommand = function() {

    var me = this,
        txtUserId = me.$txtUserId.val().trim(),
        txtPassword = me.$txtPassword.val().trim(),
        btnSubmit = me.$btnSubmit,
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$txtUserId.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);
    me.$ctnErr.html("");
    // Flag each invalid field.
    if (txtUserId.length === 0) {
        me.$txtUserId.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtPassword.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }
    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<div class='error'>Please enter all the required fields.</div>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        return;
    }
    var today = new Date();
    var expirationDate = new Date();

//    window.sessionStorage.setItem("sessionId", Math.floor((1 + Math.random()) * 0x10000).toString(16));
//    window.sessionStorage.setItem("sessionTime", today.getTime() + TalentSearch.Settings.sessionTimeoutInMSec);
//    window.sessionStorage.setItem("role", "1");
//    window.sessionStorage.setItem("userId", "100");
//    $.mobile.changePage("#page-home", "slide", true, true);

    $.mobile.loading("show");
    //window.sessionStorage.setItem("hello", "sessionId");
    //alert(window.sessionStorage.getItem("hello"));
    //btnSubmit.
    $.ajax({
        type: 'POST',
        url: TalentSearch.Settings.signInUrl,
        cache: false,
        dataType: 'json',
        async: false,
        // headers: {
        //  "Authorization": "Basic " + btoa(txtUserId + ":" + txtPassword)
        //},
        data: '{"userName": txtUserId,"password":txtPassword} ',
        success: function(data, textStatus, XMLHttpRequest){
	    $.mobile.loading("hide");	    
	    alert(XMLHttpRequest.getResponseHeader('Authorization'));
            
            window.sessionStorage.setItem("sessionId", XMLHttpRequest.getResponseHeader('Authorization'));
            window.sessionStorage.setItem("sessionTime", today.getTime() + TalentSearch.Settings.sessionTimeoutInMSec);
            window.sessionStorage.setItem("role", "1");
            window.sessionStorage.setItem("userId", XMLHttpRequest.getResponseHeader('userName'));
            return;
        },
        error: function(e) {
            $.mobile.loading("hide");
            console.log(e.message);
            me.$ctnErr.html("<div class='error'>Oops! TalentSearch had a problem and could not process your request.  Please try again in a few minutes.</div>");
            me.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    });
};
