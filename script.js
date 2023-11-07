import mongoose from "mongoose";
import express from 'express';
import bodyParser from "body-parser";         //иморт для метода POST

import {actionIO} from "./routes/user.js";
import cors from 'cors';
import {createServer} from 'http';
import { Server } from 'socket.io';

//Установка соединения к MongoDB
// настройки подключения к MongoDB. В первом параметре указывается localhost и стандартный для MongoDB порт 27017, а во втором параметре - настройки подключения:
mongoose.connect('mongodb://127.0.0.1:27017/Users')
.then((e) => console.log('connected'))
.catch((err) => console.log(err))



const app = express();
const server = createServer()
const io = new Server(server,{
    cors : {
        origin : 'http://localhost:3001'
    }
})


io.on('connection', (socket) => {
    actionIO(socket)
})

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
// app.use(express.json({extended: true}))    // новая строка
// app.use('/images', express.static(path.join(__dirname, 'images'))) // новая строка
app.use(cors())



// подключаем роуты через отдельный файл
// app.use('/', userRouter)
server.listen(3000, () => console.log('OK '))




//Проверим теперь, успешно ли установлено соединение с MongoDB: если да,подключимся к базе данных с именем test:
