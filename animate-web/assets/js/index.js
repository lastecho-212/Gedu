function load() {
    // Initialize Swiper
    var mySwiper = new Swiper('#js-swiperBig', {
        spaceBetween: 30,
        effect: 'fade',
        preventClicks: true,
        virtualTranslate: true,
        // loop: true,
        onSlideNextEnd: function (swiper) {
            alert('过渡结束');
        }
    });
    var imgSwiper = new Swiper('#js-swiperSmall', {
        spaceBetween: 0,
        effect: 'fade',
    });

    // index and logo animete
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


// 单词 动画
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

// 音标 动画
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

    /**
     * 例句页动画
     */
    function nextPage() {
        // $("#js-sentence-box").addClass("animated slideInLeft");
        setTimeout(function () {
            $("#js-sentence .sentence-name,#js-sentence .sentence-trans").css("opacity", "1").fadeIn();
        }, 300)
        setTimeout(function () {
             createLis(changImg);
            // changImg();
        }, 1000)
    }

    // 例句插图 切换
    function changImg() {
        $("#js-swiperSmall .swiper-slide").eq(0).find("div").addClass("animated bounceOutSet");
         setTimeout(function () {
             $("#js-sentence .sentence-trans").html("就是他让他们离开了伊甸园.");
             $("#js-sentence .sentence-name").html("He made them leave the Garden of Eden.");
            imgSwiper.slideNext();
             createLis(shineRed);
         }, 1000)
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
            imgMulty($("#js-swiperSmall .swiper-slide:last-child div"));
        }, 2800)
    }

    // 单图 转多图
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

    // 图位移
    function imgMove($dom) {
        $dom.animate({"margin-left": "-10%"}, 2500)
    }

    // 创建图片遮层 1  多个圈
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


    // 单词页动画
    function firstPage() {
        // index and logo animete  begin
        animateOfLogo();
        // word's animate begin
        animateOfWord("eden");
        // audio play
        audioPlay("assets/media/tts.mp3", function () {
        });
        // slideToNext
        setTimeout(function () {
            $("#js-word-gif").hide();
            $("#js-animatePulse").addClass("animated pulse");
            animateOfSymble('[ˈi:dn]', '英', '伊甸园');
            setTimeout(function () {
                slideToNext();
            }, 2000)
        }, 1500)

    }

    firstPage();

    // console.log(swiper.wrapper);
    mySwiper.on("slideChangeTransitionStart", function () {
        console.log(mySwiper.activeIndex);
        if (mySwiper.activeIndex == 1) {
            nextPage();
        }
    })

    // 数据请求
    function getData() {
        $.ajax({
            type: "get",
            url: "http://test.lb.hqclass.cn/words/getWordInfo",
            // data: "",
            dataType: "json",
            success: function(res){
              console.log(res)
            },
            error:function(res){

            }
        });
    }
     // getData();

}


