// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = wx.cloud.database()
cloud.init()
const testDB = wx.cloud.database({
  env: 'test'
})
const todos = db.collection('todos')
const todo = db.collection('todos').doc('todo-identifiant-aleatoire')
// 云函数入口函数
db.collection('todos').add({
  // data 字段表示需新增的 JSON 数据
  data: {
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    location: new db.Geo.Point(113, 23),
    done: false
  }
})
.then(res => {
  console.log(res)
})