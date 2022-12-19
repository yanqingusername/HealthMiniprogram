const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')

Page({
    data: {
        hwid: '',
        name: '',
        page: 1,
        limit: 5,
        workOutinfoList: []
    },
    onLoad: function (options) {
        let that = this;
        let hwid = options.hwid;
        this.setData({
            hwid: hwid,
            name: options.name
        });
            wx.setNavigationBarTitle({
                title:"睡眠列表"
            })
            this.getWorkOutinfo();

        
    },
    onShow: function () {

    },
    onReachBottom: function () {
        // this.setData({
        //   page: 1
        // });
        this.getWorkOutinfo();
      },
    getWorkOutinfo(){
        let that = this;
        let data = {
            hw_id: this.data.hwid,
            // hw_id: "F260",
            page: this.data.page,
            limit: this.data.limit
        }
        request.request_get('/manage/getSleepEpisodeChart.hn', data, function (res) {
            if (res) {
                if (res.success) {
                  if (that.data.page == 1) {
                    that.setData({
                        workOutinfoList: res.data,
                        page: (res.data && res.data.length > 0) ? that.data.page + 1 : that.data.page
                    });
                  } else {
                    that.setData({
                        workOutinfoList: that.data.workOutinfoList.concat(res.data || []),
                        page: (res.data && res.data.length > 0) ? that.data.page + 1 : that.data.page,
                    });
                  }
                } else {
                    box.showToast(res.msg);
                }
            }
        })
    },
});