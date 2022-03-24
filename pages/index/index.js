
const app = getApp()
const updateApp = require('../../utils/updateApp.js')
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')
import { prorequest } from "../../request/index.js"

Page({
    data:{
        timestamp:new Date().getTime(),
        page:1,
        pageSize:2,
        mealInfoList:[],
        count:0,
        digital:0,
        date:0
    },
    onLoad:function(){
        let that = this;
        
        // 自动检查小程序版本并更新
        updateApp.updateApp("健康管理系统");
        that.getMsg();
        that.getmealInfoList();
        this.currentTime();
    },
    currentTime() {
        let curtime = Date().getTime().toLocaleString().substring(0, 10);
        this.setData({
            date: curtime
        })
    },
    // 按照需求我是不需要这个功能的,保留
    onShow:function() {
        let that = this;
        that.getMsg();
        //每次进来，判断是否填写信息
        if(app.globalData.userInfo.base_info==0){
            //直接提示并跳转信息编辑页面
            wx.showModal({
                title: '温馨提示',
                content: '请先完善个人信息',
                showCancel: false,//是否显示取消按钮
                cancelText:"否",//默认是“取消”
                cancelColor:'skyblue',//取消文字的颜色
                confirmText:"立即完善",//默认是“确定”
                confirmColor: 'skyblue',//确定文字的颜色
                success: function (res) {
                    //跳转
                    wx.navigateTo({
                        url: '/pages/personalCenter/baseInfoEdit',
                    })
                }
            })
        }
    },
    changeTimeBefore:function(){
        let that = this;
        var timestamp = that.data.timestamp-24*60*60*1000;
        
        var date = new Date(timestamp).toLocaleString().substring(0,10);
        that.setData({
            page:1,
            timestamp:timestamp,
            date:date,
            mealInfoList:[]
        })
        console.log(that.data.timestamp)
        that.getmealInfoList();
    },
    changeTimeNext:function(){
        let that = this;
        if(new Date(that.data.timestamp).toDateString() === new Date().toDateString()){
            return; //到达今天时，不能再选择下一天
        }
        
        var timestamp = that.data.timestamp+24*60*60*1000;
        var date = new Date(timestamp).toLocaleString().substring(0,10);
        that.setData({
            page:1,
            timestamp:timestamp,
            date:date,
            mealInfoList:[]
        })
        this.getmealInfoList();
    },
    // 同理
    // addDietRecord:function(e){
    //  let type=e.currentTarget.dataset.type;
    //     console.log(type);
    //     wx.navigateTo({
    //       url: '/pages/index/addDietRecord?type='+type,
    //     })
    // },
    // goMessage:function(e){
    //     wx.navigateTo({
    //         url: '/pages/index/message?',
    //     })
    // },
    getmealInfoList: function () {
    var that = this;
    console.log(that.data.page)
    console.log(that.data.timestamp)
    var data = {
        meal_person_id: app.globalData.userInfo.id,
        timestamp:that.data.timestamp,
        pageNum: that.data.page, //页数
        pageCount: that.data.pageSize //每页数据
    }
    request.request_get('/api/getFoodList.hn', data, function (res) {
        console.info('回调', res)
        if (res) {
            if (res.success) {
                var mealInfoListTemp = that.data.mealInfoList;
                var mealInfoList = res.msg;
                if(mealInfoList.length == 0 && that.data.page == 1 ){
                    that.setData({
                    tip:"暂无数据",
                    tip_temp:'暂无数据',
                    
                        alreadyChecked:true,
                        alreadyChecked_temp:true
                    })
                }else if(mealInfoList.length < that.data.pageSize){ //无更多数据
                    that.setData({
                        hasMoreData:false,
                        page: that.data.page + 1,
                        tip:"没有更多数据了",
                        tip_temp:'没有更多数据了',
                        alreadyChecked:true,
                        alreadyChecked_temp:false
                    })
                }else{      // 有更多数据
                    that.setData({
                        hasMoreData:true,
                        page: that.data.page + 1,
                        tip:"加载中",
                        tip_temp:'加载中',
                        alreadyChecked:true,
                        alreadyChecked_temp:false
                    })
                }
                mealInfoList = mealInfoListTemp.concat(mealInfoList);
                console.info(mealInfoList);
                for(var i=0; i< mealInfoList.length;i++){
                    
                        var str_arr_1 =  mealInfoList[i].meal_content.split(";");
                        str_arr_1.pop(); 
                        mealInfoList[i].meal_content_arr = str_arr_1;
                        console.info(mealInfoList[i].meal_content_arr);
                    
                    
                        var str_arr_2 =  mealInfoList[i].intake_amount.split(";");
                        str_arr_2.pop(); 
                        mealInfoList[i].intake_amount_arr = str_arr_2;
                        console.info(mealInfoList[i].intake_amount_arr);
                    
                }
                console.info(mealInfoList);
                that.setData({
                    mealInfoList: mealInfoList,
                    count:res.count
                });
                console.info(that.data.mealInfoList);
            } else {
                box.showToast(res.msg);
            }
        }else{
        box.showToast("网络不稳定，请重试");
        }
	})
    },
    getMsg:function(){
        let that = this;
    //每次进来更新数据 TODO
    let data = {
        id: app.globalData.userInfo.id
    }
    request.request_get('/api/getMsg.hn', data, function (res) {
        console.info('回调', res)
        if (res) {
            if (!res.success) {
                box.showToast(res.msg);
                return;
            }
            console.log(res.count)
            that.setData({
                digital:res.count
            })
        }
    })
    },

    // loginApp:function(){
    //     wx.login({
    //         success: (res) => {
    //             var code = res.code;
    //             console.log("获取code成功" + code );
    //             request.request_get('/pigProjectApplet/entryApplet.hn', { wxCode: code }, function (res) {
    //                 console.info('回调', res);
    //                 if(res){
    //                     if(res.success){
    //                         app.globalData.openid = res.msg;
    //                         if(res.code=='200'){    //没有登陆过小程序
    //                             wx.reLaunch({
    //                                 url: '/pages/main/login',
    //                             })
    //                         } else if (res.code=='199'){    // 获取登录账号的相关信息
    //                             login.toLogin(res.phone);
    //                         }
    //                     }else{
    //                         box.showToast(res.msg);
    //                     }
    //                 }
    //             })
    //         },
    //         fail:(res) => {
    //             console.log("登录信息获取失败：" + res);
    //             box.showToast("登录信息获取失败，请重试")
    //         }
    //     })
    // },
})
