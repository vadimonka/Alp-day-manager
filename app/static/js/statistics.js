const labels = [
    'A',
    'B',
    'C',
]

var labels_date = [
    '21.01.2022',
    '22.01.2022',
    '23.01.2022',
    '24.01.2022'
]

var data_1 = {
    labels: labels,
    datasets: [{
        backgroundColor: [
            'rgba(220, 53, 69, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(108, 117, 125, 0.7)'
        ],
        borderColor: 'rgb(250,250,250)',
        data: [1, 2, 3],
    }]
}

var data_2 = {
    labels: labels_date,
    datasets: [{
        backgroundColor: [
            'rgba(241,64,75,1)',
            'rgba(221,223,230,1)',
            'rgba(242,189,208,1)',
            'rgba(37,44,65,1)'
        ],
        borderColor: 'rgb(250,250,250)',
        data: [2, 3, 1, 5, 4],
    }]
}

var data_3 = {
    labels: labels,
    datasets: [{
        backgroundColor: [
            'rgba(0, 128, 128, 1)'
        ],
        borderColor: 'rgba(0, 128, 128, 0.5)',
        data: [2,3,1],
        tension: 0.5
    }]
}

const config_1 = {
    type: 'doughnut',
    data: data_1,
    options: {  
        responsive: true,
        maintainAspectRatio: false
    }
}

const config_2 = {
    type: 'bar',
    data: data_2,
    options: {  
        responsive: true,
        maintainAspectRatio: false
    }
}

const config_3 = {
    type: 'line',
    data: data_3,
    options: {  
        responsive: true,
        maintainAspectRatio: false
    }
}

if (document.getElementById('graf_1')) {
    var myChart_1 = new Chart(
        document.getElementById('graf_1'),
        config_1
    )
}

if (document.getElementById('graf_2')) {
    var myChart_2 = new Chart(
        document.getElementById('graf_2'),
        config_2
    )
}

if (document.getElementById('graf_3')) {
    var myChart_3 = new Chart(
        document.getElementById('graf_3'),
        config_3
    )
}


// GET запрос на получение данных для статистики
function getStatData(url, data) {
    try {
        fetch(url+'?date_from='+data['date_from']+'&date_to='+data['date_to'])
        .then(response => {return response.json()})
        .then(getBody => {
            console.log(getBody)

            count_a = getBody['count_a']
            count_b = getBody['count_b']
            count_c = getBody['count_c']

            myChart_1.data.datasets[0].data.length = 0
            myChart_1.data.datasets[0].data.push(count_a, count_b, count_c)
            myChart_1.update();

        })
    } catch (error) {
        console.error('Ошибка-> ', error)
    }
}
