// pages/frontpage/index.js
const app = getApp()
const time = require('../..//utils/time.js')
import { prorequest } from '../../request/index.js'
const box = require('../../utils/box.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        timestamp:new Date().getTime(),
        page: 1,
        pageSize: 4,
        group: [
            {
                id:0,
                value:"低强度持续训练",
                isActive:true
            },
            {
                id:1,
                value:"中等强度持续训练",
                isActive:false
            },
            {
                id:2,
                value:"高强度间歇训练",
                isActive:false
            }
        ],
        mealInfoList:[],
        totalStudents:0,
        meetStudents:0,
        not_standard:0,
        digital:0,
        date:0,
        notPassReasons:[],
        index:0,
        showModal: true
    },
    QueryParams: {
        // 默认第一组数据
        groupId: 0,
        pagenum: 1,
        pagesize: 10,
        school: app.globalData.userInfo.school 
    },
    // 总页面数量
    totalPages: 1,
    // 只会在页面加载时调用,不会有第二次.
    onLoad: function (options) {
        this.QueryParams.group = 0;
        this.currentTime();
        this.getFoodList();
        // this.getNotReasons();
        this.getTotal();
    },
    getTotal() {

        console.log(this.data)
        let params = {
            school: app.globalData.userInfo.school,
            timestamp: this.data.date
        }
        console.info("导航人数传参",params)
        prorequest({url:'/manage/total.hn', data: params})
        .then(result => {
            console.info("导航人数回调",result)
            this.setData({
                totalStudents: result.totalStudents,
                meetStudents: result.meetStudents,
                not_standard:result.not_standard
            })
        })
    },
    // getNotReasons() {
    //     prorequest({url:'/getNotPassReasons.hn'})
    //     .then(result => {
    //         console.info('getNotReasons',result);
    //         this.setData({
    //             notPassReasons: result.msg
    //         });
    //     })
    // },
    // 当前页
    currentTime() {
        let tempTime = new Date(this.data.timestamp);
        let month=tempTime.getMonth() + 1;
        let day=tempTime.getDate();
        if(month<10){
            month="0"+month
        }
        if(day<10){
            day="0"+day
        }
        let curtime = tempTime.getFullYear() + "-" + (month) + "-" + day;
        console.log('currentTime' + curtime);
        this.setData({
            date: curtime
        })
    },
    changeTimeBefore() {
        let timestamp = this.data.timestamp - 24 * 60 * 60 * 1000;
        let tempTime = new Date(timestamp);
        let month=tempTime.getMonth() + 1;
        let day=tempTime.getDate();
        if(month<10){
            month="0"+month
        }
        if(day<10){
            day="0"+day
        }
        let date = tempTime.getFullYear() + "-" + (month) + "-" + day;

        // let date = new Date(timestamp).toLocaleString().substring(0, 10);
        let { group } = this.data;
        group.forEach((v, i) => {
            if (i === 0) {
                v.isActive = true;
                this.QueryParams.groupId = 0;
            } else {
                v.isActive = false;
            }
        });
        this.setData({
            timestamp: timestamp,
            date: date, 
            group
        });
        // 重置数组
        this.setData({
            mealInfoList:[]
        });
        this.QueryParams.pagenum = 1; // 重置页码
        this.getFoodList();
        this.getTotal();
    },
    changeTimeNext() {
        if(new Date(this.data.timestamp).toDateString() === new Date().toDateString()){
            return; //到达今天时，不能再选择下一天
        }
        let timestamp = this.data.timestamp + 24 * 60 * 60 * 1000;
        let tempTime = new Date(timestamp);
        let month=tempTime.getMonth() + 1;
        let day=tempTime.getDate();
        if(month<10){
            month="0"+month
        }
        if(day<10){
            day="0"+day
        }
        let date = tempTime.getFullYear() + "-" + (month) + "-" + day;
        // let date = new Date(timestamp).toLocaleString().substring(0,10);
        // 重置分组
        let {group} = this.data;
        console.log('changeTimeNext' + date);
        group.forEach((v, i) => {
            if (i === 0) {
                v.isActive = true;
                this.QueryParams.groupId = 0;
            } else {
                v.isActive =false;
            }
        });
        console.log(group);
        this.setData({
            timestamp: timestamp,
            date: date,
            group
        });
        // 重置数组
        this.setData({
            mealInfoList:[]
        });
        this.QueryParams.pagenum = 1; // 重置页码
        this.getFoodList();
        this.getTotal();
    },
    groupChange(e) {
        // 更换日期时应该初始化分组,初始化之后应该更新数据.
        const {index} = e.currentTarget.dataset;
        let {group} = this.data;
        group.forEach((v, i) => {
            if(i === index) {
                v.isActive = true;
                this.QueryParams.groupId = v.id;
                // 重置数组
                this.setData({
                    mealInfoList:[]
                });
                this.QueryParams.pagenum = 1; // 重置页码
                this.getFoodList(); // 重新发送请求
            } else {
                v.isActive = false;
            }
        });
        this.setData({
            group
        })
    },
    tishi(){
        wx.showModal({
            title: '温馨提示',
            content: '此条记录已经完成审核！',
            showCancel: false,//是否显示取消按钮
            // cancelText:"否",//默认是“取消”
            // cancelColor:'#23CBC4',//取消文字的颜色
            confirmText:"确定",//默认是“确定”
            // confirmColor: '#23CBC4',//确定文字的颜色
            // success: function (res) {
            //     //跳转
            //     wx.navigateTo({
            //         url: '/pages/personalCenter/baseInfoEdit',
            //       })
            // }
         })
    },
    getFoodList() {
        console.info("QueryParams=>>>>>>",this.QueryParams);
        let params = {
            // 暂时写死为6
            id: 6,
            timestamp: this.data.date,
            group: this.QueryParams.groupId,
            pagenum: this.QueryParams.pagenum, //页数
            pagesize: this.QueryParams.pagesize, //每页数据
            school: app.globalData.userInfo.school // 学校
        }
        console.info("食物列表传参",params)
        prorequest({url:'/manage/queryList.hn' ,data: params})
        .then(result => {
            console.info('食物列表回调',result);
            const total = result.total;
            if (total === 0) {
                // TODO
                return;
            } else {
                // debugger
                this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
                this.setData({
                    mealInfoList: [...this.data.mealInfoList, ...result.msg]
                });
                // console.log(this.data.mealInfoList);
            }
            // console.log(this.data.mealInfoList);
        });
        //关闭下拉刷新窗口,如果没有调用下拉刷新窗口直接关闭也不会报错
        wx.stopPullDownRefresh();
    },
    // 提醒个人
    remindMeal(e) {
        let params = {
            s_id: e.currentTarget.dataset.id,
            timestamp: this.data.date,
            sender_id: app.globalData.userInfo.id,
            // send_time: new Date().getTime()
        }
        console.info("提醒个人传参",params);
        prorequest({url:'/manage/remindPerson.hn', data: params})
        .then(result => {
            console.info("提醒个人回调",result);
            if (result.success) {
                wx.showToast({
                    title: '提醒成功'
                });
            } else {
                wx.showToast({
                    title: result.msg
                });
            }
        })
    },
    // 一键提醒
    remindPersons() {
        let params = {
            timestamp: this.data.date,
            sender_id: app.globalData.userInfo.id,
            // send_time: time.formatTime1(new Date()),
        }
        console.info("一键提醒传参",params)
        prorequest({url:'/manage/remindPersons.hn', data: params})
        .then(result => {
            console.info("一键提醒回调",result)
            if (result.success) {
                wx.showToast({
                    title: '全部提醒完成'
                })
            } else {
                wx.showToast({
                    title: result.msg
                })
            }
        })
    },
    handlePreview(e) {
        console.info('preview', e);
        const cur = e.currentTarget.dataset.src;
        const list = e.currentTarget.dataset.list;
        wx.previewImage({
            current: cur,
            urls: list
        });
    },
    notPass(e,content) {
        var that=this;
        let params = {
            s_id: e.currentTarget.dataset.id,
            reason: content,
            is_meet: 2,
            timestamp: this.data.date,
            manager_id: app.globalData.userInfo.id
        }
        console.info('不通过传参',params);
        prorequest({url:'/manage/isPass.hn', data: params})
        .then(result => {
            console.info('不通过回调',result);
            if(result.success) {
                wx.showToast({
                    title: '操作成功'
                });
                var mealInfoList=that.data.mealInfoList;
                mealInfoList[e.currentTarget.dataset.index].meal_info[0].is_meet=2
                that.setData({
                    mealInfoList
                })
            } else {
                wx.showToast({
                    title: '请勿重复操作'
                });
            }
        })
        this.getTotal();
    },
    bindPickerChange(e) {
        // debugger
        var that=this;
        wx.showModal({
            title:"请输入原因",
            cancelColor: 'cancelColor',
            editable:true,
            placeholderText:"请输入内容",
            success(res) {
                if (res.confirm) {
                 if(res.content==""){
                    wx.showToast({
                         title: '请输入内容',
                         icon:"error"
                     });       
                 }
                 else{
                    that.notPass(e,res.content);
                 }
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
          })
    },
    isPass(e) {
        var that=this
        wx.showModal({
            title: '提示',
            content: '通过后将不允许更改,是否确认？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                let params = {
                    s_id: e.currentTarget.dataset.id,
                    is_meet: 1,
                    timestamp: that.data.date,
                    manager_id: app.globalData.userInfo.id
                }
                // 默认是通过,
                console.info("通过传参",params)
                prorequest({url:'/manage/isPass.hn', data: params})
                .then(result => {
                    console.info("通过回调",result)
                    if(result.success) {
                        wx.showToast({
                            title: '操作成功'
                        });
                        var mealInfoList=that.data.mealInfoList;
                       mealInfoList[e.currentTarget.dataset.index].meal_info[0].is_meet=1
                        that.setData({
                        mealInfoList
                        })
                    } else {
                        wx.showToast({
                            title: '请勿重复操作'
                        });
                    }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          that.getTotal();
        
    },
    // 滚动条触底事件
    onReachBottom() {
        // debugger
        if(this.QueryParams.pagenum >= this.totalPages) {
            // 没有下一页数据
            wx.showToast({
                title: '没有下一页数据'
            });
        } else {
            // 有下一页数据
            this.QueryParams.pagenum++;
            this.getFoodList();
        }
    },
    // 下拉刷新事件
    // 不需要重置group,不需要重新刷新日期
    onPullDownRefresh() {
        // 1重置数组
        this.setData({
            mealInfoList:[]
        });
        // 2重置页码
        this.QueryParams.pagenum = 1;
        // 3重新发送请求
        this.getFoodList();
        this.getTotal();
        // this.getNotReasons();
    }
})