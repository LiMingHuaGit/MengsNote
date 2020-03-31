// pages/NoteContent/NoteContent.js
const DB = wx.cloud.database();
Page({
  data: {
    content: '',
    time:'',
    title:'',
    id:'',
    type:'',
    imgId:''
  },
  onLoad: function (options) {
    var noteContent = decodeURIComponent(options.content);
    var noteTime = options.time;
    var noteTitle = options.title;
    var noteId = options.id;
    var noteType = options.type;
    var noteImgId = options.imgId;
    console.log(noteImgId)
    noteContent = noteContent.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"');
    this.setData({
      content: noteContent,
      time: noteTime,
      title: noteTitle,
      id: noteId,
      type: noteType,
      imgId: noteImgId
    })
  },
  RemoveNote(e){
    var removeId = e.currentTarget.dataset.id;
    var removeImg = e.currentTarget.dataset.imgid;
    console.log(removeImg)
    var removeList = [];
    removeList.push(removeImg);
    DB.collection('Note').where({
      _id: removeId
    }).remove({
      success: function (res) {
        console.log("删除数据成功",res)
        wx.cloud.deleteFile({
          fileList: removeList,
          success: res => {
            console.log("删除图片文件成功"+res.fileList)
            wx.redirectTo({
              url: '/pages/NoteList/NoteList'
            })
          },
          fail: console.error
        })
      },
      fail: function (res) {
        console.log("删除数据失败", res)
      },
    })
  }
})
