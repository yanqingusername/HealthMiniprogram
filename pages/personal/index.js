const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        name: '',
        school: '',
        avatarUrl: '',
        cur_height_weight: {
            height: '-',
            weight: '-',
            create_time: '-'
        },
        cur_blood_pressure: {
            systolic: '-',
            diastolic: '-',
            create_time: '-'
        },
        cur_body_composition: {
            muscle_mass: '-',
            fat_rate: '-',
            create_time: '-'
        },
        cur_bone_density: {
            t: '-',
            z: '-',
            create_time: '-'
        },
        cur_sports_bracelet: {
            steps: '-',
            heart_rate: '-',
            exercise_time: '-',
            create_time: '-'
        }
    },
    onLoad: function () {
        let that = this;
        console.log("进入个人中心")
        that.setData({
            name: app.globalData.nickName,
            avatarUrl: app.globalData.avatarUrl,
        })

        //这里需要获取最新的体检数据，判断是否有新的问卷
        let data = {
            id: app.globalData.userInfo.id
        }
        // request.request_get('/api/getPhysicalExamination.hn', data, function (res) {
        //     console.info('回调', res)
        //     if (res) {
        //         if (!res.success) {
        //             box.showToast(res.msg);
        //             return;
        //         }
        //         if (res.hw != '') {
        //             that.setData({
        //                 cur_height_weight: res.hw
        //             })
        //         }
        //         if (res.bp != '') {
        //             that.setData({
        //                 cur_blood_pressure: res.bp
        //             })
        //         }
        //         if (res.bc != '') {
        //             that.setData({
        //                 cur_body_composition: res.bc
        //             })
        //         }
        //         if (res.bd != '') {
        //             that.setData({
        //                 cur_bone_density: res.bd
        //             })
        //         }
        //         if (res.sb != '') {
        //             that.setData({
        //                 cur_sports_bracelet: res.sb
        //             })
        //         }
        //     }
        // })
    },
    onShow: function () {
        let that = this;
        //这里面需要每次去app.js中获取用户基本信息，然后展示
        that.setData({
            name: app.globalData.userInfo.name,
            school: app.globalData.userInfo.school
        })
    },

    enter_baseInfo: function () {
        wx.navigateTo({
            url: '/pages/baseInfo/index',
        })
    },
    enter_questionnaire: function () {
        wx.navigateTo({
            url: '/pages/personalCenter/questionnaire',
        })
    },
    enter_healthReport: function () {
        wx.navigateTo({
            url: '/pages/personalCenter/healthReport',
        })
    },
    enter_sports: function (e) {
        let type = e.currentTarget.dataset.type;
        console.log(type);
        wx.navigateTo({
            url: '/pages/personalCenter/sportsData?type=' + type,
        })
    },


    // 退出当前账号
    exit: function () {
        wx.showModal({
            title: '',
            content: '是否退出当前账号',
            success: function (res) {
                if (res.confirm) {
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })

                    var data = {
                        openid: app.globalData.openid,
                        type:0
                    }
                    request.request_get('/api/appLogOut.hn', data, function (res) {
                        console.info('回调', res)
                        if (res) {
                            if (res.success) {
                                wx.reLaunch({
                                    url: '/pages/login/login',
                                })
                            } else {
                                box.showToast("退出失败，请稍后再试");
                            }
                        }
                    })
                }
            }
        })
    }
});