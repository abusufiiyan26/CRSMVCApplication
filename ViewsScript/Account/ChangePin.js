$('#btnSetConfirm').click(function (e) {
    e.preventDefault();

    if ($('#oPin').val() == "" || $('#nPin').val() == "" || $('#cnPin').val() == "") {
        bootbox.alert("Please enter all fields");
        return false;
    }

    if ($('#nPin').val() != $('#cnPin').val()) {
        bootbox.alert("PIN not match");
        return false;
    }

    if ($('#nPin').val().length < 6) {
        bootbox.alert("Enter at least 6 characters");
        return false;
    }

    var r = confirm("Are you sure to Change PIN!");
    if (r == true) {

        var updatepass = {
            oPin: $('#oPin').val(),
            nPin: $('#nPin').val(),
            cnPin: $('#cnPin').val(),
        };

        $.ajax({
            url: '/UpdateInfo/saveChangeAdminPIN',
            type: 'POST',
            cache: false,
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(updatepass),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    //bootbox.alert(data.Message);

                    $('#oPin').val("");
                    $('#nPin').val("");
                    $('#cnPin').val("");
                    bootbox.dialog({
                        message: data.Message,
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            ok: {
                                label: "OK",
                                className: "btn-success",
                                callback: function () {
                                    window.location.replace("/Dashboard");
                                }
                            }
                        }
                    });
                }
                else if (data.Result == "INVALID") {
                    bootbox.alert(data.Message);
                }
                else {
                    bootbox.alert(data.Message);
                }
            },
            error: function (errorThrown) {
            }
        });
    } else {
    }
});