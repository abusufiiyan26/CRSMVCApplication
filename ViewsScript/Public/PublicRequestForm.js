var personalDetailsPnl = $("#PersonalDetailsPnl")
var accountDetailsPnl = $("#AccountDetailsPnl")
var securityDetailsPnl = $("#SecurityDetailsPnl")
var confirmationPnl = $("#ConfirmationPnl")
var stage1 = $("#stage1")
var stage1cur = $("#stage1cur")
var stage1suc = $("#stage1suc")
var stage2 = $("#stage2")
var stage2cur = $("#stage2cur")
var stage2suc = $("#stage2suc")
var stage3 = $("#stage3")
var stage3cur = $("#stage3cur")
var stage3suc = $("#stage3suc")
var stage4 = $("#stage4")
var stage4cur = $("#stage4cur")
var stage4suc = $("#stage4suc")
var form = $('form');
var DocsRequired = "";
var DocsICExist = "";
var DocsALExist = "";
var DocsSSMExist = "";

$(document).ready(function () {

    $('#DOB').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    vStepHide = $('#vStepHide').val();
    vPackageName = $('#vPackageName').val();
    vCertificateTypeDesc = $('#vCertificateTypeDesc').val();
    vNo_Year = $('#vNo_Year').val();
    vMediaName = $('#vMediaName').val();
    vPrice = $('#vPrice').val();

    accountDetailsPnl.hide();
    securityDetailsPnl.hide();
    confirmationPnl.hide();
    $("#hidepackage").hide();

    $("#icno").hide();
    $("#passport").hide();

    $('#ic').change(function () {
        $("#icno").show();
        $("#passport").hide();
    });
    $('#psport').change(function () {
        $("#icno").hide();
        $("#passport").show();
    });

    $("#ICNo").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            $("#errmsg").html("Numbers Only").show().fadeOut("slow");
            return false;
        }
    });
    $("#Postcode").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            $("#errmsg").html("Numbers Only").show().fadeOut("slow");
            return false;
        }
    });
    $("#Mobile_No").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            $("#errmsg").html("Numbers Only").show().fadeOut("slow");
            return false;
        }
    });

    $('#UserName').keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    //STEP CONTROL
    if (vStepHide == "Y2") {
        personalDetailsPnl.hide();
        accountDetailsPnl.hide();
        securityDetailsPnl.hide();
        confirmationPnl.show();

        stage1.hide();
        stage1cur.hide();
        stage1suc.show();
        stage2.hide();
        stage2cur.hide();
        stage2suc.show();
        stage3.hide();
        stage3cur.hide();
        stage3suc.show();
        stage4.hide();
        stage4cur.show();

        $("#validity").html(vNo_Year);
        $("#media").html(vMediaName);
        $("#packagename").html(vPackageName);
        $("#description").html(vCertificateTypeDesc);
        $("#price").html(vPrice);
        $("#TotalAmount").html(vPrice);

        //Display Document
        if ($('#iCountNRIC').val() > "0") {
            vFileNo = 1;
            downloadDocsNRIC("NRIC/Passport");
        }
        if ($('#iCountAL').val() > "0") {
            vALFileNo = 1;
            downloadDocsAuth("Authorization Letter");
        }
        downloadDocsReceipt("Payment Receipt");

        $("#hidepackage").show();
    }
    if (vStepHide == "Y3") {
        $("#validity").html(vNo_Year);
        $("#media").html(vMediaName);
        $("#packagename").html(vPackageName);
        $("#description").html(vCertificateTypeDesc);
        $("#price").html(vPrice);
        $("#TotalAmount").html(vPrice);
        $("#hidepackage").show();
    }
});

var checkic = "";
var checkuname = "";

$('#ICNo').blur(function () {
    var url = "/Register/CheckICNo";
    var name = $('#ICNo').val();

    $.get(url, { input: name }, function (data) {
        if (data == "NotAvailable") {
            $("#result").html("<span style='color:red'>IC NO already exist</span>");
            checkic = data;
        }
        else {
            $("#result").html("<span style='color:green'>Available</span>");
            checkic = data;
        }
    });
})

$('#UserName').blur(function () {
    var url = "/Register/CheckUserName";
    var usname = $('#UserName').val();

    $.get(url, { input: usname }, function (udata) {
        if (udata == "NotAvailable") {
            checkuname = udata;
        }
        else {
            //$("#uname").html("<span style='color:green'>Available</span>");
            checkuname = udata;
        }
    });
})

