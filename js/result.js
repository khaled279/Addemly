let script = document.createElement('script');
script.src = 'https://www.gstatic.com/charts/loader.js'; 
script.addEventListener('load', function() {
    google.charts.load('current', {'packages':['corechart']});
    console.log("loaded");
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

      // Create the data table.
      let data = new google.visualization.DataTable();
      data.addColumn('string', 'Word Type');
      data.addColumn('number', 'Percent');
      data.addRows([
        ['Words', 3],
        ['Filler words', 1]
      ]);

      // Set chart options
      let options = {'title':'Filler Words to Non filler Words Ratio',
                     'width':400,
                     'height':300};

      // Instantiate and draw our chart, passing in some options.
      let chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
    drawChart();
});
document.querySelector("body").appendChild(script); 