// pages/mine/mine.js
var app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    let that = this
  },
  ToNotePage() {
    wx.redirectTo({
      url: '/pages/Note/Note'
    })
  },
  ToNoteList() {
    wx.redirectTo({
      url: '/pages/NoteList/NoteList'
    })
  }

})