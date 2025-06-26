const mongoose = require("mongoose");// MongoDB ile erişim kurmak için mongoose kütüphanesi dahil edildi.

const userTokenSchema = new mongoose.Schema({ //UserToken modeli için şema tanımlandı.Bu model token'larını veritabanında saklamak için kullanılacaktır.
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    //owner, token'ı oluşturan kullanıcının id'sidir.Bu sayede hangi kullanıcının token'ı olduğu bilinecek. MongoDB'de her nesnenin unique bir ObjectId'si vardır.
    // required: true, bu alanın zorunlu olduğunu belirtir ayrıca ref ile User modeline referans verildi.
    token: { type: String, required: true },
    //Her kayıtta bir JWT token vardır bu zorlundur ve string tipindedir.
    createdAt: { type: Date, default: Date.now, expires: "7d" }
    // createdAt token'ın oluşturulma tarihini tutar,varsayılan olarak şu anki tarih atanır ekstra bir tarih verilmezse.
    //expires ile token'ın 7 gün sonra otomatik olarak silinmesi sağlanır.(TTL Index)
});
module.exports = mongoose.model("UserToken", userTokenSchema);
// UserToken modeli oluşturuldu ve diğer dosyalarda kullanılmak üzere dışa aktarıldı.
