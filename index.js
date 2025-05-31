const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
res.send('merhaba,to-do backend çalışıyor.');
});
app.listen(3000, () => {
console.log('Sunucu 3000 portunda çalışıyor.');
});
