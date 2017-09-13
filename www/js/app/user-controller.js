var TalentSearch = TalentSearch || {};

TalentSearch.UserController = function() {

    this.$page = null;
    this.$btnSubmit = null;
    this.$selectVenueId = null;
    this.$txtUser = null;
	this.$txtPassword = null;
    this.$selectStatus = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.UserController.prototype.init = function() {
    this.$page = $("#page-user");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$selectVenueId = $("#select-venue", this.$page);
    this.$txtUser = $("#txt-user", this.$page);
    this.$selectStatus = $("#select-status", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-user";
	this.$txtPassword = $("#txt-password", this.$page);
};

TalentSearch.UserController.prototype.loadPageCommand = function() {
    $.mobile.loading("hide");
    console.log('loadPageCommand');
    $.ajax({
        type: 'GET',
        url: TalentSearch.Settings.loadUserUrl,
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        processData:  false,
        headers: {
            "Authorization": window.sessionStorage.getItem("sessionId"),
            "UserId": window.sessionStorage.getItem("userId")
        },
        success: function(resp) {
            $.mobile.loading("hide");

            $('#table-user').dataTable({

                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                    "sWidth": "40%",
                    "sTitle": "User Name",
                    "mDataProp": "userName"
                }, {
                    "sWidth": "40%",
                    "sTitle": "User Role",
                    "mDataProp": "userRole.roleName"
                }, {
                    "sWidth": "20%",
                    "sTitle": "User Status",
                    "mDataProp": "status"
                }],
                "bDestroy": true
            });
        },
        error: function(e) {
            $.mobile.loading("hide");
            console.log(e.message);
            this.$ctnErr.html("<div class='error'>Oops! TalentSearch had a problem and could not process your request.  Please try again in a few minutes.</div>");
            this.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    });
};

TalentSearch.UserController.prototype.resetSignInForm = function() {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);

    this.$selectVenueId.removeClass(invalidInputStyle);
    this.$txtUser.removeClass(invalidInputStyle);
    this.$selectStatus.removeClass(invalidInputStyle);
	this.$txtPassword.removeClass(invalidInputStyle);

    this.$txtUser.val("");
    this.$selectVenueId.val("");
    this.$selectStatus.val("Active");
	this.$txtPassword.val("");
	this.loadDropDown();
};
TalentSearch.VenueController.prototype.loadDropDown = function() {

    $.mobile.loading("hide");
    console.log('loadDropDown');
    $.ajax({
        type: 'GET',
        url: TalentSearch.Settings.loadVenuesUrl,
        dataType: 'json',
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        processData:  false,
        headers: {
            "Authorization": window.sessionStorage.getItem("sessionId"),
            "UserId": window.sessionStorage.getItem("userId")
        },
        //data: '{ "comment" }',
        success: function(resp) {

            $.mobile.loading("hide");
			val list = JSON.stringify(resp);
			alert(list);
			for(var i=0;i<list.length;i++)
			{
				$("#select-venue").append($('<option></option>').val(list.id).html(list.venueName));
			}
            
        },
        error: function(e) {
            $.mobile.loading("hide");
            console.log(e.message);
            this.$ctnErr.html("<div class='error'>Oops! TalentSearch had a problem and could not process your request.  Please try again in a few minutes.</div>");
            this.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    });


};

TalentSearch.UserController.prototype.onSignInCommand = function() {

    var me = this,

        txtUser = me.$txtUser.val().trim(),
        selectVenueId = me.$selectVenueId.val(),
        selectStatus = me.$selectStatus.val(),
		txtPassword = me.$txtPassword.val().trim(),
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
	if (txtPassword.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
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

    $.ajax({
        type: 'POST',
        url: TalentSearch.Settings.addUserUrl,
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async: false,
        processData:  false,
        headers: {
            "Authorization": window.sessionStorage.getItem("sessionId"),
            "UserId": window.sessionStorage.getItem("userId")
        },
        data: JSON.stringify({
            "userName": txtUser,
            "password": txtPassword,
            "status": userStatus,
            "userRole": {
                "id": "2"
            },
            "venueDetail": {
                "id": selectVenueId
            }
        }),
        success: function(resp) {

            $.mobile.loading("hide");
            $('#popup', this.mainMenuPageId).dialogBox({
                hasClose: true,
                hasMask: true,
                time: 3000,
                title: 'Success',
                content: 'Data Saved Successfully !!'
            });
            this.resetSignInForm();
            $('#table-user').dataTable({
                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                    "sWidth": "40%",
                    "sTitle": "User Name",
                    "mDataProp": "userName"
                }, {
                    "sWidth": "40%",
                    "sTitle": "User Role",
                    "mDataProp": "userRole.roleName"
                }, {
                    "sWidth": "20%",
                    "sTitle": "User Status",
                    "mDataProp": "status"
                }],
                "bDestroy": true
            });
        },
        error: function(e) {
            $.mobile.loading("hide");
            console.log(e.message);
            me.$ctnErr.html("<div class='error'>Oops! TalentSearch had a problem and could not process your request.  Please try again in a few minutes.</div>");
            me.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    });
};