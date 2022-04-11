// promise版的请求,部分解决回调地狱问题
// 同时发送异步代码的次数
let ajaxTimes = 0;

export const prorequest = (params) => {
    ajaxTimes++;
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    // 192.168.81.21
    // const baseURL = "http://ygldev.coyotebio-lab.com:8080/HM";  // 测试服务器
    var baseURL = 'https://monitor.coyotebio-lab.com:8443/HM';     // 正式服务器
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url:baseURL + params.url,
            success:(result) => {
                resolve(result.data);
            },
            // TODO
            fail:(err) => {
                reject(err);
            },
            complete:() => {
                ajaxTimes--;
                wx.hideLoading();
            }
        });
    })
}