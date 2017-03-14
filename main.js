var parseDate = d3.time.format("%m/%d/%Y").parse;
var parsedData = [];

var yearlyData = [];

var config  = {
      svgWidth : 800,
      svgHeight : 500,
      svgMargin : {
          top : 20,
          bottom : 70,
          left : 30,
          right : 60,
      }
};

var lineColors = {
    "0" : "lightgrey",
    "1" : "grey",
    "2" : "red"
};

var legendTitles = [
   2014,2015,2016
];

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

 g = svg.append("g").attr("transform", "translate(" + 2*config.svgMargin.left + "," + config.svgMargin.top + ")");



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
            .call(yAxis)
     .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Ccy");

    var legend  = svg.append("g");
   
   legend.selectAll("g")
         .data(yearlyData)
         .enter()
       .append("line")     
        .style("stroke", function(d,i) { console.log(i); return lineColors[i]; }) 
        .style("stroke-width", 3) 
        .attr("x1", function(d,i) { return 400 + (100 * i); })  
        .attr("y1", 20) 
        .attr("x2", function(d,i) {  return 400 + (100 * i) + 40; }) 
        .attr("y2", 20);

 legend.selectAll("g")
         .data(yearlyData)
         .enter()
       .append("text")
        .text(function(d,i){
                return legendTitles[i];
         })
        .attr("x", function(d,i) { return 400 + (100 * i) + 45; })  
        .attr("y", 23) ;


}
