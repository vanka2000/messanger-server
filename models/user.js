import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import isEmail from "validator/lib/isEmail.js";

// модель юзера
const userSchema = new mongoose.Schema({
    name : {
        // тип данных
        type : String,
        // обязательное наличие
        required : true,
        // проверка на уникальность
        unique : true,
    },
    salary : {
        type : Number,
        required : false,
        unique : false
    },
    email : {
        type : String,
        required : true,
        unique : true,
        // валидация (если нужна)
        validate : {
            validator : (email) => isEmail(email),
            message : ({value}) =>  `${value} - неккоректный, попробуйте другой email`
        }
    },
    // userID : {
    //     type : ObjectId,     //тип АЙдишник монгоДБ
    //     required : false,      //не обязательно для ввода
    //     unique : true,    //уникальность
    // },
    chat : {
        type : Array,
        required : false,
        default : [],   // по дефолту пустой массив
        unique : false
    },
    password : {
        type : String,
        required : true,
        unique : false,
    },
})



//Создание метода для модели
userSchema.statics.findByUserWithLogin = function (email, password) {     //statics - это метод,который позволяет оставить исходную схему
    return this.findOne({email,password})  //ищем юзера по email и паролю (эти данные для того,чтобы юзер мог войти только под своими данными)
        .select('+password') // проверяем введен ли пароль
        .then((user) => {
            // console.log(user);
            // if(!user) throw new Error('Неверная почта или пароль')
            return user
        })
 }



export default mongoose.model('User', userSchema)


//models нужна нам,для объяснения модели поведения,при создании и редактировании юзеров

//контроллер за функционал,а модель за поведение и вид