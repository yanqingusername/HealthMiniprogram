
const app = getApp()
const updateApp = require('../../utils/updateApp.js')
const request = require('../../utils/request.js')
const box = require('../../utils/box.js')
const time = require('../../utils/time.js')
const utils = require('../../utils/utils.js')

/**
 * Detail类 构造函数 
 * @param {string} meal_content 食物名称
 * @param {string} intake_amount 摄入量
 * @param {string} intake_company 单位
 */
function Detail(meal_content, intake_amount,intake_company) {
    this.meal_content = meal_content;
    this.intake_amount = intake_amount;
    this.intake_company = intake_company;
  }
  function Info() {
    this.details = [];
  }

Page({
    data:{
       hoursminute:"",
       yearmouthday:"",
        mindate:"",
        maxdate:"",
        startIsPickerRender: false,
        startIsPickerShow: false,
        startTime: time.format_hour3(new Date(new Date().getTime())).toString() + ":00",
        startChartHide: false,
        time_chosen:false,
        pickerConfig: {
          endDate: false,
          column: "minute",
          dateLimit: true,
          initStartTime: time.format_hour(new Date(new Date().getTime())),
          limitStartTime: time.format_hour(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3)),
          limitEndTime: time.format_hour(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7))
        },
        img_arr:[],
        info:{
            details:[{meal_content:'',intake_amount:'',intake_company:''}]
        },
        meal_type:'',
        meal_content_final:'',
        intake_amount_final:'',
        intake_company_final:'',
        // remarkList: ['个','碗','杯','瓶','碟','片','根','只','块','条','颗','勺','盘','盒','包'],
        remarkList: [],
        campany_lable: '',
        dialogData: {
          title: "确认删除该条文字记录吗？",
          titles: "",
          ptitle: "",
          cancel: "取消",
          sure: "确认"
        },
        showDialog: false,
        closeIndex: -1,

        timestamp:new Date().getTime(),
        dataList:[
            {
              id:"17813566345",
              checked:false,
              name: '张三'
            },
            {
              id:"27813566345",
              checked:false,
              name: '李四'
            },
            {
              id:"37813566345",
              checked:false,
              name: '王五'
            },
            {
              id:"47813566345",
              checked:false,
              name: '赵六'
            },
            {
              id:"57813566345",
              checked:false,
              name: '小明'
            },
          ], // 数据列表
          checkedIds:[], // 选中的id列表,
          checkedAll:false
        
    },
    bindTimeChange:function(e){
      let temptime=e.detail.value
      console.info("时间选择为",temptime)
      this.setData({
        hoursminute:temptime
      })
    },
    onLoad:function(options){
      let hours=new Date().getHours()
      let minutes=new Date().getMinutes()
      if(hours<10){
        hours="0"+hours
      }
      if(minutes<10){
        minutes="0"+minutes
      }
     this.setData({
      hoursminute:hours+":"+minutes
     })
     console.log(options)

     this.currentTime();

     // 获取学生
     this.getStudentList();
      
        let that = this;
        that.getOrderNum();
        if(options.type== 1){
            that.setData({ 
                meal_type: '早',
                meal_type_id:1
            })
        }else if(options.type== 2){
            that.setData({ 
                meal_type: '午',
                meal_type_id:2
            })
        }else if(options.type== 3){
            that.setData({ 
                meal_type: '晚',
                meal_type_id:3
            })
        }else if(options.type== 4){
            that.setData({ 
                meal_type: '加',
                meal_type_id:4
            })
    }

    request.request_get('/hmapi/getMeetUnit.hn', {}, function (res) {
      if(res.success){
        if(res && res.msg && res.msg.length > 0){
          let remarkList = [];
          for(let i = 0; i < res.msg.length; i++){
            let item = res.msg[i].text;
            remarkList.push(item)
          }
          that.setData({
            remarkList: remarkList
          });
        }
      }
  })
},
    addFood: function (e) {
        let info = this.data.info;
        info.details.push(new Detail('','',''));
        this.setData({
          info: info
        });
        console.log(info.details)
      },
      setFood: function (e) {
        let index = parseInt(e.currentTarget.id.replace("food-", ""));
        let meal_content = e.detail.value;
        meal_content = utils.checkInput(meal_content);
        let info = this.data.info;
        // debugger
        info.details[index].meal_content = meal_content;
        this.setData({
          info: info
        });
      },   
      setAmount: function (e) {
        let index = parseInt(e.currentTarget.id.replace("amount-", ""));
        let intake_amount = e.detail.value;
        intake_amount = utils.checkInput(intake_amount);
        let info = this.data.info;
        info.details[index].intake_amount = intake_amount;
        this.setData({
          info: info
        });
      },
    onShow:function(e){
        
    },
    
    // 提交预约信息
  submit: utils.throttle(function (e) {
    // debugger
      let that = this;
    console.log(this.data.info)
    console.log(this.data.info.details)
    let foodList = this.data.info.details
    wx.showLoading({
        title: '提交中...',
        mask:true,
        duration:3000
      })
      let time_chosen = that.data.hoursminute;
      let img_arr = that.data.img_arr;
      if (time_chosen == "") {
        box.showToast("请选择用餐时间");
        return;
      //  } else if(foodList.length == 0){
      //   box.showToast("请填写文字记录");
      //   return;
      }else if(img_arr.length == 0 && foodList.length == 1&&foodList[0].meal_content==""&&foodList[0].intake_amount==""&&foodList[0].intake_company==""){
          box.showToast("请拍照记录或文字记录");
          return;
      }
      let meal_content_final = '';
      let intake_amount_final = '';
      let intake_company_final = '';
    for(let i=0;i<foodList.length;i++){ //删除双空白项
      if(foodList[i].meal_content == '' &&foodList[i].intake_amount == ''){
          foodList.splice(i,1);
          i--;
      }
  }
    // let info_p = new Info();
    for(let i in foodList){ //确保不出现只有食物名称没有摄入量或相反的情况
        if(foodList[i].meal_content == '' &&foodList[i].intake_amount != '' ||foodList[i].meal_content != '' &&foodList[i].intake_amount == ''){
            box.showToast("请将文字记录填写完整");
            return;
        }
        if(foodList[i].intake_company == ''){
          box.showToast("请选择单位");
          return;
      }
    }
    
    for (let i in foodList) {
        meal_content_final += foodList[i].meal_content + ";";
        intake_amount_final += foodList[i].intake_amount + ";";
        intake_company_final += foodList[i].intake_company + ";";
    }

    let checkedIds = that.data.checkedIds;
    
    let meal_type_id= that.data.meal_type_id;
    let record_num = that.data.record_num;
    let meal_time = that.data.yearmouthday+" "+that.data.hoursminute;
    let meal_person_id = app.globalData.userInfo.id; // 创建人id
    
    let checkedIdsString = checkedIds.join(',');

    let data = {
        record_num: record_num,
        date: meal_time, // 进餐时间
        id: app.globalData.userInfo.school_id,  //对应学校id,
        mangeid: meal_person_id,//上传人的id
        checkedIds: checkedIdsString,
        meal_type_id: meal_type_id, // 1 早餐  2 午餐  3 晚餐  4 加餐 
        imgArr: img_arr,
        meal_content: meal_content_final,
        intake_amount: intake_amount_final,
        intake_company_final: intake_company_final,
    }
       console.info("请求数据",data)
      if((data.meal_content==""&&data.intake_amount=="")&&data.imgArr.length==0){
        box.showToast("请拍照记录或文字记录");
         let info = that.data.info;
          info.details.push(new Detail('','',''));
          that.setData({
            info: info
          });
        return
      }else if(checkedIds.length == 0){
        box.showToast("请选择学生");
        return;
      }else{
        // console.info("请求数据---->:",data)
        // return
        // box.showToast("ok");
          request.request_get('/manage/getSubmitPic.hn', data, function (res) {
            console.info('回调', res)
            if (res) {
              if (res.success) {  
                wx.showModal({
                  title: '成功',
                  content: '提交成功',
                  showCancel: false,
                  confirmText: '确定',
                  success: function (res) {
                    if (res.confirm) {
                        wx.reLaunch({
                            url: '/pages/frontpage/index',
                          })
                    }
                  }
                })
              } else {
                box.showToast(res.msg);
              }
              // box.hideLoading();
            }else{
              box.showToast("网络不稳定，请重试");
            }
          })
      }
      
      wx.hideLoading({
        success: (res) => {},
      })
    
  },3000),
    start_time_show: function (e) {
        console.log("ssd")
        this.setData({
          startIsPickerShow: true,
          startIsPickerRender: true,
          startChartHide: true,
          time_chosen:true
        })
      },
      start_time_hide: function () {
        this.setData({
          startIsPickerShow: false,
          startChartHide: false
        })
      },
      set_start_time: function (val) {
          console.log(val.detail.startTime)
          this.setData({
            startTime: val.detail.startTime.substring(0, 16)
          });
      },
      getOrderNum: function () {
        let that = this;
        let random = Math.round(Math.random() * 9999);
        let str1 = that.getFullTime() + random;
        that.setData({
            record_num: str1
        })
      },
      getLocalTime() {
        return new Date().getTime();
      },
      getFullTime() {
        let date = new Date(), //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          Y = date.getFullYear() + '',
          M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
          D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()),
          h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()),
          m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()),
          s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s
      },
    //上传图片
  upimg: function () {
    let that = this;
    let data = [];
    if (that.data.img_arr.length < 10) {
      wx.chooseImage({
        count:9-that.data.img_arr.length,
        sizeType: ['original', 'compressed'],
        success: function (res) {
          console.log(res.tempFilePaths)
          console.log(res.tempFilePaths.length)
          let filePath = res.tempFilePaths;
          // debugger
          for (let i = 0; i < filePath.length; i++) {
            wx.uploadFile({
              //url: 'https://8.130.48.31:8080/HM/api/upload.hn',  // 测试服务器  孙仕豪
              // url: 'https://scldev.coyotebio-lab.com:8443/HM/api/upload.hn',  // 测试服务器  孙仕豪
              url: 'https://monitor.coyotebio-lab.com:8443/HM/api/upload.hn',  // 正式服务器
              // url:'http://ygldev.coyotebio-lab.com:8080/HM/api/upload.hn',
              //url : 'http://ygldev.coyotebio-lab.com/flash20AppletBackend/OrderController/upload.hn',  // 测试服务器  于光良
              //url: 'https://8.130.25.5/flash20AppletBackend/api/upload.hn',   // 宋彦睿
              //url: 'https://syrdev.coyotebio-lab.com/flash20AppletBackend/OrderController/upload.hn',   // 宋彦睿
              //url: 'https://www.prohealth-wch.com:8443/flash20AppletBackend/OrderController/upload.hn', //正式服务器
              //url: 'http://localhost:8080/flash20AppletBackend/OrderController/upload.hn',// 本地测试
              filePath: filePath[i],
              name: 'imageFile',
              formData: data,
              header: {
                "chartset": "utf-8"
              },
              success: function (returnRes) {
                // debugger
                console.log(returnRes)
                let data = JSON.parse(returnRes.data)
                console.log(data.msg)
                let imgList = [];
                let imgArr = that.data.img_arr;
                for (let i = 0; i < imgArr.length; i++) {
                  imgList.push(imgArr[i])
                }
                imgList.push(data.msg)
                that.setData({
                  img_arr: imgList
                })
                console.log("imgList=" + imgList)
              },
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '最多上传九张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  // 删除图片
  delImg(e) { //删除图片
    let that = this;
    console.log('点击删除图片===>', e);
    let index = e.currentTarget.dataset.index;
    let imgList = that.data.img_arr;
    wx.showModal({
      title: '提示',
      content: '删除该图片？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          imgList.splice(index, 1);
          that.setData({
            img_arr: imgList
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          console.log(that.data.img_arr)
        }
      }
    })
  },
   // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //所有图片
    let img_arr = this.data.img_arr;
    wx.previewImage({
      //当前显示图片
      current: img_arr[index],
      //所有图片
      urls: img_arr
    })
  },
  bindSelectrRemark: function (e) {
    wx.hideKeyboard();
    let that = this;
    console.log('---->:',this.data.campany_lable)
    let index = parseInt(this.data.campany_lable.replace("company-", ""));
    let intake_company = that.data.remarkList[e.detail.value];
    console.log(e.detail.value,intake_company,index,e.currentTarget.id);
    let info = this.data.info;
    info.details[index].intake_company = intake_company;
    this.setData({
      info: info
    });
  },
  bindCampany(e){
    wx.hideKeyboard();
    this.setData({
      campany_lable: e.currentTarget.dataset.id
    })
  },
  setCompany(e){
    console.log('--setCompany-->:',e)
    let index = parseInt(e.currentTarget.id.replace("company-", ""));
        let intake_company = e.detail.value;
        let info = this.data.info;
        info.details[index].intake_company = intake_company;
        this.setData({
          info: info
        });
  },
  delFood(e){
    let closeIndex = e.currentTarget.dataset.index;
    console.log(closeIndex)
		this.setData({
			showDialog: true,
      closeIndex: closeIndex
		});
	},
	dialogCancel() {
		this.setData({
			showDialog: false,
      closeIndex: -1
		});
	},
	dialogSure(e) {
		let that = this;
    console.log('delFood===>', e);
    let info = that.data.info;
    if(info && info.details && info.details.length == 1){
        info.details[0].meal_content = '';
        info.details[0].intake_amount = '';
        info.details[0].intake_company = '';
        that.setData({
          info: info,
          showDialog: false
        });
    } else {
      if(that.data.closeIndex != -1){
        let index = that.data.closeIndex;
        let info = that.data.info;
        info.details.splice(index, 1);
        that.setData({
          info: info,
          showDialog: false
        });
      }
    }
	},
  /**
   * 获取学生列表
   */
   getStudentList(){
    let that = this;
    let data = {
      id: app.globalData.userInfo.school_id, // 创建人id
      // meal_person: app.globalData.userInfo.name,
      // school: app.globalData.userInfo.school
    }
    request.request_get('/manage/getStudentList.hn', data, function (res) {
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
    /**
     *  复选框change事件
     */
     checkboxChange(e) { 
        let id = e.detail.value[0];
        let checkedIds = this.data.checkedIds;
        if (id !==undefined && id !=='') { // 判断是否选中
          checkedIds.push(id);
        }else { // 过滤出选中的复选框
          checkedIds = checkedIds.filter(item=>String(item)!==String(e.currentTarget.dataset.id));
        }
        if (checkedIds.length == this.data.dataList.length) { // 调整全选按钮状态
          this.setData({
            checkedIds:checkedIds,
            checkedAll:true
          })
        }else {
          this.setData({
            checkedIds:checkedIds,
            checkedAll:false
          })
        }
        console.log(this.data.checkedIds);
      },
      selectAll(e){ // 全选框
        if (e.detail.value[0] ==="all") {
          console.log("全部选中");
          this.setData({
            checkedIds:this.data.dataList.map(item=>item.id),
            dataList:this.data.dataList.map(item=>{item.checked = true;return item;})
          })
        }else { // 直接清空列表
          console.log("清空");
          this.setData({
            checkedIds:[],
            dataList:this.data.dataList.map(item=>{item.checked = false;return item;})
          });
        }
        console.log(this.data.checkedIds);
      },
})
