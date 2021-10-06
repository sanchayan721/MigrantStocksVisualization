function drawHeadingAreaWithButton() {

    // I select the body of the HTML and append the heading area where the author information will stay
    body = d3.select("body");

    drawHeadingFooterArea(body); // I draw the Heading area with this method

    // Onclick method of the Button present in the heading area
    buttonOnClick = function () {

        if (document.getElementById('title') == null) {

            drawHeadingFooterArea(body);
            showButton('minimize', buttonOnClick);

        } else {

            d3.select("#header_footer").selectAll("#title, #author").remove();
            showButton('maximize', buttonOnClick);
        }
    };

    showButton('minimize', buttonOnClick); // Here I draw the button

}

function showButton(state, clickBehaviour) {

    /*
    This is the Button which is used to hide the heading area to get the user a little more space
    real estate to work with the visualization and analysis.
    */

    d3.select("#minimize_header").remove();

    // I define the dimension of the button
    var button_parameters = { height: "40", width: "40", padding: "5", stroke_width: "2" }

    minimize_button = d3.select("#header").append("svg") // I select the header and append an svg for the button
        .attr("id", "minimize_header") // Name of the button
        .attrs({

            "class": function () { // I will define the possible states of the button either minimized or maximized
                if (state == 'minimize') {
                    return "minimize_header_maximized"
                } else if (state == 'maximize') {
                    return "minimize_header_minimized"
                }
            },

            "height": button_parameters.height,
            "width": button_parameters.width

        })
        .on("mouseover", function () {
            if (state == 'minimize') {
                d3.select("#button_circle")
                    .attr("fill", "white");
                d3.select("#button_text").selectAll("text")
                    .transition()
                    .duration(100)
                    .style("fill", "red");

            } else if (state == 'maximize') {
                d3.select("#button_circle")
                    .attr("fill", "grey");

                d3.select("#button_text").selectAll("text")
                    .transition()
                    .duration(100)
                    .style("fill", "green");
            }
        })
        .on("mouseout", function () { // This function in the attribute determines the behaviour or the button on mouse out
            if (state == 'minimize') {
                d3.select("#button_text").selectAll("text")
                    .transition()
                    .duration(500)
                    .style("fill", "#9ca19c");

            } else if (state == 'maximize') {
                d3.select("#button_text").selectAll("text")
                    .transition()
                    .duration(500)
                    .style("fill", "white");
            }
        })
        .on("click", clickBehaviour); // On click the clickBehaviour will be loaded.

    minimize_button.append("g") // Groups the svg elements together
        .attr("id", "button_circle")
        .append("circle")
        .attrs({
            "cx": button_parameters.height / 2,
            "cy": button_parameters.width / 2,
            "r": button_parameters.height / 2 - button_parameters.padding,
        })
        .attr("fill", function () {
            if (state == 'minimize') {
                return "white";
            } else if (state == 'maximize') {
                return "#c5c5c5";
            }
        });

    minimize_button.append("g") // Group the svg elements for the minimize button
        .attrs({
            "id": "button_text",
            "dominant-baseline": "middle", // The attributes id is button text and its set in the middle
        })
        .attr("transform", function () {
            if (state == 'minimize') {
                return `translate(${button_parameters.width / 2}, ${button_parameters.height / 2})`;
            } else if (state == 'maximize') {
                return `translate(${button_parameters.width / 2}, ${button_parameters.height / 2}) rotate(180)`;
            }
        })
        .append("text")
        .html("&#x25b2")
        .style("fill", "#9ca19c");
}

function drawHeadingFooterArea(body) {

    /* 
     * This function draws the heading area with the respective information 
     */

    author = { name: "Sanchayan Bhunia", matricola: 4849650, e_mail: "s4849650@studenti.unige.it" };

    header = body.append("div").attr("id", "header");
    title = header.append("div").attr("id", "title");
    title.append("text").text("Migrant Stocks Data Visualization");

    footer = body.append("div").attrs({
        "id": "footer",
        "style": function () {
            console.log(d3.select("#bar_svg").empty())
        }
    });
    author_place = footer.append("div").attr("id", "author");
    author_place.append("text").html(`<tspan id="author_name">${author.name} (${author.matricola})</tspan>\ 
    <br> <tspan id="author_email"><strong>@:</strong> ${author.e_mail}</tspan>`);
}

function drawBodyArea() {

    /* 
        This function is used to draw the body for the data section of the application 
        The body area will contain the map, ring chart and respective bar charts. 
    */

    graphs = d3.select("body").append("div").attr("id", "graphs");

    // This is the top row for the graphs
    top_row = graphs.append("div").attrs({
        "id": "top_row",
        "class": "double_grid"
    });

    // This is the bottom row for the graphs
    bottom_row = graphs.append("div").attrs({
        "id": "bottom_row",
        "class": "double_grid"
    });

    // On the top row append the map and the stacked bar chart
    top_row.append("div").attr("id", "map_view");
    top_row.append("div").attr("id", "stacked_bar_chart");

    // On the bottom row append the bar_chart and the ring chart
    bottom_row.append("div").attr("id", "bar_chart");
    bottom_row.append("div").attr("id", "ring_chart");

    // For every selection get the the data, country, year gender and interval 
    var selection = [{
        "data_selected": null,
        "country_selected": null,
        "year_selected": null,
        "gender_selected": null,
        "intervals": []
    }];

    // Call the loadData function
    loadData(selection);
}

function loadData(selection) {

    /* 
    
    This function loads the data for the application, the data is found in different csvs, so they have all been put
    in a queue. 

    */

    // This is the queue for the csv data files
    d3.queue()
        .defer(d3.csv, "data/migrantion_data/origin_destination/UN_MigrantStockByOriginAndDestination.csv")
        .defer(d3.csv, "data/migrantion_data/origin_destination/UN_MigrantStockByOriginAndDestination_Male.csv")
        .defer(d3.csv, "data/migrantion_data/origin_destination/UN_MigrantStockByOriginAndDestination_Female.csv")
        .defer(d3.csv, "data/migrantion_data/external_data/countries_iso.csv")
        .defer(d3.json, "data/map/world.geojson")
        .defer(d3.csv, "data/migrantion_data/age_data/Immigrants_All.csv")
        .defer(d3.csv, "data/migrantion_data/age_data/Immigrants_Male.csv")
        .defer(d3.csv, "data/migrantion_data/age_data/Immigrants_Female.csv")

        .await(function (error, file1, file2, file3, file4, file5, file6, file7, file8) {
            if (error) {
                console.error('Something went wrong: ' + error);
            } else {
                data_files = {
                    "migration": {
                        "all": file1,
                        "male": file2,
                        "female": file3,
                    },
                    "iso": file4,
                    "geojson": file5,
                    "migrant_age": {
                        "all": file6,
                        "male": file7,
                        "female": file8,

                    }
                }

                // Load map data 
                mapContent(data_files, selection);
            }
        });

}

function mapContent(dataObject, selection) {

    /*
        This function loads the map with the respective dimensions and projection 
    */

    // Dimenstions
    var width = 850;
    var height = 320;
    var map_scale = 125;
    var map_offset = { "height": -30, "width": 20 }

    // Tool tip
    var tip = d3
        .tip()
        .attr("class", "d3-tip")
        .attr("id", "map-tip")
        .direction(function () {
            if (this.getBBox().y <= 26) {
                return 's';
            } else {
                return 'n';
            }
        })
        .offset(function () {
            if (this.id === "USA") {
                return [50, 50];
            } else if (this.id === "RUS") {
                return [-10, 200];
            } else if (this.getBBox().y <= 26) {
                return [5, 50];
            } else {
                return [-5, 0];
            }
        })
        .html(function () {
            if (this.className.baseVal == "countries" || this.className.baseVal == "selectedCountry") {
                text = `${this.__data__.properties.name}`;
            } else if (this.className.baseVal == "destination") {
                text = `<span style="color: ${this.__data__.colour}">\
                    <pre>${this.__data__.properties.name} &#x25B8 ${this.__data__.mass}</pre></span>`;
            } else if (this.className.baseVal == "lagend_selected_country") {
                text = `<span style="color: #FBC02D">\
                    <pre>${this.__data__.properties.name} &#x25B8 ${this.__data__.mass}</pre></span>`;
            }

            return `<span class="tip_text">${text}<span>`
        });

    // Select the map_view element from the canvas and attact respective svgs. 
    var svg = d3
        .select("#map_view")
        .append("svg")
        .attrs({
            "width": width,
            "height": height,
            "id": "map"
        })
        .call(tip);

    // Map and projection
    var projection = d3
        .geoEquirectangular()
        .scale(map_scale)
        .translate([width / 2 - map_offset.width, height / 2 - map_offset.height]);

    // A path generator
    var path = d3.geoPath().projection(projection);

    let mouseClick = function (data) {
        d3.selectAll(".selectedCountry, .destination").attr("class", "countries");
        d3.select(this).attr("class", "selectedCountry");

        selection[selection.length - 1].country_selected = data.properties.name;

        if (selection[selection.length - 1].data_selected !== null) {
            stackedBarContent(selection, dataObject);
        }
    };

    // Group the svg elements
    svg.append("g")
        .attr("id", "world_map")
        .selectAll("path")
        .data(dataObject.geojson.features)
        .enter()
        .append("path")
        .attrs({
            "class": "countries",
            "id": function (d) { return d.id },
            "d": path
        })
        .on("mouseover.tip", tip.show)
        .on("mouseout.tip", tip.hide)
        .on("click", mouseClick);

    d3.select("#world_map").datum({ "projection": projection });
    dataSelectionLagend(selection, dataObject);
}

