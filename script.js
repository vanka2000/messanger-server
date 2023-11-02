import mongoose from "mongoose";
import express from 'express';
import bodyParser from "body-parser";         //иморт для метода POST
import userRouter from "./routes/user.js";
import cors from 'cors';
//Установка соединения к MongoDB
// настройки подключения к MongoDB. В первом параметре указывается localhost и стандартный для MongoDB порт 27017, а во втором параметре - настройки подключения:
mongoose.connect('mongodb://127.0.0.1:27017/test')
.then((e) => console.log('connected'))
.catch((err) => console.log(err))

let app = express();
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(cors())

// подключаем роуты через отдельный файл
app.use('/', userRouter)
app.listen(3000, () => console.log('OK'))




//Проверим теперь, успешно ли установлено соединение с MongoDB: если да,подключимся к базе данных с именем test:
