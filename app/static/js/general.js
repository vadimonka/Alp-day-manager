// import './scripts.js'
// import './main-scripts.js'
// import './scripts-for-pit.js'

const url = ''
const urlPit = '/pit'
const urlStat = '/statistics'
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value


// Динамический размер textarea
function set_preferences() {
    var tx = document.getElementsByTagName('textarea');
    for (var i = 0; i < tx.length; i++) {
        tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
        tx[i].addEventListener("input", OnInput, false);
    }
}

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

set_preferences()


// Ограничения для поля ввода времени
var ft = document.getElementById('free_time')
function justInteger(obj){
    obj.value=obj.value.replace(/^(0+)|[^\d]+/g,'')
}


// Валидация содержимого задачи на скрипты
function not_xss(value) {
    return /[<>]/.test(value)
}


// Валидация даты перед отправкой
function valid_date(value) {
    return /\d\d-\d\d-\d{4}/.test(value)
}


// Инициализация всех подсказок
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})


$('.now-date').addClass('active')

// Календарь на главной странице
var monthpicker = new MaterialDatepicker('.date-picker-2', {
    lang: 'ru',
    weekBegin: 'monday',
    orientation: 'portrait',
    onNewDate: function (date) {
        let data = moment(date).format("DD-MM-YYYY")
        $('.date-picker-1').html(data)
        $('.date-after').removeClass('active')
        $('.date-picker-date').addClass('active')

        getData(url, data)
    }
})

// Календарь на странице переноса задач
var monthpicker2 = new MaterialDatepicker('.pit-button-2', {
    lang: 'ru',
    weekBegin: 'monday',
    orientation: 'portrait',
    onNewDate: function (date) {
        let data = moment(date).format("DD-MM-YYYY")
        $('.pit-button-2').html(data)
        $('.pit-button').removeClass('active')
        $('.pit-button-2').addClass('active')
    }
})

// Календари на странице статистики
var monthpicker3 = new MaterialDatepicker('.stat-button-from', {
    lang: 'ru',
    weekBegin: 'monday',
    orientation: 'portrait',
    onNewDate: function (date) {
        let data_from = moment(date).format("DD-MM-YYYY")
        $('.stat-button-from').html(data_from)
    }
})
var monthpicker4 = new MaterialDatepicker('.stat-button-to', {
    lang: 'ru',
    weekBegin: 'monday',
    orientation: 'portrait',
    onNewDate: function (date) {
        let data_to = moment(date).format("DD-MM-YYYY")
        $('.stat-button-to').html(data_to)
        let data_from = $('.stat-button-from').text()
        if (!valid_date(data_to) || !valid_date(data_from)) {
            console.log('Dates not valid.')
        } else {
            let data = {
                'date_from': data_from,
                'date_to': data_to
            }
            getStatData(urlStat, data)
        }
    }
})


// Скрытие / отображение кнопок (add | remove | change)
function fade_buttons(set_visibility) {
    if (set_visibility == 'hide') {
        $('#add_fields_a').fadeOut(200)
        $('#remove_button_a').fadeOut(200)
        $('#change_status_a').fadeOut(200)
        $('#add_fields_b').fadeOut(300)
        $('#remove_button_b').fadeOut(300)
        $('#change_status_b').fadeOut(300)
        $('#add_fields_c').fadeOut(400)
        $('#remove_button_c').fadeOut(400)
        $('#change_status_c').fadeOut(400)
    } else {
        $('#add_fields_a').fadeIn(200)
        $('#remove_button_a').fadeIn(200)
        $('#change_status_a').fadeIn(200)
        $('#add_fields_b').fadeIn(300)
        $('#remove_button_b').fadeIn(300)
        $('#change_status_b').fadeIn(300)
        $('#add_fields_c').fadeIn(400)
        $('#remove_button_c').fadeIn(400)
        $('#change_status_c').fadeIn(400)
    }
}


// экземпляр всплывающего сообщения
function show_toast_ex(value) {
    var toastLiveExample = document.getElementById('liveToast')
    var toast_body = document.querySelector('.toast-body')
    var toast = new bootstrap.Toast(toastLiveExample)
    toast_body.innerHTML = value
    toast.show()
}


// preloader
var hellopreloader = document.getElementById("hellopreloader_preload");

function fadeOutnojquery(el) {
    el.style.opacity = 1;
    var interhellopreloader = setInterval(function () {
        el.style.opacity = el.style.opacity - 0.05;
        if (el.style.opacity <= 0.05) {
            clearInterval(interhellopreloader);
            hellopreloader.style.display = "none";
        }
    }, 16);
}
window.onload = function () {
    setTimeout(function () {
        fadeOutnojquery(hellopreloader);
    }, 200);
};
