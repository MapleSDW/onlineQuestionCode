var t = require("../../utils/question.js"),
  question = require("../../utils/question.js"),
  e = [],
  a = "",
  r = "",
  s = "";
  let app = getApp();    
  var util = require('../../utils/util.js');  
Page({

  data: {
    rightMap:{

    },
    me: [],
    typeArr:[],
    StorageAll: {},
    orderPX: {},
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    iconInd: !1,
    iconIndtwo: !1,
    indexInd: 0,
    current: 0,
    textTab: "答题模式",
    selectInd: !0,
    testMode: !1,
    everyDay_all: 0,
    xiejie: !0,
    interval: 300,
    moreArr: {
      A: !1,
      B: !1,
      C: !1,
      D: !1,
      E: !1,
      F: !1
    },
    everyDay_error: 0,
    everyDay_all: 0,
    mode: "1",
    idarr: [],
    questions: [],
    iconcircle: [],
    collectData: [],
    starshow: !0,
    del_chapter_id: 'all',
    delarr: [],
    nums: 0
  },
  distinct: function(arr){
     let result = [];
     let len = arr.length;
    arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
     var bool = arr.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
     if(bool === -1){
      result.push(v);
     }
    })
    return result;
  },
  onLoad: function (options) {
    console.log(options);
    let that = this;
    var category = wx.getStorageSync('category' + options.cateid);
    if (category) {
      question.initAllQuestionFromStorage('q_' + category.id, 'qid_' + category.id)
    }

    var autoRemove = wx.getStorageSync('autoRemove');
    
    console.log(options);
    let navtitle = options.navtitle;
    wx.setNavigationBarTitle({
      title: navtitle
    });
    this.setData({
      ind: options.ind,
      autoRemove,
      ids: options.ids,
      idarr: options.ids.split(","),
      iconcircle: [{
        title: "",
        question_ids: options.ids.split(","),
        len: 0
      }],
      chelun: options.title,
      cateName: options.cateName,
      category: category
    })
    switch(navtitle){
      case '我的错题':
          wx.getStorage({
            key: "errorids" + category.id,
            success: function (res) {
              console.log(res);
              let items = res.data;
              let arr = that.distinct(items);
              that.setData({
                idArr: arr,
                nums: arr.length,
              },()=>{
                that.getMsg(options);
              });
            }
          })
        break;
      case '我的收藏':
          wx.getStorage({
            key: "starids"+category.id,
            success: function (res) {
              let items = res.data;
              let arr = that.distinct(items);
              that.setData({
                idArr: arr,
                nums: arr.length,
              },()=>{
                that.getMsg(options);
              });
            }
          })
        break;
      default:
        console.log('其他未知情况')
    }
    
  },
  getMsg:function(options){
    let mode = options.mode;
    let cateid = options.cateid;

    let _q = 'q_' + cateid;
    let _qid = 'qid_' + cateid;
    question.initQuestions(_q, _qid);

    let idArr = this.data.idArr;
    let question_ids = [];
    
    question_ids = idArr;
    

    this.ind_to_data(question_ids);
  },
  ind_to_data: function (question_ids) {
    let that = this;
    let rightMap = this.data.rightMap;
    let allQues = question.questions["question"];
    let questions = [];
    question_ids.forEach(id => {
      let obj = allQues[id];
      let answer = obj.answer;
      let options = obj.options;
      let arr = [];
      let type = obj.type;

      let newOptions = [];
      switch(type){
        case 1:
        case 2:
        case 3:
          Object.keys(options).forEach(key => {
            let val = 0;
            if(answer.indexOf(key) != -1){
              val =1;
            }
            arr.push({
              code: key,
              content: options[key],
              selected: false,
              val: val
            })
          })
          obj.options = arr;
          break
        case 4:
        case 5:
          // 根据答案自己拼接选项
          let aItems = obj.answer.split('|');
          
          aItems.forEach((aItem, idx)=>{
            let newOption = {
              code: idx,
              content: aItem,
              selected: false,
              val: 1
            }
            newOptions.push(newOption)
          })
          obj.options = newOptions;
          break;
        default:
          console.log('未知匹配')
      }
      
      obj.right = -1;
      obj.selected = false;
      rightMap[obj.id]=-1;

      questions.push(obj);
    });
    console.log('排序');
    console.log(questions.sort(compare("id")));
    questions = questions.sort(compare("id"));
    console.log('规整之前');
    console.log(questions);
    let formatedQuestions = [];
    questions.forEach((item,idx)=>{
      console.log(idx);
      item.index = idx;
      let newItem = Object.assign({}, item); 
      formatedQuestions.push(newItem);
    })
    console.log('规整化处理');
    console.log(formatedQuestions);

    this.setData({
      rightMap,
      nums: questions.length,
      questions: formatedQuestions
    })
    
    function compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    }
    
    let typeArr = [
      {
        typename: '单选',
        ids: []
      },{
        typename: '多选',
        ids: []
      },{
        typename: '判断',
        ids: []
      },{
        typename: '填空',
        ids: []
      },{
        typename: '简答',
        ids: []
      },
    ];
    let idArr = [];
    questions.forEach( qu => {
      typeArr[qu.type-1]['ids'].push(qu.id);
      idArr.push(qu.id);
    })

    setTimeout(()=>{
      this.setData({
        idArr,
        typeArr
      })
    },1000)
    
   
  },
  onReady: function () {

  },

  onShow: function () {

  },


  changeTab: function (t) {
    var e = this;
    console.log(t.currentTarget.dataset.texttab);
    var a = e.data.questions;
    e.setData({
      questions: a,
      textTab: t.currentTarget.dataset.texttab,
      selectInd: "答题模式" == t.currentTarget.dataset.texttab
    });
  },

  jumpToQuestion: function (e) {
    console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;
    console.log('index');
    console.log(id);
    console.log(this.data.idArr);
    let idx = this.data.idArr.indexOf(id);
    console.log(idx);
    this.setData({
      circular: false,
      iconInd: false,
      iconIndtwo: false,
      current: idx,
      indexInd: idx,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('设置完');
      console.log(this.data.questions[idx])
    });
  },

  _updown: function () {
    this.setData({
      iconInd: !this.data.iconInd,
      iconIndtwo: !this.data.iconIndtwo,
    })
  },

  starcollect: function () {
    this.setData({
      starshow: !this.data.starshow
    });
    var t = this.data.delarr, e = this.data.idarr;
    this.data.starshow ? t.indexOf(e[this.data.indexInd]) > -1 && t.splice(t.indexOf(e[this.data.indexInd]), 1) : t.push(e[this.data.indexInd]),
      this.setData({
        delarr: t
      }), wx.setStorage({
        key: "delstar" + this.data.category.id,
        data: t
      });

    for (var d = this.data.collectData, i = 0; i < d.length; i++) if (d[i][Object.keys(d[i]).toString()].indexOf(t[this.data.indexInd]) > -1) {
      var s = d[i][Object.keys(d[i]).toString()].indexOf(t[this.data.indexInd]);
      d[i][Object.keys(d[i]).toString()].splice(s, 1), 0 == d[i][Object.keys(d[i]).toString()].length && d.splice(i, 1);
    }

    wx.setStorage({
      key: "starids" + this.data.category.id,
      data: d
    });
  },

  infoshow: function (t) {
    this.data.delarr.indexOf(t) > -1 ? this.setData({
      starshow: !1
    }) : this.setData({
      starshow: !0
    });
  },

  del_data: function () {
    var t = this;
    console.log(this.data.del_chapter_id);
    var e = wx.getStorageInfoSync("errorids" + s),
      a = [];
    e && (0 == e.length || "all" == this.data.del_chapter_id ? (wx.setStorage({
      key: "errorids" + s,
      data: [],
    }), wx.navigateBack({
      delta: 1
    })) : (e.forEach(function (e, r) {
      Object.keys(e)[0] != t.data.del_chapter_id && a.push(e);
    }), wx.setStorage({
      key: "errorids" + s,
      data: a
    }), wx.navigateBack({
      delta: 1
    })));
  },
  selectAnswer: function (e) {
    console.log('selectAnswer');
    console.log(new Date())
    console.log(app.globalData.questions);
    console.log(e);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);
    if(item.selected){
      return;
    }
    let code = e.currentTarget.dataset.code;
    let answer = e.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    let rightMap = this.data.rightMap;
    item.right = 0;
    rightMap[item.id] = 0;
    
    options.map(o => {
      if(o.code == code){
        o.selected = true;
      }
      if((o.code == code)&&(o.code == answer)){
        o.val = 1;
        greenNum++;
        item.right = 1;
        rightMap[item.id] = 1;
      }
      if((o.code == code)&&(o.code != answer)){
        o.val = 0;
        redNum++;
      }
    })
    console.log('item');
    console.log(item);
    item.options = options;
    item.selected = true;
    let questions = this.data.questions;
    questions[item.index] = item;
    
    this.setData({
      questions,
      rightMap,
      greenNum: greenNum,
      redNum: redNum,
    },()=>{
      console.log(new Date())
      let questions = this.data.questions;
      let autoRemove = this.data.autoRemove;
      let newIds = [];
      questions.forEach((q)=>{
        if(q.right != 1){
          newIds.push(q.id);
        }
      })
      if(autoRemove){
        wx.setStorage({
          key: 'errorids' + this.data.category.id,
          data: newIds
        })
      }
    })
    if(item.right == 1 && this.data.indexInd < this.data.nums-1){
      this.autoPlay();
    }
  },
  selectAnswerMore: function (t) {
    console.log('多选选第二个选项')
    console.log('selectAnswerMore');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    options.map(o => {
      if(o.code == code){
        o.selected = !o.selected;
      }
    })
    console.log(options);
    console.log(item);
    item.options = options;

    let questions = this.data.questions;
    questions[item.index] = item;
    this.setData({
      questions
    })

  },
  newMoreSelectSub: function(t){
    setTimeout(()=>{
      this.moreSelectSub(t);
    },1000)
  },
  moreSelectSub: function (t) {
    console.log('多选');
    console.log('moreSelectSub');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    if(item.selected){
      return;
    }

    let options = item.options;

    let answer;
    let nums = 0;

    let redNum = this.data.redNum;
    let greenNum = this.data.greenNum;


    let me = this.data.me;
    let rightMap = this.data.rightMap;
    item.right = 0;
    
    rightMap[item.id] = 0;
    let type = item.type;
    switch(type){
      case 1:
      case 2:
      case 3:
        answer = item.answer.split('');
        options.forEach(o => {
          if(o.selected){
            nums++;
          }
        })

        item.right = 0;
        if(nums == answer.length){
          item.right = 1;
          rightMap[item.id] = 1;
          greenNum++;
        }else{
          redNum++;
        }
        break;  
      case 4:  
      case 5:
        
        answer = item.answer.split('|');
        options.forEach(o => {
          if(me.indexOf(o.content) != -1){
            o.selected = 1;
            o.val = 1;
            nums++;
          }
        })

        let meArr = [];
        let j = 0;
        me.forEach((m,idx) => {
          j = idx;
          let val = 0;
          if(answer.indexOf(m) != -1){
            val =1;
          }
          meArr.push({
            code: idx,
            content: m,
            selected: true,
            val: val
          })
        })
        while(meArr.length < options.length){
          j++;
          meArr.push({
            code: j,
            content: '',
            selected: true,
            val: 0
          })
        }
        console.log('格式化后结果')
        console.log(meArr);
        item.meArr = meArr;

        item.right = 0;
        if(nums == answer.length){
          rightMap[item.id] = 1;
          item.right = 1;
          greenNum++;
        }else{
          redNum++;
        }
        break;                      
      default: 
      console.log('其他未涉及题型')
    }
    let questions = this.data.questions;
    item.me = me;
    item.selected = true;
    questions[item.index] = item;

    this.setData({
      rightMap,
      redNum,
      greenNum,
      questions
    },()=>{
      console.log('多选提交完成')
      let questions = this.data.questions;
      let autoRemove = this.data.autoRemove;
      let newIds = [];
      questions.forEach((q)=>{
        if(q.right != 1){
          newIds.push(q.id);
        }
      })
      if(autoRemove){
        wx.setStorage({
          key: 'errorids' + this.data.category.id,
          data: newIds
        })
      }
    })
    console.log('item');
    console.log(item);

    if(item.right == 1 &&  this.data.indexInd < this.data.nums-1){
      this.autoPlay();
    }
  },
  bindKeyInput: function (e) {
    // console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindBlurInput: function (e) {
    // console.log(e.detail.value);
    let me = this.data.me;
    if(e.detail.value){
      me.push(e.detail.value);
    }
    
    // console.log(me);
    this.setData({
      me,
      inputValue: e.detail.value
    })
  },
  autoPlay: function () {
    this.setData({
      autoplay: true
    });

  },
  pageChange:function(e){
    console.log('pageChange');
    
    console.log(e.detail);
    let current = e.detail.current;
    
    let indexInd = current;
    console.log(this.data.questions);
    console.log(indexInd)
    console.log(this.data.questions[indexInd]);
    this.setData({
      me:[],
      autoplay: false
    });
  
    this.setData({
      indexInd: indexInd
    })
  },
  returnHome: function(){
    let questions = this.data.questions;
    let autoRemove = this.data.autoRemove;
    let newIds = [];
    questions.forEach((q)=>{
      if(q.right != 1){
        newIds.push(q.id);
      }
    })
    if(autoRemove){
      wx.setStorage({
        key: 'errorids' + this.data.category.id,
        data: newIds
      })
    }
    wx.switchTab({
      url: "../index/index"
    });
  },
  questionStatus: function () {
    var t = this;
    wx.getStorage({
      key: a + "list" + s,
      success: function (e) {
        t.setData({
          orderPX: e.data,
          allNum: e.data.all
        });
      }
    });
  },

  delCollect: function () {
    console.log(this.data.indexInd);
    console.log(this.data.questions);
    console.log(this.data.questions[this.data.indexInd]);
    let item = this.data.questions[this.data.indexInd];
    let id = item.id;
    let newIds = [];
    let newQues = [];
    let questions = this.data.questions;
    questions.forEach((q)=>{
      if(q.id != id){
        newIds.push(q.id);
        newQues.push(q);
      }
    })

    if(this.data.ind==0){
      console.log('重置错题记录条数')
      wx.setStorage({
        key: 'errorids' + this.data.category.id,
        data: newIds
      },()=>{
  
      })
    }
    if(this.data.ind==1){
      console.log('重置收藏记录条数')
      wx.setStorage({
        key: "starids" + this.data.category.id,
        data: newIds
      });
    }


    this.setData({
      questions: newQues,
      nums: newQues.length
    },()=>{
      if(this.data.nums == 0){
        wx.switchTab({
          url: "../index/index"
        });
      }
    })

  },

  
  touchstart: function (t) { },
  bindtouchmove: function (t) { },
  bindtouchend: function (t) { },
  scrolltop: function (t) { },
  //放大图片
  showPic: function (e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
})