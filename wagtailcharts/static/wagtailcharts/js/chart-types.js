function simpleDataSet(data, options){
    let datasets = [];
    for (j=1; j < data.length; j++){
        const ds = data[j];
        let dataset = {
            label: options.title[j],
            data: ds,
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
        labels.push(options.title[j],)
        colors.push(options.color[j])
        
        for (k=0; k < ds.length; k++){
            _datasets.push(data[j][k])
        }
    }

    datasets.push({
        borderColor: colors,
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

chart_types = {
    line: {
        title: 'Line Chart',
        chartjs_chart_type:'line',
        dataset_options: ['yaxis'],
        chart_options: {},
        render_datasets: simpleDataSet,
    },
    bar: {
        title: 'Bar Chart',
        chartjs_chart_type:'bar',
        dataset_options: ['yaxis'],
        chart_options: {},
        render_datasets: simpleDataSet,
    },
    bar_horizontal: {
        title: 'Horizontal Bar Chart',
        chartjs_chart_type:'bar',
        dataset_options: [],
        chart_options: {
            indexAxis: 'y',
        },
        render_datasets: simpleDataSet,
    },
    area: {
        title: 'Area Chart',
        chartjs_chart_type:'line',
        dataset_options: [],
        chart_options: {},
        render_datasets: areaDataSet,
    },
    multi: {
        title: 'Combo Line/Bar/Area Chart',
        chartjs_chart_type:'bar',
        dataset_options: ['type', 'yaxis'],
        chart_options: {},
        render_datasets: multiDataSet,
    },
    pie: {
        title: 'Pie Chart',
        chartjs_chart_type:'pie',
        dataset_options: [],
        chart_options: {},
        render_datasets: pieDataSet,
    },
    doughnut: {
        title: 'Doughnut Chart',
        chartjs_chart_type:'pie',
        dataset_options: [],
        chart_options: {},
        render_datasets: pieDataSet,
    },
    radar: {
        title: 'Radar Chart',
        chartjs_chart_type:'radar',
        dataset_options: [],
        chart_options: {
            scales: undefined
        },
        render_datasets: simpleDataSet,
    },
    polar: {
        title: 'Polar Chart',
        chartjs_chart_type:'polarArea',
        dataset_options: [],
        chart_options: {
            scales: undefined
        },
        render_datasets: simpleDataSet,
    },
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