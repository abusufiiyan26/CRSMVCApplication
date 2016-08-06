var vSNOUpdate = "";

$(document).ready(function () {

    $('#DateFrom').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    $('#DateTo').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    $('#POGridTbl').jtable({
        title: 'List of Active Work Order',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'PO_Number DESC',
        actions: {
            listAction: '../NewWorkOrder/POGetRecords'
        },
        fields: {
            PO_Number: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: false
            },
            PO_No: {
                title: 'PO Number',
                width: '10%',
                list: true
            },
            PO_Date: {
                title: 'PO Date',
                width: '10%',
                list: true,
                display: function (data) {
                    return moment(data.record.PO_Date).format('DD-MMMM-YYYY');
                }
            },
            CompanyName: {
                title: 'Customer',
                width: '15%',
                list: true
            },
            PO_TotalQuantity: {
                title: 'Quantity PKI',
                width: '11%',
                list: true
            },
            PO_DetailsQuantity: {
                title: 'Quantity SSL',
                width: '11%',
                list: true
            },
            PO_InPKI: {
                title: 'In_PKI',
                width: '5%',
                list: true
            },
            PO_InSSL: {
                title: 'In_SSL',
                width: '5%',
                list: true
            },
            PO_OutPKI: {
                title: 'Out_PKI',
                width: '5%',
                list: true
            },
            PO_OutSSL: {
                title: 'Out_SSL',
                width: '5%',
                list: true
            },
            Price: {
                title: 'Price(RM)',
                list: true,
                width: '5%',
                display: function (data) {
                    return '<div style="text-align:right">' + data.record.Price + '</div>';
                }
            },
            CustomAction2: {
                title: '',
                width: '2%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record.RequestPKIStatus != 1) {
                        return '<img title="Request PKI" style="cursor:pointer;width:30px" onclick=\"RequestPKIAction(' + data.record.PO_Number + ')\" src="../Images/Logo/pkiicon.png" />';
                    }
                }
            },
            CustomAction: {
                title: '',
                width: '2%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record.RequestSSLStatus != 1) {
                        return '<img title="Request SSL" style="cursor:pointer;width:40px" onclick=\"RequestSSLAction(' + data.record.PO_Number + ')\" src="../Images/Logo/sslicon.png" />';
                    }
                }
            }
        }
    });

    //Load project list from server
    $('#POGridTbl').jtable('load');
});

$("#btnToFind").click(function () {
    $('#POGridTbl').jtable('load', {
        DateFrom: $('#DateFrom').val(),
        DateTo: $('#DateTo').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});
function RequestPKIAction(PoNumberID) {

    var IDJson = {
        PoNumberID: PoNumberID
    };

    $.ajax({
        url: '/UploadPO/getPODetailsToRedirectPKI',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(IDJson),
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.Result == "OK") {
                //window.location.href = data.UrlRedirect;
                window.open(data.UrlRedirect, '_blank');
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function () {
        }
    });
    $('#POGridTbl').jtable('load');
}
function RequestSSLAction(PoNumberID) {

    var IDJson = {
        PoNumberID: PoNumberID
    };

    $.ajax({
        url: '/UploadPO/getPODetailsToRedirectSSL',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(IDJson),
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.Result == "OK") {
                //window.location.href = data.UrlRedirect;
                window.open(data.UrlRedirect, '_blank');
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function () {
        }
    });
    $('#POGridTbl').jtable('load');
}
function RequestView(PoNumberID) {

    var IDReqJson = {
        PoNumberID: PoNumberID
    };

    $.ajax({
        url: '/UploadPO/getPODetailsToDisplay',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(IDReqJson),
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.Result == "OK") {
                //window.location.href = data.UrlRedirect;
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function () {
        }
    });
    $('#POGridTbl').jtable('load');
}