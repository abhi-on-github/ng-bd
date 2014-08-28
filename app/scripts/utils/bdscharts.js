function createMultiDonut(id, data, size, width, label, acc_cores)
{
    var height = size;
    var radius = size * 0.97 / 2;
    var cx = size/2;
    var cy = size/2 - 10;

    var svg = d3.select(id)
              .append("svg");

    var vis = svg.data([data])
              .attr("width", width)
              .attr("height", height)
              .append("svg:g")
              .attr("transform", "translate(" + cx + "," + cy + ")");

    var arc = d3.svg.arc()
              .innerRadius(radius - 42)
              .outerRadius(radius - 15);
    var pie = d3.layout.pie()
              .sort(null)
              .value(function(d) { return d.value; });

    var arcs = vis.selectAll("g.arc")
               .data(pie)
               .enter()
               .append("g")
               .attr("class", "arc");

    if (acc_cores != 0) {
        arcs.append("svg:path")
                .attr("fill", function(d, i) { return data[i].color; } )
                .attr("d", arc)
                .transition()
                .ease("exp")
                .duration(500)
                .attrTween("d", tweenPie);

        function tweenPie(b) {
            var i = d3.interpolate({startAngle: 1.1*Math.PI, endAngle: 1.1*Math.PI}, b);
            return function(t) { return arc(i(t)); };
        }
    }

    var drawTitle = function(name) {
        var fontSize = 14;
        d3.select(id).select("svg").append("text")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", size - 8)
                .style("font-size", fontSize + "px")
                .style("fill", "#666")
                .text(name);
    }

    drawTitle(label);

    if (acc_cores == 0) {
        // Draw a text in the middle for placeholder
        var fontSize = 11;
        d3.select(id).select("svg").append("text")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", size/2)
                .style("font-size", fontSize + "px")
                .style("fill", "#666")
                .text("Pie chart will be available after use");
    }
    else {
        var legend = svg.selectAll(".legend")
                     .data(data, function(d) {return d.name;})
                     .enter().append("g")
                     .attr("class","legend")
                     .style("font-size","12px")
                     .attr("transform", function(d ,i) {
            return "translate("+ 160 + "," + i * 20  +")";
        });

        legend.append("rect")
                .attr("y", 10)
                .attr("width",10)
                .attr("height",10)
                .style("fill", function(d, i) {
            return data[i].color;
        });

        legend.append("text")
                .attr("x", 20)
                .attr("y", 20)
                .attr("width",80)
                .attr("height",10)
                .style("fill", "#666")
                .text(function(d) { return d.name});
    }
}


function createPie(id, data, size, label)
{
    var width = size;
    var height = size;
    var radius = size * 0.75 / 2;
    var factor = 0.75;
    var cx = size/2;
    var cy = size/2 - 10;

    var vis = d3.select(id)
              .append("svg")
              .data([data])
              .attr("width", width)
              .attr("height", height)
              .append("svg:g")
              .attr("transform", "translate(" + cx + "," + cy + ")");

    var arc = d3.svg.arc()
              .outerRadius(radius);
    var pie = d3.layout.pie()
              .sort(null)
              .value(function(d) { return d.value; });

    var arcOver = d3.svg.arc()
                  .outerRadius(radius + 10); 


    var arcs = vis.selectAll("g.arc")
               .data(pie)
               .enter()
               .append("g")
               .attr("class", "arc")
               .on("mouseover", function (d) {
                   vis.selectAll("text").remove();
                   d3.select(this).select("path")
                           .transition()
                           .duration(500)
                           .attr("d", arcOver)
                           .attr("fill", "orange");
                   drawTitle(d["data"].name);

                   /** For showing tooltip.KEEPING this for now
                   var xPosition = size/2;
                   var yPosition = size/2;
                   d3.select(id + '-tooltip')
                           .style("left", xPosition + "px")
                           .style("top", yPosition + "px")
                           .html(hoverCallback(d["data"]));

                   d3.select(id + '-tooltip').classed("hidden", false);
                   ***/
                   
               })
               .on("mouseout", function (d) {
                   // Restore the original arc with original color
                   vis.selectAll("text").remove();
                   d3.select(this).select("path").transition()
                           .duration(500)
                           .attr("d", arc)
                           .attr("fill", function(d) { return d["data"].color; } );
                   drawTitle(label);
//                   d3.select(id + '-tooltip').classed("hidden", true);
               });

    arcs.append("svg:path")
            .attr("fill", function(d, i) { return data[i].color; } )
            .attr("d", arc);


    var drawTitle = function(name) {
        var fontSize = 16;
        vis.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 0)
                .attr("y", (size/2)+4)
                .style("font-size", fontSize + "px")
                .style("fill", "#666")
                .text(name);
    }
    drawTitle(label);
}


