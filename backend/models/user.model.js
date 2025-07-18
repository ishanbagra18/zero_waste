import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }, 

    email:{
        type:String,
        required:true,
        unique:true,
        validator:[validator.isEmail,"Please enter a valid email"]
    },

    phone:{
        type:Number,
        required:true,
    },

    photo:
    {
        public_id:
        {
            type:String,
            required:true
        },

        url:{
            type:String,
            required:true
        }
    },

    organisation:{
        type:String,    
        required:true,
    },


    location:{
        type:String,
        required:true,
    },


    role:
    {
        type:String,
        required:true,
        enum:["NGO", "vendor"],
    },


    password:
    {
        type:String,
        required:true,
        select:false,
        minlength:8,
    }

},{timestamps:true})


export const User = mongoose.model("User", userSchema);