// pages/tactic/index.js
const tacticList = [
  {
    title: '新手详细攻略',
    avatar: 'https://6a69-jiangjun-ee2d30-1257948812.tcb.qcloud.la/avatar/白夜黑猫.jpg?sign=9afec7bb887dc8ba6c20464c0cd51c1a&t=1543308006',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/xinshougonglue/index'
  },
  {
    title: '置换',
    avatar: 'https://6a69-jiangjun-ee2d30-1257948812.tcb.qcloud.la/avatar/白夜黑猫.jpg?sign=9afec7bb887dc8ba6c20464c0cd51c1a&t=1543308006',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/zhihuan/index'
  },
  {
    title: '黑暗叠等级',
    avatar: 'https://6a69-jiangjun-ee2d30-1257948812.tcb.qcloud.la/avatar/白夜黑猫.jpg?sign=9afec7bb887dc8ba6c20464c0cd51c1a&t=1543308006',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/heian/index'
  },
  {
    title: '装备相关',
    avatar: 'https://6a69-jiangjun-ee2d30-1257948812.tcb.qcloud.la/avatar/白夜黑猫.jpg?sign=9afec7bb887dc8ba6c20464c0cd51c1a&t=1543308006',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/zhuangbei/index'
  },
  {
    title: '卷轴相关',
    avatar: 'https://6a69-jiangjun-ee2d30-1257948812.tcb.qcloud.la/avatar/白夜黑猫.jpg?sign=9afec7bb887dc8ba6c20464c0cd51c1a&t=1543308006',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/juanzhou/index'
  },
  {
    title: '垫刀相关',
    avatar: 'https://6a69-jiangjun-ee2d30-1257948812.tcb.qcloud.la/avatar/白夜黑猫.jpg?sign=9afec7bb887dc8ba6c20464c0cd51c1a&t=1543308006',
    author: '白夜黑猫',
    form: 'taptap',
    date: '2018-11-11 09:28:26',
    url: '../tacticBooks/diandao/index'
  },
  {
    title: '钻石相关',
    avatar: 'https://6a69-jiangjun-ee2d30-1257948812.tcb.qcloud.la/avatar/白夜黑猫.jpg?sign=9afec7bb887dc8ba6c20464c0cd51c1a&t=1543308006',
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
      searchData: tacticList
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      searchData: tacticList
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
})