
$(function () {

    var grid_selector = "#documentTbl";
    var pager_selector = "#documentFooter";
    var vShort = "";

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
        url: '/Public/getDocumentRecord',
        datatype: "json",
        mtype: 'post',
        colNames: ['No', '', 'Description', 'Requirement', 'File No'],
        colModel: [
            { name: 'No', width: '10px', align: 'center', hidden: false, index: 'No', sortable: false, editable: false, key: true },
            { name: 'ShortDesc', hidden: true, index: 'ShortDesc', sortable: false, editable: false },
            { name: 'Description', width: '90px', hidden: false, index: 'Description', sortable: false, editable: false },
            { name: 'Requirement', width: '40px', align: 'center', hidden: false, index: 'Requirement', sortable: false, editable: false },
            { name: 'FileNo', width: '40px', align: 'center', hidden: false, index: 'FileNo', sortable: false, editable: false }
        ],
        rowNum: 10,
        autowidth: true,
        width: 750,
        height: "auto",
        sortname: 'No',
        viewrecords: true,
        sortorder: "desc",
        editurl: "SaveAsset",
        caption: "LIST OF DOCUMENT",
        autowidth: false,
        ajaxRowOptions: {
            success: function () {
                $("#documentTbl").trigger("reloadGrid");
            }
        },
        gridComplete: function () {
            var ids = jQuery("#documentTbl").jqGrid('getDataIDs');
            var rowData = jQuery("#documentTbl").jqGrid('getRowData');
            for (var i = 0; i < ids.length; i++) {
                vFileNo = rowData[0].FileNo;
                vALFileNo = rowData[1].FileNo;
            }
        },
        loadComplete: function () {
            var grid = $(this);

            iCol = getColumnIndexByName(grid, 'act');

            grid.children("tbody")
                .children("tr.jqgrow")
                .children("td:nth-child(" + (iCol + 1) + ")")
                .each(function () {
                    $("<div>",
                        {
                            title: "UPLOAD",
                            mouseover: function () {
                                $(this).addClass('ui-state-hover');
                            },
                            mouseout: function () {
                                $(this).removeClass('ui-state-hover');
                            },
                            click: function (e) {

                                $('#documentmodal').modal('show');
                            }
                        }
                      ).css({ "margin-left": "5px", float: "left" })
                       .addClass("ui-pg-div ui-inline-custom")
                       .append('<span class="ui-icon fa fa-eraser bigger-140"></span>')
                       .appendTo($(this).children("div"));
                });

            var table = this;
            setTimeout(function () {
            }, 0);
        }
    }).navGrid('#documentFooter', { edit: false, add: false, del: false });

    $("#documentTbl").jqGrid('setGridParam',
    {
        onSelectRow: function (id) {
            var idDokumen = parseInt(id)
            var data = $("#documentTbl").jqGrid('getRowData', id);

            $("#docDesc").text(data.Description);
            $("#ShortDesc").text(data.ShortDesc);
            $("#docId").text(data.No);

            vShort = data.ShortDesc;

            downloadDocs(data.ShortDesc);

            $('#documentmodal').modal({
                show: true,
                backdrop: 'static',
                keyboard: true
            });
        }
    });

    ChangejQGridDesign("#documentTbl", "#documentFooter");

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
        // set width of table
        var $grid = $(table),
        newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
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


    $(document).ready(function () {
        Dropzone.autoDiscover = false;
        $("#dZUpload").dropzone({
            url: "../Public/UploadFiles",
            addRemoveLinks: false,
            //acceptedFiles: "image/*",
            init: function () {
                this.on("sending", function (file, xhr, formData) {
                    formData.append("ShortDesc", vShort); // Append all the additional input data of your form here!
                });
            },
            success: function (file, response) {
                var imgName = response;
                file.previewElement.classList.add("dz-success");
                downloadDocs(vShort);
                $("#documentTbl").trigger("reloadGrid");
                $("#documentGridTbl").trigger("reloadGrid");
                //console.log(“Successfully uploaded :” + imgName);
            },
            error: function (file, response) {
                file.previewElement.classList.add("dz-error");
            }
        });
    });

});

