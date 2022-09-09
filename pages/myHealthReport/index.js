const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        reportList: [],
        sid: '',
        name: ''
    },
    onLoad: function (options) {

        let name = options.name;
        this.setData({
            sid: options.sid,
            name: name
        });
        wx.setNavigationBarTitle({
            title: name + "的健康报告"
        })
    },
    onShow: function () {
        this.getReportlist();
    },
    getReportlist(){
        let that = this;
        let data = {}
        request.request_get('/hmapi/getReportlist.hn', data, function (res) {
            console.info('回调', res)
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    reportList: res.msg
                });
                
            }
        })
    },
    bindExpertSuggest(e){
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: `/pages/expertSuggest/index?type=${type}&sid=${this.data.sid}`,
        })
    },
    bindInspectResults(e){
        let method = e.currentTarget.dataset.method;
        let type = e.currentTarget.dataset.type;
        let title = e.currentTarget.dataset.title;
        let csstype = e.currentTarget.dataset.csstype;
        if(method && title && csstype && type && this.data.sid){
            wx.navigateTo({
                url: `/pages/healthInspectResults/index?method=${method}&csstype=${csstype}&title=${title}&type=${type}&sid=${this.data.sid}`,
            })
        }else{
            //没这个类型
            wx.showModal({
                title: '温馨提示',
                content: '暂无此类的数据',
                showCancel: false, //是否显示取消按钮
                cancelText: "否", //默认是“取消”
                confirmText: "好的", //默认是“确定”
                success: function (res) {
                }
            })
        }
    },
});