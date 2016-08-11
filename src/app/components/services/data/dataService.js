'use strict';

/**
 * @ngdoc service
 * @name publicTransAppApp.idb
 * @description
 * # idb
 * Factory in the publicTransAppApp.
 */
angular.module('p4')
  .service('dataService', function (getDataFactory, $q) {

    return {
      ndxIssues: '',
      ndxCompanies: '',
      ndxCustCSVData: '',

      refreshCrossfilter: function(){

        var tempDimOnId = this.ndxIssues.dimension(function(d) { return d.id;});
        tempDimOnId.filter(51);
        this.ndxIssues.remove();
        tempDimOnId.filter(null);
        
      },

      registerListeners: function(){

        firebase.database().ref('issues').on('child_added', angular.bind(this, function(data) {
          var issueData = {};
          var objArray = [];
          issueData.id = +data.val().id;
          issueData.createdOn = new Date(data.val().createdOn);
          issueData.customerName = data.val().customerName;
          issueData.customerEmail = data.val().customerEmail;
          issueData.description = data.val().description;
          issueData.open = data.val().open;
          issueData.closedOn = new Date(data.val().closedOn);
          issueData.employeeName = data.val().employeeName;

          objArray.push(issueData);
          this.ndxIssues.add(objArray);

          dc.redrawAll("1");
        }));

      },

      getIssues: function(){
        var deferred = $q.defer();
        var dimension, groupBy;

        firebase.database().ref('issues').once('value', angular.bind(this, function(snapshot) {
          var result = {};
          var dimData = [];

          for (var key in snapshot.val()) {
            if (!snapshot.val().hasOwnProperty(key)) continue;

            var d = snapshot.val()[key];
            dimData.push({
              id:+d.id,
              createdOn:new Date(d.createdOn),
              customerName:d.customerName,
              customerEmail:d.customerEmail,
              description:d.description,
              open:d.open,
              closedOn:new Date(d.closedOn),
              employeeName:d.employeeName
            });
          }

          this.ndxIssues = crossfilter(dimData);
          dimension  = this.ndxIssues.dimension(function(d){
            return d3.time.month(d.createdOn);
          });

          // groupBy = dimension.group().reduce(function(p, v) {
          //   p[v.open] = (p[v.open] || 0) + 1;
          //   return p;
          // }, function(p, v) {
          //   p[v.open] = (p[v.open] || 0) - 1;
          //   return p;
          // }, function() {
          //   return {};
          // });

          groupBy = dimension.group();

          result.dimension = dimension;
          result.groupBy = groupBy;

          deferred.resolve(result);
        }));

        return deferred.promise;

      },

      getIssuesDataforGrid: function(){
        var deferred = $q.defer();

        firebase.database().ref('issues/').once('value', function(snapshot) {
          var csvData = [];

          for (var key in snapshot.val()) {
            if (!snapshot.val().hasOwnProperty(key)) continue;

            var d = snapshot.val()[key];
            csvData.push({
              id:+d.id,
              createdOn:new Date(d.createdOn),
              customerName:d.customerName,
              customerEmail:d.customerEmail,
              description:d.description,
              open:d.open,
              closedOn:new Date(d.closedOn),
              employeeName:d.employeeName
            });
          }

          deferred.resolve(csvData);
        });

        return deferred.promise;

      },

      getCompanies: function(){
        var deferred = $q.defer();
        var dimension, groupBy;

        firebase.database().ref('locations/').once('value', angular.bind(this, function(snapshot) {
          var result = {};
          var dimData = [];

          snapshot.val().forEach(function(d) {
            dimData.push({
              id:+d.id,
              title: d.title,
              latitude: +d.latitude,
              longitude: +d.longitude,
              employees: +d.employees,
              name: d.name
            });
          });
          this.ndxCompanies = crossfilter(dimData);
          dimension  = this.ndxCompanies.dimension(function(d){
            return d.title;
          });
          groupBy = dimension.group();

          result.dimension = dimension;
          result.groupBy = groupBy;

          // firebase.database().ref('locations/').on('child_added', angular.bind(this, function(data) {
          //   var locationData = {};
          //   locationData.id = +data.val().id;
          //   locationData.title = data.val().title;
          //   locationData.latitude = +data.val().latitude;
          //   locationData.longitude = +data.val().longitude;
          //   locationData.employees = +data.val().employees;
          //   locationData.name = data.val().name
          //
          //   this.ndxCompanies.add(locationData);
          //
          //   dc.redrawAll();
          // }));

          deferred.resolve(result);
        }));



        return deferred.promise;

      },

      getCustomersCSVData: function (url){
        var result = {};
        var dimension, groupBy;
        var deferred = $q.defer();
        getDataFactory.get(url).then(angular.bind(this, function(resp) {
          var dimData = [];
          //id;firstName;createdOn
          resp.data.forEach(function(d) {
            dimData.push({
              id:+d.id,
              createdOn:new Date(d.createdOn),
              firstName:d.firstName
            });
          });

          if(!this.ndxCustCSVData)
            this.ndxCustCSVData = crossfilter(dimData);

          dimension  = this.ndxCustCSVData.dimension(function(d){
            return d3.time.month(d.createdOn);
          });

          groupBy = dimension.group();


          result.dimension = dimension;
          result.groupBy = groupBy;
          deferred.resolve(result);
        }));

        return deferred.promise;
      },

      getUpdatedCustomersCSVData : function(url){
        var deferred = $q.defer();
        getDataFactory.get(url).then(angular.bind(this, function(data) {

          if(this.ndxCustCSVData)
            this.ndxCustCSVData.add(data);

          deferred.resolve();

        }));
        return deferred.promise;
      }

    };
  });
