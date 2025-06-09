const Todo = require("./models/Todo"); // Todo modeli projeye dahil edildi.
require("dotenv").config(); // .env dosayasını index.js dosyasına dahil ettim.
const express = require("express"); // express framework'ünü projeye dahil ettim.
const mongoose = require("mongoose"); // MongoDB bağlantısı için mongoose kütüphanesini dahil ettim.
const app = express(); // express uygulamasını(app) başalttım.
app.use(express.json()); // Sunucuya gelen verileri kolayca okuyabilmek için JSON formatına çevirir.
mongoose
  .connect(process.env.MONGO_URL) // .env dosyasındaki MONGO_URL ile MongoDB'ye bağlanıyor.
  .then(() => console.log("MongoDB bağlantısı başarılı!")) // Bağlantı başarılıysa bu mesajı yazdırır.
  .catch((err) => console.error("MongoDB bağlantı hatası:", err)); // Bağlantı başarısızsa hata mesajını verir.
app.get("/todos", async (req, res) => {
  // Tüm todo görevlerini döndüren GET endpoint'i tanımlandı. async ile await birbiriyle senkronize çalışır.
  try {
    // Hataları kontrol etmek için , eğer hata varsa catch devreye girer.
    const todos = await Todo.find(); // mongodb'deki todo koleksiyonunda ki tüm görevleri bulmak.
    res.json(todos); // todos dizisinde ki görevleri JSON formatında döner.
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); // Kodda hata olursa,"500 Sunucu hatası !!" mesajını gönderilir.
  }
});
app.post("/todos", async (req, res) => {
  // Yeni todo'lar eklemek için POST endpoint'i tanımlandı.async ile await birbiriyle senkronize çalışır.
  const { title } = req.body; // İstek body'sinden title'ı alır.
  if (!title) {
    // Eğer title yoksa error döndürü.
    return res.status(400).json({ error: "Başlık gerekli !" }); // Error mesajı ile 400 bad request döner.
  }
  try {
    // Hataları kontrol etmek için, eğer hata varsa catch devreye girer.
    const newTodo = new Todo({ title }); // yeni bir Todo nesnesi oluşturuldu.
    await newTodo.save(); // nesneyi mongodb'ye kaydeder.
    res.status(201).json(newTodo); // Yeni todo'yu 201 Created status kodu ile döndürür..
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); //Kodda hata olursa,"500 Sunucu hatası !!" mesajını gönderilir.
  }
});
app.put("/todos/:id", async (req, res) => {
  // Todo'ları güncellemek için PUT endpoint'i. async ile await birbiriyle senkronize çalışır.
  const { id } = req.params; // İstek parametrelerinden id'yi alır.
  const { title } = req.body; // İstek body'sinden title'ı alır.
  if (!title) {
    // Eğer title yoksa error döndürür.
    return res.status(400).json({ error: "Başlık gerekli!" }); // 400 Bad Request status kodu ile error döner.
  }
  try {
    // Hataları kontrol etmek için, eğer hata varsa catch devreye girer.
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    ); // Güncenlenecek todo'nun id, başlık ve güncellenmiş halini döndürür.
    if (!updatedTodo) {
      // Eğer güncenlenmemiş todo bulunamazsa error döndürür.
      return res.status(404).json({ error: "Todo bulunmadı!" }); // 404 Not Found status kodu ile error döner.
    }
    res.json(updatedTodo); // Güncellenmiş todo'yu JSON formatında döndürür.
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); //Kodda hata olursa,"500 Sunucu hatası !!" mesajını gönderilir.
  }
});
app.delete("/todos/:id", async (req, res) => {
  // Todo'ları silmek için DELETE endpoint'i.async ile await birbiriyle senkronize çalışır.
  const { id } = req.params; // İstek parametrelerinden id'yi alır.
  try {
    // Hataları kontrol etmek için, eğer hata varsa catch devreye girer.
    const deletedTodo = await Todo.findByIdAndDelete(id); // Verilen id ile todo'yu bulup siler.
    if (!deletedTodo) {
      // Eğer silinecek todo bulunmazsa
      return res.status(404).json({ error: "Todo bulunmadı !" }); // 404 Not Found status kodu ile error döner.
    }
    res.json({ message: "Todo silindi." }); // Silindiğine dair mesaj döndürür.
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); //Kodda hata olursa,"500 Sunucu hatası !!" mesajını gönderilir.
  }
});
app.patch("/todos/:id/complete", async (req, res) => {
  // Bir todo'yu tamamlandı yapmak için PATCH endpoint'ini kullanıldı.
  const { id } = req.params; // İstek parametrelerinden id'yi alır.
  try {
    // Hataları kontrol etmek için, eğer hata var ise catch devreye girer.
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    ); // Güncelenecek todo'nun id, completed alanı doğru yapılır yani (tamamlandı olarak işaretlenir) ve güncellenmiş halini döndürür.
    if (!updatedTodo) {
      // Eğer güncellencek todo bulunamazsa
      return res.status(404).json({ error: "Todo bulunmadı !" }); // 404 Not Found status kodu ile hata döner.
    }
    res.json(updatedTodo); // Güncellenmiş todo'yu JSON formatında döndürür.
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); //Kodda hata olursa,"500 Sunucu hatası !!" mesajını gönderilir.
  }
});
app.get("/", (req, res) => {
  // Ana sayfa için GET endpoint'i.
  res.send("Merhaba, To-Do backend çalışıyor."); // Ana sayfada karşılama için mesaj döner.
});
app.listen(3000, () => {
  // Sunucuyu 3000 portunda dinlemeye başlar.
  console.log("Sunucu 3000 portunda çalışıyor."); // Sunucu başarılı bir şekilde çalıştığında konsola bu mesaj yazdırır.
});

// Kodun düzenli ve okunabilir olması için otomatik formatlama işlemi uyguladım.

