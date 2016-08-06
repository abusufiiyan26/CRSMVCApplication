$(document).ready(function () {

    var OpenModal = $('#OpenModal').val();
    if (OpenModal == "OPEN") {
        $('#colored-header').modal({
            show: true,
            backdrop: 'static',
            keyboard: true
        });
    }
});

var usernamePnl = $("#usernamePnl")
var passwordPnl = $("#passwordPnl")
var form = $('form');

$(document).ready(function () {
    usernamePnl.show();
    passwordPnl.hide();
});

function loginmodal() {
    usernamePnl.show();
    passwordPnl.hide();
    $('#userhide > input').val('');
    $('#passhide > input').val('');
    jQuery('#errormsg div').html('');
    jQuery('#loading div').html('');
    jQuery('#Phrase div').html('');

    var ddError = $("#errormsg");
    ddError.empty();
    var ddLoad = $("#loading");
    ddLoad.empty();
    var ddPhrase = $("#Phrase");
    ddPhrase.empty();
}

function validateUsername() {
    var name = $('#UserName').val();
    $("#Name").val(name);
    var ddLoad = $("#loading");
    ddLoad.empty();
    var ddPhrase = $("#Phrase");
    ddPhrase.empty();
    var ddError = $("#errormsg");
    ddError.empty();

    if (name == "") {
        alert("Please enter username");
        return false;
    }

    $.ajax({
        url: '/Home/CheckUsername',
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        data: { input: name },
        dataType: 'json',
        success: function (result) {
            //$("#Phrase").html(result[0].SecurityPhrase);
            //$('#loading').html('<img src="' + result[0].SecurityImg + ' " style="width: 70px; height: 70px"><br>');
            $("#Phrase").html(result.security);
            $('#loading').html(result.img);
        },
        error: function (errorThrown) {
            //alert(errorThrown);
        }
    });

    usernamePnl.hide();
    passwordPnl.show();
}

$('#btnBack').click(function () {
    usernamePnl.show();
    passwordPnl.hide();
});

$('#btnLogin').click(function () {

    var infologin = {
        UserName: $('#UserName').val(),
        Password: $('#Password').val(),
        ReturnUrl: $('#ReturnUrl').val()
    };

    $.ajax({
        url: '/Home/Index',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(infologin),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "returnURL") {
                //$btn.button('reset')
                window.location.href = data.newUrl;
            }
            else if (data.Result == "successful") {
                //$btn.button('reset')
                window.location.href = "../Dashboard/Index";
            }
            else if (data.Result == "confirmation") {
                $("#errormsg").html("<span style='color:red'>Please activate your account</span>");
            }
            else {
                $("#errormsg").html("<span style='color:red'>Invalid Username or Password</span>");
            }
        },
        error: function (errorThrown) {
            $("#errormsg").html("<span style='color:red'>'" + errorThrown + "'</span>");
        }
    });

});