function GetQueryStringParams(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

$('#optKeputusan1').on('ifChecked', function (event) {
    $('#hideKeputusan').val("Lulus");
});
$('#optKeputusan2').on('ifChecked', function (event) {
    $('#hideKeputusan').val("Gagal/Abortive");
});
$('#optKeputusan3').on('ifChecked', function (event) {
    $('#hideKeputusan').val("Pembaikan");
});
$('#optTambahan1').on('ifChecked', function (event) {
    $('#hideTambahan').val(1);
});
$('#optTambahan2').on('ifChecked', function (event) {
    $('#hideTambahan').val(0);
});
$('#optStatus1').on('ifChecked', function (event) {
    $('#hideStatus').val("0101");
});
$('#optStatus2').on('ifChecked', function (event) {
    $('#hideStatus').val("0102");
});
$('#optStatus3').on('ifChecked', function (event) {
    $('#hideStatus').val("0103");
});

var tempatkerjaController = function ($scope, $http) {

    var onTempatKerjaComplete = function (response) {
        $scope.tempatkerja = response.data[0];
    };

    var onError = function (reason) {
        $scope.error = "Could not fetch the data";
    };

    $http.get("../api/TempatKerja/GetByNoDaftar?noDaftar_TK=" + vbnoDaftar_TK)
        .then(onTempatKerjaComplete, onError);
};

var pemeriksaanController = function ($scope, $http) {

    var onPemeriksaanComplete = function (response) {
        $scope.pemeriksaan = response.data[0];
    };

    var onError = function (reason) {
        $scope.error = "Could not fetch the data";
    };

    $http.get("../api/PemeriksaanMain/GetPemeriksaanByAgihanTK?id_AgihanTK=" + vbid_AgihanTK)
        .then(onPemeriksaanComplete, onError);
};

var individuTKController = function ($scope, $http) {

    var onindividuTKComplete = function (response) {
        $scope.individuTK = response.data[0];
    };

    var onError = function (reason) {
        $scope.error = "Could not fetch the data";
    };

    $http.get("../api/IndividuTK/GetIndividuDetails?vnoDaftar_TK=" + vbnoDaftar_TK)
        .then(onindividuTKComplete, onError);
};

function dtlPemeriksaanController($scope, $http) {
    var ondtlPemeriksaanComplete = function (response) {
        $scope.dtlPemeriksaan = response.data[0];
        $('#optKeputusan1, #optKeputusan2, #optKeputusan3').iCheck('uncheck');
        $('#optTambahan1, #optTambahan2').iCheck('uncheck');
        //$('#optStatus1, #optStatus2, #optStatus3').iCheck('uncheck');
      
        $('#hideStatus').val(response.data[0].jenteraMain.refRujukan.refCode);
        $('input[name=status][value="' + response.data[0].jenteraMain.refRujukan.refDescription + '"]').iCheck('check');
        $('input[name=Bayar][value="' + response.data[0].jenteraMain.perluBayaran + '"]').iCheck('check');
        $('input[name=keputusan][value="' + response.data[0].keputusan_Pemeriksaan + '"]').iCheck('check');
        $('input[name=tambahan][value="' + response.data[0].perlu_Pemeriksaan_Tambahan + '"]').iCheck('check');
        $('#hideid_PJentera').val(response.data[0].id_PJentera);
        $('#hidejenis_Jentera').val(response.data[0].jenteraMain.jenisJentera);
    };
    var onError = function (reason) {
        $scope.error = "Could not fetch the data";
    };

    $scope.anyFunc = function (vidPemeriksaan, vnoJentera, vjenisJentera) {
        $http.get("../api/PemeriksaanMain/GetdtlPemeriksaan?vidPemeriksaan=" + vidPemeriksaan + "&vnoJentera=" + vnoJentera + "&vjenisJentera=" + vjenisJentera)
            .then(ondtlPemeriksaanComplete, onError);
    };
}

$('#btnAdd').click(function () {
    var vArraySelected = $("#noJenteras").html();
    var idSelectednoJenteras = vArraySelected.split(",");
    var now = moment().format("MM-DD-YYYY hh:mm");
    var flag = false;
    var idNotis_initial;

    if (vArraySelected == "") {
        toastr["warning"]("Sila pilih sekurang-kurangnya 1 jentera")
        return;
    }

    for (i = 0; i < (idSelectednoJenteras.length) ; i++) {

        var notis_surat = {
            id_notis: 0,
            id_AgihanTK: vbid_AgihanTK,
            tarikh_notis: $('#tarikhNotis').val(),
            jenis_notis: $('#jenisNotis').val(),
            tarikh_Periksa_Dicadang: $('#tarikhPemeriksaan').val() + " " + $('#timepicker_buttons').val(),
            status: 1
        };

        if (flag == false) {
            $.ajax({
                url: '../api/NotisSurat',
                cache: false,
                async: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(notis_surat),
                success: function (data) {
                    flag = true;
                    idNotis_initial = data.id_notis;
                    var notis_suratdtl = {
                        id_notisdtl: 0,
                        id_notis: data.id_notis,
                        noJentera: $.trim(idSelectednoJenteras[i]),
                    };
                    $.ajax({
                        url: '../api/NotisSuratdtl',
                        cache: false,
                        async: false,
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(notis_suratdtl),
                        success: function (data) {
                            toastr["success"]("Rekod telah berjaya disimpan")
                        }
                    }).fail(
                function (xhr, textStatus, err) {
                    toastr["error"]("Rekod tidak berjaya disimpan")
                });

                }
            }).fail(
                function (xhr, textStatus, err) {
                    toastr["error"]("Rekod tidak berjaya disimpan")
                });
        }
        else if (flag == true) {
            var notis_suratdtl = {
                id_notisdtl: 0,
                id_notis: idNotis_initial,
                noJentera: $.trim(idSelectednoJenteras[i]),
            };
            $.ajax({
                url: '../api/NotisSuratdtl',
                cache: false,
                async: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(notis_suratdtl),
                success: function (data) {
                }
            }).fail(
               function (xhr, textStatus, err) {
                   toastr["error"]("Rekod tidak berjaya disimpan")
               });
        }
    }
    $("#grid-table-surat").setGridParam({ rowNum: 10, datatype: "json" }).trigger('reloadGrid');
    $("#noJenteras").html("");
    $('#tarikhPemeriksaan').val("");
    $('#timepicker_buttons').val("");
});

$('#pilih').click(function (e) {
    var ids = $('#grid-table-jentera').jqGrid('getGridParam', 'selarrrow');
    $("#noJenteras").html("");
    //mda:multiple select 
    if (ids.length > 0) {

        var noJenteras = [];

        for (var i = 0, il = ids.length; i < il; i++) {
            var noJentera = $('#grid-table-jentera').jqGrid('getCell', ids[i], 'noJentera');
            noJenteras.push(noJentera);
        }
        $("#noJenteras").html(noJenteras.join(", "));
    }
    $("#modalJentera").modal("hide");
    e.stopPropagation();
});

$('#openBtn').click(function () {
    $('#modalJentera').modal({
        show: true
    });
});

$('#btnJanaBil').click(function () {
    if ($('#namaPemohon').val() == "")
    {
        toastr["warning"]("Tiada wakil tempat kerja yang dilantik. Sila lakukan pendaftaran wakil tempat kerja")
        return;
    }

    var ids = $('#grid-table-jana').jqGrid('getGridParam', 'selarrrow');
    $("#noJenterasBil").html("");
    //mda:multiple select 
    if (ids.length > 0) {

        var noJenteras = [];

        for (var i = 0, il = ids.length; i < il; i++) {
            var noJentera = $('#grid-table-jana').jqGrid('getCell', ids[i], 'noJentera');
            var vstatus_bil = $('#grid-table-jana').jqGrid('getCell', ids[i], 'status_bil');            
            if (vstatus_bil != 1){
                noJenteras.push(noJentera);
            }
        }
        $("#noJenterasBil").html(noJenteras.join(", "));
    }

    var flag = false;
    var idBil_initial;
    var vArraySelected = $("#noJenterasBil").html();
    var idSelectednoJenteras = vArraySelected.split(",");

    if (vArraySelected == "") {
        toastr["warning"]("Sila pilih sekurang-kurangnya 1 jentera")
        return;
    }

    for (i = 0; i < (idSelectednoJenteras.length) ; i++) {
        
        var bill_main = {
            kod_Negeri: "MK",
            noBil: "",
            noDaftarOrg: vbnoDaftar_TK,
            tarikh_Bil: $('#tarikhJanaBil').val(),
            butir_Ringkas: $('#txtButiran').val()
        };

        if (flag == false) {
            $.ajax({
                url: '../api/BillMain',
                cache: false,
                async: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(bill_main),
                success: function (data) {
                    flag = true;
                    idBil_initial = data.noBil;
                    var bill_detail = {
                        bil_dtl_Id: 0,
                        noBil: data.noBil,
                        details: 'Caj Bayaran untuk pemeriksaan Jentera ' + $.trim(idSelectednoJenteras[i]),
                        jumlah: 0,
                        noJentera: $.trim(idSelectednoJenteras[i]),
                        record_id: $('#hideid_Pemeriksaan').val()
                    };
                    $.ajax({
                        url: '../api/BillDetail',
                        cache: false,
                        async: false,
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(bill_detail),
                        success: function (data) {
                            toastr["success"]("Rekod telah berjaya disimpan")
                        }
                    }).fail(
                function (xhr, textStatus, err) {
                    toastr["error"]("Rekod tidak berjaya disimpan")
                });

                }
            }).fail(
                function (xhr, textStatus, err) {
                    toastr["error"]("Rekod tidak berjaya disimpan")
                });
        }
        else if (flag == true) {
            var bill_detail = {
                bil_dtl_Id: 0,
                noBil: idBil_initial,
                details: 'Caj Bayaran untuk pemeriksaan Jentera' + $.trim(idSelectednoJenteras[i]),
                jumlah: 0,
                noJentera: $.trim(idSelectednoJenteras[i]),
                record_id: $('#hideid_Pemeriksaan').val()
            };
            $.ajax({
                url: '../api/BillDetail',
                cache: false,
                async: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(bill_detail),
                success: function (data) {
                }
            }).fail(
               function (xhr, textStatus, err) {
                   toastr["error"]("Rekod tidak berjaya disimpan")
               });
        }
    }

    $("#grid-table-bil").setGridParam({ rowNum: 10, datatype: "json" }).trigger('reloadGrid');
    $("#grid-table-jana").setGridParam({ rowNum: 10, datatype: "json" }).trigger('reloadGrid');
    $("#noJenterasBil").html("");
    $('#txtButiran').val("");
});


$('#btnSimpan').click(function () {
    var pemeriksaan_Jentera,vStatus;

    switch($('#hidejenis_Jentera').val()) {
        case "PMA":
            pemeriksaan_Jentera = {
                id_PJentera: $('#hideid_PJentera').val(),
                id_Pemeriksaan: 0,
                kod_Semakan: $('#txtKodSemak').val(),
                kedudukan: $('#txtKedudukan').val(),
                catatan: $('#txtUlasan').val(),
                keputusan_Pemeriksaan: $('#hideKeputusan').val(),
                perlu_Pemeriksaan_Tambahan: $('#hideTambahan').val(),
                jenteraMain: { id_status: $('#hideStatus').val(), Jentera_PMA: [{ beban_KS_Skrg: $('#txtBeban').val() }] }
            };
            break;
        case "PMD":
            pemeriksaan_Jentera = {
                id_PJentera: $('#hideid_PJentera').val(),
                id_Pemeriksaan: 0,
                kod_Semakan: $('#txtKodSemak').val(),
                kedudukan: $('#txtKedudukan').val(),
                catatan: $('#txtUlasan').val(),
                keputusan_Pemeriksaan: $('#hideKeputusan').val(),
                perlu_Pemeriksaan_Tambahan: $('#hideTambahan').val(),
                jenteraMain: { id_status: $('#hideStatus').val(), Jentera_PMD: [{ kuasaProses: $('#txtPermukaanPMD').val(), kuasaMemanas: $('#txtKuasaPMD').val(), pp_d1_econ: $('#txtKelumpang').val(), pp_d1_econ: $('#txtSelubung').val(), pp_d1_econ: $('#txtTiub').val() }] }
            };
            break;
        case "PMT":
            pemeriksaan_Jentera = {
                id_PJentera: $('#hideid_PJentera').val(),
                id_Pemeriksaan: 0,
                kod_Semakan: $('#txtKodSemak').val(),
                kedudukan: $('#txtKedudukan').val(),
                catatan: $('#txtUlasan').val(),
                keputusan_Pemeriksaan: $('#hideKeputusan').val(),
                perlu_Pemeriksaan_Tambahan: $('#hideTambahan').val(),
                jenteraMain: { id_status: $('#hideStatus').val(), Jentera_PMT: [{ cajKuasaMotor: 1000 }] }
            };
            break;
        case "PPA":
            pemeriksaan_Jentera = {
                id_PJentera: $('#hideid_PJentera').val(),
                id_Pemeriksaan: 0,
                kod_Semakan: $('#txtKodSemak').val(),
                kedudukan: $('#txtKedudukan').val(),
                catatan: $('#txtUlasan').val(),
                keputusan_Pemeriksaan: $('#hideKeputusan').val(),
                perlu_Pemeriksaan_Tambahan: $('#hideTambahan').val(),
                jenteraMain: {Jentera_PMT: [{ cajKuasaMotor: 1000}] }
            };
            break;
        default:
    } 
   
    $.ajax({
        url: '../api/PemeriksaanMain/Patch?key=' + $('#hideid_PJentera').val() + '&vjenisJentera=' + $('#hidejenis_Jentera').val(),
        cache: false,
        async: false,
        type: 'PATCH',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(pemeriksaan_Jentera),
        success: function (data) {
            toastr["success"]("Rekod telah berjaya disimpan")
            //$.jgrid.gridUnload("#grid-table-jana");
            $("#grid-table-jana").trigger("reloadGrid");
            $("#dtlPemeriksaanModal").modal("hide");
            //e.stopPropagation();
           
        }
    }).fail(
                function (xhr, textStatus, err) {
                    toastr["error"]("Rekod tidak berjaya disimpan")
                });
});

$('#cajBtn').click(function () {
    //window.open("/myKKPJentera/Report/cajBil.aspx?noDaftar_TK=" + vbnoDaftar_TK, "_blank");  
    var grid_selector_bil = "#grid-table-bil";
    var pager_selector_bil = "#grid-pager-bil";

    var getColumnIndexByName = function (grid_selector, columnName) {
        var cm = $(grid_selector_bil).jqGrid('getGridParam', 'colModel');
        for (var i = 0, l = cm.length; i < l; i++) {
            if (cm[i].name === columnName) {
                return i; // return the index
            }
        }
        return -1;
    };

    function getCellValue(rowId, cellId) {
        var cell = $('#' + 'grid-table-bil' + '_' + cellId);
        var val = cell.val;
        return val;
    }

    var API_URL = "../api/BillMain/GetBil?noDaftarOrg=" + vbnoDaftar_TK;

    $(grid_selector_bil).jqGrid({
        url: API_URL,
        datatype: "json",
        colNames: ['', "Tarikh Bil", "No. Bil", "Butiran Ringkas","Cetak"],
        colModel: [
                  { name: 'bil_Id', index: 'bil_Id', width: 0, hidden: true },
                  { name: 'Tarikh_Bil', index: 'Tarikh Bil', editable: true, search: true, stype: 'text', width: 150 },
                  { name: 'noBil', index: 'No. Bil', editable: true, search: true, stype: 'text', width: 150 },
                  { name: 'butir_Ringkas', index: 'Butiran Ringkas', editable: true, search: true, width: 300 },
                   {
                       name: 'act', index: 'act', width: 50, align: 'center', sortable: false, formatter: 'actions',
                       formatoptions: {
                           keys: true,
                           editbutton: false,
                           delbutton: false
                       }
                   }
        ],
        viewrecords: true,
        rowNum: 50,
        rownumbers: true,
        //pager: pager_selector_jentera,
        altRows: true,
        loadonce: false,
        sortname: 'bil_Id',
        sortorder: "desc",
        search: true,
        postData: {
            filters: '{"groupOp":"AND","rules":[' +
                    '{"field":"noBil","op":"cn","data":""}' +
                    ',{"field":"Tarikh_Bil","op":"cn","data":""}]}'
        },
        multiselect: true,
        loadComplete: function () {
            var grid = $(this),
            iCol = getColumnIndexByName(grid, 'act'); // 'act' - name of the actions column

            grid.children("tbody")
           .children("tr.jqgrow")
           .children("td:nth-child(" + (iCol + 1) + ")")
           .each(function () {
               $("<div>",
                   {
                       title: "Cetakan Bil Pemeriksaan",
                       mouseover: function () {
                           $(this).addClass('ui-state-hover');
                       },
                       mouseout: function () {
                           $(this).removeClass('ui-state-hover');
                       },
                       click: function (e) {
                           var id = $(e.target).closest("tr.jqgrow").attr("id");
                           var vbil_Id = $(grid_selector_bil).getCell(id, "bil_Id");
                           window.open("/myKKPJentera/Report/cajBil.aspx?vBil_Id=" + vbil_Id, "_blank");

                       }
                   }
                 ).css({ "margin-left": "5px", float: "left" })
                  .addClass("ui-pg-div ui-inline-custom")
                  .append('<span class="ui-icon fa fa-angle-double-right bigger-140"></span>')
                  .appendTo($(this).children("div"));
           });

            //var table = this;
            //setTimeout(function () {
            //    updateActionIcons(table);
            //    updatePagerIcons(table);
            //    enableTooltips(table);
            //}, 0);
        },
        autowidth: true,
        shrinkToFit: false
    });
    
    $('#dtlBilModal').modal({
        show: true
    });

});

$(function () {
    
    //$('#tarikhNotis').val(moment().format("MM/DD/YYYY"));
    //$('#tarikhJanaBil').val(moment().format("MM/DD/YYYY"));
    //$('input[name="timepicker_buttons"]')
    //      .ptTimeSelect({
    //          zIndex: 1000,
    //          onBeforeShow: function (input, widget) {
    //              // do something before the widget is made visible.
    //          }
    //      })
    //      .show();
    $('#tarikhPemeriksaan').datepicker({
        format: "dd/mm/yyyy"
    });
    $('#dtlPemeriksaanModal').on('shown.bs.modal', function () {
    })

    $('form[name=wizard]').stepFormWizard({
        onNext: function (i) {

            //mda:tab Senarai Jentera
            if (i == 0) {
                var grid_selector = "#grid-table";
                var pager_selector = "#grid-pager";

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

                var API_URL = "../api/JenteraTK/GetCarianJenteraTK?vNoDaftar=" + $("#nodaftar_TK").val();

                var pageWidth = $(grid_selector).parent().width() - 100;

                $(grid_selector).jqGrid({
                    url: API_URL,
                    height: 325,
                    datatype: "json",
                    colNames: ['', "No. Jentera", "Perihal Jentera", "Tarikh Luput", "Perincian"],
                    colModel: [
                              { name: 'id_JTK', index: 'id_JTK', width: 0, hidden: true },
                              { name: 'noJentera', index: 'No. Jentera', editable: true, search: true, stype: 'text', width: (pageWidth * (15 / 100)) },
                              { name: 'perihal', index: 'Perihal Jentera', editable: true, search: true, stype: 'text', width: (pageWidth * (30 / 100)) },
                              { name: 'tarikhTamat', index: 'Tarikh Luput', editable: true, search: true, width: (pageWidth * (30 / 100)) },
                              {
                                  name: 'act', index: 'act', width: (pageWidth * (5 / 100)), align: 'center', sortable: false, formatter: 'actions',
                                  formatoptions: {
                                      keys: true,
                                      editbutton: false,
                                      delbutton: false
                                  }
                              }
                    ],
                    viewrecords: true,
                    rowNum: 10,
                    rownumbers: true,
                    rowList: [10, 20, 30],
                    pager: pager_selector,
                    altRows: true,
                    loadonce: false,
                    sortname: 'id_JTK',
                    sortorder: "desc",
                    search: true,
                    postData: {
                        filters: '{"groupOp":"AND","rules":[' +
                                '{"field":"noJentera","op":"cn","data":""}' +
                                ',{"field":"tarikhTamat","op":"cn","data":""}]}'
                    },
                    multisearch: true,
                    loadComplete: function () {
                        var grid = $(this),
                        iCol = getColumnIndexByName(grid, 'act'); // 'act' - name of the actions column

                        grid.children("tbody")
                       .children("tr.jqgrow")
                       .children("td:nth-child(" + (iCol + 1) + ")")
                       .each(function () {
                           $("<div>",
                               {
                                   title: "Lihat Profail Jentera",
                                   mouseover: function () {
                                       $(this).addClass('ui-state-hover');
                                   },
                                   mouseout: function () {
                                       $(this).removeClass('ui-state-hover');
                                   },
                                   click: function (e) {
                                       var id = $(e.target).closest("tr.jqgrow").attr("id");
                                       var iDaftar_TK = $(grid_selector).getCell(id, "noDaftar");
                                       window.open("../../TK_Jentera/Jentera?noDaftar=" + iDaftar_TK, "_blank");

                                   }
                               }
                             ).css({ "margin-left": "5px", float: "left" })
                              .addClass("ui-pg-div ui-inline-custom")
                              .append('<span class="ui-icon fa fa-angle-double-right bigger-140"></span>')
                              .appendTo($(this).children("div"));
                       });

                        var table = this;
                        setTimeout(function () {
                            updateActionIcons(table);
                            updatePagerIcons(table);
                            enableTooltips(table);
                        }, 0);
                    },
                    autowidth: true,
                    caption: "Senarai Jentera"
                });

                //unlike navButtons icons, action icons in rows seem to be hard-coded
                //you can change them like this in here if you want
                function updateActionIcons(table) {
                    var replacement =
                    {
                        'ui-ace-icon fa fa-pencil': 'ui-icon fa fa-pencil blue',
                        'ui-ace-icon fa fa-trash-o': 'ui-icon fa fa-trash-o red',
                        'ui-icon-disk': 'ui-icon fa fa-check green',
                        'ui-icon-cancel': 'ui-icon fa fa-times red'
                    };
                    $(table).find('.ui-pg-div span.ui-icon').each(function () {
                        var icon = $(this);
                        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
                        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
                    })
                }

                //replace icons with FontAwesome icons like above
                function updatePagerIcons(table) {
                    var replacement =
                    {
                        'ui-icon-seek-first': 'ui-icon fa fa-angle-double-left bigger-140',
                        'ui-icon-seek-prev': 'ui-icon fa fa-angle-left bigger-140',
                        'ui-icon-seek-next': 'ui-icon fa fa-angle-right bigger-140',
                        'ui-icon-seek-end': 'ui-icon fa fa-angle-double-right bigger-140'
                    };
                    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
                        var icon = $(this);
                        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

                        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
                    })
                }

                function enableTooltips(table) {
                    $('.navtable .ui-pg-button').tooltip({ container: 'body' });
                    $(table).find('.ui-pg-div').tooltip({ container: 'body' });
                }
            }

            else if (i == 1) {
                //mda: start ->tab Notis Pemeriksaan--------------------------------------------------------------------
                var grid_selector_surat = "#grid-table-surat";
                var pager_selector_surat = "#grid-pager-surat";

                var getColumnIndexByNameX = function (grid_selector_surat, columnName) {
                    var cm = $(grid_selector_surat).jqGrid('getGridParam', 'colModel');
                    for (var i = 0, l = cm.length; i < l; i++) {
                        if (cm[i].name === columnName) {
                            return i; // return the index
                        }
                    }
                    return -1;
                };

                function getCellValueX(rowId, cellId) {
                    var cell = $('#' + 'grid-table-surat' + '_' + cellId);
                    var val = cell.val;
                    return val;
                }

                var API_URL = "../api/NotisSurat/GetSurat?id_AgihanTK=" + vbid_AgihanTK;

                var pageWidth = $(grid_selector_surat).parent().width() - 100;

                $(grid_selector_surat).jqGrid({
                    url: API_URL,
                    datatype: "json",
                    colNames: ['', "Tarikh Notis", "Jenis Notis", "Tarikh Periksa", "Masa Periksa", "Cetak Surat"],
                    colModel: [
                              { name: 'id_notis', index: 'id_notis', width: 0, hidden: true },
                              { name: 'tarikh_notis', index: 'Tarikh Notis', editable: true, search: true, stype: 'text', width: (pageWidth * (15 / 100)) },
                              { name: 'jenis_notis', index: 'Jenis Notis', editable: true, search: true, stype: 'text', width: (pageWidth * (15 / 100)) },
                              { name: 'tarikh_Periksa_Dicadang', index: 'Tarikh Periksa', editable: true, search: true, stype: 'text', width: (pageWidth * (15 / 100)) },
                              { name: 'tarikh_Periksa_Dicadang', index: 'Tarikh Periksa', editable: true, search: true, stype: 'text', width: (pageWidth * (15 / 100)) },
                              {
                                  name: 'act', index: 'act', width: (pageWidth * (15 / 100)), align: 'center', sortable: false, formatter: 'actions',
                                  formatoptions: {
                                      keys: true,
                                      editbutton: false,
                                      delbutton: false
                                  }
                              }
                    ],
                    viewrecords: true,
                    rowNum: 10,
                    rownumbers: true,
                    rowList: [10, 20, 30],
                    pager: pager_selector_surat,
                    altRows: true,
                    loadonce: false,
                    sortname: 'id_notis',
                    sortorder: "desc",
                    search: true,
                    postData: {
                        filters: '{"groupOp":"AND","rules":[' +
                                '{"field":"tarikh_notis","op":"cn","data":""}' +
                                ',{"field":"tarikh_Periksa_Dicadang","op":"cn","data":""}]}'
                    },
                    loadComplete: function () {
                        var grid = $(this),
                        iCol = getColumnIndexByNameX(grid, 'act'); // 'act' - name of the actions column

                        grid.children("tbody")
                       .children("tr.jqgrow")
                       .children("td:nth-child(" + (iCol + 1) + ")")
                       .each(function () {
                           $("<div>",
                               {
                                   title: "Lihat Surat",
                                   mouseover: function () {
                                       $(this).addClass('ui-state-hover');
                                   },
                                   mouseout: function () {
                                       $(this).removeClass('ui-state-hover');
                                   },
                                   click: function (e) {
                                       var id = $(e.target).closest("tr.jqgrow").attr("id");
                                       var id_Notis = $(grid_selector_surat).getCell(id, "id_notis");
                                       window.open("/myKKPJentera/Report/suratJKJ113.aspx?id_Notis=" + id_Notis, "_blank");

                                   }
                               }
                             ).css({ "margin-left": "5px", float: "left" })
                              .addClass("ui-pg-div ui-inline-custom")
                              .append('<span class="ui-icon fa fa-angle-double-right bigger-140"></span>')
                              .appendTo($(this).children("div"));
                       });

                        var table = this;
                        setTimeout(function () {
                            updateActionIcons(table);
                            updatePagerIcons(table);
                            enableTooltips(table);
                        }, 0);
                    },
                    gridComplete: function () {
                        var recs = parseInt($(grid_selector_surat).getGridParam("records"), 10);
                        if (isNaN(recs) || recs == 0) {
                            $("#gridSurat").hide();
                        }
                        else {
                            $('#gridSurat').show();
                        }
                        $('#count').val(recs);

                    },
                    autowidth: true,
                    caption: "Senarai Notis Pemeriksaan"
                });

                //unlike navButtons icons, action icons in rows seem to be hard-coded
                //you can change them like this in here if you want
                function updateActionIcons(table) {
                    var replacement =
                    {
                        'ui-ace-icon fa fa-pencil': 'ui-icon fa fa-pencil blue',
                        'ui-ace-icon fa fa-trash-o': 'ui-icon fa fa-trash-o red',
                        'ui-icon-disk': 'ui-icon fa fa-check green',
                        'ui-icon-cancel': 'ui-icon fa fa-times red'
                    };
                    $(table).find('.ui-pg-div span.ui-icon').each(function () {
                        var icon = $(this);
                        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
                        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
                    })
                }

                //replace icons with FontAwesome icons like above
                function updatePagerIcons(table) {
                    var replacement =
                    {
                        'ui-icon-seek-first': 'ui-icon fa fa-angle-double-left bigger-140',
                        'ui-icon-seek-prev': 'ui-icon fa fa-angle-left bigger-140',
                        'ui-icon-seek-next': 'ui-icon fa fa-angle-right bigger-140',
                        'ui-icon-seek-end': 'ui-icon fa fa-angle-double-right bigger-140'
                    };
                    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
                        var icon = $(this);
                        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

                        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
                    })
                }

                function enableTooltips(table) {
                    $('.navtable .ui-pg-button').tooltip({ container: 'body' });
                    $(table).find('.ui-pg-div').tooltip({ container: 'body' });
                }
                //mda: end ->tab Notis Pemeriksaan--------------------------------------------------------------------

                //mda: start ->tab Notis Pemeriksaan(Jentera)---------------------------------------------------------
                var grid_selector_jentera = "#grid-table-jentera";
                var pager_selector_jentera = "#grid-pager-jentera";

                var getColumnIndexByName = function (grid_selector, columnName) {
                    var cm = $(grid_selector_jentera).jqGrid('getGridParam', 'colModel');
                    for (var i = 0, l = cm.length; i < l; i++) {
                        if (cm[i].name === columnName) {
                            return i; // return the index
                        }
                    }
                    return -1;
                };

                function getCellValue(rowId, cellId) {
                    var cell = $('#' + 'grid-table-jentera' + '_' + cellId);
                    var val = cell.val;
                    return val;
                }

                var API_URL = "../api/JenteraTK/GetCarianJenteraTK?vNoDaftar=" + $("#nodaftar_TK").val();

                $(grid_selector_jentera).jqGrid({
                    url: API_URL,
                    datatype: "json",
                    colNames: ['', "No. Jentera", "Perihal Jentera", "Tarikh Luput"],
                    colModel: [
                              { name: 'id_JTK', index: 'id_JTK', width: 0, hidden: true },
                              { name: 'noJentera', index: 'No. Jentera', editable: true, search: true, stype: 'text', width: 150 },
                              { name: 'perihal', index: 'Perihal Jentera', editable: true, search: true, stype: 'text', width: 300 },
                              { name: 'tarikhTamat', index: 'Tarikh Luput', editable: true, search: true, width: 200 }
                    ],
                    viewrecords: true,
                    rowNum: 50,
                    rownumbers: true,
                    //pager: pager_selector_jentera,
                    altRows: true,
                    loadonce: false,
                    sortname: 'id_JTK',
                    sortorder: "desc",
                    search: true,
                    postData: {
                        filters: '{"groupOp":"AND","rules":[' +
                                '{"field":"noJentera","op":"cn","data":""}' +
                                ',{"field":"tarikhTamat","op":"cn","data":""}]}'
                    },
                    multiselect: true,
                    loadComplete: function () {

                        var table = this;
                        setTimeout(function () {
                            updateActionIcons(table);
                            updatePagerIcons(table);
                            enableTooltips(table);
                        }, 0);
                    },
                    autowidth: true,
                    shrinkToFit: false
                });
                //mda: end ->tab Notis Pemeriksaan(Jentera)---------------------------------------------------------
            }
            else if (i == 2) {
                //mda: start ->tab Jana Pemeriksaan(Jentera)---------------------------------------------------------
                if ($('#count').val() == 0) {
                    toastr["warning"]("Sila Notis Pemeriksaan sebelum menjana Rekod Pemeriksaan");
                    return;
                }
                var grid_selector_jana = "#grid-table-jana";
                var pager_selector_jana = "#grid-pager-jana";

                var getColumnIndexByNameX = function (grid_selector_jana, columnName) {
                    var cm = $(grid_selector_jana).jqGrid('getGridParam', 'colModel');
                    for (var i = 0, l = cm.length; i < l; i++) {
                        if (cm[i].name === columnName) {
                            return i; // return the index
                        }
                    }
                    return -1;
                };

                var API_URL = "../api/PemeriksaanMain/GetJana?id_AgihanTK=" + vbid_AgihanTK;

                var pageWidth = $(grid_selector_jana).parent().width() - 100;

                $(grid_selector_jana).jqGrid({
                    url: API_URL,
                    height: 325,
                    datatype: "json",
                    colNames: ['', '', "No. Jentera", "Jenis", "Tarikh Periksa", "Jenis Pemeriksaan", "Pemeriksa", "Status", "Jumlah Caj",'', "Perincian"],
                    colModel: [
                              { name: 'id_Pemeriksaan', index: 'id_Pemeriksaan', formatter: fontColorFormat, width: 1 },
                              { name: 'id_PJentera', index: 'id_PJentera', width: 0, hidden: true },
                              { name: 'noJentera', index: 'No. Jentera', editable: true, search: true, stype: 'text', width: (pageWidth * (15 / 100)) },
                              { name: 'jenisJentera', index: 'Jenis Jentera', editable: true, search: true, stype: 'text', width: (pageWidth * (5 / 100)) },
                              { name: 'tarikhPeriksa', index: 'Tarikh Periksa', editable: true, search: true, stype: 'text', width: (pageWidth * (15 / 100)) },
                              { name: 'jenisPemeriksaan', index: 'Jenis Pemeriksaan', editable: true, search: true, stype: 'text', width: (pageWidth * (20 / 100)) },
                              { name: 'pemeriksa', index: 'Pemeriksa', editable: true, search: true, stype: 'text', width: (pageWidth * (20 / 100)) },
                              { name: 'status', index: 'Status', editable: true, search: true, stype: 'text', width: (pageWidth * (10 / 100)) },
                              { name: 'jumlahCaj', index: 'Jumlah Caj', editable: true, align: 'right', search: true, stype: 'text', sorttype: 'number', formatter: 'number', summaryType: 'sum', width: (pageWidth * (10 / 100)) },
                              { name: 'status_bil', index: 'status_bil', width: 0, hidden: true },
                              {
                                  name: 'act', index: 'act', width: (pageWidth * (10 / 100)), align: 'center', sortable: false, formatter: 'actions',
                                  formatoptions: {
                                      keys: true,
                                      editbutton: false,
                                      delbutton: false
                                  }
                              }
                    ],
                    viewrecords: true,
                    rowNum: 10,
                    rownumbers: true,
                    rowList: [10, 20, 30],
                    pager: pager_selector_surat,
                    altRows: true,
                    loadonce: false,
                    sortname: 'id_notis',
                    sortorder: "desc",
                    search: true,
                    multiselect: true,
                    postData: {
                        filters: '{"groupOp":"AND","rules":[' +
                                '{"field":"tarikhPeriksa","op":"cn","data":""}' +
                                ',{"field":"jenisPemeriksaan","op":"cn","data":""}]}'
                    },
                    loadComplete: function () {
                        var grid = $(this),
                        iCol = getColumnIndexByNameX(grid, 'act'); // 'act' - name of the actions column

                        grid.children("tbody")
                       .children("tr.jqgrow")
                       .children("td:nth-child(" + (iCol + 1) + ")")
                       .each(function () {
                           $("<div>",
                               {
                                   title: "Lihat Perincian",
                                   mouseover: function () {
                                       $(this).addClass('ui-state-hover');
                                   },
                                   mouseout: function () {
                                       $(this).removeClass('ui-state-hover');
                                   },
                                   click: function (e) {
                                       var id = $(e.target).closest("tr.jqgrow").attr("id");
                                       var vnoJentera = $(grid_selector_jana).getCell(id, "noJentera");
                                       var vjenisJentera = $(grid_selector_jana).getCell(id, "jenisJentera");
                                       var vidPemeriksaan = $(grid_selector_jana).getCell(id, "id_Pemeriksaan");
                                       var vstatus = $(grid_selector_jana).getCell(id, "status");
                                       //$('#hideStatus').val(vstatus);
                                       switch (vjenisJentera) {
                                           case "PMA":
                                               document.getElementById("PMAgroup").style.display = 'block';
                                               document.getElementById("PMTgroup").style.display = 'none';
                                               document.getElementById("PMDgroup").style.display = 'none';
                                               break;
                                           case "PMD":
                                               document.getElementById("PMAgroup").style.display = 'none';
                                               document.getElementById("PMTgroup").style.display = 'none';
                                               document.getElementById("PMDgroup").style.display = 'block';
                                               break;
                                           case "PMT":
                                               document.getElementById("PMAgroup").style.display = 'none';
                                               document.getElementById("PMTgroup").style.display = 'block';
                                               document.getElementById("PMDgroup").style.display = 'none';
                                               break;
                                       }                                    

                                       angular.element($("#dtlPemeriksaanController")).scope().anyFunc($(vidPemeriksaan).html(), vnoJentera, vjenisJentera);
                                       $("#dtlPemeriksaanModal").modal('show');
                                   }
                               }
                             ).css({ "margin-left": "5px", float: "left" })
                              .addClass("ui-pg-div ui-inline-custom")
                              .append('<span class="ui-icon fa fa-angle-double-right bigger-140"></span>')
                              .appendTo($(this).children("div"));
                       });

                        var table = this;
                        setTimeout(function () {
                            updateActionIcons(table);
                            updatePagerIcons(table);
                            enableTooltips(table);
                        }, 0);
                    },
                    gridComplete: function () {
                        var recs = parseInt($(grid_selector_jana).getGridParam("records"), 10);
                        if (isNaN(recs) || recs == 0) {
                            $("#gridJana").hide();
                        }
                        else {
                            $('#gridJana').show();
                        }

                        var ids = $(grid_selector_jana).jqGrid('getDataIDs');
                        for (var i = 0; i < ids.length; i++) {
                            var rowId = ids[i];
                            var vstatus = $(grid_selector_jana).getCell(rowId, "status");
                            var vstatus_bil = $(grid_selector_jana).getCell(rowId, "status_bil");

                            $('#hideid_Pemeriksaan').val($($(grid_selector_jana).getCell(rowId, "id_Pemeriksaan")).html());
                            if (vstatus == "Tolak Guna" || vstatus == "Tidak Aktif") {//update this to have your own check
                                var checkbox = $("#jqg_grid-table-jana" + "_" + rowId);//update this with your own grid name
                                checkbox.css("visibility", "hidden");
                                checkbox.attr("disabled", true);
                            }
     
                            if (vstatus_bil == 1) {//update this to have your own check
                                var checkbox = $("#jqg_grid-table-jana" + "_" + rowId);//update this with your own grid name
                                checkbox.css("visibility", "hidden");
                                checkbox.attr("disabled", true);

                                //var checkbox = $("#jqg_grid-table-jana" + "_" + rowId);//update this with your own grid name
                                //checkbox.css("visibility", "hidden");
                                //checkbox.attr("disabled", true);
                            }
                        }
                       

                    },
                    autowidth: true,
                    caption: "Senarai Jana Pemeriksaan",
                    grouping: true,
                    groupingView: {
                        groupField: ['id_Pemeriksaan'],
                        //groupColumnShow: [true],
                        //groupText: ['<b>{0}</b>'],
                        //groupCollapse: false,
                        groupOrder: ['asc'],
                        groupSummary: [true],
                        //showSummaryOnHide: true,
                        //groupDataSorted: true
                    },
                    //footerrow: true,
                    //userDataOnFooter: true
                });
                function fontColorFormat(cellvalue, options, rowObject) {
                    var color = "#FFFFFF";
                    var cellHtml = "<span style='color:" + color + ";opacity:.0' originalValue='" + cellvalue + "'>" + cellvalue + "</span>";
                    return cellHtml;
                }
                //mda: end ->tab Jana Pemeriksaan(Jentera)---------------------------------------------------------

            }
        },
        //onPrev: function (i) { alert("Event onPrev, step: " + i) },
        //onFinish: function (i) { alert("Event onFinish") },
        //onSlideChanged: function (from, to) { alert("Event onSlideChanged. From slide " + from + " to slide " + to) }
    })

})
