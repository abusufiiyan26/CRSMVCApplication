
$(document).ready(function () {

    $('#POCompleteGridTbl').jtable({
        title: 'List of Work Order (Complete)',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'PO_Number DESC',
        actions: {
            listAction: '../NewWorkOrder/POGetCompleteRecords'
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
                width: '8%',
                list: true
            },
            PO_Date: {
                title: 'PO Date',
                width: '8%',
                list: true,
                display: function (data) {
                    return moment(data.record.PO_Date).format('DD-MMMM-Y');
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
                title: 'Quantity PKI',
                list: true
            },
            PO_DetailsQuantity: {
                title: 'Quantity SSL',
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
                width: '5%'
            },
        }
    });

    //Load project list from server
    $('#POCompleteGridTbl').jtable('load');
});
