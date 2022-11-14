const DB = wx.cloud.database().collection("Note");
var util = require('../../utils/util.js');
Page({
  data: {
    note: [],
    note_nums: 0 //笔记数量
  },
  //onload查询数据
  onLoad() {
    this.getData();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.reLaunch({
      url: '/pages/NoteList/NoteList'
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '刷新中！',
      duration: 1000
    })

    let x = this.data.note_nums + 20
    console.log(x)
    let old_data = this.data.note
    DB.orderBy('time', 'desc').skip(x) // 限制返回数量为 20 条
      .get()
      .then(res => {
        // 这里是从数据库获取文字进行转换 变换显示（换行符转换） 
        res.data.forEach((item, i) => {
          res.data[i].content = res.data[i].content.split('*hy*').join('\n');
        })

        // 利用concat函数连接新数据与旧数据
        // 并更新emial_nums  
        this.setData({
          note: old_data.concat(res.data),
          note_nums: x
        })
        console.log(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    console.log('circle 下一页');
  },

  //跳转笔记详情页面
  noteContent(e) {
    // 拿到对应参数 有两种方式都可以拿到对应的参数
    console.log('', e.currentTarget.dataset.content)
    var content = e.currentTarget.dataset.content;
    var time = e.currentTarget.dataset.time;
    var title = e.currentTarget.dataset.title;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var imgId = e.currentTarget.dataset.imgid;
    wx.navigateTo({
      url: '/pages/NoteContent/NoteContent?content=' + encodeURIComponent(content) + '&time=' + time + '&title=' + title + '&id=' + id + '&type=' + type + '&imgId=' + imgId,
    })
  },
  //查询数据
  getData() {
    var that = this;
    DB.orderBy('time', 'desc').skip(0).get({
      success(res) {
        console.log("读数据成功", res.data)
        that.data.note = res.data.concat(that.data.note);
        that.setData({
          'note': that.data.note,
        });
        console.log(that.data.note)
      },
      fail(res) {
        console.log("读数据失败", res)
      },
    })
  }
})