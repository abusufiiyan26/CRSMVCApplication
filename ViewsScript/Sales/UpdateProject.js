
$(document).ready(function () {

    var HideError = $('#hideError').val();
    if (HideError == "") {
        bootbox.dialog({
            message: "PROJECT NOT FOUND. PLEASE RETRY",
            title: "<i class='fa fa-info-circle'></i>" + "Info",
            buttons: {
                ok: {
                    label: "OK",
                    className: "btn-success",
                    callback: function () {
                        window.location.replace('../Project');
                    }
                }
            }
        });
    }

    if ($('#HideUserOnline').val() == "1") {
        $("#ccaddress1").show();
    }
    if ($('#HideAPOnline').val() == "1") {
        $("#ccaddress2").show();
    }

    if ($('#HideProjectType').val() == "3") {
        $("#HidePOFileUpload").show();
    }
    if ($('#HideProjectType').val() == "4") {
        $("#HidePaidQuantity").show();
    }

    var mediaSelect = $("#mediaSelect");
    var Hide_C_MediumIsSoft = $('#Hide_C_MediumIsSoft').val();
    var Hide_C_MediumIsToken = $('#Hide_C_MediumIsToken').val();
    var Hide_C_MediumIsSmart = $('#Hide_C_MediumIsSmart').val();
    var Hide_C_MediumIsRoaming = $('#Hide_C_MediumIsRoaming').val();
    var Hide_C_MediumIsServer = $('#Hide_C_MediumIsServer').val();

    if (Hide_C_MediumIsSoft == 1) {
        mediaSelect.append(
            $("<option></option>").val("3").html("Soft Certificate")
        );
    }
    if (Hide_C_MediumIsToken == 1) {
        mediaSelect.append(
            $("<option></option>").val("2").html("Token")
        );
    }
    if (Hide_C_MediumIsSmart == 1) {
        mediaSelect.append(
            $("<option></option>").val("4").html("Smart Card")
        );
    }
    if (Hide_C_MediumIsRoaming == 1) {
        mediaSelect.append(
            $("<option></option>").val("1").html("Roaming")
        );
    }
    if (Hide_C_MediumIsServer == 1) {
        mediaSelect.append(
            $("<option></option>").val("5").html("Server Certificate")
        );
    }

    //LOAD CUSTOMER
    var powner = $("#ProjectOwner");
    powner.empty();
    powner.append($("<option></option").val("").html("Select Customer"));

    var ProjectCP = $("#ProjectCP");
    ProjectCP.empty();
    ProjectCP.append($("<option></option").val("").html("Select Contact Person"));

    var CertStructure = $("#CertStructure");
    CertStructure.empty();
    CertStructure.append($("<option></option").val("").html("Select Structure"));

    $.ajax({
        url: '/Project/GetCustomer/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Customer, function (i, val) {
                powner.append(
                    $("<option></option>").val(val.U_CompanyID).html(val.U_CompanyName)
                );
            });
            powner.val($('#HideProjectOwner').val());
            powner.select2("val", $('#HideProjectOwner').val());

            $.each(data.Structure, function (i, val) {
                CertStructure.append(
                    $("<option></option>").val(val.StructureID).html(val.StructureName)
                );
            });
            CertStructure.val($('#HideCertStructure').val());

            $.ajax({
                url: '/Project/GetContactPerson/',
                type: "POST",
                //contentType: 'application/json; charset=utf-8',
                data: { CustomerID: powner.val() },
                dataType: "json",
                success: function (data) {
                    $.each(data.User, function (i, val) {
                        ProjectCP.append(
                            $("<option></option>").val(val.User_ID).html(val.Name)
                        );
                    });
                    ProjectCP.select2("val", $('#HideProjectCP').val());
                },
                error: function () {
                }
            });
        },
        error: function () {
        }
    });


    $('#hidepaccess_puser').empty();
    $('#hidepaccess_pusersi').empty();
    $('#hidepaccess_ap').empty();
    $('#questionlist').modal('hide');

    var cachedCountryOptions = null;
    var cachedMediaOptions = null;
    var cachedTypeOptions = null;
    var cachedProductOptions = null;

    $('#ChallengeTbl').jtable({
        title: 'Selected Question List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'RNO ASC',
        selecting: true, //Enable selecting
        multiselect: true, //Allow multiple selecting
        selectingCheckboxes: true, //Show checkboxes on first column
        //selectOnRowClick: false, //Enable this to only select using checkboxes
        actions: {
            listAction: '/Project/QueUpdateList',
            deleteAction: '/Project/UpdateQuestion'
        },
        fields: {
            RNO: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: false
            },
            Value: {
                title: 'Question',
                inputClass: 'validate[required]'
            },
        },
        //Register to selectionChanged event to handle events
        selectionChanged: function () {
            //Get all selected rows
            $selectedRows = $('#ChallengeTbl').jtable('selectedRows');

            $('#SelectedRowList').empty();
            if ($selectedRows.length > 0) {
                //Show selected rows
                $selectedRows.each(function () {
                    var record = $(this).data('record');
                });
            } else {
                //No rows selected
                $('#SelectedRowList').append('No row selected! Select rows to see here...');
            }
        },
        rowInserted: function (event, data) {
            data.row.find('.jtable-delete-command-button').hide();

            if (data.record.IsSelected == 1) {
                $('#ChallengeTbl').jtable('selectRows', data.row);
            }
        }
    });
    //Load product list from server
    $('#ChallengeTbl').jtable('load');

    $('#btnQuestionSubmit').click(function (e) {
        //e.preventDefault();
        ////$('#ChallengeTbl').jtable('deleteRows', $selectedRows);

        //var $selectedRows = $('#ChallengeTbl').jtable('selectedRows');
        //var record = "";
        //$('#SelectedRowList').empty();
        //$('#Test').empty();
        //$selectedRows.each(function () {
        //    record = $(this).data('record');
        //    $('#Test').append(record.RNO + record.Value);
        //});

        $('#questionlist').modal('hide');
    });

    $('#btnUpdateRedirect').click(function () {
        window.location.href = "../Project"
    });
});

