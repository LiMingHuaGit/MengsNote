const DB = wx.cloud.database().collection("Note");
var util = require('../../utils/util.js');
Page({
  data: {
   note:[],
  },
  //onload查询数据
  onLoad(){
    this.getData();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad();
  },

  //跳转笔记详情页面
  noteContent(e){
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
  //查询所有数据
  getData(){
    var that = this ;
    DB.get({
      success(res) {
        
        console.log("读数据成功", res.data)
        that.data.note = res.data.concat(that.data.note);
        that.setData({
          'note': that.data.note 
        });
        console.log(that.data.note)
      },
      fail(res) {
        console.log("读数据失败", res)
      },
    })
  }
})