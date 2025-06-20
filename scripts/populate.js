require("dotenv").config(); // env dosayasını projeye dahil eder. dotenv ile env dosyasındaki MONGO_URL'yi kullanarak MongoDB'ye bağlanır.
const mongoose = require("mongoose"); // MongoDB bağlanmak ve veri işlemek için mongoose kütüphanesini dahil eder.
const Todo = require("../models/Todo"); // todo modeli projeye dahil edildi.

mongoose
  .connect(process.env.MONGO_URL) // env dosyasındaki MONGO_URL ile MongoDB'ye bağlanır.
  .then(() => {
    console.log("MongoDB bağlantısı başarılı!"); // Bağlantı başarılıysa konsola bu mesajı yazdırır.
    return seedTodos(); //Bağlantı başarılıysa seedTodos fonksiyonunu çağırır. 5000 adet todo ekler.
  })
  .catch((err) => console.error("Mongo bağlantı hatası:", err)); // Bağlantı başarısızsa error mesajını verir.

async function seedTodos() {
  // 5000 adet todo eklemek için seedTodos fonksiyonu tanımlandı asekron fonksiyon olarak.
  try {
    // Hataları kontrol etmek için try-catch kulanıldı.
    const total = await Todo.countDocuments(); // Veritabanında kaç tane todo olduğunu sayar,await ile bitmesi bekleniyor.
    if (total >= 5000) {
      // Eğer zaten 5000 veya daha fazla todo varsa,
      console.log("Zaten 5000 veya daha fazla todo var."); // Konsola bu mesajı yazar.
      process.exit(); // işlem sonlandırılır.
    }

    const todos = []; // todos adlı boş bir dizi oluşturuldu.
    for (let i = 1; i <= 5000; i++) {
      // 1'den 5000'e kadar döngü başlatıldı.
      todos.push({ title: `Görev ${i}` }); // Her döngüde Görev 1,Görev 2, ... Görev 5000 şeklinde 5000 tane todo eklenidi.
    }

    await Todo.insertMany(todos); // Hepsini tek seferde toplu olarak insertMany ile MongoDB'ye kaydeder.
    console.log(" 5000 görev başarıyla eklendi.");
    process.exit(); // işlemi sonlandırır.
  } catch (err) {
    console.error("Seed hatası:", err); // Eğer hata olursa konsola seed hata mesajını yazdırır.
    process.exit(1); // İşlemi hata kodu ile sonlandırır. process.exit(1) bri hatalı bitiş kodudur.
  }
}
