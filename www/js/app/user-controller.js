var TalentSearch = TalentSearch || {};

TalentSearch.UserController = function () {

    this.$page = null;
    this.$btnSubmit = null;
    this.$selectVenueId = null;
    this.$txtUser = null;
    this.$selectStatus = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.UserController.prototype.init = function () {
    this.$page = $("#page-user");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$selectVenueId = $("#select-venue", this.$page);
    this.$txtUser = $("#txt-user", this.$page);
    this.$selectStatus = $("#select-status", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-user";
};


TalentSearch.UserController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    
    this.$selectVenueId.removeClass(invalidInputStyle);
    this.$txtUser.removeClass(invalidInputStyle);
    this.$selectStatus.removeClass(invalidInputStyle);
    
    
    this.$txtUser.val("");
    this.$selectVenueId.val("");
    this.$selectStatus.val("");
    
};

TalentSearch.UserController.prototype.onSignInCommand = function () {

    var me = this,
    txtUser = me.$txtUser.val().trim(),
    selectVenueId = me.$selectVenueId.val(),
    selectStatus = me.$selectStatus.val(),
    btnSubmit = me.$btnSubmit,
    invalidInput = false,
    invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$txtUser.removeClass(invalidInputStyle);
    me.$selectVenueId.removeClass(invalidInputStyle);
    me.$selectStatus.removeClass(invalidInputStyle);
    me.$ctnErr.html("");
    // Flag each invalid field.
    if (txtUser.length === 0) {
        me.$txtUser.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (selectVenueId === '') {
        me.$selectVenueId.addClass(invalidInputStyle);
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