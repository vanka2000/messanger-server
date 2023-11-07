import express from "express";
import { getAllUsers, createUser, patchUser, login, logout, getCurrentUser , deleteUser} from "../controller/user.js";      //Импортируем контроллеры
import { auth } from "../component/auth.js";

const userRouter = express.Router()


function actionIO (socket) {
    socket.on('auth', (msg) => {
        login(msg, socket)
    })

    socket.on('getUsers', (token) => {
        const userID =  auth(token, socket)
        getAllUsers(socket, userID)
    })

    socket.on('getMe', (token) => {
        const userID =  auth(token, socket)
        getCurrentUser(socket, userID)
    })

    socket.on('createUser', (msg) => {
        createUser(msg, socket)
    })

    socket.on('logout', (token) => {
        const userID =  auth(token, socket)
        logout(userID, socket)
    })

}





// userRouter.get('/allUsers', getAllUsers)
// userRouter.post('/signUp', createUser)
// userRouter.patch('/patch', auth, patchUser)
// userRouter.get('/me', auth, getCurrentUser)
// userRouter.post('/login', login)
// userRouter.post('/logout', auth, logout)
// userRouter.post('./deleteUser', deleteUser)
// userRouter.get('/', () => {console.log('Connect')})


// export default userRouter

export default actionIO


//роутс - для ответов на запросы и запуск контроллеров в ответе