import mongoose from "mongoose";
import Chat from "../models/chat.js";

const getChats = (socket, id, idChats) => {
    Chat.find({idChats})
        .then((chat) => socket.emit('getChats', {chats : chat}))
        .catch(err => socket.emit('getChats', {message : "Ошибка получения чатов", status : 500, err}))
}


const getMessages = (socket, idChat) => {
    console.log(idChat);
    Chat.findById({_id : idChat})
        .then((chat) => socket.emit('getMessages', {messages : chat.messages}))
        .catch(err => socket.emit('getMessages', {message : "Ошибка получения сообщений", status : 500, err}))
}


export { getChats, getMessages }