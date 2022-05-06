let q = require("../../utils/question.js");
let n = "random";
let r = "exam";
let s = 1;
let app = getApp();
Page({

  data: {
    me: [],
    idx: 0,
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    orderPX: {},
    textTab: "答题模式",
    selectInd: !0,
    iconInd: false,
    iconcircle: [],
    recmend: !1,
    iconIndtwo: false,
    youind: 0,
    outside: !0,
    current: 0,
    questions: [],
    circular: true,
    timeshow: !0,
    times: "",
    ytimes: "",
    danxuan: 0,
    duoxuan: 0,
    panduan: 0,
    allfen: 0,
    passf: 0,
    interval: 300,
    videoctrl: !0,
    videoMedia: "",
    startTime: 0,
    startTimeind: !1,
    nums: 0,
    testMode: !1,
    statusOptions: {
      statusType: 0,
      statusColor: "#ff4f42",
      statusBg: "#ffe3e1",
      statusPlan: 1.5,
      statusError: 11,
      statusAnswer: 39,
      statusScore: 50
    },
    currIndex: 0, //数据索引
    swiperIndex: 0, //swiper索引
    swiperItems: [],
    selectedMap:{

    },
  },

  _updown: function () {
    console.log(this.data.iconInd);
    this.setData({
      iconInd: !this.data.iconInd,
      iconIndtwo: !this.data.iconIndtwo,
    });
  },

  onLoad: function (options) {
    //pages/exam/exam?continued=1&passf=95&time=29&training_qids=0&nums=50
    //pages/exam/exam?continued=0&passf=95&time=29&training_qids=0&nums=50&cateid=55
    //pages/exam/exam?timeback=1&passf=undefined&time=NaN&training_qids=0&nums=undefined
    wx.showLoading({
      title: '加载中',
    })
    var e = this;
    var category = wx.getStorageSync('category' + options.cateid);
    let _q = 'q_' + category.id;
    let _qid = 'qid_' + category.id;
    q.initQuestions(_q, _qid);

    console.log(options.passf)
    this.setData({
      category: category,
      times: 1 * options.time + 1 + ":00",
      passf: options.passf,
      startTime: 1 * options.time,
      nums: options.nums
    });
    // 错题回顾
    if(options.action == 'review'){
      this.setData({
        textTab:'背题模式'
      })
      this.getQuestion();
    }else{
      this.random(options);
    }
    
    if(options.timeback){
        this.setData({
            timeshow: !1
        });
        wx.setNavigationBarTitle({
            title: "错题回顾"
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 1e3)
    }else{
        e.timeServal(1 * options.time);
    } 
    var i = 1,
      d = 1,
      o = 1;
    this.setData({
      danxuan: i,
      duoxuan: d,
      panduan: o
    });
    
    this.setData({
        redNum: 0,
        greenNum: 0
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  

  ind_to_data: function (question_ids) {
    let that = this;
    let allQues = q.questions["question"];
    let questions = [];
    let selectedMap = this.data.selectedMap;
    question_ids.forEach(id => {
      selectedMap[id] = false;
      let obj = allQues[id];
      let type = obj.type;
      let answer = obj.answer;
      let options = obj.options;

      let arr = [];
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

      obj.selected = false;
      obj.right = -1;
      questions.push(obj);
    });
    app.globalData.questions = questions;
    let swiperItems = questions.slice(0,3);
    console.log(swiperItems);
    this.setData({
      // questions
      swiperItems,
      selectedMap
    },()=>{
      setTimeout(function () {
        wx.hideLoading()
      }, 10)
    })
    console.log('初始化');
    console.log(questions);
    
   
  },

  jumpToQuestion: function (e) {
    console.log('jump');
    console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;
    console.log('index');
    console.log(id);
    console.log(this.data.idArr);
    let index = this.data.idArr.indexOf(id+'');
    
    let allQues = app.globalData.questions;
    let swiperItems = allQues.slice(index,index+3);
    console.log(swiperItems);

    this.setData({
      currIndex: index,
      swiperItems,
      index,
      circular: true,
      iconInd: false,
      iconIndtwo: false,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('jump结束');
    });
  },

  selectAnswer: function (t) {
    console.log(new Date());
    console.log('selectAnswer');
    console.log(app.globalData.questions);
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    if(item.selected){
      return;
    }
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    item.right = 0;
    options.map(o => {
      o.selected = false;
      if(o.code == code){
        o.selected = true;
      }
      if((o.code == code)&&(o.code == answer)){
        o.val = 1;
        greenNum++;
        item.right = 1;
      }
      if((o.code == code)&&(o.code != answer)){
        o.val = 0;
        redNum++;
      }
    })
    console.log(item);
    item.options = options;
    item.selected = true;

    app.globalData.questions[this.data.currIndex] = item;
    let selectedMap = this.data.selectedMap;
    selectedMap[item.id] = true;


    let newSwiperItems = [];
    this.data.swiperItems.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      newSwiperItems.push(ele);
    })

    this.setData({
      greenNum: greenNum,
      redNum: redNum,
      swiperItems: newSwiperItems,
      selectedMap
    })
    if(this.data.currIndex == app.globalData.questions.length - 1){
      console.log(this.data.currIndex,app.globalData.questions.length)
      this.result();
    }else{
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
    item.right = 0;
    console.log(options)
    options.map(o => {
      if(o.code == code){
        o.selected = !o.selected;
      }
    })
    console.log(options);
    console.log(item);
    item.options = options;

    app.globalData.questions[this.data.currIndex] = item;

    let swiperItems = this.data.swiperItems;
    let newSwiperItems= [];
    swiperItems.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      newSwiperItems.push(ele);
    })
    this.setData({
      swiperItems: newSwiperItems
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
    
    let type = item.type;
    switch(type){
      case 1:
      case 2:
      case 3:
        answer = item.answer.split('');
        // 单选、多选、判断逻辑是一致的
        options.forEach(o => {
          if(o.selected){
            nums++;
          }
        })

        item.right = 0;
        if(nums == answer.length){
          item.right = 1;
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
            nums++;
          }
        })

        item.right = 0;
        if(nums == answer.length){
          item.right = 1;
          greenNum++;
        }else{
          redNum++;
        }
        break;                      
      default: 
      console.log('其他未涉及题型')
    }

    console.log('item');
    console.log(item);
    item.selected = true;
    let selectedMap = this.data.selectedMap;
    selectedMap[item.id] = true;
    app.globalData.questions[this.data.currIndex] = item;



    let swiperItems = this.data.swiperItems;
    console.log(swiperItems);
    let newSwiperItems = [];
    swiperItems.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      newSwiperItems.push(ele);
    })
    this.setData({
      swiperItems: newSwiperItems,
      selectedMap,
      redNum,
      greenNum
    })


    if(this.data.currIndex == app.globalData.questions.length - 1){
      console.log(this.data.currIndex,app.globalData.questions.length)
      this.result();
    }else{
      this.autoPlay();
    }
  },
  bindKeyInput: function (e) {
    console.log(e.detail.value);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindBlurInput: function (e) {
    console.log(e.detail.value);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);

    let me = this.data.me;
    if(e.detail.value){
      me.push(e.detail.value);
    }
    
    console.log(me);
    item.me = me;
    app.globalData.questions[this.data.currIndex] = item;

    let swiperItems = this.data.swiperItems;
    let newSwiperItems= [];
    swiperItems.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      newSwiperItems.push(ele);
    })

    this.setData({
      me,
      inputValue: e.detail.value,
      swiperItems: newSwiperItems
    })
  },
  jsfensu: function (t) {
    var e = this.data.allfen, a = 0;
    a = "判断" == t ? this.data.panduan : "单选" == t ? this.data.danxuan : this.data.duoxuan,
      this.setData({
        allfen: e + a
      });
  },

  autoPlay: function () {
    console.log(new Date());
    console.log('autoplay');
    this.setData({
      autoplay: true
    });

  },

  pageChange: function (e) {
    console.log(new Date());
    console.log('pageChange');
    console.log(e.detail);

    console.log('[滑动]');
    console.log(this.data.currIndex);
    console.log(app.globalData.questions.length);
   

    //更新swiper索引
    let newCurrent = e.detail.current;
    let oldCurrent = this.data.swiperIndex;
    this.data.swiperIndex = newCurrent;

    //更新数据索引
    if (newCurrent === oldCurrent + 1 || oldCurrent + 1 === this.data.swiperItems.length + newCurrent) { //正向
      console.log('正向')
      this.data.currIndex++;
    } else { //逆向
      console.log('逆向')
      this.data.currIndex--;
    }

    //数据索引边界处理
    if (this.data.currIndex > app.globalData.questions.length - 1) {
      this.data.currIndex = 0;
    } else if (this.data.currIndex < 0) {
      this.data.currIndex = app.globalData.questions.length - 1;
    }

    let swiperItems = this.data.swiperItems;
    
    //确定三个item的数据值
    let curr = app.globalData.questions[this.data.currIndex]
    let next = this.data.currIndex === app.globalData.questions.length - 1 ? 0 : app.globalData.questions[this.data.currIndex + 1];
    let pre = this.data.currIndex === 0 ? app.globalData.questions[app.globalData.questions.length - 1] : app.globalData.questions[this.data.currIndex - 1];

    console.log(new Date());
    //当前item不用处理，其他两个item更新显示；
    if (this.data.swiperIndex === 0) {
      swiperItems[1] = next;
      swiperItems[2] = pre;
    } else if (this.data.swiperIndex === 1) {
      swiperItems[0] = pre;
      this.data.swiperItems[2] = next;
    } else if (this.data.swiperIndex === 2) {
      swiperItems[0] = next;
      swiperItems[1] = pre;
    }
    
    
    this.setData({
      currIndex: this.data.currIndex,
      swiperItems: swiperItems,
      circular: true,
      me:[],
      starshow: false,
      autoplay: false
    },()=>{
      console.log(this.data.swiperItems);
      console.log(new Date());
    })
  },

  newUp_exam: function () {
    let unit = 100/this.data.nums;
    var obj = {
      statusType: 1,
      statusColor: "#ff4f42",
      statusBg: "#ffe3e1",
      statusPlan: '',
      statusError: this.data.redNum,
      statusAnswer: this.data.nums - this.data.redNum-this.data.greenNum,
      statusScore: this.data.greenNum*unit,
      statusPassf: this.data.greenNum > this.data.passf ? 1 : 0
    };
    this.setData({
      showStatus: true,
      statusOptions: obj
    });
  },

  changeTab: function () {
    var e = this,
      a = e.data.questions;
    e.setData({
      questions: a,
      textTab: "背题模式",
      selectInd: !1
    })
  },
  getQuestion: function(){
    let allQues = wx.getStorageSync('questionArr');
    let question_ids = [];
    allQues.forEach(q => {
      if(q.right == 0){
        question_ids.push(q.id);
      }
    })
    this.setData({
      nums: question_ids.length
    },()=>{
      this.ind_to_data(question_ids);
    })
  },
  random: function (options) {
    let nums = options.nums;
    var that = this;
    let idArr = q.questionIds["questionId"]
    
    let question_ids = that.getRandomArrayElements(idArr, nums)
    console.log(question_ids);
    this.setData({
        question_ids
    })
    this.ind_to_data(question_ids);
             
  },

  getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0),
      i = arr.length,
      min = i - count,
      temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }

    return shuffled.slice(min);
  },

  timeServal: function (t) {
    console.log(t)
    if (0 != t) {
      var e = t,
        a = 59,
        n = this;
      setInterval(function () {
        a < 10 ? n.setData({
          times: e + ":0" + a,
          ytimes: t - e + ":" + (59 - a)
        }) : n.setData({
          times: e + ":" + a,
          ytimes: t - e + ":" + (59 - a)
        }), --a < 0 && (e > 0 ? (a = 59, e--) : (a = 0, e = 0, n.setData({
          startTimeind: !0
        })));
      }, 1e3);
    } else this.setData({
      times: 0,
      startTimeind: !0
    });
  },

  status_choose_btn: function (t) {
    console.log(t.detail.msg), this.setData({
      showStatus: !1
    }), "up" == t.detail.msg ? this.result() : "again" == t.detail.msg && a._repeat_examGo(this);
  },

  set_time: function () {
    var t = parseInt(this.data.times);
    0 == t && (t = 1), wx.setStorage({
      key: "time" + this.data.category.id,
      data: t
    }), wx.setStorage({
      key: "exam_allfen" + this.data.category.id,
      data: this.data.allfen
    });
  },

  result: function () {
    var uid = app.globalData.uid;
    let unit = 100/this.data.nums;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/save_result?uid=' + uid,
      method: 'post',
      dataType: 'json',
      data: { 
        'uid': uid,
        'score': this.data.greenNum*unit, 
        'category': this.data.category.id, 
        'usetime': this.data.ytimes 
      },
      success: function (res) {
        console.log(res)
      }
    })
    let questions = app.globalData.questions;
    let allNum = 0;
    let errorids = [];
    questions.forEach((q) => {
      if(q.right!=-1){
        allNum++;
        errorids.push(q.question_id);
      }
    })
    wx.setStorage({
      key: "questionArr",
      data: app.globalData.questions
    });
    wx.setStorage({
      key: 'errorids' + this.data.category.id,
      data: errorids
    })
    wx.redirectTo({
      url: "../examresult/examresult?times="+ this.data.times +"&cateid="+ this.data.category.id +"&greenNum=" + this.data.greenNum + "&redNum=" + this.data.redNum + "&allNum=" + allNum + "&ytimes=" + this.data.ytimes + "&allfen=" + this.data.allfen + "&passf=" + this.data.passf  + "&allQuestionCount=" + this.data.nums,
    })
  },

  onUnload: function () {
    this.set_time();
  },

  onHide: function () {
    this.set_time();
  },
})