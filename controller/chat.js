import mongoose from "mongoose";
import Chat from "../models/chat.js";
import User from "../models/user.js"
import chat from "../models/chat.js";

const getChats = (socket, id, idChats) => {
    User.findById(id).then((user) => {
        Chat.find({_id : {$in : user.chat}})
                .then((chats) => socket.emit('getChats', {chats}))
                .catch(err => socket.emit('getChats', {message : "Ошибка получения чатов", status : 500, err}))
    })
}


const getMessages = (socket, idChat) => {
    Chat.findById({_id : idChat})
        .then((chat) => socket.emit('getMessages', {messages : chat.messages}))
        .catch(err => socket.emit('getMessages', {message : "Ошибка получения сообщений", status : 500, err}))
}

const addMessage = (idChat, user, message, socket) => {
    Chat.findById({_id : idChat})
        .then((chat) => {
            chat.messages.push({user, message})
            chat.save()  
            socket.emit('getMessages', {messages: chat.messages})
            socket.local.emit('getMessages', {messages: chat.messages})
        })
        .catch(err => socket.emit('getMessages', {message : "Ошибка добавления сообщения", status : 500, err}))
}

const deleteChat = (chat, socket) => {
    Chat.findByIdAndDelete(chat._id)
        .then(() => {
           chat.members.map(item => User.findById(item._id)
           .then((user) => {
               console.log(user.chat);
               const index = user.chat.indexOf(chat._id)
               if(index >= 0) user.chat.splice(index, 1)
               user.save()
               socket.emit('deleteChat', {id : chat._id})
               socket.local.emit('deleteChat', {id : chat._id})
           })
           )
        })
        .catch(err => socket.emit('deleteChat', {message : "Ошибка удаления чата", status : 500, err}))
}


export { getChats, getMessages, addMessage, deleteChat }