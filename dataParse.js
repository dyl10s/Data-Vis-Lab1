var loadedData = {};

var startYear = 2000;
var endYear = 2019;

var startMonth = 1;
var endMonth = 12;

var chartOne = null;

window.onresize = function() {
    LoadCharts();
}

d3.csv("https://www.fdic.gov/bank/individual/failed/banklist.csv", csvLoadDone);

function csvLoadDone(data) {
    loadedData = data;
    LoadCharts();
}

function LoadCharts() {
    console.log("loading chart");
    var uniqueStates = [];
    var stateCounts = [];

    for (var i = 0; i < loadedData.length; i++) {

        //Check to make sure this entry follows out filters
        var curDate = loadedData[i]["Closing Date"].split("-")[1] + " " + loadedData[i]["Closing Date"].split("-")[0].toString() + ", 20" + loadedData[i]["Closing Date"].split("-")[2].toString();
        curDate = new Date(curDate);
        if (
            curDate.getFullYear() >= startYear &&
            curDate.getFullYear() <= endYear &&
            curDate.getMonth() + 1 >= startMonth &&
            curDate.getMonth() + 1 <= endMonth
        ) {
            if (loadedData[i].ST != "PR") {
                if (!uniqueStates.includes(loadedData[i].ST)) {
                    uniqueStates.push(loadedData[i].ST)
                    stateCounts.push(1);
                } else {
                    stateCounts[uniqueStates.indexOf(loadedData[i].ST)] += 1;
                }
            }
        }
    }

    Chart.defaults.global.defaultFontColor = 'white';

    if (chartOne) {
        chartOne.data.labels = uniqueStates.map(function(f) { return abbrState(f, 'name') });
        chartOne.data.datasets[0].data = stateCounts;
        chartOne.update();
    } else {
        //Generate the chart
        chartOne = new Chart('failedBankTime', {
            type: 'bar',
            data: {
                labels: uniqueStates.map(function(f) { return abbrState(f, 'name') }),
                datasets: [{
                    label: "Amount of Failed Banks",
                    data: stateCounts,
                    backgroundColor: 'rgb(255, 0, 0)',
                    borderColor: 'rgb(0, 0, 0)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: false,
                            maxRotation: 50,
                            minRotation: 50
                        }
                    }]
                }
            }
        });
    }

    //We are going to make our chart go from blue to red
    var maxValue = Math.max.apply(Math, stateCounts);
    var stateStyles = {};
    uniqueStates.map(function(x) {
        stateStyles[x] = { fill: 'rgb(' + (stateCounts[uniqueStates.indexOf(x)] / maxValue) * 255 + ', 0, 0)' };
        return 0;
    });

    $('#chartTwo').remove();
    $('#chartTwoBox').append("<div id='chartTwo'></div>");

    //Generate State Map
    $('#chartTwo').usmap({
        stateStyles: { fill: 'black' },
        stateHoverStyles: { fill: 'black' },
        stateHoverAnimation: 0,
        showLabels: false,
        stateSpecificStyles: stateStyles,
        stateSpecificHoverStyles: stateStyles
    });
}

function startYearChanged() {
    startYear = $('#startYear').val();
    $('#startYearText').text('Start Year (' + startYear + ')');
    LoadCharts();
}

function endYearChanged() {
    endYear = $('#endYear').val();
    $('#endYearText').text('End Year (' + endYear + ')');
    LoadCharts();
}

function startMonthChanged() {
    startMonth = $('#startMonth').val();
    $('#startMonthText').text('Start Month (' + startMonth + ')');
    LoadCharts();
}

function endMonthChanged() {
    endMonth = $('#endMonth').val();
    $('#endMonthText').text('End Month (' + endMonth + ')');
    LoadCharts();
}

//Helper code pulled from github https://gist.github.com/calebgrove/c285a9510948b633aa47
//I just dont want to type all the states
function abbrState(input, to) {

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < states.length; i++) {
            if (states[i][0] == input) {
                return (states[i][1]);
            }
        }
    } else if (to == 'name') {
        input = input.toUpperCase();
        for (i = 0; i < states.length; i++) {
            if (states[i][1] == input) {
                return (states[i][0]);
            }
        }
    }
}