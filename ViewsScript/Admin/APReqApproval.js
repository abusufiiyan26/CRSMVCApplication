var signForm = $("#signForm");
var cIDvHide = $("#cIDvHide");

$(function () {
    var Verification_Grid = "#APReqApprovalTable";
    var Verification_Footer = "#APReqApprovalFooter";
    var hidename = "";
    var hidememail = "";
    var userid = "";

    var Verification_GetColumnIndexByName = function (Verification_Grid, Verification_ColumnName) {
        var cm = $(Verification_Grid).jqGrid('getGridParam', 'colModel');
        for (var i = 0, l = cm.length; i < l; i++) {
            if (cm[i].name === Verification_ColumnName) {
                return i; // return the index
            }
        }
        return -1;
    };

    function Verification_GetCellValue(rowId, cellId) {
        var cell = $('#' + 'grid-table' + '_' + cellId);
        var val = cell.val;
        return val;
    }

    $(Verification_Grid).jqGrid({
        url: '/APApproval/getAPRequestData',
        datatype: "json",
        colNames: ['ID', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Name', 'IC No / Passport', 'Company Name', 'Package Name', 'Request Type', 'Request Date', 'Action'],
        colModel: [
            { name: 'CertificateRequestID', width: '50px', hidden: true, index: 'id', sortable: false, editable: false, key: true },
            { name: 'Project_Id', width: '50px', hidden: true, index: 'Project_Id', sortable: false, editable: false },
            { name: 'User_ID', width: '50px', hidden: true, index: 'IDType', sortable: false, editable: false },
            { name: 'IDType', width: '50px', hidden: true, index: 'IDType', sortable: false, editable: false },
            { name: 'Address', width: '50px', hidden: true, index: 'Address', sortable: false, editable: false },
            { name: 'City', width: '50px', hidden: true, index: 'City', sortable: false, editable: false },
            { name: 'Postcode', width: '50px', hidden: true, index: 'Postcode', sortable: false, editable: false },
            { name: 'State', width: '50px', hidden: true, index: 'State', sortable: false, editable: false },
            { name: 'Country', width: '50px', hidden: true, index: 'Country', sortable: false, editable: false },
            { name: 'Email', width: '50px', hidden: true, index: 'Email', sortable: false, editable: false },
            { name: 'Mobile_No', width: '50px', hidden: true, index: 'Mobile_No', sortable: false, editable: false },
            { name: 'C_Address', width: '50px', hidden: true, index: 'C_Address', sortable: false, editable: false },
            { name: 'RegistrationNo', width: '50px', hidden: true, index: 'RegistrationNo', sortable: false, editable: false },
            { name: 'C_City', width: '50px', hidden: true, index: 'C_City', sortable: false, editable: false },
            { name: 'C_Postcode', width: '50px', hidden: true, index: 'C_Postcode', sortable: false, editable: false },
            { name: 'C_State', width: '50px', hidden: true, index: 'C_State', sortable: false, editable: false },
            { name: 'C_Country', width: '50px', hidden: true, index: 'C_Country', sortable: false, editable: false },
            { name: 'C_Mobile_No', width: '50px', hidden: true, index: 'C_Mobile_No', sortable: false, editable: false },
            { name: 'C_Fax_No', width: '50px', hidden: true, index: 'C_Fax_No', sortable: false, editable: false },
            { name: 'MediaName', width: '50px', hidden: true, index: 'MediaName', sortable: false, editable: false },
            { name: 'MediaID', width: '50px', hidden: true, index: 'MediaID', sortable: false, editable: false },
            { name: 'CertificateTypeName', width: '50px', hidden: true, index: 'CertificateTypeName', sortable: false, editable: false },
            { name: 'CertificateType_No_Year', width: '50px', hidden: true, index: 'CertificateType_No_Year', sortable: false, editable: false },
            { name: 'StatusID', width: '50px', hidden: true, index: 'StatusID', sortable: false, editable: false },

            //COLUMN TO BE APPEAR ON THE GRID
            { name: 'Name', width: '130px', sortable: true, index: 'Name', editable: true, sorttype: 'string', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }, searchoptions: { sopt: ['eq', 'bw', 'bn', 'cn', 'nc', 'ew', 'en'] } },
            { name: 'ICNo', index: 'ICNo', width: '110px', sortable: true, align: 'center', editable: true, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
            { name: 'CompanyName', width: '130px', index: 'CompanyName', sortable: true, editable: true, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
            { name: 'PackageName', width: '130px', index: 'PackageName', sortable: true, editable: true, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
            { name: 'ApplicationType', index: 'ApplicationType', align: 'center', width: '90px', sortable: true, editable: true },
            {
                name: 'Request_Date', index: 'Request_Date', formatter: "date", align: 'center', sortable: true, editable: true, width: '120px',
                formatoptions: { srcformat: "ISO8601Long", newformat: "d/m/Y h:i A" }
            },
            {
                name: 'act', width: '80px', index: 'act', align: 'center'
            }
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumbers: true,
        altRows: true,
        pager: Verification_Footer,
        sortname: 'CertificateRequestID',
        gridview: true,
        viewrecords: true,
        sortorder: "desc",
        caption: "AP Request Approval",
        autowidth: true,
        shrinkToFit: true,
        height: "auto",
        ajaxRowOptions: {
            success: function () {
                $("#APReqApprovalTable").trigger("reloadGrid");
            }
        },
        gridComplete: function () {
            var ids = jQuery("#APReqApprovalTable").jqGrid('getDataIDs');
            var rowData = jQuery("#APReqApprovalTable").jqGrid('getRowData');
            for (var i = 0; i < ids.length; i++) {
                me = "<div class='badge badge-success' style='cursor:pointer' onclick=\"getData('" + rowData[i].CertificateRequestID + "')\">APPROVE</div>"
                jQuery("#APReqApprovalTable").jqGrid('setRowData', ids[i], { act: me });
            }
        }
    }).navGrid('#APReqApprovalFooter', { edit: false, add: false, del: false, search: true, refresh: true, view: false },
    {}, {}, {}, { closeAfterSearch: true, searchOnEnter: true },
    {});

    $("#APReqApprovalTable").closest('.ui-jqgrid-bdiv').width($("#APReqApprovalTable").closest('.ui-jqgrid-bdiv').width() + 1);

    ChangejQGridDesign("#APReqApprovalTable", "#APReqApprovalFooter");
    function ChangejQGridDesign(Verification_Table, Verification_Pager) {
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

var defineGridDocument = function (data) {
    grid = $("#documentDisplayTbl");
    grid.jqGrid({
        url: '/APApproval/getAPDocumentData?ID=' + data + '',
        datatype: "json",
        mtype: 'post',
        //data: data,
        colNames: ["", "", "File Name", "Description", "View"],
        colModel: [
        { name: 'FilesID', index: 'FilesID', hidden: true, align: 'center', sorttype: 'int' },
        { name: 'FileUploadby', index: 'FileUploadby', hidden: true, align: 'center' },
        { name: 'FileName', index: 'FileName', width: 380 },
        { name: 'Description', index: 'Description', width: '120px', align: 'center' },
        { name: 'act', index: 'act', width: 70, align: 'center' }
        ],
        rowNum: 10,
        rowList: [10, 20],
        gridview: true,
        rownumbers: true,
        sortname: 'FileName',
        viewrecords: true,
        sortorder: 'desc',
        caption: "List of Document",
        height: '100%',
        gridComplete: function () {
            var ids = jQuery("#documentDisplayTbl").jqGrid('getDataIDs');
            var rowData = jQuery("#documentDisplayTbl").jqGrid('getRowData');
            for (var i = 0; i < ids.length; i++) {
                me = "<button type='button' style='color:red' onclick=\"getDoc('" + rowData[i].FileUploadby + "')\">VIEW</button>"
                jQuery("#documentDisplayTbl").jqGrid('setRowData', ids[i], { act: me });
            }
        }
    });
    $("#documentDisplayTbl").closest('.ui-jqgrid-bdiv').width($("#documentDisplayTbl").closest('.ui-jqgrid-bdiv').width() + 1);
    jQuery(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
    jQuery(".ui-jqgrid").removeClass("ui-widget-content");
}

function getDoc(docId) {
    window.open("../Files/" + docId, '_blank');
}

function getData(data) {

    var ID = {
        CertificateRequestID: data
    }

    $.ajax({
        url: '/APApproval/getDataFromClicks',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ID),
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data.Status == "OK") {
                $("#Name").html(data.Cert.Name);
                $("#IDType").html(data.Cert.IDType);
                $("#ICNo").html(data.Cert.ICNo);
                $("#Address").html(data.Cert.Address);
                $("#City").html(data.Cert.City);
                $("#Postcode").html(data.Cert.Postcode);
                $("#State").html(data.Cert.State);
                $("#Country").html(data.Cert.Country);
                $("#Mobile_No").html(data.Cert.Mobile_No);
                $("#Email").html(data.Cert.Email);
                $("#CompanyName").html(data.Cert.CompanyName);
                $("#C_Address").html(data.Cert.C_Address);
                $("#RegistrationNo").html(data.Cert.RegistrationNo);
                $("#C_City").html(data.Cert.C_City);
                $("#C_Postcode").html(data.Cert.C_Postcode);
                $("#C_State").html(data.Cert.C_State);
                $("#C_Country").html(data.Cert.C_Country);
                $("#C_Mobile_No").html(data.Cert.C_Mobile_No);
                $("#C_Fax_No").html(data.Cert.C_Fax_No);
                $("#PackageName").html(data.Cert.PackageName);
                $("#MediaName").html(data.Cert.MediaName);
                $("#CertificateTypeName").html(data.Cert.CertificateTypeName);
                $("#No_Year").html(data.Cert.No_Year);

                $('#hideid').val('');
                $('#hideid').val(data.Cert.CertificateRequestID);
                $('#hideprojectid').val('');
                $('#hideprojectid').val(data.Cert.Project_Id);

                //Used for display at the table
                $("#vName").html(data.Cert.Name);
                $("#vIDType").html(data.Cert.IDType);
                $("#vICNo").html(data.Cert.ICNo);
                $("#vCompanyName").html(data.Cert.CompanyName);
                $("#vRegistrationNo").html(data.Cert.RegistrationNo);
                $("#vPackageName").html(data.Cert.PackageName);
                $("#vMediaName").html(data.Cert.MediaName);

                $('#approvalmodal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });

                $("#documentDisplayTbl").jqGrid("GridUnload")
                $("#APReqApprovalTable").trigger("reloadGrid");
                defineGridDocument(data.Cert.CertificateRequestID);

            } else {
                $("#APReqApprovalTable").trigger("reloadGrid");
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
            bootbox.dialog({
                message: errorThrown,
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
    });
}

$('#btnApproval').click(function (e) {
    e.preventDefault();

    $.ajax({
        url: '/RPVerification/getResetQuestionList',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: 'json',
        cache: false,
        success: function (data) {
            $('#SignQuestion').val(data.Question);
        },
        error: function (errorThrown) {
        }
    });

    $('#cnPin').val("");
    $('#SignAnswer').val("");

    $('#modalsigning').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
});

$('#btnSignConfirm').click(function (e) {
    e.preventDefault();

    if (signForm.valid()) {
        var r = confirm("Are you sure to APPROVE this user?");
        if (r == true) {

            $.LoadingOverlay("show");

            var project = {
                CertificateRequestID: $('#hideid').val(),
                Project_Id: $('#hideprojectid').val(),
                cnPin: $('#cnPin').val(),
                SignQuestion: $('#SignQuestion').val(),
                SignAnswer: $('#SignAnswer').val()
            };
            $.ajax({
                url: '/APApproval/updateROApprovalforAPRequest',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(project),
                dataType: 'json',
                cache: false,
                success: function (data) {
                    if (data.Result == "OK") {
                        $('#hidedocsupload').hide();
                        $('#modalsigning').modal('hide');
                        $('#approvalmodal').modal('hide');
                        $("#APReqApprovalTable").trigger("reloadGrid");
                        $("#verifiedTable").trigger("reloadGrid");
                        $.LoadingOverlay("hide");
                        toastr["success"](data.Message);
                    }
                    else if (data.Result == "WARNING") {
                        $.LoadingOverlay("hide");
                        toastr["warning"](data.Message);
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
    }
});