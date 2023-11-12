import mongoose from "mongoose";
import Chat from "../models/chat.js";

const getChats = (socket, id, idChats) => {
    Chat.find({idChats})
        .then((chat) => {
            socket.emit('getChats', {chats : chat}) 
        })
        .catch(err => socket.emit('getChats', {message : "Ошибка получения чатов", status : 500, err}))
}


const getMessages = (socket, idChat) => {
    Chat.findById({_id : idChat})
        .then((chat) => socket.emit('getMessages', {messages : chat.messages}))
        .catch(err => socket.emit('getMessages', {message : "Ошибка получения сообщений", status : 500, err}))
}

const addMessage = (idChat, user, message, socket) => {
    return Chat.findById({_id : idChat})
        .then((chat) => {
            chat.messages.push({user, message})
            chat.save()  
            socket.emit('getMessages', {messages: chat.messages})
            socket.local.emit('getMessages', {messages: chat.messages})
        })
        .catch(err => socket.emit('getMessages', {message : "Ошибка добавления сообщения", status : 500, err}))
}


export { getChats, getMessages, addMessage }