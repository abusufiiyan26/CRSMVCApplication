$(function () {
    $('#Data').ckeditor();

    var grid_selector = "#templateTbl";
    var pager_selector = "#templateFooter";
    //var updatecr = $("#updatecr");
    var id = "";
    var EmailSource = "";

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
        url: '/MailTemplate/getTemplateRecords',
        //data: jqgrid_data,
        datatype: "json",
        mtype: 'post',
        height: '350px',
        //postData: { ID: ID },
        colNames: ['No', '', '', 'Subject Name', 'Date Modified', 'Action'],
        colModel: [
            { name: 'RNO', width: '50px', hidden: false, index: 'id', sortable: false, editable: false, key: true },
            { name: 'Message', width: '50px', hidden: true, index: 'Message', sortable: false, editable: false },
            { name: 'EmailSource', width: '50px', hidden: true, index: 'EmailSource', sortable: false, editable: false },

            //COLUMN TO BE APPEAR ON THE GRID
            { name: 'Source', index: 'Source', editable: true },
            { name: 'newMdt', index: 'newMdt', sortable: false, editable: true },
            {
                name: 'act', width: '90px', index: 'act', align: 'center', sortable: false, formatter: 'actions',
                formatoptions: {
                    keys: true,
                    editbutton: false,
                    delbutton: false
                }
            }
        ],
        rowNum: 10,
        rowList: [10, 20, 30],
        pager: pager_selector,
        sortname: 'ID',
        viewrecords: true,
        sortorder: "desc",
        editurl: "SaveAsset",
        caption: "LIST OF MAIL TEMPLATE",
        autowidth: false,
        ajaxRowOptions: {
            success: function () {
                $("#templateTbl").trigger("reloadGrid");
            }
        },
        loadComplete: function () {
            var grid = $(this),
            iCol = getColumnIndexByName(grid, 'act');

            grid.children("tbody")
                .children("tr.jqgrow")
                .children("td:nth-child(" + (iCol + 1) + ")")
                .each(function () {

                    $("<div>",
                        {
                            title: "Update Mail Template",
                            mouseover: function () {
                                $(this).addClass('ui-state-hover');
                            },
                            mouseout: function () {
                                $(this).removeClass('ui-state-hover');
                            },
                            click: function (e) {
                                //USER DETAILS
                                id = "";
                                EmailSource = "";
                                id = $(e.target).closest("tr.jqgrow").attr("id");
                                EmailSource = $(grid_selector).getCell(id, "EmailSource");

                                var Message = "";
                                var Source = "";

                                Message = $(grid_selector).getCell(id, "Message");
                                Source = $(grid_selector).getCell(id, "Source");

                                var editor_data = CKEDITOR.instances['Data'].getData();
                                CKEDITOR.instances['Data'].setData(Message)

                                $('#TemplateName').val(Source);

                                $('#btnCreateConfirm').hide();
                                $('#btnEditConfirm').show();
                                $('#templatemodal').modal('show');
                            }
                        }
                      ).css({ "margin-left": "5px", float: "left" })
                       .addClass("ui-pg-div ui-inline-custom")
                       .append('<span class="ui-icon fa fa-pencil bigger-140"></span>')
                       .appendTo($(this).children("div"));
                });
            var table = this;
            setTimeout(function () {
            }, 0);
        }
    }).navGrid('#templateFooter', { edit: false, add: false, del: false, search: true, refresh: true, view: false });

    ChangejQGridDesign("#templateTbl", "#templateFooter");

    $('#btnEditConfirm').click(function () {

        var r = confirm("Are you sure to edit this Email Template!");
        if (r == true) {

            var editData = {
                Data: $('#Data').val(),
                TemplateName: $('#TemplateName').val(),
                MailID: id
            };

            $.ajax({
                url: '/MailTemplate/saveEdit',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(editData),
                dataType: 'json',
                success: function (data) {
                    if (data.Result = "OK") {
                        toastr["success"](data.Message);
                        $('#btnCreateConfirm').hide();
                        $('#btnEditConfirm').hide();
                        $('#templatemodal').modal('hide');
                        $("#templateTbl").trigger("reloadGrid");
                    }
                    else {
                        toastr["error"](data.Message);
                    }
                },
                error: function (errorThrown) {
                    toastr["error"](errorThrown);
                }
            });
        }
    });

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

        var $grid = $(table),
        newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
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

$('#btnCreateNewTemplate').click(function () {

    //var totalRecord = "";

    //$.ajax({
    //    url: '/MailTemplate/getTotalCount',
    //    type: 'POST',
    //    contentType: 'application/json; charset=utf-8',
    //    data: JSON.stringify(),
    //    dataType: 'json',
    //    success: function (data) {
    //        totalRecord = data.total;
    //        totalRecord = totalRecord + 1;

    //        var editor_data = CKEDITOR.instances['Data'].getData();
    //        CKEDITOR.instances['Data'].setData("")

    //        $('#TemplateName').val("");

    //        $('#EmailSource').html("Template No." + totalRecord);
    //        $('#btnCreateConfirm').show();
    //        $('#btnEditConfirm').hide();
    //        window.location.href = "../MailTemplate/CreateNew";

    //    },
    //    error: function (errorThrown) {
    //        toastr["error"](errorThrown);
    //    }
    //});
    $("#btnCreateNewTemplate").hide();
    $("#HideCreateTemplate").show();
   
});

$('#btnCreateConfirm').click(function () {
    var s = confirm("Are you sure to create NEW EMAIL TEMPLATE!");
    if (s == true) {

        var createData = {
            Data: $('#Data').val(),
            TemplateName: $('#TemplateName').val(),
            EmailSource: $('#EmailSource').val()
        };

        $.ajax({
            url: '/MailTemplate/saveInsert',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(createData),
            dataType: 'json',
            success: function (data) {
                if (data.Result = "OK") {
                    toastr["success"](data.Message);
                    $('#templatecreatemodal').modal('hide');
                    $("#templateTbl").trigger("reloadGrid");
                }
                else {
                    toastr["error"](data.Message);
                }
            },
            error: function (errorThrown) {
                toastr["error"](errorThrown);
            }
        });
    }
});




