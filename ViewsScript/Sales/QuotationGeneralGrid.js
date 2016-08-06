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

    $('#GeneralQuotationGridTbl').jtable({
        title: 'Quotation List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'GeneralQuotationID Desc',
        actions: {
            listAction: '../NewQuotation/GeneralQuotationGetRecords'
        },
        fields: {
            GeneralQuotationID: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: false,
                width: '5%'
            },
            Exams: {
                title: '',
                width: '1%',
                sorting: false,
                edit: false,
                create: false,
                display: function (Data) {
                    var $img = $('<img src="/Images/list.png" title="Revise General Quotation" />');
                    if (Data.record.QuotationID != null) {
                        //Create an image that will be used to open child table
                        //Open child table when user clicks the image
                        $img.click(function () {
                            $('#GeneralQuotationGridTbl').jtable('openChildTable',
                                    $img.closest('tr'), //Parent row
                                    {
                                        title: Data.record.QuotationNum + ' - Revised Quotation',
                                        defaultSorting: 'QuotationID Desc',
                                        actions: {
                                            listAction: '/NewQuotation/QuotationGetChildRecords?QuotationID=' + Data.record.GeneralQuotationID
                                        },
                                        fields: {
                                            GeneralQuotationID: {
                                                key: true,
                                                create: false,
                                                edit: false,
                                                del: false,
                                                list: false,
                                                width: '5%'
                                            },
                                            GeneralQuotationNum: {
                                                title: 'Quotation No',
                                                //width: '23%',
                                                list: true
                                            },
                                            CompanyName: {
                                                title: 'Company Name',
                                                width: '23%',
                                                list: true
                                            },
                                            Name: {
                                                title: 'Contact Person Name',
                                                list: true
                                            },
                                            GrandPrice: {
                                                title: 'Total Price (RM)',
                                                list: true,
                                                display: function (data) {
                                                    return '<div style="text-align:right">' + data.record.sGrandPrice + '</div>';
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
                                                        //return '<button title="Print Quotation" style="cursor:pointer;width:20px" onclick=\"printQuotation(' + data.record.QuotationID + ')\" src="../Images/Icon-Print.png" />';
                                                        return '<img title="Print Quotation" style="cursor:pointer;width:20px" onclick=\"printGeneralQuotation(' + data.record.QuotationID + ')\" src="../Images/Icon-Print.png" />';
                                                    }
                                                }
                                            }
                                        }
                                    }, function (data) { //opened handler
                                        data.childTable.jtable('load');
                                    });
                        });
                        //Return image to show on the person row
                    }
                    return $img;
                }
            },
            GeneralQuotationNum: {
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
                        return '<img title="Print Quotation" style="cursor:pointer;width:20px" onclick=\"printGeneralQuotation(' + data.record.GeneralQuotationID + ')\" src="../Images/Icon-Print.png" />';
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
                        //return '<button title="Revise Quotation" class="jtable-command-button jtable-edit-command-button" onclick=\"reviseGeneralQuotation(' + data.record.GeneralQuotationID + ')\; return false;"><span>Edit Record</span></button>';
                        return '<img title="Revise Quotation" style="cursor:pointer;width:25px" onclick=\"reviseGeneralQuotation(' + data.record.GeneralQuotationID + ')\" src="../Images/icon/edit.png" />';
                    }
                }
            }
        }
    });

    //Load project list from server
    $('#GeneralQuotationGridTbl').jtable('load');
});

$("#btnToFind").click(function () {
    $('#GeneralQuotationGridTbl').jtable('load', {
        DateFrom: $('#DateFrom').val(),
        DateTo: $('#DateTo').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

$('#btnCreateGeneralQuotation').click(function () {
    window.location.href = "../NewQuotation/CreateGeneralQuotation";
});

function getUpdate(ProID) {
    window.location.href = "../NewQuotation/ProjectUpdate?ID=" + ProID;
}

function printGeneralQuotation(QuotationID) {

    var IDJson = {
        QuotationID: QuotationID
    };

    $.ajax({
        url: '/NewQuotation/printGeneralQuotation/',
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
