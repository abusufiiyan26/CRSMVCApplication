var ICExist = "";

$(document).ready(function () {
    //document.getElementById("PersonalDetailsPnl").style.display = "block";
    //document.getElementById("AccountDetailsPnl").style.display = "none";

    //$("#FormPersonal").validationEngine();

    $("#adminForm").validationEngine();
    $("#HideForm1").show();
    $("#HideButton1").show();
    $("#HideForm2").hide();
    $("#HideButton2").hide();
    $("#HideButton3").hide();

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

    $('#DOB').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    var CountryID = $("#CountryID");
    CountryID.empty();
    CountryID.append($("<option></option").val("").html("Select Country"));

    var StateID = $("#StateID");
    StateID.empty();
    StateID.append($("<option></option").val("").html("Select State"));

    var RoleID = $("#RoleID");
    RoleID.empty();
    RoleID.append($("<option></option").val("").html("Select Role"));

    var DepartmentID = $("#DepartmentID");
    DepartmentID.empty();
    DepartmentID.append($("<option></option").val("").html("Select Department"));

    $.ajax({
        url: '/UserAdmin/GetListData',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: 'json',
        success: function (data) {
            $.each(data.Country, function (i, val) {
                CountryID.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            $.each(data.Department, function (i, val) {
                DepartmentID.append(
                    $("<option></option>").val(val.Department_ID).html(val.DepartName)
                );
            });
        },
        error: function (errorThrown) {
        }
    });
});

$('#icVal').change(function () {
    $("#HideIC").show();
    $("#HidePassport").hide();
    $('#Passport').val('');
});
$('#ppVal').change(function () {
    $("#HideIC").hide();
    $("#HidePassport").show();
    $('#ICNo').val('');
});

$('#ICNo').change(function () {
    var PassIDJSon = {
        ICNo: $('#ICNo').val(),
        RoleID: $('#RoleID').val()
    }
    $.ajax({
        url: '/UserAdmin/CheckICExist',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(PassIDJSon),
        dataType: 'json',
        success: function (data) {
            if (data.Found == "Y") {
                toastr["error"]("IC No already exist");
                ICExist = "Y";
                return false;
            } else {
                ICExist = "N";
            }
        }
    });
})
$('#Passport').change(function () {
    var PassIDJSon = {
        ICNo: $('#ICNo').val(),
        RoleID: $('#RoleID').val()
    }
    $.ajax({
        url: '/UserAdmin/CheckICExist',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(PassIDJSon),
        dataType: 'json',
        success: function (data) {
            if (data.Found == "Y") {
                toastr["error"]("IC No already exist");
                ICExist = "Y";
                return false;
            } else {
                ICExist = "N";
            }
        }
    });
})

$("#CountryID").change(function () {
    // this will call when Country Dropdown select change
    var CountryID = parseInt($("#CountryID").val());
    if (!isNaN(CountryID)) {
        var ddState = $("#StateID");
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
            }
        });
    }
});
$("#DepartmentID").change(function () {
    var DepartmentID = parseInt($("#DepartmentID").val());
    if (!isNaN(DepartmentID)) {
        var RoleID = $("#RoleID");
        RoleID.empty();
        RoleID.append($("<option></option").val("").html("Select Role"));

        $.ajax({
            url: '../UserAdmin/GetRoleID/',
            type: "POST",
            data: { DepartmentID: DepartmentID },
            dataType: "json",
            success: function (data) {
                $.each(data.Role, function (i, val) {
                    RoleID.append(
                        $("<option></option>").val(val.RoleID).html(val.RoleName)
                    );
                });
            },
            error: function () {
            }
        });
    }
});

