const sliceOffset = 4;
var charts = document.querySelectorAll('*[id^="chart-"]');
for (i = 0; i < charts.length; ++i) {
    const chart_data = JSON.parse(charts[i].dataset.datasets);
    const chart_settings = JSON.parse(charts[i].dataset.config);
    const chartType = charts[i].dataset.chartType;

    let labels = chart_data[0].slice(sliceOffset, chart_data[0].length);
    const datasets_raw = chart_data.slice(1, chart_data.length);
    const datasets = [];
    
    let rightAxisEnabled = false;
    for (let i=0; i < datasets_raw.length; i++) {
      if (datasets_raw[i][3] === "right") {
        rightAxisEnabled = true;
        break;
      }
    }

    if (['bar', 'line', 'area', 'radar', 'polarArea'].includes(chartType)) {

        for (j=0; j < datasets_raw.length; j++){
            const ds = datasets_raw[j];
            let dataset = {
                label: ds[0],
                data: ds.slice(sliceOffset, ds.length),
                borderColor: ds[2],
            }
            if (['bar', 'line', 'area',].includes(chartType)) {
                dataset.backgroundColor = ds[2]
                dataset.type = ds[1].toLowerCase()
            }
            if (rightAxisEnabled) {
                if (ds[3] === 'right') {
                    dataset.yAxisID = 'y1'
                } else {
                    dataset.yAxisID = 'y'
                }
            }
            datasets.push(dataset)
        }
    }

    if (['pie', 'doughnut',].includes(chartType)) {
        labels = []
        let colors = []
        let _datasets = []
        
        for (j=0; j < datasets_raw.length; j++){
            const ds = datasets_raw[j];
            labels.push(ds[0])
            colors.push(ds[2])
            
            for (k=sliceOffset; k < ds.length; k++){
                _datasets.push(datasets_raw[j][k])
   
            }

        }

        datasets.push({
            borderColor: colors,
            backgroundColor: colors,
            data: _datasets
        })
    }

    let options = {
        responsive: true,
        scales: {
            x: {
                display: true,
            },
            y: {
                beginAtZero: true,
                type: 'linear',
                display: true,
                position: 'left'
            },
            y1: {
                beginAtZero: true,
                type: 'linear',
                display: false,
                position: 'right'
            },
        },
        plugins: {
            legend: {
                position: chart_settings['legend_position'],
                display: chart_settings['show_legend']
            }
        }
    }
    if (rightAxisEnabled) {
        options.scales.y1.display = true;
    }

    if (chart_settings['x_label'] !== '') {
        options.scales.x.title = {
            display: true, 
            text: chart_settings['x_label']
        }
    }

    if (chart_settings['y_left_min'] !== '') {
        options.scales.y.min = parseFloat(chart_settings['y_left_min'])
    }
    if (chart_settings['y_left_max'] !== '') {
        options.scales.y.max = parseFloat(chart_settings['y_left_max'])
    }
    if (chart_settings['y_left_step_size'] !== '') {
        options.scales.y.ticks = {
            stepSize: parseFloat(chart_settings['y_left_step_size'])
        }
    }
    if (chart_settings['y_left_label'] !== '') {
        options.scales.y.title = {
            display: true, 
            text: chart_settings['y_left_label']
        }
    }

    if (rightAxisEnabled) {

        if (chart_settings['y_right_min'] !== '') {
            options.scales.y1.min = parseFloat(chart_settings['y_right_min'])
        }
        if (chart_settings['y_right_max'] !== '') {
            options.scales.y1.max = parseFloat(chart_settings['y_right_max'])
        }
        if (chart_settings['y_right_step_size'] !== '') {
            options.scales.y1.ticks = {
                stepSize: parseFloat(chart_settings['y_right_step_size'])
            }
        }
        if (chart_settings['y_right_label'] !== '') {
            options.scales.y1.title = {
                display: true, 
                text: chart_settings['y_right_label']
            }
        }
    }

    if (chart_settings['stacking'] === 'stacked') {
        options.scales.x.stacked = true
        options.scales.y.stacked = true
    }
    if (chart_settings['stacking'] === 'stacked_100') {
        options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false }
    }

    let chartOptions = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        }
    }

    if (['pie', 'doughnut', 'polarArea', 'radar'].includes(chartType)) {
        chartOptions.type = chartType;
        options.scales = undefined
    }

    chartOptions.options = options
    
    let myChart = new Chart(charts[i].getContext('2d'), chartOptions);
}