const labels = [
    'A',
    'B',
    'C',
]

const labels_priority = [
    'В работе',
    'Выполненные',
    'Удаленные',
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
        data: [1, 1, 1],
        hoverOffset: 5
    }]
}

var data_2 = {
    labels: labels_priority,
    datasets: [{
        backgroundColor: [
            'rgba(181,138,165,0.7)',
            'rgba(40,183,141,0.7)',
            'rgba(68,68,68,0.7)'
        ],
        borderColor: 'rgb(250,250,250)',
        data: [2, 3, 1],
        hoverOffset: 5
    }]
}

var data_3 = {
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
    type: 'pie',
    data: data_2,
    options: {  
        responsive: true,
        maintainAspectRatio: false
    }
}

const config_3 = {
    type: 'bar',
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


$('.current-week').on('click', ()=>{
    // вычисляем количество дней до понедельника
    let q1 = moment().day() - 1
    // вычисляем дату понедельника
    let monday = moment().subtract(q1, 'days').format('DD-MM-YYYY')
    // вычисляем дату сегодня
    let nowday = moment().format('DD-MM-YYYY')

    console.log(monday, nowday)

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

    console.log(lastMonday, lastSunday)

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

    console.log(begin_month, nowday)

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

    console.log(begin_month, end_month)

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

            sum_task_with_priority_a = getBody['sum_task_with_priority_a']
            sum_task_with_priority_b = getBody['sum_task_with_priority_b']
            sum_task_with_priority_c = getBody['sum_task_with_priority_c']

            sum_task_with_status_inwork = getBody['sum_task_with_status_inwork']
            sum_task_with_status_done = getBody['sum_task_with_status_done']
            sum_task_with_status_deleted = getBody['sum_task_with_status_deleted']
            sum_task_gen = sum_task_with_status_inwork + sum_task_with_status_done + sum_task_with_status_deleted
            sum_task_gen_without_deleted = sum_task_with_status_inwork + sum_task_with_status_done

            myChart_1.data.datasets[0].data.length = 0
            myChart_1.data.datasets[0].data.push(sum_task_with_priority_a, sum_task_with_priority_b, sum_task_with_priority_c)
            myChart_1.update();

            myChart_2.data.datasets[0].data.length = 0
            myChart_2.data.datasets[0].data.push(sum_task_with_status_inwork, sum_task_with_status_done, sum_task_with_status_deleted)
            myChart_2.update();
            
            $('.gen_tasks').text(sum_task_gen)
            $('.deleted_tasks').text(sum_task_with_status_deleted)
            $('.gen_tasks_without_del').text(sum_task_gen_without_deleted)
            $('.sum_tasks').text(sum_task_with_status_done)
            if (sum_task_gen_without_deleted) {
                $('.perc_gen_tasks').text(Math.round(sum_task_with_status_done/sum_task_gen_without_deleted*100))
            } else {
                $('.perc_gen_tasks').text(0)
            }
            

        })
    } catch (error) {
        console.error('Ошибка-> ', error)
    }
}
