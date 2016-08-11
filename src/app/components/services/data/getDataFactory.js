'use strict';

/**
 * @ngdoc service
 * @name publicTransAppApp.idb
 * @description
 * # idb
 * Factory in the publicTransAppApp.
 */
angular.module('p4')
  .service('getDataFactory', function ($http, $q) {

    return {

       data: '',

       get: function(url) {
         var deferred = $q.defer();

         if(!this.data) {

           $http.get(url).then(function(response){
             Papa.parse(response.data, {
              header: true,
             	complete: function(results) {
                deferred.resolve(results);
             	}
             });
          });

           this.data = deferred.promise;
         }
         return this.data;
       },

       clearCache: function() {
        this.data = null;
       }

     };
  });
