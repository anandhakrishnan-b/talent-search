var TalentSearch = TalentSearch || {};

TalentSearch.VenueController = function() {

    this.$page = null;
    this.$btnSubmit = null;
    this.$txtVenueName = null;
    this.$txtLocation = null;
    this.$txtDateFrom = null;
    this.$txtDateTo = null;
    this.mainMenuPageId = null;
    this.$ctnErr = null;
};

TalentSearch.VenueController.prototype.init = function() {
    this.$page = $("#page-venue");
    this.$btnSubmit = $("#btn-submit", this.$page);
    this.$txtVenueName = $("#txt-venue-name", this.$page);
    this.$txtLocation = $("#txt-location", this.$page);
    this.$txtDateFrom = $("#txt-date-from", this.$page);
    this.$txtDateTo = $("#txt-date-to", this.$page);
    this.$ctnErr = $("#ctn-err", this.$page);
    this.mainMenuPageId = "#page-venue";
};


TalentSearch.VenueController.prototype.resetSignInForm = function() {

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
TalentSearch.VenueController.prototype.loadPageCommand = function() {
    if (window.sessionStorage.getItem("role") == 1) {
        $("#add-venue").show();
    } else {
        $("#add-venue").hide();
    }
    $.mobile.loading("hide");
    console.log('loadPageCommand');
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

            $('#table-venue').dataTable({

                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                    "sWidth": "40%",
                    "sTitle": "Venue",
                    "mDataProp": "venueName"
                }, {
                    "sWidth": "40%",
                    "sTitle": "Location",
                    "mDataProp": "venueLocation"
                }, {
                    "sWidth": "10%",
                    "sTitle": "Date From",
                    "mDataProp": "dateFrom"
                }, {
                    "sWidth": "10%",
                    "sTitle": "Date To",
                    "mDataProp": "dateTo"
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

TalentSearch.VenueController.prototype.onSignInCommand = function() {

    console.log('onSignInCommand');
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
        me.$txtDateFrom.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtDateTo.length === 0) {
        me.$txtDateTo.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtDateFrom === 'dd-mm-yyyy') {
        me.$txtDateFrom.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (txtDateTo === 'dd-mm-yyyy') {
        me.$txtDateTo.addClass(invalidInputStyle);
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
        url: TalentSearch.Settings.addVenueUrl,
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
            "venueName": txtVenueName,
             "venueLocation" : txtLocation,
            "dateFrom": txtDateFrom,
            "dateTo": txtDateTo
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

            $('#table-venue').dataTable({
                "scrollX": true,
                "paging": false,
                "ordering": false,
                "info": false,
                "aaData": resp,
                "aoColumns": [{
                    "sWidth": "40%",
                    "sTitle": "Venue",
                    "mDataProp": "venueName"
                }, {
                    "sWidth": "40%",
                    "sTitle": "Location",
                    "mDataProp": "venueLocation"
                }, {
                    "sWidth": "10%",
                    "sTitle": "Date From",
                    "mDataProp": "dateFrom"
                }, {
                    "sWidth": "10%",
                    "sTitle": "Date To",
                    "mDataProp": "dateTo"
                }],
                "bDestroy": true

            });
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