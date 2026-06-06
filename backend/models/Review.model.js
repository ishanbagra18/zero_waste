import mongoose from 'mongoose';


const reviewSchema = new mongoose.Schema({
    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

    reviewedUser:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

    rating:
    {
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    comment:
    {
        type:String,
        trim:true,
    },
},{timestamps:true});



const Review =  mongoose.model('Review', reviewSchema);


export default Review;
