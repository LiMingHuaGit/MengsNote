// pages/Note/Note.js
const app = getApp(); //获取应用实例
//获得util.js的函数,先模块化引用utils里面的js地址,reqiure('js地址')成一个面向对象
var util = require('../../utils/util.js');

const compareVersion = util.compareVersion;
const DB = wx.cloud.database().collection("Note");

Page({

  data: {
    typeRadio: ['happy', 'cry', 'angry', 'smile'],
    placeholder: {
      contentPlaceholder: '',
      titlePlaceholder: '',
    },
    value: {
      Type: '',
      Time: '',
      Title: '',
      Content: '',
      NoteId: '',
    },
    isUpdate: false,
    formats: {},
    readOnly: false,
    htmlContent: {},
    imgFileId: '',
  },

  onLoad(options) {
    var update = Boolean(options.isUpdate);
    console.log(update);
    if (update) {
      this.setData({
        isUpdate: true,
        'placeholder.contentPlaceholder': null,
        'placeholder.titlePlaceholder': null,
        'value.NoteId': options.id,
        'value.Type': options.type,
        'value.Time': util.formatTime(new Date()),
        'value.Title': options.title,
        'value.Content': decodeURIComponent(options.content),
      })
    } else {
      this.setData({
        'placeholder.contentPlaceholder': '开始输入...',
        'placeholder.titlePlaceholder': '标题',
        'value.Type': 'happy',
        'value.Time': util.formatTime(new Date()),
      })
    }
    this.canUse = true;
    const {
      SDKVersion
    } = wx.getSystemInfoSync()
  },

  onShareAppMessage() {
    return {
      title: 'editor',
      path: 'page/component/pages/editor/editor'
    }
  },

  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      that.editorCtx.setContents({
        html: that.data.value.Content
      })
    }).exec()
  },

  undo() {
    this.editorCtx.undo()
  },

  redo() {
    this.editorCtx.redo()
  },

  format(e) {
    if (!this.canUse) return
    const {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },

  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },

  insertDivider() {
    this.editorCtx.insertDivider({
      success() {
        console.log('insert divider success')
      }
    })
  },

  clear() {
    this.editorCtx.clear({
      success() {
        console.log('clear success')
      }
    })
  },

  removeFormat() {
    this.editorCtx.removeFormat()
  },

  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },

  // 点击图片将图片插入富文本编辑器里面
  insertImage() {
    var that = this;
    var imgUrl;
    wx.chooseImage({
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: (new Date()).getTime() + Math.floor(9 * Math.random()) + '2.jpg',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log('上传成功', res.fileID)
            imgUrl = res.fileID;
            this.setData({
              imgFileId: imgUrl
            });
            //插入到富文本中
            that.editorCtx.insertImage({
              src: imgUrl,
            })
          },
        })
      },
    })

  },

  NoteSubmit: function (e) {
    var that = this;
    console.log("数据为", e.detail.value)
    var title = e.detail.value.title;
    var time = e.detail.value.time;
    var type = e.detail.value.type;
    var imgId = that.data.imgFileId;
    this.editorCtx.getContents({
      success(res) {
        console.log(res)
        console.log(res.html)
        const htmlContent = res.html
        if (that.data.isUpdate) {
          console.log('更新数据')
          console.log(that.data.value.NoteId)
          DB.doc(that.data.value.NoteId).update({
            data: {
              title: title,
              time: time,
              type: type,
              content: htmlContent,
              imgId: imgId
            },
            success(res) {
              console.log("写数据成功", res)
              wx.redirectTo({
                url: '/pages/mine/mine'
              })
            },
            fail(res) {
              console.log("写数据失败", res)
            },
          })
        } else {
          DB.add({
            data: {
              title: title,
              time: time,
              type: type,
              content: htmlContent,
              imgId: imgId
            },
            success(res) {
              console.log("写数据成功", res)
              wx.redirectTo({
                url: '/pages/mine/mine'
              })
            },
            fail(res) {
              console.log("写数据失败", res)
            },
          })
        }
      }
    })
  },

})