function dataSelectionLagend(selection, dataObject) {

    /*
        This function selects the data for either Emigration of Immigration. 
    */


    selection.slice().reverse().every(function (element) {

        previous_data_selection = element.data_selected;

        if (previous_data_selection !== null) return false
        else return true
    });

    // Create buttons for the selection
    button_radius = 6;
    line_length = 5;
    group_spacing = 15;

    // These are the possible data types either Immigration of emigration
    types_of_data = ["immigration", "emigration"];

    world_map = d3.select("#map");

    // Create a legend for the data on the map.
    dataLagend = world_map.append("g").attrs({
        "id": "data_selection_lagend",
        "transform": `translate(${world_map.node().getBBox().width - 50}, ${7.5})`,
        "style": "cursor: pointer"
    });

    oneGroup = dataLagend.selectAll("g")
        .data(types_of_data).enter().append("g").attrs({

            "id": function (d) { return d },
            "fill": function (d, i) {
                if (d == "emigration") {
                    return "#cf5f65"
                } else if (d == "immigration") {
                    return "#8080FC"
                }
            },
            "stroke": function (d, i) {
                if (d == "emigration") {
                    return "#cf5f65"
                } else if (d == "immigration") {
                    return "#8080FC"
                }
            },
            "transform": function (d, i) {
                if (i % 2 == 0) {
                    return `translate(${-2 * button_radius}, ${0})`
                } else {
                    return `translate(${2 * button_radius}, ${0})`
                }
            },
            "style": "cursor: pointer"

        });

    oneGroup.append("circle").attrs({

        "cx": 0,
        "cy": 0,
        "r": button_radius,
        "stroke-width": 1.5,
        "fill-opacity": "0"

    });

    oneGroup.append("line").attrs({

        "x1": function (d, i) { if (i % 2 == 0) { return -button_radius } else { return button_radius } },
        "y1": 0,
        "x2": function (d, i) { if (i % 2 == 0) { return -(button_radius + line_length) } else { return button_radius + line_length } },
        "y2": 0,
        "stroke-width": 1.5

    });

    oneGroup.append("text").attrs({

        "dominant-baseline": "middle",
        "style": function (d, i) { if (i % 2 == 0) { return "text-anchor: end" } else { return "text-anchor: start" } },
        "class": "dataLagendText",
        "x": function (d, i) { if (i % 2 == 0) { return -(button_radius + line_length + 5) } else { return button_radius + line_length + 5 } },
        "y": 0,
        "stroke": "none"

    }).text(function (d) { return d.charAt(0).toUpperCase() + d.slice(1) });

    oneGroup.on("mouseover", function () { d3.select(this).attr("opacity", "50%") });

    oneGroup.on("mouseout", function () { d3.select(this).attr("opacity", "100%") });

    oneGroup.on("click", function (data, i) {
        selection[selection.length - 1].data_selected = data;
        makeSelection(data);

        if (selection[selection.length - 1].country_selected !== null) {
            stackedBarContent(selection, dataObject);
        }
    });

    // The selection happens in this place.
    function makeSelection(data_to_select) {

        d3.select("#data_selection_lagend").selectAll("#selection_circle").remove();
        d3.select(`#${data_to_select}`).append("circle").attrs({

            "id": "selection_circle",
            "cx": 0,
            "r": button_radius - 2.5

        }).attr("cy", function () {

            button_dimensions = d3.select(`#${data_to_select}`).select("circle").node().getBBox();
            return button_dimensions.y + button_dimensions.height / 2;

        });

    };

}

function stackedBarContent(selection, data) {

    /* 
         This function gets the stacked bar content to be used for the stacked bar. 
    */
    var selected_data_type = selection[selection.length - 1].data_selected;
    var selected_country_on_map = selection[selection.length - 1].country_selected;
    var migrant = data.migration;

    var years = new Set();

    // This will select all the migrants both male or female. 
    migrant.all.forEach(function (row) {
        if (Number(row["Year"]) != 0) {
            years.add(Number(row["Year"]));
        }
    });

    // This will select only male migrants 
    migrant.male.forEach(function (row) {
        if (Number(row["Year"]) != 0) {
            years.add(Number(row["Year"]));
        }
    });

    // This will select female migrants.
    migrant.female.forEach(function (row) {
        if (Number(row["Year"]) != 0) {
            years.add(Number(row["Year"]));
        }
    });

    male_female_migration_list = [];

    // If use selects emigration then the world map will show only data for emigration
    if (selected_data_type == "immigration") {
        years.forEach(function (year) {
            var male_number = null;
            var female_number = null;

            migrant.male.forEach(function (d) {
                if (Number(d.Year) == year) {
                    for (const [key, value] of Object.entries(d)) {
                        if (key == selected_country_on_map) {
                            if (d.Destination == "WORLD") {
                                male_number = Number(value);
                            }
                        }
                    }
                }
            });

            migrant.female.forEach(function (d) {
                if (Number(d.Year) == year) {
                    for (const [key, value] of Object.entries(d)) {
                        if (key == selected_country_on_map) {
                            if (d.Destination == "WORLD") {
                                female_number = Number(value);
                            }
                        }
                    }
                }
            });

            male_female_migration_list.push({ "year": year, "male": male_number, "female": female_number });
        });

        // If the use select immigration data then the map will show only that selection. 
    } else if (selected_data_type == "emigration") {
        years.forEach(function (year) {
            var male_number = null;
            var female_number = null;

            migrant.male.forEach(function (d) {
                if (Number(d.Year) == year && d.Destination == selected_country_on_map) {
                    male_number = Number(d.Total);
                }
            });

            migrant.female.forEach(function (d) {
                if (Number(d.Year) == year && d.Destination == selected_country_on_map) {
                    female_number = Number(d.Total);
                }
            });

            male_female_migration_list.push({ "year": year, "male": male_number, "female": female_number });
        });
    }

    // With the repective data selection call the stackedBar function using the parameters shown. 
    showStackedBar(selection, male_female_migration_list, data);
}

