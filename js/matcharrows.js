var radius = 30, padding = 4, cols = 16;
var playerData, matchData, remaining = 2;
var NodePosition = {};
var completeData, SelectYear = "2004";
var winnerFinal;
var menu = [
  {id: '2004', name: '2004'},
  {id: '2005', name: '2005'},
  {id: '2006', name: '2006'},
  {id: '2007', name: '2007'},
  {id: '2008', name: '2008'},
  {id: '2009', name: '2009'},
  {id: '2010', name: '2010'},
  {id: '2011', name: '2011'},
  {id: '2012', name: '2012'},
  {id: '2013', name: '2013'},
  {id: '2014', name: '2014'}
];

function translateSVG(x, y) {
  return 'translate('+x+','+y+')';
}

function arcSVG(mx0, my0, rx, ry, xrot, larc, sweep, mx1, my1) {
  return 'M'+mx0+','+my0+' A'+rx+','+ry+' '+xrot+' '+larc+','+sweep+' '+mx1+','+my1;
}

function surname(d) {
  return d.name.split(' ')[1];
}

function fullname(d) {
  var s = d.name.split(' ');
  return s.length === 3 ? s[2] + ' ' + s[0] + ' ' + s[1] : s[0] + ' ' + s[1];
}

function nameId(n) {
  return n.replace(/[\., ]/g, '');
}

function getArrow() {
  matchData = _.map(matchData, function(v) {
    var wX = NodePosition[v.winner].x;
    var wY = NodePosition[v.winner].y;
    var lX = NodePosition[v.loser].x;
    var lY = NodePosition[v.loser].y;

    var alpha = Math.atan2(lY - wY, lX - wX);

    wX += radius * Math.cos(alpha);
    wY += radius * Math.sin(alpha);

    lX -= (radius + 2) * Math.cos(alpha);
    lY -= (radius + 2) * Math.sin(alpha);

    v.loserX = lX;
    v.loserY = lY;
    v.winnerX = wX;
    v.winnerY = wY;

    return v;
  });
}

function playerOver(d) {
  var m = _.filter(matchData, function(v) {return v.loser === d.name || v.winner === d.name;});
  
  var topMatches = d3.select('#chart svg g.top-matches')
    .selectAll('path')
    .data(m);
    d3.select('#beats').html("");
	
	for(var i=0;i<m.length;i++){
		d3.select('#beats').append('g').html("Round:"+m[i].round+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "+m[i].winner + "&nbsp;&nbsp;beats " + m[i].loser +"&nbsp;&nbsp;<br>Result: &nbsp;&nbsp;"+m[i].results+ "<br><br><br>");
		
	}
	
  topMatches.enter()
    .append('path')
    .classed('edge', true);

  topMatches.exit()
    .remove();

  topMatches
    .attr('d', function(d, i) {
      return arcSVG(d.winnerX, d.winnerY, 800, 800, 0, 0, 1, d.loserX, d.loserY);
    })
    .attr('marker-end', 'url(#Triangle)');

  d3.select('.players').selectAll('circle').style('fill', '#1067a0');
  d3.select(this).style('fill', '#69dbe5');

}

function makeChart() {
  var matches = d3.select('#chart svg')
    .append('g')
    .classed('matches', true);

  var players = d3.select('#chart svg')
    .append('g')
    .classed('players', true)
    .attr('transform', translateSVG(radius + padding, radius + padding))
    .selectAll('g')
    .data(playerData)
    .enter()
    .append('g')
    .sort(function(a, b) {return d3.ascending(a.name, b.name);})
    .attr('id', function(d) {return 'player-'+nameId(d.name);})
    .classed('player', true)
    .attr('transform', function(d, i) {
      var row = Math.floor(i / cols), col = i % cols;
      var x = 2 * col * (radius + padding), y = 2 * row * (radius + padding);
      NodePosition[d.name] = {x: x, y: y};
      return translateSVG(x, y);
    });

  getArrow();

  players
    .append('circle')
    .attr('r', radius)
    .on('mouseover', playerOver);

  players
    .append('text')
    .text(function(d) {return fullname(d).slice(0, 10);})
    .classed('name', true)
    .attr('y', '0.2em');

  var topMatches = d3.select('#chart svg')
    .append('g')
    .attr('transform', translateSVG(radius + padding, radius + padding))
    .classed('top-matches', true);

  matches.attr('transform', translateSVG(radius + padding, radius + padding))
    .selectAll('line')
    .data(matchData)
    .enter()
    .append('line')
    .attr('x1', function(d, i) {return d.winnerX;})
    .attr('y1', function(d, i) {return d.winnerY;})
    .attr('x2', function(d, i) {return d.loserX;})
    .attr('y2', function(d, i) {return d.loserY;})
    .attr('marker-end', 'url(#Triangle)')
    .style('opacity', 0.1);
	d3.select('#winners').html("Winner: "+winnerFinal+"<br>");

  d3.select('#menu')
    .selectAll('div')
    .data(menu)
    .enter()
    .append('div')
    .text(function(d) {return d.name;})
    .classed('selected', function(d, i) {return i==0;})
    .on('click', clickMenu);
	
	
}

function clickMenu(d) {
  if(SelectYear === d.id)
    return;

  d3.select('#menu').selectAll('div').classed('selected', false);
  d3.select(this).classed('selected', true);

  SelectYear = d.id;
  
  updateChart();
}

function updateChart() {
  d3.select('#chart')
    .selectAll('g')
    .remove();

  d3.select('#chart')
    .selectAll('line')
    .remove();

  d3.select('#chart')
    .selectAll('div')
    .remove();

  CreateJson();
}

function CreateJson() {
  playerData = [];
  matchData = [];
  var i = 0;

  completeData.forEach(function(d) {
    if(d.year == SelectYear) {
      if(d.round == "First"){
        playerData.push({name: d.player1});
        playerData.push({name: d.player2});
      }
	  if(d.round=="Final"){
		  winnerFinal=d.player1;
	  }
      matchData.push({winner: d.player1, loser: d.player2, results: d.results, round:d.round});
    };
  });
  makeChart();
}

d3.csv('data/10yearAUSOpenMatches.csv', function(err, data) {
  completeData = data;
  CreateJson();
});

