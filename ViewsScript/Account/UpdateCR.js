$(function () {
    var Question1 = $("#Question1");
    Question1.empty(); // this line is for clear all items 
    Question1.append($("<option></option").val("").html("Select Question"));

    var Question2 = $("#Question2");
    Question2.empty(); // this line is for clear all items 
    Question2.append($("<option></option").val("").html("Select Question"));

    var Question3 = $("#Question3");
    Question3.empty(); // this line is for clear all items 
    Question3.append($("<option></option").val("").html("Select Question"));

    var getQuestionJson = {
        Project_Id : 1
    };

    $.ajax({
        url: '/ManagementRoaming/getQuestionList',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(getQuestionJson),
        dataType: 'json',
        success: function (data) {
            $.each(data.Question, function (i, val) {
                Question1.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Question, function (i, val) {
                Question2.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
            $.each(data.Question, function (i, val) {
                Question3.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
        },
        error: function (errorThrown) {

        }
    });
});

$('#btnUpdateCRConfirm').click(function (e) {
    e.preventDefault();

    var vPin = $('#Pin').val();

    var Q1 = $('#Question1').val();
    var Q2 = $('#Question2').val();
    var Q3 = $('#Question3').val();

    var A1 = $('#Ans1').val();
    var A2 = $('#Ans2').val();
    var A3 = $('#Ans3').val();

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
    if (vPin == "") {
        toastr["warning"]("Please enter PIN")
        return false;
    }

    bootbox.confirm("Are you sure to Update Challenge Response?", function (result) {

        $.LoadingOverlay("show");

        var updateCRJson = {
            Project_Id: 1,
            Pin: $('#Pin').val(),
            Question1: $('#Question1').val(),
            Question2: $('#Question2').val(),
            Question3: $('#Question3').val(),
            Ans1: $('#Ans1').val(),
            Ans2: $('#Ans2').val(),
            Ans3: $('#Ans3').val()
        };

        $.ajax({
            url: '/UpdateInfo/saveUpdateChallenge',
            type: 'POST',
            cache: false,
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(updateCRJson),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    $.LoadingOverlay("hide");
                    alert(data.Message);
                    $('#Pin').val("");
                    $('#Ans1').val("");
                    $('#Ans2').val("");
                    $('#Ans3').val("");
                    $('#Question1').val("");
                    $('#Question2').val("");
                    $('#Question3').val("");
                    $('#btnUpdateCRConfirm').hide();
                    window.location.href = "../Dashboard/AP";
                }
                else if (data.Result == "INVALID") {
                    $.LoadingOverlay("hide");
                    bootbox.alert(data.Message);
                }
                else {
                    $.LoadingOverlay("hide");
                    bootbox.alert(data.Message);
                }
            },
            error: function (errorThrown) {
                $.LoadingOverlay("hide");
            }
        });
    });
});