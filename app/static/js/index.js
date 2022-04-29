var all_fields = document.querySelectorAll('.remove_shadow_border')

var idg = 0

// Строки для новой задачи
function add_fields(p1, p2, p3) {
    button_add_fields = document.getElementById(`add_fields_${p1}`)
    hidden_fields_p1 = document.getElementById(`hidden_fields_${p1}`)
    hidden_fields_p2 = document.getElementById(`hidden_fields_${p2}`)
    hidden_fields_p3 = document.getElementById(`hidden_fields_${p3}`)
    new_content = document.getElementById(`new_content_${p1}`)
    new_time = document.getElementById(`new_time_${p1}`)
    error_content = document.getElementById(`error_content_${p1}`)
    error_content_zero = document.getElementById(`error_content_zero_${p1}`)

    hidden_fields_p1.classList.toggle("hidden")
    hidden_fields_p2.classList.add("hidden")
    hidden_fields_p3.classList.add("hidden")
    new_content.value = ''
    new_time.value = ''
    new_content.focus() == true
    error_content.classList.add("hidden")
    error_content_zero.classList.add("hidden")
}


// Добавление новой задачи
function add_new_task(priority) {
    if (priority == 'A') {
        hidden_fieldss = document.getElementById('hidden_fields_a')
        form_change_el = document.getElementById('form_change_el_a')
        new_content = document.getElementById('new_content_a')
        new_time = document.getElementById('new_time_a')
        error_content = document.getElementById('error_content_a')
        error_content_zero = document.getElementById('error_content_zero_a')
        error_time_min = document.getElementById('error_time_min_a')
    } else if (priority == 'B') {
        hidden_fieldss = document.getElementById('hidden_fields_b')
        form_change_el = document.getElementById('form_change_el_b')
        new_content = document.getElementById('new_content_b')
        new_time = document.getElementById('new_time_b')
        error_content = document.getElementById('error_content_b')
        error_content_zero = document.getElementById('error_content_zero_b')
        error_time_min = document.getElementById('error_time_min_b')
    } else if (priority == 'C') {
        hidden_fieldss = document.getElementById('hidden_fields_c')
        form_change_el = document.getElementById('form_change_el_c')
        new_content = document.getElementById('new_content_c')
        new_time = document.getElementById('new_time_c')
        error_content = document.getElementById('error_content_c')
        error_content_zero = document.getElementById('error_content_zero_c')
        error_time_min = document.getElementById('error_time_min_c')
    }

    // Проверка на уязвимости и пустоту
    if (new_time.value == 0 || new_content.value == 0) {
        error_content_zero.classList.remove("hidden")
        error_content.classList.add("hidden")
        error_time_min.classList.add("hidden")
    } else if (new_time.value < 4) {
        error_time_min.classList.remove("hidden")
        error_content_zero.classList.add("hidden")
        error_content.classList.add("hidden")
    } else if (not_xss(new_content.value)) {
        error_content.classList.remove("hidden")
        error_time_min.classList.add("hidden")
        error_content_zero.classList.add("hidden")
    } else {
        error_content.classList.add("hidden")
        error_content_zero.classList.add("hidden")
        error_time_min.classList.add("hidden")

        dateg = $('.tab.active').text().trim()
        
        if (!valid_date(dateg)) {
            throw `Date ${dateg} not valid.`
        } else {
            let data = {
                "task_id": null,
                "task_priority": priority,
                "task_content": new_content.value,
                "task_time": new_time.value,
                "date": dateg
            }
            postData(url, data)
        }
    }
}


