const fs = require('fs')
const express = require('express')
const xlsx = require('node-xlsx').default

let db = require('./execl/data.json')
let items = db.data
const app = express();
var server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static('public'));
// console.log("items",items)

io.on('connection', function (socket) {
  socket.on("C-S-update", item => {
    console.log(item)
    items = items.map(m => {
      if (m.id == item.id) {
        m.b = item.data.name
        m.c = item.data.tel
        // Object.assign(m, item)
      }
      return m
    })
    io.sockets.emit('S-C-list', items);
  })
  socket.on("C-S-login", data => {
    // console.log("items", items)
    io.sockets.emit('S-C-list', items);
  })
  socket.on("C-S-down", () => {
    let list = items.map(m => {
      return Object.values(m)
    })
    const data = [[1, 2, 3], [true, false, null, 'sheetjs']].concat(list);
    var buffer = xlsx.build([{ name: "mySheetName", data: data }]);
    let name = `down/cms-${Date.now()}.xlsx`
    fs.writeFileSync(`./public/${name}`, buffer, 'binary');
    io.sockets.emit('S-C-Url', name);
  })
});
// app.get('/d/excel', (req, res) => {
//   const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
//   var buffer = xlsx.build([{ name: "mySheetName", data: data }]);
//   let name = `down/cms-${Date.now()}.xlsx`
//   fs.writeFileSync(`./public/${name}`, buffer, 'binary');
//   res.send(name);
// })
server.listen(3001);