var TalentSearch = TalentSearch || {};

TalentSearch.VenueController = function () {

    this.$page = null;
    this.$btnSubmit = null;
    this.$txtVenueName = null;
    this.$txtLocation = null;
    this.$txtDateFrom = null;
    this.$txtDateTo = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.VenueController.prototype.init = function () {
    this.$page = $("#page-venue");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$txtVenueName = $("#txt-venue-name", this.$page);
    this.$txtLocation = $("#txt-location", this.$page);
    this.$txtDateFrom = $("#txt-date-from", this.$page);
    this.$txtDateTo = $("#txt-date-to", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-venue";
};


TalentSearch.VenueController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    

    
    this.$txtVenueName.removeClass(invalidInputStyle);
    this.$txtLocation.removeClass(invalidInputStyle);
    this.$txtDateFrom.removeClass(invalidInputStyle);
    this.$txtDateTo.removeClass(invalidInputStyle);
   
   
    this.$txtVenueName.val("");
    this.$txtLocation.val("");
    this.$txtDateFrom.val("");
    this.$txtDateTo.val("");
      
};

TalentSearch.VenueController.prototype.onSignInCommand = function () {

    var me = this,
        txtVenueName = me.$txtVenueName.val().trim(),
        txtLocation = me.$txtLocation.val().trim(),
        txtDateFrom = me.$txtDateFrom.val().trim(),
        txtDateTo = me.$txtDateTo.val().trim(),
        
        btnSubmit = me.$btnSubmit,
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$txtVenueName.removeClass(invalidInputStyle);
    me.$txtLocation.removeClass(invalidInputStyle);
    me.$txtDateFrom.removeClass(invalidInputStyle);
    me.$txtDateTo.removeClass(invalidInputStyle);
    me.$ctnErr.html("");
    // Flag each invalid field.
    if (txtVenueName.length === 0) {
        me.$txtVenueName.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtLocation.length === 0) {
        me.$txtLocation.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtDateFrom.length === 0) {
        me.$txtLocation.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtDateTo.length === 0) {
        me.$txtLocation.addClass(invalidInputStyle);
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