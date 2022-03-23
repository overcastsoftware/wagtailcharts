var charts = document.querySelectorAll('*[id^="chart-"]');
for (i = 0; i < charts.length; ++i) {
    const chart_data = JSON.parse(charts[i].dataset.datasets);
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

    const myChart = new Chart(charts[i].getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}