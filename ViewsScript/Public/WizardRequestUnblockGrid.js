
var sRequestIDvNew = "";

$(function () {

    var grid_selector = "#unblockPublicTbl";
    var pager_selector = "#unblockPublicFooter";
    var l = "";

    var getColumnIndexByName = function (grid_selector, columnName) {
        var cm = $(grid_selector).jqGrid('getGridParam', 'colModel');
        for (var i = 0, l = cm.length; i < l; i++) {
            if (cm[i].name === columnName) {
                return i; // return the index
            }
        }
        return -1;
    };

    function getCellValue(rowId, cellId) {
        var cell = $('#' + 'grid-table' + '_' + cellId);
        var val = cell.val;
        return val;
    }

    $(grid_selector).jqGrid({
        url: '/Public/GetRequestUnblockList',
        datatype: "json",
        mtype: 'post',
        height: '350px',
        colNames: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Name', 'Project', 'Organization', 'Media', 'Serial No', 'Action'],
        colModel: [
            { name: 'CertificateRequestID', width: '30px', hidden: true, align: 'center', index: 'id', sortable: false, editable: false, key: true },
            { name: 'RequestID', width: '30px', hidden: true, index: 'RequestID', sortable: false, editable: false },
            { name: 'Project_Id', width: '50px', hidden: true, index: 'Project_Id', sortable: false, editable: false },
            { name: 'User_ID', width: '50px', hidden: true, index: 'User_ID', sortable: false, editable: false },
            { name: 'CompanyID', width: '50px', hidden: true, index: 'CompanyID', sortable: false, editable: false },
            // Hidden show in user details modal
            { name: 'ICNo', width: '50px', hidden: true, index: 'ICNo', sortable: false, editable: false },
            { name: 'IDType', width: '50px', hidden: true, index: 'IDType', sortable: false, editable: false },
            { name: 'Address', width: '50px', hidden: true, index: 'Address', sortable: false, editable: false },
            { name: 'City', width: '50px', hidden: true, index: 'City', sortable: false, editable: false },
            { name: 'Postcode', width: '50px', hidden: true, index: 'Postcode', sortable: false, editable: false },
            { name: 'State', width: '50px', hidden: true, index: 'State', sortable: false, editable: false },
            { name: 'Country', width: '50px', hidden: true, index: 'Country', sortable: false, editable: false },
            { name: 'Email', width: '50px', hidden: true, index: 'Email', sortable: false, editable: false },
            { name: 'Mobile_No', width: '50px', hidden: true, index: 'Mobile_No', sortable: false, editable: false },
            { name: 'C_Address', width: '50px', hidden: true, index: 'C_Address', sortable: false, editable: false },
            { name: 'C_City', width: '50px', hidden: true, index: 'C_City', sortable: false, editable: false },
            { name: 'C_Postcode', width: '50px', hidden: true, index: 'C_Postcode', sortable: false, editable: false },
            { name: 'C_State', width: '50px', hidden: true, index: 'C_State', sortable: false, editable: false },
            { name: 'C_Country', width: '50px', hidden: true, index: 'C_Country', sortable: false, editable: false },
            { name: 'C_Mobile_No', width: '50px', hidden: true, index: 'C_Mobile_No', sortable: false, editable: false },
            { name: 'C_Fax_No', width: '50px', hidden: true, index: 'C_Fax_No', sortable: false, editable: false },
            { name: 'PackageName', width: '50px', hidden: true, index: 'PackageName', sortable: false, editable: false },
            { name: 'MediaName', width: '50px', hidden: true, index: 'MediaName', sortable: false, editable: false },
            { name: 'CertificateTypeName', width: '50px', hidden: true, index: 'CertificateTypeName', sortable: false, editable: false },
            { name: 'CertificateType_No_Year', width: '50px', hidden: true, index: 'CertificateType_No_Year', sortable: false, editable: false },
            { name: 'TokenUnblockCode', width: '50px', hidden: true, index: 'TokenUnblockCode', sortable: false, editable: false },

            //COLUMN TO BE APPEAR ON THE GRID
            { name: 'Name', index: 'Name', sortable: false, width: '150px', editable: true },
            { name: 'ProjectName', index: 'ProjectName', sortable: false, width: '150px', editable: true },
            { name: 'CompanyName', index: 'CompanyName', sortable: false, editable: true, width: '200px' },
            { name: 'MediaName', index: 'MediaName', sortable: false, editable: true, width: '100px' },
            { name: 'SerialNumber', index: 'SerialNumber', sortable: false, editable: true, width: '100px' },
            {
                name: 'act', width: '80px', index: 'act', align: 'center'
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumbers: true,
        altRows: true,
        pager: pager_selector,
        sortname: 'CertificateRequestID',
        gridview: true,
        viewrecords: true,
        sortorder: "desc",
        caption: "List of Token",
        autowidth: true,
        shrinkToFit: true,
        height: "auto",
        ajaxRowOptions: {
            success: function () {
                $("#unblockPublicTbl").trigger("reloadGrid");
            }
        },
        gridComplete: function () {
            var ids = jQuery("#unblockPublicTbl").jqGrid('getDataIDs');
            var rowData = jQuery("#unblockPublicTbl").jqGrid('getRowData');
            for (var i = 0; i < ids.length; i++) {
                if (rowData[i].TokenUnblockCode != "") {
                    me = "<div class='badge badge-danger' style='cursor:pointer' onclick=\"updateCancel('" + rowData[i].RequestID + "')\">CANCEL</div>"
                }
                else {
                    me = "<div class='badge badge-success' style='cursor:pointer' onclick=\"updateUnblock('" + rowData[i].RequestID + "')\">UNBLOCK</div>"
                }
                jQuery("#unblockPublicTbl").jqGrid('setRowData', ids[i], { act: me });
            }
        }
    }).navGrid('#unblockPublicFooter', { edit: false, add: false, del: false, search: true, refresh: true, view: false });

    ChangejQGridDesign("#unblockPublicTbl", "#unblockPublicFooter");

    $("#unblockPublicTbl").closest('.ui-jqgrid-bdiv').width($("#unblockPublicTbl").closest('.ui-jqgrid-bdiv').width() + 1);

    //USED FOR NEXT AND PREV BUTTON UI AND WIDTH OF TABLE
    function ChangejQGridDesign(table, pager) {
        var replacement =
        {
            'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
            'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
            'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
            'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
        };

        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

            if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
        });
    }

    jQuery(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
    jQuery(".ui-jqgrid").removeClass("ui-widget-content");
    jQuery(".ui-pg-div").removeClass().addClass("btn btn-sm btn-blue");
    jQuery(".ui-icon.ui-icon-plus").removeClass().addClass("fa fa-plus");
    jQuery(".ui-icon.ui-icon-pencil").removeClass().addClass("fa fa-pencil");
    jQuery(".ui-icon.ui-icon-trash").removeClass().addClass("fa fa-trash-o");
    jQuery(".ui-icon.ui-icon-search").removeClass().addClass("fa fa-search");
    jQuery(".ui-icon.ui-icon-refresh").removeClass().addClass("fa fa-refresh");
    jQuery(".ui-icon.ui-icon-disk").removeClass().addClass("fa fa-save").parent(".btn-primary").removeClass("btn-primary").addClass("btn-success");
    jQuery(".ui-icon.ui-icon-cancel").removeClass().addClass("fa fa-times").parent(".btn-primary").removeClass("btn-primary").addClass("btn-danger");

    jQuery(".ui-icon.ui-icon-seek-prev").wrap("");
    jQuery(".ui-icon.ui-icon-seek-prev").removeClass().addClass("fa fa-backward");

    jQuery(".ui-icon.ui-icon-seek-first").wrap("");
    jQuery(".ui-icon.ui-icon-seek-first").removeClass().addClass("fa fa-fast-backward");

    jQuery(".ui-icon.ui-icon-seek-next").wrap("");
    jQuery(".ui-icon.ui-icon-seek-next").removeClass().addClass("fa fa-forward");

    jQuery(".ui-icon.ui-icon-seek-end").wrap("");
    jQuery(".ui-icon.ui-icon-seek-end").removeClass().addClass("fa fa-fast-forward");

});

function updateUnblock(data) {

    sRequestIDvNew = data;

    $('#AddNewPINModal').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
}

function updateCancel(data) {

    bootbox.confirm("Are you sure to cancel Unblock?", function (result) {
        if (result == true) {

            $.LoadingOverlay("show");

            var JsonID = {
                RequestID: data
            }

            $.ajax({
                url: '/Public/SaveTokenCancel',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(JsonID),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    if (data.Result == "OK") {
                        //toastr["success"](data.Message);
                        $.LoadingOverlay("hide");
                        $("#unblockPublicTbl").trigger("reloadGrid");
                        bootbox.alert(data.Message, function () {
                        });
                    }
                    else {
                        $.LoadingOverlay("hide");
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                    toastr["error"](errorThrown)
                }
            });
        } else {

        }
    });
}

$('#btnTokenUnblock').click(function () {

    if ($('#sNewPin').val() == "" || $('#sNewPin').val() == null) {
        toastr["warning"]("Please enter New PIN");
        return false;
    }
    if ($('#sNewConfirmPin').val() == "" || $('#sNewConfirmPin').val() == null) {
        toastr["warning"]("Please confirm New PIN");
        return false;
    }
    if ($('#sNewPin').val() != $('#sNewConfirmPin').val()) {
        toastr["warning"]("Pin not match");
        return false;
    }
    if ($('#sNewPin').val().length < 8) {
        toastr["warning"]("Minimum length is 8 characters");
        return false;
    }

    bootbox.confirm("Are you sure to unblock this Token?", function (result) {
        if (result == true) {

            $.LoadingOverlay("show");

            var JsonID = {
                RequestID: sRequestIDvNew,
                NewPIN: $('#sNewPin').val()
            }

            $.ajax({
                url: '/Public/SaveTokenUnblock',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(JsonID),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    if (data.Result == "OK") {
                        $.LoadingOverlay("hide");
                        $("#unblockPublicTbl").trigger("reloadGrid");
                        window.location.href = data.UrlRed;
                    }
                    else if (data.Result == "WARNING") {
                        $.LoadingOverlay("hide");
                        toastr["error"](data.Message);
                    }
                    else {
                        $.LoadingOverlay("hide");
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    $.LoadingOverlay("hide");
                    toastr["error"](errorThrown)
                }
            });
        } else {
        }
    });

});