//Next - PersonalDetails
$('#validatePersonalDetails').click(function () {

    var edit = $('#hideEditMode').val();
    var isValid2 = "";

    if ($('#hideEditMode').val() == "true") {

        var selectedVal = "";
        var selected = $("input[type='radio'][name='SecurityImg']:checked");
        if (selected.length > 0) {
            selectedVal = selected.val();
        }
        if (selectedVal == "") {
            toastr["warning"]("Please select security image");
            return false;
        }
        if ($('#SecurityPhrase').val() == "") {
            toastr["warning"]("Please fill in Security Phrase before proceed");
            return false;
        }
        if (checkuname == "NotAvailable") {
            toastr["warning"]("Username already exist");
            return false;
        }

        var selectedGender = "";
        var selectedSex = $("input[type='radio'][name='Sex']:checked");
        if (selectedSex.length > 0) {
            selectedGender = selectedSex.val();
        }
        if (selectedGender == "") {
            toastr["warning"]("Please select gender");
            return false;
        }
        if ($('#DOB').val() == "") {
            toastr["warning"]("Please fill in Date of Birth");
            return false;
        }
        if ($('#Mobile_No').val() == "") {
            toastr["warning"]("Please fill in Telephone No");
            return false;
        }

        isValid2 = (form.validate().element($('#UserName'))
                    & form.validate().element($('#Password'))
                    & form.validate().element($('#ConfirmPassword')));
    }
    else {
        isValid2 = true;
    }

    if (isValid2 && checkuname != "NotAvailable") {
        accountDetailsPnl.show();
        personalDetailsPnl.hide();
        confirmationPnl.hide();
        stage1suc.show();
        stage1cur.hide();
        stage2cur.show();
        stage2.hide();
    }
    return isValid2;
});

//Prev - AccountDetails
function showPersonalDetailsPnl() {

    accountDetailsPnl.hide();
    confirmationPnl.hide();
    personalDetailsPnl.show();
    stage1suc.hide();
    stage1cur.show();
    stage2.show();
    stage2cur.hide();
}
//Next - AccountDetails
function validateAccountDetails() {

    accountDetailsPnl.hide();
    personalDetailsPnl.hide();
    securityDetailsPnl.show();
    stage2cur.hide();
    stage2suc.show();
    stage3.hide();
    stage3cur.show();
}

//Prev - SecurityDetails
function showAccountDetailsPnl() {

    personalDetailsPnl.hide();
    securityDetailsPnl.hide();
    accountDetailsPnl.show();
    stage2suc.hide();
    stage2cur.show();
    stage3.show();
    stage3cur.hide();
}

//Next - SecurityDetails
function validateSecurityDetails() {

    if ($('#Project').val() == "" || $('#Project').val() == null) {
        alert("Please select a Project")
        return false;
    }
    if ($('#Package').val() == "" || $('#Package').val() == null) {
        alert("Please select a Package")
        return false;
    }

    var ProID = {
        ProjectID : $('#Project').val()
    }

    $.ajax({
        url: '../PublicRequest/GetProjectConfig/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ProID),
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data.status == "OK") {
                if (data.DocsRequired == "Y") {
                    DocsRequired = data.DocsRequired;
                    $('#DocumentTbl').show();

                    if (data.DocsICExist == "Y") {
                        DocsICExist = data.DocsICExist;
                        $('#ICTbl').show();
                    }
                    if (data.DocsALExist == "Y") {
                        DocsALExist = data.DocsALExist;
                        $('#ALTbl').show();
                    }
                    if (data.DocsSSMExist == "Y") {
                        DocsSSMExist = data.DocsSSMExist;
                        $('#SSMTbl').show();
                    }
                }
                else {
                    $('#DocumentTbl').hide();
                    $('#ICTbl').show();
                    $('#ALTbl').show();
                    $('#SSMTbl').show();
                }
            }
            else {
            }
        },
        error: function (errorThrown) {
        }
    });

    accountDetailsPnl.hide();
    securityDetailsPnl.hide();
    confirmationPnl.show();
    stage3suc.show();
    stage3cur.hide();
    stage4.hide();
    stage4cur.show();
}

//Prev - Confirmation
function showSecurityDetailsPnl() {

    accountDetailsPnl.hide();
    confirmationPnl.hide();
    securityDetailsPnl.show();
    stage4cur.show();
    stage4.hide();
    stage3suc.hide();
    stage3cur.show();
    stage4.show();
    stage4cur.hide();
}

$("#Country").change(function () {
    // this will call when Country Dropdown select change
    var CountryID = parseInt($("#Country").val());
    if (!isNaN(CountryID)) {
        var ddState = $("#State");
        ddState.empty(); // this line is for clear all items from State dropdown
        ddState.append($("<option></option").val("").html("Select State"));

        // Here call Controller Action via Jquery to load State for selected Country
        $.ajax({
            url: '../Register/GetStates/',
            type: "GET",
            data: { CountryID: CountryID },
            dataType: "json",
            success: function (data) {
                $.each(data, function (i, val) {
                    ddState.append(
                        $("<option></option>").val(val.StateID).html(val.StateName)
                    );
                });
            },
            error: function () {
                alert("Error!");
            }
        });
    }
});

