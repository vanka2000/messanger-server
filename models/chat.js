import mongoose from "mongoose";


const chatShema = new mongoose.Schema({
    members : {
        type : Array,
        required : true,
        unique : false
    },
    messages : {
        type : Array,
        required : true,
        unique : false
    }
})


export default mongoose.model('Chat', chatShema)