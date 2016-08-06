
$(document).ready(function () {

    $('#hidepaccess_puser').empty();
    $('#hidepaccess_pusersi').empty();
    $('#hidepaccess_ap').empty();
    $('#questionlist').modal('hide');

    //LOAD CUSTOMER
    var powner = $("#powner");
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
            $.each(data.Structure, function (i, val) {
                CertStructure.append(
                    $("<option></option>").val(val.StructureID).html(val.StructureName)
                );
            });
        },
        error: function () {
        }
    });

    var cachedCountryOptions = null;
    var cachedMediaOptions = null;
    var cachedTypeOptions = null;
    var cachedProductOptions = null;

    $('#ChallengeTbl').jtable({
        title: 'Question List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'RNO ASC',
        selecting: true, //Enable selecting
        multiselect: true, //Allow multiple selecting
        selectingCheckboxes: true, //Show checkboxes on first column
        //selectOnRowClick: false, //Enable this to only select using checkboxes
        actions: {
            listAction: '/Project/QueList',
            deleteAction: '/Project/SaveQuestion'
        },
        fields: {
            RNO: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: false
            },
            rowNum: {
                title: 'No',
                key: false,
                create: false,
                edit: false,
                del: false,
                list: true,
                width: '1%'
            },
            Value: {
                title: 'Question',
                inputClass: 'validate[required]'
                //width: '15%',
                //type: 'textarea'
                //displayFormat: 'yy-mm-dd'
            },
        },
        //Register to selectionChanged event to handle events
        selectionChanged: function () {

            //Get all selected rows
            var $selectedRows = $('#ChallengeTbl').jtable('selectedRows');

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
        }
    });
    //Load challenge list from server
    $('#ChallengeTbl').jtable('load');

    $('#btnQuestionSubmit').click(function () {
        $('#questionlist').modal('hide');
    });

    $('#btnRedirect').click(function () {
        window.location.href = "../Project"
    });
});

$('#btnQuestion').click(function (e) {
    e.preventDefault();
    $('#questionlist').modal('show');
});

