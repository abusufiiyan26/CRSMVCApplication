$('#submit-form').click(function (e) {
    e.preventDefault();
    var l = Ladda.create(this);
    l.start();

    if ($('#adminuserid').val() == "" || $('#adminpassword').val() == "") {
        bootbox.alert("Invalid UserID/PIN");
        l.stop();
        return false;
    }

    $.ajax({
        url: '../Home/AdminLogins/',
        type: "POST",
        cache: false,
        data: $("#loginadmin").serialize(),
        //dataType: "json",
        success: function (data) {
            if (data.Result == "OK") {
                window.location.href = "../Dashboard/Admin";
            }
            else if (data.Result == "INVALID") {
                $("#errormsg").html(data.Message);
                l.stop();
            }
            else if (data.Result == "ERROR") {
                $("#errormsg").html(data.Message);
                l.stop();
            }
            else {
                $("#errormsg").html(data.Message);
                l.stop();
            }
        },
        error: function (errorthrown) {
            //alert(errorthrown);
        }
    });
});

$('#btnSelectConfirm').click(function (e) {
    e.preventDefault();
    var l = Ladda.create(this);
    l.start();

    var newVProject = $('#ProjectSelect').val();

    var credential = {
        InternalUserID: $('#InternalUserID').val(),
        InternalPin: $('#InternalPin').val(),
        ProjectID: $('#ProjectSelect').val()
    }

    $.ajax({
        url: '../Home/SubmitAP/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(credential),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                window.location.href = "../Dashboard/AP";
            }
        },
        error: function (errorthrown) {
            l.stop();
            //alert(errorthrown);
        }
    });
});

$('#password').on('click', function (e) {
    e.preventDefault();
    $('.form-signin').slideUp(300, function () {
        $('#adminuserid').val('');
        $('#adminpassword').val('');
        $("#errormsg").html('');
        $('.form-password').slideDown(300);
    });
});
$('#login').on('click', function (e) {
    e.preventDefault();
    $('.form-password').slideUp(300, function () {
        $('.form-signin').slideDown(300);
    });
});

$('#submit-password').click(function (e) {
    e.preventDefault();
    var l = Ladda.create(this);
    l.start();

    if ($('#icno').val() == "" || $('#email').val() == "") {
        bootbox.alert("Invalid IC No/Email Address");
        l.stop();
        return false;
    }

    $.ajax({
        url: '../Home/ResetAdminPIN/',
        type: "POST",
        data: $("#resetadmin").serialize(),
        cache: false,
        //dataType: "json",
        success: function (data) {
            if (data.Status == "OK") {
                bootbox.alert(data.Message);
                document.getElementById("resetadmin").reset();
                l.stop();
            }
            else if (data.Status == "INVALID") {
                //$("#errorresetmsg").html(data.Message);
                bootbox.alert(data.Message);
                l.stop();
            }
            else if (data.Status == "ERROR") {
                bootbox.alert(data.Message);
                l.stop();
            }
            else {
                bootbox.alert(data.Message);
                l.stop();
            }
        },
        error: function (errorthrown) {
            //alert(errorthrown);
        }
    });

});