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
      totalIssues: 0,

      refreshCrossfilter: function(){

        var tempDimOnId = this.ndxIssues.dimension(function(d) { return d.id;});
        this.totalIssues = 0;

        tempDimOnId.filter(51);
        this.ndxIssues.remove();
        tempDimOnId.filter(null);

      },

      getIssues: function(){
        var deferred = $q.defer();
        var dimension, groupBy;
        var result = {};

        if(!this.ndxIssues){
          firebase.database().ref('issues').once('value', angular.bind(this, function(snapshot) {

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
            groupBy = dimension.group();

            dimension.top(Infinity).forEach(angular.bind(this, function (d) {
              if(d.open === true) this.totalIssues++;
            }));

            result.dimension = dimension;
            result.groupBy = groupBy;

            deferred.resolve(result);
          }));
        } else {

            dimension  = this.ndxIssues.dimension(function(d){
              return d3.time.month(d.createdOn);
            });

            groupBy = dimension.group();

            result.dimension = dimension;
            result.groupBy = groupBy;

            deferred.resolve(result);
        }

        return deferred.promise;

      },

      updateIssuesBarChart: function(){
        var deferred = $q.defer();
        this.totalIssues++;
        firebase.database().ref('issues').once('value', angular.bind(this, function(snapshot) {

          this.ndxIssues.dimension.filterAll;
          this.ndxIssues.remove();

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
          this.ndxIssues.add(dimData);
          deferred.resolve(dimData);
          dc.redrawAll("1");
        }));
        return deferred.promise;
      },

      getCompanies: function(){

        var deferred = $q.defer();
        var dimension, groupBy;
        var result = {};

        if(!this.ndxCompanies){
          firebase.database().ref('locations/').once('value', angular.bind(this, function(snapshot) {

            var dimData = [];

            for (var key in snapshot.val()) {
              if (!snapshot.val().hasOwnProperty(key)) continue;

              var d = snapshot.val()[key];
              dimData.push({
                id:+d.id,
                title: d.title,
                latitude: +d.latitude,
                longitude: +d.longitude,
                employees: +d.employees,
                name: d.name
              });
            }

            this.ndxCompanies = crossfilter(dimData);
            dimension  = this.ndxCompanies.dimension(function(d){
              return d.title;
            });
            groupBy = dimension.group();

            result.dimension = dimension;
            result.groupBy = groupBy;

            deferred.resolve(result);

          }));
        } else {

          dimension  = this.ndxCompanies.dimension(function(d){
            return d.title;
          });
          groupBy = dimension.group();

          result.dimension = dimension;
          result.groupBy = groupBy;

          deferred.resolve(result);
        }

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
        getDataFactory.clearCache();

        getDataFactory.get(url).then(angular.bind(this, function(data) {

          if(this.ndxCustCSVData)
            this.ndxCustCSVData.add(data);

          dc.redrawAll("2");
          deferred.resolve();

        }));
        return deferred.promise;
      }

    };
  });
