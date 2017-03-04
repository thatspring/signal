// pages/info/info.js
var app = getApp()
Page({
  data:{
    userInfo:{},
    list:[
        {
          img:"../../image/love_full.png",
          name:"收藏"
        },
        {
          img:"../../image/landscape.png",
          name:"我的位置"
        },
        {
          img:"../../image/2dcode.png",
          name:"扫码加好友"
        }
    ]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})