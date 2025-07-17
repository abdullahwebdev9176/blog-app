import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address'
        ]
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'website',
        enum: ['website', 'blog', 'footer', 'popup', 'other']
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Create indexes for better performance (remove duplicate email index)
SubscriberSchema.index({ subscribedAt: -1 });
SubscriberSchema.index({ isActive: 1 });

// Virtual for formatted subscription date
SubscriberSchema.virtual('formattedDate').get(function() {
    return this.subscribedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Static method to find active subscribers
SubscriberSchema.statics.findActiveSubscribers = function() {
    return this.find({ isActive: true }).sort({ subscribedAt: -1 });
};

// Static method to get subscriber count
SubscriberSchema.statics.getSubscriberStats = async function() {
    const total = await this.countDocuments();
    const active = await this.countDocuments({ isActive: true });
    const thisMonth = await this.countDocuments({
        subscribedAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
    });
    
    return { total, active, thisMonth };
};

// Instance method to deactivate subscriber
SubscriberSchema.methods.deactivate = function() {
    this.isActive = false;
    return this.save();
};

const SubscriberModel = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

export { SubscriberModel };
