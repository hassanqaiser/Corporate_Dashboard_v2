(function() {
  'use strict';

  angular
    .module('p4')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
