// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // let data = await db.collection('luckyImage').where({
  //   _id: event.id
  // }).get()
  // console.log(data)
  // let fileId = data[0].image
  console.log(event)
  await cloud.deleteFile({
    fileList: [event.fileId],
  })
  
  return await db.collection('luckyImage').where({
    _id: event.id
  }).remove()
}