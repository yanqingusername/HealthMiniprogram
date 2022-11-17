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
        wx.showLoading({
            title: '文件加载中...',
            mask:true,
        })
        wx.downloadFile({
            url: url, //要预览的PDF的地址
            timeout: 120000,
            // filePath: wx.env.USER_DATA_PATH + '/12.pdf',
            success: function (res) {
              console.log(res);
              if (res.statusCode === 200) { //成功
                var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
                console.log(Path);
                wx.openDocument({
                  filePath: Path,
                //   fileType: 'pdf',
                  showMenu: false,
                  success: function (res) {
                  },
                  fail: function (res) {
                  },
                  complete: function(){
                    wx.hideLoading();
                  }
                })
              }
            },
            fail: function (res) {
              wx.hideLoading();
            }
          })

        //   box.showToast('文件加载中...')
        //   wx.downloadFile({
        //       url: url,
        //       success: (res) => {
        //           if (res.tempFilePath) {
        //               wx.openDocument({
        //                   filePath: res.tempFilePath,
        //                   fail: (err) => {
        //                       console.error(err);
        //                   },
        //                   complete: () => {
        //                       // wx.hideLoading();
        //                   }
        //               })
        //           }
        //       },
        //       fail: (err) => {
        //           console.error(err);
        //           // wx.hideLoading();
        //       }
        //   })
        
    }
});