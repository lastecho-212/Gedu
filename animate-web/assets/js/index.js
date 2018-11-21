$(function(){
    /**
     * 全局 globalmodule 
     * load前请求数据
     */
    function globalmodule(){
        this.dataUrl = 'http://test.lb.hqclass.cn/words/getWordInfo';
        this.currentPage = 0;
        this.getData();
        // console.log(JSON.parse(this.data[3].extenJson));
     }
     globalmodule.prototype.getData = function(){
        var self = this;
        $.ajax({
            type: "get",
            url: self.dataUrl,
            async: false,
            dataType: "json",
            success: function(res){
                if(res.status == "success" ){
                    self.data = res.data;
                }
                else{
                    alert("数据请求错误！")
                }
            },
            error:function(res){
                alert("数据请求错误！")
            }
        })
      
     }

  

    //  监听 页面load 
    window.onload = function load(){

    //  Initialize 全局 Swiper
    var mySwiper = new Swiper('#js-swiperBig', {
        spaceBetween: 30,
        effect: 'fade',
        preventClicks: true,
        virtualTranslate: true,
        // loop: true,
    });

      //  声明 module
      var module = new globalmodule();
      var dataJson = JSON.parse(module.data[3].extenJson);
      console.log(dataJson);
    //   var wordData = {
    //     word:"eden",
    //     symble:"[ˈi:dn]",
    //     symbleType:"英",
    //     trans:"伊甸园",
    //     wordAudio:'assets/media/tts.mp3',
    //     sentence:[
    //         {text:"Nobody is saying our neighborhoodis a garden of Edon.",textTrans:"没有人说我们的邻居是伊甸园",imgUrl:"assets/imgs/img-img.jpg",senAudio:""},
    //         {text:"He made them leave the Garden of Eden.",textTrans:"就是他让他们离开了伊甸园",imgUrl:"assets/imgs/img-img1.jpg",senAudio:''}
    //     ]
    // }
    
    var wordData = {
        word:dataJson.word,
        symble:dataJson.enlish,
        symbleType:"英",
        trans:dataJson.zhushi,
        wordAudio:dataJson.enlishAudioQiniu,
        sentence:[
            {text:dataJson[0].descEn,textTrans:dataJson[0].descCh,imgUrl:dataJson[0].imgQiniu,senAudio:dataJson[0].audioQiniu},
            {text:dataJson[1].descEn,textTrans:dataJson[1].descCh,imgUrl:dataJson[1].imgQiniu,senAudio:dataJson[1].audioQiniu},
        ]
    }

/**
 * 开始函数
 * @param {*} wordData 一个词的所有信息
 */
    function beginWord(wordData){
        firstPage(wordData);
        // console.log(swiper.wrapper);
         mySwiper.on("slideChangeTransitionStart", function () {
        console.log(mySwiper.activeIndex);
        if (mySwiper.activeIndex == 1) {
            nextPage(wordData);
        }
    })
    }
    beginWord(wordData);
     imgSwiperIn();

     //  Initialize 例句img Swiper
    var imgSwiper = new Swiper('#js-swiperSmall', {
        spaceBetween: 0,
        effect: 'fade',
    });


      //  Initialize 例句img Swiper
      function imgSwiperIn(){
        var $imgSwperBox = $("#js-swiperSmall").find(".swiper-wrapper");
        for(var i=0;i<wordData.sentence.length;i++){
          var imgSwperStr = '<div class="swiper-slide">'+  
                              '<div class="g-slide-div" style="'+"background: url(' "+ wordData.sentence[i].imgUrl +"')"+' center top no-repeat;background-size: cover">'+
                                '</div>'+
                            '</div>'  ;  
           $imgSwperBox.append(imgSwperStr);     
           console.log(imgSwperStr)               
        }
      }
     
    
    /**
     *  单词 index and logo animete
     */
    function animateOfLogo() {
        var toLeftRight = function () {
            var box = $(".js-logo-txt");
            var left = box.find(".left"),
                right = box.find(".right");
            left.css("right", 30 + "px");
            right.css("left", 31 + "px");
            left.show().stop().animate({width: 30 + "px"}, "slow");
            right.show().stop().animate({width: 30 + "px"}, "slow");
        }
        var toTopBottom = function () {
            var box = $(".js-logo-idx");
            var top = box.find(".top"),
                bottom = box.find(".bottom");
            top.css("bottom", 30 + "px");
            bottom.css("top", 30 + "px");
            top.show().stop().animate({height: 30 + "px"}, "slow");
            bottom.show().stop().animate({height: 30 + "px"}, "slow", function () {
                $(".js-idx-txt").fadeIn();
            });
        }
        toLeftRight();
        toTopBottom();
    }

    /**
     * 音频播放  音标渲染及动画
     */
    function audioPlay(audioUrl, callback) {
        var myAuto = document.getElementById('js-audio');
        var times = 0;
        myAuto.src = audioUrl;
        // if (myAuto.readyState == 4) {
        // myAuto.currentTime = 0;
        myAuto.play();
        document.addEventListener("WeixinJSBridgeReady", function () {
            myAuto.play();
        }, false);
        // }
        myAuto.addEventListener("ended", function () {
            times++;
            if (times == 1) {
                setTimeout(function () {
                    myAuto.play();
                }, 1000);
            }
            else {
                callback();
            }
        })
    }


/**
 *  单词 渲染 动画
 * @param {*} wordName  单词
 */
    function animateOfWord(wordName) {
        var wordName = wordName;
        var wordNameStr = '';
        for (var i = 0; i < wordName.length; i++) {
            wordNameStr += "<div class='line'><div class='square el'>" + wordName[i] + "</div></div>";
        }
        $("#js-wordName").html(wordNameStr);
        var functionBasedElasticity = anime({
            targets: '#js-wordName .el',
            translateY: 50,
            direction: 'alternate',
            loop: false,
            elasticity: function (el, i, l) {
                return (50 + i * 200);
            }
        })
        setTimeout(function () {
            $("#js-word-gif").show();
        }, 200)

    }

/**
 *  音标渲染 动画
 * @param {*} symbleName  
 * @param {*} symbleType 
 * @param {*} wordTrans 
 */
    function animateOfSymble(symbleName, symbleType, wordTrans) {
// 动画  之  音标
        var symbleName = symbleName;
        var newStrDom = '';
        for (var i = 0; i < symbleName.length; i++) {
            newStrDom += "<div class='line'><div class='square el'>" + symbleName[i] + "</div></div>";
        }
        $("#js-symbleName").html(newStrDom);
        var functionBasedElasticity = anime({
            targets: '#js-symbleName .el',
            translateY: 100,
            direction: 'alternate',
            loop: false,
            elasticity: function (el, i, l) {
                return (200 + i * 100);
            }
        })
// 动画  之  发音类型
        var symbleType = symbleType;
        var symbleTypeStr = "<div class='line'><div class='square el'>" + symbleType + "</div></div>";
        $("#js-symbleType").html(symbleTypeStr);
        var functionBasedElasticity = anime({
            targets: '#js-symbleType .el',
            translateY: 100,
            direction: 'alternate',
            loop: false,
            elasticity: function (el, i, l) {
                return (500 + i * 200);
            },
            delay: function (el, i, l) {
                return i * 300;
            }
        })
// 动画  之  翻译
        var wordTrans = wordTrans;
        var transStr = "";
        for (var i = 0; i < wordTrans.length; i++) {
            transStr += "<div class='line'><div class='square el'>" + wordTrans[i] + "</div></div>";
        }
        $("#js-wordTrans").html(transStr);
        var functionBasedElasticity = anime({
            targets: '#js-wordTrans .el',
            translateY: -100,
            direction: 'alternate',
            loop: false,
            elasticity: function (el, i, l) {
                return (100 + i * 200);
            }
        })
    }

    /**
     * mySwiper  1 slideToNext
     *           2 转场图
     */
    function slideToNext() {
        $("#js-slideImg").show();
        setTimeout(function () {
            mySwiper.slideNext();
        }, 1200)
        setTimeout(function () {
            $("#js-slideImg").hide();
        }, 1300)
    }

    // 渐变 图层
    function shineRed() {
        $("#js-shineRed").fadeIn();
        imgMove($("#js-swiperSmall .swiper-slide").eq(1).find("div"));
        setTimeout(function () {
            $("#js-shineRed").fadeOut();
            $("#js-shineGreen").fadeIn();
            setTimeout(function () {
                $("#js-shineGreen").fadeOut();
            }, 500)
        }, 1000)

        // 图片移动结束后
        setTimeout(function () {
            imgMulty($("#js-swiperSmall .swiper-slide").eq(1).find("div"));
        }, 2800)
    }

    /**
     *  单图 转多图
     * @param {*} $dom 
     */
    function imgMulty($dom) {
        var imgUrl = $dom.css("background");
        var liStrArr = new Array(12);
        var liStr = "<li style='background:" + imgUrl + "'></li>";
        var ulStr = liStrArr.fill(liStr).join("");
        var liStrs = "<ul class='slide-img-mult'>"+ulStr +"</ul>";
        $dom.css({"background": "","margin-left":"0"});
        $dom.append(liStrs);
        setTimeout(function () {
            $dom.find("ul").fadeIn(500).remove();
            $dom.css("background",imgUrl);
        }, 1000)
    }

    /**
     * 图位移
     * @param {*} $dom 
     */
    function imgMove($dom) {
        $dom.animate({"margin-left": "-10%"}, 2500)
    }

   /**
    *  创建图片遮层 1  多个圈
    * @param {*} callback 
    */
    function createLis(callback) {
        var ulBox = $("#js-dotted");
        var liStrArr = new Array(50);
        var liStr = "<li></li>";
        var ulStr = liStrArr.fill(liStr).join("");
        var liStrs = "<ul class='module-dots'>" + ulStr + "</ul>";
        ulBox.append(liStrs).fadeIn();
        setTimeout(function () {
            ulBox.fadeOut().find("ul").remove();
            if (callback) {
                callback();
            }
        }, 200)
    }


    /**
     *  单词页动画
     */
    function firstPage(wordData) {
        // index and logo animete  begin
        animateOfLogo();
        // word's animate begin
        animateOfWord(wordData.word);
        // audio play
        audioPlay(wordData.wordAudio, function () {
        });
        // slideToNext
        setTimeout(function () {
            $("#js-word-gif").hide();
            $("#js-animatePulse").addClass("animated pulse");
            animateOfSymble(wordData.symble, wordData.symbleType, wordData.trans);
            setTimeout(function () {
                slideToNext();
            }, 2000)
        }, 1500)
    }

    /**
     * 例句页动画
     */
    function nextPage(wordData) {
        // $("#js-sentence-box").addClass("animated slideInLeft");
        console.log(wordData);
        var textArr = wordData.sentence;
        var imgIndex = 0;
        var $sentName = $("#js-sentence .sentence-name");
        var $sentTrans = $("#js-sentence .sentence-trans");
        $sentName.html(textArr[imgIndex].text);
        $sentTrans.html(textArr[imgIndex].textTrans);
        audioPlay(textArr[imgIndex].senAudio, function () {
        });
        setTimeout(function () {
            $("#js-sentence .sentence-name,#js-sentence .sentence-trans").css("opacity", "1").fadeIn();
        }, 300)
        setTimeout(function () {
             imgIndex++;
             createLis(changImg(textArr[imgIndex]));
        }, 1000)
        
        /**
         *  例句插图 切换
         */
        function changImg(txtInfo) {
            $("#js-swiperSmall .swiper-slide").eq(0).find("div").addClass("animated bounceOutSet");
             setTimeout(function () {
                $sentName.html(txtInfo.text);
                $sentTrans.html(txtInfo.textTrans);
                imgSwiper.slideNext();
                audioPlay(txtInfo.senAudio, function () {
                });
                 createLis(shineRed);
             }, 1000)
        }

    }

   

}()
    

})


