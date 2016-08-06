$('#btnSaveModal').click(function () {
    $('#modal-export-template').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});

$('#btnSaveAdmin').click(function () {

    var r = confirm("Are you sure to SAVE this THEME");
    if (r == true) {
        $('#modal-export-template').hide();
        //$.LoadingOverlay("show");
        var classID = $('#themeBody').attr('class');
        
        var themeJSON = {
            classID: classID,
            themeName: $('#themeName').val(),
            projectID: $('#vCodeID').val()
        };

        $.ajax({
            url: '/ProjectTheme/SaveProjectTheme',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            cache: false,
            data: JSON.stringify(themeJSON),
            dataType: 'json',
            success: function (result) {
                if (result.Status == "OK") {
                    //$.LoadingOverlay("hide");
                    bootbox.dialog({
                        message: result.Message,
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            success: {
                                label: "OK",
                                className: "btn-success",
                                callback: function () {
                                    window.location.href = "../Project";
                                }
                            }
                        }
                    });
                }
                else {
                    //$.LoadingOverlay("hide");
                    bootbox.dialog({
                        message: result.Message,
                        title: "<i class='fa fa-info-circle'></i>" + "Info",
                        buttons: {
                            danger: {
                                label: "OK",
                                className: "btn-danger",
                                callback: function () {
                                }
                            }
                        }
                    });
                }
            },
            error: function (errorThrown) {
                //$.LoadingOverlay("hide");
            }
        });
    }
});
