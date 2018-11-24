import regeneratorRuntime from '../../utils/runtime' 
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    fullData: [],
    searchData: [],
    showFeedback:false,
    hiddenmodalput: true,
    name: '',
    feedback: ''
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      searchData: this.data.fullData
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      searchData: this.data.fullData
    });
  },
  inputTyping: function (e) {
    this.search(e.detail.value.trim())
    this.setData({
      inputVal: e.detail.value
    });
  },

  onLoad: function() {
    this.getEventList()
    // this.getName()
  },

  getEventList() {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name: 'getEventList',
      data: {},
      success: res => {
        console.log('[云函数] [getEventList] ', res.result)
        wx.hideToast()
        
        this.setData({
          searchData: res.result.data,
          fullData: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [getEventList] 调用失败', err)
      }
    })
  },

  search(val) {
    let searchData = this.data.fullData.filter((item, index)=>{
      return item.title.indexOf(val) >= 0
    })
    let showFeedback = false
    if (!searchData.length) {
      showFeedback = true
    }
    this.setData({
      searchData,
      showFeedback
    })
    console.log(searchData)
  },

  // 打开反馈
  feedback() {
    let appInstance = getApp()
    this.setData({
      hiddenmodalput: false,
      name: appInstance.globalData.name
    })
  },

  bindNameInput(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  bindFeedback(e) {
    this.setData({
      feedback: e.detail.value.trim()
    })
  },

  cancel() {
    this.setData({
      hiddenmodalput: true
    })
  },

  // 提交反馈
  confirm() {
    wx.showToast({
      title: '反馈中...',
      icon: 'loading',
    })
    if (!this.data.name.trim()) {
      wx.showToast({
        title: '请填写名称',
        icon: 'none',
        duration: 1500
      })
    } else if (!this.data.feedback.trim()) {
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
          name: this.data.name
        }
      }).then((res)=>{
        this.setName()
      })
    }
  },

  setName() {
    wx.cloud.callFunction({
      name: 'setName',
      data: {
        name: this.data.name
      }
    }).then((res) => {
      let appInstance = getApp()
      appInstance.globalData.name = this.data.name
      wx.showToast({
        title: '反馈成功',
        icon: 'success',
        duration: 1500
      })
      this.setData({
        hiddenmodalput: true
      })
    }).catch((err) => {
      console.error('setName', err)
    })
  },

});