function createDonut(element, data, percent, size, label, title) {
    var width = size;
    var height = size;
    var factor = 0.70;
    var radius = size * 0.75 / 2;
    var duration  = 500, transition = 200;

    function calcPercent(percent) {
        return [percent, 100-percent];
    };

    var dataset = {
        lower: calcPercent(0),
        upper: calcPercent(percent)
    };
    var pie = d3.layout.pie().sort(null);
    var format = d3.format(".0%");

    var arc = d3.svg.arc()
              .innerRadius(radius)
              .outerRadius(radius*factor);

    var cx = size/2;
    var cy = size/2 - 10;
    var svg = d3.select(element).append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + cx + "," + cy + ")");

    var path = svg.selectAll("path")
               .data(pie(dataset.lower))
               .enter().append("path")
               .attr("fill", function(d, i) { return data[i].color; } )
               .attr("d", arc)
               .each(function(d) { this._current = d; });

    // Draw the title here.
    var fontSize = 14;
    svg.append("svg:text")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", (size/2))
            .style("font-size", fontSize + "px")
            .style("fill", "#666")
            .text(title);


    var fontSize = 24;
    var text = svg.append("svg:text")
               .attr("dy", fontSize / 2)
               .attr("text-anchor", "middle")
               .style("fill", "#888")
               .style("font-style", "bold")
               .style("font-size", fontSize + "px");

    var progress = 0;
    var timeout = setTimeout(function () {
        clearTimeout(timeout);
        path = path.data(pie(dataset.upper));
        path.transition().duration(duration).attrTween("d", function (a) {
            // Store the displayed angles in _current.
            // Then, interpolate from _current to the new angles.
            // During the transition, _current is updated in-place by d3.interpolate.
            var i  = d3.interpolate(this._current, a);
            var i2 = d3.interpolate(progress, percent)
                     this._current = i(0);
            return function(t) {
                text.text( format(i2(t) / 100) );
                return arc(i(t));
            };
        }); // redraw the arcs
    }, 200);
};


var gauges = [];


function fillDatapoints(datum, datapoints, factor, curr_period) {
    var average = 0;

    datum.length = 0;
    for (var j = 0; j < datapoints.length; j++) {
        if (isNaN(datapoints[j][1])) {
            continue;
        }
        if (isNaN(datapoints[j][0])) {
            datum[j] = {x: datapoints[j][1], y: 0};
        }
        else {
            datum[j] = {x: datapoints[j][1], y: datapoints[j][0]/factor};
            average += datapoints[j][0];
        }
    }

    return (average/datapoints.length/factor);
}



function updateLoadChart(curr_period, d, datum) {
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            if (d[i].metric_name == '1-min' && d[i].datapoints) {
                average = fillDatapoints(datum, d[i].datapoints, 1, curr_period);
                gauges['load'].redraw(average);
                break;
            }
        }
    }
}

function updateCPUChart(curr_period, d, datum) {
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            if (d[i].metric_name == 'User\\g' && d[i].datapoints) {
                average = fillDatapoints(datum, d[i].datapoints, 1, curr_period);
                gauges['cpu'].redraw(average);
                break;
            }
        }
    }
}

