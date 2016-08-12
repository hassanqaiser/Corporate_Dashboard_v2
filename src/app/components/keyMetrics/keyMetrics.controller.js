(function() {
  'use strict';

  angular
    .module('p4')
    .controller('keyMetricsController', keyMetricsController);

  /** @ngInject */
  function keyMetricsController($scope, $rootScope, $timeout, $interval, $location, Auth, dataService) {
    var vm = this;
    vm.newPostKey = [];
    vm.maxIssues = 0;

    $timeout(function() {
      $scope.vm.totalNumOfIssues = dataService.totalIssues;

    }, 1000 * 4);

    var addNewIssues = $interval(function() {

      addNewIssueData(vm).then(function(d){
        vm.newPostKey.push(d.key);
        dataService.updateIssuesBarChart().then(function(d){
          $scope.vm.totalNumOfIssues++;
          $scope.vm.maxIssues++;
        });

      });

      if(vm.maxIssues > 10)
        $interval.cancel(addNewIssues);

    }, 1000 * 10);

    var addNewCustomer = $interval(function() {

      dataService.getUpdatedCustomersCSVData("assets/data/customers.csv").then(function(resp){
        console.log('New Customers Added');
      });


    }, 1000 * 120);

    var dereg = $scope.$on('$locationChangeSuccess', function() {
      if($location.$$url !== "/keyMetrics"){
        $interval.cancel(addNewIssues);
        $interval.cancel(addNewCustomer);
      }
      dereg();
    });

    function addNewIssueData(vm){
      var dateRandomaForIssue = randomDate(new Date("10/10/2016"), new Date("12/10/2017"));

      var issueData = {
        id:51,
        createdOn:dateRandomaForIssue,
        customerName:"Kathy Sims",
        customerEmail:"ksims0@yahoo.co.jp",
        description:"Purpura NOS",
        open:true,
        company: "Cool Company 11",
        employeeName:"ksims0"
      };

      return firebase.database().ref().child('issues').push(issueData);
    }

// Utility Function to get random date between two dates
    function randomDate(start, end) {
        var diff =  end.getTime() - start.getTime();
        var new_diff = diff * Math.random();
        var date = new Date(start.getTime() + new_diff);
        var dateFormat = d3.time.format("%m/%d/%Y");
        return dateFormat(date);
    }
  }
})();
