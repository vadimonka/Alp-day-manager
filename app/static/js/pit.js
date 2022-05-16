

// проверка строк с задачами на чекнутость
function checked_task(fields) {
    let idt = []
    fields.forEach(field => {
        if (field.checked) {
            idt.push(parseInt(field.id.match(/\d+/g)))
        }
    })
    return idt
}


// обработчик нажатия кнопки "перенести"
$('.throw-over').on('click', () => {
    // собираются со страницы чекбоксы
    if (document.querySelectorAll('.form-check-input').length) {
        let list_of_task = document.querySelectorAll('.form-check-input')
        // берется значение из поля выбранной даты
        if (document.querySelector('.date.active')) {
            var active_date = document.querySelector('.date.active').innerText
        } else {
            show_toast_ex('Не выбрана дата, на которую переносить задачи')
        }
        // проверяем чекбоксы на чекнутость 
        var task_list = checked_task(list_of_task)

        if (task_list.length == 0) {
            show_toast_ex('Не выбрано ни одной задачи для переноса')
        } else {
            let data = {
                "task_list": task_list,
                "date": active_date
            }
            postDataPit(urlPit, data)
        }
    } else {
        show_toast_ex('Нечего переносить')
    }
})


// POST запрос на перенос задач
async function postDataPit(url, data) {
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
            // если от сервера пришел ответ что все успешно, то убираем из DOM перенесенные элементы(таски)
            if (resBody['status'] == true) {
                data["task_list"].forEach(task => {
                    document.getElementById(`row_${task}`).remove()
                })
            } else if (data["date_from"] && data["date_to"]) {
                if (document.querySelector('.table-pit-content')) {
                    document.querySelector('.table-pit-content').innerText = ''
                    for (let i=1; i<=Object.keys(resBody).length; i++) {
                        taskList = JSON.parse(resBody[`data${i}`]["tasks"])
                        for (task of taskList) {
                            document.querySelector('.table-pit-content').insertAdjacentHTML('afterbegin',`
                                <tr id="row_${task.pk}">
                                <td>
                                    <div class="input-group">
                                    <div class="input-group-text">
                                        <input class="form-check-input" type="checkbox" value="" id="check_${task.pk}">
                                    </div>
                                    <textarea class="form-control other_shadow_border" id="content_${task.pk}" rows="1"
                                        placeholder="Задача.." required>${task.fields.content}</textarea>
                                    </div>
                                </td>
                                </tr>`)
                        }
                        document.querySelector('.table-pit-content').insertAdjacentHTML('afterbegin',`
                            <tr>
                                <th scope="row">
                                    ${moment(resBody[`data${i}`]["date"]).format('DD MMMM YYYY')}
                                </th>
                            </tr>`)
                    }
                }
            } else {
                show_toast_ex('Упс, что-то пошло не по плану..')
            }
        })
    } catch (error) {
        console.error('Ошибка-> ', error)
    }
}
