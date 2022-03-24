var charts = document.querySelectorAll('*[id^="chart-"]');
for (i = 0; i < charts.length; ++i) {
    const chart_data = JSON.parse(charts[i].dataset.datasets);
    const chart_settings = JSON.parse(charts[i].dataset.config);

    const labels = chart_data[0].slice(3, chart_data[0].length);
    const datasets_raw = chart_data.slice(1,chart_data.length);
    const datasets = [];

    for (j=0; j < datasets_raw.length; ++j){
        const ds = datasets_raw[j];
        datasets.push({
            label: ds[0],
            data: ds.slice(3, ds.length),
            borderColor: ds[2],
            backgroundColor: ds[2],
            type: ds[1].toLowerCase()
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
            }
            // y1: {
            //     beginAtZero: true,
            //     type: 'linear',
            //     display: false,
            //     position: 'right'
            // },
        },
        plugins: {
            legend: {
                position: chart_settings['legend_position'],
                display: chart_settings['show_legend']
            }
        }
    }

    /*
    // legend_position: "top"
    // show_legend: false
    stacking: "none"
    x_label: ""
    y_left_label: ""
    // y_left_max: ""
    // y_left_min: "-1"
    // y_left_step_size: ""
    y_right_label: ""
    y_right_max: ""
    y_right_min: ""
    y_right_step_size: ""
    */

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

    if (chart_settings['stacking'] === 'stacked') {
        options.scales.x.stacked = true
        options.scales.y.stacked = true
    }
    if (chart_settings['stacking'] === 'stacked_100') {
        options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false }
    }

    const myChart = new Chart(charts[i].getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: options
    });
}