function updateMemChart(curr_period, d, datum) {
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            if (d[i].metric_name == 'Use\\g' && d[i].datapoints) {
                average = fillDatapoints(datum, d[i].datapoints, 1000*1000*1000, curr_period);

                gauges['mem'].redraw(average);
                break;
            }
        }
    }
}

function updateNetChart(curr_period, d, datum) {
    var average = 0;

    if (d.length > 0) {
//        return;
        if (!d[0].datapoints || !d[0].datapoints.length) {
            return;
        }

        var max_length = d[0].datapoints.length;
        if (d[0].datapoints.length < d[1].datapoints.length) {
            max_length = d[1].datapoints.length;
        }

        datum.length = 0;
        var average = 0;
        for (var j = 0; j < max_length; j++) {
            var sum = 0;

            if (isNaN(d[0].datapoints[j][1])) {
                continue;
            }

            if (!isNaN(d[0].datapoints[j][0])) {
                sum = d[0].datapoints[j][0];
            }
            if (!isNaN(d[1].datapoints[j][0])) {
                sum += d[1].datapoints[j][0];
            }

            datum[j] = {x: d[0].datapoints[j][1], y: sum};
            average += sum;
        }

        var avg;
        if (gauges['net']) {
            avg = average/max_length;
            // Change the range based on whether KB or MB..
            if (avg <= 1000*1000) {
                // Less than 1MB, we will do in 1K chunks
                avg = average/max_length/1000;
                gauges['net'].config.title = "Network (KB)";
            }
            else {
                // 1000 MB range or greater, we can do it in 100 MB
                // range
                avg = average/max_length/(1000*1000);
                gauges['net'].config.title = "Network (MB)";
            }
        }
        else {
            avg = average/max_length/(1000*1000);
        }
        gauges['net'].redraw(avg);
    }
}

function updateCurrRead(curr_period, d, datum) {
    if (d && d.length > 0) {
        datum.length = 0;
        for (var j = 0; j < d[0].datapoints.length; j++) {
            datum[j] = {x: d[0].datapoints[j][1], y: d[0].datapoints[j][0]};
        }
    }
}

function updateCurrWritten(curr_period, d, datum) {
    if (d && d.length > 0) {
        datum.length = 0;
        for (var j = 0; j < d[0].datapoints.length; j++) {
            datum[j] = {x: d[0].datapoints[j][1], y: d[0].datapoints[j][0]};
        }
    }
}

function updateBytesRead(curr_period, d, datum) {
    if (d && d.length > 0 ) {
        datum.length = 0;
        for (var j = 0; j < d[0].datapoints.length; j++) {
            datum[j] = {x: d[0].datapoints[j][1], y: d[0].datapoints[j][0]};
        }
    }
}

function updateBytesWritten(curr_period, d, datum) {
    if (d && d.length > 0) {
        datum.length = 0;
        for (var j = 0; j < d[0].datapoints.length; j++) {
            datum[j] = {x: d[0].datapoints[j][1], y: d[0].datapoints[j][0]};
        }
    }
}

