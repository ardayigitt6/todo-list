const jwt = require("jsonwebtoken"); // Token oluşturmak ve doğrulamak için jsonwebtoken kütüphanesini dahil edildi.
const UserToken = require("../models/UserToken"); // UserToken modeli dahil edildi.token'ların veritabanında tutulduğu yerdir.

async function auth(req, res, next) { // Middleware fonksiyonu oluşturuldu. Bu fonksiyon route'lara erişim kontrolü yapacak.
    // Route'ın başına auth eklenince o route korumalı hale gelir yani giriş yapmamış biri buna erişemez. async function olarak tanımlandı çünkü veritabanında sorgusu bekleeyecek.
    const authHeader = req.headers.authorization; // İstek başlıklarından authorization bilgisi alındı.
    if (!authHeader || !authHeader.startsWith("Bearer ")) { // Eğer authorization bilgisi/başlığı yoksa veya Bearer ile başlamıyorsa error döner.
        return res.status(401).json({ error: " Yetkisiz istek !" });   //Yani kullanıcı token göndermemişse veya yanlış bir token göndermişse bu hata mesajı döner. 
    }
    const token = authHeader.split(" ")[1]; //split fonsiyonu ile Bearer ve token ayrıştırıldı. [1] ile token kısmı alındı.
    try { // Try-catch bloğu ile token doğrulaması yapıldı yani token veritabanında var mı diye kontrol edildi.
        const found = await UserToken.findOne({ token }); // UserToken'den bu token kayıtlı mı diye sorgulandı.
        if (!found) return res.status(401).json({ error: "Token geçersiz!!!" }); //Eğer token bulunamazsa yani veritabanında yoksa error mesajı döner.
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // decoded değişkenine jwt.verify ile token doğrulandı.Token hala geçrli mi, imzası ve süresi dolmuş mu diye kontrol edildi.
        // process.env.JWT_SECRET ile secret key alındı.
        req.user = decoded; // Eğer token geçerliyse, decoded bilgisi req.user'a atandı. Bu sayede sonraki route'larda req.user.Id, req.username gibi bilgilere erişilebilir.
        next(); // next() ile middleware'den geçiş izni verildi yani bir sonraki aşamaya/route'a geçilebilir.
    } catch (err) { //Eğer token doğrulaması sırasında yani decoded jwt.verify kısmında bir hata oluşursa catch bloğu çalışır.
        res.status(401).json({ error: "Geçersiz token!" }); //Bu durumda error mesajı döner yani token geçersiz,süresi dolmuş veyahut imzası hatalıysa bu error mesajı döner.
    }
}
module.exports = auth; // Başka dosyalarda kullabilmesi için auth middleware fonksiyonu dışa aktarıldı.


