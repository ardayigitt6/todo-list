const express = require('express');
const app = express();
app.use(express.json());
let todos = [];
app.get('/todos', (req, res) => {
res.json(todos);
});
app.post('/todos', (req, res) => {
const { title } = req.body;
if (!title) {
return res.status(400).json({ error:'Başlık gerekli !'});
}
const newTodo = { id: Date.now(), title: title };
todos.push(newTodo);
res.status(201).json(newTodo);
});
app.get('/', (req, res) => {
res.send('Merhaba, To-Do backend çalışıyor.');
});
app.listen(3000, () => {
console.log('Sunucu 3000 portunda çalışıyor.');
});
