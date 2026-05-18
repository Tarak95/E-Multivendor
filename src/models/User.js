const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        unique: true,
        sparse: true
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8,
        select: false
    },

    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer'
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    refreshToken: [{
        token: String,
        createdAt: {
            type: Date, default: Date.now
        },
        expiresAt: {
            type: Date
        }
    }],

    createdAt: {
        type: Date, default: Date.now
    }
}, { timestamps: true })

// PASSWORD HASH
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next()

//     const salt = await bcrypt.genSalt(12)
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// })

// COMPARE PASSWORD
// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password)
// }



// PASSWORD HASH (সংশোধিত অংশ)
userSchema.pre('save', async function () {
    // যদি পাসওয়ার্ড পরিবর্তন না হয়, তবে এখানেই কাজ শেষ (রিটার্ন) করবে
    if (!this.isModified('password')) return;

    // পাসওয়ার্ড হ্যাশ করার লজিক
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // কোনো next() কল করার প্রয়োজন নেই, async ফাংশন নিজে থেকেই পরবর্তী ধাপে চলে যাবে
});

// COMPARE PASSWORD (এটি ঠিক আছে, তাও পরিচ্ছন্ন করে দেওয়া হলো)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema)