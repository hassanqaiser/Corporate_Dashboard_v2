(function() {
  'use strict';

  angular
    .module('p4')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, Auth, dataService) {
    var vm = this;
    vm.newPostKey = [];
    vm.maxIssues = 0;

    console.log('in main controller');
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

    var addNewIssues = setInterval(function() {

      writeData(vm).then(function(){
        dataService.registerListeners();
        vm.maxIssues++;
      });

      if(vm.maxIssues > 10)
        clearInterval(addNewIssues);
    }, 1000 * 30);

    var removeIssueSorted = setInterval(function() {

      vm.newPostKey.forEach(function(key){
        firebase.database().ref().child('issues/'+ key).remove();
      });

      vm.newPostKey = [];
    }, 1000 * 80);

    var refreshCrossfilter = setInterval(function() {

      dataService.refreshCrossfilter();
      if(vm.maxIssues > 10)
        clearInterval(refreshCrossfilter);

    }, 1000 * 40);

    function writeData(vm){
      var dateCreated = randomTime(new Date("10/10/2016"), new Date("12/10/2017"));

      var postData = {
        id:51,
        createdOn:dateCreated,
        customerName:"Kathy Sims",
        customerEmail:"ksims0@yahoo.co.jp",
        description:"Purpura NOS",
        open:true,
        company: "Cool Company 11",
        employeeName:"ksims0"
      };

      var key = firebase.database().ref().child('issues').push().key;
      vm.newPostKey.push(key);
      var updates = {};
      updates['/issues/' + key] = postData;

      return firebase.database().ref().update(updates);
    }

    function randomTime(start, end) {
        var diff =  end.getTime() - start.getTime();
        var new_diff = diff * Math.random();
        var date = new Date(start.getTime() + new_diff);
        var dateFormat = d3.time.format("%m/%d/%Y");
        return dateFormat(date);
    }
  }
})();
