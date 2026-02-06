import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name cannot be shorter than 2 characters."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "This email is already registered."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be 6 characters long."],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);
export default User;
