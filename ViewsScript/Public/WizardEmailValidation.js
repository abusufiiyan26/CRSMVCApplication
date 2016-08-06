$('#btnReset').click(function (e) {
    e.preventDefault();

    if ($('#eMail').val() == "") {
        toastr["error"]("Please insert email");
        return false;
    }

    var $email = $('#eMail').val();
    var filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!filter.test($('#eMail').val())) {
        toastr["error"]("Please enter a valid email address.");
        return false;
    }

    var r = confirm("Are you CONFIRM to reset PIN and Challenge Response");
    if (r == true) {
        var pinResetConfirm = {
            eMail: $('#eMail').val()
        };
        $.ajax({
            url: '/Public/saveRequestReset',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(pinResetConfirm),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    //toastr["success"](data.Message);
                    bootbox.dialog({
                        message: data.Message,
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            ok: {
                                label: "OK",
                                className: "btn-success",
                                callback: function () {
                                    window.location.replace("/Home/Index");
                                }
                            }
                        }
                    });
                }
                else if (data.Result == "WRONG") {
                    toastr["warning"](data.Message);
                }
                else {
                    toastr["error"](data.Message);
                }
            },
            error: function (errorThrown) {
                //toastr["error"]("Your PIN failed to changed")
            }
        });
    } else {
    }
});