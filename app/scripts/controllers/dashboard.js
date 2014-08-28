'use strict';

/**
 * @ngdoc function
 * @name bluedataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bluedataApp
 */
angular.module('bluedataApp')
  .controller('DashboardCtrl', function ($scope) {
    $scope.jobs_data = [{uuid: 2,job_name: 'something',status: "created"},
        {uuid : 3,job_name: 'something',status: "starting"},
        {uuid: 4,job_name: 'something',status: "running"},
        {uuid : 5,job_name: 'something',status: "complete"},
        {uuid : 6,job_name: 'something',status: "delete_in_progress"},
        {uuid : 6,job_name: 'something',status: "error"}];

    $scope.cluster_data = [{uuid: 2,cluster_name: 'something',status: "created"},
        {uuid : 3,cluster_name: 'something',status: "starting"},
        {uuid: 4,cluster_name: 'something',status: "ready"},
        {uuid : 5,cluster_name: 'something',status: "updating"},
        {uuid : 6,cluster_name: 'something',status: "delete_in_progress"},
        {uuid : 6,cluster_name: 'something',status: "error"}];

        $scope.data_connectors = [{name: "DCO 1", description: "Its DCO 1"},{name: "DCO 2", description: "Its DCO 2"},{name: "DCO 3", description: "Its DCO 3"}];


//       var setup_times = {{setup_times|safe}};
//       var run_times = {{run_times|safe}};
//       var map_times = {{map_times|safe}};
//       var reducer_times = {{reducer_times|safe}};
//       var num_map_tasks = {{num_map_tasks|safe}};
//       var num_reducer_tasks = {{num_reducer_tasks|safe}};
//       var show_highlighter = {{show_highlighter|safe}};
//       var job_names = {{job_names|safe}};
//
//       function updateData() {
//           updateDashboardVirtNodeList('{% url "dashboard_view" %}', false);
//       }
//
//       updateData();
//
//       var labels = [["Setup Time", "#1abc9c"], ["Run Time", "#3498db"]];
//       var axisText = ["Jobs", "Time (Seconds)"];
//       var elementId = '#id_jobcharts';
//
//       function hoverCallback(index) {
//           var html = '<p><strong>Job Name&nbsp;&nbsp;</strong><span>' + job_names[index] + '</span></p>';
//           html += '<p><strong>Setup Time&nbsp;&nbsp;</strong><span>' + parseInt(setup_times[index]/1000) + '</span></p>';
//           html += '<p><strong>Run Time&nbsp;&nbsp;</strong><span>' + parseInt(run_times[index]/1000) + '</span></p>';
//           html += '<p><strong>Mapper Time&nbsp;&nbsp;</strong><span>' + map_times[index] + '</span></p>';
//           html += '<p><strong>Reducer Time&nbsp;&nbsp;</strong><span>' + reducer_times[index] + '</span></p>';
//           html += '<p><strong>Num Mapper Tasks&nbsp;&nbsp;</strong><span>' + num_map_tasks[index] + '</span></p>';
//           html += '<p><strong>Num Reducer Tasks&nbsp;&nbsp;</strong><span>' + num_reducer_tasks[index] + '</span></p>';
//           return html;
//       }
//
//       var barData = [setup_times, run_times];
//
//       window.onresize = function(event) {
//           if (job_names.length != 0) {
//               d3.select("svg").remove();
//               d3Graph(elementId, barData, axisText, labels, hoverCallback);
//           }
//       };
//
//       if (barData[0].length != 0) {
//           d3Graph(elementId, barData, axisText, labels, hoverCallback);
//       }
//
//       //sync or updates datatables with backend
//       MANAGE_CLUSTER_URL = '{% url "managecluster_view" %}';
//       MANAGE_JOB_URL = '{% url "managejob_view" %}';
//
//       registerDashboardTable('cluster_table', 3);
//       registerDashboardTable('job_table', 3);
//       registerDashboardTable('dco_table', 2);
//
//       checkAndStartTimerCluster();
//       checkAndStartTimerJob();
//



    });