function showStackedBar(selection, stackedBarData, all_data_files) {

    /*
       This function shows the stacked bar with the respective data. 

    */
    d3.select("#no_data").remove()
    d3.selectAll(".connector_string").remove();
    d3.selectAll(".d3-tip-stacked-bar").remove();

    selected_country = selection[selection.length - 1].country_selected;

    selection.slice().reverse().every(function (element) {

        previous_year_selection = element.year_selected;

        if (previous_year_selection !== null) return false
        else return true
    });


    // Make the selection on the canvas. 
    d3.select("#stacked_bar_chart").selectAll("svg").remove();

    var margin = { top: 10, right: 80, bottom: 60, left: 80 },
        width = 640 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var heading_height = 15;

    var stacked_bar_chart = d3.select("#stacked_bar_chart");

    // Append the heading to the bar chart. 
    var heading = stacked_bar_chart.append("svg").attrs({

        "id": "stacked_bar_title",
        "height": heading_height,
        "width": width + margin.left + margin.right,
        "transform": `translate(${0}, ${0})`

    });

    heading.append("text").attrs({

        "text-anchor": "middle",
        "dominant-baseline": "middle",
        "x": "50%",
        "y": "50%"

    }).html(function () {
        if (selection[selection.length - 1].data_selected == "emigration") {
            return `<tspan style="fill: #cf5f65">Emigration</tspan> Data of <tspan class="selectedCountryName">${selected_country}</tspan>`
        } else if (selection[selection.length - 1].data_selected == "immigration") {
            return `<tspan style="fill: #8080FC">Immigration</tspan> Data of <tspan class="selectedCountryName">${selected_country}</tspan>`
        }
    }

    );

    // Append svg elements
    graph = stacked_bar_chart.append("svg").attrs({

        "id": "stacked_bar_svg",
        "width": width + margin.left + margin.right,
        "height": height + margin.top + margin.bottom

    })
        // Group the svg elements
        .append("g").attrs({

            "id": "stacked_bar_graph",
            "transform": `translate(${margin.left}, ${margin.top})`,
            "style": "cursor: pointer"

        });

    var bar_padding = 0.6;

    var groups = stackedBarData.map(function (d) {
        return d.year;
    });

    var subgroups = Object.keys(stackedBarData[0]).slice(1);

    var colourScale = d3.scaleOrdinal().domain([...subgroups, "all"]).range(["#4593C7", "#7970B3", "#41AB5D"]);

    var stackedData = d3.stack().keys(subgroups)(stackedBarData);

    selection = selectGenderOnLagend(graph, subgroups, colourScale, stackedBarData, selection, all_data_files);

    // Make tool tip
    var stacked_bar_tip = d3
        .tip()
        .attr("class", "d3-tip-stacked-bar")
        .attr("id", "stacked_bar_tip")
        .offset([-10, 0])
        .html(function (d) {

            var gender_selected = selection[selection.length - 1].gender_selected;

            if (gender_selected == "all" || gender_selected == null) {

                total = d.data.male + d.data.female;
                male_percent = d.data.male / total * 100;
                female_precent = d.data.female / total * 100;

                var text = `Female &#x2640 &#x25B8 <span style= 'color: ${colourScale("female")}'>${d.data.female} (${female_precent.toFixed(2)}%)</span><br>
                            Male &#x2642 &#x25B8 <span style= 'color: ${colourScale("male")}'>${d.data.male} (${male_percent.toFixed(2)}%)</span><br>
                            <hr>
                            <strong>Total &#x26A5 &#x25B8</strong> ${total}`;

            } else if (gender_selected == "female") {

                var text = `Female &#x2640 &#x25B8 <span style= 'color: ${colourScale("female")}'>${d.female}</span>`;

            } else if (gender_selected == "male") {

                var text = `Male &#x2642 &#x25B8 <span style= 'color: ${colourScale("male")}'>${d.male}`;

            }

            return `<tspan class="tip_text">${text}</tspan>`;
        });

    var x = d3.scaleBand() // Scales the chart since the data is categorical.
        .domain(groups)
        .range([0, width])
        .padding(bar_padding);

    graph.append("g")
        .attr("transform", `translate(${0}, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("class", "xyStackedBarAxis").call(stacked_bar_tip);

    if (selection[selection.length - 1].gender_selected === "male") {

        drawBarForOneGender("male");

    } else if (selection[selection.length - 1].gender_selected === "female") {

        drawBarForOneGender("female");

    } else {

        var y = d3.scaleLinear()
            .domain([0, d3.max(stackedBarData, function (d) {
                return d.male + d.female;
            })]).nice()
            .range([height, 0])

        graph.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll("text")
            .attr("class", "xyStackedBarAxis");

        var bar_area = graph.append("g").attrs({
            "id": "bar_area",
            "transform": `translate(${0}, ${0})`
        });

        bar_area.selectAll("g").data(d3.stack().key);

        bar_area.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) { return colourScale(d.key); })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attrs({

                "id": function (d) { return `year${d.data.year}` },
                "x": function (d) { return x(d.data.year); },
                "y": function (d) { return y(0); },
                "height": function (d) { return y(d[0]) - y(d[0]); },
                "width": x.bandwidth()

            })
            .on("click", function (d) { // Behaviour on click

                d3.selectAll(".stackedBarSelected").attr("class", null);
                d3.selectAll(`#year${d.data.year}`).attr("class", "stackedBarSelected");
                selection[selection.length - 1].year_selected = d.data.year;
                selectedMigrationBarAndAgeDoughnut(selection, all_data_files, colourScale);

            })
            .on("mouseover", function (d) { // Behaviour on mouseover
                stacked_bar_tip.show(d);
                d3.selectAll(`#year${d.data.year}`).attr("opacity", "100%").transition().duration(200).attr("opacity", "60%");
            })
            .on("mouseout", function (d) { // Behaviour on mouseout
                stacked_bar_tip.hide(d);
                d3.selectAll(`#year${d.data.year}`).attr("opacity", "100%").transition().duration(200).attr("opacity", "100%");
            })
            .transition().duration(200)
            .attrs({

                "id": function (d) { return `year${d.data.year}` },
                "x": function (d) { return x(d.data.year); },
                "y": function (d) { return y(d[1]); },
                "height": function (d) { return y(d[0]) - y(d[1]); },
                "width": x.bandwidth()

            })
            .delay(function (d, i) { return (i * 50) });

    }

    stacked_bar_chart.on("mouseover", function () {
        d3.select("#dummy_bar_group").remove()
    });

    stacked_bar_chart.on("mouseout", function () { drawDummies() });

    if (previous_year_selection !== null) {
        d3.selectAll(`#year${previous_year_selection}`).attr("class", "stackedBarSelected");
        drawDummies();
    }

    selectedMigrationBarAndAgeDoughnut(selection, all_data_files, colourScale);
    year_index = 0;
    selection[selection.length - 1].intervals.forEach((interval) => clearInterval(interval));
    playPauseButton();


    function drawBarForOneGender(gender) {

        /* 
            Based on the selected gender draw the bars based on that selection 
        */

        y = d3.scaleLinear() // Use the linear scale in this case.
            .domain([0, d3.max(stackedBarData, function (d) {
                return d[gender];
            })]).nice()
            .range([height, 0])

        graph.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll("text")
            .attr("class", "xyStackedBarAxis");

        var bar_area = graph.append("g").attr("transform", `translate(${0}, ${0})`).call(stacked_bar_tip);

        bar_area.selectAll("rect")
            .data(stackedBarData)
            .enter()
            .append("rect").attrs({

                "id": function (d) { return `year${d.year}` },
                "class": "male_female_bar",
                "x": function (d) { return x(d.year); },
                "y": function (d) { return y(0); },
                "fill": colourScale(gender),
                "height": function (d) { return height - y(0); },
                "width": x.bandwidth()

            }).on("click", function (d) { // Mouse behaviour on click

                d3.selectAll(".stackedBarSelected").attr("class", null);
                d3.select(this).attr("class", "stackedBarSelected");
                selection[selection.length - 1].year_selected = d.year;
                selectedMigrationBarAndAgeDoughnut(selection, all_data_files, colourScale)

            }).on("mouseover", function (d) { // Mouse behavior on mouse over
                stacked_bar_tip.show(d, selection);
            })
            .on("mouseout", function (d) { // Mouse behaviour on mouse out
                stacked_bar_tip.hide();
            })
            .transition().duration(200).attrs({

                "x": function (d) { return x(d.year); },
                "y": function (d) { return y(d[gender]); },
                "fill": colourScale(gender),
                "height": function (d) { return height - y(d[gender]); },
                "width": x.bandwidth()

            })
            .delay(function (d, i) { return (i * 50) });
    }

    function drawDummies() {

        if (selection[selection.length - 1].gender_selected == "all" || selection[selection.length - 1].gender_selected == null) {
            y = d3.scaleLinear()
                .domain([0, d3.max(stackedBarData, function (d) {
                    return d.male + d.female;
                })]).nice()
                .range([height, 0])

            var bar_area = graph.append("g").attrs({
                "id": "dummy_bar_group",
                "transform": `translate(${0}, ${0})`
            });

            bar_area.selectAll("rect").data(stackedBarData)
                .enter()
                .append("rect")
                .attrs({

                    "id": function (d) {
                        return `year${d.year}`
                    },
                    "x": function (d) { return x(d.year); },
                    "y": function (d) { return y(0) },
                    "fill": "#41AB5D",
                    "height": function (d) { return height - y(0); },
                    "width": x.bandwidth()
                }).transition().duration(1000).attrs({
                    "y": function (d) { return y(d.male + d.female) },
                    "height": function (d) { return height - y(d.male + d.female); }
                }).delay(function (d, i) { return 3000 + (i * 100) });

            stackedBarData.forEach((bar) => {
                if (d3.select("#bar_area").selectAll(`#year${bar.year}`).attr('class') == "stackedBarSelected") {
                    d3.select("#dummy_bar_group").select(`#year${bar.year}`).attr("class", "stackedBarSelected");
                };
            });
        }
    }

    function playPauseButton(state) {

        /*

            This function plays through the respective years and displays the data on the barch chart for a a particluar
            country. 

        */

        // Player respective variables.
        var frame_lag = 1800;
        var year_index = 0;
        var loop = 0;
        var loops = 3;

        if (state == null) {
            state = ["play"];
        }

        // Remove all elements for the button element
        d3.select("#play_pause_button").remove();

        svg = d3.select("#stacked_bar_svg");

        var buttonStyles = { "x": 300, "y": 280, "radius": 15 };

        // Group svg elements
        button = svg.append("g").attrs({
            "id": "play_pause_button",
            "transform": `translate(${buttonStyles.x}, ${buttonStyles.y})`,
            "style": "cursor: pointer"
        });

        button.attr("class", function () {
            if (state[0] == "play") {
                return "play_button"
            } else {
                return "pause_button"
            }
        });

        button.data(state);

        // The button is circular
        button.append("circle").attrs({
            "cx": 0,
            "cy": 0,
            "r": buttonStyles.radius,
            "fill": function (d) { if (d == "play") { return "green" } else if (d == "pause") { return "#C70D39" } }
        });

        button.append("text")
            .attrs({
                "x": function (d) { if (d == "play") { return 1 } else if (d == "pause") { return 0 } },
                "y": 1,
                "text-anchor": "middle",
                "dominant-baseline": "middle",
                "style": "user-select: none",
                "fill": "#F1F1F1"
            })
            .html(function (d) { if (d == "play") { return "&#x25B6" } else if (d == "pause") { return "&#10074&#10074" } });

        // Pause button behavior on click
        d3.select(".pause_button").on("click", function () {
            selection[selection.length - 1].intervals.forEach(interval => {
                clearInterval(interval);
            });
            playPauseButton(["play"]);
        });

        // Play button behavior
        d3.select(".play_button").on("click", function () {
            playPauseButton(["pause"]);
            selected_bar = d3.selectAll(".stackedBarSelected");

            if (selected_bar._groups[0][0] !== undefined) {
                selected_year = Number(selected_bar.attr("id").replace(/[^0-9]/g, ""));
                year_index = groups.indexOf(selected_year) + 1;
            }

            // the epoch function in terms of intervals
            interval = setInterval(function () {
                if (d3.select(".pause_button")._groups[0][0] !== null && year_index < groups.length) {
                    d3.selectAll(".stackedBarSelected").attr("class", null);
                    d3.selectAll(`#year${groups[year_index]}`).attr("class", "stackedBarSelected");
                    selection[selection.length - 1].year_selected = groups[year_index];
                    selectedMigrationBarAndAgeDoughnut(selection, all_data_files, colourScale);
                    year_index++;

                    if (year_index == groups.length && loop < loops) {
                        year_index = 0;
                        loop++;

                        // Exactly loops desired number of times if the play button is kept presses
                    } else if (loop == loops) {
                        selection[selection.length - 1].intervals.forEach((interval) => clearInterval(interval));
                        playPauseButton(["play"])
                    }
                }
            }, frame_lag);

            selection[selection.length - 1].intervals.push(interval);
        })
    }

}

