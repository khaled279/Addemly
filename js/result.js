let script = document.createElement('script');
script.src = 'https://www.gstatic.com/charts/loader.js'; 
script.addEventListener('load', function() {
    google.charts.load('current', {'packages':['corechart']});
    console.log("loaded");
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {

      let data = new google.visualization.DataTable();
      data.addColumn('string', 'Word Type');
      data.addColumn('number', 'Percent');
      data.addRows([
        ['Words', 3],
        ['Filler words', 1]
      ]);

   
      let options = {'title':'Filler Words to Non filler Words Ratio',
                     'width':400,
                     'height':300};

      let chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
    drawChart();
});
document.querySelector("body").appendChild(script); 