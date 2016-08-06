var UpdateRNO = "";

$(document).ready(function () {

    //$('#DOB').datepicker(
    //{
    //    changeMonth: true,
    //    yearRange: "-100:+0",
    //    changeYear: true,
    //    autoclose: true
    //});

    $('#DDCJtable').jtable({
        title: 'List Of Data Collection',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'Module ASC',
        recordsLoaded: function (event, data) {
            var rowCount = data.records.length;
            if (rowCount >= 1) {
                $('#DDCJtable').find('.jtable-toolbar-item.jtable-toolbar-item-add-record').remove();
            }
        },
        actions: {
            listAction: '../DefaultDataCollection/DDCList',
            //function (postData, jtParams) {
            //    console.log("Loading from custom function...");
            //    return $.Deferred(function ($dfd) {
            //        $.ajax({
            //            url: '/UserAdmin/UsersList?roleID=0 &jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
            //            type: 'POST',
            //            dataType: 'json',
            //            data: postData,
            //            success: function (data) {
            //                $dfd.resolve(data);
            //            },
            //            error: function () {
            //                $dfd.reject();
            //            }
            //        });
            //    });
            //},
           // deleteAction: '../DefaultDataCollection/DDCDeleteAction'
        },
        fields: {
            RNO: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            Custom: {
                title: '',
                width: '1%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        return '<div class="fa fa-search" style="color:green; cursor:pointer; font-size:13px" onclick=\"getView(' + data.record.RNO + ')\"></div>';
                    }
                }
            },
            Module: {
                title: 'Module',
                width: '13%'
            },
            KeyData: {
                list: true,
                create: false,
                edit: false,
                title: 'Key Data',
                width: '10%'
            },
            Value: {
                title: 'Value',
                width: '15%',
                edit: false
            },
            KeyValue: {
                title: 'Key Value',
                width: '15%',
                edit: false
            },
            CustomAction: {
                title: '',
                width: '1%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        return '<button title="Edit Record" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdate(' + data.record.RNO + ')\; return false;"><span>Edit Record</span></button>';
                    }
                }
            }
        }
        //formCreated: function (event, data) {
        //    data.form.children(':lt(11)').wrapAll('<div class="col1"/>');
        //    data.form.children(':gt(0)').wrapAll('<div class="col2"/>');
        //}
    });

    $('#DDCJtable').jtable('load');
});

$("#btnToFind").click(function () {
    $('#DDCJtable').jtable('load', {
        //roleID: $('#SearchRoleID').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

$('#btnCreateData').click(function () {
    $('#formCreateDDC')[0].reset();
    $('#CreateDDCModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});

$('#btnSaveCreate').click(function () {

    var formCreateDDC = $("#formCreateDDC");

    formCreateDDC.validate({
        rules: {
            Module: {
                required: true
            },
            KeyData: {
                required: true
            },
            Value: {
                required: true
            },
            KeyValue: {
                required: true
            }
        },
        messages: {
            Module: {
                required: "Module is required"
            },
            KeyData: {
                required: "KeyData is required"
            },
            Value: {
                required: "Value is required"
            },
            KeyValue: {
                required: "KeyValue is required"
            }
        }
    });

    if (formCreateDDC.valid()) {
        var $btn = $(this).button('loading')

        var CreateDDCJson = {
            Module: $('#Module').val(),
            KeyData: $('#KeyData').val(),
            Value: $('#Value').val(),
            KeyValue: $('#KeyValue').val()
        };

        $.ajax({
            url: '/DefaultDataCollection/DDCCreateAction',
            type: 'POST',
            cache: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(CreateDDCJson),
            dataType: 'json',
            success: function (data) {
                if (data.Result = "OK") {
                    toastr["success"](data.Message);
                    $btn.button('reset')
                    $('#formCreateDDC').modal('hide');
                    $('#DDCJtable').jtable('load');
                }
                else {
                    toastr["error"](data.Message);
                    $btn.button('reset')
                }
            },
            error: function (errorThrown) {
                toastr["error"](errorThrown);
            }
        });
    }

});

$('#btnSaveUpdate').click(function () {

    var formUpdateDDC = $("#formUpdateDDC");

    formUpdateDDC.validate({
        rules: {
            UpdateModule: {
                required: true
            },
            UpdateKeyData: {
                required: true
            },
            UpdateValue: {
                required: true
            },
            UpdateKeyValue: {
                required: true
            }
        },
        messages: {
            UpdateModule: {
                required: "Module is required"
            },
            UpdateKeyData: {
                required: "KeyData is required"
            },
            UpdateValue: {
                required: "Value is required"
            },
            UpdateKeyValue: {
                required: "KeyValue is required"
            }
        }
    });

    if (formUpdateDDC.valid()) {
        var $btn = $(this).button('loading')

        var UpdateDDCJson = {
            Module: $('#UpdateModule').val(),
            KeyData: $('#UpdateKeyData').val(),
            Value: $('#UpdateValue').val(),
            KeyValue: $('#UpdateKeyValue').val(),
            RNO: UpdateRNO
        };

        $.ajax({
            url: '/DefaultDataCollection/DDUpdateAction',
            type: 'POST',
            cache: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(UpdateDDCJson),
            dataType: 'json',
            success: function (data) {
                if (data.Result = "OK") {
                    toastr["success"](data.Message);
                    $btn.button('reset')
                    $('#formUpdateDDC').modal('hide');
                    $('#DDCJtable').jtable('load');
                }
                else {
                    toastr["error"](data.Message);
                    $btn.button('reset')
                }
            },
            error: function (errorThrown) {
                toastr["error"](errorThrown);
            }
        });
    }

});

//REGION FOR UPDATE
function getUpdate(RNO) {

    var vRNO = RNO;

    $.ajax({
        url: '../DefaultDataCollection/DDCGetAction/',
        type: "POST",
        data: { RNO: vRNO },
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.Status == "OK") {
                $('#UpdateModule').val(data.List.Module);
                $('#UpdateKeyData').val(data.List.KeyData);
                $('#UpdateValue').val(data.List.Value);
                $('#UpdateKeyValue').val(data.List.KeyValue);
                UpdateRNO = data.List.RNO;

                $('#UpdateDDCModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function () {
        }
    });
}

//GET USER VIEW
function getView(RNO) {

    var vRNO = RNO;

    $.ajax({
        url: '../DefaultDataCollection/DDCGetAction/',
        type: "POST",
        data: { RNO: vRNO },
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.Status == "OK") {
                $('#ViewModule').html(data.List.Module);
                $('#ViewKeyData').html(data.List.KeyData);
                $('#ViewValue').html(data.List.Value);
                $('#ViewKeyValue').html(data.List.KeyValue);;

                $('#ViewDDCModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function () {
        }
    });
}
