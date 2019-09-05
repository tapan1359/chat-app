const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateUrl } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

// Listen to connection event
io.on('connection', (socket) => {
    console.log('new websocket connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        // emit welcome message
        socket.emit('message', generateMessage('Welcome!'))
            // Emit mesaage to all users but joined one
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
    })

    // list to the event sendMessage from chat.js
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // Emit message event to all connected users
        io.to('City').emit('message', generateMessage(message))
        callback()
    })

    // Listen to disconnect event
    socket.on('disconnect', () => {
        // Emit message to all the user
        io.emit('message', generateMessage('User has left'))
    })

    // Location
    // Listen to event sendLocation
    socket.on('sendLocation', (position, callback) => {
        // Emit message to all user with google location link
        io.emit('locationMessage', generateUrl(`https://google.com/maps/?q=${position.latitude},${position.longitude}`))
        callback()
    })
})

server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})