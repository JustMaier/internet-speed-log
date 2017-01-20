(function(config){
    var data = {
        labels: [],
        download: [],
        upload: [],
        ping: [],
        avg: {
            download: 0,
            upload: 0,
            ping: 0
        }
    };

    // Helpers
    function getValueFromPath(obj, path){
        for (var i=0, path=path.split('.'), len=path.length; i<len; i++)
            obj = obj[path[i]];
        return obj;
    };
    function getAvg(arr){
        var sum = 0;
        for (var i = 0; i < arr.length; i++)
            sum += arr[i] << 0;
        return sum/arr.length;
    };

    // Core
    function buildLabels(logs){
        logs.forEach(function(result){
            data.labels.push(moment(result.timestamp).format('MMM do - LT'));
            data.download.push(result.download);
            data.upload.push(result.upload);
            data.ping.push(result.ping);
        });
    }
    function calcAvg(){
        Object.keys(data.avg).forEach(function(key){
            data.avg[key] = getAvg(data[key]).toFixed(2);
        });
    }
    function bindData(){
        document.querySelectorAll('[data-src]').forEach(function(el){
            el.innerText = getValueFromPath(data, el.getAttribute('data-src'));
        });
    }
    function initCharts(){
        speedChart = new Chart(document.getElementById('speedsChart'), {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                        label: "Download (Mbps)",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(15, 185, 13, 0.4)",
                        borderColor: "rgba(15, 185, 13, 1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(15, 185, 13, 1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(15, 185, 13, 1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 3,
                        pointHitRadius: 10,
                        data: data.download,
                        spanGaps: false,
                    },
                    {
                        label: "Upload (Mbps)",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 3,
                        pointHitRadius: 10,
                        data: data.upload,
                        spanGaps: false,
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        pingChart = new Chart(document.getElementById('pingChart'), {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: "Ping (ms)",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: "rgba(177, 56, 61, 0.4)",
                    borderColor: "#b1383d",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "#b1383d",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#b1383d",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 10,
                    data: data.ping,
                    spanGaps: false,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    //Init
    moment.locale(config.locale);
    fetch(config.logDest)
        .then(function(response) {
            return response.json();
        })
        .then(function(logs) {
            buildLabels(logs);
            initCharts();
            calcAvg();
            bindData();
        });
})(config);