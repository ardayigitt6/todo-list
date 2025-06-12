import React, {useState,useEffect} from "react"; // React kütüphanesi ve gerekli hook'lar (useState,useEffect) içe aktarıldı. 
function App () { // Ana fonksiyonel bileşen tanımlandı.
const [todos,setTodos] = useState([]); // todos adında başlangıçta içi boş bir state tanımlandı, setTodos ise bu diziyi update eder.
useEffect(() => { // Bileşen ilk yüklendiğinde çalışıcak bir effect tanımlandı.İçinde API'ya istek atılır. 
fetch("http://localhost:5000/todos") // Belirtilen adrese get isteği atar ve backend'de ki tüm todo'ları ister.
.then(res=>res.json()) // Gelen cevabı JSON formatına döndürür.
.then(data=> {
console.log("Backend'den gelen veriler:", data);  
setTodos(data); // API'dan gelen veriyi todos state'ne kaydeder ve bunun sayesinde ekranda listelenebilir.
});
}, []);

return(
  <div> {/* Ana kapsayıcı element,tüm içeriği bir çatı altında toplar.*/}
    <h1> To-Do List </h1> {/* Sayfanın başlığı */}
      <ul> {/* unordered list yani todo maddelerini liste halinde gösterecek kapsayıcı, yapılacaklar listesi için bir sırasız liste */}
        {todos.map( todo => ( // todos dizisinde ki her bir todo için döngü başlatılır.
          <li key ={todo._id}> {/* Her todo'nun unique id'sini key olarak kullanır, başlık ve tamamlandı bilgisini gösterir. */}
            {todo.title} {todo.completed ? "(Tamamlandı)" :""} 
            {/* todo'nun başlığını gösterir, eğer todo tamamlandıysa parantez içinde belirtilit tamamlanmadı ise boş bırakılır */}
          </li>
        ))}
      </ul> 
  </div>
);
}
 export default App; // Bu bileşeni başka dosyalarda da kullanabilmek için dışa aktarır.