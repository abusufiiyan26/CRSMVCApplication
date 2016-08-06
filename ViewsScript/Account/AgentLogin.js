$('#submit-form').click(function (e) {
    e.preventDefault();
    var l = Ladda.create(this);
    l.start();

    if ($('#InternalUserID').val() == "" || $('#InternalPin').val() == "") {
        bootbox.alert("Invalid Username/Password");
        l.stop();
        return false;
    }

    $.ajax({
        url: '../Home/PostSubmitAgent/',
        type: "POST",
        cache: false,
        data: $("#loginadmin").serialize(),
        success: function (data) {
            if (data.Result == "OK") {
                window.location.href = data.newUrl;
            }
            else if (data.Result == "LIST") {
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
        }
    });
});

$('#btnSelectConfirm').click(function (e) {
    e.preventDefault();
    var l = Ladda.create(this);
    l.start();

    var credential = {
        InternalUserID: $('#InternalUserID').val(),
        InternalPin: $('#InternalPin').val(),
        ProjectID: $('#ProjectSelect').val()
    }

    $.ajax({
        url: '../Home/SubmitAgent/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(credential),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                window.location.href = data.newUrl;
            } else {
                bootbox.alert(data.Message);
            }
        },
        error: function (errorthrown) {
            l.stop();
        }
    });
});

$('#password').on('click', function (e) {
    e.preventDefault();
    window.location.href = "/ForgetPassword";
});