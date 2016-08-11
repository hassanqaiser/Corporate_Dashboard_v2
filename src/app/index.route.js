(function() {
  'use strict';

  angular
    .module('p4')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('data', {
        url: '/data',
        templateUrl:'app/components/dataGrid/dataGrid.html',
        controller: 'dataGridController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
