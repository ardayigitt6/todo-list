require('dotenv').config(); // .env dosayasını index.js dosyasına dahil ettim.
const express = require('express'); // express framework'ünü projeye dahil ettim.
const mongoose = require('mongoose'); // MongoDB bağlantısı için mongoose kütüphanesini dahil ettim.
const app = express(); // express uygulamasını(app) başalttım.
app.use(express.json()); // Sunucuya gelen verileri kolayca okuyabilmek için JSON formatına çevirir.
mongoose.connect(process.env.MONGO_URL) // .env dosyasındaki MONGO_URL ile MongoDB'ye bağlanıyor.
.then(() => console.log("MongoDB bağlantısı başarılı!")) // Bağlantı başarılıysa bu mesajı yazdırır.
.catch(err => console.error("MongoDB bağlantı hatası:", err)); // Bağlantı başarısızsa hata mesajını verir.
let todos = []; // Todo'ları görevlerini tutmak için boş bir dizi oluşturur. (**RAM'daki geçici veri**)
app.get('/todos', (req, res) => { // Tüm todo görevlerini döndüren GET endpoint'i tanımlandı.
res.json(todos); // todos dizisinde ki görevleri JSON formatında döner.
});
app.post('/todos', (req, res) => { // Yeni todo'lar eklemek için POST endpoint'i tanımlandı.
const { title } = req.body; // İstek body'sinden title'ı alır.
if (!title) { // Eğer title yoksa error döndürü.
return res.status(400).json({ error:'Başlık gerekli !'}); // Error mesajı ile 400 bad request döner.
}
const newTodo = { id: Date.now(), title: title }; //  Unique bir id ve title ile yeni bir todo oluşturur.
todos.push(newTodo); // Yeni todo'ları todos dizisine ekler.
res.status(201).json(newTodo); // Yeni todo'yu 201 Created status kodu ile döndürür..
});
app.get('/', (req, res) => { // Ana sayfa için GET endpoint'i.
res.send('Merhaba, To-Do backend çalışıyor.'); // Ana sayfada karşılama için mesaj döner.
});
app.listen(3000, () => { // Sunucuyu 3000 portunda dinlemeye başlar.
console.log('Sunucu 3000 portunda çalışıyor.'); // Sunucu başarılı bir şekilde çalıştığında konsola bu mesaj yazdırır.
});
app.put('/todos/:id', (req,res) =>{ // Todo'ları güncellemek için PUT endpoint'i.
const {id} = req.params; // İstek parametrelerinden id'yi alır. 
const {title} = req.body; // İstek body'sinden title'ı alır.
const todo = todos.find(t => t.id==Number(id)); // todos dizisinde id'si verilen todo'yu bulur.
if (!todo){ // Eğer todo bulunamazsa error döndürür.
return res.status(404).json({ error:'Todo bulunmadı!'}) // 404 Not Found status kodu ile error döner.
}
if (!title) { // Eğer title yoksa error döndürür.
return res.status(400).json({ error:'Başlık gerekli!'}); // 400 Bad Request status kodu ile error döner.
}
todo.title=title; //todo'nun title'ını günceller.
res.json(todo);// Güncellenmiş todo'yu JSON formatında döndürür.
});
app.delete ('/todos/:id', (req,res) => { // Todo'ları silmek için DELETE endpoint'i.
const {id} = req.params; // İstek parametrelerinden id'yi alır.
const index = todos.findIndex(t=> t.id==Number(id)); //Silinecek todo'nun dizideki yerini bulur.
if (index ==-1){ // Eğer index -1 ise, yani görev bulunamazsa error döndürür.
return res.status(404).json({error: 'Todo bulunmadı !'}); // 404 Not Found status kodu ile error döner.
}
todos.splice(index,1); //Görev diziden siler.
res.json({message: 'Todo silindi.'}); // Silindiğine dair mesaj döndürür.
});