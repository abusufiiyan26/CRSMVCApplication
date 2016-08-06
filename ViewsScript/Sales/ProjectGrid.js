$(document).ready(function () {

    $('#DateFrom').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    $('#DateTo').datepicker(
    {
        changeMonth: true,
        yearRange: "-100:+0",
        changeYear: true,
        autoclose: true
    });

    $('#ProjectGridTbl').jtable({
        title: 'Project List',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'ProjectId ASC',
        actions: {
            listAction: '../Project/ProjectList',
            deleteAction: '@Url.Action("DeletePackage")'
            //createAction: '@Url.Action("CreatePackage")'
        },
        fields: {
            ProjectId: {
                key: true,
                create: false,
                edit: false,
                del: false,
                list: true,
                width: '2%',
            },
            ProOwner: {
                title: 'Customer',
                list: true
            },
            ProjectName: {
                title: 'Project Name',
                width: '16%',
                list: true
            },
            ProjectCode: {
                title: 'Project Code',
                width: '13%',
                list: true
            },
            ProjectPrefix: {
                title: 'Prefix',
                list: true
            },
            ProjectDesc: {
                title: 'Description',
                list: true
            },
            ContactPerson: {
                title: 'Contact Person',
                list: true
            },
            CustomAction: {
                title: '',
                width: '1%',
                sorting: false,
                create: false,
                edit: false,
                list: true,
                display: function (data) {
                    if (data.record) {
                        //return '<button title="Edit Record" class="jtable-command-button jtable-edit-command-button" onclick=\"getUpdate(' + data.record.ProjectId + ')\; return false;"><span>Edit Record</span></button>';
                        return '<img title="Edit Project" style="cursor:pointer;width:25px" onclick=\"getUpdate(' + data.record.ProjectId + ')\" src="../Images/icon/edit.png" />';
                    }
                }
            },
            //CustomAction2: {
            //    title: '',
            //    width: '1%',
            //    sorting: false,
            //    create: false,
            //    edit: false,
            //    list: true,
            //    display: function (data) {
            //        if (data.record) {
            //            return '<img title="Edit Theme" style="cursor:pointer;width:25px" onclick=\"updateTheme(' + data.record.ProjectId + ')\" src="../Images/icon/edit.png" />';
            //        }
            //    }
            //}
        }
    });

    //Load project list from server
    $('#ProjectGridTbl').jtable('load');
});

$("#btnToFind").click(function () {
    $('#ProjectGridTbl').jtable('load', {
        DateFrom: $('#DateFrom').val(),
        DateTo: $('#DateTo').val(),
        ValueSearch: $('#searchID').val(),
        ValueToFind: $('#findID').val()
    });
});

$('#btnCreateNewProject').click(function () {
    //('#formProject')[0].reset();
    window.location.href = "../Project/ProjectSettings";
});

function getUpdate(ProID) {
    window.location.href = "../Project/ProjectUpdate?ID=" + ProID;
}

function updateTheme(vProID) {
    //window.location.href = "../ProjectTheme/NewLayout?VCode=" + vProID;
    window.open("../ProjectTheme/NewLayout?VCode=" + vProID, '_blank');
}