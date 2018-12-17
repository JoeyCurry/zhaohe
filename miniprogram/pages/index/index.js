//index.js
const app = getApp()

const eggArr = [4, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 3, 1, 1, 1, 2, 1, 1, 2, 1, 1, 4, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 5, 1, 1, 2, 1, 1, 1, 4, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 4, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1]

Page({
  data: {
    historyArr: [[]],
    nextEgg: [],
    activity: {
      '-1': '程序错误，请联系我',
      0: '宝藏岛宝藏图双倍',
      1: '宝蛋金币数翻倍',
      2: '异次元裂缝卷轴双倍',
      3: '勇者悬赏金币双倍',
      4: '无尽的远征卷轴双倍',
      5: '关卡金币收益翻倍',
      6: '夺矿金币双倍',
      7: '魔王金币双倍',
    },
    egg: {
      1: '绿',
      2: '蓝',
      3: '紫',
      4: '橙',
      5: '红',
      0: '数据不对无法预知',
      '-1': '无数据'
    },
    eggColor: {
      1: '#8ebb6a',
      2: '#1ab8e4',
      3: '#d45cec',
      4: '#eb9348',
      5: '#ed4d60',
      0: '#000'
    },
    eggSrc: {
      1: '../../images/green.png',
      2: '../../images/blue.png',
      3: '../../images/purple.png',
      4: '../../images/orange.png',
      5: '../../images/red.png',
    },
    DB_id: '',
    currentIndex: -1,
    nextIndex: -1,
    hiddenmodalput: true,
    inputValue: '',
    eggArr: eggArr,
    loading: true,
    total: 0,
    beginDate: 1542470400000,
    todayActivity: -1,
    nextActivity: -1,
    showMore: false,
    showFeedbackCheck: false
  },

  onLoad: function() {
    wx.cloud.callFunction({
      name: 'getName',
      data: {}
    }).then((res) => {
      app.globalData.name = res.result.name
    }).catch((err) => {
      app.globalData.name = ''
      console.error('getName', err)
    })
    // this.queryDB()
    this.onGetOpenid()
    this.activeFn()
  },

  // queryDB() {
  //   wx.cloud.callFunction({
  //     name: 'queryEgg',
  //     data: {}
  //   }).then((res) => {
  //     console.log(res)
  //   }).catch((err) => {
  //     console.error(err)
  //   })
  // },

  // 计算当天的活动，及下一天活动 
  activeFn() {
    let date = new Date().getTime()
    const ONEDAY = 24 * 60 * 60 * 1000 // 每一天的毫秒数
    // 距离制定开始时间有多少天
    let minusDays = Math.floor((date - this.data.beginDate) / ONEDAY) 
    this.setData({
      todayActivity: (minusDays % 8),
      nextActivity: ((minusDays + 1) % 8) 
    })
  },

  // 奇遇搜索
  search() {
    wx.navigateTo({
      url: '../eventSeach/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  tactic() {
    wx.navigateTo({
      url: '../tactic/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  toggleShowEgg() {
    this.setData({
      showMore: !this.data.showMore
    })
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        if (res.result.openid === 'oPGrr4tHoWot5sAZ_c36gP7dRpZY') {
          this.setData({
            showFeedbackCheck: true
          })
        }
        this.onQueryDB()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '登录失败，请联系我',
          icon: 'none'
        })
      }
    })
  },

  // 更新反馈数据
  feedbackCheck() {
    wx.cloud.callFunction({
      name: 'updateFeedback',
      data: {},
      success: res => {console.log(res)},
      fail: err => {console.error(err)}
    })
  },

  addEgg: function(e) {
    let type = e.currentTarget.dataset.type
    let historyArr = this.data.historyArr
    let eggsStr = eggArr.join('')
    let arrStr = historyArr[historyArr.length - 1].join('')
    if (eggsStr.indexOf(arrStr) >= 0) {
      let predictStr = eggsStr.split(arrStr)
      if (predictStr.length === 2 && predictStr[1] === '') {
        historyArr.push([type])
      } else {
        historyArr[historyArr.length - 1].push(type)
      }
    } else {
      historyArr[historyArr.length - 1].push(type)
    }
    this.predict(historyArr[historyArr.length - 1])
    let total = this.sumEgg(historyArr)
    this.setData({
      historyArr,
      total
    })
    this.onDBUpdate({ historyArr })
  },

  delEgg() {
    let historyArr = this.data.historyArr
    historyArr[historyArr.length - 1].pop()
    this.predict(historyArr[historyArr.length - 1])
    let total = this.sumEgg(historyArr)
    this.setData({
      historyArr,
      total
    })
    this.onDBUpdate({ historyArr })
  },

  showDialog() {
    wx.showModal({
      title: '手动填写',
      content: '',
    })
  },
 
  // 预测下一个蛋蛋
  predict(arr) {
    if (arr.length) {
      let eggsStr = eggArr.join('')
      let arrStr = arr.join('')
      if (eggsStr.indexOf(arrStr) >= 0) {
        let predictStr = eggsStr.split(arrStr)
        if (predictStr.length === 2 && predictStr[predictStr.length - 1] === '') {
          this.setData({
            nextEgg: [4]
          })
        } else {
          predictStr.shift()
          let predictArr = predictStr.map((item, index) => {
            if (item === '') {
              item = arrStr
            }
            return item[0] 
          })
          let nextEgg = [...new Set(predictArr)]
          this.setData({
            nextEgg,
          })
        }
      } else {
        this.setData({
          nextEgg: [0]
        })
      }
    } else {
      this.setData({
        nextEgg: []
      })
    }
  },

  // 有当前位置后的下一个蛋蛋
  next() {
    let currentIndex = this.data.currentIndex
    let nextIndex = this.data.nextIndex
    if (currentIndex === 155) {
      currentIndex = 1
    } else {
      currentIndex = currentIndex + 1
    }
    if (currentIndex === 155) {
      nextIndex = 1
    } else {
      nextIndex = currentIndex + 1
    }
    this.onDBUpdate({ currentIndex })
    this.setData({
      currentIndex,
      nextEgg: [eggArr[nextIndex -1]],
      nextIndex,
    })
  },

  // 删除上个蛋蛋 
  popEgg() {
    let currentIndex = this.data.currentIndex
    let nextIndex = this.data.nextIndex
    currentIndex = currentIndex === 1 ? 155 : currentIndex -1
    nextIndex = nextIndex === 1 ? 155 : nextIndex - 1
    this.onDBUpdate({ currentIndex })
    this.setData({
      currentIndex,
      nextIndex,
      nextEgg: [eggArr[nextIndex - 1]],
    })
  },

  sumEgg(arr) {
    let total = 0
    arr.forEach((item, index) => {
      total += item.length
    })
    return total;
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  help() {
    wx.showModal({
      title: '使用说明',
      content: '用于召唤与合成记录垫刀，有两种方式预估，一是添加当前蛋蛋的颜色，然后进行预估，预估结果可能会有多个；二是手动设置位置，只要你自己估计的位置是对的，那么预估结果一定是对的；\n 如需帮助，请联系我，把你的id带上,你的id是 ' + this.data.DB_id + '；当然了，最后环节，我的邀请码IOS：10110031，随缘',
      showCancel: false
    })
  },

  /**
   * dialog相关
   */

  // 打开dialog
  openDialog() {
    this.setData({
      hiddenmodalput: false
    });
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
    });
  },
  //确认  
  confirm: function () {
    let hiddenmodalput = true
    let currentIndex = this.data.currentIndex
    let inputValue = ''
    if (this.data.inputValue !== '') {
      let inputValue = parseInt(this.data.inputValue )
      if (inputValue > 0 && inputValue <= 155) {
        currentIndex = inputValue 
        let historyArr = this.data.historyArr
        historyArr[historyArr.length - 1] = []
        this.onDBUpdate({ historyArr, currentIndex })
        let nextIndex = -1
        if (inputValue === 155) {
          nextIndex = 1
        } else {
          nextIndex = inputValue + 1
        }
        this.setData({
          historyArr,
          nextEgg: [eggArr[nextIndex -1]],
          nextIndex,
          currentIndex,
          hiddenmodalput
        })
      } else if (inputValue == 0) {
        this.onDBUpdate({ currentIndex: -1 })
        let total = this.sumEgg(this.data.historyArr)
        this.setData({
          hiddenmodalput,
          nextIndex: -1,
          nextEgg: [],
          currentIndex: -1,
          total
        })
      } else {
        wx.showToast({
          title: '请输入1～155的数字',
          icon: 'none'
        })
      }
    } else {
      this.setData({
        hiddenmodalput,
      })
    }
  },

  /**
   * 数据库相关处理
   */
  // 创建数据
  onDBCreate: function () {
    const db = wx.cloud.database()
    db.collection('user_eggs').add({
      data: {
        historyArr: [[]],
        currentIndex: -1
      },
      success: res => {
        this.setData({
          DB_id: res._id,
          loading: false
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '创建数据失败，请联系我...'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  // 查询数据
  onQueryDB: function () {
    const db = wx.cloud.database()
    db.collection('user_eggs').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        if (res.data.length) {
          if (res.data[0].currentIndex === -1) {
            let total = this.sumEgg(res.data[0].historyArr)
            this.predict(res.data[0].historyArr[res.data[0].historyArr.length - 1])
            this.setData({
              historyArr: res.data[0].historyArr,
              currentIndex: res.data[0].currentIndex,
              nextIndex: -1,
              DB_id: res.data[0]._id,
              loading: false,
              total
            })
          } else {
            let nextIndex = res.data[0].currentIndex === 155 ? 1 : res.data[0].currentIndex + 1
            this.setData({
              historyArr: res.data[0].historyArr,
              currentIndex: res.data[0].currentIndex,
              nextIndex,
              nextEgg: nextIndex === -1 ? [-1] : [eggArr[nextIndex - 1]],
              DB_id: res.data[0]._id,
              loading: false
            })
          }
        } else {
          this.onDBCreate()
        }
      },
      fail: res => {
        wx.showToast({
          title: '读取数据库失败，请咨询我',
        })
      }
    })
  },
  
  // 更新数据
  onDBUpdate: function (data) {
    const db = wx.cloud.database()
    db.collection('user_eggs').doc(this.data.DB_id).update({
      data: data,
      success: function (res) {
      },
      fail: err => {
        wx.showToast({
          title: '更新数据库失败，请咨询我',
        })
      }
    })
  }
})
