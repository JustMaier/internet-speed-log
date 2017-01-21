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
    function forEach(arr, cb, scope){
        for (var i = 0; i < arr.length; i++)
            cb.call(scope, i, arr[i]);
    }
    function getChartDataSet(dataset, label, color, options){
        var transparentColor = "rgba("+color[0]+", "+color[1]+", "+color[2]+", 0.4)",
            opaqueColor = "rgba("+color[0]+", "+color[1]+", "+color[2]+", 1)";
        return Object.assign({
            label: label,
            fill: false,
            lineTension: 0.1,
            backgroundColor: transparentColor,
            borderColor: opaqueColor,
            pointBorderColor: opaqueColor,
            pointBackgroundColor: "#fff",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: opaqueColor,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointHitRadius: 10,
            data: dataset,
            spanGaps: false,
        }, options);
    }

    // Core
    function buildLabels(logs){
        logs.forEach(function(result){
            data.labels.push(moment(result.timestamp).format('MMM D - LT'));
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
        forEach(document.querySelectorAll('[data-src]'), function(i, el){
            el.innerText = getValueFromPath(data, el.getAttribute('data-src'));
        });
    }
    function initCharts(){
        var isMobile = window.outerWidth < 600;

        Chart.defaults.global.maintainAspectRatio = false;
        Chart.defaults.global.responsive = true;
        Chart.defaults.line = {
            scales: {
                yAxes: [{ticks: {beginAtZero: true}}],
                xAxes: [{display: !isMobile}],
            },
            legend: {display: !isMobile}
        };

        speedChart = new Chart(document.getElementById('speedsChart'), {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    getChartDataSet(data.download, 'Download (Mbps)', [15, 185, 13]),
                    getChartDataSet(data.upload, 'Upload (Mbps)', [75, 192, 192])
                ]
            }
        });

        pingChart = new Chart(document.getElementById('pingChart'), {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    getChartDataSet(data.ping, 'Ping (ms)', [177, 56, 61], {
                        fill: true
                    })
                ]
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