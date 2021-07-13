const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid') //uuid library

//User interface, put all html, css, js in those floders
app.set('view engine', 'ejs')
app.use(express.static('public'))

//home page: if u go into homepage, server will give a new room for u
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

//if user connect in this server
io.on('connection', socket => {
  //join room
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId)
    //tell owner there is a new mate join the room
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)