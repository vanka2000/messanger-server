import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import Chat from "../models/chat.js";

// функция получения юзеров
const getAllUsers = (socket) => {
    User.find({})
        .then((allUsers) => {
            socket.emit('getUsers', {allUsers})
        })
        .catch(err => {
            socket.emit('getUsers', {message : "Ошибка получения пользователей", status : 500, err})
        })
}

const createUser = (msg, socket) => {        //функция создания пользователя в базе данных
    const {name, email, password} = msg
    // const userID =  new mongoose.Types.ObjectId()   //генерация дополнительного ObjectID
    User.create({name, email, password})
        .then((user) => socket.emit('createUser', user))
        .catch(err => {
            socket.emit('createUser', {message : "Ошибка создания пользователя", status : 500, err})
        })
}

const addChat = (_id, user, socket)  => {
    User.findOne({name : user}).then((friend) => {  
        User.findById(_id).then((user) => {
            Chat.create({members : [user, friend], messages : []})
                .then(chat => {  
                    friend.chat.push(chat._id)
                    user.chat.push(chat._id)
                    Promise.all([friend.save(), user.save()]).then(() => socket.emit('addFriend', {chat}))
                })
                .catch(err => socket.emit('addFriend', {message : "Ошибка создания чата", status : 500, err}))
        })
    })
}       


const login = (msg, socket) => {        //функция для авторизации
    const {email, password} = msg
    User.findByUserWithLogin(email, password)    //передаем созданный метод модели
        .then(user => {
            const token = jwt.sign({_id : user._id}, 'dev-secret', {expiresIn : '7d'})     //создаем токен для безопасности
            socket.emit('auth', {token})
        })
        .catch(err => socket.emit('auth', {message : "Неверно введены данные", status : 500, err}))
}


// const logout = (req, res, next) => {     //функция для выхода из аккаунта
//     res.clearCookie('jwt')                   //удаление куков,при выходе из аккаунта
//     res.status(200).send({message: "Вы вышли"})
// }

const getCurrentUser = (socket, _id,) => {  //функция для получения данных юзера 
    User.findById(_id)
        .then(user => socket.emit('getMe', {user : {email : user.email, name : user.name, chats: user.chat}}))
        .catch(err => socket.emit('getMe', {message : "Пользователь не найден", status : 500, err}))
}


// const deleteUser = (req,res,next) => {
//     User.deleteOne({name,email,password,userID})
//     res.status(200).send({message:"Вы удалили аккаунт"})

// }



export {
    getAllUsers,
    createUser,
    addChat,
    login,
    // logout,
    getCurrentUser,
    // deleteUser
}


//контроллер нужен для того,чтобы писать функционал конкретного юзера(конкретной модели)