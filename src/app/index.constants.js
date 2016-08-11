/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('p4')
    .constant('firebaseKeysConstant', {
        'firebaseApiKey': "AIzaSyCZSDL1bMg-VDgWaySx07FMKW3Fo34tJ4s",
        'firebaseAuthDomain': "corporate-dash-ff06c.firebaseapp.com",
        'firebaseDatabaseURL': "https://corporate-dash-ff06c.firebaseio.com",
        'firebaseStorageBucket': "corporate-dash-ff06c.appspot.com"
    })
    .constant('crossfilter', crossfilter)
    .constant('d3', d3)
    .constant('dc', dc);

})();
