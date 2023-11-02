import express from "express";
import { getAllUsers, createUser, patchUser, login, logout, getCurrentUser , deleteUser} from "../controller/user.js";      //Импортируем контроллеры
import { auth } from "../component/auth.js";

const userRouter = express.Router()

userRouter.get('/allUsers', getAllUsers)
userRouter.post('/signUp', createUser)
userRouter.patch('/patch', auth, patchUser)
userRouter.get('/me', auth, getCurrentUser)
userRouter.post('/login', login)
userRouter.post('/logout', auth, logout)
userRouter.post('./deleteUser', deleteUser)
userRouter.get('/', () => {console.log('Connect')})


export default userRouter


//роутс - для ответов на запросы и запуск контроллеров в ответе