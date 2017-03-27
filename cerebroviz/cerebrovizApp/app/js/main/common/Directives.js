app.directive('cerebro', function() {
    return {
        restrict: 'E',
        scope: {
            val: '='
        },
        templateUrl: 'templates/app/cerebro.html',
        link: function(scope, element, attrs) {

            var bOnce = false;
            // These variables are later used to set up basic paramaters like the chart size, margins and cell size.
            var itemHeight = 22; // This is used to set the vertical height of the individual svg elements of the hetmap
            var cellHeight = (itemHeight - 2); // by subtracting two, we allow for two pixels buffer above and below the rows representing the brain regions.
            var cellWidth = (itemHeight / 2);
            var margin = {
                    "top": (itemHeight * 1.5),
                    "right": (cellWidth * 2),
                    "bottom": (itemHeight),
                    "left": (cellWidth * 5)
                },
                width = (cellWidth * 57) - margin.left - margin.right,
                height = (itemHeight * 18.5) - margin.top - margin.bottom;

            scope.$watch('val', function(newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                if (!bOnce) {
                    dropDownChange();
                    bOnce = true;
                }
                loadDataSet(newVal);
                refreshHeatmap();
                updateRegions(currentTimePoint);
            });


            //function Data() {                            

            //Below, we are styling the container which holds the heatmap. This could be done in CSS, but this way it is dynamic if we choose to change the overall size of the heatmap.
            d3.select('.heatmap-wrapper')
                .style('max-width', width + margin.left + margin.right + 'px')
                .style('min-width', width + margin.left + margin.right + 'px')
                //.style('font-size', itemHeight / 20 + 'em')

            // These varaibles provide the color schemes (given here as names, but can be listed as rgb values) which can be chosen.
            // i=0 is the low value, i=1 is the median (and sidebar background), i=2 is the high value, and i=3 is the color for the brain outline.
            var RB = ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061", "black"],
                DK = ["lightseagreen", "dimgray", "tomato", "snow"],
                RAS = ["red", "gold", "green", "black"];
            // Color Options. i=0 is the label which appears in the dropdown menu. i=1 is the name of the variable which holds the color scheme that it corresponds to.
            var colorOptions = [
                ["Default", "colorBrewer.RdYlBu"],
                ["Orange/Purple", "colorBrewer.PuOr"],
                ["Brown/Green", "colorBrewer.BrBG"],
                ["Purple/Green", "colorBrewer.PRGn"],
                ["Pink/Green", "colorBrewer.PiYG"],
                ["Red/Grey", "colorBrewer.RdGy"],
                ["Red/Blue", "colorBrewer.RdBu"]
            ];

            var dropDownChange = function() {
                colorSelect = eval(d3.select("#selectStyle").property('value'));
                colorScale = d3.scale.linear()
                    .domain(d3.range(min, median, ((median - min) / 5)).concat(d3.range(median, max, (max - median) / 5)).concat(max))
                    .range(colorSelect);
                //Update the fill style to match the new colorSelect
                d3.select(".heatmap")
                    .selectAll("rect")
                    .transition()
                    .duration(500)
                    .style("fill", function(d) {
                        return colorScale(d);
                    });
                //Update the fill on the legend
                gradient.selectAll("stop").remove(); //The fill on the gradient has to be removed before a new one is applied.
                loadGradient();
                d3.selectAll('.brainBackground') //Update the color on the sidebar. This is not set earlier, because the page defaults to Red/Blue.
                    .transition()
                    .style('fill', 'white');
                d3.selectAll('.brainOutline') //Update the color on the lines for the brain outline. This is not set earlier, because the page defaults to Red/Blue.
                    .transition()
                    .style('fill', "black")
                updateRegions(currentTimePoint) //Update the color on the brain regions
            }

            var colorSelect = "colorBrewer.RdYlBu";

            // Reversed all the colors below, to
            var colorBrewer = { YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"].reverse(), YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"].reverse(), GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"].reverse(), BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"].reverse(), PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"].reverse(), PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"].reverse(), BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"].reverse(), RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"].reverse(), PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"].reverse(), OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"].reverse(), YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"].reverse(), YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"].reverse(), Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"].reverse(), Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"].reverse(), Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"].reverse(), Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"].reverse(), Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"].reverse(), Greys: ["#f7f7f7", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"].reverse(), PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"].reverse(), BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"].reverse(), PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"].reverse(), PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"].reverse(), RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"].reverse(), RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"].reverse(), RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"].reverse(), Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"].reverse(), RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"].reverse(), Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"].reverse(), Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"].reverse(), Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"].reverse(), Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f7f7f7"].reverse(), Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"].reverse(), Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"].reverse(), Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"].reverse(), Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"].reverse() };

            // The retrievedData varable holds whatever has been retrieved from the database. This is a dummy set which generates a blank heatmap
            //var retrievedData = [{ "entrez_id": 0000, "gene_symbol": "Type in a gene!", "ensembl_gene_id": "ENSG00000000000", "json": "[[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]]" }];

            var dataSet = null,
                geneID = null,
                min = null,
                median = null,
                max = null;
            //This function "loads" the retrievedData, and parses it for the JSON and assigns it to var dataSet.
            var loadDataSet = function(retrievedData) {
                if (retrievedData) {
                    dataSet = JSON.parse(retrievedData[0].json)[0];
                    geneID = retrievedData[0].gene_symbol;
                    // These variables are used to calculate the color scale. They are very standard d3 procedures. Must occur after dataSet is created.
                    merge = d3.merge(dataSet)
                    max = d3.round(d3.max(merge), 5)
                    min = d3.round(d3.min(merge), 5)
                    median = d3.round(d3.median(merge), 5);
                    colorScale = d3.scale.linear()
                        .domain(d3.range(min, median, ((median - min) / 5)).concat(d3.range(median, max, (max - median) / 5)).concat(max))
                        .range(colorSelect)
                        .clamp(true);
                    colorAxisScale = d3.scale.ordinal()
                        .domain([d3.round(min, 2), d3.round(median, 2), d3.round(max, 2)])
                        .rangePoints([0, (itemHeight * 10)]);
                    colorAxis = d3.svg.axis()
                        .scale(colorAxisScale)
                        .orient("top")
                        .tickValues(colorAxisScale.domain());
                }
            };

            //loadDataSet is called to initialize everything
            //loadDataSet();

            //These variables deal with the creation of the yAxis (region lables)
            var yGuideScale = d3.scale.ordinal()
                .domain(["A1C", "AMY", "CBC", "DFC", "HIP", "IPC", "ITC", "M1C", "MD", "MFC", "OFC", "S1C", "STC", "STR", "V1C", "VFC"])
                .rangePoints([0, height - itemHeight]); //itemHeight is subtracted from height so that ticks line up with the center of rows
            var yAxis = d3.svg.axis()
                .scale(yGuideScale)
                .orient("left")
                .tickValues(yGuideScale.domain());

            //These varables deal with the creation of the xAxis (timepoint lables)
            var xGuideScale = d3.scale.ordinal()
                .domain(["8 PCW", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "19 PCW", "t10", "t11", "t12", "t13", "Full term", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "3 yr", "t30", "t31", "5 yr", "t33", "t34", "t35", "t36", "t37", "10 yr", "t39", "t40", "t41", "t42", "20 yr", "t44", "t45", "t46", "30 yr", "t48", "t49", "40 yr"])
                .rangePoints([0, cellWidth * 49]);
            var xAxis = d3.svg.axis()
                .scale(xGuideScale)
                .orient("top")
                .ticks(10)
                .tickValues(xGuideScale.domain().filter(function(d, i) {
                    return (i === 0) || (i === 8) || (i === 13) || (i === 28) || (i === 31) || (i === 37) || (i === 42) || (i === 46) || (i === 49)
                })); //The .tickValues specifies the index position of which subset of lables will be placed on the x axis.

            //Below, the svg which will hold the heatmap is rendered. At this point it is empty.
            var svg = d3.select("#heatmap")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom / 4)
                .attr("class", "heatmap");


            // This creats the play/pause seek bar. Currently uses HTML range slider, eventually shoudl use jqueryUI or somesuch
            d3.select('#playPause')
                .style("background", "rgba(200, 200, 200, 0.3)");

            d3.select('.js-button')
                .style('float', 'left')
                .style('margin-left', margin.left / 4 + 'px');

            var rangeSlider = d3.select('#playPause').append('input')
                .attr('type', 'range')
                .attr('min', 0)
                .attr('max', 49)
                .attr('step', 1)
                .attr('value', 0)
                .attr('id', 'rangeSlider')
                .style('width', width - (cellWidth) + 'px') // Setting the width here to ensure the slider handle will line up wiht the middle of the cells in the heat map
                .style('margin-top', '13px')
                .style('float', 'right')
                .style('margin-right', margin.right + (cellWidth / 2.5) + 'px') // Setting the margin here is also important to ensure the handle lines up proper


            //Time for a legend, which will appear below the heatmap
            var legend = d3.select("#colorLegend")
                .append('svg')
                .attr("width", cellWidth * 22 + margin.left)
                .attr("height", 2 * itemHeight)
                .attr("class", "colorLegend");
            //Append the rectangle which will hold the gradient that serves as the color key.
            legend.append("rect")
                .attr("width", (cellWidth * 20))
                .attr("height", itemHeight)
                .attr("x", margin.left)
                .attr("y", margin.bottom - itemHeight / 4)
                .style("fill", "url(#gradient)");

            //The gradient created here is the color legend itself. The different stop-colors are taken from the current colorSelect
            var gradient = legend.append("defs")
                .append("linearGradient")
                .attr("id", "gradient");

            var loadGradient = function() {
                colorBrewer.RdYlBu.forEach(function(cV, i) {
                    gradient.append("stop")
                        .attr("offset", i * 10 + "%")
                        .attr("stop-color", colorSelect[i])
                        .attr("stop-opacity", 1)
                })
            };

            //loadGradient();

            // Create the select box to be used to choose a color scheme. This is all a rather roundabout way of doing it -- may be a better way with jqueryUI integration.
            var dropDown = d3.select("#colorLegend")
                .append("text")
                .attr('id', 'selectLabel')
                .style('vertical-align', (0.5 * cellHeight) + "px") // this sets the the text to be aligned to the center of the svg, by making it 1/4 of the height of the svg
                //.style('font-size', itemHeight / 14 + 'em')
                .text("Select color scheme:  ")
                .append("select")
                .attr("class", "select_style")
                .attr("id", "selectStyle") // Redundant? Most certainly.
                // Create the select options themselves, within the dropdown menu.
            dropDown.selectAll('option')
                .data(colorOptions).enter()
                .append('option')
                .attr("value", function(d) {
                    return d[1];
                })
                .text(function(d) {
                    return d[0];
                });

            // One big function to handle the click event, changing colorSelect to the value of the option.
            dropDown.on('change', function() { dropDownChange() });


            // Brain regions and playing
            var regions = ["A1C", "AMY", "CBC", "DFC", "HIP", "IPC", "ITC", "M1C", "MD", "MFC", "OFC", "S1C", "STC", "STR", "V1C", "VFC"];

            var currentTimePoint = 0; // This value will change when the range slider changes (eighter manually or via the play loop).
            //
            var currentSet = dataSet ? dataSet[0] : null; // This holds the row of the dataSet which is currently being displayed in the brain regions.

            //the function to update brain regions based on the HTML slider
            function updateRegions(timePoint) {
                if (dataSet) {
                    currentSet = dataSet[timePoint]; // Change the currentSet based on the timePoit fed into the function (which will come from the play bar)

                    for (i = 0; i < regions.length; i++) {
                        d3.selectAll('.' + regions[i]) // Select each of the brain regions based on the array above.
                            .transition().duration(250) // How long transitions between colors should take
                            .style('fill', function(d) { // Change the fill style
                                return colorScale(currentSet[i]); // based on the index position, which is the same in the regions array as in the colums of data.
                            });
                    }
                }
            }

            //Running updateRegions initializes the brain regions
            updateRegions(0);

            // The timer that controlls playback -- when it is running, it triggers the $("#rangeSlider").on("input"... event
            var myTimer;
            var playRangeSlider = function() {
                clearInterval(myTimer); // First, clear the old timer out, so there's no stutter
                myTimer = setInterval(function() { //
                    var b = d3.select("#rangeSlider"); // Variable b is a proxy for the range slider's current value.
                    var t = (+b.property("value") + 1) % (+b.property("max") + 1); // Variable t determines if the playhead is at the end of the bar
                    if (t == 0) { // it does this by testing if the remainder of the current position divided
                        t = +b.property("min"); // by the max position is zero. If so, it resets the timer back to the minimum.
                    } //
                    b.property("value", t); // This is where the value of the range slider is actually changed
                    updateRegions(t); // and we must not forget to update the brain regions in the svg as well.
                }, 500); // The number in this line is the number of ms between moves
            };

            //To stop the slider, simply clear out the timer
            var stopRangeSlider = function() {
                clearInterval(myTimer);
            };

            $("#rangeSlider")
                .on("input", function() {
                    currentTimePoint = this.value;
                    updateRegions(this.value);
                    stopRangeSlider();
                    if (playButton.state === "playing") { playButton.toggle() };
                });

            // The play/pause button. It looks complicated due to the transition between forms, but operates as a simple toggle.
            var playButton = {
                el: document.querySelector(".js-button"),
                iconEls: {
                    playing: document.querySelector("#pause-icon"),
                    paused: document.querySelector("#play-icon")
                },
                state: "paused",
                nextState: {
                    playing: "paused",
                    paused: "playing"
                },
                animationDuration: 400, // This duration is how long it takes the play button to morph into the pause button. Noting important.
                init: function() {
                    this.replaceUseEl();
                    this.el.addEventListener("click", this.toggle.bind(this));
                },
                replaceUseEl: function() {
                    d3.select(this.el.querySelector("use")).remove();
                    d3.select(this.el.querySelector("svg")).append("path")
                        .attr("class", "js-icon")
                        .attr("d", this.stateIconPath());
                },
                toggle: function() {
                    this.goToNextState();
                    d3.select(this.el.querySelector(".js-icon")).transition()
                        .duration(this.animationDuration)
                        .attr("d", this.stateIconPath());
                },
                goToNextState: function() {
                    this.state = this.nextState[this.state];
                    if (this.state === "playing") {
                        playRangeSlider()
                    } else {
                        stopRangeSlider()
                    };
                },

                stateIconPath: function() {
                    return this.iconEls[this.state].getAttribute("d");
                }
            };

            // Initialize the play button


            playButton.init();


            //The below function quearies the database, issuing the post request
            var quearyDatabase = function(queary) {
                d3.json('http://128.255.84.11:3000/getgene')
                    .header("Content-type", "application/x-www-form-urlencoded")
                    .post("id=" + queary, function(error, data) {
                        retrievedData = data;
                        loadDataSet();
                        refreshHeatmap();
                        updateRegions(currentTimePoint);
                    });
            };

            //quearyDatabase("PEF1");

            // This listens for input from the search bar, then runs quearyDatabase once it is submitted
            d3.select('#geneform')
                .on('submit', function() {
                    d3.event.preventDefault(); // This line prevents the normal operation of the html search bar, so the quearyDatabase function can be run in its place
                    var searchTerm = d3.select('.searchTerm');
                    var formInput = searchTerm.property('value');
                    quearyDatabase(formInput);
                });

            // The autocomplete here. Written in jquery.
            $(".searchTerm")
                .autocomplete({
                    source: 'http://128.255.84.11:3000/getgene',
                    minLength: 3,
                    select: function(event, ui) {
                        $(event.target).val(ui.item.value);
                        quearyDatabase(ui.item.value);
                        return false;
                    },
                });

            //This function populates the heatmap, the gene id header, and the axes (including for the color scale)
            var refreshHeatmap = function() {
                // For a sanity check, set the heading to the geneID
                d3.select("#geneHeader").selectAll('h2').remove();
                d3.select("#geneHeader").append("h2").html(geneID);
                //Below, the individual elements of the heatmap are rendered
                svg.selectAll("*").remove(); //First, remove prexisting svg elemetns
                svg.append("g") //This appends a initial grouping for the entire array of data
                    .selectAll("g") //
                    .data(dataSet) //Tells D3 where our data lives
                    .enter() //Enter the group of nodes we just created
                    .append("g") //This creates groups for the individual columns
                    .selectAll("rect")
                    .data(function(d, i, j) { //This tells D3 to use the same data as above, but lets it know we are also interested in index position (i, j)
                        return d;
                    })
                    .enter()
                    .append("rect") // By appending a rectagle here, we are havign D3 create a node for every entry in our data
                    .style("fill", function(d) {
                        return colorScale(d);
                    })


                //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\ NEW CELL HOVER FUNCTION BELOW
                .on("mouseover", function(d) {
                        //console.log(d)
                    })
                    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\


                .attr("x", function(d, i, j) { // Note Here:
                        return (j * cellWidth) + margin.left; // The JSON matrix we are working with is 50 rows of 16 colums
                    }) // but we want to display it as 16 rows with 50 colums.
                    .attr("y", function(d, i, j) { // To compensate, the x position of the rectagle is mapped to the row index j
                        return (i * itemHeight) + margin.top; // and the y position of the same rectagle is mapped mapped to the colums index i
                    })
                    .attr("width", cellWidth)
                    .attr("height", cellHeight);
                // Below the y axis is drawn. It seemes there should be a better way than creating the yGuide varable, immediately passing it to yAxis, but many examples do it this way, so I assume it will not introduce any bugs.
                var yGuide = d3.select('.heatmap').append('g')
                yAxis(yGuide)
                yGuide.attr('transform', 'translate(' + margin.left + ',' + (margin.top + itemHeight / 2) + ')')
                yGuide.selectAll('path')
                    .style({
                        fill: 'none',
                        stroke: 'none'
                    })
                yGuide.selectAll('line')
                    .style({
                        stroke: '#000'
                    });
                //Below the x axis is drawn
                var xGuide = d3.select('.heatmap').append('g')
                xAxis(xGuide)
                xGuide.attr('transform', 'translate(' + (margin.left + cellWidth / 2) + ',' + margin.top + ')')
                xGuide.selectAll('path')
                    .style({
                        fill: 'none',
                        stroke: 'none'
                    })
                xGuide.selectAll('line')
                    .style({
                        stroke: '#000'
                    });
                //Below the axis for the color legend (the numbers above the gradient )is drawn
                d3.select('.colorLegend').selectAll('g').remove();
                colorGuide = d3.select('.colorLegend').append('g')
                colorAxis(colorGuide)
                colorGuide.attr('transform', 'translate(' + margin.left + ',' + margin.bottom + ')')
                colorGuide.selectAll('path')
                    .style({
                        fill: 'none',
                        stroke: 'none'
                    })
                colorGuide.selectAll('line')
                    .style({
                        stroke: '#000'
                    });
            };
        }
    }
});