function bdsGraph() {
    var self = this;
    this.initialized = false;

    this.formatKMGT = function(y) {
        var abs_y = Math.abs(y);
        if (abs_y >= 1000000000000)   { return y / 1000000000000 + "T" }
        else if (abs_y >= 1000000000) { return y / 1000000000 + "G" }
        else if (abs_y >= 1000000)    { return y / 1000000 + "M" }
        else if (abs_y >= 1000)       { return y / 1000 + "K" }
        else if (abs_y < 1 && y > 0)  { return y.toFixed(2) }
        else if (abs_y === 0)         { return '' }
        else                      { return y }
    }

    this.destroy = function() {
        d3.select($(this.id)).remove();
        $(self.id).empty();
        bdStopAjaxTimer(self.name);
    }

    this.reload = function (url, curr_period) {
        bdStopAjaxTimer(self.name);
        self.curr_period = curr_period;
        self.url = url;
        bdStartAjaxTimer(1, self.name, self.graphTimerCallback);
    }

    this.initialize = function (width, height, name, id, metric_name, graph_type, color, url, callback, curr_period) {
        this.name = name;
        this.datum = [{x :0, y:0}];
        this.id = id;
        this.metric_name = metric_name;
        this.graph_type = graph_type;
        this.color = color;
        this.url = url;
        this.callback = callback;
        this.curr_period = curr_period;

        var series = [{name: self.metric_name,
                      renderer: self.graph_type,
                      color: self.color,
                      data: self.datum}];
        this.dataGraph = new Rickshaw.Graph({
            element: $(id)[0],
            renderer: self.graph_type,
            width : width,
            height:  height,
            series: series,
            padding: {
                top: 1.50,
                bottom: 1.50
            },
        });

        var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: self.dataGraph,
            xFormatter: function(x) {
                return new Date(x * 1000).toLocaleString();
            }
        });

        var xAxis = new Rickshaw.Graph.Axis.Time( {
            graph: self.dataGraph,
            ticksTreatment: 'glow',
            ticks: 8,
            timeFixture: new Rickshaw.Fixtures.Time.Local()
        } );

        var yAxis = new Rickshaw.Graph.Axis.Y( {
            graph: self.dataGraph,
            tickFormat: self.formatKMGT,
            ticksTreatment: 'glow',
            ticks: 4,
        } );

        self.dataGraph.render();

        // Fire off the timer for processing data
        bdStartAjaxTimer(1, self.name, self.graphTimerCallback);
    }
    
    this.graphTimerCallback = function() {
        $.ajax({
            error: function(xhr, textStatus, errorThrown) { console.log(errorThrown); },
            url: self.url
        }).done(function(d) {
            // initialize data based on curr_period
            self.callback(self.curr_period, d, self.datum);
            self.dataGraph.update();
            bdStartAjaxTimer(60, self.name, self.graphTimerCallback);
        });
    }

}

function createGauge2(name, title, label, id, size, min, max, zones) {
    var config = {
        size: size,
        title: title,
        label: label,
        min: min,
        max: max,
        zones: zones,
    }

    var range = config.max - config.min;
    config.zones = zones;

    gauges[name] = new Gauge2(id, config);
    gauges[name].render();
}

function createGauge(name, label, id, size, min, max, zones, color) {
    var config = {
        size: size,
        label: label,
        min: min,
        max: max,
        zones: zones,
        color: color
    }

    var range = config.max - config.min;
    if (zones == 'true') {
        config.yellowZones = [{ from: config.min + range*0.60, to: config.min + range*0.78 }];
        config.redZones = [{ from: config.min + range*0.8, to: config.max }];
        config.greenZones = [{ from: config.min, to: config.max*0.55 }];
    }

    config.greenColor = '#76c8bd';
    config.yellowColor = '#f7c676';
    config.redColor = '#c5819a';


    gauges[name] = new Gauge(id, config);
    gauges[name].render();
}

function bdStopSpin() {
    if (spinner != null) {
        $('#id_spinner').data('spinner').stop();
    }
}

