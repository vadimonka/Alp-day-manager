const labels = [
    'A',
    'B',
    'C',
]

var labels_date = [
    '21.01.2022',
    '22.01.2022',
    '23.01.2022',
    '24.01.2022',
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
        hoverOffset: 5
    }]
}

var data_2 = {
    labels: labels_date,
    datasets: [{
        label: '',
        backgroundColor: [
            'rgba(241,64,75,1)',
            'rgba(221,223,230,1)',
            'rgba(242,189,208,1)',
            'rgba(37,44,65,1)'
        ],
        data: [2, 3, 1, 4],
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


$('.current-week').on('click', ()=>{
    // вычисляем количество дней до понедельника
    let q1 = moment().day() - 1
    // вычисляем дату понедельника
    let monday = moment().subtract(q1, 'days').format('DD-MM-YYYY')
    // вычисляем дату сегодня
    let nowday = moment().format('DD-MM-YYYY')

    let data = {
        'date_from': monday,
        'date_to': nowday
    }
    getStatData(urlStat, data)
})

$('.last-week').on('click', ()=>{
    // вычисляем кол-во дней до предыдущего понедельника
    let q2 = moment().day() - 1 + 7
    // вычисляем дату предыдущего понедельника
    let lastMonday = moment().subtract(q2, 'days').format('DD-MM-YYYY')
    // вычисляем дату предыдущего воскресения
    let lastSunday = moment().subtract(q2-6, 'days').format('DD-MM-YYYY')

    let data = {
        'date_from': lastMonday,
        'date_to': lastSunday
    }
    getStatData(urlStat, data)
})

$('.current-month').on('click', ()=>{
    // дата начала месяца
    let begin_month = moment().format("01-MM-YYYY")
    // дата сегодня
    let nowday = moment().format('DD-MM-YYYY')

    let data = {
        'date_from': begin_month,
        'date_to': nowday
    }
    getStatData(urlStat, data)
})

$('.last-month').on('click', ()=>{
    // дата начала предыдущего месяца
    let begin_month = moment().subtract(1, 'months').startOf('month').format('DD-MM-YYYY')
    // дата конца предыдущего месяца
    let end_month = moment().subtract(1, 'months').endOf('month').format('DD-MM-YYYY')

    let data = {
        'date_from': begin_month,
        'date_to': end_month
    }
    getStatData(urlStat, data)
})


// GET запрос на получение данных для статистики
function getStatData(url, data) {
    try {
        fetch(url+'?date_from='+data['date_from']+'&date_to='+data['date_to'])
        .then(response => {return response.json()})
        .then(getBody => {

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
