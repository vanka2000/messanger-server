import jwt from "jsonwebtoken"

const auth = (req, res, next) => {   //создание функции 
    const {authorization} = req.headers    //получаем поле authorization из заголовков
    let token 
    if(authorization){         //расшифровка нашего токена
        token = authorization.replace('jwt=', '')   // убираем строчку jwt из токена,на всякий случай
    }

    if(!token){ 
        return next('No token')
    }

    let result 
    try{
        result = jwt.verify(token, 'dev-secret')   // верифицируем токен (раскодируем)
    }
    catch{ 
        return next('необходимо пройти Аутендификацию')
    }

    req.user = result
    return next()
}

export { auth }


//создали компонент auth, для того,чтобы проводить аутендификацию пользователей. Чтобы они смогли выполнять какие-лиюо действия,только после того,как зайдут на свой аккаунт