import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: function genUUID () {
      return uuidv4()
    }
  },
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 'base'
  },
  googleId: String, //this is the ID that google oauth return
  facebookId: String, //this is the ID that facebook oauth return
  
});

//hash the password before store
UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.password) {
    next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  //Hashes the password and checks if the hashed password stored in the
  //database matches the one user sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserSchemaEx = mongoose.model('user', UserSchema);
export default UserSchemaEx