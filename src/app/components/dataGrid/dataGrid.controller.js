(function() {
  'use strict';

  angular
    .module('p4')
    .controller('dataGridController', dataGridController);

  /** @ngInject */
  function dataGridController($timeout, $scope, $interval, $location, Auth, dataService) {
    var vm = this;

    vm.gridOptions = {};

    vm.gridOptions.enableFiltering = true;
    vm.gridOptions.columnDefs = [
      { name:'id', width:50 },
      { name:'createdOn', width:110, pinnedLeft:true },
      { name:'customerName', width:150, pinnedRight:true  },
      { name:'customerEmail', width:200  },
      { name:'description', width:150 },
      { name:'open', width:80 },
      { name:'closedOn', width:110 },
      { name:'employeeName', width:110 }
    ];

    dataService.getIssues().then(function(resp){
      var csvData = [];
      resp.dimension.top(Infinity).forEach(angular.bind(vm, function (d) {
        csvData.push({
          id:+d.id,
          createdOn:d.createdOn.toString().substring(0,11),
          customerName:d.customerName,
          customerEmail:d.customerEmail,
          description:d.description,
          open:d.open,
          closedOn:d.closedOn.toString().substring(0,11),
          employeeName:d.employeeName
        });

        vm.gridOptions.data = csvData;

      }));
    });

    var updateIssuesDataGrid = $interval(function() {

      dataService.updateIssuesBarChart().then(angular.bind(vm, function(d){
        vm.gridOptions.data = d;
      }));


    }, 1000 * 60);

    var dereg = $scope.$on('$locationChangeSuccess', function() {
      if($location.$$url !== "/data"){
        $interval.cancel(updateIssuesDataGrid);

      }
      dereg();
    });

  }
})();
