//app.js
var promise = require("./libs/Promise.js")
var connWebSocket = require("./functions/connect.js")
var userIp = "192.168.1.107"
    //获取用户的的IP有两种方法：
    //一种是服务器端获取访问用户IP并记录
    //一种是客户端获取本地ip发送给服务端
    //两种都没有找到API或者封装好的包的实现。。。
    //所以先这么硬编码一下
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const self = this
    connWebSocket.connect(
      function(succ){
        console.log(succ)
    },function(fail){
      console.log(fail)
    });
    
//先获取用户的用户名
    var p = new promise(function(resolve,reject){
        wx.getUserInfo({
            success: function(res){
            resolve(res.userInfo.nickName)
          },
          fail: function() {
            console.log("Failed to get userInfo")
          },
        })
    })
  //再将用户名和用户用户IP写入要发送给服务器的数据中，连接端口
   p.then(function(data){
    console.log(self.globalData.userInfo)
    var dataSent = {
      //json真棒！
      state : "*",
      username:data,
      userIp:userIp
    }
    //dataSent是全局变量
     return new promise(function(res,rej){
       //发送数据，并设置接收到数据时使用的回调函数
       connWebSocket.setRecvCallback(self.online)
       connWebSocket.sendMsg(dataSent,res,rej)
     })
   })
     .then(function(resData){
       //发送数据成功
       console.log(resData)
     },
     function(rejData){
       //发送数据失败
       console.log(rejData)
     });
     
  },
   online:function(msgRecv){
     try {
        wx.setStorageSync('uuid', msgRecv)
     } catch (e) {  
       console.log(e)
     } 
   },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
  }
})