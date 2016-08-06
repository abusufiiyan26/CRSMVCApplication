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

    $('#AuditTrailLoginTbl').jtable({
        title: 'Audit Trail',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'LoginTimestamp ASC',
        actions: {
            listAction: '/Admin/AuditLoginList'
        },
        fields: {
            AuditLogID: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            ICNo: {
                list: true,
                title: 'IC No',
                width: '10%'
            },
            Name: {
                list: true,
                title: 'Name',
                width: '15%'
            },
            LoginTimestamp: {
                title: 'Login',
                width: '16%',
                display: function (data) {
                    return moment(data.record.LoginTimestamp).format('ddd, DD-MMMM-YY, hh:mm A');
                }
            },
            LoginOutTimestamp: {
                title: 'Logout',
                width: '16%',
                display: function (data) {
                    if (data.record.LoginOutTimestamp != null){
                        return moment(data.record.LoginOutTimestamp).format('ddd, DD-MMMM-YY, hh:mm A');
                    }
                }
            }
        },
        formCreated: function (event, data) {
            data.form.children(':lt(11)').wrapAll('<div class="col1"/>');
            data.form.children(':gt(0)').wrapAll('<div class="col2"/>');
        }
    });

    $('#AuditTrailLoginTbl').jtable('load');
});

//$("#actionID").change(function () {
//    $('#AuditTrailLoginTbl').jtable('load', {
//        ActionType: $('#actionID').val(),
//        ValueSearch: $('#LoginSearchID').val(),
//        ValueToFind: $('#inputFindID').val()
//    });
//});

$("#btnLoginToFind").click(function () {
    $('#AuditTrailLoginTbl').jtable('load', {
        ActionType: $('#actionID').val(),
        ValueSearch: $('#LoginSearchID').val(),
        ValueToFind: $('#inputFindID').val()
    });
});