// pages/tactic/index.js
const tacticList = [
  {
    title: '新手详细攻略',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/白夜黑猫.jpg',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/xinshougonglue/index'
  },
  {
    title: '解谜文字版',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/夏歌.jpeg',
    author: '夏◎歌',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/jiemitext/index'
  },
  {
    title: '置换',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/白夜黑猫.jpg',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/zhihuan/index'
  },
  {
    title: '黑暗叠等级',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/白夜黑猫.jpg',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/heian/index'
  },
  {
    title: '装备相关',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/白夜黑猫.jpg',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/zhuangbei/index'
  },
  {
    title: '卷轴相关',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/白夜黑猫.jpg',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/juanzhou/index'
  },
  {
    title: '垫刀相关',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/白夜黑猫.jpg',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/diandao/index'
  },
  {
    title: '钻石相关',
    avatar: 'cloud://jiangjun-ee2d30.6a69-jiangjun-ee2d30/avatar/白夜黑猫.jpg',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/zuanshi/index'
  },
]

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    fullData: [],
    searchData: tacticList,
    showFeedback: false,
    hiddenmodalput: true,
    name: '',
    feedback: '',
    
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
      searchData: tacticList,
      showFeedback: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      searchData: tacticList,
      showFeedback: false
    });
  },
  inputTyping: function (e) {
    this.search(e.detail.value.trim())
    this.setData({
      inputVal: e.detail.value
    });
  },

  onLoad: function () {

  },

  search(val) {
    let searchData = tacticList.filter((item, index) => {
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
      }).then((res) => {
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
})