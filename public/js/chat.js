const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButtton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

// Listen to event message
socket.on('message', (message) => {
    console.log(message)
    //render html template
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    //set html to message div
    $messages.insertAdjacentHTML('beforeend', html)
})

// Listen to event locationMessage
socket.on('locationMessage', (location) => {
    console.log(location)
    //render html template
    const html = Mustache.render(locationMessageTemplate, {
        url: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    // set location to div
    $messages.insertAdjacentHTML('beforeend', html)

})

// listen to submit button
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //disable submit button
    $messageFormButtton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    // Emit sendMessage event for server
    socket.emit('sendMessage', message, (error) => {
        $messageFormButtton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('The message was delivered!!!')
    })
})

//listen to click event on send location button
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')    

    navigator.geolocation.getCurrentPosition((position) => {
        //Emit sendLocation to server.
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})