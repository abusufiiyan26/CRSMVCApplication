
$(function () {
    var grid_selector2 = "#APReqApprovedTable";
    var pager_selector2 = "#APReqApprovedFooter";

    var getColumnIndexByName = function (grid_selector2, columnName) {
        var cm = $(grid_selector2).jqGrid('getGridParam', 'colModel');
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

    $(grid_selector2).jqGrid({
        url: '/APApproval/getAPApprovedData',
        datatype: "json",
        colNames: ['ID', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Name', 'IC No / Passport', 'Company Name', 'Package Name', 'Approved By', 'Approved Date'],
        colModel: [
            {
                name: 'CertificateRequestID', width: '50px', hidden: true, index: 'id', sortable: false, editable: false, key: true
            },
            {
                name: 'Project_Id', width: '50px', hidden: true, index: 'Project_Id', sortable: false, editable: false
            },
            {
                name: 'User_ID', width: '50px', hidden: true, index: 'IDType', sortable: false, editable: false
            },
            {
                name: 'IDType', width: '50px', hidden: true, index: 'IDType', sortable: false, editable: false
            },
            {
                name: 'Address', width: '50px', hidden: true, index: 'Address', sortable: false, editable: false
            },
            {
                name: 'City', width: '50px', hidden: true, index: 'City', sortable: false, editable: false
            },
            {
                name: 'Postcode', width: '50px', hidden: true, index: 'Postcode', sortable: false, editable: false
            },
            {
                name: 'State', width: '50px', hidden: true, index: 'State', sortable: false, editable: false
            },
            {
                name: 'Country', width: '50px', hidden: true, index: 'Country', sortable: false, editable: false
            },
            {
                name: 'Email', width: '50px', hidden: true, index: 'Email', sortable: false, editable: false
            },
            {
                name: 'Mobile_No', width: '50px', hidden: true, index: 'Mobile_No', sortable: false, editable: false
            },
            {
                name: 'C_Address', width: '50px', hidden: true, index: 'C_Address', sortable: false, editable: false
            },
            {
                name: 'RegistrationNo', width: '50px', hidden: true, index: 'RegistrationNo', sortable: false, editable: false
            },
            {
                name: 'C_City', width: '50px', hidden: true, index: 'C_City', sortable: false, editable: false
            },
            {
                name: 'C_Postcode', width: '50px', hidden: true, index: 'C_Postcode', sortable: false, editable: false
            },
            {
                name: 'C_State', width: '50px', hidden: true, index: 'C_State', sortable: false, editable: false
            },
            {
                name: 'C_Country', width: '50px', hidden: true, index: 'C_Country', sortable: false, editable: false
            },
            {
                name: 'C_Mobile_No', width: '50px', hidden: true, index: 'C_Mobile_No', sortable: false, editable: false
            },
            {
                name: 'C_Fax_No', width: '50px', hidden: true, index: 'C_Fax_No', sortable: false, editable: false
            },
            {
                name: 'MediaName', width: '50px', hidden: true, index: 'MediaName', sortable: false, editable: false
            },
            {
                name: 'MediaID', width: '50px', hidden: true, index: 'MediaID', sortable: false, editable: false
            },
            {
                name: 'CertificateTypeName', width: '50px', hidden: true, index: 'CertificateTypeName', sortable: false, editable: false
            },
            {
                name: 'CertificateType_No_Year', width: '50px', hidden: true, index: 'CertificateType_No_Year', sortable: false, editable: false
            },

            //COLUMN TO BE APPEAR ON THE GRID
            { name: 'Name', width: '170px', sortable: true, index: 'Name', editable: true, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }, sorttype: 'string', searchoptions: { sopt: ['eq', 'bw', 'bn', 'cn', 'nc', 'ew', 'en'] } },
            { name: 'ICNo', index: 'ICNo', width: '160px', sortable: true, align: 'center', editable: true, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
            { name: 'CompanyName', width: '170px', index: 'CompanyName', sortable: true, editable: true, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
            { name: 'PackageName', width: '170px', index: 'PackageName', sortable: true, editable: true, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
            { name: 'ROICNo', index: 'ROICNo', align: 'center', width: '110px', sortable: true, editable: true },
            {
                name: 'RO_ApprovedDate', index: 'RO_ApprovedDate', formatter: "date", align: 'center', sortable: true, editable: true, width: '140px',
                formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y h:i A" }
            }
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumbers: true,
        altRows: true,
        pager: pager_selector2,
        sortname: 'CertificateRequestID',
        gridview: true,
        viewrecords: true,
        sortorder: "desc",
        caption: "AP Request Approved",
        autowidth: true,
        shrinkToFit: true,
        height: 'auto',
        ajaxRowOptions: {
            success: function () {
                $("#APReqApprovedTable").trigger("reloadGrid");
            }
        }
    }).navGrid('#APReqApprovedFooter', { edit: false, add: false, del: false, search: true, refresh: true, view: false });

    $("#APReqApprovedTable").closest('.ui-jqgrid-bdiv').width($("#APReqApprovedTable").closest('.ui-jqgrid-bdiv').width() + 1);

    ChangejQGridDesign("#APReqApprovedTable", "#APReqApprovedFooter");
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
    jQuery(".ui-pg-div").removeClass().addClass("btn btn-sm btn-primary");
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