function Gauge2(element, configuration)
{
    this.element = element;

    var self = this;

    this.configure = function(configuration) {
        this.config = configuration;
        this.gauge2 = true;

        this.config.size = this.config.size * 0.9;

        this.config.radius = this.config.size * 0.97 / 2;
        this.config.cx = this.config.size / 2;
        this.config.cy = this.config.size / 2;
        this.config.factor = 0.75;

        this.config.range = configuration.max - configuration.min;

        this.config.zones = configuration.zones;

        this.config.transitionDuration = configuration.transitionDuration || 500;
    }

    this.render = function() {
        this.body = d3.select("#" + this.element)
                    .append("svg:svg")
                    .attr("width", this.config.size)
                    .attr("height", this.config.size);

        this.redraw(this.config.zones[0].from);
    }

    this.drawTitle = function() {
        var fontSize = 14;
        this.body.append("svg").append("text")
                .attr("text-anchor", "middle")
                .attr("x", this.config.size/2)
                .attr("y", this.config.size-4)
                .style("font-size", fontSize + "px")
                .style("fill", "#666")
                .text(this.config.title);
    }

    this.drawLabel = function() {
        var fontSize = 28;
        this.body.append("svg:text")
                .attr("text-anchor", "middle")
                .attr("x", this.config.cx+2)
                .attr("y", this.config.cy-5) // / 2  + fontSize / 2)
                .attr("dy", fontSize / 2)
                .text(this.config.label)
                .style("font-style", "bold")
                .style("font-size", fontSize + "px")
                .style("fill", "#222");

    }
    
    this.drawBand = function(start, end, color) {
        if (start == 0 && end == 0) {
            return;
        }

        // When increasing stroke-width, change the inner and outer
        // radius also.
        var svg = this.body.append("svg:path")
                      .attr("d", d3.svg.arc()
                      .startAngle(this.valueToRadians(start))
                      .endAngle(this.valueToRadians(end))
                      .innerRadius(this.config.factor * this.config.radius)
                      .outerRadius(this.config.factor * this.config.radius))
                  .style("stroke", color)
                  .style("stroke-width", "20px");

        svg.attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
    }

    this.redraw = function(value) {
        if (isNaN(value)) {
            value = 0;
        }
        this.body.selectAll("path").remove();
        this.body.selectAll("text").remove();

        this.config.label = Math.floor(value);

        if (value >= this.config.max) {
            value = this.config.max;
        }
        this.config.zones[0].to = value;
        this.config.zones[1].from = value;
        for (var index in this.config.zones) {
            this.drawBand(this.config.zones[index].from, this.config.zones[index].to, self.config.zones[index].color);
        }
        this.drawTitle();
        this.drawLabel();
    }

    this.valueToDegrees = function(value) {
        return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
    }

    this.valueToRadians = function(value) {
        return this.valueToDegrees(value) * Math.PI / 180;
    }

    // initialization
    this.configure(configuration);
}


