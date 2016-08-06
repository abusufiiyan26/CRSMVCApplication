var sVEmailID = "";

$(document).ready(function () {
    $('#Data').ckeditor();

    $('#templateTbl').jtable({
        title: 'Email Template List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'TemplateName ASC',
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/MailTemplate/getTemplateRecords?roleID=0 &jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
                            type: 'POST',
                            dataType: 'json',
                            data: postData,
                            success: function (data) {
                                $dfd.resolve(data);
                            },
                            error: function () {
                                $dfd.reject();
                            }
                        });
                    });
                }
            //listAction: '/UserAdmin/DeleteUser'
        },
        fields: {
            EmailID: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            TemplateName: {
                title: 'Template Name',
                width: '15%'
            },
            Description: {
                title: 'Description',
                list: true,
                width: '25%'
            },
            Subject: {
                title: 'Subject',
                width: '22%'
            },
            CustomAction: {
                title: '',
                width: '3%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        return '<button title="Edit Record" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdate(' + data.record.EmailID + ')\; return false;"><span>Edit Record</span></button>';
                    }
                }
            }
        },
        formCreated: function (event, data) {
            data.form.children(':lt(11)').wrapAll('<div class="col1"/>');
            data.form.children(':gt(0)').wrapAll('<div class="col2"/>');
        }
    });

    //Load student list from server
    $('#templateTbl').jtable('load');

});

$('#btnCreateNewTemplate').click(function () {

    $("#HideCreateTemplate").show();
    $("#HideUpdateTemplate").hide();
});

$('#btnCreateConfirm').click(function () {
    //var s = confirm("Are you sure to create NEW EMAIL TEMPLATE!");
    //if (s == true) {
    bootbox.confirm("Are you sure to create NEW EMAIL TEMPLATE!", function (result) {
        if (result) {
            $.LoadingOverlay("show");
            var createData = {
                Data: $('#Data').val(),
                TemplateName: $('#TemplateName').val(),
                EmailSource: $('#EmailSource').val(),
                Description: $('#Description').val(),
                Subject: $('#SubjectName').val()
            };

            $.ajax({
                url: '/MailTemplate/saveInsert',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(createData),
                dataType: 'json',
                success: function (data) {
                    if (data.Result = "OK") {
                        //toastr["success"](data.Message);
                        $("#templateTbl").trigger("reloadGrid");
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: data.Message,
                            title: "<i class='fa fa-info-circle'></i>" + "Info",
                            buttons: {
                                ok: {
                                    label: "OK",
                                    className: "btn-success",
                                    callback: function () {
                                    }
                                }
                            }
                        });
                    }
                    else {
                        $.LoadingOverlay("hide");
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                    toastr["error"](errorThrown);
                }
            });
        }
    });
});

function getUpdate(EmailID) {

    var MailIDJson = {
        EmailID: EmailID
    }

    $.ajax({
        url: '/MailTemplate/getUpdateData',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(MailIDJson),
        dataType: 'json',
        success: function (data) {
            if (data.Result = "OK") {

                sVEmailID = EmailID;

                $('#UpdateTemplateName').val(data.Temp.TemplateName);
                $('#UpdateSubjectName').val(data.Temp.Subject);
                $('#UpdateDescription').val(data.Temp.Description);

                var editor_data = CKEDITOR.instances['UpdateData'].getData();
                CKEDITOR.instances['UpdateData'].setData(data.Temp.MailContent)

                $("#HideCreateTemplate").hide();
                $("#HideUpdateTemplate").show();
            }
            else {
            }
        },
        error: function (errorThrown) {
        }
    });
}

$('#btnEditConfirm').click(function () {
    //var s = confirm("Are you sure to update EMAIL TEMPLATE!");
    //if (s == true) {
    bootbox.confirm("Are you sure to update EMAIL TEMPLATE!", function (result) {
        if (result) {
            $.LoadingOverlay("show");
            var createData = {
                UpdateEmailID: sVEmailID,
                UpdateData: $('#UpdateData').val(),
                UpdateTemplateName: $('#UpdateTemplateName').val(),
                UpdateEmailSource: $('#UpdateEmailSource').val(),
                UpdateDescription: $('#UpdateDescription').val(),
                UpdateSubjectName: $('#UpdateSubjectName').val()
            };

            $.ajax({
                url: '/MailTemplate/saveEdit',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(createData),
                dataType: 'json',
                success: function (data) {
                    if (data.Result = "OK") {
                        $("#templateTbl").trigger("reloadGrid");
                        //toastr["success"](data.Message);
                        $.LoadingOverlay("hide");
                        bootbox.dialog({
                            message: data.Message,
                            title: "<i class='fa fa-info-circle'></i>" + "Info",
                            buttons: {
                                ok: {
                                    label: "OK",
                                    className: "btn-success",
                                    callback: function () {
                                    }
                                }
                            }
                        });
                    }
                    else {
                        $.LoadingOverlay("hide");
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                    toastr["error"](errorThrown);
                }
            });
        }
    });
});
