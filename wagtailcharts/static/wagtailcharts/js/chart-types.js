function simpleDataSet(data_array, options){
    let datasets = [];
    for (j=1; j < data_array.length; j++){
        let dataset = {
            label: options.title[j],
            data: data_array[j],
            borderColor: options.color[j],
            backgroundColor: options.color[j]+"cc",
        }
        if (Object.keys(options).includes('yaxis') && options.yaxis.includes("right")) {
            if (options.yaxis[j+1] === 'right') {
                dataset.yAxisID = 'y1'
            } else {
                dataset.yAxisID = 'y'
            }
        }
        datasets.push(dataset)
    }
    return datasets
}

function pieDataSet(data, options){
    let datasets = [];
    let labels = []
    let colors = []
    let _datasets = []
    
    for (j=1; j < data.length; j++){
        const ds = data[j];
        labels.push(options.title[j])
        colors.push(options.color[j])
        
        for (k=0; k < ds.length; k++){
            _datasets.push(data[j][k])
        }
    }

    datasets.push({
        backgroundColor: colors,
        data: _datasets
    })
    return datasets
}

function areaDataSet(data, options) {
    datasets = simpleDataSet(data, options);
    for (j=0; j < datasets.length; j++){
       datasets[j].fill = 'origin';
    }
    return datasets
}

function multiDataSet(data, options) {
    datasets = simpleDataSet(data, options);
    for (j=0; j < datasets.length; j++){
        if(options.type[j+1] == 'area'){
            datasets[j].type = 'line';
            datasets[j].fill = 'origin';
        }else{
            datasets[j].type = options.type[j+1];
        }
    }
    return datasets
}


function waterfallDataSet(data, options){
    let datasets = [];
    let labels = []
    let colors = []
    let _datasets = []
    
    for (j=1; j < data.length; j++){
        const ds = data[j];
        labels.push(options.title[j])
        colors.push(options.color[j])
        if(j === 1 || j === data.length-1){
            _datasets.push(data[j][0])
        }else{
            _datasets.push([data[j-1][0], data[j][0]])
        }
    }

    datasets.push({
        borderColor: colors,
        backgroundColor: colors,
        data: _datasets,
    })
    return datasets
}

function first_row_labels(data, options){
    return data[0]
}

function title_labels(data, options){
    return options.title.slice(1);
}

function parse_datalabels_value(context){
    if (context.dataIndex === 0 || context.dataIndex === context.dataset.data.length -1) {
        value = (parseFloat(context.dataset.data[context.dataIndex])*1000)/1000
    }else{
        data = context.dataset.data[context.dataIndex]
        if(Array.isArray(data) && data.length == 2){
            value = (parseFloat(data[1])*1000-parseFloat(data[0])*1000)/1000
        }else{
            value = data
        }
    }
    return value
}

chart_types = {
    line: {
        title: 'Line Chart',
        chartjs_chart_type:'line',
        dataset_options: ['yaxis'],
        chart_options: {
            plugins:{
                datalabels: {
                    offset: 3,
                    align: 'end',
                    anchor: 'end',
                }
            }
        },
        render_datasets: simpleDataSet,
        render_labels: first_row_labels,
    },
    bar: {
        title: 'Bar Chart',
        chartjs_chart_type:'bar',
        dataset_options: ['yaxis'],
        chart_options: {
            plugins:{
                datalabels: {
                    offset: 5,
                    align: function(context) {
                        var value = parse_datalabels_value(context);
                        return value < 0 ? 'start' : 'end';
                    },
                    anchor: function(context) {
                        var value = parse_datalabels_value(context);
                        return value < 0 ? 'start' : 'end';
                    }, 
                }
            }
        },
        render_datasets: simpleDataSet,
        render_labels: first_row_labels,
    },
    bar_horizontal: {
        title: 'Horizontal Bar Chart',
        chartjs_chart_type:'bar',
        dataset_options: [],
        chart_options: {
            indexAxis: 'y',
            plugins:{
                datalabels: {
                    offset: 5,
                    align: function(context) {
                        var value = parse_datalabels_value(context);
                        return value < 0 ? 'start' : 'end';
                    },
                    anchor: function(context) {
                        var value = parse_datalabels_value(context);
                        return value < 0 ? 'start' : 'end';
                    }, 
                }
            }
        },
        render_datasets: pieDataSet,
        render_labels: title_labels,
    },
    area: {
        title: 'Area Chart',
        chartjs_chart_type:'line',
        dataset_options: [],
        chart_options: {},
        render_datasets: areaDataSet,
        render_labels: first_row_labels,
    },
    multi: {
        title: 'Combo Line/Bar/Area Chart',
        chartjs_chart_type:'bar',
        dataset_options: ['type', 'yaxis'],
        chart_options: {},
        render_datasets: multiDataSet,
        render_labels: first_row_labels,
    },
    pie: {
        title: 'Pie Chart',
        chartjs_chart_type:'pie',
        dataset_options: [],
        chart_options: {
            scales: undefined
        },
        render_datasets: pieDataSet,
        render_labels: title_labels,
    },
    doughnut: {
        title: 'Doughnut Chart',
        chartjs_chart_type:'doughnut',
        dataset_options: [],
        chart_options: {
            scales: undefined
        },
        render_datasets: pieDataSet,
        render_labels: title_labels,
    },
    radar: {
        title: 'Radar Chart',
        chartjs_chart_type:'radar',
        dataset_options: [],
        chart_options: {
            scales: undefined
        },
        render_datasets: simpleDataSet,
        render_labels: first_row_labels,
    },
    polar: {
        title: 'Polar Chart',
        chartjs_chart_type:'polarArea',
        dataset_options: [],
        chart_options: {
            scales: undefined
        },
        render_datasets: simpleDataSet,
        render_labels: first_row_labels,
    },
    waterfall: {
        title: 'Waterfall Chart',
        chartjs_chart_type: 'bar',
        dataset_options: [],
        chart_options: {
            plugins: {
                datalabels: {
                    offset: 5,
                    color: function(context) {
                        var value = parse_datalabels_value(context);
                        return value < 0 ? '#8d0a0a' : '#1c5661';
                    },
                    align: function(context) {
                        var value = parse_datalabels_value(context);
                        return value < 0 ? 'start' : 'end';
                    },
                    anchor: function(context) {
                        var value = parse_datalabels_value(context);
                        return value < 0 ? 'start' : 'end';
                    },  
                }                  
            }
        },
        render_datasets: waterfallDataSet,
        render_labels: title_labels,
    }
    // scatter: {
    //     title: 'Scatter Chart',
    //     chartjs_chart_type:'scatter',
    //     dataset_options: [],
    //     chart_options: {},
    //     render_datasets: simpleDataSet,
    // },
    // bubble: {
    //     title: 'Bubble Chart',
    //     chartjs_chart_type:'bubble',
    //     dataset_options: [],
    //     chart_options: {},
    //     render_datasets: simpleDataSet,
    // },
}