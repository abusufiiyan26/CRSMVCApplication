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

    $('#ProjectQuotationGridTbl').jtable({
        title: 'Quotation List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'QuotationID Desc',
        actions: {
            listAction: '../NewQuotation/ProjectQuotationGetRecords'
        },
        fields: {
            QuotationID: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: false,
                width: '5%'
            },
            QuotationNum: {
                title: 'Quotation No',
                //width: '23%',
                list: true
            },
            CompanyName: {
                title: 'Company Name',
                width: '17%',
                list: true
            },
            Name: {
                title: 'Contact Person Name',
                width: '17%',
                list: true
            },
            GrandPrice: {
                title: 'Total Price (RM)',
                list: true,
                display: function (data) {
                    return '<div style="text-align:right">' + data.record.GrandPrice + '</div>';
                }
            },
            QuotationDate: {
                title: 'Quotation Date',
                list: true,
                display: function (data) {
                    return '<div style="text-align:center">' + moment(data.record.LoginTimestamp).format('DD-MMMM-YYYY') + '</div>';
                }
            },
            Status: {
                title: 'Status',
                list: true,
                
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
                        return '<img title="Print Quotation" style="cursor:pointer;width:20px" onclick=\"printProjectQuotation(' + data.record.QuotationID + ')\" src="../Images/Icon-Print.png" />';
                    }
                }
            },
           
        }
    });

    //Load project list from server
    $('#ProjectQuotationGridTbl').jtable('load');
});

$("#btnToFind").click(function () {
    $('#ProjectQuotationGridTbl').jtable('load', {
        DateFrom: $('#DateFrom').val(),
        DateTo: $('#DateTo').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

$('#btnCreateProjectQuotation').click(function () {
    window.location.href = "../NewQuotation/CreateProjectQuotation";
});

function getUpdate(ProID) {
    window.location.href = "../NewQuotation/ProjectUpdate?ID=" + ProID;
}

function printProjectQuotation(QuotationID) {

    var IDJson = {
        QuotationID: QuotationID
    };

    $.ajax({
        url: '/NewQuotation/printProjectQuotation/',
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

function reviseGeneralQuotation(QuotationID) {
    window.location.href = "../NewQuotation/ReviseQuotation?vCode=" + QuotationID;
}
