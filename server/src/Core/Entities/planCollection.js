import mongoose from "mongoose";
const PlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    planType: {
        type: String,
        enum: ['duration', 'lifetime'],
        required: true
    },
    planDuration: {
        type: Number,
        required: function () {
            return this.planType === 'duration';
        }
    },
    expirationDate: {
        type: Date,
        default:null
    },
    list: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

PlanSchema.pre('save', function (next) {
    if (this.planType === 'duration' && this.planDuration) {
        const now = new Date();
        this.expirationDate = new Date(now.setMonth(now.getMonth() + this.planDuration));
    } else if (this.planType === 'lifetime') {
        this.expirationDate = null;
    }
    next();
});

export const Plans = mongoose.model('Plans', PlanSchema);
