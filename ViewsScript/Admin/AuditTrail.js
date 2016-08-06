$(document).ready(function () {

    $('#DOB').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    var actionID = $("#actionID");

    $.ajax({
        url: '../Admin/GetActionType/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.ActionTypeDB, function (i, val) {
                actionID.append(
                    $("<option></option>").val(val.ActionType).html(val.ActionType)
                );
            });
        },
        error: function () {
        }
    });

    var cachedCountryOptions = null;

    $('#AuditTrailTbl').jtable({
        title: 'Audit Trail',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'LoginTimestamp ASC',
        actions: {
            listAction: '/Admin/AuditList'
        },
        fields: {
            AuditLogID: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            LoginTimestamp: {
                title: 'Transaction Date',
                width: '16%',
                display: function (data) {
                    return moment(data.record.LoginTimestamp).format('ddd, DD-MMMM-YY, hh:mm A');
                }
            },
            ICNo: {
                list: true,
                title: 'IC No',
                width: '8%'
            },
            Module: {
                title: 'Module',
                width: '9%'
            },
            ActionType: {
                title: 'Action',
                width: '15%'
            },
            BrowserType: {
                title: 'Browser Type',
                width: '15%'
            },
            Description: {
                title: 'Description',
                width: '33%'
            }
        },
        formCreated: function (event, data) {
            data.form.children(':lt(11)').wrapAll('<div class="col1"/>');
            data.form.children(':gt(0)').wrapAll('<div class="col2"/>');
        }
    });

    $('#AuditTrailTbl').jtable('load');
});

//$("#actionID").change(function () {
//    $('#AuditTrailTbl').jtable('load', {
//        ActionType: $('#actionID').val(),
//        ValueSearch: $('#searchID').val(),
//        ValueToFind: $('#findID').val()
//    });
//});

$("#btnToFind").click(function () {
    $('#AuditTrailTbl').jtable('load', {
        ActionType: $('#actionID').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});