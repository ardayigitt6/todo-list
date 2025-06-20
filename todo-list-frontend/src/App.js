import React, { useState, useEffect } from "react"; // React kütüphanesi ve gerekli hook'lar (useState,useEffect) içe aktarıldı.
function App() {
  // Ana fonksiyonel bileşen tanımlandı.
  const [todos, setTodos] = useState([]); // todos adında başlangıçta içi boş bir state tanımlandı, setTodos ise bu diziyi update eder.
  const [newTodo, setNewTodo] = useState(""); // Yeni bir todo eklerken input kısmına yazdığı metini state değişkeninde sakalar.
  const [search, setSearch] = useState(""); // Kullanıcının arama kısmına yazdığı şeyler burada tutuluyor.
  const [page, setPage] = useState(1); // Anlık olarak kaçıncı sayfa gösterildiğini tutar.
  const [limit] = useState(10); // Her sayfada kaç tane todo gösterileceğini tutar.
  const [totalTodos, setTotalTodos] = useState(0); // Toplam kaç todo olduğunu tutar.
  const [totalPages, setTotalPages] = useState(1); // Toplam kaç sayfa olduğunu tutar.
  const [editId, setEditId] = useState(null); // Todo'yu düzenlemek için seçilen todo'nun id'sini tutar, eğer düzenleme yapılmıyorsa otamatik olarak boş olur.
  const [editTitle, setEditTitle] = useState(""); // Todo'yu düzenlerken input kısmına yazdığın yazıyı/texti tutar.

  useEffect(() => {
    // Bileşen ilk yüklendiğinde veya page,limit,search değişince çalışacak bir effect tanımlandı.İçinde API'ya istek atılır.
    fetch(
      `http://localhost:5000/todos?page=${page}&limit=${limit}&search=${search}`
    )
      // Belirtilen adrese get isteği atar ve backend'de ki tüm todo'ları ve pagination bilgilerini çeker
      .then((res) => res.json()) // Gelen cevabı JSON formatına döndürür.
      .then((data) => {
        setTodos(data.todos); // Cevap gelince seTodos state'ini günceller.
        setTotalTodos(data.totalTodos); // Cevap gelince setTotalTodos state'ini günceller.
        setTotalPages(data.totalPages); // Cevap gelince setTotalPages state'ini günceller.
      });
  }, [page, limit, search]); // page,limit veya search değiştiğinde bu effect tekrar çalışır ve yeni todo verilerini çeker.

  const handleAddTodo = (e) => {
    // Yeni bir todo ekleme işlemini gerçekleştiren fonksiyon. (e), olay parametresi (event object).
    e.preventDefault(); // Formun varsayılan davranışını yani sayfa yenilemeyi engeller.
    if (!newTodo.trim()) return; // Eğer input'a hiçbir şey yazılmadıysa veya boş bırakıldıysa fonksiyon durur.
    fetch("http://localhost:5000/todos", {
      //Backend'e yeni todo ekleme için POST isteği atar.
      method: "POST", // HTTP isteğinin türünü belirtir.Yeni veri eklemek için HTTP metodunu POST olarak ayarlar.
      headers: { "Content-Type": "application/json" }, // Gönderilen verinin JSON formatında olduğunu gösterir.
      body: JSON.stringify({ title: newTodo }), // Gönderilicek veriyi bir nesne olarak JSON string'e çevir ve isteiğini body kısmına ekler.
    })
      .then((res) => res.json()) // Gelen cevabı JSON formatına çevirir.
      .then((added) => {
        // Backend'den gelen yeni newTodo nesnesi added olarak gelir.
        setNewTodo(""); // Input kutusu temizlenir böylece yeni todo yazılmak için hazır olur.
        setPage(1); // Sayfayı ilk başa döndürür.
        setSearch(""); // Arama kutusunu temizler.
        fetch(`http://localhost:5000/todos?page=1&limit=${limit}&search=`)
          .then((res) => res.json()) // cevapları JSON formatına çevirir.
          .then((data) => {
            setTodos(data.todos); // Yeni eklenen todo'yu ve todos state'sini günceller.
            setTotalTodos(data.totalTodos); // Toplam todo sayısını günceller.
            setTotalPages(data.totalPages); //Toplam sayfa sayısını günceller.
          });
      });
  };

  const handleDelete = (id) => {
    // Silme butonuna tıklanırsa todo'nun unique id'si ile, silme işlemi başlatır.
    fetch(`http://localhost:5000/todos/${id}`, {
      //Backend'e DELETE isteği gönderir.
      method: "DELETE", // HTTP isteiğinin türü DELETE olarak ayarlanır.
    })
      .then((res) => res.json()) // Gelen cevabı JSON formatına çevirir.
      .then((result) => {
        // Bir üstteki then’den dönen veri burada result olarak alınır.
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
        // prev önceki todos listesidir. filter ile id'si silinen todo'yu çıkarır diğerlerini bırakır. Amaç, silinen todo'nun anında kaybolmasını sağlamak.
      });
  };

  const handleUpdate = (id) => {
    //Güncelleme butonuna tıklanırsa todo'nun unique id'si ile güncelleme işlemi başlatır.
    if (!editTitle.trim()) return; // Eğer input kutusu boşsa veya sadece boşluk varsa işlem durur. trim() ile başındaki ve sonundaki boşluklar silinir.
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT", // HTTP isteiğinin türü PUT olarak ayarlanır.
      headers: { "Content-Type": "application/json" }, // Gönderilen verinin içeriğinin JSON formatında olduğunu gösterir.
      body: JSON.stringify({ title: editTitle }), // Güncelleme için yeni title içeren bir JSON string yapısında body kısmına ekler.strinfiy ile nesneyi JSON formatına çevirildi.
    })
      .then((res) => res.json()) // Gelen cevapları JSON formatına çevirir.
      .then((updated) => {
        //
        setTodos(
          (prev) => prev.map((todo) => (todo._id === id ? updated : todo)) // prev önceki todos listesidir. map ile her todo'yu kontrol eder, eğer id'si güncellenen todo ile eşleşiyorsa updated nesnesini kullanır, eğer eşleşmiyorsa eski todo'yu bırakır.
        );
        setEditId(null); // Güncelleme işlemi tamamlandığında editId'yi null'a çeker ve düzenleme modundan çıkarır.
        setEditTitle(""); // Düzenleme inputunu temizler, boş bırakır.
      })
      .catch((err) => console.error("Güncelleme hatası:", err)); // Eğer uptade sırasında bir hata olursa konsola error mesajı yazdırır.
  };

  const handleComplete = (id) => {
    // Tamamlandı butonuna tıklanırsa todo'nun unique id'si ile tamamlanma işlemi başlatır.
    fetch(`http://localhost:5000/todos/${id}/complete`, {
      method: "PATCH", // HTTP isteiğinin türü PATCH olarak ayarlanır.
    })
      .then((res) => res.json()) // Gelen cevapları JSON formatına çevirir.
      .then((updated) => {
        //Güncellenen todo nesnesi updated şekilde yazar.
        setTodos(
          (prev) => prev.map((todo) => (todo._id === id ? updated : todo)) //map ile her todo'yu kontrol eder, eğer id'si tamamlanan todo ile eşleşiyorsa updated nesnesini kullanır, eğer eşleşmiyorsa eski todo'yu bırakır.
        );
      });
  };

  return (
    <div>
      {" "}
      {/* Ana kapsayıcı element,tüm içeriği bir çatı altında toplar.*/}
      <h1> To-Do List </h1> {/* Sayfanın başlığı */}
      <form onSubmit={handleAddTodo}>
        {" "}
        {/* onSubmit özelliği sayesinde, form gönderilince handleAddTodo fonksiyonu çağırılır. */}
        <input
          type="text" // Kullanıcının yazı girmesi için metin kutusu
          value={newTodo} // Bu inputin içindeki değer newTodo state'ten gelir bu işleme controlled component denir.
          onChange={(e) => setNewTodo(e.target.value)} // Her tuşa basıldıkça newTodo güncellenir.
          placeholder="Yeni görev ekle" // Kutuya bişi yazılmadan önce "Yeni görev ekle" yazısı görülür maksat kullanıcıyı bilgilendiren geçici yazı.
        />
        <button type="submit">Ekle</button>{" "}
        {/* Butona tıklayınca form submit edilir, handleAddTodo fonksiyonu çağırılır.*/}
      </form>
      <input
        type="text" // Normal yazı inputu, kullanıcıya arama imkanı verir.
        placeholder="Ara..." // Arama kutusu için placeholder.
        value={search} // Değeri search state'inden gelir.
        onChange={(e) => {
          setSearch(e.target.value); // Her değişiklikte search güncellenir.
          setPage(1); // Arama yapılınca sayfa 1'e çekilir.
        }}
        style={{ marginTop: "10px", marginBottom: "10px" }} // Arama kutusunun üst-alt boşlukl ayarları.
      />
      <ul>
        {" "}
        {/* unordered list yani todo maddelerini liste halinde gösterecek kapsayıcı, yapılacaklar listesi için bir sırasız liste */}
        {todos.map((todo) =>
          // todos dizisinde ki her bir todo için döngü başlatılır.
          editId === todo._id ? ( // Eğer  todo'nun id'si editId ile eşleşiyorsa
            <li key={todo._id}>
              {" "}
              {/* Her todo'nun unique id'sini key olarak kullanır, düzenleme modunda gösterir. */}
              <input
                value={editTitle} // Düzenleme inputunun değeri editTitle state'inden gelir.
                onChange={(e) => setEditTitle(e.target.value)} // Her değişiklikte editTitle güncellenir.
              />
              <button onClick={() => handleUpdate(todo._id)}>KAYDET</button>{" "}
              {/* Butona tıklayınca todo'nun id'siyle handleUpdate fonksiyonu çağrılır. */}
              <button onClick={() => setEditId(null)}>İPTAL</button>{" "}
              {/* İptal butonuna tıklayınca düzenleme modundan çıkarır ve editId'yi boş bırakır. */}
            </li>
          ) : (
            <li key={todo._id}>
              {/* Her todo'nun unique id'sini key olarak kullanır, başlık ve tamamlandı bilgisini gösterir. */}
              {todo.title} {todo.completed ? "(Tamamlandı)" : ""}
              {/* todo'nun başlığını gösterir, eğer todo tamamlandıysa parantez içinde belirtilit tamamlanmadı ise boş bırakılır */}
              <button
                onClick={() => {
                  setEditId(todo._id); // Düzenleme butonuna tıklayınca editId'yi todo'nun id'si ile günceller, yeni halini gösterir.
                  setEditTitle(todo.title); //Düzenleme butonuna tıklayınca editTitle'yi todo'nun başlığı ile günceller,düzenleme inputunda eski/ilk başlık gösterilir.
                }}
              >
                Düzenle
              </button>
              <button
                onClick={() => handleComplete(todo._id)} // Tamamlama butonu basınca çalışır.
                disabled={todo.completed} // Buton zaten tamamlandıysa pasif olur.
              >
                Tamamlandı
              </button>
              {/* Butona tıklanınca ilgili todo'nun id'siyle handleComplete fonksiyonu çağıırlır.  */}
              <button onClick={() => handleDelete(todo._id)}>SİL</button>{" "}
              {/* Butona tıklanınca ilgili todo'nun id'siyle handleDelete fonksiyonu çağrılır. */}
            </li>
          )
        )}
      </ul>
      <div style={{ marginTop: "10px" }}>
        {" "}
        {/* Pagination ve limit kısmı*/}
        {/* Pagination kontrollerinin üzerindeki boşluk ayarı */}
        <span>
          {" "}
          {/* Sayfanın anlık olarak kaçıncı kayıtları gösterdiğini yazar. */}
          Sayfa başına satır: {""}
          {totalTodos === 0 ? 0 : (page - 1) * limit + 1} - {""}
          {/* Gösterilen ilk kayıt numarasıdır, eğer hiç kayıt yoksa 0 yazar. */}
          {Math.min(page * limit, totalTodos)} / {totalTodos}
          {/* Gösterilen son sayfa numarasıdır, math.min fonk ile eğer son sayfa limitin katı değilse kaldı sayfa sayısında bırakır. */}
        </span>
        {""}
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          {" "}
          {/*eğer 1.sayfadaysan pasif olursun, fakat diğer sayfalardaysan butona tıklanır ve önceki sayfaya gider.*/}
          {"<"} {/*geri butonu*/}
        </button>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          {" "}
          {/*eğer son sayfadaysan pasif olur, fakat diğer sayflardaysan butona tıklanır ve ileriki sayfaya gider.*/}
          {">"} {/*ileri butonu*/}
        </button>
      </div>
    </div>
  );
}
export default App; // Bu bileşeni başka dosyalarda da kullanabilmek için dışa aktarır.

// Kodun düzenli ve okunabilir olması için otomatik formatlama işlemi uyguladım.