$('#btnSave').click(function () {

    var formProject = $("#formProject");

    formProject.validate({
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
                noSpace: true,
                alphanumeric: true,
                nonNumeric: true
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
    }, "Space are not allowed");

    jQuery.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^\w+$/i.test(value);
    }, "Only Letters and underscores allowed");

    jQuery.validator.addMethod("nonNumeric", function (value, element, param) {
        var reg = /[0-9]/;
        if (reg.test(value)) {
            return false;
        } else {
            return true;
        }
    }, "Number is not permitted");

    if (formProject.valid()) {
        //Manage certificate (Medium Type checkbox)
        if ($("#cmediumsoft").is(":checked") == false && $("#cmediumtoken").is(":checked") == false) {
            if ($("#cmediumsmart").is(":checked") == false) {
                if ($("#cmediumroaming").is(":checked") == false) {
                    bootbox.alert("Please select Medium Type", function () {
                    });
                    return false;
                }
            }
        }

        //Manage Payment validation (Public user)
        //if ($("#ptuserbypass").is(":checked") == false && $("#ptuseronline").is(":checked") == false) {
        //    if ($("#ptusermanual").is(":checked") == false) {
        //        bootbox.alert("Please select Payment Method", function () {
        //        });
        //        return false;
        //    }
        //}
        ////Manage Payment validation (Authorized Personnel (AP)) 
        //if ($("#ptapbypass").is(":checked") == false && $("#ptaponline").is(":checked") == false) {
        //    if ($("#ptapmanual").is(":checked") == false) {
        //        bootbox.alert("Please select Payment", function () {
        //        });
        //        return false;
        //    }
        //}
        // Checked URL is empty

        if ($("#ptuseronline").is(":checked") && $('#ptuserurl').val() == "") {
            bootbox.alert("Please fill in User Online Payment URL", function () {
            });
            return false;
        }

        if ($("#ptaponline").is(":checked") && $('#ptapurl').val() == "") {
            bootbox.alert("Please fill in AP Online Payment URL", function () {
            });
            return false;
        }

        //Manage Document validation
        if ($("#sdrequired1").is(":checked") == false && $("#sdrequired0").is(":checked") == false) {
            bootbox.alert("Please select Supporting Document", function () {
            });
            return false;
        }
        //Manage Document validation if user click yes
        if ($("#sdrequired1").is(":checked")) {
            if ($("#sdic").is(":checked") == false && $("#sdssm").is(":checked") == false) {
                if ($("#sdregslip").is(":checked") == false) {
                    if ($("#sdauth").is(":checked") == false) {
                        bootbox.alert("Please select Supporting Document", function () {
                        });
                        return false;
                    }
                }
            }
        }

        // Manage Verification & Approval
        if ($("#visap").is(":checked") == false && $("#visrp").is(":checked") == false) {
            bootbox.alert("Please select Verificationl", function () {
            });
            return false;
        }
        if ($("#aisro").is(":checked") == false && $("#aisbypass").is(":checked") == false) {
            bootbox.alert("Please select Approval", function () {
            });
            return false;
        }

        var sMOP = "";
        var selectedMOP = $("input[type='radio'][name='mofp']:checked");
        if (selectedMOP.length > 0) {
            sMOP = selectedMOP.val();
        }
        if (sMOP == "") {
            bootbox.alert("Please select Project Type");
            return false;
        }

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

        //var r = confirm("Are you sure to CREATE NEW PROJECT");
        bootbox.confirm("Are you sure to CREATE NEW PROJECT?", function (result) {
            if (result) {
                $.LoadingOverlay("show");

                var project = {
                    //assign hidden value into model value
                    //STEP 1
                    ProjectCode: $('#pcode').val(),
                    ProjectName: $('#pname').val(),
                    GLCode: $('#GLCode').val(),
                    ProjectType: sMOP,
                    ProjectPrefix: $('#pprefix').val(),
                    ProjectOwner: $('#powner').val(),
                    ProjectCP: $('#ProjectCP').val(),
                    ProjectDesc: $('#pownerdesc').val(),
                    P_Remarks: $('#premarks').val(),
                    P_EmailCC: $('#pemailcc').val(),
                    P_QuantityPO: $('#P_QuantityPO').val(),
                    P_QuantityPaid: $('#P_QuantityPaid').val(),
                    P_AccessIsUser: $('#hidepaccess_puser').val(),
                    P_AccessIsUserSI: $('#hidepaccess_pusersi').val(),
                    P_AccessIsAP: $('#hidepaccess_ap').val(),

                    ProjectPONumber: $('#ProjectPONumber').val(),

                    //STEP 2
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

                    //STEP 3
                    PT_UserIsBypass: $('#hideptuserbypass').val(),
                    PT_UserIsOnline: $('#hideptuseronline').val(),
                    PT_UserIsManual: $('#hideptusermanual').val(),
                    PT_APIsBypass: $('#hideptapbypass').val(),
                    PT_APIsOnline: $('#hideptaponline').val(),
                    PT_APIsManual: $('#hideptapmanual').val(),
                    PT_UserURL: $('#ptuserurl').val(),
                    PT_APURL: $('#ptapurl').val(),

                    //STEP 4
                    SD_IsRequired: $('#hidesdrequired').val(),
                    SD_IsIC: $('#hidesdic').val(),
                    SD_IsSSM: $('#hidesdssm').val(),
                    SD_IsRegSlip: $('#hidesdregslip').val(),
                    SD_IsAuthLetter: $('#hidesdauth').val(),
                    SD_IsPassPort: $('#hideSD_IsPassPort').val(),
                    SD_IsSupporting1: $('#hideSD_IsSupporting1').val(),
                    SD_IsSupporting2: $('#hideSD_IsSupporting2').val(),

                    //STEP 5
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
                    url: '../Project/SaveProject/',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(project),
                    dataType: 'json',
                    success: function (data) {
                        if (data.status == "OK") {
                            //SAVE QUESTIONS ONE BY ONE BY SELECTED ROWS
                            var $selectedRows = $('#ChallengeTbl').jtable('selectedRows');
                            $('#ChallengeTbl').jtable('deleteRows', $selectedRows);
                            $.LoadingOverlay("hide");
                            //alert("NEW Project successfully ADDED");
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
                        toastr["error"]("Record failed")
                    }
                });
            } else {
            }
        });
    }
});

$("#powner").change(function () {
    var powner = parseInt($("#powner").val());
    if (!isNaN(powner)) {
        var ProjectCP = $("#ProjectCP");
        ProjectCP.empty();
        ProjectCP.append($("<option></option").val("").html("Select Contact Person"));

        $.ajax({
            url: '../Project/GetContactPerson/',
            type: "POST",
            data: { CustomerID: powner },
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

//MANAGE SUPPORTING DOCUMENT 
$('#sdrequired1').on('ifChecked', function (event) {
    $("#supdoc").show();
});
$('#sdrequired1').on('ifUnchecked', function (event) {
    $("#supdoc").hide();
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