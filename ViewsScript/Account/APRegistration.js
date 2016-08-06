$(function () {
    $('form.idealforms').idealforms({

        silentLoad: false,

        rules: {
            'idtype': 'minoption:1 maxoption:1',
            'idno': 'required',
            'name': 'required',
            'date': 'required date:dd/mm/yy',
            'sex': 'minoption:1 maxoption:1',
            'address': 'required',
            'city': 'required',
            'postcode': 'required zip',
            'options': 'select:default',
            'email': 'required email',
            'telno': 'required',

            'c_orgname': 'required',
            'c_regno': 'required',
            'c_address': 'required',
            'c_city': 'required',
            'c_postcode': 'required',
            'c_faxno': 'required',
            'picture': 'required extension:jpg:png:pdf',

            //'username': 'required username ajax',
            //'password': 'required pass',
            //'confirmpass': 'required equalto:password',
            //'website': 'url',
            //'hobbies[]': 'minoption:2 maxoption:3',
            'zip': 'required zip',
        },
        errors: {
            'username': {
                ajaxError: 'Username not available'
            }
        },
        steps: {
            MY_stepsItems: ['Personal Information', 'Company Information', 'Payment', 'Confirmation'],
            container: '.idealsteps-container',
            nav: '.idealsteps-nav',
            navItems: 'li',
            buildNavItems: function (i) {
                return this.opts.steps.MY_stepsItems[i];
            },
            wrap: '.idealsteps-wrap',
            step: '.idealsteps-step',
            activeClass: 'idealsteps-step-active',
            before: function (i) {
                if (i == 3) {
                    getUserDetails();
                }
            },
            after: function (i) {
            },
            fadeSpeed: 0,

            i18n: {
                step: 'Step'
            }
        },
        onSubmit: function (invalid, e) {
            e.preventDefault();

            if (invalid) {
                alert(invalid + ' fields!');
            } else {
                $('#TermsConditionModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
            }
        }
    });

    $('form.idealforms').find('input, select, textarea').on('change keyup', function () {
        $('#invalid').hide();
    });

    //$('form.idealforms').idealforms('addRules', {
    //    'comments': 'required minmax:50:200'
    //});

    $('.prev').click(function () {
        $('.prev').show();
        $('form.idealforms').idealforms('prevStep');
    });
    $('.next').click(function () {
        $('.next').show();
        $('form.idealforms').idealforms('nextStep');
    });

    $('.datepicker').datepicker('option', 'dateFormat', 'dd/mm/yy');

    //DROPDOWNLIST LOAD
    var Country = $("#country");
    Country.empty();
    Country.append($("<option></option").val("default").html("SELECT COUNTRY"));

    var CompanyCountry = $("#c_country");
    CompanyCountry.empty();
    CompanyCountry.append($("<option></option").val("default").html("SELECT COUNTRY"));

    var State = $("#state");
    State.empty();
    State.append($("<option></option").val("default").html("SELECT STATE"));

    var CompanyState = $("#c_state");
    CompanyState.empty();
    CompanyState.append($("<option></option").val("default").html("SELECT STATE"));

    var Project = $("#project");
    Project.empty();
    Project.append($("<option></option").val("default").html("SELECT PROJECT"));

    var Bank = $("#bank");
    Bank.empty();
    Bank.append($("<option></option").val("default").html("SELECT BANK"));

    $.ajax({
        url: '/RPCertRequest/GetListOfData/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(),
        dataType: "json",
        success: function (data) {
            $.each(data.Country, function (i, val) {
                Country.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
                CompanyCountry.append(
                    $("<option></option>").val(val.CountryID).html(val.CountryName)
                );
            });
            $.each(data.Project, function (i, val) {
                Project.append(
                    $("<option></option>").val(val.ProjectId).html(val.ProjectName)
                );
            });
            $.each(data.Bank, function (i, val) {
                Bank.append(
                    $("<option></option>").val(val.Value).html(val.Value)
                );
            });
        },
        error: function () {
        }
    });
});

$("#country").change(function () {
    var CountryID = parseInt($("#country").val());
    if (!isNaN(CountryID)) {
        var ddState = $("#state");
        ddState.empty();
        ddState.append($("<option></option").val("default").html("SELECT STATE"));

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
                //alert("Error!");
            }
        });
    }
});
$("#c_country").change(function () {
    var CountryID = parseInt($("#c_country").val());
    if (!isNaN(CountryID)) {
        var ddState = $("#c_state");
        ddState.empty();
        ddState.append($("<option></option").val("default").html("SELECT STATE"));

        $.ajax({
            url: '../RequestCert/GetStates/',
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

function getUserDetails() {

    var IDType = "";
    var idno = $('#idno').val();

    var s = $("input[type='radio'][name='idtype']:checked");
    if (s.length > 0) {
        IDType = s.val();
    }

    if (IDType == "PP") {
        $("#ViewIDType").html("PASSPORT");
        $("#ViewICNo").html(idno);
    }
    else {
        $("#ViewIDType").html("IC");
        $("#ViewICNo").html(idno);
    }

    var name = $('#name').val();
    $("#ViewName").html(name);
    var DOB = $('#dob').val();
    $("#ViewDOB").html(DOB);
    
    var SexVal = $("input[type='radio'][name='sex']:checked");
    var GenderSex = "";
    if (SexVal.length > 0) {
        GenderSex = SexVal.val();
    }
    if (GenderSex == "M") {
        $("#ViewGender").html("MALE");
    }
    else if (GenderSex == "F") {
        $("#ViewGender").html("FEMALE");
    } else {
        $("#ViewGender").html("NONE");
    }
    var Address = $('#address').val();
    $("#ViewAddress").html(Address);
    var City = $('#city').val();
    $("#ViewCity").html(City);
    var Postcode = $('#postcode').val();
    $("#ViewPostcode").html(Postcode);

    var Email = $('#email').val();
    $("#ViewEmail").html(Email);
    var Mobile_No = $('#telno').val();
    $("#ViewTelNo").html(Mobile_No);

    var State = $('#state').val();
    var Country = $('#country').val();

    var statecountry = {
        State: State,
        Country: Country
    };

    $.ajax({
        url: '../Register/GetStateName/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(statecountry),
        dataType: "json",
        cache: false,
        success: function (data) {
            $("#ViewState").html(data.StateName);
            $("#ViewCountry").html(data.CountryName);
        },
        error: function () {
        }
    });

    var CName = $('#c_orgname').val();
    $("#ViewC_CompanyName").html(CName);
    var CRegNo = $('#c_regno').val();
    $("#ViewC_RegistrationNo").html(CRegNo);
    var c_telno = $('#c_telno').val();
    $("#ViewC_TelNo").html(c_telno);
    var CFaxNo = $('#c_faxno').val();
    $("#ViewC_FaxNo").html(CFaxNo);
    var CAddress = $('#c_address').val();
    $("#ViewC_Address").html(CAddress);
    var CCity = $('#c_city').val();
    $("#ViewC_City").html(CCity);
    var c_postcode = $('#c_postcode').val();
    $("#ViewC_Postcode").html(c_postcode);

    var c_state = $('#c_state').val();
    var c_country = $('#c_country').val();

    var cSC = {
        State: c_state,
        Country: c_country
    };

    $.ajax({
        url: '../Register/GetStateName/',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(cSC),
        dataType: "json",
        cache: false,
        success: function (data) {
            $("#ViewC_State").html(data.StateName);
            $("#ViewC_Country").html(data.CountryName);
        },
        error: function () {
        }
    });

}

$('#btnSaveSubmit').click(function () {

    if ($('#CheckTerms').is(":checked")) {
    } else {
        toastr["error"]("Please tick agreement before proceed");
        return false;
    }

    $('#TermsConditionModal').modal('hide');
    $.LoadingOverlay("show");

    $.ajax({
        url: '../APRegistration/saveAPRegistration/',
        type: 'POST',
        data: $("form").serialize(),
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data.Result == "OK") {
                window.location.href = "../PublicRequest/ReturnSuccess";
            }
            else {
                $.LoadingOverlay("hide");
                toastr["error"](data.message);
                $('#TermsConditionModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
            }
        },
        error: function (errorThrown) {
            $.LoadingOverlay("hide");
            toastr["error"](errorThrown);
        }
    });
});