const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        csstype: 1,
        title: '基本体格检查',
        method: 'getphysiqueinfo',
        type:"",
        dataList: [],
        sid: ''
    },
    onLoad: function (options) {
        let title = options.title;
        this.setData({
            csstype: options.csstype,
            method: options.method,
            type: options.type,
            sid: options.sid
        });

        wx.setNavigationBarTitle({
            title: title,
        });
        this.getMethod();
    },
    onShow: function () {},
    getMethod(){
        let that = this;
        let data = {
            s_id: this.data.sid,
            type: this.data.type
        }
        let url = '/hmapi/'+ this.data.method +'.hn';
        request.request_get(url, data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    dataList: res.msg
                });
            }
        })
    },
    bindImg(){
        wx.navigateTo({
            url: '/pages/healthImg/index',
        })
    },
    bindClick(e){
        let url = e.currentTarget.dataset.url;
        if(url){
            // wx.navigateTo({
            //     url: `/pages/healthpdf/index?url=${url}`,
            // })
            this.openFile(url);
        }
    },
    openFile(url) {
        if (!(url && url.length)) {
            return;
        }
        // wx.showLoading({
        //     title: '文件加载中...',
        //     mask:true,
        //     duration:3000
        //   })
        box.showToast('文件加载中...')
        wx.downloadFile({
            url: url,
            success: (res) => {
                if (res.tempFilePath) {
                    wx.openDocument({
                        filePath: res.tempFilePath,
                        fail: (err) => {
                            console.error(err);
                        },
                        complete: () => {
                            // wx.hideLoading();
                        }
                    })
                }
            },
            fail: (err) => {
                console.error(err);
                // wx.hideLoading();
            }
        })
    }
});