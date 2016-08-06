$('#btnSetConfirm').click(function (e) {
    e.preventDefault();

    if ($('#oPin').val() == "" || $('#nPin').val() == "" || $('#cnPin').val() == ""){
        bootbox.alert("Please enter all fields");
        return false;
    }

    if ($('#nPin').val() != $('#cnPin').val()) {
        bootbox.alert("Password not match");
        return false;
    }

    if ($('#nPin').val().length < 6) {
        bootbox.alert("Enter at least 6 characters");
        return false;
    }

    var updatepass = {
        oPin: $('#oPin').val(),
        nPin: $('#nPin').val(),
        cnPin: $('#cnPin').val(),
    };

    $.ajax({
        url: '/UpdateInfo/saveChangePassword',
        type: 'POST',
        cache: false,
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(updatepass),
        dataType: 'json',
        success: function (data) {
            if (data.Result == "OK") {
                bootbox.alert(data.Message);
                
                $('#oPin').val("");
                $('#nPin').val("");
                $('#cnPin').val("");
                //window.location.href = data.Url;
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

});