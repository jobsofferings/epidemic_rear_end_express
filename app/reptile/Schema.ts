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

const ChinaDayAddListSchema = new Schema({
  localinfectionadd: { type: Number },
  localConfirmadd: { type: Number },
  deadRate: { type: String },
  suspect: { type: Number },
  dead: { type: Number },
  infect: { type: Number },
  healRate: { type: String },
  date: { type: String },
  y: { type: String },
  confirm: { type: Number },
  heal: { type: Number },
  importedCase: { type: Number },
});
const ChinaDayAddList = mongoose.model("chinaDayAdd", ChinaDayAddListSchema);

const ProvinceCompareSchema = new Schema({
  province: { type: String },
  confirm: { type: Number },
  increase: { type: Number },
});
const ProvinceCompare = mongoose.model("province", ProvinceCompareSchema);

const ForeignListSchema = new Schema({
  name: { type: String },
  continent: { type: String },
  y: { type: String },
  date: { type: String },
  confirmAdd: { type: Number },
  confirmAddCut: { type: Number },
  confirm: { type: Number },
  suspect: { type: Number },
  dead: { type: Number },
  heal: { type: Number },
  nowConfirm: { type: Number },
  confirmCompare: { type: Number },
  nowConfirmCompare: { type: Number },
  healCompare: { type: Number },
  deadCompare: { type: Number }
});
const ForeignList = mongoose.model("foreignList", ForeignListSchema);

export { ChinaDayList, ProvinceCompare, ChinaDayAddList, ForeignList }