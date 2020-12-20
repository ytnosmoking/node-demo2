import mongoose from 'mongoose'

const Schema = mongoose.Schema


const UserSchema = new Schema({
  user_id: Number,
  username: String,
  password: String
})

export default mongoose.model('User', UserSchema)