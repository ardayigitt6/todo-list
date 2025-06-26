require("dotenv").config(); // .env dosayasını index.js dosyasına dahil ettim.

const Todo = require("./models/Todo"); // Todo modeli projeye dahil edildi.
const User = require("./models/User") // User modeli projeye dahil edildi.
const UserToken = require("./models/UserToken");//UserToken modeli projeye dahil edildi.
const auth = require("./middleware/auth"); // auth middleware'i projeye dahil edildi.Kullanıcı kimlik doğrulaması için kullanılır.

const express = require("express"); // express framework'ünü projeye dahil ettim.
const mongoose = require("mongoose"); // MongoDB bağlantısı için mongoose kütüphanesini dahil ettim.
const cors = require("cors"); // CORS ayarlamalarını yapmak için cors kütüphanesini projeye dahil edildi.
const bcrypt = require("bcryptjs"); //Şifreleri hashlemek için bcyrptjs kütüphanesi dahil edildi.
const jwt = require("jsonwebtoken"); // Kullanıcı girişlerinde kimlik doğrulama için jwt kütüphanesi dahil edildi.

const app = express(); // express uygulamasını(app) başalttım.
app.use(express.json()); // Sunucuya gelen verileri kolayca okuyabilmek için JSON formatına çevirir.
app.use(cors()); // CORS ayarlarını yapar, böylece farklı domainlerden gelen istekler kabul edelir.

mongoose
  .connect(process.env.MONGO_URL) // .env dosyasındaki MONGO_URL ile MongoDB'ye bağlanıyor.
  .then(() => console.log("MongoDB bağlantısı başarılı!")) // Bağlantı başarılıysa bu mesajı yazdırır.
  .catch((err) => console.error("MongoDB bağlantı hatası:", err)); // Bağlantı başarısızsa hata mesajını verir.

app.post("/register", async (req, res) => { // register endpointine POST isteği geldiğinde çalışır. Yeni kullanıcı kaydı için kullanılır.
  const { username, password } = req.body; // Request body'den username ve password alınır.
  if (!username || !password) {
    return res.status(400).json({ error: "Kullanıcı adı ve şifre boş olamaz!" });
  }
  try { // Hataları kontrol etmek için try-catch bloğu kullanıldı.
    const existing = await User.findOne({ username }); // Veritabanında aynı username'e sahip bir kullanıcı var mı kontrol edilir.
    if (existing) return res.status(400).json({ error: "Sistemde böyle bir kullanıcı var !!!" }) // Eğer kullanıcı zaten var ise, error mesajı döner.
    const hashed = await bcrypt.hash(password, 10); // Girilemn şifre bcyrpt ile hashlenir. 10, hashl işleminin zorluğunu belirtir.
    const user = new User({ username, password: hashed }); //Yeni bir user nesnesi oluşturuluyor, username ve hashlenmiş şifre ile.
    await user.save();// Yeni kullanıcı veritabına kaydedilir.
    res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." }); // Kullanıcı başarıyla kaydedildiyse bu mesaj döner.
  }
  catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); // Eğer bir hata oluşursa, error mesajı döner.
  }
});

app.post("/login", async (req, res) => { // login endpointine POST isteği geldiğinde çalışır.Kullanıcı girişi için kullanılır.
  const { username, password } = req.body; // Requestbody'den username ve password alınır.
  try { // Hataları kontrol etmek için tyr-catch bloğu kullanıldı.
    const user = await User.findOne({ username }); // Veritabanında username ile eşleşen bir kullanıcı var mı diye kontrol edilir.
    if (!user) return res.status(400).json({ error: "Bu username (kullanıcı ismi) ile kayıtlı kullanıcı bulunamadı !!!" }); // Eğer kullanıcı bulunamazsa, error mesajı döner.
    const isMatch = await bcrypt.compare(password, user.password); // Girilen şifre ile veritabanındaki kayıtlı olan hashlenmiş şifreyle karşılaştırılır.
    if (!isMatch) return res.status(400).json({ error: "Girilen şifre yanlış!." }); // Eğer şifrelre birbiriyle eşleşmezse error mesajı döner.
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Eğer şifre doğruysa JWT token oluşturulur. userId ve username payload olarak eklenir, secret_key ile sign yapılır ve expiresIn ile options yapılır yanş token'ın geçerlilik süresi 1 gün olarak ayarlanır.
    await UserToken.create({ userId: user._id, token: token }); // Kullanıcı token'ı veritabanına kaydedilir.
    res.json({ token }); //Oluşturulan token JSON formatında döndürülür.
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); // Eğer bir hata oluşursa, error mesajı döner.
  }
});

