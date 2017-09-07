var TalentSearch = TalentSearch || {};

TalentSearch.SelectionController = function () {
    this.$page = null;
    this.$btnSubmit = null;
    this.$txtDate = null;
    this.$txtTurnout = null;
    this.$txtSelected = null;
    this.$txtWomen = null;
    this.$txtComments = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.SelectionController.prototype.init = function () {
    this.$page = $("#page-selection");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$txtDate = $("#txt-date", this.$page);
    this.$txtTurnout = $("#txt-turnout", this.$page);
    this.$txtSelected= $("#txt-selected", this.$page);
    this.$txtWomen = $("#txt-women", this.$page);
    this.$txtComments = $("#txt-comments", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-selection";
};


TalentSearch.SelectionController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    
    this.$txtDate.removeClass(invalidInputStyle);
    this.$txtTurnout.removeClass(invalidInputStyle);
    this.$txtSelected.removeClass(invalidInputStyle);
    this.$txtWomen.removeClass(invalidInputStyle);
    this.$txtComments.removeClass(invalidInputStyle);
    
   
    this.$txtDate.val("");
    this.$txtTurnout.val("");
    this.$txtSelected.val("");
    this.$txtWomen.val("");
    this.$txtComments.val("");
    
    
};

TalentSearch.SelectionController.prototype.onSignInCommand = function () {

    var me = this,
        txtDate = me.$txtDate.val().trim(),
        txtTurnout = me.$txtTurnout.val().trim(),
        txtSelected = me.$txtSelected.val().trim(),
        txtWomen = me.$txtWomen.val().trim(),
        txtComments = me.$txtComments.val().trim(),
       
        btnSubmit = me.$btnSubmit,
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";
                
    // Reset styles.
    me.$txtDate.removeClass(invalidInputStyle);
    me.$txtTurnout.removeClass(invalidInputStyle);
    me.$txtSelected.removeClass(invalidInputStyle);
    me.$txtWomen.removeClass(invalidInputStyle);
    me.$txtComments.removeClass(invalidInputStyle);
    me.$ctnErr.html("");
    // Flag each invalid field.
    if (txtDate.length === 0) {
        me.$txtDate.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtDate === 'dd-mm-yyyy') {
        me.$txtDate.addClass(invalidInputStyle);
        invalidInput = true;
    }
    
    if (txtSelected.length === 0) {
        me.$txtSelected.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtWomen.length === 0) {
        me.$txtWomen.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtTurnout.length === 0) {
        me.$txtTurnout.addClass(invalidInputStyle);
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

    
$("#table-data tr:last td:not(:first,:last)").text(function(i){
    var t = 0;
    $(this).parent().prevAll().find("td:nth-child("+(i + 2)+")").each(function(){
        t += parseInt( $(this).text(), 10 ) || 0;
    });
    return "Total: " + t;
});