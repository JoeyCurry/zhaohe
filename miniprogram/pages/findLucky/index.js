// pages/findLucky/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luckyList: [],
    userLikeList: [],
    height: '',
    likeImg: '../../images/good.png',
    likeImgChecked: '../../images/good_checked.png',
    unlikeImg: '../../images/bad.png',
    unlikeImgChecked: '../../images/bad_checked.png',
    currentPageNum: 0,
    currentPageCount: 20,
    totalPageNum: 0,
    showLoadMore: false,
    showTopLoading: false,
    hiddenmodalput: true,
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let height = res.windowHeight
        let width = res.windowWidth
        let rpx2px = width/750
        height = height - 40 * rpx2px - 150 * rpx2px
        this.setData({
          height: height,
          name: app.globalData.name
        })
      }
    })
    this.getImageList('', this.data.currentPageNum + 1)
    
  },

  onPullDownRefresh() {
    // 显示顶部刷新图标
    this.refresh('更新成功')
  },

  onReachBottom() {
    this.setData({
      showLoadMore: true,
    })
    this.getImageList('', this.data.currentPageNum + 1)
  },

  // 点赞
  like(e) {
    if (app.globalData.name && app.globalData.userId) {
      wx.showLoading({
        title: '',
      })
      if (this.data.userLikeList.includes(e.currentTarget.dataset.id) ) {
        let list = new Set([...this.data.userLikeList])
        list.delete(e.currentTarget.dataset.id)
        wx.cloud.callFunction({
          name: 'cancelLike',
          data: {
            id: e.currentTarget.dataset.id,
            like: [...list]
          }
        }).then(res => {
          console.log(res)
          let luckyList = this.data.luckyList
          luckyList.find((item, index) => {
            if (item._id === e.currentTarget.dataset.id) {
              item.isMyLike = false
              item.like = item.like - 1
              return true
            } else {
              return false
            }
          })
          this.setData({
            luckyList,
            userLikeList: [...list]
          })
          wx.showToast({
            title: '取消成功',
          })
        }).catch(e => {
          console.error(e)
        })
      } else {
        let list = [...this.data.userLikeList]
        list.push(e.currentTarget.dataset.id)
        wx.cloud.callFunction({
          name: 'like',
          data: {
            id: e.currentTarget.dataset.id 
          }
        }).then(res => {
          console.log(res)
          let luckyList = this.data.luckyList
          luckyList.find((item, index) => {
            if (item._id === e.currentTarget.dataset.id ) {
              item.isMyLike = true
              item.like = item.like + 1
              return true
            } else {
              return false
            }
          })
          this.setData({
            luckyList,
            userLikeList: list
          })
          wx.showToast({
            title: '点赞成功',
          })
        }).catch( e => {
          console.error(e)
        })
      }
    } else {
      wx.showToast({
        title: '请先设置名称',
        icon: 'none',
        duration: 800
      })
      this.setData({
        hiddenmodalput: false
      })
    }
  },


  // 更新数据
  refresh(msg) {
    this.setData({
      currentPageNum: 0,
    })
    this.getImageList(msg , 1)
  },

  getImageList(msg, pageNum) {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'getLuckyImageList',
      data: {
        pageNum: pageNum,
        pageCount: this.data.currentPageCount
      }
    }).then(res => {
      console.log(res)
      let totalPageNum = res.result.totalPageNum
      if (totalPageNum >= this.data.currentPageNum + 1) {
        let luckyList = []
        if (this.data.currentPageNum === 0) {
          luckyList = res.result.list.data 
        } else {
          luckyList = this.data.luckyList.concat(res.result.list.data) 
        }
        console.log(luckyList)
        // 获取我的喜欢列表
        wx.cloud.callFunction({
          name: 'getName',
          data: {}
        }).then(res => {
          console.log('getName', res)
          let userLikeList = res.result.like || []
          let userUnLikeList = res.result.unlike || []
          luckyList.forEach((item, index) => {
            userLikeList.find((likeItem, likeIndex) => {
              if (likeItem === item._id) {
                item.isMyLike = true
                return true
              }
            })
            userUnLikeList.forEach((unlikeItem, unlikeIndex) => {
              if (unlikeItem === item._id) {
                item.isMyUnLike = true
              }
            })
          })
          console.log('luckyList' ,luckyList)
          wx.hideLoading()
          if (msg) {
            wx.showToast({
              title: msg,
              duration: 1000
            })
          }
          this.setData({
            luckyList,
            userLikeList,
            currentPageNum: this.data.currentPageNum + 1,
            totalPageNum,
            showLoadMore: false,
          })
          wx.stopPullDownRefresh();
        }).catch(e => {
          console.error(e)
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '已经到低啦',
          duration: 3000,
          icon: 'none'
        })
        this.setData({
          showLoadMore: false
        })
      }
    })
  },

  // 上传图片
  upload() { 
    if (app.globalData.name && app.globalData.userId) {
      wx.chooseImage({
        count: 1,
        success: chooseResult => {
          // 将图片上传至云存储空间
          wx.showLoading({
            title: '上传中...',
          })
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: 'lucky/' + app.globalData.openid + new Date().getTime() + '.png',
            // 指定要上传的文件的小程序临时文件路径
            filePath: chooseResult.tempFilePaths[0],
            // 成功回调
            success: res => {
              wx.cloud.callFunction({
                name: 'uploadLuckyImage',
                data: {
                  image: res.fileID,
                  name: app.globalData.name,
                  userId: app.globalData.userId
                }
              }).then(res => {
                wx.hideLoading()
                wx.showToast({
                  title: '上传成功，请等待审核',
                  duration: 3000
                })
                // this.refresh()
                console.log('上传成功', res)
              }).catch(e => {
                console.error(e)
              })
            },
            fail: err => {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 3000
              })
              console.error(err)
            }
          })
        },
      })
    } else {
      wx.showToast({
        title: '请先设置名称',
        icon: 'none',
        duration: 800
      })
      this.setData({
        hiddenmodalput: false
      })
    }
  },

  timestampToTime(timestamp) {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes();
    let s = date.getSeconds();
    return Y + M + D + h + m;
  },
  
  setName() {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'setName',
      data: {
        name: this.data.name
      }
    }).then((res) => {
      console.log(res)
      app.globalData.name = this.data.name
      app.globalData.userId = res.result._id
      wx.hideLoading()
      wx.showToast({
        title: '设置成功',
        duration: 1500
      })
      this.setData({
        hiddenmodalput: true,
      })
    }).catch((err) => {
      console.error('setName', err)
    })
  },
  showNameModal() {
    this.setData({
      hiddenmodalput: false
    })
  },

  // 输入姓名
  bindNameInput(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  cancel() {
    this.setData({
      hiddenmodalput: true
    })
  },

  // 提交反馈
  confirm() {
    this.setName()
  },
})