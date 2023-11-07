import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from "jsonwebtoken";


// функция получения юзеров
const getAllUsers = (socket, userID) => {
    console.log(userID);
    // поиск юзера на основании модели
    User.find({})
        .then((user) => {
            socket.emit('getUsers', user)
        })
        .catch(err => {
            socket.emit('getUsers', "Не удалось найти юзера")
        })
}

const createUser = (msg, socket) => {        //функция создания пользователя в базе данных
    const {name, email, password} = msg
    const userID =  new mongoose.Types.ObjectId()   //генерация дополнительного ObjectID
    User.create({name, email, password, userID})
        .then((user) => socket.emit('createUser',user))
        .catch(e => socket.emit('Не удалось создать юзера: ' + e))
}


const patchUser = (req, res, next)  => {                //изменить юзеру настройки (имя и тд)
    const {name, age, salary} = req.body
    const _id = req.user
    User.findByIdAndUpdate(_id, {name, age, salary})
        .then((user) => res.send(user))
        .catch(err => {
            res.send('Не удалось обновить данные юзера: ' + err)
            next()
        })
}       


const login = (msg, socket) => {        //функция для авторизации
    const {email, password} = msg
    User.findByUserWithLogin(email, password)    //передаем созданный метод модели
    .then(user => {
        const token = jwt.sign({_id : user._id}, 'dev-secret', {expiresIn : '7d'})     //создаем токен для безопасности
        socket.emit('auth', token)
    })
    .catch(() => socket.emit('auth', 'Пользователь не найден'))
}



const logout = (_id, socket) => {     //функция для выхода из аккаунта
    socket.emit('logout', 'Вы вышли')
}


const getCurrentUser = (socket, _id) => {  //функция для получения данных юзера 
    User.findById(_id)
        .then(user => socket.emit('getMe', user))
        .catch(err => socket.emit('getMe', 'Error: ' + err))
}


const deleteUser = (msg, socket) => {
    User.deleteOne({name,email,password,userID})
    res.status(200).socket.emit('deleteUser', token)

}



export {
    getAllUsers,
    createUser,
    patchUser,
    login,
    logout,
    getCurrentUser,
    deleteUser
}


//контроллер нужен для того,чтобы писать функционал конкретного юзера(конкретной модели)