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
          right : 20,
      }
};

var lineColors = {
    "0" : "red",
    "1" : "green",
    "2" : "blue",
    "3" : "black",
    "4" : "pink",
    "5" : "grey",
    "6" : "teal",
     "7" : "orange",
};

var monthNames = [
    {n: 1, name :"January"},
    {n: 2, name :"February"},
    {n: 3, name :"March"},
    {n: 4, name :"April"},
    {n: 5, name :"May"},
    {n: 6, name :"June"},
    {n: 7, name :"July"},
    {n: 8, name :"August"}, 
    {n: 9, name :"September"},
    {n: 10, name :"October"},
    {n: 11, name :"November"},
    {n: 12, name :"December"}
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
    for(item of parsedData){
        var fullYear = item.date.getFullYear() + "";
        var year = fullYear.substring(3, 4);
        
        if(yearlyData[year] == undefined) {
           yearlyData[year] = [];
        }
       yearlyData[year].push(item);
   }

    PaintChart();
}

function PaintChart(){


var xScale = d3.time.scale()
                .domain(d3.extent(monthNames, function(d) { return d.n; }))
                .range([0,width]);

var yScale = d3.scale.linear()
               .domain(d3.extent(parsedData, function(d) { return d.value; }))
               .range([ height,0]);


var lines  = g.selectAll("path")
                   .data(yearlyData)
                   .enter()
                   .append("path")
                        .datum(function(d,i) { return d; })
                        .attr("fill", "none")
                        .attr("stroke", function(d,i) { return lineColors[i]; })
                        .attr("stroke-linejoin", "square")
                        .attr("stroke-linecap", "square")
                        .attr("stroke-width", 1.5)
                        .attr("d", d3.svg.line()
                                    .x(function(d) { return xScale(d.date.getMonth()+1); })
                                    .y(function(d) { return yScale(d.value); })
                             );



var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .ticks(d3.time.months)
              .tickFormat(d3.time.format("%B"));

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

              
   g.append("g")
            .attr("class", "axis")
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
            .attr("class", "axis")
            .call(yAxis)
     .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Ccy");



}
