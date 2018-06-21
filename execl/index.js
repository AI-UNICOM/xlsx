const xlsx = require('node-xlsx').default
const jsonfile = require('promise-jsonfile')

const sheets = xlsx.parse(`${__dirname}/cms.xlsx`);
let items = []
if (sheets.length) {
  sheets[0].data.forEach((item, i) => {
    if (i != 0) {
      let disabled = !item[1] ? true : false
      items.push({ id: i, disabled: disabled, a: item[0], b: item[1], c: item[2] })
    }
  })
}

jsonfile.write(`${__dirname}/data.json`, { data: items }).then(() => {
  console.log('数据生成')
}).catch(err => console.log(err));