app.post("/logout", auth, async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  await UserToken.deleteOne({ token });
  res.json({ message: "Çıkış yapıldı!" });
});

app.get("/todos", auth, async (req, res) => {
  // Tüm todo görevlerini döndüren GET endpoint'i tanımlandı. async ile await birbiriyle senkronize çalışır.
  try {
    // Hataları kontrol etmek için , eğer hata varsa catch devreye girer.
    const page = parseInt(req.query.page) || 1; // URL'den page parametresi al, yoksa otomatik olarak 1.sayfa olur.Yani kaçıncı sayfa isteniyorsa onu veriyor.
    const limit = parseInt(req.query.limit) || 10; // URL'den limit parametresi al, yoksa otomatik olarak 10'da olur.Yani her sayfada kaç tane todo olacağını belirliyor.
    const search = (req.query.search || "").trim(); //URL'den search parametresi alıyor, yoksa boş tring döner, burada mantık arama kelimesidir..trim() ile Elinde kalan stringin başındaki ve sonundaki boşlukları siler.

    const skip = (page - 1) * limit; // İstenen sayfaya kadar kaç tane todo'nun atlayacağını hesaplar.

    const query = { userId: req.user.userId, ...(search ? { title: { $regex: search, $options: "i" } } : {}) };
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

app.post("/todos", auth, async (req, res) => {
  // Yeni todo'lar eklemek için POST endpoint'i tanımlandı.async ile await birbiriyle senkronize çalışır.
  const { title } = req.body; // İstek body'sinden title'ı alır.
  if (!title) {
    // Eğer title yoksa error döndürü.
    return res.status(400).json({ error: "Başlık gerekli !" }); // Error mesajı ile 400 bad request döner.
  }
  try {
    // Hataları kontrol etmek için, eğer hata varsa catch devreye girer.
    const newTodo = new Todo({ title, userId: req.user.userId }); // yeni bir Todo nesnesi oluşturuldu.
    await newTodo.save(); // nesneyi mongodb'ye kaydeder.
    res.status(201).json(newTodo); // Yeni todo'yu 201 Created status kodu ile döndürür..
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); //Kodda hata olursa,"500 Sunucu hatası !!" mesajını gönderilir.
  }
});

app.put("/todos/:id", auth, async (req, res) => {
  // Todo'ları güncellemek için PUT endpoint'i. async ile await birbiriyle senkronize çalışır.
  const { id } = req.params; // İstek parametrelerinden id'yi alır.
  const { title } = req.body; // İstek body'sinden title'ı alır.
  if (!title) {
    // Eğer title yoksa error döndürür.
    return res.status(400).json({ error: "Başlık gerekli!" }); // 400 Bad Request status kodu ile error döner.
  }
  try {
    // Hataları kontrol etmek için, eğer hata varsa catch devreye girer.
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
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

app.delete("/todos/:id", auth, async (req, res) => {
  // Todo'ları silmek için DELETE endpoint'i.async ile await birbiriyle senkronize çalışır.
  const { id } = req.params; // İstek parametrelerinden id'yi alır.
  try {
    // Hataları kontrol etmek için, eğer hata varsa catch devreye girer.
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId: req.user.userId }); // Verilen id ile todo'yu bulup siler.
    if (!deletedTodo) {
      // Eğer silinecek todo bulunmazsa
      return res.status(404).json({ error: "Todo bulunmadı !" }); // 404 Not Found status kodu ile error döner.
    }
    res.json({ message: "Todo silindi." }); // Silindiğine dair mesaj döndürür.
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası !!" }); //Kodda hata olursa,"500 Sunucu hatası !!" mesajını gönderilir.
  }
});

app.patch("/todos/:id/complete", auth, async (req, res) => {
  // Bir todo'yu tamamlandı yapmak için PATCH endpoint'ini kullanıldı.
  const { id } = req.params; // İstek parametrelerinden id'yi alır.
  try {
    const todo = await Todo.findOne({ _id: id, userId: req.user.userId });
    if (!todo) {
      return res.status(404).json({ error: "Todo bulunmadı !" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
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
