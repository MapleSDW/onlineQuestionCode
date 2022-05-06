// pages/examhome/examhome.js
var app = getApp();
Page({

  data: {
    passf: 0,
    time: 0,
    num: 0,
    everyf: 1,
    use_title: "",
    training_qids: ""
  },

  onLoad: function (options) {
    var t = this;
    var uid = app.globalData.uid;
    var category = wx.getStorageSync('category' + options.cateid);
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_category_detail',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        cateid: category.id
      },
      success: function (e) {
        console.log(e);
        wx.hideLoading();
        t.setData({
          time: e.data.data.time,
          num: e.data.data.number,
          use_title:e.data.data.name,
          passf:e.data.data.passf,
          category:category
        });
      }
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },
  examGoNew: function(){
      let time = this.data.time;
      wx.redirectTo({
        url: "../exam/exam?continued=0&passf=" + this.data.passf + "&time=" + (time - 1) + "&training_qids=0&nums=" + this.data.num+"&cateid="+this.data.category.id
      });  
      // 根据 sitemap 的规则[0]，当前页面 [pages/exam/exam?continued=1&passf=95&time=-1&training_qids=0&nums=50] 将被索引
  },
  examGo:function (e) {
    var t = this;
    if (!t.data.time) return wx.showLoading({
      title: "考题读取中",
    }), void setTimeout(function () {
      wx.hideLoading();
    }, 999);
    let n = "examind" + t.data.category.id;
    let i = wx.getStorageSync(n) ? wx.getStorageSync(n) + 1 : "";
    let a = "exam_up" + t.data.category.id;
    let o = wx.getStorageSync(a) || "";

    !o && i ? wx.showModal({
      title: "",
      cancelText: "重新考试",
      confirmText: "继续答题",
      content: "上次考试您已经做到第" + i + "题,重新考试答题记录会丢失~",
      success: function (n) {
        if (console.log(n), n.confirm) {
          var i = wx.getStorageSync("time" + t.data.category.id);
          wx.redirectTo({
            url: "../exam/exam?continued=1&passf=" + t.data.passf + "&time=" + (i - 1) + "&training_qids=0&nums=" + t.data.num
          });
        } else t.change_continue(e);
      }
    }) : t.change_continue(e)
  },

  change_continue:function(e){
    var t = this;
    wx.removeStorage({
      key: "exam" + t.data.category.id
    }), wx.removeStorage({
      key: "examlist" + t.data.category.id
    }), wx.removeStorage({
      key: "examind" + t.data.category.id
    }), wx.removeStorage({
      key: "examids" + t.data.category.id
    }), wx.removeStorage({
      key: "examall" + t.data.category.id
    }), wx.removeStorage({
      key: "intensify_noids" + t.data.category.id
    }), wx.removeStorage({
      key: "intensify_okids" + t.data.category.id
    }), wx.removeStorage({
      key: "exam_up" + t.data.category.id
    }), "0" == e.currentTarget.dataset.ind ? wx.redirectTo({
      url: "../exam/exam?passf=" + t.data.passf + "&time=" + (t.data.time - 1) + "&training_qids=0&nums=" + t.data.num + '&cateid=' + t.data.category.id
    }) : wx.redirectTo({
        url: "../exam/exam?passf=" + t.data.passf + "&time=" + (t.data.time - 1) + "&training_qids=" + t.data.training_qids + "&nums=" + t.data.num + '&cateid=' + t.data.category.id
    });
  }
})