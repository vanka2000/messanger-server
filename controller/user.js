import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// функция получения юзеров
const getAllUsers = (socket, userID) => {
    User.find({})
        .then((user) => {
            socket.emit('getUsers', user)
        })
        .catch(err => {
            socket.emit('getUsers', "Ошибка получения юзеров")
        })
}

const createUser = (req, res, next) => {        //функция создания пользователя в базе данных
    const {name, email, password} = req.body
    const userID =  new mongoose.Types.ObjectId()   //генерация дополнительного ObjectID
    User.create({name, email, password, userID})
        .then((user) => res.send(user))
        .catch(e => {
            res.send('Не удалось создать юзера: ' + e)
            next()
        })
}


const patchUser = (msg, _id, socket)  => {                //изменить юзеру настройки (имя и тд)
    const {name, age, salary, friends} = msg
    User.findByIdAndUpdate(_id, {name, age, salary, friends})
        .then((user) => {
            console.log(user);
            socket.emit('addFrend', user)
        })
        .catch(err => {
            socket.emit('addFrend', "Пользователь не найден")
        })
}       


const login = (msg, socket) => {        //функция для авторизации
    const {email, password} = msg
    User.findByUserWithLogin(email, password)    //передаем созданный метод модели
    .then(user => {
        const token = jwt.sign({_id : user._id}, 'dev-secret', {expiresIn : '7d'})     //создаем токен для безопасности
        socket.emit('auth', token)
        // User.tokenActivation(token, user)
            // .then((user) => socket.emit('auth', user))
            // .catch((err) => socket.emit('auth', err))
    })
    .catch(() => socket.emit('auth', 'Пользователь не найден'))
}






const logout = (req, res, next) => {     //функция для выхода из аккаунта
    res.clearCookie('jwt')                   //удаление куков,при выходе из аккаунта
    res.status(200).send({message: "Вы вышли"})
}


const getCurrentUser = (socket, _id) => {  //функция для получения данных юзера 
    User.findById(_id)
        .then(user => socket.emit('getMe', user))
        .catch(err => socket.emit('getMe', 'Пользователь не найден'))
}


const deleteUser = (req,res,next) => {
    User.deleteOne({name,email,password,userID})
    res.status(200).send({message:"Вы удалили аккаунт"})

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