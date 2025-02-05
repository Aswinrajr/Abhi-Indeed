import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    company:{
        type:mongoose.Schema.ObjectId,
        ref:'Company',
    },
    companyName: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    minPrice: {
        type: Number,
        min:0
    },
    maxPrice: {
        type: Number,
        min:0,
        validate:{
            validator: function(value) {
                return value >= this.minPrice;
            },
            message: "Max price should be greater than or equal to min price."
        }
    },
    education:{
        type:String,
    },
    categoryName:{
        type:String
    },
    jobLocation: {
        type: String,
    },
    yearsOfExperience: {
        type: Number,
    },
    employmentType: {
        type: String
    },
    easyApply:{
        type:Boolean,
        default:true
    },
    applicationUrl:{
        type:String
    },
    delete: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: new Date
    },
    expiryDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: "Expiry date must be greater than today."
        }
    },
    description: {
        type: String
    },
    jobPostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    skills: {
        type: []
    },
    jobReports:[{
        reportedBy:{
            type:mongoose.Schema.ObjectId,
            ref:'User', 
        },
        reason:{
            type:String
        },
        description:{
            type:String
        }
    }],
    reportCount:{
        type:Number,
        default:0
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            if (ret.jobPostedOn) {
                const date = new Date(ret.jobPostedOn);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                ret.jobPostedOn = `${day}/${month}/${year}`;
            }
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
});

export const Job = mongoose.model('Job', JobSchema);
 