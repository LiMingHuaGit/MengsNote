Page({
  data: {
    animationMain: null,//正面
    animationBack: null,//背面
    time : 5,
  },

  rotateFn(e) {
    var id = e.currentTarget.dataset.id
    this.animation_main = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    this.animation_back = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    // 点击正面

    if (id == 1) {
      this.animation_main.rotateY(180).step()
      this.animation_back.rotateY(0).step()
      this.setData({
        animationMain: this.animation_main.export(),
        animationBack: this.animation_back.export(),
      })
    }
    // 点击背面
    else {
      this.animation_main.rotateY(0).step()
      this.animation_back.rotateY(-180).step()
      this.setData({
        animationMain: this.animation_main.export(),
        animationBack: this.animation_back.export(),
      })
    }
  },
/**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
      this.setTime()
  },

  setTime(){
    let that = this
    let myTime = setInterval(function () {
      that.setData({
        time: that.data.time - 1
      })
      if (that.data.time == 0) {
        clearInterval(myTime)
        wx.setNavigationBarTitle({
          title: '翻转卡片',
        })
      }
    }, 1000)
  },
})