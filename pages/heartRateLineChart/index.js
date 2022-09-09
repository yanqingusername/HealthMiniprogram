const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')
var wxCharts = require("../../utils/wxcharts.js");
var yuelineChart=null;

Page({
    data: {
        type: 1,
        hwid: '',
        name: '',
        workOutinfoList: [],
        imageWidth:0,
        timestamp:new Date().getTime(),
        yearmouthday:"",
        numberData: '80'
    },
    onLoad: function (options) {
        this.currentTime();

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
                title:"心率折线图"
            })
            this.getWorkOutinfo();
        }
    },
    onShow: function () {
        var windowWidth = 320;
        try {
         var res = wx.getSystemInfoSync();
         windowWidth = res.windowWidth;
        } catch (e) {
         console.error('getSystemInfoSync failed!');
        }
        yuelineChart = new wxCharts({
         canvasId: 'yueEle',
         type: 'line',
         categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], //categories X轴
         animation: true,
         series: [{
          name: 'A',
          data: [1, 6, 9, 1, 0, 2, 9, 2, 8, 6, 0, 9, 8, 0, 3, 7, 3, 9, 3, 8, 9, 5, 4, 1, 5, 8, 2, 4, 9, 8, 7],
          format: function (val, name) {
           return val + '';
          }
         }
        //  , {
        //   name: 'B',
        //   data: [0, 6, 2, 2, 7, 6, 2, 5, 8, 1, 8, 4, 0, 9, 7, 2, 5, 2, 8, 2, 5, 2, 9, 4, 4, 9, 8, 5, 5, 5, 6],
        //   format: function (val, name) {
        //    return val + '';
        //   }
        //  },
         ],
         xAxis: {
          disableGrid: true
         },
         yAxis: {
          title: '数值',
          format: function (val) {
           return val;
          },
          max: 20,
          min: -5
         },
         width: windowWidth,
         height: 200,
         dataLabel: false,
         dataPointShape: true,
         extra: {
          lineStyle: 'curve'
         }
        })
    },
    //图表点击事件
    touchcanvas:function(e){
        let that = this;
        yuelineChart.showToolTip(e, {
            format: function (item, category) {
                that.setData({
                    numberData: category
                });
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    getWorkOutinfo(){
        let that = this;
        let data = {
            hw_id: this.data.hwid
        }
        request.request_get('/hmapi/getWorkOutinfo.hn', data, function (res) {
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
    /**
     * 当前日期
     */
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
            yearmouthday: curtime
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

        this.setData({
            timestamp: timestamp,
            yearmouthday: date
        });
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
       
        this.setData({
            timestamp: timestamp,
            yearmouthday: date,
        });
    },
});