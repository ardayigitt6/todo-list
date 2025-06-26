const mongoose = require("mongoose"); // moongose kütüphensini şemaya dahil ettim.
const userSchema = new mongoose.Schema({
  // User bilgilerinin nasıl tutulacağını belirten şema tanımlandı.
  username: { type: String, required: true, unique: true }, // username string tipinde.zorunlu ve unique olması gerekiyor.
  password: { type: String, required: true }, //password string tipinde ve zorunlu olması gerekiyor.
});
module.exports = mongoose.model("User", userSchema); // User modeli oluşturulup dışarıya aktarıldı.
