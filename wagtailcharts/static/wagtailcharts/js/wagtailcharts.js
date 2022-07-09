var formatValue = function (val, precision=1) {
    if (("" + val).indexOf("%") >= 0) {
        return val;
    }
    return accounting.formatNumber(val, [precision = precision], [thousand = "."], [decimal = ","])
}
  
var percentageFormatter = function (val, precision=1) {
    return formatValue(val, precision) + "%"
}

var isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

var mergeDeep = function (target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
  
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  
    return mergeDeep(target, ...sources);
}

var charts = document.querySelectorAll('*[id^="chart-"]');
for (i = 0; i < charts.length; ++i) {
    const chart_data = JSON.parse(charts[i].dataset.datasets).data;
    const chart_options =  JSON.parse(charts[i].dataset.datasets).options;
    const chart_settings = JSON.parse(charts[i].dataset.config);
    const chartType = charts[i].dataset.chartType;
    const chartObj = chart_types[chartType];
    let datasets = chartObj.render_datasets(chart_data, chart_options);
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
                grid: {
                    lineWidth: 0,
                },
                title: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                display: true,
                position: 'left',
                ticks: {
                    callback: function(value) {
                        return formatValue(value, chart_settings['y_left_precision'])
                    }
                },
                grid: {},
                title: {
                    display: false
                }
            },
            y1: {
                beginAtZero: true,
                display: false,
                position: 'right',
                ticks: {
                    callback: function(value) {
                        return formatValue(value, chart_settings['y_right_precision'])
                    }
                },
                grid: {},
                title: {
                    display: false
                }
            },
        },
        plugins: {
            legend: {
                position: chart_settings['legend_position'],
                display: chart_settings['show_legend']
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';

                        if (label) {
                            label += ': ';
                        }
                        data = context.dataset.data[context.dataIndex]
                        if(data.length == 2){
                            label += formatValue((parseFloat(data[1])*1000-parseFloat(data[0])*1000)/1000, chart_settings['precision'])
                        }else{
                            label += formatValue(context.dataset.data[context.dataIndex], chart_settings['precision'])
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                formatter: function(value) {
                    if(value.length == 2){
                        return formatValue((parseFloat(value[1])*1000-parseFloat(value[0])*1000)/1000, chart_settings['precision'])
                    }else{
                        return formatValue(value, chart_settings['precision'])
                    }
                },
            }
        },
    }

    if (chart_settings['y_left_min'] !== '') {
        options.scales.y.min = parseFloat(chart_settings['y_left_min'])
    }
    if (chart_settings['y_left_max'] !== '') {
        options.scales.y.max = parseFloat(chart_settings['y_left_max'])
    }
    if (chart_settings['y_left_step_size'] !== '') {
        options.scales.y.ticks.stepSize = parseFloat(chart_settings['y_left_step_size'])
    }
    if (chart_settings['y_left_label'] !== '') {
        options.scales.y.title.display = true;
        options.scales.y.title.text = chart_settings['y_left_label'];
    }
    if (chart_settings['y_left_data_type'] === "percentage") {
        options.scales.y.ticks.callback=function(value) {
            return percentageFormatter(value, chart_settings['y_left_precision'])
        };
        options.plugins.tooltip.callbacks.label = function(context) {
            let label = context.label || '';

            if (label) {
                label += ': ';
            }
            data = context.dataset.data[context.dataIndex]
            if(data.length == 2){
                label += percentageFormatter((parseFloat(data[1])*1000-parseFloat(data[0])*1000)/1000, chart_settings['precision'])
            }else{
                label += percentageFormatter(context.dataset.data[context.dataIndex], chart_settings['precision'])
            }
            return label;
        }
        if (chart_settings['show_values_on_chart']){
            options.plugins.datalabels.formatter = function(value) {
                return percentageFormatter(value, chart_settings['precision'])
            }
        }
    }

    if (chart_settings['y_left_show'] === false){
        options.scales.y.grid.lineWidth = function(context){ return context.tick && context.tick.value == 0 ? 1 : 0 }
        options.scales.y.grid.drawBorder = false;
        options.scales.y.ticks.display = false;
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
            options.scales.y1.ticks.stepSize = parseFloat(chart_settings['y_right_step_size']);
        }
        if (chart_settings['y_right_label'] !== '') {
            options.scales.y1.title.display = true; 
            options.scales.y1.title.text = chart_settings['y_right_label'];
        }
    
        if (chart_settings['y_right_data_type'] === "percentage") {
            options.scales.y1.ticks.callback=function(value) {
                return percentageFormatter(value, chart_settings['y_right_precision'])
            };

            options.plugins.tooltip.callbacks.label=function(context) { 
                let label = context.dataset.label || '';

                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += percentageFormatter(context.parsed.y, chart_settings['precision']);
                }
                return label;
            }
        }

        if (chart_settings['y_right_show'] === false){
            options.scales.y1.grid.lineWidth = function(context){ return context.tick && context.tick.value == 0 ? 1 : 0 }
            options.scales.y1.grid.drawBorder = false;
            options.scales.y1.ticks.display = false;
        }
    }

    if (chart_settings['x_label'] !== '') {
        options.scales.x.title.display = true;
        options.scales.x.title.text = chart_settings['x_label'];
    }

    if (chart_settings['stacking'] === 'stacked') {
        options.scales.x.stacked = true
        options.scales.y.stacked = true
        options.plugins.legend.reverse = true;
        datasets = datasets.reverse();
    }
    if (chart_settings['stacking'] === 'stacked_100') {
        options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false }
        options.plugins.legend.reverse = true;
        datasets = datasets.reverse();
    }

    if (chart_settings['show_grid'] === false){
        options.scales.x.grid.display = false;
        options.scales.y.grid.lineWidth = function(context){ return context.tick && context.tick.value == 0 ? 1 : 0 }
        options.scales.y1.grid.lineWidth = function(context){ return context.tick && context.tick.value == 0 ? 1 : 0 }
    }

    let chartOptions = {
        type: chart_types[chartType].chartjs_chart_type,
        data: {
            labels: labels,
            datasets: datasets
        },
    }
    
    if (chart_settings['show_values_on_chart']){
        chartOptions.plugins = [ChartDataLabels]
    }

    if (chartType == 'bar_horizontal'){
        b = options.scales.y;
        options.scales.y = options.scales.x;
        options.scales.x = b;
    }
    
    chartOptions.options = mergeDeep(options, chart_types[chartType].chart_options)

    console.log(chartOptions)
    
    let myChart = new Chart(charts[i].getContext('2d'), chartOptions);
}