function selectGenderOnLagend(stacked_bar_chart, subgroups, colourscale, stackedBarData, selection, all_data_files) {

    /* 
        This function shows the data based on gender on the bar charts for every particular country. 
    */
    button_radius = 6;
    line_length = 5;
    group_spacing = 15;


    selection.slice().reverse().every(function (element) {

        previous_gender_selection = element.gender_selected;

        if (previous_gender_selection !== null) return false
        else return true
    });

    gender_lagend = stacked_bar_chart.append("g").attrs({
        "id": "gender_lagend",
        "transform": `translate(${480}, ${30})`,
        "style": "cursor: pointer"
    });

    subgroups.reverse().push("all");

    one_group = gender_lagend.selectAll("g")
        .data(subgroups)
        .enter()
        .append("g")
        .attrs({

            "fill": function (d) { return colourscale(d) },
            "stroke": function (d) { return colourscale(d) },
            "id": function (d) { return d }

        });

    one_group.append("circle").attrs({

        "cx": 0,
        "cy": function (d, i) { return i * (button_radius + group_spacing) },
        "r": button_radius,
        "stroke-width": 1.5,
        "fill-opacity": "0"

    });

    one_group.append("line").attrs({

        "x1": button_radius,
        "y1": function (d, i) { return i * (button_radius + group_spacing) },
        "x2": button_radius + line_length,
        "y2": function (d, i) { return i * (button_radius + group_spacing) },
        "stroke-width": 1.5

    });

    one_group.append("text").attrs({

        "dominant-baseline": "middle",
        "class": "genderLagendText",
        "x": button_radius + line_length + 5,
        "y": function (d, i) { return i * (button_radius + group_spacing) },
        "stroke": "none"

    }).text(function (d) { return d.charAt(0).toUpperCase() + d.slice(1) });

    if (previous_gender_selection !== null) {
        makeSelection(previous_gender_selection);
        selection[selection.length - 1].gender_selected = previous_gender_selection;
    } else {
        makeSelection("all");
    }

    one_group.on("click", function (data, i) {

        selection[selection.length - 1].gender_selected = data;

        showStackedBar(selection, stackedBarData, all_data_files)
        selectedMigrationBarAndAgeDoughnut(selection, all_data_files, colourscale);

    });

    one_group.on("mouseover", function () { d3.select(this).attr("opacity", "50%") })

    one_group.on("mouseout", function () { d3.select(this).attr("opacity", "100%") })

    function makeSelection(gender_to_select) {
        d3.select(`#${gender_to_select}`).append("circle").attrs({
            "id": "selection_circle",
            "cx": 0,
            "r": button_radius - 2.5
        }).attr("cy", function () {

            button_dimensions = d3.select(`#${gender_to_select}`).select("circle").node().getBBox();
            return button_dimensions.y + button_dimensions.height / 2;

        })
    }
    return selection;
}

function selectedMigrationBarAndAgeDoughnut(selection, data_file, colourScale) {

    /*
        This function selects the migration data and the repective color scale for the bar and dougnut
    */

    selected_data_type = selection[selection.length - 1].data_selected;
    selected_country = selection[selection.length - 1].country_selected;
    selected_year = selection[selection.length - 1].year_selected;
    selected_gender = selection[selection.length - 1].gender_selected;

    selection.slice().reverse().every(function (element) {

        selected_year = element.year_selected;
        selected_gender = element.gender_selected;

        if (selected_year !== null) return false
        else return true
    });

    selection.slice().reverse().every(function (element) {

        selected_gender = element.gender_selected;

        if (selected_gender !== null) return false
        else return true
    });

    // If bar_chart id is null then do the following 
    if (document.getElementById("bar_chart") == null) {
        d3.select("#no_data").remove();
        d3.select("#bottom_row").append("div").attr("id", "bar_chart");
        d3.select("#bar_chart").append("div").attr("id", "doughnut_zipfs");
    }

    // If parameters are not null then call the barChartContent() function
    if (selected_year !== null && selected_country !== null && selected_gender !== null) {

        barChartContent(selected_data_type, selected_year, selected_country, selected_gender, data_file);

        if (selected_data_type == "immigration") {
            doughnutChartContent(selected_year, selected_country, selected_gender, data_file, colourScale);
        } else {
            d3.select("#age_doughnut_svg").selectAll("g").remove();
        }

    } else if (selected_year !== null && selected_country !== null) {

        default_gender_selection = "all";

        barChartContent(selected_data_type, selected_year, selected_country, default_gender_selection, data_file);

        if (selected_data_type == "immigration") {
            doughnutChartContent(selected_year, selected_country, default_gender_selection, data_file, colourScale);
        } else {
            d3.select("#age_doughnut_svg").selectAll("g").remove();
        }

    }
}

