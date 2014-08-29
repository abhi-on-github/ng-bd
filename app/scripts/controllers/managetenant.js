'use strict';

/**
 * @ngdoc function
 * @name bluedataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bluedataApp
 */
angular.module('bluedataApp')
  .controller('ManageTenantCtrl', function ($scope, $location) {

        $scope.data = [
            {in_use: "Yes", id: 2, name: "Default", description: "Default Tenant for BlueData Clusters", network: "", vlanid: "vlanid", network_id: "network_id"},
            {in_use: "Yes", id: 3, name: "Staff", description: "Staff Tenant", network: "", vlanid: "vlanid", network_id: "network_id"},
            {in_use: "Yes", id: 3, name: "Test", description: "Test Tenant", network: "", vlanid: "vlanid", network_id: "network_id"},
            {in_use: "Yes", id: 3, name: "Guest Tenant", description: "Guest Tenant", network: "", vlanid: "vlanid", network_id: "network_id"}
        ];

        $scope.gotoCreateTenant = function(){
            $location.href = 'createtenant';
        }
        function deleteCallback(name, status, details) {
            if (status == "success") {
                bdNotify('Tenant ( ' + name + ' )' + ' successfully deleted', "success");
            }
            else {
                bdNotify('Failed to delete the tenant ( ' + name + ' )</br>' + details, "failed");
            }
        }

//       registerDataTable('#tenants_table',
//                         '{% url "edittenant_view" %}?tenant_id=',
//                         '{% url "tenantextras_view" %}?tenant_id=',
//                         '{% url "managetenant_view" %}',
//                         deleteCallback,
//                         '.table_delete',
//                         {{headers|safe}}, {{headers|length}},
//                         1, 2);
//
//       /* setup row action buttons...*/
//       for (var i = 0; i < oTable[0].fnGetData().length; i++) {
//           var rowData = oTable[0].fnGetData(i);
//
//           var button = '<div class="visible-desktop action-buttons row-actions">';
//
//           if (rowData[2] != 'Site Admin') {
//               button += insertEditButton();
//               // If tenant is in use, then don't delete it
//               if (rowData[9] == "No") {
//                   button += insertDeleteButton();
//               }
//               button += insertLogButton('keypair', '{% url "tenantkeypair_view" %}?tenant_id=' + rowData[1]);
//           }
//
//           button += insertExtrasButton();
//
//           button += '</div>';
//           oTable[0].fnUpdate(button, i, 8, false);
//       }



  });
