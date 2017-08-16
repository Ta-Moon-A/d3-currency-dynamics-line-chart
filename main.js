var parseDate = d3.time.format("%m/%d/%Y").parse;
var parsedData = [];

var yearlyData = [];

var config  = {
      svgWidth : 800,
      svgHeight : 500,
      svgMargin : {
          top : 40,
          bottom : 70,
          left : 30,
          right : 60,
      }
};

var lineColors = {
    "0" : "#f37736",
    "1" : "#7bc043",
    "2" : "#0392cf"
};

var legendTitles = [
   2014,2015,2016
];
var dashed = [2,2.5];
var monthNames = [
    {n: 1, name :"Jan"},
    {n: 2, name :"Feb"},
    {n: 3, name :"Mar"},
    {n: 4, name :"Apr"},
    {n: 5, name :"May"},
    {n: 6, name :"Jun"},
    {n: 7, name :"Jul"},
    {n: 8, name :"Aug"}, 
    {n: 9, name :"Sep"},
    {n: 10, name :"Oct"},
    {n: 11, name :"Nov"},
    {n: 12, name :"Dec"}
];

var width = config.svgWidth - config.svgMargin.left - config.svgMargin.right;
var height = config.svgHeight - config.svgMargin.top - config.svgMargin.bottom;


var svg = d3.select("body")
            .append("svg")
            .attr("width", config.svgWidth)
            .attr("height", config.svgHeight);

svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('fill' , '#fdf498');

 g = svg.append("g")
        .attr("transform", "translate(" + 2*config.svgMargin.left + "," + config.svgMargin.top + ")");
       



d3.csv("currency_data.csv")
    .row(function(d,i) { 
         return {
             date: parseDate(d.date), 
             value: + d.value
            }; 
          })
    .get(function(error, callBackData) { 
        if(error) throw error;
        parsedData = callBackData;
        ProcessData();
     });


function ProcessData(){

    var nest = d3.nest()
                 .key(function(d) { return d.date.getFullYear(); })
                 .key(function(d) { return d.date.getMonth() +1; })
                 .rollup(function(month) { 
                     return {
                               "value": d3.sum(month, function(d) {return parseFloat(d.value)})/month.length,
                            } 
                    })
                 .entries(parsedData);


    yearlyData = nest.map(function(yearData) { 
        return yearData.values.map(function(monthData){
            return {
                "month" : parseInt(monthData.key),
                "value" : monthData.values.value
            };
        });
    });

    PaintChart();
}

function PaintChart(){


var xScale = d3.scale.linear() //time.scale()
                .domain(d3.extent(monthNames, function(d) { return d.n; }))
                .range([0,width]);

var yScale = d3.scale.linear()
               .domain(d3.extent(parsedData, function(d) { return d.value; }))
               .range([ height,0]);


var lines  = g.selectAll("path")
                   .data(yearlyData)
                   .enter()
                   .append("path")
                        .attr("stroke", function(d,i) { return lineColors[i]; })
                        .attr("class", "line")
                        .attr("d", d3.svg.line()
                                    .x(function(d) { return xScale(d.month); })
                                    .y(function(d) { return yScale(d.value); })
                             );

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

var xAxis = d3.svg.axis()
              .scale(xScale)
              .tickFormat(function(d) {  return monthNames[d-1].name; })
              .orient("bottom")
              ;

 g.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + height  + ")")
            .call(xAxis)
             .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) { return "rotate(-65)" })
            .append("text")
            .attr("x", width - config.svgMargin.right)
            .attr("y", -25)
            .style("text-anchor", "end")
            .text("Month");



    g.append("g")
            .attr("class", "yaxis")
            .call(yAxis);

    var legend  = svg.append("g");
   
   legend.selectAll("g")
         .data(yearlyData)
         .enter()
       .append("line")     
        .style("stroke", function(d,i) { return lineColors[i]; }) 
        .style("stroke-width", 4) 
        .attr("x1", function(d,i) { return 500 + (100 * i); })  
        .attr("y1",config.svgMargin.top/2) 
        .attr("x2", function(d,i) {  return 500 + (100 * i) + 30; }) 
        .attr("y2", config.svgMargin.top/2);

 legend.selectAll("g")
         .data(yearlyData)
         .enter()
       .append("text")
        .text(function(d,i){
                return legendTitles[i];
         })
        .attr("x", function(d,i) { return 500 + (100 * i) + 35; })  
        .attr("y", config.svgMargin.top/2 + 5) 
        .attr("class","legendText");

    
    svg.append("text")
        .text("Monthly Avg Ccy")
        .attr("class","title")
        .attr("x", config.svgMargin.left)  
        .attr("y", config.svgMargin.top/2 + 5);

    
    //  .selectAll("line")
    //  .data(dashed)
    //  .enter()
     g.append("line")
     .attr("x1", 0)
     .attr("x2", width)
     .attr("y1", yScale(2))
     .attr("y2", yScale(2))
     .attr("class", "dashed");

     
     g.append("line")
     .attr("x1", 0)
     .attr("x2", width)
     .attr("y1", yScale(2.5))
     .attr("y2", yScale(2.5))
     .attr("class", "dashed")

}
