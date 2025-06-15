import React, {useState,useEffect} from "react"; // React kütüphanesi ve gerekli hook'lar (useState,useEffect) içe aktarıldı. 
function App () { // Ana fonksiyonel bileşen tanımlandı.
const [todos,setTodos] = useState([]); // todos adında başlangıçta içi boş bir state tanımlandı, setTodos ise bu diziyi update eder.
const [newTodo,setNewTodo] = useState(""); // Yeni bir todo eklerken input kısmına yazdığı metini state değişkeninde sakalar.
useEffect(() => { // Bileşen ilk yüklendiğinde çalışıcak bir effect tanımlandı.İçinde API'ya istek atılır. 
fetch("http://localhost:5000/todos") // Belirtilen adrese get isteği atar ve backend'de ki tüm todo'ları ister.
.then(res=>res.json()) // Gelen cevabı JSON formatına döndürür.
.then(data=> {
console.log("Backend'den gelen veriler:", data);  
setTodos(data); // API'dan gelen veriyi todos state'ne kaydeder ve bunun sayesinde ekranda listelenebilir.
});
}, []);

const handleAddTodo = (e) => { // Yeni bir todo ekleme işlemini gerçekleştiren fonksiyon. (e), olay parametresi (event object).
e.preventDefault(); // Formun varsayılan davranışını yani sayfa yenilemeyi engeller.
if (!newTodo.trim()) return; // Eğer input'a hiçbir şey yazılmadıysa veya boş bırakıldıysa fonksiyon durur.
fetch("http://localhost:5000/todos",{ //Backend'e yeni todo ekleme için POST isteği atar.
method: "POST", // HTTP isteğinin türünü belirtir.Yeni veri eklemek için HTTP metodunu POST olarak ayarlar.
headers : {"Content-Type": "application/json"}, // Gönderilen verinin JSON formatında olduğunu gösterir.
body: JSON.stringify({title:newTodo}) // Gönderilicek veriyi bir nesne olarak JSON string'e çevir ve isteiğini body kısmına ekler.
})
.then(res=>res.json()) // Gelen cevabı JSON formatına çevirir.  
.then(added=> { // Backend'den gelen yeni newTodo nesnesi added olarak gelir.
setTodos(prev=>[...prev,added]); // Eklenen yeni todu'yu mevcut todos listesine ekler, liste güncellenir.
setNewTodo(""); // Input kutusu temizlenir böylece yeni todo yazılmak için hazır olur.
});
};

const handleDelete = (id) => { // Silme butonuna tıklanırsa todo'nun unique id'si ile, silme işlemi başlatır. 
fetch (`http://localhost:5000/todos/${id}`, { //Backend'e DELETE isteği gönderir.
method:"DELETE" // HTTP isteiğinin türü DELETE olarak ayarlanır. 
})
.then(res=>res.json()) // Gelen cevabı JSON formatına çevirir.
.then( result => { // Bir üstteki then’den dönen veri burada result olarak alınır.
setTodos(prev=>prev.filter(todo=>todo._id !==id)); 
// prev önceki todos listesidir. filter ile id'si silinen todo'yu çıkarır diğerlerini bırakır. Amaç, silinen todo'nun anında kaybolmasını sağlamak. 
});
};

const handleComplete = (id) => { // Tamamlandı butonuna tıklanırsa todo'nun unique id'si ile, tamamlandı işareti yapılır.
fetch (`http://localhost:5000/todos/${id}/complete`,{ // Backend'e PATCH isteği gönderilir. 
method:"PATCH" // HTTP isteğinin türü PATCH olarak ayarlanır.
})
.then(res=>res.json()) // Gelen cevabı JSON formatına çevirir.
.then (updated => { // Güncellenmiş todo objesi burada update olarak alınır.
setTodos(prev=> prev.map(todo =>todo._id === updated._id? updated: todo));
// todos state'ni güncellemek için kullanılır.prev önceki todos listesidir. map ile tüm todo'lar üzerinde döner. Amaç sadece ilgili görevin tamamlandı halini güncelleyip, tüm listenin güncel şekilde ekrana yansımasını sağlar.
});
};

return(
  <div> {/* Ana kapsayıcı element,tüm içeriği bir çatı altında toplar.*/}
    <h1> To-Do List </h1> {/* Sayfanın başlığı */}
    <form onSubmit={handleAddTodo}> {/* onSubmit özelliği sayesinde, form gönderilince handleAddTodo fonksiyonu çağırılır. */} 
      <input
      type="text" // Kullanıcının yazı girmesi için metin kutusu
      value = {newTodo} // Bu inputin içindeki değer newTodo state'ten gelir bu işleme controlled component denir.
      onChange={e=> setNewTodo(e.target.value)} // Her tuşa basıldıkça newTodo güncellenir.
      placeholder="Yeni görev ekle" // Kutuya bişi yazılmadan önce "Yeni görev ekle" yazısı görülür maksat kullanıcıyı bilgilendiren geçici yazı.
      />
      <button type="submit">Ekle</button> {/* Butona tıklayınca form submit edilir, handleAddTodo fonksiyonu çağırılır.*/}
      </form>
      <ul> {/* unordered list yani todo maddelerini liste halinde gösterecek kapsayıcı, yapılacaklar listesi için bir sırasız liste */}
        {todos.map( todo => ( // todos dizisinde ki her bir todo için döngü başlatılır.
          <li key ={todo._id}> {/* Her todo'nun unique id'sini key olarak kullanır, başlık ve tamamlandı bilgisini gösterir. */}
            {todo.title} {todo.completed ? "(Tamamlandı)" :""} 
            {/* todo'nun başlığını gösterir, eğer todo tamamlandıysa parantez içinde belirtilit tamamlanmadı ise boş bırakılır */}
            <button onClick={()=> handleComplete(todo._id)} disabled={todo.completed}>Tamamlandı</button>
            {/* Butona tıklanınca ilgili todo'nun id'siyle handleComplete fonksiyonu çağıırlır.  */}
            <button onClick={()=> handleDelete(todo._id)}>SİL</button> {/* Butona tıklanınca ilgili todo'nun id'siyle handleDelete fonksiyonu çağrılır. */}
          </li>
        ))}
      </ul> 
  </div>
);
}
 export default App; // Bu bileşeni başka dosyalarda da kullanabilmek için dışa aktarır.