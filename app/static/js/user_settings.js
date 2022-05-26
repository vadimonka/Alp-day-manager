var flexRadioDefaultGroup = document.querySelectorAll('.flexRadioDefault')
flexRadioDefaultGroup.forEach(radio => {
    radio.addEventListener('click', () => {
        if (radio.checked) {
            data = {
                "workday_time": $("label[for='"+radio.id+"']").text().trim()
            }
            postDataUserSettings(urlUserSettings, data)
        }
    })
})

async function postDataUserSettings(url, data) {
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
            
        })
    } catch (error) {
        console.error('Ошибка-> ', error)
    }
}