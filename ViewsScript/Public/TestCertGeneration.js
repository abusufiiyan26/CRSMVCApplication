$(function () {

    var Question1 = $("#Question1");
    Question1.empty();
    Question1.append($("<option></option").val("").html("Select Question"));

    var Question2 = $("#Question2");
    Question2.empty();
    Question2.append($("<option></option").val("").html("Select Question"));

    var Question3 = $("#Question3");
    Question3.empty();
    Question3.append($("<option></option").val("").html("Select Question"));

    $.ajax({
        url: '/FirstTimeCreation/getQuestionData/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.Result == "OK") {
                $.each(data.Question, function (i, val) {
                    Question1.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                    Question2.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                    Question3.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                });
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function (errorThrown) {
            toastr["error"](errorThrown);
        }
    });

    var adminForm = $("#adminForm");
    adminForm.validate({
        errorClass: "my-error-class",
        rules: {
            vicNo: {
                required: true
            },
            vCompanyName: {
                required: true
            },
            vName: {
                required: true
            },
            vProjectCode: {
                required: true
            },
            vProcedureName: {
                required: true
            },

            vPin: {
                required: true,
                minlength: 8,
                maxlength: 16,
                alphanumeric: true
            },
            vConfirmPin: {
                required: true,
                equalTo: "#vPin",
                minlength: 8,
                maxlength: 16
            },
            Question1: {
                required: true
            },
            Question2: {
                required: true
            },
            Question3: {
                required: true
            },
            answer1: {
                required: true
            },
            answer2: {
                required: true
            },
            answer3: {
                required: true
            }
        }
    });

    jQuery.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/.test(value);
    });

    $('#btnReset').click(function (e) {
        e.preventDefault();
        $(adminForm)[0].reset();
    });

    $('#btnActived').click(function (e) {
        e.preventDefault();

        var vicNo = $('#vicNo').val();
        var vCompanyName = $('#vCompanyName').val();
        var vName = $('#vName').val();
        var vPin = $('#vPin').val();
        var vEmail = $('#vEmail').val();
        var vProjectCode = $('#vProjectCode').val();
        var vProcedureName = $('#vProcedureName').val();

        var Question1 = $('#Question1').val();
        var Question2 = $('#Question2').val();
        var Question3 = $('#Question3').val();
        var answer1 = $('#answer1').val();
        var answer2 = $('#answer2').val();
        var answer3 = $('#answer3').val();

        if (adminForm.valid()) {
            var r = confirm("Are you CONFIRM to Setup Pin and Challenge Response");
            if (r == true) {
                $.LoadingOverlay("show");
                var pinconfirm = {
                    vicNo: vicNo,
                    vCompanyName: vCompanyName,
                    vName: vName,
                    vPin: vPin,
                    vEmail: vEmail,
                    vProjectCode: vProjectCode,
                    vProcedureName: vProcedureName,

                    Question1: Question1,
                    Question2: Question2,
                    Question3: Question3,
                    answer1: answer1,
                    answer2: answer2,
                    answer3: answer3,
                };
                $.ajax({
                    url: '/FirstTimeCreation/SaveTestCertCreation',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(pinconfirm),
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        if (data.Result == "OK") {
                            $.LoadingOverlay("hide");
                            bootbox.dialog({
                                message: "Your certificate has been successfully created. Please wait for 5-10 minutes before you can use it",
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
                        else if (data.Result == "WARNING") {
                            $.LoadingOverlay("hide");
                            toastr["warning"](data.Message);
                        }
                        else if (data.Result == "ERROR") {
                            $.LoadingOverlay("hide");
                            toastr["error"](data.Message);
                        }
                        else {
                            $.LoadingOverlay("hide");
                            toastr["error"]("UNKNOWN ERROR");
                        }
                    },
                    error: function (errorThrown) {
                        $.LoadingOverlay("hide");
                        toastr["error"](errorThrown);
                    }
                });
            } else {
            }
        }
    });
});