function barChartContent(selected_data, year_selected, selected_country, migrant_gender, data_fileObject) {

    /*
     
        This function will operate on the immigration dataset and emigration and draws the barcharts plus the doghnut chart that is found 
        within the bar chart for immigration. 

    */

    var dict_destination = [];
    var dict_origin = [];

    if (selected_data == "emigration") { // If selected data is emigration then

        data_fileObject.migration[migrant_gender].forEach(function (row) {
            if (Number(row.Year == year_selected)) {
                for (const [country, migrant_number] of Object.entries(row)) {
                    if (country == selected_country && !isNaN(Number(migrant_number))) {
                        data_fileObject.iso.forEach(function (rw) {
                            if (row.Destination == rw.Country) {
                                dict_destination.push([
                                    row.Destination,
                                    Number(migrant_number),
                                    rw.Alpha3code,
                                    Number(rw["Longitude (average)"]),
                                    Number(rw["Latitude (average)"])
                                ]);
                            } else if (rw.Country === selected_country) {
                                dict_origin = [
                                    selected_country,
                                    rw.Alpha3code,
                                    Number(rw["Longitude (average)"]),
                                    Number(rw["Latitude (average)"]),
                                ];
                            }
                        });
                    }
                }
            }

        });

        var sorted_destination = dict_destination.sort(function (a, b) {
            return +a[1] - +b[1];
        })
            .reverse();


        var zipfs = [];
        let sum = 0;
        try {
            var total_migration = sorted_destination[0][1];
        } catch {
            noDataAvailable(selected_country);
            throw `No Data for ${selected_country}!!`;
        }

        for (let i = 1; i < Math.round((sorted_destination.length * 20) / 100); i++) {
            if (sum <= (total_migration * 80) / 100) {
                sum = sum + sorted_destination[i][1];
                zipfs.push(sorted_destination[i]);
            }
        }
        top_destination_countries_percentage = (sum / total_migration) * 100;
        most_migrant_moved_percentage = (zipfs.length / sorted_destination.length) * 100;

        color = highlightCountries(sorted_destination, migrant_gender);

        // Draws the barchart 
        drawBarChart(
            selected_data,
            year_selected,
            sorted_destination,
            dict_origin,
            total_migration,
            sorted_destination,
            color
        );

        // Draws the doughnut chart
        drawRingChart(
            selected_data,
            top_destination_countries_percentage,
            most_migrant_moved_percentage,
            total_migration,
            color
        );

    } else if (selected_data == "immigration") { // If selected data is immigration then

        data_fileObject.migration[migrant_gender].forEach(function (row) {
            if (Number(row.Year) == year_selected && row.Destination == selected_country) {
                for (const [country, migrant_number] of Object.entries(row)) {

                    if (!isNaN(Number(migrant_number))) {

                        if (country == "Total") {
                            dict_origin.push(["WORLD", Number(migrant_number), , 0, 0]);
                        };

                        data_fileObject.iso.forEach(function (rw) {
                            if (rw.Country == country) {
                                dict_origin.push([

                                    country,
                                    Number(migrant_number),
                                    rw.Alpha3code,
                                    Number(rw["Longitude (average)"]),
                                    Number(rw["Latitude (average)"])

                                ]);
                            } else if (rw.Country == selected_country) {
                                dict_destination = [

                                    selected_country,
                                    rw.Alpha3code,
                                    Number(rw["Longitude (average)"]),
                                    Number(rw["Latitude (average)"]),

                                ];
                            }
                        });
                    };
                };
            };
        });

        var sorted_origin = dict_origin.sort(function (a, b) {
            return +a[1] - +b[1];
        })
            .reverse();


        var zipfs = [];
        let sum = 0;
        try {
            var total_migration = sorted_origin[0][1];
        } catch {
            noDataAvailable(selected_country);
            throw `No Data for ${selected_country}!!`;
        }

        for (let i = 1; i < Math.round((sorted_origin.length * 20) / 100); i++) {
            if (sum <= (total_migration * 80) / 100) {
                sum = sum + sorted_origin[i][1];
                zipfs.push(sorted_origin[i]);
            }
        }
        top_origin_countries_percentage = (sum / total_migration) * 100;
        most_migrant_moved_percentage = (zipfs.length / sorted_origin.length) * 100;

        color = highlightCountries(sorted_origin, migrant_gender);

        drawBarChart( // Draw the respective bar chart
            selected_data,
            year_selected,
            sorted_origin,
            dict_destination,
            total_migration,
            sorted_origin,
            color
        );

        drawRingChart( // And dougnut chart
            selected_data,
            top_origin_countries_percentage,
            most_migrant_moved_percentage,
            total_migration,
            color
        );

    }


}

function highlightCountries(to_be_highlighted, gender) {

    /*
        
        Based on the selection for the legend (by clicking), highligh the data on the map based on legend selection.

    */
    d3.selectAll(".destination, .lagend_selected_country").attr("class", "countries");

    domain_equivalence = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];

    // The color schemes that will be used.
    colorscemes = {
        "male": d3.schemeBlues,
        "female": d3.schemePurples,
        "all": d3.schemeGreens
    }

    // The color scale
    colourScale = d3
        .scaleLog()
        .domain(domain_equivalence)
        .range(colorscemes[gender][domain_equivalence.length]);

    graph_accent_color = colourScale(100000);

    // Calls the color legend
    colorLagend(colourScale, domain_equivalence, to_be_highlighted);

    to_be_highlighted.slice(1).forEach(function (row) {
        var selection = d3.selectAll(`#${row[2]}`);

        selection
            .attr("class", "destination")
            .datum(function () {
                var topo_data = selection.datum();
                topo_data["mass"] = row[1];
                topo_data["colour"] = colourScale(row[1]);
                return topo_data;
            })
            .attr("fill", function () {
                return colourScale(row[1]);
            });
    });

    return graph_accent_color;

}

function colorLagend(colourscale, domain, list_to_highlight) {

    /*
    
        This function colors the legend and determines the behavior of the legend on click or mouse over and out

    */

    d3.select("#map").select("#lagend").remove();

    var lagend_height = 160;
    var lagend_width = 20;
    var band_width = 10;
    var band_height = lagend_height / domain.length;
    var lagend_axis_length = 6;
    domain.unshift(0);


    // On mouseover show data on map
    let mouseOver = function () {
        d3.selectAll(".lagend_selected_country").attr("class", "destination");
        ofm_on_scale_hover = Math.log10(this.__data__);
        showBarSelectedDataOnMap(ofm_on_scale_hover)
    };

    let mouseOut = function () {

        d3.selectAll(".lagend_selected_country").attr("class", "destination");

        selected_bar_data = d3.select(".lagend_bar_selected").data()[0];

        if (Number.isInteger(selected_bar_data)) {
            selected_ofm_on_scale = Math.log10(selected_bar_data);
            showBarSelectedDataOnMap(selected_ofm_on_scale);
        }
    }

    // Onclick on the legend show the related data on the map. 
    let onClick = function (d) {

        if (d == 0) {

            d3.selectAll(".lagend_bar_selected").attr("class", "lagend_bar");
            d3.selectAll(".lagend_selected_country").attr("class", "destination");

        } else {

            d3.selectAll(".lagend_bar_selected").attr("class", "lagend_bar");
            d3.selectAll(".lagend_selected_country").attr("class", "destination");

            ofm_on_scale_clicked = Math.log10(this.__data__);
            showBarSelectedDataOnMap(ofm_on_scale_clicked);
            d3.select(this).selectAll("rect").attr("class", "lagend_bar_selected");
        }
    }


    function showBarSelectedDataOnMap(ofm_on_scale) {

        /*
    
            This function show the related selected data on the map based on the legend
    
        */

        list_to_highlight.slice(1).forEach(function (row) {

            ofm_in_data = Math.trunc(Math.log10(row[1]));

            if (ofm_in_data == ofm_on_scale) {
                var selection = d3.selectAll(`#${row[2]}`);
                selection.attr("class", "lagend_selected_country")
            }
        });
    }

    lagend = d3.select("#map").append("g").attr("id", "lagend")
        .attr("width", lagend_width).attr("heigh", lagend_height)
        .attr("transform", `translate( ${90}, ${230})`);

    domain.forEach(function (d, i) {


        bar = lagend.append("g").datum(d);

        bar.append("rect")
            .attrs({

                "class": "lagend_bar",
                "height": band_height,
                "width": band_width

            })
            .attr("y", function () {
                return band_height - i * band_height
            })
            .attr("fill", function () {
                if (d != 0) {
                    return colourscale(d);
                } else {
                    return "#C5C5C5";
                }

            });

        bar.append("line")
            .attrs({

                "x1": 0,
                "y1": function () { return band_height - i * band_height + band_height / 2; },
                "x2": -lagend_axis_length,
                "y2": function () { return band_height - i * band_height + band_height / 2; },
                "stroke": "black",
                "stroke-width": "1px"

            });

        bar.append("text")
            .text(d.toLocaleString())
            .attrs({
                "dominant-baseline": "middle",
                "class": "colorLagendText",
                "x": function () { return -lagend_axis_length - 3; },
                "y": function () { return band_height - i * band_height + band_height / 2; }
            });

        bar.on("mouseover", mouseOver);
        bar.on("click", onClick);
        bar.on("mouseout", mouseOut);
    });
}

