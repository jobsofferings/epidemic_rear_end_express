import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: { type: String },
  text_md: { type: String },
  link: { type: Number },
  read: { type: Number },
});
const News = mongoose.model("new", newsSchema);

export { News }