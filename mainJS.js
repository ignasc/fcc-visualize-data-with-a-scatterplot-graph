/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json*/

document.addEventListener("DOMContentLoaded", function(){

       const req = new XMLHttpRequest();
       req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
       req.send();
       req.onload = function(){
              const jsonDATA = JSON.parse(req.responseText);

              console.log(jsonDATA);
              
              const chartWidth = 800;
              const chartHeight = 500;
              const pageWidth  = document.documentElement.scrollWidth;
              const padding = 60;
              /*Functions to pickup the right data from array of objects*/
              const rawYearVariable = (element)=>{return element["Year"]};
              const rawTimeVariable = (element)=>{return element["Seconds"]};

              /*Add chart title*/
              d3.select("#scaterGraph")
                 .append("h1")
                 .attr("id","title")
                 .text("Scatter Graph Title");


              /*Generate SVG bar chart axis scales*/
              const xScale = d3.scaleLinear()
                     .domain([d3.min(jsonDATA, (data)=>data["Year"]), d3.max(jsonDATA, (data)=>data["Year"])])
                     .range([padding, chartWidth - padding]);
              
              const yScale = d3.scaleLinear()
                     .domain([d3.max(jsonDATA, (data)=>data["Seconds"]), d3.min(jsonDATA, (data)=>data["Seconds"])])
                     .range([chartHeight - padding, padding]);
    
              /*Create blank SVG element*/
              const svg = d3.select("#scaterGraph")
                     .append("svg")
                     .attr("width", chartWidth)
                     .attr("height", chartHeight);

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
                     .attr("r", 5);


              /*DEBUG*/
              const testas = d3.min(jsonDATA, (data)=>data["Seconds"]);
              console.log(rawTimeVariable(jsonDATA[6]));


       };
});


/*
document.addEventListener('DOMContentLoaded', function(){

    const req = new XMLHttpRequest();
    req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
    req.send();
    req.onload = function(){
    const jsonGDP = JSON.parse(req.responseText);

    const dataSet = [...jsonGDP.data]/*create separate array for data*
    
    const chartWidth = 800;
    const chartHeight = 500;
    const pageWidth  = document.documentElement.scrollWidth;
    const padding = 60;

    /*Add chart title*
    d3.select("#scaterGraph")
       .append("h1")
       .attr("id","title")
       .text("USA GDP");


    /*Generate SVG bar chart*
    const xScale = d3.scaleLinear()
           .domain([0, dataSet.length])
           .range([padding, chartWidth - padding]);
    
    const yScale = d3.scaleLinear()
           .domain([0, d3.max(dataSet, (d)=>d[1])])
           .range([chartHeight - padding, padding]);
    
    const svg = d3.select("#scaterGraph")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

        /*The title/text method that was shown in lesson does not pass the tooltip test.
        This one is based on
        https://forum.freecodecamp.org/t/issues-with-data-visualization-project-1-bar-chart-tests/222959
        *
    const toolTip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

   svg.selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("x", (d, index) => xScale(index))
      .attr("y",(d) => yScale(d[1]))
      .attr("width", (d)=>{return (chartWidth-padding) / dataSet.length;})/*divide svg width by number of data points and that will be the width of a bar*
      .attr("height", (d)=>chartHeight-yScale(d[1])-padding)/*yScale domain ir range nustatyta taip, kad maziausios vertes bus scale'intos i didziausias vertes, pvz vertes 1-10 scalinamos i 5-1, t.y. verte 1 bus 5, verte 5 bus 2.5, verte 10 bus 1. Todel maziausios vertes bar tures didziausia auksti per visa h-padding, o didziausios vertes tures minimalu auksti = padding. Todel is viso svg aukscio atmetam sita scalinta verte ir dar atmetam padding*
      .attr("class", "bar")
      .attr("data-date",(d)=>{return d[0];})
      .attr("data-gdp",(d)=>{return d[1];})

      /*Setting up tooltip in a way so it passes the freeCodeCamp tooltip test*
      .on("mouseover", (pelesEvent)=>{
             toolTip
              .transition()
              .duration(200)
              .style("opacity", 0.9);

             toolTip
              .html("Date: " + pelesEvent.target.attributes.getNamedItem("data-date").nodeValue + "\nGDP: " + pelesEvent.target.attributes.getNamedItem("data-gdp").nodeValue)
              /*tooltip positioning by getting data from mouseover event target*
              .style("margin-left", pelesEvent.layerX - 20 + "px")
              .style("margin-top", -80 - padding - pelesEvent.target.attributes.getNamedItem("height").nodeValue + "px");

              toolTip.attr("data-date", pelesEvent.target.__data__[0]);

              /*console.log(pelesEvent.target.attributes);*
      })
      .on("mouseout", (pelesEvent)=>{
             toolTip
              .transition()
              .duration(400)
              .style("opacity", 0);
      });

       
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
   
      xAxis.ticks(10) /*X axis tick values set to show date*
      .tickFormat(x => {
         let year = dataSet[x][0].substring(0,4);
         return year});
   
       yAxis.ticks(10)
       .tickFormat(x => {
          let value = x + "$";
          return value});
      
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

      /*Center the bar chart according to screen size*
      d3.select("#scaterGraph")
      .style("margin-left", (d)=>{
            if(pageWidth - chartWidth <=0) {
                   return 0 + "px";
            };
            return (pageWidth - chartWidth)/2 + "px";
     })
     .style("max-width", chartWidth + "px")
     .style("margin-top", "20px");
    
    };
  });*/
