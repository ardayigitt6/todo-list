require("dotenv").config(); // .env dosayasını index.js dosyasına dahil ettim.

const auth = require("./middleware/auth"); // auth middleware'i projeye dahil edildi.Kullanıcı kimlik doğrulaması için kullanılır.
const express = require("express"); // express framework'ünü projeye dahil ettim.
const mongoose = require("mongoose"); // MongoDB bağlantısı için mongoose kütüphanesini dahil ettim.
const cors = require("cors"); // CORS ayarlamalarını yapmak için cors kütüphanesini projeye dahil edildi.
const authController = require("./controllers/authController");
const todoController = require("./controllers/todoController");

const app = express(); // express uygulamasını(app) başalttım.
app.use(express.json()); // Sunucuya gelen verileri kolayca okuyabilmek için JSON formatına çevirir.
app.use(cors()); // CORS ayarlarını yapar, böylece farklı domainlerden gelen istekler kabul edelir.

mongoose
  .connect(process.env.MONGO_URL) // .env dosyasındaki MONGO_URL ile MongoDB'ye bağlanıyor.
  .then(() => console.log("MongoDB bağlantısı başarılı!")) // Bağlantı başarılıysa bu mesajı yazdırır.
  .catch((err) => console.error("MongoDB bağlantı hatası:", err)); // Bağlantı başarısızsa hata mesajını verir.

// AUTH routes 
app.post("/register", authController.register);
app.post("/login", authController.login);
app.post("/logout", auth, authController.logout);

// TODO routes
app.get("/todos", auth, todoController.getTodos);
app.post("/todos", auth, todoController.createTodo);
app.put("/todos/:id", auth, todoController.updateTodo);
app.delete("/todos/:id", auth, todoController.deleteTodo);
app.patch("/todos/:id/complete", auth, todoController.toggleComplete);

// HOME   
app.get("/", (req, res) => { // Ana sayfa için GET endpoint'i.
  res.send("Merhaba, To-Do backend çalışıyor."); // Ana sayfada karşılama için mesaj döner.
});
app.listen(5000, "0.0.0.0", () => { // Sunucuyu 5000 portunda dinlemeye başlar.
  console.log("Sunucu 5000 portunda çalışıyor."); // Sunucu başarılı bir şekilde çalıştığında konsola bu mesaj yazdırır.
});


