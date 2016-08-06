$('#submit').click(function (e) {
    e.preventDefault();
    var l = Ladda.create(this);
    l.start();

    if ($('#InternalUserID').val() == "" || $('#InternalPin').val() == "") {
        bootbox.alert("Invalid UserID/PIN");
        l.stop();
        return false;
    }

    var credential = {
        InternalUserID: $('#InternalUserID').val(),
        InternalPin: $('#InternalPin').val()
    }

    $.ajax({
        url: '../Home/PostSubmitAP/',
        type: "POST",
        cache: false,
        data: $("#loginap").serialize(),
        //dataType: "json",
        success: function (data) {
            if (data.Result == "OK") {
                if (data.Message == "LIST") {

                    var ProjectSelect = $("#ProjectSelect");
                    ProjectSelect.empty();

                    $.each(data.ProjectList, function (i, val) {
                        ProjectSelect.append(
                            $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                        );
                    });
                    l.stop();
                    $('#modalAPSelection').modal('show');
                }
                else{
                    window.location.href = "../Dashboard/AP";
                }
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

    var credential = {
        adminIcNo: $('#icno').val(),
        adminEmail: $('#email').val()
    }

    $.ajax({
        url: '../Home/ResetAdminPIN/',
        type: "POST",
        data: $("#resetap").serialize(),
        cache: false,
        //dataType: "json",
        success: function (data) {
            if (data.Status == "OK") {
                bootbox.alert(data.Message);
                document.getElementById("resetap").reset();
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