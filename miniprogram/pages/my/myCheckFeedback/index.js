// pages/my/feedback/index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    feedbackList: [],
    waitingImg: '../../../images/waiting.png',
    isFeededImg: '../../../images/ok.png',
    hiddenmodalput: true,
    feedback: '',
    currentId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchList()
  },

  fetchList() {
    wx.showLoading({
      title: '',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.cloud.callFunction({
      name: 'getAllFeedback',
      data: {}
    }).then(res => {
      wx.hideLoading()
      console.log(res)
      let data = res.result.data
      data.forEach((item, index)=>{
        if (!item.time) {
          item.time = this.timestampToTime(item.date)
        }
      })
      this.setData({
        feedbackList: data
      })
    }).catch(e => {
      console.error(e)
    })
  },


  bindFeedback(e) {
    this.setData({
      feedback: e.detail.value.trim()
    })
  },


  // 清空反馈
  clearFeedback() {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'updateFeedback',
      data: {},
      success: res => { 
        console.log(res) 
        this.fetchList()
      },
      fail: err => { console.error(err) }
    })
  },

  checkFeedback() {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'checkFeedback',
      data: {
        id: this.data.currentId,
        feedback: this.data.feedback
      }
    }).then(res => {
      console.log(res)
      this.setData({
        hiddenmodalput: true
      })
      this.fetchList()
    }).catch ( e => {
      console.error(e)
    })
  },

  pass(e) {
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
    this.checkFeedback()
  },

  saySomething(e) {
    this.setData({
      hiddenmodalput: false,
      currentId: e.currentTarget.dataset.id
    })
  },

  cancel() {
    this.setData({
      hiddenmodalput: true
    })
  },

  // 提交反馈
  confirm() {
    if (!this.data.feedback.trim()) {
      wx.showToast({
        title: '请添加反馈',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.checkFeedback()
    }
  },

  timestampToTime(timestamp) {
    if (timestamp) {
      let date = new Date(timestamp + 28800 * 1000);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() ;
      let s = date.getSeconds();
      return Y + M + D + h + m + ':' + s;
    } else {
      return ''
    }
  }

})