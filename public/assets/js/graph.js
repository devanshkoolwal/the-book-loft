
Highcharts.chart('container', {

    title: false,
    subtitle:false,
    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%b %e}'
        }
    },
    tooltip: {
        xDateFormat: '%d %b %Y',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>₹{point.y}</b><br/>'
    },
    plotOptions: {
        series: {
            fillOpacity: 0.15,
            marker: {
                enabled: false
            }
        }
    },
    yAxis: {
        title: {
            text: false
        },
        labels: {
            format: '₹{value}'
        }
    },

    series: [{
        name: 'Amazon Price',
        data: amazondata.data
    },
    {
        name: 'Flipkart Price',
        data: flipkartdata.data
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});