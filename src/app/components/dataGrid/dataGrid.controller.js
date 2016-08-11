(function() {
  'use strict';

  angular
    .module('p4')
    .controller('dataGridController', dataGridController);

  /** @ngInject */
  function dataGridController($timeout, Auth, dataService) {
    var vm = this;

    dataService.getIssuesDataforGrid().then(function(resp){

      vm.myData = resp;

    });
    
    setInterval(function() {

      dataService.getIssuesDataforGrid().then(function(resp){

        vm.myData = resp;

      });

    }, 1000 * 60);

  }
})();
