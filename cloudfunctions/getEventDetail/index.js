// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event', event.id)
    db.collection('event').doc(event.id).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log('云函数', res.data)
        return res.data
      },
      fail: function (e) {
        console.log('云函数', e)
      }
    })
}