$("#Project").change(function () {
    // this will call when Country Dropdown select change
    var ProjectID = parseInt($("#Project").val());
    if (!isNaN(ProjectID)) {
        var ddsPackage = $("#Package");
        ddsPackage.empty(); // this line is for clear all items from State dropdown
        ddsPackage.append($("<option></option").val("").html("Select Package"));

        var ProjectIDs = {
            ProjectID: ProjectID
        }

        // Here call Controller Action via Jquery to load State for selected Country
        $.ajax({
            url: '../PublicRequest/GetPackage/',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ProjectIDs),
            dataType: 'json',
            cache: false,
            success: function (data) {
                $.each(data, function (i, val) {
                    ddsPackage.append(
                        $("<option></option>").val(val.PackageId).html(val.PackageName)
                    );
                });
            },
            error: function () {
                //alert("Error!");
            }
        });
    }
});

$("#Package").change(function () {
    // this will call when Country Dropdown select change
    var PackageID = parseInt($("#Package").val());

    var PackageIDs = {
        PackageID: PackageID
    }

    // Here call Controller Action via Jquery to load State for selected Country
    $.ajax({
        url: '../PublicRequest/GetCertInfo/',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(PackageIDs),
        dataType: 'json',
        cache: false,
        success: function (data) {
            $("#hidepackage").show();
            $("#hideuploadtbl").show();
            $("#validity").html(data.No_Year);
            $("#media").html(data.MediaName);
            $("#packagename").html(data.PackageName);
            //$("#description").html(data.CertificateTypeDesc);
            $("#price").html(data.Price);

            //Total Amount
            $("#TotalAmount").html(data.Price);
        },
        error: function () {
            //alert("Error!");
        }
    });
});

$('#btnSubmit').click(function () {
    if (DocsICExist == "Y") {
        if ($('#nricUploadFile').val() == "") {
            toastr["error"]("Please upload IC Document");
            return false;
        }
    }
    if (DocsALExist == "Y") {
        if ($('#authUploadFile').val() == "") {
            toastr["error"]("Please upload Authorization Letter");
            return false;
        }
    }
    if (DocsSSMExist == "Y") {
        if ($('#SSMUploadFile').val() == "") {
            toastr["error"]("Please upload SSM Document");
            return false;
        }
    }
    var r = confirm("Are you CONFIRM to submit the application");
    if (r == true) {
        $.LoadingOverlay("show");

        var selectedVal = "";
        var selected = $("input[type='radio'][name='SecurityImg']:checked");
        if (selected.length > 0) {
            selectedVal = selected.val();
        }

        var selectedGender = "";
        var selectedSex = $("input[type='radio'][name='Sex']:checked");
        if (selectedSex.length > 0) {
            selectedGender = selectedSex.val();
        }

        var certificate = {
            UserName: $('#UserName').val(),
            Password: $('#Password').val(),
            SecurityImg: selectedVal,
            SecurityPhrase: $('#SecurityPhrase').val(),

            Name: $('#Name').val(),
            ICNo: $('#ICNo').val(),
            Gender: selectedGender,
            DOB: $('#DOB').val(),
            Mobile_No: $('#Mobile_No').val(),
            Email: $('#Email').val(),
            Address: $('#Address').val(),
            City: $('#City').val(),
            State: $('#State').val(),
            Postcode: $('#Postcode').val(),
            Country: $('#Country').val(),

            CompanyName: $('#CompanyName').val(),
            CompanyRegistrationNo: $('#C_RegNo').val(),
            CompanyAddress: $('#CompanyAddress').val(),
            CompanyCity: $('#CompanyCity').val(),
            CompanyState: $('#CompanyState').val(),
            CompanyCountry: $('#CompanyCountry').val(),
            CompanyPostcode: $('#CompanyPostcode').val(),
            CompanyFax_No: $('#CompanyFax_No').val(),
            CompanyMobile_No: $('#CompanyMobile_No').val(),

            Project: $('#Project').val(),
            Package: $('#Package').val(),

            IsEditMode: $('#IsEditMode').val(),
        }

        $.ajax({
            url: '../PublicRequest/NewApplicationSave/',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(certificate),
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.status == "success") {
                    accountDetailsPnl.hide();
                    securityDetailsPnl.hide();
                    confirmationPnl.show();
                    stage3suc.show();
                    stage3cur.hide();
                    stage4.hide();
                    stage4cur.show();
                    window.location.href = "../PublicRequest/ReturnSuccess";
                    //$.LoadingOverlay("hide");
                }
                else {
                    $.LoadingOverlay("hide");
                    alert(data.message)
                }
            },
            error: function (errorThrown) {
                $.LoadingOverlay("hide");
            }
        });

    } else {
    }
});