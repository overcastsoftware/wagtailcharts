var charts = document.querySelectorAll('*[id^="chart-"]');
for (i = 0; i < charts.length; ++i) {
    const chart_data = JSON.parse(charts[i].dataset.datasets).data;
    const chart_options =  JSON.parse(charts[i].dataset.datasets).options;
    const chart_settings = JSON.parse(charts[i].dataset.config);
    const chartType = charts[i].dataset.chartType;  
    const chartObj = chart_types[chartType];
    const datasets = chartObj.render_datasets(chart_data, chart_options);
    const labels = chartObj.render_labels(chart_data, chart_options);
    
    // Check if we need a right axis
    let rightAxisEnabled = false;
    if (Object.keys(chart_options).includes('yaxis') && chart_options.yaxis.includes("right")) {
        rightAxisEnabled = true;
    }

    let options = {
        responsive: true,
        scales: {
            x: {
                display: true,
            },
            y: {
                beginAtZero: true,
                display: true,
                position: 'left'
            },
            y1: {
                beginAtZero: true,
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
        options.scales.y1.display = true;

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
        type: chart_types[chartType].chartjs_chart_type,
        data: {
            labels: labels,
            datasets: datasets
        }
    }

    chartOptions.options = {...options, ...chart_types[chartType].chart_options}
    
    let myChart = new Chart(charts[i].getContext('2d'), chartOptions);
}