// pages/eorclist/eorclist.js
var app = getApp(), question = require('../../utils/question.js');
Page({

  data: {
    catelist: {},
    autoRemove: !0
  },

  onLoad: function (e) {
    this.setData({
      ind: e.ind
    })
  },

  onReady: function () {

  },
  distinct: function(arr){
    let result = [];
    let len = arr.length;
   arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
    if(result.indexOf(v) === -1){
     result.push(v);
    }
   })
   return result;
 },
  onShow: function () {
    var that = this;
    var course = wx.getStorageSync('course');
    var uid = app.globalData.uid;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_cate_list',
      method: 'get',
      dataType: 'json',
      data: {
        uid: uid,
        course: course.id
      },
      success: function (res) {
        console.log(res);
        var data = res.data.data;
        var count = 0;
        console.log(that.data.ind == 1)
        if (that.data.ind == 1) {
          for (var i = 0; i < data.length; i++) {
            var items = wx.getStorageSync('starids' + data[i].id);
            if(items && items.length>0){
              let arr = that.distinct(items);
              data[i].count = arr.length;
              data[i].ids = arr;
  
              count+=arr.length;
            }

          }
        } else {
          for (var i = 0; i < data.length; i++) {
            var items = wx.getStorageSync('errorids' + data[i].id);
            if(items && items.length>0){
              let arr = that.distinct(items);
              data[i].count = arr.length;
              data[i].ids = arr;
  
              count+=arr.length;
            }
           

          }
        }
        that.setData({
          catelist: data,
          count: count
        })
        console.log(data)
      }
    })

    var t = wx.getStorageSync("autoRemove");
    console.log(t)
    t == '' ? this.setData({
      autoRemove: t
    }) : wx.setStorageSync("autoRemove", !0);
  },

  switchChange: function (t) {
    wx.setStorageSync("autoRemove", t.detail.value)
  },

  goquestion: function (t) {
    var that = this;
    var qid = wx.getStorageSync('qid_' + t.currentTarget.dataset.id);
    if (qid == '') {
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_question_list',
        method: 'get',
        dataType: 'json',
        data: {
          uid: app.globalData.uid,
          cateid: t.currentTarget.dataset.id
        },
        success: function (res) {
          if (res.statusCode == 200) {
            var q = 'q_' + t.currentTarget.dataset.id, qid = 'qid_' + t.currentTarget.dataset.id, qData = res.data.data.question_list, qidData = res.data.data.question_id;
            wx.setStorage({
              key: q,
              data: qData,
              complete: function () {
                wx.setStorage({
                  key: qid,
                  data: qidData,
                  complete: function () {
                    question.initQuestions(q, qid);
                  }
                });
                wx.hideLoading();
                console.log('错题、收藏标志位');
                console.log(this.data.ind);
                if (that.data.ind == 1) {
                  wx.navigateTo({
                    url: "../errorstar/errorstar?ind="+this.data.ind+"&ids=" + t.currentTarget.dataset.ids.join(",") + "&title=" + t.currentTarget.dataset.name + "&navtitle=我的收藏&cateName=" + t.currentTarget.dataset.name + '&cateid=' + t.currentTarget.dataset.id
                  })
                } else {
                  wx.navigateTo({
                    url: "../errorstar/errorstar?ind="+this.data.ind+"&ids=" + t.currentTarget.dataset.ids.join(",") + "&title=" + t.currentTarget.dataset.name + "&navtitle=我的错题&cateName=" + t.currentTarget.dataset.name + '&cateid=' + t.currentTarget.dataset.id
                  })
                }
              }
            });
          }
        }
      })
    } else {
      wx.hideLoading();
      console.log('错题、收藏标志位');
      console.log(this.data.ind);
      if (that.data.ind == 1) {
        wx.navigateTo({
          url: "../errorstar/errorstar?ind="+this.data.ind+"&ids=" + t.currentTarget.dataset.ids.join(",") + "&title=" + t.currentTarget.dataset.name + "&navtitle=我的收藏&cateName=" + t.currentTarget.dataset.name + '&cateid=' + t.currentTarget.dataset.id
        })
      } else {
        wx.navigateTo({
          url: "../errorstar/errorstar?ind="+this.data.ind+"&ids=" + t.currentTarget.dataset.ids.join(",") + "&title=" + t.currentTarget.dataset.name + "&navtitle=我的错题&cateName=" + t.currentTarget.dataset.name + '&cateid=' + t.currentTarget.dataset.id
        })
      }
    }
  },

})