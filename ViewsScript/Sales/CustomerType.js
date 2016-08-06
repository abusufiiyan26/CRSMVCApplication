$(document).ready(function () {
    var cachedDepartmentOptions = null;
    var cachedGroupOptions = null;
    $('#CustomerTypeContainer').jtable({
        title: 'Customer Type',
        paging: true,
        pageSize: 10,
        sorting: true,
        defaultSorting: 'CustomerTypeID ASC',
        actions: {
            listAction:
                function (postData, jtParams) {
                    console.log("Loading from custom function...");
                    return $.Deferred(function ($dfd) {
                        $.ajax({
                            url: '/CustomerType/CustomerTypeList?jtStartIndex=' + jtParams.jtStartIndex + '&jtPageSize=' + jtParams.jtPageSize + '&jtSorting=' + jtParams.jtSorting,
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
                             url: '/CustomerType/CreateCustomerType',
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
                          url: '/CustomerType/DeleteCustomerType',
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
                         url: '/CustomerType/UpdateCustomerType',
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
            CustomerTypeID: {
                key: true,
                create: false,
                edit: false,
                list: true
            },

            CustomerTypeName: {
                title: 'CustomerType Name',
                width: '23%',
                visibility: 'fixed',

            },
            CustomerTypeDesc: {
                title: 'Description',
                width: '23%',
                visibility: 'fixed',

            },
        }
    });

    //Load list from server
    $('#CustomerTypeContainer').jtable('load');
});

