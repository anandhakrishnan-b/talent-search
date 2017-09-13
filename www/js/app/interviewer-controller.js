var TalentSearch = TalentSearch || {};

TalentSearch.InterviewerController = function() {

    this.$page = null;
    this.$btnSubmit = null;
    this.$txtInterviewerName = null;
    this.$txtEmployeeId = null;
    this.$txtRole = null;
    this.$txtMobile = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.InterviewerController.prototype.init = function() {
    this.$page = $("#page-interviewer");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$txtInterviewerName = $("#txt-interviewer-name", this.$page);
    this.$txtEmployeeId = $("#txt-employee-id", this.$page);
    this.$txtRole = $("#select-role", this.$page);
    this.$txtMobile = $("#txt-mobile", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-interviewer";
};

TalentSearch.InterviewerController.prototype.loadPageCommand = function() {

    $.mobile.loading("hide");
    console.log('loadPageCommand');
    $.ajax({
        type: 'GET',
        url: TalentSearch.Settings.loadPanelsUrl,
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

            $('#table-panel').dataTable({

                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                        "sWidth": "30%",
                        "sTitle": "Name",
                        "mDataProp": "name"
                    },
                    {
                        "sWidth": "20%",
                        "sTitle": "Employee Id",
                        "mDataProp": "employeeId"
                    },
                    {
                        "sWidth": "30%",
                        "sTitle": "Venue Name",
                        "mDataProp": "venueDetail.venueName"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Role",
                        "mDataProp": "role"
                    }
                ],
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



TalentSearch.InterviewerController.prototype.resetSignInForm = function() {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);


    this.$txtInterviewerName.removeClass(invalidInputStyle);
    this.$txtEmployeeId.removeClass(invalidInputStyle);
    this.$txtRole.removeClass(invalidInputStyle);
    this.$txtMobile.removeClass(invalidInputStyle);


    this.$txtInterviewerName.val("");
    this.$txtEmployeeId.val("");
    this.$txtRole.val("");
    this.$txtMobile.val("");

};

TalentSearch.InterviewerController.prototype.onSignInCommand = function() {

    var me = this,
        txtInterviewerName = me.$txtInterviewerName.val().trim(),
        txtEmployeeId = me.$txtEmployeeId.val().trim(),
        txtRole = me.$txtRole.val(),
        txtMobile = me.$txtMobile.val().trim(),

        btnSubmit = me.$btnSubmit,
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$txtInterviewerName.removeClass(invalidInputStyle);
    me.$txtEmployeeId.removeClass(invalidInputStyle);
    me.$txtRole.removeClass(invalidInputStyle);
    me.$txtMobile.removeClass(invalidInputStyle);
    me.$ctnErr.removeClass(invalidInputStyle);
    me.$ctnErr.html("");
    // Flag each invalid field.
    if (txtInterviewerName.length === 0) {
        me.$txtInterviewerName.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtEmployeeId.length === 0) {
        me.$txtEmployeeId.addClass(invalidInputStyle);
        invalidInput = true;
    }

    if (txtMobile.length === 0) {
        me.$txtMobile.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtMobile === 'dd-mm-yyyy') {
        me.$txtMobile.addClass(invalidInputStyle);
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
        url: TalentSearch.Settings.addPanelUrl,
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
            "name": txtInterviewerName,
             "employeeId" : txtEmployeeId,
            "role": txtRole,
            "txtMobile": txtMobile
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

            $('#table-panel').dataTable({
                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                        "sWidth": "30%",
                        "sTitle": "Name",
                        "mDataProp": "name"
                    },
                    {
                        "sWidth": "20%",
                        "sTitle": "Employee Id",
                        "mDataProp": "employeeId"
                    },
                    {
                        "sWidth": "30%",
                        "sTitle": "Venue Name",
                        "mDataProp": "venueDetail.venueName"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Role",
                        "mDataProp": "role"
                    }
                ],
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