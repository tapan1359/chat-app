const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('new websocket connection')

    socket.emit('message', 'Welcome')
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        io.emit('message', message)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has left')
    })

    socket.on('sendLocation', (position) => {
        io.emit('message', `https://google.com/maps/?q=${position.latitude},${position.longitude}`)
    })
})

server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})