const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        type: 1,
        hwid: '',
        name: '',
        workOutinfoList: [
            {
                "id": 1,
                "time": "2022-09-13", // 日期
                "bullraterange": '110-130', // 靶心率范围
                "targetheartrate": '80', // 目标靶心率
                "timeslot": '7：00~17：00', // 时间段
                "normalnumber": '32', // 靶心率达标次数
                "abnormalnumber": '2', // 靶心率超过次数
              },
              {
                "id": 2,
                "time": "2022-09-13", // 日期
                "bullraterange": '110-130', // 靶心率范围
                "targetheartrate": '80', // 目标靶心率
                "timeslot": '7：00~17：00', // 时间段
                "normalnumber": '32', // 靶心率达标次数
                "abnormalnumber": '2', // 靶心率超过次数
          
              },
              {
                "id": 3,
                "time": "2022-09-13", // 日期
                "bullraterange": '110-130', // 靶心率范围
                "targetheartrate": '80', // 目标靶心率
                "timeslot": '7：00~17：00', // 时间段
                "normalnumber": '32', // 靶心率达标次数
                "abnormalnumber": '2', // 靶心率超过次数
          
              },
              {
                "id": 4,
                "time": "2022-09-13", // 日期
                "bullraterange": '110-130', // 靶心率范围
                "targetheartrate": '80', // 目标靶心率
                "timeslot": '7：00~17：00', // 时间段
                "normalnumber": '32', // 靶心率达标次数
                "abnormalnumber": '2', // 靶心率超过次数
          
              },
              {
                "id": 5,
                "time": "2022-09-13", // 日期
                "bullraterange": '110-130', // 靶心率范围
                "targetheartrate": '80', // 目标靶心率
                "timeslot": '7：00~17：00', // 时间段
                "normalnumber": '32', // 靶心率达标次数
                "abnormalnumber": '2', // 靶心率超过次数
          
              }
          
        ]
    },
    onLoad: function (options) {
        let that = this;
        let type = options.type;
        let hwid = options.hwid;
        this.setData({
            type: type,
            hwid: hwid,
            name: options.name
        });
        if (type == 1 || type == 3) {
            wx.setNavigationBarTitle({
                title:"靶心率范围"
            })
            // this.getWorkOutinfo();
        } else {
            //没这个类型
            wx.showModal({
                title: '温馨提示',
                content: '没有这个类型的运动数据',
                showCancel: false, //是否显示取消按钮
                cancelText: "否", //默认是“取消”
                cancelColor: 'skyblue', //取消文字的颜色
                confirmText: "好的", //默认是“确定”
                confirmColor: 'skyblue', //确定文字的颜色
                success: function (res) {
                    wx.navigateBack();
                }
            })
        }
    },
    onShow: function () {

    },
    getWorkOutinfo(){
        let that = this;
        let data = {
            hw_id: this.data.hwid
        }
        request.request_get('/hmapi/getBullRateRange.hn', data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    workOutinfoList: res.msg
                });
            }
        })
    },
});