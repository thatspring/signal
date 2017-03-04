//index.js
//获取应用实例
var app = getApp()
var sockectOpen = false;
var connWebSocket = require("../../functions/connect.js")
var reg = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/
//用于匹配ip地址地址xxx.xxx.xxx.xxx
Page({
  data: {
      userInfo: {},
      list:[{
        text:"C",
        list_tool:[
          {
            image:"../../image/cao.png",
            name:"曹颖",
            msgNum:0
          },
          {
            image:"../../image/chen.png",
            name:"陈高德",
            msgNum:0
          },
        ]
      },
      {
        text:"J",
        list_tool:[{
          image:"../../image/jiang.png",
          name:"家伟",
          msgNum:0
        }]
      },
      {
        text:"L",
        list_tool:[
          {
            image:"../../image/liu.png",
            name:"刘佳斌",
            msgNum:0
          }
        ]
      },
      {
        text:"H",
        list_tool:[{
          image:"../../image/love.png",
          name:"胡彩珍",
          msgNum:0
        }],
      },
      {
        text:"W",
        list_tool:[{
            image:"../../image/love.png",
            name:"王一航",
            msgNum:0
          }]
      }],
      msgRecv:[]   
  },
  //事件处理函数
  goPage:function(e){
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../dialog/dialog?name='+name + "&msg=" + this.data.msgRecv,
      success: function(res){
        console.log("Jump Success!")
      },
      fail: function() {
        console.log("Jump failed!")
      },
    })
  },
  onLoad: function () {
    console.log('onLoad')
    //connWebSocket.setRecvCallback(this.msgHandler)
  },
  msgHandler:function(msg){
    var recv = JSON.parse(msg)
    var sender = recv.form
    console.log("23333")
    if(recv.state == "<"){
       this.setData({
          msgRecv: [...this.data.msgRecv, {
                  text: recv.message,
                  from: 'recv'
              }]
       })
       var found = 0;
       for(var i = 0; !found && i < this.data.list.length;i++){
         for(var j = 0;!found && j < this.data.list[i].list_tool.length;j++){
           if(!found && sender == this.data.list[i].list_tool[j].name){
             
             var newList = this.data.list
             newList[i].list_tool[j].msgNum++
             this.setData({
               list:newList
             })
             found = 1;
             break;
           }
         }
       }
    }
  }
})
