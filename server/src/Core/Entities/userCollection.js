import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    googleId: {
        type: String, 

        sparse: true,
      },
    contact:{
        type:Number,
    },
    dob:{
        type:Date,
    },
    useraddress:[{
        id:{
            type:String,
        },
        Housename:{
            type:String,
        },
        area:{
            type:String,
        },
        street:{
            type:String,
        },
        pincode:{
            type:Number,
        },
        city:{
            type:String,
        },
        state:{
            type:String,
        },
        country:{
            type:String
        },
    }],
    description:{
        type:String
    },
    block:{
        type: Boolean,
        default:false,
    },
    role:{
        type:String,
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    Qualification:{
        education:[
            {
            levelOfEducation:{
                type:String,
            },
            degree:{
                type:String
            },
            specialization:{
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
            collegeName:{
                type:String
            },
            startDate:{
                type:Date
            },
            endDate:{
                type:Date
            },
            courseType:{
                type:String
            },
            percentage:{
                type:Number
            }
        },
    ],
        skills:{
            type:[]
        }
    },
    resume:{
        type:String
    },
    jobExperienceId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'JobExperience'
    }]
      },
{
    timestamps:true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
          if (ret.dob) {
            const date = new Date(ret.dob);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            ret.dob = `${day}/${month}/${year}`;
          }
          return ret;
        }
      }
})

export const User=mongoose.model('User',UserSchema)