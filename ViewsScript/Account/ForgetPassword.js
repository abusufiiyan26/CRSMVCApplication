
$('#btnSubmit').click(function () {

    if ($('#UserName').val() == "") {
        toastr["error"]("Username is required");
        return false;
    }

    $.LoadingOverlay("show");

    var forgetJson = {
        UserName: $('#UserName').val()
    };

    $.ajax({
        url: '/ForgetPassword/SavePassword',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(forgetJson),
        dataType: 'json',
        success: function (data) {
            $.LoadingOverlay("hide");
            if (data.Result == "OK") {
                alert(data.Message);
                window.location.href = data.UrlRedirect;
            }
            else {
                toastr["error"](data.Message);
                return false;
            }
        },
        error: function (errorThrown) {
            $.LoadingOverlay("hide");
            toastr["error"](errorThrown);
            return false;
        }
    });

});
