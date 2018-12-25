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
    feedback:''
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
      name: 'getMyFeedbackList',
      data: {}
    }).then(res => {
      wx.hideLoading()
      this.setData({
        feedbackList: res.result.data
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


  // 打开反馈
  feedback() {
    this.setData({
      hiddenmodalput: false,
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
      wx.showToast({
        title: '反馈中...',
        icon: 'loading',
      })
      wx.cloud.callFunction({
        name: 'addFeedback',
        data: {
          feedback: this.data.feedback,
          name: app.globalData.name
        }
      }).then((res) => {
        wx.showToast({
          title: '反馈成功',
        })
        this.fetchList()
        this.setData({
          hiddenmodalput: true
        })
      })
    }
  },

})