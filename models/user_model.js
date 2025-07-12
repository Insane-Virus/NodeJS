const { mongoose, Schema } = require('./db');

const UserSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'agent', 'user'], default: 'user' },
        parent: { type: Schema.Types.ObjectId, ref: 'users', default: null },
        units: { type: Number, default: 0 }
    }, {
    timestamps: true,
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    },
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    }
}
);
UserSchema.virtual('children', {
    ref: 'users',
    localField: '_id',
    foreignField: 'parent',
    justOne: false
});

UserSchema.index({ name: 1, parent: 1 });
const User = mongoose.model('users', UserSchema);
module.exports = User;