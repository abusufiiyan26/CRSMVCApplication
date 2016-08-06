var checkusername = "";
var form = $('form');

$('#UserName').change(function () {
    var url = "/Register/CheckUserName";
    var usname = $('#UserName').val();

    $.get(url, { input: usname }, function (udata2) {
        if (udata2 == "NotAvailable") {
            checkusername = udata2;
        }
        else {
            checkusername = udata2;
        }
    });
})

$('#btnCreateConfirm').click(function () {
   
    if (checkusername == "NotAvailable") {
        toastr["error"]("Username exist");
        return false;
    }

    var selectedVal = "";
    var selected = $("input[type='radio'][name='SecurityImg']:checked");
    if (selected.length > 0) {
        selectedVal = selected.val();
    }
    if (selectedVal == "") {
        toastr["warning"]("Please select security image");
        return false;
    }

    var isValidCreateNew = (form.validate().element($('#UserName'))
       & form.validate().element($('#Password'))
       & form.validate().element($('#ConfirmPassword'))
       & form.validate().element($('#SecurityPhrase')));

    if (isValidCreateNew && checkusername != "NotAvailable") {
        var r = confirm("Are you sure to PROCEED");
        if (r == true) {
            $.LoadingOverlay("show");

            var infologin = {
                UserName: $('#UserName').val(),
                Password: $('#Password').val(),
                SecurityImg: selectedVal,
                SecurityPhrase: $('#SecurityPhrase').val()
            };

            $.ajax({
                url: '/Register/saveNewAccount',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(infologin),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    if (data.Result == "OK") {
                        $.LoadingOverlay("hide");
                        alert("Your account is activated. Please login using your username and password");
                        window.location.href = "/Home/Index";
                    }
                    else {
                        $.LoadingOverlay("hide");
                        toastr["warning"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                    alert(errorThrown)
                }
            });
        } else {
        }
    }
    return isValidCreateNew;
});