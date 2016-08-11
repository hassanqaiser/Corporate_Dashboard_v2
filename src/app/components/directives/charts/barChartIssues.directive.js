(function() {
  'use strict';

  angular
    .module('p4')
    .directive('barChartIssues', barChartIssues);

  /** @ngInject */
  function barChartIssues($window, dataService) {
    var directive = {
      restrict: 'E',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el, attr ) {


      dataService.getIssues().then(function(resp){

        var chart = dc.barChart(el[0], "1");
        var maxDate = resp.dimension.top(1)[0]["createdOn"];
        var minDate = resp.dimension.bottom(1)[0]["createdOn"];
        var monthFormat = d3.time.format("%b");
        var yearFormat = d3.time.format("%y");

        chart
          .width($window.innerWidth/2.3)
          .height(300)
          .transitionDuration(750)
          .margins({top: 10, right: 50, bottom: 30, left: 50})
          .x(d3.time.scale().domain([minDate, maxDate]))
          .round(d3.time.year.round)
          .dimension(resp.dimension)
          .centerBar(true)
          .group(resp.groupBy, "Open Issues")
          .yAxisLabel("No. of Issues")
          .elasticY(true)
          .elasticX(true)
          .renderHorizontalGridLines(true)
          .renderVerticalGridLines(true)
          .brushOn(false)
          .gap(15)
          .xUnits(function(){return 15;})
          .legend(dc.legend().x(200).y(0).itemHeight(5).gap(3))
          //.renderLabel(true)
          // .valueAccessor(function (d) {
          //   return d.value.false;
          // })
          // .stack(resp.groupBy, "Closed Issues", function (d) {
          //   return d.value.true;
          // })
          .title(function (p) {
           return [
                  "Month: " + monthFormat(p.key) + "/ " + yearFormat(p.key),
                  "Open Issues: " + p.value
                  ]
                  .join("\n");
           });

        chart.xAxis().tickFormat(function (v) {
          return monthFormat(v) + "\n" + yearFormat(v);
        });
        chart.on("preRedraw", function (chart) {
            chart.rescale();
        });
        chart.on("preRender", function (chart) {
            chart.rescale();
        });

        chart.render();

        angular.element($window).bind('resize', function () {
          if($window.innerWidth > 900){
            chart.width($window.innerWidth/2.3)
                 .transitionDuration(0);
          } else {
            chart.width($window.innerWidth)
                 .transitionDuration(0);
          }

          dc.renderAll("1");
          chart.transitionDuration(750);
        });

    });

  }

}

})();
