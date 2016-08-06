$(document).ready(function () {
    var cachedDepartmentOptions = null;
    var cachedGroupOptions = null;
    $('#CertificateClassContainer').jtable({
        title: 'Certificate Class',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'ClassID ASC',
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/CertificateClass/CertificateClassList?jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
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
                             url: '/CertificateClass/CreateCertificateClass',
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
                          url: '/CertificateClass/DeleteCertificateClass',
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
                         url: '/CertificateClass/UpdateCertificateClass',
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
            ClassID: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            ClassName: {
                title: 'Class Name',
                width: '23%',
                visibility: 'fixed',

            },

            ClassDesc: {
                title: 'Description',
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
    $('#CertificateClassContainer').jtable('load');
});