// Редактирование задачи
function change_task(priority, id) {
    task_content = document.getElementById(`content_${id}`)
    task_time = document.getElementById(`time_${id}`)
    error_content_change = document.getElementById(`error_content_${id}`)
    error_content_zero_change = document.getElementById(`error_content_zero_${id}`)
    error_time_min_change = document.getElementById(`error_time_min_${id}`)

    if (task_time.value == 0 || task_content.value == 0) {
        error_content_zero_change.classList.remove("hidden")
        error_time_min_change.classList.add("hidden")
        error_content_change.classList.add("hidden")
    } else if (task_time.value < 4) {
        error_time_min_change.classList.remove("hidden")
        error_content_zero_change.classList.add("hidden")
        error_content_change.classList.add("hidden")
    } else if (not_xss(task_content.value)) {
        error_content_change.classList.remove("hidden")
        error_content_zero_change.classList.add("hidden")
        error_time_min_change.classList.add("hidden")
    } else {
        error_content_zero_change.classList.add("hidden")
        error_time_min_change.classList.add("hidden")
        error_content_change.classList.add("hidden")
        let data = {
            "task_id": id,
            "task_priority": priority,
            "task_content": task_content.value,
            "task_time": task_time.value
        }
        postData(url, data)
    }
}


$('#change_status_a').click(change_status_task)
$('#change_status_b').click(change_status_task)
$('#change_status_c').click(change_status_task)
// Смена статуса задачи
function change_status_task() {
    if (idg != 0) {
        let idg_copy = idg
        let data = {
            "task_id": idg_copy,
            "change_status": true
        }
        postData(url, data)
        idg = 0
    } else {
        show_toast_ex('Сначала выберите задачу')
    }
}


// Достаём ид выбранной задачи
element_in_focus(all_fields)
function element_in_focus(fields) {
    fields.forEach(field => {
        field.onfocus = function() {
            idg = parseInt(field.id.match(/\d+/g))
            return idg
        }
    })
}

// Удаление задачи - модальное окно
var delete_modal = document.getElementById('delete_modal')
delete_modal.addEventListener('show.bs.modal', function() {
    var modal_body = delete_modal.querySelector('.modal-body')
    var delete_task = document.getElementById('delete_task')
    if (idg == 0) {
        modal_body.textContent = 'Для удаления не выбрано ни одной задачи!'
        delete_task.disabled = true
    } else {
        var modal_body = delete_modal.querySelector('.modal-body')
        var content = document.getElementById(`content_${idg}`).innerHTML
        modal_body.textContent = 'Вы точно хотите удалить задачу: "' + content + '" ?'
        var delete_task = document.getElementById('delete_task')
        delete_task.disabled = false
        delete_task.onclick = function() {
            let data = {
                "task_id": idg
            }
            postData(url, data)
            delete_instance = bootstrap.Modal.getInstance(delete_modal)
            delete_instance.hide()
        }
    }
})

// Закрытие модального окна
delete_modal.addEventListener('hide.bs.modal', function() {
    idg = 0
})


// Дата выбранная в календаре
$('.date-picker-1').on('click', function() {
    if ($('.date-picker-date').text().trim() != '-- -- ----') {
        $('.date-after').removeClass('active')
        $('.date-picker-date').addClass('active')
    }

    let data = this.innerText
    
    getData(url, data)
})

// Дата выбранная в календаре
$('.date-picker-1').on('click', function() {
    if ($('.date-picker-date').text().trim() != '-- -- ----') {
        $('.date-after').removeClass('active')
        $('.date-picker-date').addClass('active')
    }

    let data = this.innerText
    
    getData(url, data)
})

// Дата выбранная в календаре
$('.pit-button').on('click', function() {{
        $('.pit-button-2').removeClass('active')
        $('.pit-button').addClass('active')
    }
})

// Получение данных по нажатию на вкладку даты (сегодня и предыдущие дни)
var date_list = document.querySelectorAll('.date-after')
for (let i=0; i < date_list.length; i++) {
    date_list[i].addEventListener('click', function() {
        $('.date-picker-date').removeClass('active')
        $('.date-after').removeClass('active')
        this.classList.add('active')

        let data = this.innerText

        getData(url, data)
    })
}

