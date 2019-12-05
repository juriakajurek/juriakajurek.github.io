var Chart = require("chart.js");

var ctx = document.getElementById("chart").getContext("2d");
var myChart = new Chart(ctx, {
    type: "bar",
    data: {
        open: [],
        close: [],
        high: [],
        low: [],
        labels: [],

        datasets: [
            {
                label: "open",
                data: [],
                order: 2,
                backgroundColor: [],
                borderWidth: 1
            },
            {
                label: "close",
                data: [],
                order: 1,
                backgroundColor: "rgba(0, 0, 0, 0)"
            },
            {
                label: "high",
                data: [],
                order: 3,
                backgroundColor: "rgba(0, 0, 0, .8)",
                barPercentage: 0.15
            },
            {
                label: "low",
                data: [],
                order: 1,
                backgroundColor: "rgba(0, 0, 0, .8)",
                barPercentage: 0.15
            }
        ]
    },
    options: {
        scales: {
            xAxes: [
                {
                    stacked: true
                }
            ],
            yAxes: [
                {
                    stacked: true,
                    ticks: {
                        beginAtZero: false,
                        min: 0
                    }
                }
            ]
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false,
            custom: function(tooltipModel) {
                // Tooltip Element
                var tooltipEl = document.getElementById("chartjs-tooltip");

                // Create element on first render
                if (!tooltipEl) {
                    tooltipEl = document.createElement("div");
                    tooltipEl.id = "chartjs-tooltip";
                    tooltipEl.style.background = "rgba(0,0,0,.55)";
                    tooltipEl.style.color = "rgb(255,255,255)";
                    tooltipEl.style.borderRadius = "5px";
                    tooltipEl.style.border = "1px solid black";
                    tooltipEl.innerHTML = "<table></table>";
                    document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }

                // Set caret Position
                tooltipEl.classList.remove("above", "below", "no-transform");
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add("no-transform");
                }

                function getBody(bodyItem) {
                    return bodyItem.lines;
                }

                // Set Text
                if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var bodyLines = tooltipModel.body.map(getBody);
                    var innerHtml = "<thead>";
                    titleLines.forEach(function(title, i) {
                        innerHtml += "<tr><th>" + title + "</th></tr>"; //nagłowek labela
                        innerHtml += "</thead><tbody>";
                        innerHtml +=
                            "<tr><td>" + "open: " + myChart.data.open[tooltipModel.dataPoints[0].index] + "</td></tr>";
                        innerHtml +=
                            "<tr><td>" + "close: " + myChart.data.close[tooltipModel.dataPoints[0].index] + "</td></tr>";
                        innerHtml +=
                            "<tr><td>" + "higher: " + myChart.data.high[tooltipModel.dataPoints[0].index] + "</td></tr>";
                        innerHtml +=
                            "<tr><td>" + "lower: " + myChart.data.low[tooltipModel.dataPoints[0].index] + "</td></tr>";
                    });

                    innerHtml += "</tbody>";
                    var tableRoot = tooltipEl.querySelector("table");
                    tableRoot.innerHTML = innerHtml;
                }

                // `this` will be the overall tooltip
                var position = this._chart.canvas.getBoundingClientRect();

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = "absolute";
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + "px";
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + "px";
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + "px";
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                tooltipEl.style.padding = tooltipModel.yPadding + "px " + tooltipModel.xPadding + "px";
                tooltipEl.style.pointerEvents = "none";
            }
        }
    }
});

function generateLabels(date1, date2) {
    let labels = [];

    if (!Number.isInteger(date1) || !Number.isInteger(date2)) {
        console.error(new Error("Invalid date format"));
        return;
    }

    for (let i = date1; i <= date2; i += 86400000) {
        let day = new Date(new Date(i).toISOString()).getDate();
        let month = new Date(new Date(i).toISOString()).getMonth();
        labels.push(day + "." + (month + 1));
    }
    return labels;
}

function updateChart(obj) {

    //ustawienie początku rysowania osi Y od zaokrąglonego najmniejszego kursu
    let temp =  Math.floor(Math.min(...obj.low));
    if(temp > 1000) myChart.options.scales.yAxes[0].ticks.min = Math.floor(Math.min(...obj.low) / 1000) * 1000;
    if(temp > 100 && temp < 1000) myChart.options.scales.yAxes[0].ticks.min = Math.floor(Math.min(...obj.low) / 100) * 100;
    if(temp > 10 && temp < 100) myChart.options.scales.yAxes[0].ticks.min = Math.floor(Math.min(...obj.low) / 10) * 10;
    if(temp < 10) myChart.options.scales.yAxes[0].ticks.min = Math.floor(Math.min(...obj.low));

    myChart.data.open = Array.from(obj.open);
    myChart.data.datasets[1].data = Array.from(obj.close);
    myChart.data.close = Array.from(obj.close);
    myChart.data.high = Array.from(obj.high);
    myChart.data.low = Array.from(obj.low);
    myChart.data.datasets[0].backgroundColor = [];

    myChart.data.labels = obj.labels;

    obj.open.forEach((element, index) => {
        //generowanie danych przez obliczanie roznicy otwarcia/zamknięcia
        var odds = obj.close[index] - obj.open[index];

        if (odds < 0) {
            //kurs otwarcia > kurs zamknięcia //czerw
            myChart.data.datasets[0].data.push(Math.abs(odds));
            myChart.data.datasets[2].data.push(obj.high[index] - obj.open[index]);
            myChart.data.datasets[3].data.push(obj.close[index] - obj.low[index]);
            myChart.data.datasets[1].data[index] -= myChart.data.datasets[3].data[index];
        } else {
            //kurs otwarcia < kurs zamknięcia //ziel
            myChart.data.datasets[0].data.push(Math.abs(odds));
            myChart.data.datasets[1].data[index] -= Math.abs(odds);
            myChart.data.datasets[2].data.push(obj.high[index] - obj.close[index]);
            myChart.data.datasets[3].data.push(obj.open[index] - obj.low[index]);
            myChart.data.datasets[1].data[index] -= myChart.data.datasets[3].data[index];
        }

        if (odds < 0) {
            //kurs otwarcia > kurs zamknięcia ? ustaw kolor czerwony
            myChart.data.datasets[0].backgroundColor.push("rgba(191, 33, 47, 0.95)");
        } else {
            //kurs otwarcia < kurs zamknięcia ? ustaw kolor zielony
            myChart.data.datasets[0].backgroundColor.push("rgba(0, 111, 60, 0.95)");
        }
    });
    myChart.update();
}


// let object = {
//     open: [3693, 3825, 3890, 3785, 3822, 3795, 4040],
//     close: [3823, 3885, 3787, 3817, 3791, 4040, 4005],
//     high: [3845, 3918, 3893, 3850, 3887, 4090, 4070],
//     low: [3629, 3770, 3760, 3732, 3780, 3753, 3964],
//     labels: ["1.01", "2.01", "3.01", "4.01", "5.01", "6.01", "7.01"]
// };

// updateChart(object);


export default myChart;
export {generateLabels};
export {updateChart};