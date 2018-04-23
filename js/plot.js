var playerStat, matchData;


function makeChart() {
	var dataValues = [];
	playerStat.forEach(function(d){
		dataValues.push({name:d[0], data:[[parseInt(d[1]), parseInt(d[2])]]})
	});
	Highcharts.chart('chart', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: ''
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Year'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Totals Points'
        }
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        x: 0,
        y: 0,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
        borderWidth: 1
    },
    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: 'Total Points: {point.y} <br> Year: {point.x}'
            }
        }
    },
    series: dataValues
});


  d3.select('#menu')
    .selectAll('div')
    .data(menu)
    .enter()
    .append('div')
    .text(function(d) {return d.name;})
    .classed('selected', function(d, i) {return i==0;})
    .on('click', menuClick);
	
	
}

function createJSON() {
  playerStat = [];

  matchData.forEach(function(d) {
      if(d.round == "Final"){
        playerStat.push([d.player1, d.year, d.total1]);
      }
    });
  makeChart();
}



d3.csv('data/10yearAUSOpenMatches.csv', function(err, data) {
  matchData = data;
  createJSON();
});