//REGION FOR UPLOAD
$('#txtUploadFile').on('change', function (e) {
    var files = e.target.files;
    var myID = "Payment Receipt"; //uncomment this to make sure the ajax URL works
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
                if (files[x].size > 1000000) {
                    toastr["error"]("File size is more than 1MB");
                    return false;
                }
                type = files[x].type;
                if (type == "application/pdf" || type == "image/jpeg" || type == "image/png") {

                }
                else {
                    toastr["error"]("File type allowed only pdf,png,jpg");
                    $('#txtUploadFile').val("");
                    return false;
                }
            }

            $.LoadingOverlay("show");

            $.ajax({
                type: "POST",
                url: '/PublicRequest/NewApplicationUpload?id=' + myID,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.status == "Failed") {
                        $('#txtUploadFile').val("");
                        toastr["error"]("Failed to upload Payment Receipt");
                    }
                    else {
                        toastr["success"]("Payment Receipt Upload Success");
                    }
                    $.LoadingOverlay("hide");
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                    $.LoadingOverlay("hide");
                }
            });
        } else {
            $.LoadingOverlay("hide");
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }
});

$('#nricUploadFile').on('change', function (e) {
    var files = e.target.files;
    var type = "";
    var myID = "NRIC/Passport"; //uncomment this to make sure the ajax URL works
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
                if (files[x].size > 1000000) {
                    toastr["error"]("File size is more than 1MB");
                    return false;
                }
                type = files[x].type;
                if (type == "application/pdf" || type == "image/jpeg" || type == "image/png") {
                    
                }
                else {
                    toastr["error"]("File type allowed only pdf,png,jpg");
                    $('#nricUploadFile').val("");
                    return false;
                }
            }

            $.ajax({
                type: "POST",
                url: '/PublicRequest/NewApplicationUpload?id=' + myID,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.status == "Failed") {
                        $('#nricUploadFile').val("");
                        toastr["error"]("Failed to upload IC Documents");
                    }
                    else {
                        toastr["success"]("NRIC/Passport Document Upload Success");
                    }
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }
});

$('#authUploadFile').on('change', function (e) {
    var files = e.target.files;
    var type = "";
    var myID = "Authorization Letter"; //uncomment this to make sure the ajax URL works
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
                if (files[x].size > 1000000) {
                    toastr["error"]("File size is more than 1MB");
                    return false;
                }
                type = files[x].type;
                if (type == "application/pdf" || type == "image/jpeg" || type == "image/png") {

                }
                else {
                    toastr["error"]("File type allowed only pdf,png,jpg");
                    $('#authUploadFile').val("");
                    return false;
                }
            }

            $.ajax({
                type: "POST",
                url: '/PublicRequest/NewApplicationUpload?id=' + myID,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.status == "Failed") {
                        $('#authUploadFile').val("");
                        toastr["error"]("Failed to upload Authorization Letter");
                    }
                    else {
                        toastr["success"]("Authorization Letter Upload Success");
                    }
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }
});

$('#SSMUploadFile').on('change', function (e) {
    var files = e.target.files;
    var type = "";
    var myID = "SSM"; //uncomment this to make sure the ajax URL works
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
                if (files[x].size > 1000000) {
                    toastr["error"]("File size is more than 1MB");
                    return false;
                }
                type = files[x].type;
                if (type == "application/pdf" || type == "image/jpeg" || type == "image/png") {

                }
                else {
                    toastr["error"]("File type allowed only pdf,png,jpg");
                    $('#SSMUploadFile').val("");
                    return false;
                }
            }

            $.ajax({
                type: "POST",
                url: '/PublicRequest/NewApplicationUpload?id=' + myID,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.status == "Failed") {
                        toastr["error"]("Failed to upload SSM Document");
                        $('#SSMUploadFile').val("");
                    }
                    else {
                        toastr["success"]("SSM Document Upload Success");
                    }
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }
});