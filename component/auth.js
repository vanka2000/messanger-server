import jwt from "jsonwebtoken"

const auth = (token, socket) => {   //создание функции 
      //получаем поле authorization из заголовков 
    if(token){         //расшифровка нашего токена
        token = token.replace('jwt=', '')   // убираем строчку jwt из токена,на всякий случай
    }

    if(!token){ 
        return socket.emit('errorAuth','No token')
    }

    let result 
    try{
        result = jwt.verify(token, 'dev-secret')   // верифицируем токен (раскодируем)
    }
    catch{ 
        return socket.emit('errorAuth', 'необходимо пройти Аутендификацию')
    }
    
    return result
}

export { auth }


//создали компонент auth, для того,чтобы проводить аутендификацию пользователей. Чтобы они смогли выполнять какие-лиюо действия,только после того,как зайдут на свой аккаунт