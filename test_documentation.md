# To-Do List Projesi Test Dokümanı

## 1. Proje Bilgileri
- **Proje Adı:** To-Do List (Node.js + React + MongoDB)
- **Test Eden:** Arda Yiğit  
- **Test Tarihi:** 12.06.2025  
- **Backend Portu:** 5000  
- **Frontend Portu:** 3000  

## 2. Test Edilen Özellikler / Fonksiyonlar

| Test No | Özellik/Fonksiyon           | Beklenen Sonuç                                       | Sonuç    |
|---------|-----------------------------|------------------------------------------------------|----------|
| 1       | To-Do Görevlerini Listeleme | Tüm görevler listelenmeli                            | Başarılı |
| 2       | Yeni Görev Oluşturma        | Girilen başlıkla yeni görev eklenmeli                | Başarılı |
| 3       | Görev Güncelleme            | Seçili görev ismi güncellenmeli                      | Başarılı |
| 4       | Görev Tamamlama             | Tamamla tuşuna basınca "completed: true" olmalı      | Başarılı |
| 5       | Görev Silme                 | İlgili görev silinmeli                               | Başarılı |
| 6       | Boş Başlıkla Görev Ekleme   | Hata mesajı dönmeli                                  | Başarılı |
| 7       | API’ye Erişim (CORS)        | Frontend'den başarılı bağlantı kurulmalı             | Başarılı |
| 8       | 404 Hatalı ID ile Güncelle  | “Todo bulunmadı” mesajı dönmeli                      | Başarılı |
| 9       | Sunucu Açılma               | Port 5000’de backend, 3000’de frontend açılmalı      | Başarılı |

## 3. Test Senaryoları

### Senaryo 1: Görev Listeleme
- **Adım:** /todos endpoint’ine GET isteği at.
- **Beklenen:** Veri tabanındaki tüm görevler JSON olarak gelir.

### Senaryo 2: Yeni Görev Ekleme
- **Adım:** /todos endpoint’ine POST isteği at, body: `{ "title": "Alışveriş yap" }`
- **Beklenen:** 201 Created kodu ve yeni görev dönmeli.

### Senaryo 3: Görev Güncelleme
- **Adım:** /todos/:id endpoint’ine PUT isteği, yeni title gönder.
- **Beklenen:** Görev başlığı değişmeli, 200 OK dönmeli.

### Senaryo 4: Görev Tamamlama
- **Adım:** /todos/:id/complete endpoint’ine PATCH isteği.
- **Beklenen:** `completed:true` olarak güncellenir, JSON döner.

### Senaryo 5: Görev Silme
- **Adım:** /todos/:id endpoint’ine DELETE isteği at.
- **Beklenen:** "Todo silindi." mesajı gelmeli.

### Senaryo 6: Boş Başlık Hatası
- **Adım:** POST /todos, `{ "title": "" }` body ile gönder.
- **Beklenen:** 400 Hatası ve “Başlık gerekli!” mesajı.

## 4. Test Sonuçları
- Tüm testler başarıyla geçti.

## 5. Notlar
- Her endpoint hem Postman hem React arayüzü ile test edildi.
- Backend ve Frontend ayrı portlarda, CORS problemi yaşanmadı.
- Son güncellemeler commit/push edildi.

