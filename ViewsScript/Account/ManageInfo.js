$('#btnInfoConfirm').click(function (e) {
    e.preventDefault();

    var r = confirm("Are you sure to UPDATE PERSONAL INFORMATION!");
    if (r == true) {
        var updateinfo = {
            Name: $('#Name').val(),
            ICNo: $('#ICNo').val(),
            Mobile_No: $('#Mobile_No').val(),
            Email: $('#Email').val(),
            Address: $('#Address').val(),
            City: $('#City').val(),
            State: $('#State').val(),
            Postcode: $('#Postcode').val(),
            Country: $('#Country').val(),
            UserImg: $('#UserImg').val()
        }

        $.ajax({
            url: '../UpdateInfo/savePersonalInfo/',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(updateinfo),
            dataType: 'json',
            success: function (data) {
                if (data.Result == "OK") {
                    toastr["success"](data.Message);
                }
                else {
                    toastr["error"](data.Message);
                }
            },
            error: function (errorThrown) {
                toastr["error"]("Record failed")
            }
        });
    } else {
    }
});