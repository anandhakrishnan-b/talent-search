var TalentSearch = TalentSearch || {};

TalentSearch.SelectionController = function() {
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

TalentSearch.SelectionController.prototype.init = function() {
    this.$page = $("#page-selection");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$txtDate = $("#txt-date", this.$page);
    this.$txtTurnout = $("#txt-turnout", this.$page);
    this.$txtSelected = $("#txt-selected", this.$page);
    this.$txtWomen = $("#txt-women", this.$page);
    this.$txtComments = $("#txt-comments", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-selection";
};

TalentSearch.SelectionController.prototype.loadPageCommand = function() {

    $.mobile.loading("hide");
    console.log('loadPageCommand');
    $.ajax({
        type: 'GET',
        url: TalentSearch.Settings.loadSelectionsUrl,
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
            $('#table-selection').dataTable({

                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                        "sWidth": "20%",
                        "sTitle": "Venue",
                        "mDataProp": "venueDetail.venueName"
                    },
                    {
                        "sWidth": "20%",
                        "sTitle": "Date",
                        "mDataProp": "date"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Total Turnout",
                        "mDataProp": "turnoutTotal"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Total Selection",
                        "mDataProp": "selectionTotal"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Females Selected",
                        "mDataProp": "femalesSelected"
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



TalentSearch.SelectionController.prototype.resetSignInForm = function() {

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

TalentSearch.SelectionController.prototype.onSignInCommand = function() {

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
    $.ajax({
        type: 'POST',
        url: TalentSearch.Settings.addSelectionUrl,
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
            "turnoutTotal": txtTurnout,
             "selectionTotal" : txtSelected,
            "femalesSelected": txtWomen,
            "date": txtDate,
            "comments": txtComments
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
            $('#table-selection').dataTable({

                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                        "sWidth": "20%",
                        "sTitle": "Venue",
                        "mDataProp": "venueDetail.venueName"
                    },
                    {
                        "sWidth": "20%",
                        "sTitle": "Date",
                        "mDataProp": "date"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Total Turnout",
                        "mDataProp": "turnoutTotal"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Total Selection",
                        "mDataProp": "selectionTotal"
                    }, {
                        "sWidth": "20%",
                        "sTitle": "Females Selected",
                        "mDataProp": "femalesSelected"
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