function Gauge(element, configuration)
{
    this.element = element;

    var self = this;

    this.configure = function(configuration)
    {
        this.config = configuration;

        this.config.size = this.config.size * 0.9;

        this.config.radius = this.config.size * 0.97 / 2;
        this.config.cx = this.config.size / 2;
        this.config.cy = this.config.size / 2;

        this.config.min = undefined != configuration.min ? configuration.min : 0; 
        this.config.max = undefined != configuration.max ? configuration.max : 100; 
        this.config.range = this.config.max - this.config.min;

        this.config.majorTicks = configuration.majorTicks || 5;

        this.config.greenColor 	= configuration.greenColor || "#109618";
        this.config.yellowColor = configuration.yellowColor || "#FF9900";
        this.config.redColor 	= configuration.redColor || "#DC3912";

        this.config.transitionDuration = configuration.transitionDuration || 500;
    }

    this.render = function()
    {
        this.body = d3.select("#" + this.element)
                    .append("svg:svg")
                    .attr("class", "gauge")
                    .attr("width", this.config.size)
                    .attr("height", this.config.size);

        if (this.config.zones == 'true') {
            for (var index in this.config.greenZones)
            {
                this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
            }
            
            for (var index in this.config.yellowZones)
            {
                this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
            }

            for (var index in this.config.redZones)
            {
                this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
            }
        }
        else {
            // No zones, just use the color provided by the user.
            this.drawBand(this.config.min, this.config.max, self.config.color);
        }

        if (undefined != this.config.label)
        {
            var fontSize = Math.round(this.config.size / 9);
            this.body.append("svg:text")
                    .attr("x", this.config.cx)
                    .attr("y", this.config.cy / 2 + fontSize / 2)
                    .attr("dy", fontSize / 2)
                    .attr("text-anchor", "middle")
                    .text(this.config.label)
                    .style("font-size", fontSize + "px")
                    .style("fill", "#777")
                    .style("stroke-width", "0px");
        }

        var fontSize = Math.round(this.config.size / 16);
        var majorDelta = this.config.range / (this.config.majorTicks - 1);
        for (var major = this.config.min; major <= this.config.max; major += majorDelta)
        {
            if (major == this.config.min || major == this.config.max)
            {
                var point = this.valueToPoint(major, 0.63);

                this.body.append("svg:text")
                        .attr("x", major == this.config.min ? point.x-10 : point.x+10)
                        .attr("y", point.y+25)
                        .attr("dy", fontSize / 3)
                        .attr("text-anchor", major == this.config.min ? "start" : "end")
                        .text(major)
                        .style("font-size", fontSize + "px")
                        .style("fill", "#333")
                        .style("stroke-width", "0px");
            }
        }

        var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");

        var midValue = (this.config.min + this.config.max) / 2;

        var pointerPath = this.buildPointerPath(midValue);

        var pointerLine = d3.svg.line()
                          .x(function(d) { return d.x })
                          .y(function(d) { return d.y })
                          .interpolate("monotone");

        // Needle path
        pointerContainer.selectAll("path")
                .data([pointerPath])
                .enter()
                .append("svg:path")
                .attr("d", pointerLine)
                .style("stroke", "#444")
                .style("stroke-width", "1.5px")

        // Needle circle 
        pointerContainer.append("svg:circle")
                .attr("cx", this.config.cx)
                .attr("cy", this.config.cy)
                .attr("r", 0.10 * this.config.radius)
                .style("fill", "#fff")
                .style("stroke", "#444")
                .style("stroke-width", "1.5px");

        var fontSize = Math.round(this.config.size / 10);
        pointerContainer.selectAll("text")
                .data([midValue])
                .enter()
                .append("svg:text")
                .attr("x", this.config.cx)
                .attr("y", this.config.size - this.config.cy / 4 - fontSize)
                .attr("dy", fontSize / 2)
                .attr("text-anchor", "middle")
                .style("font-size", fontSize + "px")
                .style("fill", "#000");

        this.redraw(this.config.min, 0);
    }

    this.buildPointerPath = function(value)
    {
        var delta = this.config.range / 13;
        var head = valueToPoint(value, 0.85);

        var tailValue = value - (this.config.range * (1/(270/360)) / 2);
        var tail = valueToPoint(tailValue, 0.05);

        return [head, tail];

        function valueToPoint(value, factor)
        {
            var point = self.valueToPoint(value, factor);
            point.x -= self.config.cx;
            point.y -= self.config.cy;
            return point;
        }
    }

    this.drawBand = function(start, end, color)
    {
        if (0 >= end - start) return;
        this.body.append("svg:path")
                .attr("d", d3.svg.arc()
                      .startAngle(this.valueToRadians(start))
                      .endAngle(this.valueToRadians(end))
                      .innerRadius(0.99 * this.config.radius)
                      .outerRadius(0.99 * this.config.radius))
                .style("stroke", color)
                .style("stroke-width", "2px")
                .attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
    }

    this.redraw = function(value, transitionDuration)
    {
        var pointerContainer = this.body.select(".pointerContainer");

        pointerContainer.selectAll("text").text(Math.round(value));

        var pointer = pointerContainer.selectAll("path");

        pointer.transition()
                .duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
                .attrTween("transform", function()
        {
            var pointerValue = value;
            if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
            else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
            var targetRotation = (self.valueToDegrees(pointerValue) - 90);
            var currentRotation = self._currentRotation || targetRotation;
            self._currentRotation = targetRotation;

            return function(step) 
            {
                var rotation = currentRotation + (targetRotation-currentRotation)*step;
                return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")"; 
            }
        });
    }

    this.valueToDegrees = function(value)
    {
        return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
    }

    this.valueToRadians = function(value)
    {
        return this.valueToDegrees(value) * Math.PI / 180;
    }

    this.valueToPoint = function(value, factor)
    {
        return {
            x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
            y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value))
        };
    }

    // initialization
    this.configure(configuration);	
}


