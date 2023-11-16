import express from "express";
import { getAllUsers, createUser, addChat, login, getCurrentUser , logout } from "../controller/user.js";      //Импортируем контроллеры
import { getChats, getMessages, addMessage, deleteChat } from "../controller/chat.js";
import { auth } from "../component/auth.js";


// const fileMiddleware = require('../middleware/file.js')

// const userRouter = express.Router()


function actionIO (socket) {
    socket.on('auth', (msg) => {
        login(msg, socket)
    })

    socket.on('getUsers', (token) => {
        if(auth(token, socket)){
            getAllUsers(socket)
        }
    })

    socket.on('getMe', (token) => {
        const _id = auth(token, socket)
        if(_id){
            getCurrentUser(socket, _id)
        }
    })

    socket.on('createUser', (msg) => {
        createUser(msg, socket)
        
    })

    socket.on('deleteChat', ({chat, token}) => {
        deleteChat(chat, socket)
    })

    socket.on('logout', (token) => {
        const _id = auth(token, socket) 
        if(_id){
            logout(socket,_id)        
        }
    })

    socket.on('addFriend', ({token, user}) => {
        const _id = auth(token, socket)
        if(_id){
            addChat(_id, user, socket)
        }
    })

    socket.on('getChats', ({idChats, token}) => {
        const _id = auth(token, socket)
        if(_id){
            getChats(socket, _id, idChats)
        }
    })

    socket.on('getMessages', ({idChat, token}) => {
        const _id = auth(token, socket)
        if(_id){
            getMessages(socket, idChat)
        }
    })

    socket.on('addMessage', ({idChat, user, token, message}) => {
        const _id = auth(token, socket)
        if(_id){
            addMessage(idChat, user, message, socket)
            console.log(socket.connected)
        }
    })

}





// userRouter.get('/allUsers', getAllUsers)
// userRouter.post('/signUp', createUser)
// userRouter.patch('/patch', auth, patchUser)
// userRouter.get('/me', auth, getCurrentUser)
// userRouter.post('/login', login)
// userRouter.post('/logout', auth, logout)
// userRouter.post('./deleteUser', deleteUser)
// userRouter.get('/', () => {console.log('Connect')})


export {actionIO}




//роутс - для ответов на запросы и запуск контроллеров в ответе