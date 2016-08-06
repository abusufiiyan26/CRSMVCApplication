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

    $('#QuotationProjectGridTbl').jtable({
        title: 'Quotation List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'QuotationID ASC',
        actions: {
            listAction: '../Quotation/QPGetProjectRecords'
        },
        fields: {
            QuotationID: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: true
            },
            QuotationNum: {
                title: 'Quotation No',
                //width: '23%',
                list: true
            },
            ProjectName: {
                title: 'Project Name',
                //width: '23%',
                list: true
            },
            Name: {
                title: 'Customer Name',
                width: '23%',
                list: true
            },
            GrandPrice: {
                title: 'Total Price(RM)',
                list: true
            },
            QuotationDate: {
                title: 'Quotation Date',
                list: true,
                type: 'date',
            },
            Status: {
                title: 'Status',
                list: true
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
                        return '<button title="Print Quotation" class="jtable-command-button jtable-edit-command-button" onclick=\"printQuotation(' + data.record.QuotationID + ')\; return false;"><span>Edit Record</span></button>';
                    }
                }
            },
            CustomAction2: {
                title: '',
                width: '1%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        return '<button title="Revise Quotation" class="jtable-command-button jtable-edit-command-button" onclick=\"reviseQuotation(' + data.record.QuotationID + ')\; return false;"><span>Edit Record</span></button>';
                    }
                }
            }
        }
    });

    //Load project list from server
    $('#QuotationProjectGridTbl').jtable('load');
});

$("#btnToFind").click(function () {
    $('#QuotationProjectGridTbl').jtable('load', {
        DateFrom: $('#DateFrom').val(),
        DateTo: $('#DateTo').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

$('#btnQPCreateQuotation').click(function () {
    window.location.href = "../Quotation/QPCreateQuotation";
});

function getUpdate(ProID) {
    window.location.href = "../Quotation/ProjectUpdate?ID=" + ProID;
}

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
                window.open(data.ImageURL, '_blank');
            } else {
                toastr["error"](data.Message);
            }
        },
        error: function () {
        }
    });
}

function reviseQuotation(QuotationID) {
    window.location.href = "../Quotation/ReviseQuotation?vCode=" + QuotationID;
}

$("#Close").click(function () {
    $('#ViewDocModal').hide();
});
