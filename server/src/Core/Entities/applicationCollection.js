import mongoose from "mongoose";
const ApplicationSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    contact:{
        type:Number
    },
    dob:{
        type:Date
    },
    totalExperience:{
        type:Number
    },
    currentCompany:{
        type:String
    },
    currentSalary:{
        type:Number
    },
    expectedSalary:{
        type:Number
    },
    preferredLocation:{
        type:String
    },
    appliedOn:{
        type:Date,
        default: new Date
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    employerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Recruiter'
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company'   
     },
    resume:{
        type:String
    },
    status:{
        type:String,
        default:'Applied'
    },
},
{ timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            if (ret.appliedOn) {
                const date = new Date(ret.appliedOn);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                ret.appliedOn = `${day}/${month}/${year}`;
            }
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
 }
)
export const Application = mongoose.model('Application', ApplicationSchema);

