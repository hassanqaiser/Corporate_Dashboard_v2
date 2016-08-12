(function() {
  'use strict';

  angular
    .module('p4')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout, $interval, $location, Auth, dataService) {
    var vm = this;

    Auth.loginAnonymously();

    var map = L.map("mapid", {
       maxZoom: 13
     }).setView([14, 45], 10);

    L.esri.basemapLayer("Topographic").addTo(map);

    var wellsMarkers = new L.FeatureGroup();
    map.addLayer(wellsMarkers);

    var scaleOptions = {
      position: 'bottomleft',
      maxWidth: 200,
      metric: true,
      imperial: false,
      updateWhenIdle: false
    };

    var redIcon = L.icon({
      iconUrl: 'assets/images/company.png',
      iconSize:     [38, 38], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.control.scale(scaleOptions).addTo(map);

    dataService.getCompanies().then(function(resp){
       wellsMarkers.clearLayers();

       resp.dimension.top(Infinity).forEach(function (d) {
         var marker;
         marker = L.marker([d.latitude, d.longitude], {icon: redIcon});
         var popupTemplate = "<h4>" + d.title + "</h4>" + "<table>";
         for(var dataItem in d){
           popupTemplate += "<tr><td>" + dataItem + "</td><td>" + d[dataItem] + "</td></tr>"
         }
         popupTemplate += "</table>";
         var customOptions =
         {
          'maxWidth': '350',
          'className' : 'custom'
         };
         marker.bindPopup(popupTemplate,customOptions);
         wellsMarkers.addLayer(marker);
       });

       map.fitBounds(wellsMarkers.getBounds());

    });
    
    var addNewCompanies = $interval(function() {

      dataService.getCompanies().then(function(resp){
         wellsMarkers.clearLayers();

         resp.dimension.top(Infinity).forEach(function (d) {
           var marker;
           marker = L.marker([d.latitude, d.longitude], {icon: redIcon});
           var popupTemplate = "<h4>" + d.title + "</h4>" + "<table>";
           for(var dataItem in d){
             popupTemplate += "<tr><td>" + dataItem + "</td><td>" + d[dataItem] + "</td></tr>"
           }
           popupTemplate += "</table>";
           var customOptions =
           {
            'maxWidth': '350',
            'className' : 'custom'
           };
           marker.bindPopup(popupTemplate,customOptions);
           wellsMarkers.addLayer(marker);
         });

         map.fitBounds(wellsMarkers.getBounds());

      });

    }, 1000 * 120);

    var dereg = $scope.$on('$locationChangeSuccess', function() {
      if($location.$$url !== "/")
        $interval.cancel(addNewCompanies);

      dereg();
    });



  }
})();
