import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ChinaDayListSchema = new Schema({
  suspect: { type: Number },
  localConfirm: { type: Number },
  noInfectH5: { type: Number },
  dead: { type: Number },
  heal: { type: Number },
  deadRate: { type: String },
  healRate: { type: String },
  noInfect: { type: Number },
  localConfirmH5: { type: Number },
  confirm: { type: Number },
  nowConfirm: { type: Number },
  importedCase: { type: Number },
  date: { type: String },
  y: { type: String },
  nowSevere: { type: Number },
});
const ChinaDayList = mongoose.model("china", ChinaDayListSchema);


export { ChinaDayList }