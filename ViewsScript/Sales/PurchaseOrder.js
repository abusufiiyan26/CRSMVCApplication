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

    $('#QuotationGridTbl').jtable({
        title: 'Quotation List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'PO_Number Desc',
        actions: {
            listAction: '../NewUploadPO/QuotationGetRecords'
        },
        fields: {
            PO_Number: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: false,
                width: '5%'
            },
            PO_No: {
                title: 'PO Number',
                list: true
            },
            PO_Date: {
                title: 'PO Date',
                width: '8%',
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
            ProjectName: {
                title: 'Project',
                width: '15%',
                list: true
            },
            PO_TotalQuantity: {
                title: 'Cert Quantity',
                width: '8%',
                list: true,
                display: function (data) {
                    return '<div style="text-align:right">' + data.record.PO_TotalQuantity + '</div>';
                }
            },
            PO_DetailsQuantity: {
                title: 'SSL Quantity',
                width: '8%',
                list: true,
                display: function (data) {
                    return '<div style="text-align:right">' + data.record.PO_DetailsQuantity + '</div>';
                }
            },
            Price: {
                title: 'PO Price',
                list: true,
                display: function (data) {
                    return '<div style="text-align:right">' + data.record.Price + '</div>';
                }
            },
            Status: {
                title: 'Status',
                list: true,
                width: '8%',
                options: { '1': 'Pending', '2': 'Complete' }
            },
            CustomAction2: {
                title: 'PO',
                width: '5%',
                list: true,
                display: function (data) {
                    return '<div class="badge badge-warning" style="cursor:pointer" onclick=\"getPOViewData(' + data.record.PO_Number + ')\">View PO</div>';
                    //return "<div class='badge badge-warning' style='cursor:pointer' onclick=\"getPOViewData('" + rowData[i].PO_Number + "')\">View PO</div>"
                }
            }
        }
    });

    //Load project list from server
    $('#QuotationGridTbl').jtable('load');
});

$("#btnToFind").click(function () {
    $('#QuotationGridTbl').jtable('load', {
        DateFrom: $('#DateFrom').val(),
        DateTo: $('#DateTo').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

$('#btnCreateQuotation').click(function () {
    //('#formProject')[0].reset();
    window.location.href = "../Quotation/CreateQuotation";
});

function printQuotation(QuotationID) {

    var IDJson = {
        QuotationID: QuotationID
    };

    $.ajax({
        url: '/Quotation/PrintQuotation/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(IDJson),
        dataType: "json",
        success: function (data) {
            if (data.Result == "OK") {
                //$('#IDFileViewer').attr('src', data.ImageURL);
                //$("#IDFileViewer").attr("src", data.ImageURL);
                //$('.modal-content').css('height', $(window).height() * 0.9);
                //$('#ViewDocModal').show();
                window.open(data.ImageURL, '_blank');
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function () {
        }
    });
}

function UploadPO(QuotationID) {
    window.location.href = "../NewUploadPO/UploadPO?vCode=" + QuotationID;
}

function getPOViewData(data) {

    var POIDJson = {
        PONumber: data
    };

    $.ajax({
        url: '/Invoice/GetPOUpload',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(POIDJson),
        dataType: "json",
        success: function (data) {
            if (data.Result == "OK") {
                window.open(data.POUrl, '_blank');
            } else {
                $("#invoiceCreditTable").trigger("reloadGrid");
                bootbox.dialog({
                    message: data.Message,
                    title: "<i class='fa fa-info-circle'></i>" + "STATUS",
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
        },
        error: function (errorThrown) {
        }
    });
}

$('#btnCreateUploadPO').click(function () {
    window.location.href = "../NewUploadPO/UploadPO?vCode=0";
});
