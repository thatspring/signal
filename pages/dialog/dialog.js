var app = getApp();
var promise = require("../../libs/Promise.js")
var connWebSocket = require("../../functions/connect.js")
var reg = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/
// “./”是当前目录  “../”是上级目录
Page({
    data:{
        friendName:null,
        friendIp:2333,
        getIp:false,
        userName: '',
        messages: [],
        loading: false,
        inputValue: '',
        inputContent: {},
        friendState:null
    },
    onLoad:function(options){
        const self = this//必须用const将page的this指针传入promise
        app.getUserInfo(function(data){
            self.setData({
                userName:data.nickName
            })
        })
        this.setData({
            friendName: options["name"],
            messages:[...options["msg"]]
        })
       
        //设置标题为好友名字
        wx.setNavigationBarTitle({
            title: this.data.friendName 
        });
        
        var dataSent = {
            state:"@",
            friendName:self.data.friendName
        }   
        connWebSocket.setRecvCallback(this.msgHandle)
        connWebSocket.sendMsg(dataSent,this.commonRes,this.commonRej);
    },
    bindChange(e) {
        this.data.inputContent[e.currentTarget.id] = e.detail.value
    },
    sendMessage() {
        //点击send按钮触发的函数
        this.setData({
        messages: [...this.data.messages, {
                text: this.data.inputContent.message,
                from: 'sent'
            }]
        })
        this.setData({
            inputValue : ''
        })
        const _self = this
        if(this.data.friendState === "+"){
            //好友状态为‘+’才允许通信
            var uuid = wx.getStorageSync('uuid')
            //从本地缓存中获取分配到的uuid
            var dataSent = {
                    state:">",
                    targetName:_self.data.friendName,
                    targetIp:_self.data.friendIp,
                    message:_self.data.messages[_self.data.messages.length - 1].text,
                    uuid:uuid,
                    name:_self.data.userName
            }
            connWebSocket.sendMsg(dataSent,this.commonRes,this.commonRej);
        }
        else{
            wx.showToast({
                title:"您的好友已下线",
                icon:"success",
                duration:5000
            })
            setTimeout(function(){
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                  success: function(res){
                    console.log("friend offline jump")
                  },
                  fail: function() {
                    console.log("jump failed")
                  }
                })
            },3000)
        }
    },
    msgHandle:function(data){
        var recv = JSON.parse(data)
        var state = recv.state
        if(state === "+"){
            //好友在线提示
            wx.showToast({
                title:"可以开始聊天啦！",
                icon:"success",
                duration:2000
            })
            this.setData({
                friendState:"+"
            }) 
            this.setData({
                friendIp:data.message
            })
        }
        else if(state === "-"){
            //目前没做离线通信，故直接退回上级页面
            this.setData({
                friendState:"-"
            })
            wx.showToast({
                title:"好友不在线，通信失败",
                icon:"loading",
                duration:5000
            })
            setTimeout(function(){
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                  success: function(res){
                    console.log("navigate back")
                  },
                  fail: function() {
                    console.log("navigate back failed")
                  }
                })
            },3000)
        }
        else if(state === "<"){
            //收到消息
            console.log(recv.message)
            this.setData({
                messages: [...this.data.messages, {
                        text: recv.message,
                        from: 'recv'
                    }]
            })
        }
        else{
            this.setData({
                friendState:"Server wrong"
            })
        }
    },
    commonRes:function(result){
        console.log(result)
    },
    commonRej:function(result){
        console.log(result)
    }
})