// GET запрос на получение данных с предыдущих дней
function getData(url, data) {
    try {
        // проверка на соответствие формату даты перед отправкой запроса
        if (!valid_date(data)) {
            throw `Date ${data} not valid.`
        }
        fetch(url+'?date='+data)
        .then(response => {return response.json()})
        .then(resgetBody => {
            if (resgetBody['error']) {
                // чистим таски
                $('#form_change_el_a').empty('')
                $('#form_change_el_b').empty('')
                $('#form_change_el_c').empty('')
                // скрываем кнопки действий
                fade_buttons('hide')
                // показываем уведомление о прошеднем дне, на который не запланировано задач, либо который не был создан
                show_toast_ex(resgetBody['error'])
            } else {
                // общие данные
                work_time.innerHTML = resgetBody['work_time']
                time_general.innerHTML = resgetBody['time_general']
                free_time.innerHTML = resgetBody['free_time']
                over_time.innerHTML = resgetBody['over_time']
                time_general_pb.style.width = resgetBody['time_general']+'%'
                free_time_pb.style.width = resgetBody['free_time']+'%'
                time_a.innerHTML = resgetBody['time_a']
                time_b.innerHTML = resgetBody['time_b']
                time_c.innerHTML = resgetBody['time_c']
                quantity_task_general.innerHTML = resgetBody['quantity_task_general']
                quantity_task_a.innerHTML = resgetBody['quantity_task_a']
                quantity_task_b.innerHTML = resgetBody['quantity_task_b']
                quantity_task_c.innerHTML = resgetBody['quantity_task_c']
                percent_a.innerHTML = resgetBody['percent_a']
                percent_b.innerHTML = resgetBody['percent_b']
                percent_c.innerHTML = resgetBody['percent_c']
                pb_a.style.width = resgetBody['percent_a']+'%'
                pb_b.style.width = resgetBody['percent_b']+'%'
                pb_c.style.width = resgetBody['percent_c']+'%'
                percent_pb_a.innerHTML = resgetBody['percent_a']+'%'
                percent_pb_b.innerHTML = resgetBody['percent_b']+'%'
                percent_pb_c.innerHTML = resgetBody['percent_c']+'%'

                // очищаем доски A,B,C
                $('#form_change_el_a').empty('')
                $('#form_change_el_b').empty('')
                $('#form_change_el_c').empty('')

                data_a = JSON.parse(resgetBody["task_a"])
                data_b = JSON.parse(resgetBody["task_b"])
                data_c = JSON.parse(resgetBody["task_c"])

                // отрисовка полученных задач
                drawing_get_tasks(data_a, form_change_el_a, 'A')
                drawing_get_tasks(data_b, form_change_el_b, 'B')
                drawing_get_tasks(data_c, form_change_el_c, 'C')

                // отображаем кнопки если дата в запросе больше или равна текущей
                if (resgetBody['date_eq'] == true) {
                    fade_buttons()
                // иначе скрываем кнопки и запрещаем редактирование полей
                } else {
                    fade_buttons('hide')
                }

                function drawing_get_tasks(data, form_change_el, letter) {
                    for (i=0; i < data.length; i++) {
                        if (data[i]["fields"]["status"] == 1) {
                            xstrike = ''
                        } else if (data[i]["fields"]["status"] == 2) {
                            xstrike = 'strike'
                        }

                        if (resgetBody['date_eq'] == true) {
                            editable = ''
                        } else {
                            editable = 'disabled'
                        }

                        form_change_el.insertAdjacentHTML('afterbegin', `
                            <div class="row row-select ${xstrike}" id="row_${data[i]["pk"]}" onchange="change_task('${letter}', ${data[i]["pk"]})">
                                <div class="col-10 py-1 b-bottom">
                                    <textarea class="form-control remove_shadow_border" rows="1" placeholder="Задача.." id="content_${data[i]["pk"]}"
                                        ${editable}>${data[i]["fields"]["content"]}</textarea>
                                    <div id="error_content_${data[i]["pk"]}" class="badge text-danger hidden">Введены недопустимые символы < > !</div>
                                    <div id="error_content_zero_${data[i]["pk"]}" class="badge text-danger hidden">Значения не могут быть пустыми!</div>
                                    <div id="error_time_min_${data[i]["pk"]}" class="badge text-danger hidden">3-минутные задачи в список не заносятся!</div>
                                </div>
                                <div class="col-2 py-1 b-bottom">
                                    <input type="number" min="4" class="form-control remove_shadow_border" placeholder="Время" id="time_${data[i]["pk"]}"
                                        value="${data[i]["fields"]["time"]}" oninput="justInteger(this)" ${editable}>
                                </div>
                            </div>`)
                    }
                }

                set_preferences()
                all_fields = document.querySelectorAll('.remove_shadow_border')
                element_in_focus(all_fields)
            }

        })
    } catch (error) {
        console.error('Ошибка-> ', error)
    }
}


