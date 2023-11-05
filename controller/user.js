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
            socket.emit('getUsers', "Щшибка получения юзеров")
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



const logout = (req, res, next) => {     //функция для выхода из аккаунта
    res.clearCookie('jwt')                   //удаление куков,при выходе из аккаунта
    res.status(200).send({message: "Вы вышли"})
}


const getCurrentUser = (req, res, next) => {  //функция для получения данных юзера 
    const _id = req.user
    User.findById(_id)
        .then(user => res.send({user}))
        .catch(err => {
            res.status(404).send(err)
            next()
        })
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