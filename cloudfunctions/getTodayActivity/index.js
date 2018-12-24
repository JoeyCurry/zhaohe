// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const activity = {
  '-1': '程序错误，请联系我',
  0: '宝藏岛宝藏图双倍',
  1: '宝蛋金币数翻倍',
  2: '异次元裂缝卷轴双倍',
  3: '勇者悬赏金币双倍',
  4: '无尽的远征卷轴双倍',
  5: '关卡金币收益翻倍',
  6: '夺矿金币双倍',
  7: '魔王金币双倍',
}
const beginDate = 1545494400000
// 云函数入口函数
exports.main = async (event, context) => {
  let date = new Date().getTime()
  const ONEDAY = 24 * 60 * 60 * 1000 // 每一天的毫秒数
  // 距离制定开始时间有多少天
  let minusDays = Math.floor((date - beginDate) / ONEDAY)
  return {
    todayActivity: activity[(minusDays % 8)],
    nextActivity: activity[((minusDays + 1) % 8)]
  }
}