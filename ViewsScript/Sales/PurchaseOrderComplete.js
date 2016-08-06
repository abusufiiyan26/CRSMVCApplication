$(document).ready(function () {

    //$('#DateFrom').datepicker(
    //{
    //    changeMonth: true,
    //    yearRange: "-100:+0",
    //    changeYear: true,
    //    autoclose: true
    //});

    //$('#DateTo').datepicker(
    //{
    //    changeMonth: true,
    //    yearRange: "-100:+0",
    //    changeYear: true,
    //    autoclose: true
    //});

    $('#POCompleteGridTbl').jtable({
        title: 'List of Purchase Order',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'PO_Number Desc',
        actions: {
            listAction: '../NewUploadPO/ActivePOGetRecords'
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
    $('#POCompleteGridTbl').jtable('load');

});

$("#btnToFind").click(function () {
    $('#POCompleteGridTbl').jtable('load', {
        DateFrom: $('#DateFrom').val(),
        DateTo: $('#DateTo').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});
