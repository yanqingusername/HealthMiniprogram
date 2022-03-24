const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

const time = require('../../utils/time.js')
Page({
    data: {
        typeIndex: '',
        typeArr: ['男', '女'],
        schoolIndex: 0,
        schoolArr: [],
        baseInfo: {}
    },
    onLoad: function () {
        let that = this;
        console.log("进入个人信息编辑")
        //获取个人信息，获取学校列表
        request.request_get('/manage/getBaseInfo.hn', {
            openid: app.globalData.openid
        }, function (res) {
            console.info('管理员基本信息回调', res);
            if (res) {
                if (res.success) {
                    //数据填充
                    that.setData({
                        baseInfo: res.baseInfo,
                        schoolArr: res.school_list
                    })
                    // for (let i = 0; i < res.schoolArr.length; i++) {
                    //     if(res.schoolArr[i].name==res.baseInfo.school){
                    //         that.setData({schoolIndex: i})
                    //     }
                    // }
                } else {
                    box.showToast(res.msg);
                }
            }
        })
    },
    onShow: function () {

    },
    savedata: function () {
        //获取数据
        console.log('进入提交方法');
        let that = this;
        let data = that.data.baseInfo;
        console.log(data);
        //判断参数
        if(data.name===''||data.gender===''||data.birth===''||data.student_number===''||data.school===''){
            box.showToast('请补全信息再提交');
            return;
        }
        request.request_get('/api/updateBaseInfo.hn', {
            baseInfo: data
        }, function (res) {
            console.info('回调', res);
            if (res) {
                if (res.success) {
                    //更新前端个人信息
                    app.globalData.userInfo = data;
                    app.globalData.userInfo.base_info = 1;
                    //返回上一页即可
                    wx.navigateBack();
                } else {
                    box.showToast(res.msg);
                }
            }
        })
    },
    typeChange(e) {
        let that = this;
        console.log(e);
        let temp = that.data.baseInfo;
        temp.gender = e.detail.value
        that.setData({
            baseInfo: temp
        })
    },
    bindDateChange: function (e) {
        let that = this;
        console.log(e);
        let temp = that.data.baseInfo;
        temp.birth = e.detail.value
        that.setData({
            baseInfo: temp
        })
    },
    bindSchoolChange: function (e) {
        let that = this;
        console.log('bindSchoolChange',e.detail.value);
        let values = e.detail.value;
        let temp = that.data.baseInfo;
        temp.school = that.data.schoolArr[values].name;
        that.setData({
            schoolIndex: values,
            baseInfo:temp
        })
    },
    getName: function (e) {
        let that = this;
        let temp = that.data.baseInfo;
        temp.name = e.detail.value
        that.setData({
            baseInfo: temp
        })
    },
    getSN: function (e) {
        let that = this;
        let temp = that.data.baseInfo;
        temp.student_number = e.detail.value
        that.setData({
            baseInfo: temp
        })
    },
});