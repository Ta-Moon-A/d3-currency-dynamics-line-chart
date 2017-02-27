var parseDate = d3.time.format("%m/%d/%Y").parse;
var parsedData = [];
var groupedData = {};


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
    "2012" : "red",
    "2013" : "green",
    "2014" : "blue",
    "2015" : "black",
    "2016" : "pink",
    "2017" : "grey",
};

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
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
        groupccyData();
     });


function groupccyData(){
    // console.log("parsedData  " );
    // console.log(parsedData);
    
    for(item of parsedData){
       if( groupedData[item.date.getFullYear()] == undefined){
             groupedData[item.date.getFullYear()] = [];
       }
       groupedData[item.date.getFullYear()].push(item);
    }

    AddLines();
    // console.log("groupedData");
    // console.log(groupedData);

 }

function AddLines(){


for(yearData in groupedData){
    
var xScale = d3.time.scale()
                .domain(d3.extent(groupedData[yearData], function(d) { return d.date; }))
                .range([0,width]);

var yScale = d3.scale.linear()
               .domain(d3.extent(groupedData[yearData], function(d) { return d.value; }))
               .range([ height,0]);


var line = d3.svg.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.value); });

g.append("path")
      .datum(groupedData[yearData])
      .attr("fill", "none")
      .attr("stroke", lineColors[yearData])
      .attr("stroke-linejoin", "square")
      .attr("stroke-linecap", "square")
      .attr("stroke-width", 1.5)
      .attr("d", line);

}



    
var globalXScale = d3.time.scale()
                .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
                .range([0,width]);

var globalYScale = d3.scale.linear()
               .domain(d3.extent(parsedData, function(d) { return d.value; }))
               .range([ height,0]);


var xAxis = d3.svg.axis()
              .scale(globalXScale)
              .orient("bottom")
              .ticks(d3.time.months)
              .tickFormat(d3.time.format("%B"));

var yAxis = d3.svg.axis()
              .scale(globalYScale)
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




// var xScale = d3.time.scale()
//                 .range([0,width]);

// var yScale = d3.scale.linear()
//                .range([ height,0]);


// var xAxis = d3.svg.axis()
//               .scale(xScale)
//               .orient("bottom");

// var yAxis = d3.svg.axis()
//               .scale(yScale)
//               .orient("left");


// // var line = d3.svg.line()
// //     .x(function(d) { return xScale(d.date); })
// //     .y(function(d) { return yScale(d.close); });


// var area = d3.svg.area()
//     .x(function(d) { return xScale(d.date); })
//     .y1(function(d) { return yScale(d.close); });


// d3.tsv("data.tsv", function(error,callbackData) {
//   if (error) throw error;

//   var parseDate = d3.time.format("%d-%b-%y").parse;
 
//   callbackData.forEach(function(d) {
//     d.date = parseDate(d.date);
//     d.close = +d.close;
//     });

//    console.log(callbackData);

//    xScale.domain(d3.extent(callbackData, function(d) { return d.date; }));
//    yScale.domain(d3.extent(callbackData, function(d) { return d.close; })); 

//    area.y0(height);

//    g.append("path")
//         .datum(callbackData)
//         .attr("fill", "steelblue")
//         .attr("d", area);


//    g.append("g")
//             .attr("class", "axis")
//             .attr("transform", "translate(0," + height  + ")")
//             .call(xAxis)
//     .append("text")
//             .attr("x", width-config.svgMargin.right)
//             .attr("y", -5)
//             .style("text-anchor", "end")
//             .text("Date");



//     g.append("g")
//             .attr("class", "axis")
//             .call(yAxis)
//      .append("text")
//             .attr("transform", "rotate(-90)")
//             .attr("y", 10)
//             .attr("dy", ".71em")
//             .style("text-anchor", "end")
//             .text("Price ($)");

//     // g.append("path")
//     //   .datum(callbackData)
//     //   .attr("fill", "none")
//     //   .attr("stroke", "teal")
//     //   .attr("stroke-linejoin", "square")
//     //   .attr("stroke-linecap", "square")
//     //   .attr("stroke-width", 1.5)
//     //   .attr("d", line);
// });



 


