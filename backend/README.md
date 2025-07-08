# To-Do List Projesi

## Proje Tanımı
Bu proje; **Node.js** (Express.js) tabanlı bir backend, **React.js** tabanlı bir frontend ve **MongoDB** veri tabanı kullanılarak geliştirilen basit bir “To-Do List” (Yapılacaklar Listesi) uygulamasıdır.

Kullanıcılar yeni görev ekleyebilir, güncelleyebilir, tamamlandığını işaretleyebilir ve silebilir.

---

## Kullanılan Teknolojiler
- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Veri Tabanı:** MongoDB (Mongoose)

---

## Kurulum ve Çalıştırma

### 1. Backend (Sunucu)
1. Proje klasöründe terminal aç.
2. Bağımlılıkları kur:
   ```sh
   npm install
3. .env dosyası oluştur ve içerisine şunu ekle:
    MONGO_URL=your_mongodb_connection_string
4. Sunucuyu başlat.
   ```sh```
    node index.js
    Sunucu başarılı şekilde başlarsa:'Sunucu 5000 portunda çalışıyor.'mesajını görmelisin.

### 2. Frontend (İstemci)
1. todo-list-frontend klasörüne geç:
    ```sh
    cd todo-list-frontend
2. Bağımlılıkları kur:
    ```sh
    npm install
3. React uygulamasını başlat:
    ```sh
    npm start
    Tarayıcıda otomatik olarak '192.168.68.65:3000' açılır.

---

## Kullanım
- Ana sayfa üzerinden tüm görevleri görebilir, yeni görev ekleyebilir, mevcut görevleri güncelleyebilir, tamamlandığını işaretleyebilir veya silebilirsin.

---

## API Endpointleri
| Yöntem | URL                   | Açıklama                           |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/todos`              | Tüm görevleri getirir              |
| POST   | `/todos`              | Yeni görev ekler                   |
| PUT    | `/todos/:id`          | Görev günceller                    |
| DELETE | `/todos/:id`          | Görev siler                        |
| PATCH  | `/todos/:id/complete` | Görevi tamamlandı olarak işaretler |

---

## Test Edilen Özellikler
- Görev ekleme, güncelleme, silme, tamamla
- Hatalı isteklerde (ör. boş başlık) hata mesajı
- React arayüzü ile canlı veri gösterimi
- API endpointleri Postman ile test edildi
- Frontend ve backend CORS ile sorunsuz haberleşti

---

## Geliştirici Notları
- Proje geliştirilirken Git ile versiyon kontrolü yapıldı.
- Her commit, önemli bir adım sonrası güncellendi.
- Son değişiklikler GitHub'a push edildi.
- Kodun tamamı açıklamalı ve geliştirilmeye açıktır.

---

## Lisans
- Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.  

echo "# Test Deploy123" >> README.md