$('#btnNext').click(function () {

    if (ICExist == "Y") {
        toatr["warning"]("IC/Passport already Exist");
        return false;
    }

    if ($("#adminForm").validationEngine('validate')) {

        var selectedVal = "";
        var selected = $("input[type='radio'][name='IDType']:checked");
        if (selected.length > 0) {
            selectedVal = selected.val();
            if (selectedVal == "IC") {
                if ($('#ICNo').val() == "") {
                    toastr["warning"]("Please fill in IC No");
                    return false;
                }
            }
            if (selectedVal == "PP") {
                if ($('#Passport').val() == "") {
                    toastr["warning"]("Please fill in Passport No");
                    return false;
                }
            }
        }

        $.LoadingOverlay("show");

        $("#vName").html($('#Name').val());
        $("#vDOB").html($('#DOB').val());
        $("#vEmail").html($('#Email').val());
        $("#vMobile_No").html($('#Mobile_No').val());
        $("#vAddress").html($('#Address').val());
        $("#vPostcode").html($('#Postcode').val());
        $("#vCity").html($('#City').val());

        //Display Gender
        var vsex = $("input[type='radio'][name='Sex']:checked");
        var valSex = "";
        if (vsex.length > 0) {
            valSex = vsex.val();
        }
        var Sex = valSex;
        if (Sex == "M") {
            $("#vGender").html("Male");
        }
        if (Sex == "F") {
            $("#vGender").html("Female");
        }

        //Display ID Type
        var IDType = "";
        var IDNo1 = $('#ICNo').val();
        var IDNo2 = $('#Passport').val();

        var s = $("input[type='radio'][name='IDType']:checked");
        if (s.length > 0) {
            IDType = s.val();
        }
        if (IDType == "PP") {
            $("#vIDType").html("Passport");
            $("#vIDNo").html(IDNo2);
        }
        else {
            $("#vIDType").html("IC");
            $("#vIDNo").html(IDNo1);
        }

        //Display country, state, role, department

        var sDataJson = {
            State: $('#StateID').val(),
            Country: $('#CountryID').val(),
            DepartmentID: $('#DepartmentID').val(),
            RoleID: $('#RoleID').val()
        };

        $.ajax({
            url: '../AdminRegistration/GetAdminDisplay/',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(sDataJson),
            dataType: "json",
            cache: false,
            success: function (data) {
                $("#vState").html(data.StateName);
                $("#vCountry").html(data.CountryName);
                $("#vDepartment").html(data.DepartmentName);
                $("#vRole").html(data.RoleName);
            },
            error: function () {
            }
        });

        $("#HideForm1").hide();
        $("#HideButton1").hide();
        $("#HideForm2").show();
        $("#HideButton2").show();
        $("#HideButton3").show();

        $.LoadingOverlay("hide");
    }
});
$('#btnPrev').click(function () {

    $("#HideForm1").show();
    $("#HideButton1").show();
    $("#HideForm2").hide();
    $("#HideButton2").hide();
    $("#HideButton3").hide();
});

$('#btnActived').click(function () {

    bootbox.confirm("Are you sure to APPLY FOR 1CRS ADMIN?", function (result) {
        if (result) {
            $.LoadingOverlay("show");

            var submitIDType = "";
            var IDNo = "";
            var s = $("input[type='radio'][name='IDType']:checked");
            if (s.length > 0) {
                submitIDType = s.val();
            }
            if (submitIDType != "") {
                if (submitIDType == "PP") {
                    IDNo = $('#Passport').val();
                }
                else {
                    IDNo = $('#ICNo').val();
                }
            }

            var vsex = $("input[type='radio'][name='Sex']:checked");
            var valSex = "";
            if (vsex.length > 0) {
                valSex = vsex.val();
            }

            var createuser = {
                Role_ID: $('#RoleID').val(),
                Department_ID: $('#DepartmentID').val(),
                IDType: submitIDType,
                ICNo: IDNo,
                Name: $('#Name').val(),
                Email: $('#Email').val(),
                Mobile_No: $('#Mobile_No').val(),
                Gender: valSex,
                DOB: $('#DOB').val(),
                Address: $('#Address').val(),
                CountryID: $('#CountryID').val(),
                StateID: $('#StateID').val(),
                Postcode: $('#Postcode').val(),
                City: $('#City').val()
            };

            $.ajax({
                url: '/AdminRegistration/CreateUser',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(createuser),
                dataType: 'json',
                success: function (data) {
                    if (data.Result == "OK") {
                        window.location.href = data.URLStatus;
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
        }
    });
});