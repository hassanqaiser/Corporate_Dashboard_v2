
(function() {
  'use strict';

  angular
    .module('p4')
    .directive('lineChartCustomers', lineChartCustomers);

  /** @ngInject */
  function lineChartCustomers($window, dataService) {
    var directive = {
      restrict: 'E',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el, attr ) {


      dataService.getCustomersCSVData("assets/data/customers.csv").then(function(resp){
        //id;firstName;createdOn
        var chart = dc.lineChart(el[0]);
        var maxDate = resp.dimension.top(1)[0]["createdOn"];
        var minDate = resp.dimension.bottom(1)[0]["createdOn"];
        var monthFormat = d3.time.format("%b");
        var yearFormat = d3.time.format("%y");
        var yearFormat2 = d3.time.format("%Y");


        chart
          .width($window.innerWidth/2.3)
          .height(300)
          .transitionDuration(750)
          .margins({top: 10, right: 50, bottom: 30, left: 50})
          .x(d3.time.scale().domain([minDate, maxDate]))
          .round(d3.time.year.round)
          .xUnits(d3.time.year)
          .dimension(resp.dimension)
          .group(resp.groupBy, "Customers Subscribed")
          .elasticY(true)
          .elasticX(true)
          .yAxisLabel("No. of Customers")
          .elasticY(true)
          .elasticX(true)
          .renderHorizontalGridLines(true)
          .renderVerticalGridLines(true)
          .legend(dc.legend().x(200).y(1).itemHeight(5).gap(3))
          //.renderLabel(true)
          .brushOn(false)
          .title(function (p) {
           return [
                  "Year: " + yearFormat2(p.key),
                  "Customers Subscribed: " + p.value
                  ]
                  .join("\n");
           });

         chart.renderlet(function (chart) {
          // rotate x-axis labels
          chart.selectAll('g.x text')
          .attr('transform', 'translate(-10,10) rotate(315)');
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

          dc.renderAll();
          chart.transitionDuration(750);
        });


    });

  }

}

})();
