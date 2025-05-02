import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  fullname: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
  // password: { type: String, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{8}$/.test(value); // exactly 8 digits
      },
      message: 'Password must be exactly 8 digits.',
    },
  },
  role: {
    type: String,
    enum: ['CEO', 'Superadmin', 'Admin'],
    default: 'Admin',
  },
  isActive: { type: Boolean, default: true },
  // createdAt: { type: Date, default: Date.now },
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  versionKey: false,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
