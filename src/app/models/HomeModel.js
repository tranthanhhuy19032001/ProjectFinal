const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const homeSchema = mongoose.Schema(
  {
    province: { type: String },
    dictrict: { type: String },
    address: { type: String },
    title: { type: String },
    typeRoom: { type: String },
    area: { type: Number },
    money: { type: Number },
    description: { type: String },
    contactName: { type: String },
    phone: { type: Number },
    images: { type: String },
    slug: { type: String, slug: 'title', unique: true },
    user: {type: mongoose.Schema.ObjectId, ref: "User"}
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
homeSchema.plugin(mongooseDelete, {
  deletedAt : true,
  overrideMethods: 'all'
})
homeSchema.virtual("users", {
  ref: "User",
  foreignField: "home",
  localField: "_id",
});
// const UserModel = mongoose.model('User', new Schema({ ... }, { collection: 'User' }));
const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
