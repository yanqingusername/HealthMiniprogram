const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        type: 1,
        expertAdviceList: [],
        sid: ''
    },
    onLoad: function (options) {
        this.setData({
            type: options.type,
            sid: options.sid
        });
        if(this.data.type == 1){
            wx.setNavigationBarTitle({
                title:"专家指导建议"
            })
        } else if(this.data.type == 2){
            wx.setNavigationBarTitle({
                title:"腹部超声"
            })
        }
        this.gExpert_advice();
    },
    onShow: function () {},
    gExpert_advice(){
        let that = this;
        let data = {
            s_id: this.data.sid
        }
        request.request_get('/hmapi/gExpert_advice.hn', data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    expertAdviceList: res.msg
                });
            }
        })
    },
    
});