function d3Graph(elementId, barData, axisText, labels, hoverCallback) {
    // Setup margins, leave room for legend on top, hover on the right, yaxis ticker and label on the left
    // xaxis labels and text on right
    var margin = {top: 30, right: 30, bottom: 30, left: 60};
    var width = $(elementId).outerWidth() - margin.left - margin.right;
    var height = $(elementId).outerHeight() - margin.top - margin.bottom;

    var stack = d3.layout.stack();
    layers = stack(d3.range(barData.length).map(function(i) {
        a = barData[i];
        return a.map(function(d, i) { return {index: i, y: parseInt(d/1000)}; });
    })),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

    var range;
    if (barData[0].length > 10) {
        range = 0.08;
    }
    else {
        if (barData[0].length > 5) {
            range = 0.08 - (barData[0].length*0.01);
        }
        else {
            range = 0.8 - (barData[0].length*0.1);
        }
    }

    var x = d3.scale.ordinal()
            .domain(d3.range(barData[0].length))
            .rangeRoundBands([0, width], 0.1, 0.1);

    var y = d3.scale.linear()
            .domain([0, yStackMax])
            .range([height, 0]);

    var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

    var xAxis = d3.svg.axis()
                .scale(x)
                .tickFormat(function(d) { return ''; })//if (barData[0].length >= 20) { return ''; } else { return 'J' + (d + 1); } })
                .tickSize(0)
                .tickPadding(6)
                .orient("bottom");

    // Chart outline with xaxis and yaxis labels with data.
    var svg = d3.select(elementId).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    // Add X and Y labels for the bar chart
    svg.append("text")
            .attr("x", width / 2 )
            .attr("y",  height + 20)
            .style("text-anchor", "middle")
            .text(axisText[0]);

    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -(height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(axisText[1]);

    // Add chart data with transition
    var layer = svg.selectAll(".layer")
                .data(layers)
                .enter().append("g")
                .attr("class", "layer")
                .style("fill", function(d, i) { return labels[i][1] });

    var rect = layer.selectAll("rect")
               .data(function(d) { return d; })
               .enter().append("rect")
               .attr("x", function(d) { return x(d.index); })
               .attr("y", height)
               .attr("width", Math.min.apply(null, [x.rangeBand()-4, 40]))
               .attr("height", 0)
               .on("mouseover", function(d,i) {
                    var xPosition = parseFloat(x(i)) + 40;
                    var yPosition = height / 2;
                    d3.select("#barchart_tooltip")
                            .style("left", xPosition + "px")
                            .style("top", yPosition + "px")
                            .html(hoverCallback(d.index));

                    d3.select("#barchart_tooltip").classed("hidden", false);
               })
               .on("mouseout", function() {
                   //Remove the tooltip
                   d3.select("#barchart_tooltip").classed("hidden", true);
               })
               .transition()
               .duration(500)
               .attr("y", function(d, i, n) {
                   // Add a gap between the stacks 1 px
                   Value = y(d.y0 + d.y);
                   if (d.y0 != 0) {
                       Value -= 1;
                   }
                   return Value;
               })
               .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });
               
    // add legend. Horizontal legend on top of the bar chart, centered
    var legend = svg.append("g")
                 .attr("class", "legend")
                 .attr('transform', 'translate(20,-20)');

    legend.selectAll('rect').data(labels)
            .enter()
            .append("rect")
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", function(d, i) { return width/2 - i * 110; })
            .style("fill", function(d) { return d[1]; });

    legend.selectAll('text')
            .data(labels)
            .enter()
            .append("text")
            .attr("y", 10)
            .attr("x", function(d, i) { return width/2 + 15 - i*110; })
            .text(function(d) { return d[0]; });
}

