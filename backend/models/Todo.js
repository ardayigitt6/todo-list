const mongoose = require("mongoose"); // mongoose kütüphenesi projeye dahil edildi.
const TodoSchema = new mongoose.Schema({
  // todo verileri için şema oluşturuldu.
  title: { type: String, required: true }, // title olmak zorunda, string yapısında olmalı ve boş bırakılmamalı
  completed: { type: Boolean, default: false }, // boolean yapısı ile görev tamamalandı mı bilgisi alıncak, varsayılan false.
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //owner bu todo'nun kime ailt olduğunu gösterir, ObjectId tipinde ve User modeline referans verir ayrıca bu alan zorunludur.
  createdAt: { type: Date, default: Date.now}
});
module.exports = mongoose.model("Todo", TodoSchema); // bu dosyada ki kodları başka dosyaların kullanabilmesi için dışarayı aktırıldı.
