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
    console.log("sessionTime " + window.sessionStorage.getItem("sessionTime"));
    console.log("sessionId " + window.sessionStorage.getItem("sessionId"));
    console.log("sessionTime " + window.sessionStorage.getItem("sessionTime"));
    console.log("role " + window.sessionStorage.getItem("role"));
    console.log("userId " + window.sessionStorage.getItem("userId"));
    var today = new Date();
	console.log("now " + today.getTime());
    

    if (window.sessionStorage.getItem("sessionTime") == null || window.sessionStorage.getItem("sessionTime") != null &&
        window.sessionStorage.getItem("sessionTime") < today.getTime()) {
        console.log("session timed-out");
        window.sessionStorage.removeItem("sessionId");
        window.sessionStorage.removeItem("sessionTime");
        window.sessionStorage.removeItem("role");
        window.sessionStorage.removeItem("userId");
        $.mobile.changePage("#page-signin", "slide", true, true);
        this.$ctnErr.html("<div class='error'>Session Timed Out, please login again</div>");
        return false;
    }
    console.log("session available");
    return true;

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
			window.sessionStorage.setItem("sessionId", '3412421');
            window.sessionStorage.setItem("sessionTime", 2432342424233423);
            window.sessionStorage.setItem("role", 1);
            window.sessionStorage.setItem("userId", 100);

    $.mobile.changePage("#page-home", "slide", true, true);
    return;
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



    $.mobile.loading("show");
    $.ajax({
        type: 'POST',
        url: TalentSearch.Settings.signInUrl,
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        data:  JSON.stringify({ 
            "userName": txtUserId,
             "password" : txtPassword
        }),
         processData:  false,
        success: function(data,  status,  xhr) {
            $.mobile.loading("hide");
            
            window.sessionStorage.setItem("sessionId", xhr.getResponseHeader('Authorization'));
            window.sessionStorage.setItem("sessionTime", xhr.getResponseHeader('Session_Timeout'));
            window.sessionStorage.setItem("role", xhr.getResponseHeader('RoleId'));
            window.sessionStorage.setItem("userId", xhr.getResponseHeader('UserId'));

            $.mobile.changePage("#page-home", "slide", true, true);
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