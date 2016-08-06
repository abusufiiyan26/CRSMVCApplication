$('#btnCreate').click(function () {
    var sCreate = {
        UserName: $('#UserName').val(),
        Password: $('#Password').val(),
        Pin: $('#Pin').val()
    }

    var ProjectSelect = $("#Project");
    var UserSelection = $("#UserSelection");
    UserSelection.append($("<option></option").val("").html("Select User"));

    $.ajax({
        url: '../Public/CheckUserData/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(sCreate),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                $('#HideUsername').hide();
                $('#HidePassword').hide();
                $('#HidePin').hide();

                $.each(data.Project, function (i, val) {
                    ProjectSelect.append(
                        $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                    );
                });
                $.each(data.Userss, function (i, val) {
                    UserSelection.append(
                        $("<option></option>").val(val.User_ID).html(val.Name)
                    );
                });
                $('#HideUserName2').show();
                $('#HideCompIDSelect').show();
                $('#HideUserIDSelect').show();
                $('#HideProject').show();
                $('#btnCreate').hide();
                $('#btnRedirect').show();
                $('#btnContinue').show();
                $('#btnPrevious').show();

                $('#btnReqRevoke').show();

            } else {
                alert("Error");
            }
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
});

$('#btnRedirect').click(function () {
    var sCreate2 = {
        UserName2: $('#UserName2').val(),
        Project: $('#Project').val(),
        Name: $('#UserSelection').val()
    }

    $.ajax({
        url: '../Public/SaveProject/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(sCreate2),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                window.location.href = data.UrlRedirect;
            } else {
                alert("Error");
            }
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
});

$('#btnContinue').click(function () {
    var sContinue = {
        UserName2: $('#UserName2').val()
    }

    var UserSelect = $("#UserID");

    $.ajax({
        url: '../Public/ContinueUser/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(sContinue),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                $.each(data.User, function (i, val) {
                    UserSelect.append(
                        $("<option></option>").val(val.User_ID).html(val.Name)
                    );
                });
                $('#HideContinueUsers').show();
                $('#HideUserName2').hide();
                $('#HideProject').hide();
                $('#btnRedirect').hide();
                $('#btnContinue').hide();
                $('#btnContinueRedirect').show();
            } else {
                alert("Error");
            }
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
});

$('#btnContinueRedirect').click(function () {
    var sContinueRedirectJson = {
        UserID: $('#UserID').val()
    }

    $.ajax({
        url: '../Public/SaveContinueUser/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(sContinueRedirectJson),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                window.location.href = data.UrlContinueRedirect;
            } else {
                alert("Error");
            }
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
});

$('#btnPrevious').click(function () {
    var sContinueRedirectJson = {
        UserName2: $('#UserName2').val()
    }

    var ActiveUsers = $("#ActiveUsers");

    $.ajax({
        url: '../Public/PreviousUser/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(sContinueRedirectJson),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                $.each(data.LstUsers, function (i, val) {
                    ActiveUsers.append(
                        $("<option></option>").val(val.CertificateRequestID).html(val.Name)
                    );
                });
                $('#HideProject').hide();
                $('#HideUserName2').hide();
                $('#HideAllActiveUsers').show();
                $('#btnPrevious').hide();
                $('#btnRedirect').show();
                $('#btnContinue').show();
                $('#btnRedirectPrevious').show();
            } else {
                alert("Error");
            }
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
});

$('#btnRedirectPrevious').click(function () {
    var sSSF = {
        ActiveUsers: $('#ActiveUsers').val()
    }

    $.ajax({
        url: '../Public/SavePreviousUser/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(sSSF),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                window.location.href = data.UrlContinueRedirect;
            } else {
                alert("Error");
            }
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
});



$('#btnReqRevoke').click(function () {
    $('#HideRequestRevoke').show();
    $('#btnRedirectRevoke').show();
    $('#btnReqRevoke').hide();
    $('#btnRedirectPrevious').hide();
    $('#btnPrevious').hide();
    $('#btnContinueRedirect').hide();
    $('#btnContinue').hide();
    $('#btnRedirect').hide();
    $('#btnCreate').hide();

    $('#HideUserName2').hide();
    $('#HideUserIDSelect').hide();
    $('#HideProject').hide();
});

$('#btnRedirectRevoke').click(function () {
    var revokeUserJson = {
        RevokeUserID: $('#RevokeUserID').val(),
        RevokeCompID: $('#RevokeCompID').val(),
        RevokeOrgID: $('#RevokeOrgID').val()
    }

    $.ajax({
        url: '../Public/RedirectRevoke/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(revokeUserJson),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                window.location.href = data.UrlContinueRedirect;
            } else {
                alert("Error");
            }
        },
        error: function (errorThrown) {
            alert(errorThrown);
        }
    });
});