$('#btnUpdateSave').click(function () {

    var formUpdateProject = $("#formUpdateProject");

    formUpdateProject.validate({
        rules: {
            ProjectCode: {
                required: true
            },
            ProjectName: {
                required: true
            },
            ProjectOwner: {
                required: true
            },
            ProjectPrefix: {
                required: true,
                noSpace: true
            }
        },
        messages: {
            ProjectCode: {
                required: "Project code is required"
            },
            ProjectName: {
                required: "Project name is required"
            },
            ProjectOwner: {
                required: "Customer name is required"
            },
            ProjectPrefix: {
                required: "Project prefix is required"
            }
        }
    });
    jQuery.validator.addMethod("noSpace", function (value, element) {
        return value.indexOf(" ") < 0 && value != "";
    }, "No space allowed");

    //jQuery.validator.addMethod("noSpace", function (value, element) {
    //    return this.optional(element) || /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/.test(value);
    //});

    var sMOP = "";
    var selectedMOP = $("input[type='radio'][name='mofp']:checked");
    if (selectedMOP.length > 0) {
        sMOP = selectedMOP.val();
    }
    if (sMOP == "") {
        bootbox.alert("Please select Project Type");
        return false;
    }

    if (formUpdateProject.valid()) {

        bootbox.confirm("Are you sure to UPDATE " + $('#ProjectName').val() + " PROJECT?", function (result) {
            if (result) {
                $.LoadingOverlay("show");
                //Insert verification value into token value
                var hideToken_V_IsAP = 0;
                var hideToken_V_IsRP = 0;
                var hideToken_A_IsRO = 0;
                var hideToken_A_IsBypassRO = 0;

                //Insert verification value into soft value 
                var hideSoft_V_IsAP = 0;
                var hideSoft_V_IsRP = 0;
                var hideSoft_A_IsRO = 0;
                var hideSoft_A_IsBypassRO = 0;

                //Insert verification value into smart card value
                var hideSmart_V_IsAP = 0;
                var hideSmart_V_IsRP = 0;
                var hideSmart_A_IsRO = 0;
                var hideSmart_A_IsBypassRO = 0;

                //Insert verification value into server cert value
                var hideServer_V_IsAP = 0;
                var hideServer_V_IsRP = 0;
                var hideServer_A_IsRO = 0;
                var hideServer_A_IsBypassRO = 0;

                //INSERT INTO HIDDEN FIELD (STEP 1)
                if ($("#paccess_puser").is(":checked")) {
                    //do something if the checkbox is checked
                    $('#hidepaccess_puser').val("true");
                }
                if ($("#paccess_pusersi").is(":checked")) {
                    $('#hidepaccess_pusersi').val("true");
                }
                if ($("#paccess_ap").is(":checked")) {
                    $('#hidepaccess_ap').val("true");
                }

                //INSERT INTO HIDDEN FIELD (STEP 2)
                if ($("#ccertcountry").is(":checked")) {
                    $('#hideccertcountry').val("true");
                }
                if ($("#ccertcn").is(":checked")) {
                    $('#hideccertcn').val("true");
                }
                if ($("#ccertsn").is(":checked")) {
                    $('#hideccertsn').val("true");
                }
                if ($("#ccertemail").is(":checked")) {
                    $('#hideccertemail').val("true");
                }
                if ($("#ccertorgname").is(":checked")) {
                    $('#hideccertorgname').val("true");
                }
                if ($("#ccertorgid").is(":checked")) {
                    $('#hideccertorgid').val("true");
                }
                if ($("#cmediumroaming").is(":checked")) {
                    $('#hidecmediumroaming').val("true");

                    //INSERT INTO HIDDEN FIELD (STEP 5)
                    if ($("#visap").is(":checked")) {
                        $('#hidevisap').val("true");
                    }
                    if ($("#visrp").is(":checked")) {
                        $('#hidevisrp').val("true");
                    }
                    if ($("#aisro").is(":checked")) {
                        $('#hideaisro').val("true");
                    }
                    if ($("#aisbypass").is(":checked")) {
                        $('#hideaisbypass').val("true");
                    }
                }
                if ($("#cmediumsoft").is(":checked")) {
                    $('#hidecmediumsoft').val("true");

                    if ($("#Soft_V_IsAP").is(":checked")) {
                        hideSoft_V_IsAP = 1;
                    }
                    if ($("#Soft_V_IsRP").is(":checked")) {
                        hideSoft_V_IsRP = 1;
                    }
                    if ($("#Soft_A_IsRO").is(":checked")) {
                        hideSoft_A_IsRO = 1;
                    }
                    if ($("#Soft_A_IsBypassRO").is(":checked")) {
                        hideSoft_A_IsBypassRO = 1;
                    }
                }
                if ($("#cmediumtoken").is(":checked")) {
                    $('#hidecmediumtoken').val("true");

                    //INSERT INTO HIDDEN FIELD (STEP 5)
                    if ($("#Token_V_IsAP").is(":checked")) {
                        hideToken_V_IsAP = 1;
                    }
                    if ($("#Token_V_IsRP").is(":checked")) {
                        hideToken_V_IsRP = 1;
                    }
                    if ($("#Token_A_IsRO").is(":checked")) {
                        hideToken_A_IsRO = 1;
                    }
                    if ($("#Token_A_IsBypassRO").is(":checked")) {
                        hideToken_A_IsBypassRO = 1;
                    }
                }
                if ($("#cmediumsmart").is(":checked")) {
                    $('#hidecmediumsmart').val("true");

                    if ($("#Smart_V_IsAP").is(":checked")) {
                        hideSmart_V_IsAP = 1;
                    }
                    if ($("#Smart_V_IsRP").is(":checked")) {
                        hideSmart_V_IsRP = 1;
                    }
                    if ($("#Smart_A_IsRO").is(":checked")) {
                        hideSmart_A_IsRO = 1;
                    }
                    if ($("#Smart_A_IsBypassRO").is(":checked")) {
                        hideSmart_A_IsBypassRO = 1;
                    }
                }
                if ($("#cmediumserver").is(":checked")) {
                    $('#hidecmediumserver').val("true");

                    if ($("#Server_V_IsAP").is(":checked")) {
                        hideServer_V_IsAP = 1;
                    }
                    if ($("#Server_V_IsRP").is(":checked")) {
                        hideServer_V_IsRP = 1;
                    }
                    if ($("#Server_A_IsRO").is(":checked")) {
                        hideServer_A_IsRO = 1;
                    }
                    if ($("#Server_A_IsBypassRO").is(":checked")) {
                        hideServer_A_IsBypassRO = 1;
                    }
                }

                //INSERT INTO HIDDEN FIELD (STEP 3)
                if ($("#ptuserbypass").is(":checked")) {
                    $('#hideptuserbypass').val("true");
                }
                if ($("#ptuseronline").is(":checked")) {
                    $('#hideptuseronline').val("true");
                }
                if ($("#ptusermanual").is(":checked")) {
                    $('#hideptusermanual').val("true");
                }
                if ($("#ptapbypass").is(":checked")) {
                    $('#hideptapbypass').val("true");
                }
                if ($("#ptaponline").is(":checked")) {
                    $('#hideptaponline').val("true");
                }
                if ($("#ptapmanual").is(":checked")) {
                    $('#hideptapmanual').val("true");
                }

                //INSERT INTO HIDDEN FIELD (STEP 4)
                if ($("#sdrequired1").is(":checked")) {
                    $('#hidesdrequired').val("Y");
                }
                if ($("#sdrequired0").is(":checked")) {
                    $('#hidesdrequired').val("N");
                }
                if ($("#sdic").is(":checked")) {
                    $('#hidesdic').val("true");
                }
                if ($("#sdssm").is(":checked")) {
                    $('#hidesdssm').val("true");
                }
                if ($("#sdregslip").is(":checked")) {
                    $('#hidesdregslip').val("true");
                }
                if ($("#sdauth").is(":checked")) {
                    $('#hidesdauth').val("true");
                }
                if ($("#SD_IsPassPort").is(":checked")) {
                    $('#hideSD_IsPassPort').val("true");
                }
                if ($("#SD_IsSupporting1").is(":checked")) {
                    $('#hideSD_IsSupporting1').val("true");
                }
                if ($("#SD_IsSupporting2").is(":checked")) {
                    $('#hideSD_IsSupporting2').val("true");
                }

                //INSERT INTO HIDDEN FIELD (STEP 5)
                if ($("#visap").is(":checked")) {
                    $('#hidevisap').val("true");
                }
                if ($("#visrp").is(":checked")) {
                    $('#hidevisrp').val("true");
                }
                if ($("#aisro").is(":checked")) {
                    $('#hideaisro').val("true");
                }
                if ($("#aisbypass").is(":checked")) {
                    $('#hideaisbypass').val("true");
                }

                var projectUpdate = {
                    //assign hidden value into model value
                    //STEP 1 - UpdateManageProfile
                    GLCode: $('#GLCode').val(),
                    ProjectType: sMOP,
                    ProjectCode: $('#ProjectCode').val(),
                    ProjectName: $('#ProjectName').val(),
                    ProjectPrefix: $('#ProjectPrefix').val(),
                    ProjectOwner: $('#ProjectOwner').val(),
                    ProjectCP: $('#ProjectCP').val(),
                    ProjectDesc: $('#ProjectDesc').val(),
                    P_Remarks: $('#P_Remarks').val(),
                    P_EmailCC: $('#P_EmailCC').val(),
                    P_QuantityPO: $('#P_QuantityPO').val(),
                    P_QuantityPaid: $('#P_QuantityPaid').val(),
                    P_AccessIsUser: $('#hidepaccess_puser').val(),
                    P_AccessIsUserSI: $('#hidepaccess_pusersi').val(),
                    P_AccessIsAP: $('#hidepaccess_ap').val(),

                    ProjectPONumber: $('#ProjectPONumber').val(),

                    //STEP 2 - UpdateManageCertificate
                    C_CertIsCountry: $('#hideccertcountry').val(),
                    C_CertIsCN: $('#hideccertcn').val(),
                    C_CertIsSN: $('#hideccertsn').val(),
                    C_CertIsEmail: $('#hideccertemail').val(),
                    C_CertIsOrgName: $('#hideccertorgname').val(),
                    C_CertIsOrgRegNo: $('#hideccertorgid').val(),
                    C_MediumIsSoft: $('#hidecmediumsoft').val(),
                    C_MediumIsToken: $('#hidecmediumtoken').val(),
                    C_MediumIsSmart: $('#hidecmediumsmart').val(),
                    C_MediumIsRoaming: $('#hidecmediumroaming').val(),
                    C_MediumIsServer: $('#hidecmediumserver').val(),

                    //STEP 3 - UpdateManagePayment
                    PT_UserIsBypass: $('#hideptuserbypass').val(),
                    PT_UserIsOnline: $('#hideptuseronline').val(),
                    PT_UserIsManual: $('#hideptusermanual').val(),
                    PT_APIsBypass: $('#hideptapbypass').val(),
                    PT_APIsOnline: $('#hideptaponline').val(),
                    PT_APIsManual: $('#hideptapmanual').val(),
                    PT_UserURL: $('#ptuserurl').val(),
                    PT_APURL: $('#ptapurl').val(),

                    //STEP 4 - UpdateManageSupDoc
                    SD_IsRequired: $('#hidesdrequired').val(),
                    SD_IsIC: $('#hidesdic').val(),
                    SD_IsSSM: $('#hidesdssm').val(),
                    SD_IsRegSlip: $('#hidesdregslip').val(),
                    SD_IsAuthLetter: $('#hidesdauth').val(),
                    SD_IsPassPort: $('#hideSD_IsPassPort').val(),
                    SD_IsSupporting1: $('#hideSD_IsSupporting1').val(),
                    SD_IsSupporting2: $('#hideSD_IsSupporting2').val(),

                    //STEP 5 - UpdateManageVerfAprv
                    V_IsAP: $('#hidevisap').val(),
                    V_IsRP: $('#hidevisrp').val(),
                    A_IsRO: $('#hideaisro').val(),
                    A_IsBypassRO: $('#hideaisbypass').val(),
                    MAXselectedno: $('#MAXselectedno').val(),

                    //VERIFICATION MEDIUM
                    Token_V_IsAP: hideToken_V_IsAP,
                    Token_V_IsRP: hideToken_V_IsRP,
                    Token_A_IsRO: hideToken_A_IsRO,
                    Token_A_IsBypassRO: hideToken_A_IsBypassRO,

                    Soft_V_IsAP: hideSoft_V_IsAP,
                    Soft_V_IsRP: hideSoft_V_IsRP,
                    Soft_A_IsRO: hideSoft_A_IsRO,
                    Soft_A_IsBypassRO: hideSoft_A_IsBypassRO,

                    Smart_V_IsAP: hideSmart_V_IsAP,
                    Smart_V_IsRP: hideSmart_V_IsRP,
                    Smart_A_IsRO: hideSmart_A_IsRO,
                    Smart_A_IsBypassRO: hideSmart_A_IsBypassRO,

                    Server_V_IsAP: hideServer_V_IsAP,
                    Server_V_IsRP: hideServer_V_IsRP,
                    Server_A_IsRO: hideServer_A_IsRO,
                    Server_A_IsBypassRO: hideServer_A_IsBypassRO,

                    CertStructure: $('#CertStructure').val()
                };

                //pass value to controller using jquery
                $.ajax({
                    url: '../Project/UpdateProject/',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(projectUpdate),
                    dataType: 'json',
                    success: function (data) {
                        if (data.status == "OK") {
                            var $selectedRows = $('#ChallengeTbl').jtable('selectedRows');
                            $('#ChallengeTbl').jtable('deleteRows', $selectedRows);
                            $.LoadingOverlay("hide");
                            bootbox.dialog({
                                message: data.Message,
                                title: "<i class='fa fa-info-circle'></i>" + "Info",
                                buttons: {
                                    ok: {
                                        label: "OK",
                                        className: "btn-success",
                                        callback: function () {
                                            window.location.replace(data.redirectUrl);
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            $.LoadingOverlay("hide");
                            toastr["error"](data.Message);
                        }
                    },
                    error: function (errorThrown) {
                        $.LoadingOverlay("hide");
                        toastr["error"](errorThrown);
                    }
                });
            } else {
            }
        });
    }
});

$('#btnQuestion').click(function (e) {
    e.preventDefault();
    $('#questionlist').modal('show');
});

$('#ptaponline').change(function () {
    $("#ptapurl").show();
});

$("#ProjectOwner").change(function () {
    var ProjectOwner = parseInt($("#ProjectOwner").val());
    if (!isNaN(ProjectOwner)) {
        var ProjectCP = $("#ProjectCP");
        ProjectCP.empty();
        ProjectCP.append($("<option></option").val("").html("Select Contact Person"));

        $.ajax({
            url: '../Project/GetContactPerson/',
            type: "POST",
            data: { CustomerID: ProjectOwner },
            dataType: "json",
            success: function (data) {
                $.each(data.User, function (i, val) {
                    ProjectCP.append(
                        $("<option></option>").val(val.User_ID).html(val.Name)
                    );
                });
            },
            error: function () {
            }
        });
    }
});

// radio is clicked (STEP 4)
$('#sdrequired1').change(function () {
    $("#supdoc").show();
});
$('#sdrequired1').on('ifChecked', function (event) {
    $('#hidesdrequired').val("Y");
});
$('#sdrequired0').on('ifChecked', function (event) {
    $('#hidesdrequired').val("N");
});

//VERIFICATION DISPLAY HIDE
$('#cmediumroaming').on('ifChecked', function (event) {
    var mediaSelect = $("#mediaSelect");

    mediaSelect.append(
        $("<option></option>").val("1").html("Roaming")
    );
});
$('#cmediumroaming').on('ifUnchecked', function (event) {
    $("#mediaSelect option[value='1']").remove();
});
$('#cmediumtoken').on('ifChecked', function (event) {
    var mediaSelect = $("#mediaSelect");

    mediaSelect.append(
            $("<option></option>").val("2").html("Token")
        );
});
$('#cmediumtoken').on('ifUnchecked', function (event) {
    $("#mediaSelect option[value='2']").remove();
});
$('#cmediumsoft').on('ifChecked', function (event) {
    var mediaSelect = $("#mediaSelect");

    mediaSelect.append(
            $("<option></option>").val("3").html("Soft Certificate")
        );
});
$('#cmediumsoft').on('ifUnchecked', function (event) {
    $("#mediaSelect option[value='3']").remove();
});
$('#cmediumsmart').on('ifChecked', function (event) {
    var mediaSelect = $("#mediaSelect");

    mediaSelect.append(
            $("<option></option>").val("4").html("Smart Card")
        );
});
$('#cmediumsmart').on('ifUnchecked', function (event) {
    $("#mediaSelect option[value='4']").remove();
});
$('#cmediumserver').on('ifChecked', function (event) {
    var mediaSelect = $("#mediaSelect");

    mediaSelect.append(
            $("<option></option>").val("5").html("Server Certificate")
        );
});
$('#cmediumserver').on('ifUnchecked', function (event) {
    $("#mediaSelect option[value='5']").remove();
});
$('#mediaSelect').change(function () {
    var mediaSelect = $("#mediaSelect");

    if (mediaSelect.val() == "1") {
        $("#tokenverification").hide();
        $("#softverification").hide();
        $("#smartverification").hide();
        $("#serververification").hide();
        $("#roamingverification").show();
    }
    else if (mediaSelect.val() == "2") {
        $("#roamingverification").hide();
        $("#softverification").hide();
        $("#smartverification").hide();
        $("#serververification").hide();
        $("#tokenverification").show();
    }
    else if (mediaSelect.val() == "3") {
        $("#roamingverification").hide();
        $("#tokenverification").hide();
        $("#smartverification").hide();
        $("#serververification").hide();
        $("#softverification").show();
    }
    else if (mediaSelect.val() == "4") {
        $("#roamingverification").hide();
        $("#tokenverification").hide();
        $("#softverification").hide();
        $("#serververification").hide();
        $("#smartverification").show();
    }
    else if (mediaSelect.val() == "5") {
        $("#roamingverification").hide();
        $("#tokenverification").hide();
        $("#softverification").hide();
        $("#smartverification").hide();
        $("#serververification").show();
    }
    else {
        $("#roamingverification").hide();
        $("#tokenverification").hide();
        $("#softverification").hide();
        $("#smartverification").hide();
        $("#serververification").hide();
    }
});

//ONLINE PAYMENT DISPLAY HIDE
$('#ptuseronline').on('ifChecked', function (event) {
    $("#ccaddress1").show();
});
$('#ptuseronline').on('ifUnchecked', function (event) {
    $("#ccaddress1").hide();
});
$('#ptaponline').on('ifChecked', function (event) {
    $("#ccaddress2").show();
});
$('#ptaponline').on('ifUnchecked', function (event) {
    $("#ccaddress2").hide();
});

//PROJECT TYPE
$('#proTypeNormal').on('ifChecked', function (event) {
    $("#HidePOFileUpload").hide();
    $("#HidePaidQuantity").hide();
});
$('#proTypeContract').on('ifChecked', function (event) {
    $("#HidePOFileUpload").hide();
    $("#HidePaidQuantity").hide();
});
$('#proTypePO').on('ifChecked', function (event) {
    $("#HidePOFileUpload").show();
    $("#HidePaidQuantity").hide();
});
$('#proTypePaid').on('ifChecked', function (event) {
    $("#HidePOFileUpload").hide();
    $("#HidePaidQuantity").show();
});

$('#FileUploadPO').on('change', function (e) {
    var files = e.target.files;
    var type = "";
    var myID = "PO Project"; //uncomment this to make sure the ajax URL works
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
                    $('#FileUploadPO').val("");
                    return false;
                }
            }

            $.ajax({
                type: "POST",
                url: '/Project/POFiles?id=' + myID,
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    if (result.status == "Failed") {
                        $('#FileUploadPO').val("");
                        toastr["error"]("Failed to upload PO");
                    }
                    else {
                        toastr["success"]("PO Upload Success");
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