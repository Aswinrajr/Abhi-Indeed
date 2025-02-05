import mongoose from "mongoose";
const JobExperienceSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    jobTitle:{
        type:String
    },
    companyName:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    currentSalary:{
        type:Number
    }
},{
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            if (ret.startDate) {
                const startDate = new Date(ret.startDate);
                const startDay = String(startDate.getDate()).padStart(2, '0');
                const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
                const startYear = startDate.getFullYear();
                ret.startDate = `${startDay}/${startMonth}/${startYear}`;
            }
            if (ret.endDate) {
                const endDate = new Date(ret.endDate);
                const endDay = String(endDate.getDate()).padStart(2, '0');
                const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
                const endYear = endDate.getFullYear();
                ret.endDate = `${endDay}/${endMonth}/${endYear}`;
            }
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
})

export const JobExperience = mongoose.model('JobExperience', JobExperienceSchema);