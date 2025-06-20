const Todo = require("./models/Todo"); // Todo modeli projeye dahil edildi.
require("dotenv").config(); // .env dosayasını index.js dosyasına dahil ettim.
const express = require("express"); // express framework'ünü projeye dahil ettim.
const cors = require("cors"); // CORS ayarlamalarını yapmak için cors kütüphanesini projeye dahil edildi.
const mongoose = require("mongoose"); // MongoDB bağlantısı için mongoose kütüphanesini dahil ettim.
const app = express(); // express uygulamasını(app) başalttım.
app.use(express.json()); // Sunucuya gelen verileri kolayca okuyabilmek için JSON formatına çevirir.
app.use(cors()); // CORS ayarlarını yapar, böylece farklı domainlerden gelen istekler kabul edelir.
mongoose
  .connect(process.env.MONGO_URL) // .env dosyasındaki MONGO_URL ile MongoDB'ye bağlanıyor.
  .then(() => console.log("MongoDB bağlantısı başarılı!")) // Bağlantı başarılıysa bu mesajı yazdırır.
  .catch((err) => console.error("MongoDB bağlantı hatası:", err)); // Bağlantı başarısızsa hata mesajını verir.
app.get("/todos", async (req, res) => {
  // Tüm todo görevlerini döndüren GET endpoint'i tanımlandı. async ile await birbiriyle senkronize çalışır.
  try {
    // Hataları kontrol etmek için , eğer hata varsa catch devreye girer.
    const page = parseInt(req.query.page) || 1; // URL'den page parametresi al, yoksa otomatik olarak 1.sayfa olur.Yani kaçıncı sayfa isteniyorsa onu veriyor.
    const limit = parseInt(req.query.limit) || 10; // URL'den limit parametresi al, yoksa otomatik olarak 10'da olur.Yani her sayfada kaç tane todo olacağını belirliyor.
    const search = (req.query.search || "").trim(); //URL'den search parametresi alıyor, yoksa boş tring döner, burada mantık arama kelimesidir..trim() ile Elinde kalan stringin başındaki ve sonundaki boşlukları siler.

    const skip = (page - 1) * limit; // İstenen sayfaya kadar kaç tane todo'nun atlayacağını hesaplar.

    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    //query nesnesi oluşturuldu. title alanında search kelimeyi arar, regex (regular expression=düzenli ifade) ile arar.
    //$options: "i" kısmında ise büyük-küçük harf duyarsız (case-insensitive) vardır.Yani bu satırda amaç title'da aradığın kelimeleri geçen todo'ları bulmaktır.
    // Eğer arama yoksa tüm todo'ları getirir.
    const totalTodos = await Todo.countDocuments(query);
    // Veritabanında query'e göre kaç tane todo olduğunu sayar, await ile bitmesi beklenir sonuç sayı olarak döner.
    // Eğer arama varsa ona uygun olarak sadece filtrelenenlerin sayısını gösterir.
    const todos = await Todo.find(query).skip(skip).limit(limit);
    //Veritabanında query ile todo'ları bulup, skip kısmıyla kaç kayıt atlanacağını ve limit kısmıylada kaç tane kayıt alınacağını ayarlıyor.
    //Yani pagination ve search kısmı birlikte uygulanıyor böylece sadece istenen arlıkta ki kayıtlar(todo'lar) dönüyor.

    res.json({
      // JSON formatında cevap/response döndürülüyor.
      currentPage: page, //Anlık sayfa numarasını döndürür.
      totalPages: Math.ceil(totalTodos / limit), //Toplam sayfa sayısını döndürür.Math.ceil ile sayfa sayısı tam değilse sayıyı yuvarlma işlemi yapılır.
      totalTodos,
      todos,
      // şuan ki sayfa, toplam sayfa sayısı-burada Math.ceil ile sayfa sayısı tam değilse yukarı yuvarlanır- ,toplam todo sayısı ve o sayfada ki todo'ların dizisi
    });
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
app.listen(5000, () => {
  // Sunucuyu 5000 portunda dinlemeye başlar.
  console.log("Sunucu 5000 portunda çalışıyor."); // Sunucu başarılı bir şekilde çalıştığında konsola bu mesaj yazdırır.
});

// Kodun düzenli ve okunabilir olması için otomatik formatlama işlemi uyguladım.
