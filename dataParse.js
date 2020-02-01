var loadedData = {};
var startYear = 2000;
var endYear = 2019;
var chartOne = null;

d3.csv("banklist.csv", csvLoadDone);

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
        if (
            2000 + parseInt(loadedData[i]["Closing Date"].split("-")[2]) >= startYear &&
            2000 + parseInt(loadedData[i]["Closing Date"].split("-")[2]) <= endYear
        ) {


            if (!uniqueStates.includes(loadedData[i].ST)) {
                uniqueStates.push(loadedData[i].ST)
                stateCounts.push(1);
            } else {
                stateCounts[uniqueStates.indexOf(loadedData[i].ST)] += 1;
            }

        }
    }

    if (chartOne) {
        chartOne.data.labels = uniqueStates;
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
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
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