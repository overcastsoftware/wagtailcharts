var formatValue = function (val, precision = 1, override) {
    if (("" + val).indexOf("%") >= 0) {
        return val;
    }

    // We look for the locale in the window object, which must be set before the `render_charts` template tag is called.
    // If it is not present, it will be undefined and the browser's default locale will be used.
    let locale = window.WAGTAILCHARTS_LOCALE;

    number = Intl.NumberFormat(locale, {maximumFractionDigits: precision}).format(val)

    if(override !== undefined && override !== "" && override !== null){
        return number + " " + override;
    } else {
        return number;
    }
}
  
var percentageFormatter = function (val, precision = 1, override) {
    number = formatValue(val, precision) 
    if(override !== undefined && override !== "" && override !== null){
        return number + " " + override;
    } else {
        return number + "%";
    }
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


const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector('ul');

    if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'row';
        listContainer.style.margin = 0;
        listContainer.style.padding = 0;

        legendContainer.appendChild(listContainer);
    }

    return listContainer;
};

const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
            ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach(item => {
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';
            li.style.marginLeft = '10px';

            li.onclick = () => {
                const { type } = chart.config;
                if (type === 'pie' || type === 'doughnut') {
                    // Pie and doughnut charts only have a single dataset and visibility is per item
                    chart.toggleDataVisibility(item.index);
                } else {
                    chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                }
                chart.update();
            };

            // Color box
            const boxSpan = document.createElement('span');
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.borderColor = item.strokeStyle;
            boxSpan.style.borderWidth = item.lineWidth + 'px';
            boxSpan.style.display = 'inline-block';
            boxSpan.style.flexShrink = 0;
            boxSpan.style.height = '20px';
            boxSpan.style.marginRight = '10px';
            boxSpan.style.width = '20px';

            // Text
            const textContainer = document.createElement('p');
            textContainer.style.color = item.fontColor;
            textContainer.style.margin = 0;
            textContainer.style.padding = 0;
            textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        });
    }
};

var charts = document.querySelectorAll('*[id^="chart-"]');
for (i = 0; i < charts.length; ++i) {
    const chart_data = JSON.parse(charts[i].dataset.datasets).data;
    const chart_options =  JSON.parse(charts[i].dataset.datasets).options;
    const chart_settings = JSON.parse(charts[i].dataset.config);
    const chartType = charts[i].dataset.chartType;
    const configCallback = charts[i].dataset.callback || null;
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
                display: chart_settings['show_legend'],
                reverse: chart_settings['reverse_legend']
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';

                        if (label) {
                            label += ': ';
                        }
                        data = context.dataset.data[context.dataIndex]
                        if(Array.isArray(data) && data.length == 2){
                            label += formatValue((parseFloat(data[1])*1000-parseFloat(data[0])*1000)/1000, chart_settings['precision'], chart_settings['unit_override'])
                        }else{
                            label += formatValue(context.dataset.data[context.dataIndex], chart_settings['precision'], chart_settings['unit_override'], chart_settings['unit_override'])
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                formatter: function(value) {
                    if(Array.isArray(value) && value.length == 2){
                        return formatValue((parseFloat(value[1])*1000-parseFloat(value[0])*1000)/1000, chart_settings['precision'], chart_settings['unit_override'])
                    }else{
                        return formatValue(value, chart_settings['precision'], chart_settings['unit_override'])
                    }
                },
            }
        },
    }

    if (chart_settings['html_legend']) {
        charts[i].insertAdjacentHTML('afterend', '<div id="'+charts[i].id.replace('chart', 'chart-legend-container')+'"></div>');
        options.plugins.legend.display = false;
        options.plugins.htmlLegend = {
            containerID: charts[i].id.replace('chart', 'chart-legend-container'),
        }
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
            return percentageFormatter(value, chart_settings['y_left_precision'], chart_settings['unit_override'])
        };
        options.plugins.tooltip.callbacks.label = function(context) {
            let label = context.label || '';

            if (label) {
                label += ': ';
            }
            data = context.dataset.data[context.dataIndex]
            if(Array.isArray(data) && data.length == 2){
                label += percentageFormatter((parseFloat(data[1])*1000-parseFloat(data[0])*1000)/1000, chart_settings['precision'], chart_settings['unit_override'])
            }else{
                label += percentageFormatter(context.dataset.data[context.dataIndex], chart_settings['precision'], chart_settings['unit_override'])
            }
            return label;
        }
        if (chart_settings['show_values_on_chart']){
            options.plugins.datalabels.formatter = function(value) {
                return percentageFormatter(value, chart_settings['precision'], chart_settings['unit_override'])
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
    }

    if (chart_settings['stacking'] === 'stacked_100') {
        options.plugins.stacked100 = { enable: true, replaceTooltipLabel: false }
    }

    if (chart_settings['show_grid'] === false){
        options.scales.x.grid.display = false;
        options.scales.y.grid.lineWidth = function(context){ return context.tick && context.tick.value == 0 ? 1 : 0 }
        options.scales.y1.grid.lineWidth = function(context){ return context.tick && context.tick.value == 0 ? 1 : 0 }
    }

    if (chartType == 'pie' || chartType == 'doughnut'){
        options.borderWidth = chart_settings['pie_border_width'];
        options.borderColor = chart_settings['pie_border_color'];
    }

    let chartOptions = {
        type: chart_types[chartType].chartjs_chart_type,
        data: {
            labels: labels,
            datasets: datasets
        },
        plugins: []
    }

    if (chart_settings['html_legend']) {
        chartOptions.plugins = [...chartOptions.plugins, htmlLegendPlugin]
    }
    
    if (chart_settings['show_values_on_chart']) {
        chartOptions.plugins = [...chartOptions.plugins, ChartDataLabels]
        if (chart_settings['stacking'] === 'stacked' || chart_settings['stacking'] === 'stacked_100') {
            options.plugins.datalabels.formatter = function (value) {
                if(parseFloat(value) === 0.0){
                    return ''
                }
                if (chart_settings['y_left_data_type'] === "percentage") {
                    return percentageFormatter(value, chart_settings['precision'], chart_settings['unit_override'])
                }else{
                    return formatValue(value, chart_settings['precision'], chart_settings['unit_override'])
                }
            }
        }
    }

    if (chartType == 'bar_horizontal'){
        b = options.scales.y;
        options.scales.y = options.scales.x;
        options.scales.x = b;
    }
    
    chartOptions.options = mergeDeep(options, chart_types[chartType].chart_options)

    if (configCallback !== null) {
        const fn = new Function(`return ${configCallback}()`);
        chartOptions.options = mergeDeep(chartOptions.options, fn())
    }
    
    let myChart = new Chart(charts[i].getContext('2d'), chartOptions);
}