'use strict';

/**
 * @ngdoc function
 * @name bluedataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bluedataApp
 */
angular.module('bluedataApp')
  .controller('ManageUserCtrl', function ($scope, $location) {

        $scope.reques
        $scope.request = {
            session: {
                external_auth : "undefined"
            }
        };
        $scope.data = [
            {id: 1, description: "user 1", num_tenants: 5, is_external: true},
            {id: 2, description: "user 2", num_tenants: 5, is_external: false}
        ];
        $scope.session_list = [
            {id: 1, user_name: "Abhishek", tenant_name: "default", role_name: "admin", expiry: "none"},
            {id: 1, user_name: "Guna", tenant_name: "default", role_name: "admin", expiry: "none"},
            {id: 1, user_name: "Kumar", tenant_name: "default", role_name: "admin", expiry: "none"}
        ];
        $scope.createUser = function() {
            event.preventDefault();
            console.log("create user is clicked");
            $location.href = 'createuser';
        };

//   var role = '{{request.session.role}}';
//   var user_name = '{{request.session.user}}';
//
//   $('[data-rel=popover]').popover({html:true});
//
//   function deleteUserCallback(name, status, details) {
//       if (status == "success") {
//           bdNotify('User ( ' + name + ' )' + ' successfully deleted', "success");
//       }
//       else {
//           bdNotify('Failed to delete the user ( ' + name + ' )</br>' + details, "failed");
//       }
//   }
//
//   registerDataTable('#users_table',
//                     '#',
//                     '{% url "userextras_view" %}?user_id=',
//                     '#',
//                     deleteUserCallback,
//                     '.table_delete',
//                     {{headers|safe}}, {{headers|length}},
//                     0, 2);
//
//   /* setup row action buttons...*/
//   var url = '{% url "usersettings_view" %}?user_id=';
//   for (var i = 0; i < oTable[0].fnGetData().length; i++) {
//       var rowData = oTable[0].fnGetData(i);
//
//       var button = '<div class="visible-desktop action-buttons row-actions">';
//
//       button += insertExtrasButton();
//       button += insertDeleteButton();
//
//       if (role == 'Site Admin' && user_name != rowData[1] &&
//             rowData[4].indexOf("Internal") == 0) {
//           button += insertPasswordButton(url + rowData[0]);
//       }
//
//       button += '</div>';
//       oTable[0].fnUpdate(button, i, 5, false);
//   }
//
//
//   registerDataTable('#user_sessions',
//                     '#',
//                     '#',
//                     '{% url "manageuser_view" %}',
//                     deleteCallback,
//                     '.table_delete',
//                     {{session_headers|safe}}, {{session_headers|length}},
//                     1, 2);
//
//   function deleteCallback(name, status, details) {
//       if (status == "success") {
//           bdNotify('Session for user ( ' + name + ' )' + ' successfully deleted', "success");
//       }
//       else {
//           bdNotify('Failed to delete the session ( ' + name + ' )</br>' + details, "failed");
//       }
//   }
//
//   /* setup row action buttons...*/
//   for (var i = 0; i < oTable[1].fnGetData().length; i++) {
//       var rowData = oTable[1].fnGetData(i);
//
//       var button = '<div class="visible-desktop action-buttons row-actions">';
//       button += insertDeleteButton();
//       button += '</div>';
//       oTable[1].fnUpdate(button, i, 6, false);
//   }


  });
