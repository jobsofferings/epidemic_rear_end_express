import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
});
const User = mongoose.model("user", UserSchema);

const MessageSchema = new Schema({
  messageContent: { type: String },
  username: { type: String },
  time: { type: String },
}); 
const Messages = mongoose.model("message", MessageSchema);

const MessageLikeSchema = new Schema({
  messageId: { type: String },
  messageContent: { type: String },
  email: { type: String },
  username: { type: String },
  time: { type: String },
}); 
const MessageLike = mongoose.model("messageLike", MessageLikeSchema);

export { User, Messages, MessageLike }