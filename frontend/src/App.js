import React, { useState, useEffect } from "react"; // React kütüphanesi ve gerekli hook'lar (useState,useEffect) içe aktarıldı.
import { apiFetch } from "./apiFetch";
import ToggleSwitch from "./ToggleSwitch";

function App() {
  // Ana fonksiyonel bileşen tanımlandı.
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loginMode, setLoginMode] = useState(true); // true: login, false: register
  const [authInfo, setAuthInfo] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");

  const [todos, setTodos] = useState([]); // todos adında başlangıçta içi boş bir state tanımlandı, setTodos ise bu diziyi update eder.
  const [newTodo, setNewTodo] = useState(""); // Yeni bir todo eklerken input kısmına yazdığı metini state değişkeninde sakalar.
  const [search, setSearch] = useState(""); // Kullanıcının arama kısmına yazdığı şeyler burada tutuluyor.
  const [page, setPage] = useState(1); // Anlık olarak kaçıncı sayfa gösterildiğini tutar.
  const [limit] = useState(10); // Her sayfada kaç tane todo gösterileceğini tutar.
  const [totalTodos, setTotalTodos] = useState(0); // Toplam kaç todo olduğunu tutar.
  const [totalPages, setTotalPages] = useState(1); // Toplam kaç sayfa olduğunu tutar.
  const [editId, setEditId] = useState(null); // Todo'yu düzenlemek için seçilen todo'nun id'sini tutar, eğer düzenleme yapılmıyorsa otamatik olarak boş olur.
  const [editTitle, setEditTitle] = useState(""); // Todo'yu düzenlerken input kısmına yazdığın yazıyı/texti tutar.

  const handleLoginOrRegister = (e) => { // Giriş yapma veya kayıt olma işlemini gerçekleştiren fonksiyon. (e) (event object) yani olay parametresidir.
    e.preventDefault(); // Sayfanın yenilenmesini engeller, form submit edildiğinde varsayılan davranışı durdurur. 
    setErrorMsg(""); // Hata mesajını temizler, böylece önceki hata mesajı kaybolur sadece hata olursa gösterilir.
    if (!authInfo.username.trim() || !authInfo.password.trim()) { //Eğer username veya password boşsa veya sadece boşluk varsa işlem durur.
      //trim() methoduyla başındaki ve sonundaki boşluklar silinir.
      setErrorMsg("Kullanıcı adı ve şifre boş olamaz!"); // Hata mesajı döner.
      return; // 
    }
    const url = loginMode // loginMode değişkinen bakılır,eğer true ise login işlemi yapılacak,false ise register işlemi yapılacak.
      ? `/login`
      : `/register`;
    apiFetch(url, { // Belirlediğimiz login veya register adresi ile backend'e fetch fonksiyonu ile istek atılır.
      method: "POST", // HTTP isteğinin türü POST olarak ayarlanır.
      headers: { "Content-Type": "application/json" }, // Gönderilen verinin JSON formatında olduğunu gösterir.
      body: JSON.stringify(authInfo), // Gönderilecek veriyi authInfo nesnesini JSON'a çevirir ve body kısmına ekler.
      //authInfo username ve password içerir.
    })
      .then(async (data) => { // Gelen cevabı bekler ve cevap gelince then bloğu asenkron olarak işleme alır.
        if (loginMode) { // Eğer loginMode true ise yani giriş yapılıyorsa
          setToken(data.token); // Token'ı state'e kaydeder bu token backend'deki kullanıcıyı tanımlamak için kullanılır
          localStorage.setItem("token", data.token); //Token'ı localStorage'a kaydeder, böylece sayfa yenilense bile token kaybolmaz.
        } else { // Eğer loginMode false ise yani kayıt olma işlemi yapılıyorsa
          setLoginMode(true); // Kayıt işlemi başarılı olduktan sonra loginMode'yi true yapar böylece kullanıcı giriş yapma aşamsına geçer.
          setAuthInfo({ username: "", password: "" }); // Kayıt işlemi başarılı olduktan sonra authInfo state'ini temizler, böylece input kutuları boş kalır, kullanıcı yeni bir giriş yapabilir.
          setErrorMsg("Kayıt başarılı! Giriş yapabilirsin."); //Kayıt işlemi başarılı olduktan sonra kullanıcıya başarılı mesajı döner.
        }
      })
      .catch((err) => {

        setErrorMsg("Sunucuya ulaşılamadı!")
      });// Eğer fetch isteği sırasında bir hata olursa error mesajı döner.
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch todos when relevant state changes
  useEffect(() => {
    if (!token) return; // Eğer token yoksa yani kullanıcı giriş yapmamışsa todos'u çekme işlemi yapılmaz.
    apiFetch(
      `/todos?page=${page}&limit=${limit}&search=${search}&shouldHideCompleted=${hideCompleted.toString()}&sortOrder=${newestFirst ? "desc" : "asc"}`
    )
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
          setTodos([]);
          setTotalTodos(0);
          setTotalPages(1);
        } else {
          setTodos(data.todos);
          setTotalTodos(data.totalTodos);
          setTotalPages(data.totalPages);
        }
      });
  }, [page, limit, search, token, hideCompleted, newestFirst]);

  if (!token) { // Eğer token yoksa yani kullanıcı giriş yapmamışsa
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", padding: 16 }}>
        {/* div yani oluşturulan kutunun genişliği max 400 piksel,üsten boşluk 40 piksel yatayda ise ortalansın, kutunun içindeki kenarlar arasında ki boşul 16 piksel ayarlandı. */}
        <h1>To-Do App</h1> {/* Başlık kısmı To-Do App olarak ayarlandı. */}
        {errorMsg && (
          <div style={{ color: "red", marginBottom: 10 }}>{errorMsg}</div>
          // Eğer errorMsg varsa yani bir hata mesajı varsa bu kırmızı renkte ve alt boşluk 10 piksel olan bir div içinde gösterilir.
        )}
        <h2>{loginMode ? "Giriş Yap" : "Kayıt Ol"}</h2>
        {/*Eğer loginMode true ise "Giriş Yap" yazısı,false ise "Kayıt Ol" yazısı gösterilir.*/}
        <form onSubmit={handleLoginOrRegister}>
          {/* Form submit edildiğinde handleLoginOrRegister fonksiyonu çağrılır. */}
          <div style={{ marginBottom: 8 }}> {/* Kullanıcı adı inputu için bir div oluşturuldu ve alt boşluğu 8 piksel ayarlandı. */}

            <input
              type="text" // Normal metin kutusu, kullanıcı adı girmek için kullanılır.
              placeholder="Kullanıcı Adı" // Input kutusunun içinde silik yazı olarak "Kullanıcı Adı" yazısı gösterilir.
              value={authInfo.username} // Input kutusunun value'si authInfo nesnesindeki username'den gelir.
              onChange={(e) => { // Her tuşa basıldığında bu fonksiyon çalışır.Girilen değeri alıp eski state'i korur sadece username'i günceller ve ekranda hata mesajı varsa temizler.
                setAuthInfo({ ...authInfo, username: e.target.value });
                if (errorMsg) setErrorMsg("");
              }}
              style={{ width: "100%", padding: 4 }} // Input kutusunun boşluk %100 genişliğe ve 4 piksel iç boşluğa sahiptir.
            />
          </div>
          <div style={{ marginBottom: 8 }}> {/*div yani oluşturulan kutunun altına 8 piksellik boşluk ayalrndı. */}
            <input
              type="password"
              // Burası kullanıcıdan şifre almak için normal metin kutusudur.Bu inputa yazılanlar ekranda nokta veya yıldız olarak görünür.
              placeholder="Şifre"  //Input kutusunun içinde silik yazı olarak "Şifre" yazısı gösterilir.
              value={authInfo.password}  // Input kutusunun valuesi authInfo nesnesindeki passwordan geliyor.
              onChange={(e) => { // Her tuşa basıldığında bu fonksiyon çalışır.Girilen değeri alıp eski state'i korur sadece password'u günceller ve ekranda hata mesajı varsa temizler.
                setAuthInfo({ ...authInfo, password: e.target.value });
                if (errorMsg) setErrorMsg("");
              }}
              style={{ width: "100%", padding: 4 }} //Input kutusunun boşluk %100 genişliğe ve 4 piksel iç boşluğa sahiptir.
            />
          </div>
          <button type="submit" style={{ width: "100%", padding: 8 }}>
            {/* Formun altına eklenmiş button elementidir, butona tıklanınca submit etmeye yarar.Butonun genişliği %100 olsun ve iç kenar boşluğu 8 piksel olsun. */}
            {loginMode ? "Giriş Yap" : "Kayıt Ol"}
            {/*Eğer loginMode true ise butonun üstünde giriş yap yazıyor false ise kayıt ol yazar. Yani login ve register arası geçişte butonun üstündeki yazı da değişiyor.*/}
          </button>
        </form>
        <button
          onClick={() => { // Butona basınca çalışacak fonksiyon 
            setAuthInfo({ username: "", password: "" })
            setLoginMode((prev) => !prev); //loginMode değişkenini terse çevirir. Login ise register'a, register ise login'e çevirir.
            setErrorMsg(""); //Her ekrana geçişte hata mesajını sıfırlıyor. Eski hata mesajı ekranda kalmasın diye.
          }}
          style={{
            marginTop: 10, // Butonun üst tarafında 10 piksel boşluk bırakıyor.
            background: "#eee", // Butonun arka planını açık griye boyar.
            border: "none", //Kenar çizgisi yoktur.
            padding: 8, //Butonun içinde 8 piksel iç boşluk bırakır.
            width: "100%", //Buton kutunun içini %100 kaplar.
          }}
        >
          {loginMode ? "Kayıt Olmak İstiyorum" : "Girişe Dön"}
          {/*Eğer loginMode true ise butonda “Kayıt Olmak İstiyorum” yazıyor, false ise "Girişe Dön" yazıyor.*/}
        </button>
      </div>
    );
  }

  const handleLogout = () => { // Çıkış yap butonuna basınca bu fonksiyon çalışıcak.
    localStorage.removeItem("token"); // token key'i ile kaydedilmiş veriyi silinir, artık kullanıcıyı tekrar otomatik tanınmaycak, yani otomatik giriş olmayacak.
    setToken(""); //Token bilgisi temizlendi, boş string verilerek şuan giriş yapmış kullanıcı yok denir.
    setTodos([]); // Dizinin içindeki todoları tamamen boşaltır.
    setAuthInfo({ username: "", password: "" })
    setErrorMsg("");//Ekranda hata mesajı varsa onu temizler.
  };

  const handleAddTodo = (e) => {
    // Yeni bir todo ekleme işlemini gerçekleştiren fonksiyon. (e), olay parametresi (event object).
    e.preventDefault(); // Formun varsayılan davranışını yani sayfa yenilemeyi engeller.
    if (!newTodo.trim()) { // Eğer input'a hiçbir şey yazılmadıysa veya boş bırakıldıysa fonksiyon durur.
      setErrorMsg("Başlık gerekli, lütfen bu alanı doldurun.!");// Error mesajı döner.
      return;
    }

    apiFetch(`/todos`, {
      //Backend'e yeni todo ekleme için POST isteği atar.
      method: "POST", // HTTP isteğinin türünü belirtir.Yeni veri eklemek için HTTP metodunu POST olarak ayarlar.
      body: JSON.stringify({ title: newTodo }), // Gönderilicek veriyi bir nesne olarak JSON string'e çevir ve isteiğini body kısmına ekler.
    })

      .then((added) => { // JSON formatına çevirilmiş data bu fosnksiyonun içine parametre olarak gelir. 
        if (added.error) { // Backend'de dönen JSON'da error diye bir alan var mı 
          setErrorMsg(added.error); // eğer added.error varsa hata mesajı döner.
          return;
        }

        setNewTodo(""); // Input kutusu temizlenir böylece yeni todo yazılmak için hazır olur.
        setErrorMsg(""); // Hata mesajı temizlenir böylece yeni todo eklenince önceki hata mesajı kaybolur.
        setPage(1); // Sayfayı ilk başa döndürür.
        setSearch(""); // Arama kutusunu temizler.
        apiFetch(`/todos?page=1&limit=${limit}&search=`, {
        })
          .then((data) => {
            setTodos(data.todos); // Yeni eklenen todo'yu ve todos state'sini günceller.
            setTotalTodos(data.totalTodos); // Toplam todo sayısını günceller.
            setTotalPages(data.totalPages); //Toplam sayfa sayısını günceller.
          });
      });
  };

  const handleDelete = (id) => {
    // Silme butonuna tıklanırsa todo'nun unique id'si ile, silme işlemi başlatır.
    apiFetch(`/todos/${id}`, {
      //Backend'e DELETE isteği gönderir.
      method: "DELETE", // HTTP isteiğinin türü DELETE olarak ayarlanır.
    })
      .then((result) => {
        // Bir üstteki then’den dönen veri burada result olarak alınır.
        if (result.error) {
          setErrorMsg(result.error);
          return;
        }
        setErrorMsg(""); // Hata mesajı temizlenir böylece önceki hata mesajı kaybolur.
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
        // prev önceki todos listesidir. filter ile id'si silinen todo'yu çıkarır diğerlerini bırakır. Amaç, silinen todo'nun anında kaybolmasını sağlamak.
      });
  };

  const handleUpdate = (id) => {
    //Güncelleme butonuna tıklanırsa todo'nun unique id'si ile güncelleme işlemi başlatır.
    if (!editTitle.trim()) { // Eğer input kutusu boşsa veya sadece boşluk varsa işlem durur. trim() ile başındaki ve sonundaki boşluklar silinir.
      setErrorMsg("Başlık gerekli, lütfen bu alanı doldurun.!");
      return;
    }
    apiFetch(`/todos/${id}`, {
      method: "PUT", // HTTP isteiğinin türü PUT olarak ayarlanır.
      body: JSON.stringify({ title: editTitle }), // Güncelleme için yeni title içeren bir JSON string yapısında body kısmına ekler.strinfiy ile nesneyi JSON formatına çevirildi.
    })
      .then((updated) => {
        if (updated.error) {
          setErrorMsg(updated.error);
          return;
        }
        setTodos(
          (prev) => prev.map((todo) => (todo._id === id ? updated : todo)) // prev önceki todos listesidir. map ile her todo'yu kontrol eder, eğer id'si güncellenen todo ile eşleşiyorsa updated nesnesini kullanır, eğer eşleşmiyorsa eski todo'yu bırakır.
        );
        setEditId(null); // Güncelleme işlemi tamamlandığında editId'yi null'a çeker ve düzenleme modundan çıkarır.
        setEditTitle(""); // Düzenleme inputunu temizler, boş bırakır.
        setErrorMsg(""); // Hata mesajını temizler böylece önceki hata mesajı kaybolur.
      })
      .catch((err) => console.error("Güncelleme hatası:", err)); // Eğer uptade sırasında bir hata olursa konsola error mesajı yazdırır.
  };

  const handleComplete = (id) => {
    // Tamamlandı butonuna tıklanırsa todo'nun unique id'si ile tamamlanma işlemi başlatır.
    apiFetch(`/todos/${id}/complete`, {
      method: "PATCH", // HTTP isteiğinin türü PATCH olarak ayarlanır.
    })
      .then((updated) => {
        //Güncellenen todo nesnesi updated şekilde yazar.
        if (updated.error) {
          setErrorMsg(updated.error);
          return;
        }
        setTodos(
          (prev) => prev.map((todo) => (todo._id === id ? updated : todo)) //map ile her todo'yu kontrol eder, eğer id'si tamamlanan todo ile eşleşiyorsa updated nesnesini kullanır, eğer eşleşmiyorsa eski todo'yu bırakır.
        );
        setErrorMsg(""); // Hata mesajını temizler böylece önceki hata mesajı kaybolur.
      });
  };

  return (
    <div>
      {" "}
      {/* Ana kapsayıcı element,tüm içeriği bir çatı altında toplar.*/}
      <h1> To-Do List </h1> {/* Sayfanın başlığı */}
      <button onClick={handleLogout} style={{ float: "right" }}>Çıkış Yap</button>
      {errorMsg && (
        <div style={{ color: "red", marginBottom: 10 }}>{errorMsg}</div>
      )}
      <form onSubmit={handleAddTodo}>
        {" "}
        {/* onSubmit özelliği sayesinde, form gönderilince handleAddTodo fonksiyonu çağırılır. */}
        <input
          type="text" // Kullanıcının yazı girmesi için metin kutusu
          value={newTodo} // Bu inputin içindeki değer newTodo state'ten gelir bu işleme controlled component denir.
          onChange={(e) => {
            setNewTodo(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder="Yeni görev ekle" // Kutuya bişi yazılmadan önce "Yeni görev ekle" yazısı görülür maksat kullanıcıyı bilgilendiren geçici yazı.
        />
        <button type="submit">Ekle</button>{" "}
        {/* Butona tıklayınca form submit edilir, handleAddTodo fonksiyonu çağırılır.*/}
      </form>
      <input
        type="text" // Normal yazı inputu, kullanıcıya arama imkanı verir.
        placeholder="Ara..." // Arama kutusu için placeholder.
        value={searchTerm} // Değeri search state'inden gelir.
        onChange={e => setSearchTerm(e.target.value)} // Her değişiklikte search güncellenir.
        style={{ marginTop: "10px", marginBottom: "10px" }} // Arama kutusunun üst-alt boşlukl ayarları.
      />
      <div style={{ display: "flex", gap: "12px", margin: "16px 0" }}>
        <ToggleSwitch
          label={hideCompleted ? " 👀 Tamamlanan Todoları Göster" : " 🙈 Tamamlanan Todoları Gizle"}
          chechked={hideCompleted}
          onChange={() => setHideCompleted((prev) => !prev)}
        />
        <ToggleSwitch
          label={newestFirst ? "⬇️ Eski Todoları Göster" : "⬆️ Yeni Todoları Göster"}
          chechked={newestFirst}
          onChange={() => setNewestFirst((prev) => !prev)}
        />
      </div>
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
                onClick={() => handleComplete(todo._id)}>
                {todo.completed ? "Geri Al" : "Tamamlandı"}
              </button>
              {/* Butona tıklanınca ilgili todo'nun id'siyle handleComplete fonksiyonu çağıırlır.  */}
              <button onClick={() => handleDelete(todo._id)}>Sil</button>{" "}
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
          {totalTodos === 0 ? 0 : (page - 1) * limit + 1} - {Math.min(page * limit, totalTodos)} / {totalTodos}
          {/* Gösterilen ilk kayıt numarasıdır, eğer hiç kayıt yoksa 0 yazar. */}
          {/* Gösterilen son sayfa numarasıdır, math.min fonk ile eğer son sayfa limitin katı değilse kaldı sayfa sayısında bırakır. */}
        </span>
        {""}
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          {" "}
          {/*eğer 1.sayfadaysan pasif olursun, fakat diğer sayfalardaysan butona tıklanır ve önceki sayfaya gider.*/}
          {"<"} {/*geri butonu*/}
        </button>
        <button disabled={page
          >= totalPages} onClick={() => setPage(page + 1)}>
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
