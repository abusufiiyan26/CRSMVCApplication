function submit_logout() {

    $.ajax({
        //  url: '/Home/Index/',
        url: '../Home/LogOut',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: 'json',
        success: function (data) {
            if (data.Status == "OK") {
                if (data.roleID == 2) {
                    window.location.href = "../Home/Index";
                }
                else if (data.roleID == 3) {
                    window.location.href = "../Home/AP";
                }
                else {
                    window.location.href = "../Home/Admin";
                }
            }
            else {

            }
        },
        error: function (errorThrown) {
        }
    });

};