function drawBarChart(data_type, year, list_of_countries_to_plot, selected_country, total_migration, list_of_countries_to_plot_untouched, color) {

    /*
       This function draws the bar chart and also defines all the behaviors of that barchart based on the clicked country on the map

    */

    d3.select("#bar_chart").selectAll("#heading_svg, #show_more_svg, #bar_svg").remove();
    d3.selectAll("#bar_tip").remove();

    var number_of_countries_to_visualize = 16;

    var this_lot = list_of_countries_to_plot.slice(1, number_of_countries_to_visualize);
    var next_lot = list_of_countries_to_plot.slice(1);


    var previous_item_index = list_of_countries_to_plot_untouched.length - next_lot.length

    if (list_of_countries_to_plot_untouched[previous_item_index - 2] !== undefined) {

        previous_lot = [list_of_countries_to_plot_untouched[previous_item_index - 1], ...list_of_countries_to_plot];

    } else {

        previous_lot = null;

    }

    function calculateTotal(array) {

        // This function calculates the total based on the list it takes
        var migrant_total = 0;
        array.forEach(function (row) {
            migrant_total += row[1];
        });
        return migrant_total;
    }

    if (list_of_countries_to_plot_untouched.length - 1 >= number_of_countries_to_visualize &&
        this_lot.length < number_of_countries_to_visualize - 1) {

        drawBarChart(
            data_type,
            year,
            list_of_countries_to_plot_untouched,
            selected_country,
            total_migration,
            list_of_countries_to_plot_untouched,
            color
        );

    } else {

        var margin = { top: 20, right: 0, bottom: 100, left: 100 },
            width = 600 - margin.left - margin.right,
            height = 380 - margin.top - margin.bottom;

        var bar_padding = 0.35;
        var buffer = 20;

        showHeaing();

        // append the svg object to the body of the page
        var svg = d3
            .select("#bar_chart")
            .append("svg").attrs({

                "id": "bar_svg",
                "width": width + margin.left + margin.right,
                "height": height + margin.top + margin.bottom

            })
            .append("g")
            .attrs({
                "id": "bar_group",
                "transform": "translate(" + margin.left + "," + margin.top + ")"
            });

        // Add X axis
        var x = d3
            .scaleBand()
            .range([0, width])
            .domain(
                this_lot.map(function (x) {
                    return x[0];
                })
            )
            .padding(bar_padding);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .each(modifyText);

        // Add Y axis
        var y = d3
            .scaleLinear()
            .domain([0, d3.max(this_lot.map((d) => d[1]))])
            .range([height, 0]).nice();

        svg.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll("text")
            .attr("class", "xyBarAxis");

        var bar_tip = d3
            .tip()
            .attr("class", "d3-tip-bar")
            .attr("id", "bar_tip")
            .offset([-10, 0])
            .html(function (d) {

                if (data_type == "immigration") {

                    var html = `<p style = "text-align:center;" class="tip_text">${d[0]}  &#x2708  ${selected_country[0]}<br>
                        <span style='color: ${color}; font-size: 0.9em'> ${d[1]} (${((d[1] / total_migration) * 100).toFixed(2)}%)</span></span></p>`;

                    return html;

                } else if (data_type == "emigration") {

                    var html = `<p style = "text-align:center;" class="tip_text">${selected_country[0]}  &#x2708  ${d[0]}<br>
                        <span style='color: ${color}; font-size: 0.9em'> ${d[1]} (${((d[1] / total_migration) * 100).toFixed(2)}%)</span></span></p>`;

                    return html;

                }

            });

        svg.append("g")
            .selectAll(".mybar")
            .data(this_lot)
            .enter()
            .append("rect")
            .attr("class", "mybar")
            .attr("fill", color)
            .attr("x", function (d) {
                if (x.bandwidth() <= buffer) {
                    return x(d[0]);
                } else {
                    return x(d[0]) + (x.bandwidth() - buffer) / 2;
                }
            })
            .attr("y", function (d) {
                return y(0);
            })
            .attr("width", function () {
                return Math.min(buffer, x.bandwidth());
            })
            .attr("height", function (d) {
                return height - y(0);
            })
            .call(bar_tip)
            .on("mouseover", function (destination) {
                d3.selectAll("#selection_on_bar").attr("id", null);
                bar_tip.show(destination);
                source = [];
                target = [];

                if (data_type == "emigration") {

                    source = selected_country;
                    target = destination.filter(function (d, i) { return i != 1 });

                } else if (data_type == "immigration") {

                    source = destination.filter(function (d, i) { return i != 1 });
                    target = selected_country;

                }

                drawArrow(

                    { latitude: source[3], longitude: source[2] },
                    { latitude: target[3], longitude: target[2] },
                    data_type,
                    color

                );

            })
            .on("mouseout", function (destination) {
                bar_tip.hide(destination);
                d3.select(this).attr("id", "selection_on_bar");
            })
            .transition()
            .duration(200)
            .attr("x", function (d) {
                if (x.bandwidth() <= buffer) {
                    return x(d[0]);
                } else {
                    return x(d[0]) + (x.bandwidth() - buffer) / 2;
                }
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("width", function () {
                return Math.min(buffer, x.bandwidth());
            })
            .attr("height", function (d) {
                return height - y(d[1]);
            })
            .delay(function (d, i) { return (i * 50) });

        showMoreAndPreviousButtons();


        function showHeaing() {

            var heading_height = 20;
            var heading = d3
                .select("#bar_chart")
                .append("svg")
                .attrs({

                    "id": "heading_svg",
                    "height": heading_height,
                    "width": d3.select("#bar_chart").node().getBoundingClientRect().width,
                    "transform": `translate(${0}, ${0})`

                });

            heading.append("text").attrs({

                "text-anchor": "middle",
                "dominant-baseline": "middle",
                "x": "50%",
                "y": "50%"

            }).html(function () {

                if (data_type == "emigration") {

                    var text = `<tspan class="graph_heading">These <tspan fill="${color}">${this_lot.length}</tspan> Bars are Showing Destinations\
                     of <tspan fill="${color}"> 
                    ${((calculateTotal(this_lot) / total_migration) * 100).toFixed(4)}% </tspan>
                    Emmigrants up till <tspan fill="${color}">${year}</tspan></tspan>`;

                    return text

                } else if (data_type == "immigration") {
                    var text = `<tspan class="graph_heading">These <tspan fill="${color}">${this_lot.length}</tspan> Bars are Showing Origins\
                     of <tspan fill="${color}"> 
                    ${((calculateTotal(this_lot) / total_migration) * 100).toFixed(4)}% </tspan>
                    Immigrants up till <tspan fill="${color}">${year}</tspan></tspan>`

                    return text
                }
            });
        }

        function showMoreAndPreviousButtons() {

            /* 
                This button shows the more and previous countries based on the what is showed on the bar axis 
            */

            var buttonPannelDimensions = {
                "height": 20,
                "width": 200,
                "margin": 40,
                "button_gap": 80,
                "x": 230,
                "y": 300
            };

            button_pannel = d3.select("#bar_svg").append("g").attrs({

                "id": "show_more",
                "width": buttonPannelDimensions.width,
                "height": buttonPannelDimensions.height,
                "transform": `translate( 
                    ${buttonPannelDimensions.x - buttonPannelDimensions.margin / 2}, 
                    ${buttonPannelDimensions.y + buttonPannelDimensions.margin}
                )`

            });

            button_pannel.append("text").attrs({
                "x": buttonPannelDimensions.width / 2 + buttonPannelDimensions.button_gap,
                "y": 0,
                "class": "showNextOrPrevious"
            })
                .html("Show More &#9654")
                .attr("dominant-baseline", "middle")
                .on("click", function () {
                    return drawBarChart(
                        data_type,
                        year,
                        next_lot,
                        selected_country,
                        total_migration,
                        list_of_countries_to_plot_untouched,
                        color
                    );
                });

            button_pannel.append("text").attrs({
                "x": buttonPannelDimensions.width / 2 - buttonPannelDimensions.button_gap,
                "y": 0,
                "class": "showNextOrPrevious"
            })
                .html("&#9664 Show Previous")
                .attr("dominant-baseline", "middle")
                .on("click", function () {
                    if (previous_lot !== null) {
                        return drawBarChart(data_type, year, previous_lot, selected_country, total_migration, list_of_countries_to_plot_untouched, color);
                    }
                });

        }

        function modifyText() {

            /* 
                This function modifys the text based on what is shown on the x-axis 
            */

            var cutLength = 10;
            textSelection = d3.select(this);
            textSelection.datum(textSelection.text());

            textSelection.attr("transform", "translate(-10,0)rotate(-30)")
                .style("text-anchor", "end")
                .attrs({
                    "class": "xyBarAxis",
                    "id": function (d) { return `tick_${d.replace(new RegExp(" ", "g"), "_")}` }
                });

            textSelection.text(function (d) {
                if (d.length <= cutLength) {
                    return d;
                } else { return d.slice(0, cutLength).concat('...'); }
            })

            textSelection.on("mouseover", function (d) {
                this_selection_id = d3.select(this).attr("id");
                d3.select(`#${this_selection_id}`).text(d);
            });

            textSelection.on("mouseout", modifyText);
        }
    }


}

function drawArrow(source_location, target_location, data_type, color) {

    /*
        This function draws the arrow based on the country clicked on the bar. 
    */

    var svg = d3.select("#map");
    svg.selectAll(".connector_string").remove(); // Clear canvas

    var projection = d3.select("#world_map").datum().projection;

    var source_coordinates = {
        x: projection([source_location.longitude, source_location.latitude])[0],
        y: projection([source_location.longitude, source_location.latitude])[1]
    };

    var destination_coordinates = {
        x: projection([target_location.longitude, target_location.latitude])[0],
        y: projection([target_location.longitude, target_location.latitude])[1]
    };

    // Arrow-Head Definition
    svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("class", "connector_string_arrowHead")
        .attr("viewBox", "0 -5 10 10")
        .attr('refX', 8)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    g = svg.append("g").attr("class", "connector_string")

    g.append("circle").attrs({

        "cx": source_coordinates.x,
        "cy": source_coordinates.y,
        "stroke": "white",
        "stroke-width": "0.4px",
        "r": 6,
        "fill": function () {
            if (data_type == "emigration") {
                return color;
            } else if (data_type == "immigration") {
                return "#FBC02D";
            }
        }

    });

    // Append cirlce to the group
    g.append("circle").attrs({

        "cx": destination_coordinates.x,
        "cy": destination_coordinates.y,
        "r": 0

    }).transition().duration(600)
        .attrs({
            "stroke": "white",
            "fill": function () {

                if (data_type == "emigration") {
                    return "#FBC02D";

                } else if (data_type == "immigration") {
                    return color;
                }
            },
            "stroke-width": "0.4px",
            "r": 6
        }).transition().delay(1000)
        .attr("r", 0);

    // Append path 
    g.append("path")
        .attr("id", "path_shadow")
        .attr("stroke", "black")
        .attr("d", function () {
            return "M" + source_coordinates.x + "," + source_coordinates.y + "A" + 0 + "," + 0 +
                " 0 0,1 " + source_coordinates.x + "," + source_coordinates.y;
        })
        .attr("stroke-linecap", "round")
        .transition()
        .duration(500)
        .attr("d", function () {
            var dx = destination_coordinates.x - source_coordinates.x,
                dy = destination_coordinates.y - source_coordinates.y,
                dr = Math.sqrt(dx * dx + dy * dy + 200000);
            return "M" + source_coordinates.x + "," + source_coordinates.y + "A" + dr + "," + dr +
                " 0 0,1 " + destination_coordinates.x + "," + destination_coordinates.y;
        }).delay(function (d, i) { return (800 + i * 100) });

    // Append path 
    g.append("path")
        .attr("stroke", "black")
        .attr("d", function () {
            return "M" + source_coordinates.x + "," + source_coordinates.y + "A" + 0 + "," + 0 +
                " 0 0,1 " + source_coordinates.x + "," + source_coordinates.y;
        })
        .attr("stroke-linecap", "round")
        .transition()
        .duration(500)
        .attr("d", function () {
            var dx = destination_coordinates.x - source_coordinates.x,
                dy = destination_coordinates.y - source_coordinates.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + source_coordinates.x + "," + source_coordinates.y + "A" + dr + "," + dr +
                " 0 0,1 " + destination_coordinates.x + "," + destination_coordinates.y;
        }).attr('marker-end', (d) => "url(#arrow)").delay(function (d, i) { return (800 + i * 100) });

}

function drawRingChart(data_selected, emmigrantVal, countryVal, total_val, accent_color) {
    /*
        Draw a doughnut chart based on selected data for the emmmigration data as recieved by the individual coutries
    */

    d3.select("#doughnut_zipfs").remove();

    var width = 200;
    var margin = 10;
    var thickness = 12;

    // Mouse Hover and Removal Actions

    mouseOver = function (d, i) {
        d3.select("#inner_arc_text").selectAll("text").remove();

        var number = Math.round((d.data.value * total_val) / 100);

        if (d.data.key == "a") { textcolor = accent_color } else { textcolor = "#C5C5C5" };

        d3.select("#inner_arc_text")
            .attrs({

                "class": "inner_arc_html",
                "dominant-baseline": "middle"

            })
            .append("text")
            .html(`${number}`)
            .attr("style", `fill: ${textcolor}`);

    };

    mouseLeave = function () {
        d3.select("#inner_arc_text").selectAll("text").remove();

        d3.select("#inner_arc_text").append("text")
            .attrs({

                "class": "inner_arc_html",
                "dominant-baseline": "middle"

            })
            .html(`${emmigrantVal.toFixed(2)}%`)
            .attr("style", `fill: ${accent_color}`)
    };

    var outer_radius = Math.round((width * 30) / 100) - margin;
    var inner_radius = outer_radius - thickness;

    var g = d3
        .select("#bar_svg")
        .append("g").attr("id", "doughnut_zipfs")
        .attr("transform", `translate(${500},${100})`);

    var data = { a: emmigrantVal, b: 100 - emmigrantVal };

    // set the color scale
    var color = d3.scaleOrdinal().domain(data).range([accent_color, "#eaeaea"]);

    var pie = d3
        .pie()
        .value(function (d) {
            return d.value;
        })
        .sort(function (a, b) {
            return d3.ascending(a.key, b.key);
        });

    var data_ready = pie(d3.entries(data));

    ring = g.append("g").attr("id", "ring");

    ring.append("g")
        .selectAll(".doughNutEmmigrants")
        .data(data_ready)
        .enter()
        .append("path").attrs({

            "id": function (d) { return `arc_${d.data.key}` },
            "class": "doughNutEmmigrants",
            "d": d3.arc().innerRadius(inner_radius).outerRadius(outer_radius),
            "fill": function (d, i) { return color(i); }

        })
        .on("mouseover", mouseOver)
        .on("mouseout", mouseLeave);

    ring.append("g").attr("id", "inner_arc_text")
        .append("text")
        .attrs({

            "class": "inner_arc_html",
            "dominant-baseline": "middle"

        })
        .html(`${emmigrantVal.toFixed(2)}%`)
        .attr("style", `fill: ${accent_color}`);

    g.append("g").append("text").attrs({

        "text-anchor": "middle",
        "dominant-baseline": "auto",
        "transform": `translate(${0}, ${-(outer_radius + thickness + margin)})`,

    })
        .html(function () {
            if (data_selected == "emigration") {

                return `<tspan class="small_graph_heading">Top <tspan id="highlight_text" style="fill: ${accent_color}">\
                ${countryVal.toFixed(2)}% </tspan> Destination Countries</tspan>`

            } else if (data_selected == "immigration") {
                return `<tspan class="small_graph_heading">Top <tspan id="highlight_text" style="fill: ${accent_color}">\
                ${countryVal.toFixed(2)}% </tspan> Origin Countries</tspan>`
            }
        });

}

function doughnutChartContent(year, country, gender, data_file, colourScale) {

    /* 
        Data split for the doughnut chart  and percentage calculations 
    */

    age_bracket_map = {
        "0-4": "0-14",
        "5-9": "0-14",
        "10-14": "0-14",
        "15-19": "15-29",
        "20-24": "15-29",
        "25-29": "15-29",
        "30-34": "30-44",
        "35-39": "30-44",
        "40-44": "30-44",
        "45-49": "45-59",
        "50-54": "45-59",
        "55-59": "45-59",
        "60-64": "60+",
        "65-69": "60+",
        "70-74": "60+",
        "75+": "60+"
    }

    function distinct(value, index, self) {
        return self.indexOf(value) === index;
    }

    age_dict = {}
    Object.values(age_bracket_map).filter(distinct).forEach((bracket) => { age_dict[bracket] = null });

    data_file.migrant_age[gender].forEach(function (row) {

        if (Number(row.Year) == year && row.Destination == country) {
            for (const [age_bracket, percentage] of Object.entries(row)) {
                if (age_bracket in age_bracket_map) {
                    age_dict[age_bracket_map[age_bracket]] += Number(percentage);
                }
            }
        }
    });

    drawAgeDoughnutChart(age_dict, gender, colourScale);
}

function drawAgeDoughnutChart(age_data, gender, colourScale) {

    /*
       
       This function draws the doughnut chart based on the age , gender and color scale
    */

    d3.select("#age_doughnut_svg").remove();
    var ring_chart = d3.select("#ring_chart");

    var svgDimension = {

        "width": 745, //ring_chart.node().getBoundingClientRect().width,
        "height": 408, //ring_chart.node().getBoundingClientRect().height,
        "margin": 40

    };

    // Select the doughnut chart from the canvas.
    var ageDoughnutSVG = d3.select("#ring_chart")
        .append("svg")
        .attrs({
            "id": "age_doughnut_svg",
            "height": svgDimension.height - svgDimension.margin,
            "width": svgDimension.width - svgDimension.margin
        });

    // Group all svg elements together
    var heading = ageDoughnutSVG.append("g").attrs({
        "id": "age_doughnut_heading",
        "transform": `translate(${svgDimension.width / 2}, ${svgDimension.margin})`
    })

    heading.append("text").attrs({
        "text-anchor": "middle",
        "dominant-baseline": "auto"
    }).html(function () {

        return `Age Demographics of <tspan style="fill: ${colourScale(gender)}">
                                    ${gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </tspan> Immigrants`
    });


    var arcDimensions = {
        "innerRadius": 75,
        "outerRadius": 100
    }

    arcGroup = ageDoughnutSVG.append("g").attrs({
        "id": "ageArcGroup",
        "transform": `translate(${svgDimension.width / 2}, ${svgDimension.height / 2})`
    });
    color = d3.scaleOrdinal().domain(Object.keys(age_data)).range(d3.schemeCategory10);

    var pie = d3.pie().sort(null).value(function (data) { return data.value; });
    var data_ready = pie(d3.entries(age_data));
    var arc = d3.arc().innerRadius(arcDimensions.innerRadius).outerRadius(arcDimensions.outerRadius);

    arcGroup.selectAll("allSlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arc)
        .attrs({
            "fill": function (d) { return (color(d.data.key)) },
            "id": function (d) {
                id = "elem" + d.data.key.replace(/-/g, '_').replace(new RegExp("\\+", "g"), '')
                return id
            }
        })
        .on("mouseover", function (d) { innerDoughnutHtml(arcGroup, { "key": d.data.key, "value": d.value }) })
        .on("mouseout", function () { d3.select("#inner_doughnut_html").remove() })

    drawAgeLagend(arcGroup, ageDoughnutSVG, svgDimension, age_data, color);
}

function innerDoughnutHtml(arcGroup, data) {

    /*
        Shows the percentage values in the inner doughnut 
    */

    d3.select("#inner_doughnut_html").remove(); // Clear canvas

    arcGroup.append("text").attrs({
        "id": "inner_doughnut_html",
        "dominant-baseline": "middle",
        "fill": function () { return color(data.key) }

    }).html(function () { return `${data.value.toFixed(2)}%` })
}

function drawAgeLagend(arcGroup, svg, svgDimensions, data, colourScale) {

    /* 
        This functions shows the legend values for the age doughnut.
    */

    lagendElementDimensions = { // Legend dimensions.
        "right_padding": 100,
        "top_padding": 100,
        "circle_radius": 10,
        "group_spacing": 15,
        "line_length": 7.5
    }

    // Group svg elements
    gender_lagend = svg.append("g").attrs({
        "id": "gender_lagend",
        "transform": `translate(${svgDimensions.width - svgDimensions.margin - lagendElementDimensions.top_padding}, 
            ${(svgDimensions.height - svgDimensions.margin - lagendElementDimensions.right_padding) / 2})`,
        "style": "cursor: pointer"
    });

    one_group = gender_lagend.selectAll("g")
        .data(Object.entries(data))
        .enter()
        .append("g")
        .attrs({

            "fill": function (d) { return colourScale(d[0]) },
            "stroke": function (d) { return colourScale(d[0]) },
            "id": function (d) {
                id = "elem" + d[0].replace(/-/g, '_').replace(new RegExp("\\+", "g"), '');
                return id
            }

        });

    one_group.append("circle").attrs({

        "cx": 0,
        "cy": function (d, i) { return i * (lagendElementDimensions.circle_radius + lagendElementDimensions.group_spacing) },
        "r": lagendElementDimensions.circle_radius

    });

    one_group.append("line").attrs({

        "x1": lagendElementDimensions.circle_radius,
        "y1": function (d, i) { return i * (lagendElementDimensions.circle_radius + lagendElementDimensions.group_spacing) },
        "x2": lagendElementDimensions.circle_radius + lagendElementDimensions.line_length,
        "y2": function (d, i) { return i * (lagendElementDimensions.circle_radius + lagendElementDimensions.group_spacing) },
        "stroke-width": 1.5

    });

    one_group.append("text").attrs({

        "dominant-baseline": "middle",
        "class": "genderLagendText",
        "x": lagendElementDimensions.circle_radius + lagendElementDimensions.line_length + 5,
        "y": function (d, i) { return i * (lagendElementDimensions.circle_radius + lagendElementDimensions.group_spacing) },
        "stroke": "none"

    }).text(function (d) { return d[0] });

    one_group.on("mouseover", function (d) {

        var this_id = d3.select(this).attr("id");
        d3.select(this).attr("class", "highlighted_ageGroup_lagend");
        d3.select("#ageArcGroup")
            .selectAll(`#${this_id}`)
            .attr("class", "highlighted_ageGroup_arc");

        innerDoughnutHtml(arcGroup, { "key": d[0], "value": d[1] });

    });

    one_group.on("mouseout", function () {

        d3.select(".highlighted_ageGroup_lagend").attr("class", null);
        d3.select("#ageArcGroup").selectAll(".highlighted_ageGroup_arc").attr("class", null);
        d3.select("#inner_doughnut_html").remove();

    });
}

function noDataAvailable(country) {

    /* 
        This function is called when we do not have any data about a country.
    */

    d3.select("#map").selectAll("path").attr("class", "countries");
    d3.select("#stacked_bar_chart").selectAll("svg").remove();
    d3.select(".connector_string").remove();
    d3.select("#lagend").remove();
    d3.select("#bottom_row").selectAll("div").remove();
    d3.select("#bottom_row")
        .append("div")
        .attr("id", "no_data")
        .append("text")
        .html(
            `<pre><strong>Sorry!!</strong>  No Data Available for <strong>${country}</strong></pre>`
        ); // Show message that no data is available.
}

window.onload = function () {
    drawHeadingAreaWithButton();
    drawBodyArea();
};