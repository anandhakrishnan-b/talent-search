var TalentSearch = TalentSearch || {};

TalentSearch.InterviewerController = function () {

    this.$page = null;
    this.$btnSubmit = null;
    this.$txtInterviewerName = null;
    this.$txtEmployeeId = null;
    this.$txtRole = null;
    this.$txtDate = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.InterviewerController.prototype.init = function () {
    this.$page = $("#page-interviewer");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$txtInterviewerName = $("#txt-interviewer-name", this.$page);
    this.$txtEmployeeId = $("#txt-employee-id", this.$page);
    this.$txtRole = $("#txt-role", this.$page);
    this.$txtDate = $("#txt-date", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-interviewer";
};


TalentSearch.InterviewerController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    
    
    this.$txtInterviewerName.removeClass(invalidInputStyle);
    this.$txtEmployeeId.removeClass(invalidInputStyle);
    this.$txtRole.removeClass(invalidInputStyle);
    this.$txtDate.removeClass(invalidInputStyle);
   
   
    this.$txtInterviewerName.val("");
    this.$txtEmployeeId.val("");
    this.$txtRole.val("");
    this.$txtDate.val("");
    
};

TalentSearch.InterviewerController.prototype.onSignInCommand = function () {

    var me = this,
        txtInterviewerName = me.$txtInterviewerName.val().trim(),
        txtEmployeeId = me.$txtEmployeeId.val().trim(),
        txtRole = me.$txtRole.val().trim(),
        txtDate = me.$txtDate.val().trim(),
        
        btnSubmit = me.$btnSubmit,
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$txtInterviewerName.removeClass(invalidInputStyle);
    me.$txtEmployeeId.removeClass(invalidInputStyle);
    me.$txtRole.removeClass(invalidInputStyle);
    me.$txtDate.removeClass(invalidInputStyle);
    me.$ctnErr.removeClass(invalidInputStyle);
    me.$ctnErr.html("");
    // Flag each invalid field.
    if (txtInterviewerName.length === 0) {
        me.$txtUserId.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtEmployeeId.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtRole.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtDate.length === 0) {
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