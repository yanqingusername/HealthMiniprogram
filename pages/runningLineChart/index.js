const app = getApp();
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')
var wxCharts = require("../../utils/wxcharts.js");
var yuelineChart=null;

Page({
    data: {
        hwid: '',
        name: '',
        workOutinfoList: [],
        imageWidth:0,
        timestamp:new Date().getTime(),
        yearmouthday:"",
        numberData: '',
        time_slot: [], // 时间段
        hear_trate: [],
        max_hear_trate: 0, // 运动最大值
	    min_hear_trate: 0, // 运动最小值
    },
    onLoad: function (options) {
        this.currentTime();

        let that = this;
        let hwid = options.hwid;
        this.setData({
            hwid: hwid,
            name: options.name
        });
            wx.setNavigationBarTitle({
                title:"运动折线图"
            })
            this.getHeartRateLineChart();
    },
    onShow: function () {
        // let that = this;
        // var windowWidth = 320;
        // try {
        //  var res = wx.getSystemInfoSync();
        //  windowWidth = res.windowWidth;
        // } catch (e) {
        //  console.error('getSystemInfoSync failed!');
        // }
        // yuelineChart = new wxCharts({
        //  canvasId: 'runEle',
        //  type: 'line',
        //  categories: that.data.time_slot, //categories X轴
        //  animation: true,
        //  series: [{
        //   name: 'A',
        //   data: that.data.hear_trate,
        //   format: function (val, name) {
        //    return val + '';
        //   }
        //  }
        // //  , {
        // //   name: 'B',
        // //   data: [0, 6, 2, 2, 7, 6, 2, 5, 8, 1, 8, 4, 0, 9, 7, 2, 5, 2, 8, 2, 5, 2, 9, 4, 4, 9, 8, 5, 5, 5, 6],
        // //   format: function (val, name) {
        // //    return val + '';
        // //   }
        // //  },
        //  ],
        //  xAxis: {
        //   disableGrid: true
        //  },
        //  yAxis: {
        //   title: '数值',
        //   format: function (val) {
        //    return val;
        //   },
        //   max: that.data.max_hear_trate,
        //   min: that.data.min_hear_trate
        //  },
        //  width: windowWidth,
        //  height: 200,
        //  dataLabel: false,
        //  dataPointShape: true,
        //  extra: {
        //   lineStyle: 'curve'
        //  }
        // })
    },
    //图表点击事件
    touchcanvas:function(e){
        let that = this;
        yuelineChart.showToolTip(e, {
            format: function (item, category) {
                that.setData({
                    numberData: item.data
                });
                return category + ' ' + item.name + ':' + item.data
            }
        });
    },
    getHeartRateLineChart(){
        let that = this;
        let data = {
            hw_id: this.data.hwid,
            date: this.data.yearmouthday
        }
        // let data = {
        //     hw_id: "A017",
        //     date: "2022-04-24"
        // }
        request.request_get('/manage/getWorkOutChartint.hn', data, function (res) {
            if (res) {
                if (!res.success) {
                    box.showToast(res.msg);
                    return;
                }
                that.setData({
                    time_slot: res.time_slot,
                    hear_trate: res.avgstep,
                    max_hear_trate: res.max_step,
                    min_hear_trate: res.min_step,
                });

                that.setCanvas();
            }
        })
    },
    setCanvas(){
        let that = this;
        var windowWidth = 320;
        try {
         var res = wx.getSystemInfoSync();
         windowWidth = res.windowWidth;
        } catch (e) {
         console.error('getSystemInfoSync failed!');
        }
        yuelineChart = new wxCharts({
         canvasId: 'runEle',
         type: 'line',
         categories: that.data.time_slot, //categories X轴
         animation: true,
         series: [{
          name: '运动',
          data: that.data.hear_trate,
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
          max: that.data.max_hear_trate,
          min: that.data.min_hear_trate
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
            yearmouthday: date,
            numberData: ''
        });

        this.getHeartRateLineChart();
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
            numberData: ''
        });

        this.getHeartRateLineChart();
    },
});