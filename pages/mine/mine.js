// pages/mine/mine.js
var Utils = require('../../utils/util.js')
var app = getApp()
var list = []
Page({
  data: {
    content: '',
    height: 500,
    width: 320,
    imgIndex: 0,
    imageLength: 0,
    firstCon: '',
    dataList: [],
  },
  onLoad: function (options) {
    let that = this
  },
  onShow: function (e) {
    var that = this;
    //动态获取屏幕尺寸
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 输入监听
   */
  inputCon: function (e) {
    let that = this;
    if (0 === e.currentTarget.id - 0) {//第一个文本框的输入监听
      that.data.firstCon = e.detail.value;
    } else {
      that.data.dataList[e.currentTarget.id - 1].value = e.detail.value;
    }
  },
  /**
   * 失去焦点监听
   * 根据失去监听的input的位置来判断图片的插入位置
   */
  outBlur: function (e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * 添加图片
   */
  addImg: function () {
    var that = this;
    //这里考虑到性能，对于图片张数做了限制
    if (that.data.dataList.length >= 4) {//超过四张
      wx.showModal({
        title: '提示',
        content: '最多只能添加四张图片哦',
        confirmText: "我知道了",
        confirmColor: "#ef8383",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else {//添加图片
      wx.showActionSheet({
        itemList: ['从相册选择', '拍照'],
        itemColor: '#ef8383',
        success: function (res) {
          var choseType = res.tapIndex == 0 ? "album" : res.tapIndex == 1 ? "camera" : "";
          if (choseType != "") {
            wx.chooseImage({
              sizeType: ['original'],//原图
              sourceType: [choseType],
              count: 1,//每次添加一张
              success: function (res) {
                var info = {
                  pic: res.tempFilePaths[0],//存储本地地址
                  temp: true,//标记是否是临时图片
                  value: '',//存储图片下方相邻的输入框的内容
                }
                that.data.dataList.splice(that.data.imgIndex, 0, info);//方法自行百度
                that.setData({
                  dataList: that.data.dataList,
                })
              }
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /**
   * 删除图片
   */
  deletedImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex === 0) {//点击删除图片
          if (index === 0 && that.data.dataList[index].value != null) {//删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.dataList[index].value;
          } else if (index > 0 && that.data.dataList[index].value != null) {
            that.data.dataList[index - 1].value = that.data.dataList[index - 1].value + that.data.dataList[index].value;
          }
          that.data.dataList.splice(index, 1);
          that.setData({
            firstCon: that.data.firstCon,
            dataList: that.data.dataList
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //失败警告
  do_fail: function (a) {
    wx.showToast({
      title: a,
      icon: 'none',
      duration: 1000
    })
  },
})
