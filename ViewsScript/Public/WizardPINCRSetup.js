$(function () {

    var hideError = $("#hideError").val();
    var hidePINStatus = $("#hidePINStatus").val();
    if (hideError != "") {
        bootbox.dialog({
            message: hideError,
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

    if (hidePINStatus == "Y") {
        $("#PinSetup").hide();
        $("#prevbtnPinSetup").hide();
        $("#nextbtnPinSetup").hide();

        $("#PinConfigured").show();
        $("#btnPinConfigured").show();

    } else {
        $("#PinConfigured").hide();
        $("#btnPinConfigured").hide();

        $("#PinSetup").show();
        $("#prevbtnPinSetup").show();
        $("#nextbtnPinSetup").show();
    }

    var Question1 = $("#Question1");
    Question1.empty();
    Question1.append($("<option></option").val("").html("Select Question"));

    var Question2 = $("#Question2");
    Question2.empty();
    Question2.append($("<option></option").val("").html("Select Question"));

    var Question3 = $("#Question3");
    Question3.empty();
    Question3.append($("<option></option").val("").html("Select Question"));

    var Question4 = $("#Question4");
    Question4.empty();
    Question4.append($("<option></option").val("").html("Select Question"));

    var Question5 = $("#Question5");
    Question5.empty();
    Question5.append($("<option></option").val("").html("Select Question"));

    $.ajax({
        url: '/ManagementRoaming/getQuestionData/',
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
                    Question4.append(
                        $("<option></option>").val(val.Value).html(val.Value)
                    );
                    Question5.append(
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
    var count = $('#hidecount').val();

    if (count == 1) {
        $("#cr1").show();
    }
    else if (count == 2) {
        $("#cr1").show();
        $("#cr2").show();
    }
    else if (count == 3) {
        $("#cr1").show();
        $("#cr2").show();
        $("#cr3").show();
    }
    else if (count == 4) {
        $("#cr1").show();
        $("#cr2").show();
        $("#cr3").show();
        $("#cr4").show();
    }
    else if (count == 5) {
        $("#cr1").show();
        $("#cr2").show();
        $("#cr3").show();
        $("#cr4").show();
        $("#cr5").show();
    }

    adminForm.validate({
        errorClass: "my-error-class",
        rules: {
            adminPin: {
                required: true,
                minlength: 8,
                maxlength: 16,
                alphanumeric: true
            },
            adminConfirmPin: {
                required: true,
                equalTo: "#adminPin",
                minlength: 8,
                maxlength: 16
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
        },
        messages: {
            adminPin: {
                required: "Pin is required",
                alphanumeric: "Allow numbers and alphabets combination only"
            },
            adminConfirmPin: {
                equalTo: "Please enter the same Pin as above"
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

        var Q1 = $('#Question1').val();
        var Q2 = $('#Question2').val();
        var Q3 = $('#Question3').val();
        var Q4 = $('#Question4').val();
        var Q5 = $('#Question5').val();

        var A1 = $('#answer1').val();
        var A2 = $('#answer2').val();
        var A3 = $('#answer3').val();
        var A4 = $('#answer4').val();
        var A5 = $('#answer5').val();

        if (count == 3) {
            if (Q1 == Q2 || Q1 == Q3 || Q2 == Q3) {
                toastr["warning"]("Question cant be same. Please select other question")
                return false;
            }
            if (Q1 == "" || Q2 == "" || Q3 == "") {
                toastr["warning"]("Please select a question before proceed")
                return false;
            }
            if (A1 == "" || A2 == "" || A3 == "") {
                toastr["warning"]("Please enter answer before proceed")
                return false;
            }
        }
        else if (count == 4) {
            if (Q1 == Q2 || Q1 == Q3 || Q1 == Q4 || Q2 == Q3 || Q2 == Q4 || Q3 == Q4) {
                toastr["warning"]("Question cant be same. Please select other question")
                return false;
            }
            if (Q1 == "" || Q2 == "" || Q3 == "" || Q4 == "") {
                toastr["warning"]("Please select a question before proceed")
                return false;
            }
            if (A1 == "" || A2 == "" || A3 == "" || A4 == "") {
                toastr["warning"]("Please enter answer before proceed")
                return false;
            }
        }
        else {
            if (Q1 == Q2 || Q1 == Q3 || Q1 == Q4 || Q2 == Q3 || Q2 == Q4 || Q3 == Q4 || Q5 == Q1 || Q5 == Q2 || Q5 == Q3 || Q5 == Q4) {
                toastr["warning"]("Question cant be same. Please select other question")
                return false;
            }
            if (Q1 == "" || Q2 == "" || Q3 == "" || Q4 == "" || Q5 == "") {
                toastr["warning"]("Please select a question before proceed")
                return false;
            }
            if (A1 == "" || A2 == "" || A3 == "" || A4 == "" || A5 == "") {
                toastr["warning"]("Please enter answer before proceed")
                return false;
            }
        }

        if (adminForm.valid()) {
            var r = confirm("Are you CONFIRM to Setup Pin and Challenge Response");
            if (r == true) {
                $.LoadingOverlay("show");
                var pinconfirm = {
                    Pin: $('#adminPin').val(),
                    Question1: $('#Question1').val(),
                    Question2: $('#Question2').val(),
                    Question3: $('#Question3').val(),
                    Question4: $('#Question4').val(),
                    Question5: $('#Question5').val(),
                    Ans1: $('#answer1').val(),
                    Ans2: $('#answer2').val(),
                    Ans3: $('#answer3').val(),
                    Ans4: $('#answer4').val(),
                    Ans5: $('#answer5').val()
                };
                $.ajax({
                    url: '/ManagementRoaming/WizardSavePinQuestion',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(pinconfirm),
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        if (data.Result == "OK") {
                            if (data.EmailPrint == "PRINT") {
                                $.ajax({
                                    url: '/Invoice/CreditInvoiceEmail?INo=' + data.invoiceNo + '',
                                    type: 'POST',
                                    //data: $("#formStructure").serialize(),
                                    success: function (data) {
                                        $.LoadingOverlay("hide");
                                        //toastr["success"](data.Message);
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
                                    },
                                    error: function (errorThrown) {
                                        $.LoadingOverlay("hide");
                                    }
                                });
                            } else {
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

$('#btnPinConfigured').click(function (e) {
    e.preventDefault();

    var r = confirm("Are you CONFIRM for Pin and Challenge Response Setup!");
    if (r == true) {
        $.LoadingOverlay("show");
        var pinconfirm = {
            Pin: $('#adminPinC').val()
        };
        $.ajax({
            url: '/ManagementRoaming/WizardSavePinConfigured',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(pinconfirm),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {

                    if (data.EmailPrint == "PRINT") {
                        $.ajax({
                            url: '/Invoice/CreditInvoiceEmail?INo=' + data.invoiceNo + '',
                            type: 'POST',
                            //data: $("#formStructure").serialize(),
                            success: function (data) {
                                $.LoadingOverlay("hide");
                                //toastr["success"](data.Message);
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
                            },
                            error: function (errorThrown) {
                                $.LoadingOverlay("hide");
                            }
                        });
                    } else {
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
    }
});