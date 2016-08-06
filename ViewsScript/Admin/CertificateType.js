$(document).ready(function () {
    var cachedDepartmentOptions = null;
    var cachedGroupOptions = null;
    $('#CertificateTypeContainer').jtable({
        title: 'Certificate Type',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'CertificateTypeID ASC',
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/CertificateType/CertificateTypeList?jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
                            type: 'POST',
                            dataType: 'json',
                            data: postData,
                            success: function (data) {
                                $dfd.resolve(data);
                            },
                            error: function () {
                                $dfd.reject();
                            }
                        });
                    });
                },
            createAction:
                 function (postData) {
                     return $.Deferred(function ($dfd) {
                         $.ajax({
                             url: '/CertificateType/CreateCertificateType',
                             type: 'POST',
                             dataType: 'json',
                             data: postData,
                             success: function (data) {
                                 $dfd.resolve(data);
                                 if (data.Result == 'OK') {
                                     alert(data.Message);
                                     return;
                                 }
                             },
                             error: function () {
                                 $dfd.reject();
                             }
                         });
                     });
                 },
            deleteAction:
              function (postData) {
                  return $.Deferred(function ($dfd) {
                      $.ajax({
                          url: '/CertificateType/DeleteCertificateType',
                          type: 'POST',
                          dataType: 'json',
                          data: postData,
                          success: function (data) {
                              $dfd.resolve(data);
                              if (data.Result == 'OK') {
                                  alert(data.Message);
                                  return;
                              }
                          },
                          error: function () {
                              $dfd.reject();
                          }
                      });
                  });
              },
            updateAction:
             function (postData) {
                 return $.Deferred(function ($dfd) {
                     $.ajax({
                         url: '/CertificateType/UpdateCertificateType',
                         type: 'POST',
                         dataType: 'json',
                         data: postData,
                         success: function (data) {
                             $dfd.resolve(data);
                             if (data.Result == 'OK') {
                                 alert(data.Message);
                                 return;
                             }
                             //alert(data.Message);
                         },
                         error: function () {
                             $dfd.reject();
                         }
                     });
                 });
             }

        },
        fields: {
            CertificateTypeID: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            CertificateTypeName: {
                title: 'Certificate Type Name',
                width: '23%',
                visibility: 'fixed',

            },

            CertificateTypeDesc: {
                title: 'Description',
                width: '13%',

            },
            No_Year: {
                title: 'No.Year',
                width: '13%',

            },
            StartDate: {
                title: 'Start Date',
                width: '13%',
                type: 'date',
                displayFormat: 'yy-mm-dd'
            },
            EndDate: {
                title: 'End Date',
                width: '13%',
                type: 'date',
                displayFormat: 'yy-mm-dd'
            },
            Status: {
                title: 'Status',
                type: 'checkbox',
                width: '12%',
                values: { '0': 'Inactive', '1': 'Active' },
                defaultValue: '1'

            },


        }
    });

    //Load list from server
    $('#CertificateTypeContainer').jtable('load');
});