// POST запрос на сервер - получение/присвоение новых/отредактированных/удаленных данных, смена статуса
async function postData(url, data) {
    try {
        await fetch(url, {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": 'application/json',
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).then(resBody => {
            // общие данные
            time_general.innerHTML = resBody['time_general']
            free_time.innerHTML = resBody['free_time']
            over_time.innerHTML = resBody['over_time']
            time_general_pb.style.width = resBody['time_general']+'%'
            free_time_pb.style.width = resBody['free_time']+'%'
            time_a.innerHTML = resBody['time_a']
            time_b.innerHTML = resBody['time_b']
            time_c.innerHTML = resBody['time_c']
            quantity_task_general.innerHTML = resBody['quantity_task_general']
            quantity_task_a.innerHTML = resBody['quantity_task_a']
            quantity_task_b.innerHTML = resBody['quantity_task_b']
            quantity_task_c.innerHTML = resBody['quantity_task_c']
            percent_a.innerHTML = resBody['percent_a']
            percent_b.innerHTML = resBody['percent_b']
            percent_c.innerHTML = resBody['percent_c']
            pb_a.style.width = resBody['percent_a']+'%'
            pb_b.style.width = resBody['percent_b']+'%'
            pb_c.style.width = resBody['percent_c']+'%'
            percent_pb_a.innerHTML = resBody['percent_a']+'%'
            percent_pb_b.innerHTML = resBody['percent_b']+'%'
            percent_pb_c.innerHTML = resBody['percent_c']+'%'

            if (data['task_id'] == null) {
                // новая задача
                form_change_el.insertAdjacentHTML('afterbegin', `
                    <div class="row row-select" id="row_${resBody["task_pk_returned"]}"
                        onchange="change_task('${resBody["task_priority"]}', ${resBody["task_pk_returned"]})">
                        <div class="col-10 py-1 b-bottom">
                            <textarea class="form-control remove_shadow_border" id="content_${resBody["task_pk_returned"]}" rows="1" placeholder="Задача.."
                                required>${resBody["task_content_returned"]}</textarea>
                            <div id="error_content_${resBody["task_pk_returned"]}" class="badge text-danger hidden">Введены недопустимые символы < > !</div>
                            <div id="error_content_zero_${resBody["task_pk_returned"]}" class="badge text-danger hidden">Значения не могут быть пустыми!</div>
                            <div id="error_time_min_${resBody["task_pk_returned"]}" class="badge text-danger hidden">3-минутные задачи в список не заносятся!</div>
                        </div>
                        <div class="col-2 py-1 b-bottom">
                            <input type="number" min="4" class="form-control remove_shadow_border" id="time_${resBody["task_pk_returned"]}" placeholder="Время"
                                value="${resBody["task_time_returned"]}" oninput="justInteger(this)" required>
                        </div>
                    </div>`)
                
                new_content.value = ''
                new_time.value = ''
                hidden_fieldss.classList.toggle("hidden")
                set_preferences()
                all_fields = document.querySelectorAll('.remove_shadow_border')
                element_in_focus(all_fields)
            } else if (data['task_id'] != null && Object.keys(data).length == 1) {
                // удаление задачи
                document.getElementById(`row_${resBody['task_pk_returned']}`).remove();
                idg = 0
            } else if (resBody['task_status']) {
                // редактирование статуса
                if (resBody['task_status'] == 'Выполнена')
                    document.getElementById(`row_${resBody['task_pk_returned']}`).classList.add("strike")
                else
                    document.getElementById(`row_${resBody['task_pk_returned']}`).classList.remove("strike")
            } else {
                // редактирование задачи
                task_content.innerHTML = resBody['task_content_returned']
                task_time.value = resBody['task_time_returned'].replace(/^(0+)|[^\d]+/g,'')
            }
        })

    } catch (error) {
        console.error('Ошибка-> ', error)
    }
}
