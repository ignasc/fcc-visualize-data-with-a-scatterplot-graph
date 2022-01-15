/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json*/

document.addEventListener("DOMContentLoaded", function(){

       const req = new XMLHttpRequest();
       req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
       req.send();
       req.onload = function(){
              const jsonDATA = JSON.parse(req.responseText);
              
              const chartWidth = 800;
              const chartHeight = 500;
              const pageWidth  = document.documentElement.scrollWidth;
              const padding = 60;
              /*Colors for automated styling*/
              const dopingPresentColor = "red";
              const dopingAbsentColor = "blue";
              /*Functions to pickup the right data from array of objects*/
              const rawYearVariable = (element)=>{return element["Year"]};
              const rawTimeVariable = (element)=>{return element["Seconds"]};

              /*FOR DEBUGING DATE OBJECT*
              const dateObject = new Date(jsonDATA[0]["Year"],0,1,23,Math.floor(jsonDATA[0]["Seconds"]/60),jsonDATA[0]["Seconds"]-Math.floor(jsonDATA[0]["Seconds"]/60)*60,0);
              console.log(jsonDATA[0]);
              console.log("Date object: " + dateObject);*/

              /*Add chart title*/
              d3.select("#scaterGraph")
                 .append("h1")
                 .attr("id","title")
                 .text("Scatter Graph Title");


              /*Generate SVG bar chart axis scales*/
              /*note: -1 and +1 are to push data away from the edges (there is no data for min year -1 and max year +1*/
              const xScale = d3.scaleLinear()
                     .domain([d3.min(jsonDATA, (data)=>data["Year"])-1, d3.max(jsonDATA, (data)=>data["Year"])+1])
                     .range([padding, chartWidth - padding]);
              
              const yScale = d3.scaleLinear()
                     .domain([d3.max(jsonDATA, (data)=>data["Seconds"]), d3.min(jsonDATA, (data)=>data["Seconds"])-10])
                     .range([chartHeight - padding, padding]);
    
              /*Create blank SVG element*/
              const svg = d3.select("#scaterGraph")
                     .append("svg")
                     .attr("width", chartWidth)
                     .attr("height", chartHeight)
                     .attr("id", "grafikas");

              /*Tooltips for each scatter plot dot*/
              const toolTip = d3.select("body")
                     .append("div")
                     .attr("id", "tooltip")
                     .style("opacity", 0);

              /*Generate circle points in scatter plot*/
              svg.selectAll("circle")
                     .data(jsonDATA)
                     .enter()
                     .append("circle")
                     .attr("cx", (data)=>xScale(rawYearVariable(data)))
                     .attr("cy", (data)=>yScale(rawTimeVariable(data)))
                     .attr("r", 5)
              /*Set element class*/
                     .attr("class", "dot")
              /*Dot color based on whether there is an entry regarding doping use*/
                     .style("fill", (data)=>{return data["Doping"]==""?dopingAbsentColor:dopingPresentColor})

              /*Append data as properties*/
                     .attr("data-xvalue", (data)=>rawYearVariable(data))
                     /*using Date object for data-yvalues property*/
                     /*Month,day,hour and milisecond are not needed, so hardcoded numbers to keep constant*/
                     .attr("data-yvalue", (data)=>{
                            let dateObject = new Date(data["Year"],0,1,23,Math.floor(data["Seconds"]/60),data["Seconds"]-Math.floor(data["Seconds"]/60)*60,0);
                            return dateObject;
                     })
                     .attr("data-name", (data)=>data["Name"])
                     
              /*Setting up tooltip in a way so it passes the freeCodeCamp tooltip test*/
                     .on("mouseover", (pelesEvent)=>{

                            let dateObject = new Date (pelesEvent.target.attributes.getNamedItem("data-yvalue").nodeValue);
                            let minutes = dateObject.getMinutes();
                            let seconds = dateObject.getSeconds();

                            toolTip
                                   .transition()
                                   .duration(100)
                                   .style("opacity", 0.9);

                            toolTip
                                   .html("Name: " + pelesEvent.target.attributes.getNamedItem("data-name").nodeValue + "\nTime: " + minutes + ":" + (seconds<=9? "0"+seconds:seconds))
                                   /*tooltip positioning by getting data from mouseover event target*/
                                   .style("margin-left", pelesEvent.layerX - 20 + "px")
                                   .style("Top",  Math.round(parseFloat(pelesEvent.target.attributes.getNamedItem("cy").nodeValue) - 50) + "px");

                            toolTip
                                   .attr("data-year", pelesEvent.target.attributes.getNamedItem("data-xvalue").nodeValue);
                     })
                     .on("mouseout", ()=>{
                            toolTip
                                   .transition()
                                   .duration(100)
                                   .style("opacity", 0);
                     });

              
              const xAxis = d3.axisBottom(xScale);
              const yAxis = d3.axisLeft(yScale);
   
              xAxis.ticks(10) /*X axis tick values set to show year*/
              .tickFormat(year => {return year});

              yAxis.ticks(10) /*X axis tick values set to show year*/
              .tickFormat(time => {
                     let minutes;
                     let seconds;
                     minutes = parseInt(time/60);
                     seconds = time - minutes*60;
                     return minutes + ":" + (seconds==0?"00":seconds)});
      
              svg.append("g")
              .attr("transform", "translate(0," + (chartHeight - padding) + ")")
              .attr("id", "x-axis")
              .call(xAxis)
              .selectAll("text")
               .attr("transform", "translate(-20,10) rotate(-45)");
               
              svg.append("g")
              .attr("transform","translate(" + padding + ",0)")
              .attr("id", "y-axis")
              .call(yAxis);

              /*Center the bar chart according to screen size*/
              d3.select("#scaterGraph")
              .style("margin-left", (d)=>{
                    if(pageWidth - chartWidth <=0) {
                           return 0 + "px";
                    };
                    return (pageWidth - chartWidth)/2 + "px";
             })
             .style("max-width", chartWidth + "px")
             .style("margin-top", "20px");

             /*ADD A LEGEND*/

              /*legend size*/
              let dopingPOS = "Doping used";
              let dopingNEG = "Doping was not used";
              /*base X and Y positions for the legend (the offsets for each legend entry are calculated further when appending elements*/
              let legendXPos = chartWidth-padding;
              let legendYPos = chartHeight/2;
              let secondNoteOffset = 20; /*to offset second legend entry below the first one*/
              let circleRadius = 8;

              var legendGroup = d3.select("#grafikas")
              .append("g")
              .attr("id", "legend");

              legendGroup
              .append("circle")
              .attr("r", circleRadius)
              .attr("cx", legendXPos)
              .attr("cy", legendYPos)
              .style("fill", dopingPresentColor);

              legendGroup
              .append("circle")
              .attr("r", circleRadius)
              .attr("cx", legendXPos)
              .attr("cy", legendYPos + secondNoteOffset)
              .style("fill", dopingAbsentColor);

              legendGroup
              .append("text")
              .text(dopingPOS)
              .attr("x", legendXPos - circleRadius*2)
              .attr("y", legendYPos + circleRadius/2)
              .attr("text-anchor", "end");

              legendGroup
              .append("text")
              .text(dopingNEG)
              .attr("x", legendXPos - circleRadius*2)
              .attr("y", legendYPos + secondNoteOffset + circleRadius/2)
              .attr("text-anchor", "end");
       };
});
