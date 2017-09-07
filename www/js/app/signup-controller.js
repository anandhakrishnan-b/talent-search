var TalentSearch = TalentSearch || {};

TalentSearch.SignInController = function () {

    this.$signIn = null;
    this.$btnSubmit = null;
    this.$txtUserId = null;
    this.$txtPassword = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.SignInController.prototype.init = function () {
    this.$signIn = $("#page-signin");
    this.$btnSubmit = $("#btn-submit", this.$signIn);
    this.$txtUserId = $("#txt-userId", this.$signIn);
    this.$txtPassword = $("#txt-password", this.$signIn);
    this.$ctnErr = $("#ctn-err", this.$signIn);
    this.mainMenuPageId = "#page-signin";
};

TalentSearch.SignInController.prototype.preCheck = function () {
    if(window.sessionStorage.getItem("sessionTime") !=null) {
        var sessionTime = window.sessionStorage.getItem("sessionTime");
        var now = new Date().getTime();
        if(now > sessionTime){
            window.sessionStorage.removeItem("sessionId");
            window.sessionStorage.removeItem("sessionTime");
            window.sessionStorage.removeItem("role");
            $.mobile.navigate("#page-signin");
       }
  
    }else{
        window.sessionStorage.removeItem("sessionId");
        window.sessionStorage.removeItem("sessionTime");
        window.sessionStorage.removeItem("role");
        $.mobile.navigate("#page-signin");
    }
}


TalentSearch.SignInController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    

    this.$txtUserId.removeClass(invalidInputStyle);
    this.$txtPassword.removeClass(invalidInputStyle);
   
   
    this.$txtUserId.val("");
    this.$txtPassword.val("");
    
};

TalentSearch.SignInController.prototype.onSignInCommand = function () {

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
    
    $.mobile.loading("show");
    //window.sessionStorage.setItem("hello", "sessionId");
    //alert(window.sessionStorage.getItem("hello"));
    //btnSubmit.
    $.ajax({
        type: 'POST',
        url: TalentSearch.Settings.signInUrl,
        cache : false,
        dataType: 'json',
        async: false,
       // headers: {
          //  "Authorization": "Basic " + btoa(txtUserId + ":" + txtPassword)
        //},
        data: '{ "comment" }',
        success: function (resp) {
            $.mobile.loading("hide");
            if (resp.success === true) {
                $.mobile.navigate("#page-home");
                var today = new Date();
                var expirationDate = new Date();
                expirationDate.setTime(today.getTime() + TalentSearch.Settings.sessionTimeoutInMSec);
                TalentSearch.Session.getInstance().set({
                    userProfileModel: resp.extras.userProfileModel,
                    sessionId: resp.extras.sessionId,
                    expirationDate: expirationDate                    
                });

                return;
            } else {
                if (resp.extras.msg) {
                    switch (resp.extras.msg) {
                        case TalentSearch.ApiMessages.SERVER_ERROR:
                            me.$ctnErr.html("<div class='error'>Oops! TalentSearch had a problem and could not process your request.  Please try again in a few minutes.</div>");
                            me.$ctnErr.addClass("bi-ctn-err").slideDown();
                            break;
                        case TalentSearch.ApiMessages.INVALID_CREDENTIALS:
                            me.$ctnErr.html("<div class='error'>The email address that you provided is already registered.</div");
                            me.$ctnErr.addClass("bi-ctn-err").slideDown();
                            me.$txtEmailAddress.addClass(invalidInputStyle);
                            break;
                    }
                }
            }
        },
        error: function (e) {
            $.mobile.loading("hide");
            console.log(e.message);
            me.$ctnErr.html("<div class='error'>Oops! TalentSearch had a problem and could not process your request.  Please try again in a few minutes.</div>");
            me.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    });
};