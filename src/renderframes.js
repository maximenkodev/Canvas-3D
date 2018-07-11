import $ from 'jquery';

export default function Canvas3D(params) {
    /*----------Canvas3D Constructor----------*/
    params.countFramesHorizontal > 0 ? this.countFramesHorizontal = params.countFramesHorizontal : Log("countFramesHorizontal must be 1 or more");
    params.countFramesVertical > 0 ? this.countFramesVertical = params.countFramesVertical : Log("countFramesVertical must be 1 or more");

    this.pathToFrames = params.pathToFrames;

    typeof params.playHorizontal === "boolean" ? this.playHorizontal = params.playHorizontal : Log("playHorizontal must be only true or false");
    typeof params.playVertical === "boolean" ? this.playVertical = params.playVertical : Log("playVertical must be only true or false");

    switch (params.pageID) {
        case false:
        case "":
            this.pageID = false;
            break;
        case true:
            Log("pageID can be only as selector or empty/false");
            break;
        default:
            this.pageID = params.pageID;
    }
    switch (params.clickSelector) {
        case false:
        case "":
            this.clickSelector = false;
            break;
        case true:
            Log("clickSelector can be only as selector or empty/false");
            break;
        default:
            this.clickSelector = params.clickSelector;
    }
    switch (params.listSelector) {
        case false:
        case "":
            this.listSelector = false;
            break;
        case true:
            Log("listSelector can be only as selector or empty/false");
            break;
        default:
            this.listSelector = params.listSelector;
    }
    switch (params.activateFor) {
        case false:
        case "":
            this.activateFor = false;
            break;
        case true:
            Log("activateFor can be only as selector");
            break;
        default:
            this.activateFor = params.activateFor;
    }

    /*----------Canvas3D Log----------*/
    function Log(message) {
        console.log("Canvas3D: " + message);
    }

    this.InitRender = function (params) {
        let renderParams = {
            "countFramesX": this.countFramesHorizontal,
            "countFramesY": this.countFramesVertical,
            "pathToFrames": this.pathToFrames,
            "playHorizontal": this.playHorizontal,
            "playVertical": this.playVertical,
            "pageID": this.pageID,
            "activateFor": this.activateFor,
            "clickSelector": this.clickSelector,
            "listSelector": this.listSelector
        };

        let partsHorizontal = Math.round($(window).width() / renderParams.countFramesX);
        let limitFrames = renderParams.countFramesX;

        let activeImgHorizontal = 1;
        let activeImgVertical = 1;

        let reverseWork = {
            "work": false,
            "reverseX": false,
            "reverseXBack": false,
            "reverseY": false,
            "reverseYBack": false
        };

        let wheelWork = false;
        let renderArea = $(renderParams.activateFor);
        /*----------Init after loading----------*/
        let renderAreaTop = 0;
        let renderAreaBottom = 0;
        /*----------End: Init after loading----------*/
        let offsetForY = params.offsetToAnimateY;

        let tmpStep = 0;
        let skipSteps = false;
        let autoplaySpeed = params.autoplaySpeed;
        let tmpFrameX = 0;

        let canvas = renderArea.get(0);
        canvas.width = params.canvWidth;
        canvas.height = params.canvHeight;
        let canvasContext = canvas.getContext('2d');

        let preloader = $(params.preloader);
        let loadingProgress = 0;
        let preRenderFinish = false;

        let clickCheck = false;
        $(renderParams.clickSelector).hasClass("active") || renderParams.clickSelector === false ? clickCheck = true : clickCheck = false;
        $(renderParams.listSelector).on('click', function () {
            $(this).hasClass(renderParams.clickSelector.replace(".", "")) ? clickCheck = true : clickCheck = true;
        });

        if (typeof renderParams.clickSelector !== "undefined") {

        }
        /*----------PreRender images on load----------*/
        $(function () {
            InsertImages();
        });

        /*----------playHorizontal === true----------*/
        $(window).on('mousemove', function (ev) {
            tmpFrameX = Math.round(ev.pageX / partsHorizontal);
            if (CheckStatus()) {
                AnimateHorizontal(ev.pageX);
            }
        });

        /*----------playVertical === true----------*/
        // $(window).on('scroll',function (ev) {
        //     if (CheckStatus()) {
        //         // Todo add scroll logic
        //     }
        // });

        /*----------playVertical === true----------*/
        $(window).on("wheel", function (ev) {
            /*----------SCROLL DOWN----------*/
            if (CheckStatus()) {
                if (ev.originalEvent.deltaY >= 0 && $(window).scrollTop() >= renderAreaTop - offsetForY) {
                    wheelWork = true;
                    switch (tmpStep) { // tmpStep = step in params of sequence
                        case 0:
                            if (!reverseWork.work)
                                if (params.startFromLast) {
                                    ReverseXBack({
                                        step: 1, // Number in sequence of animations (example: ReverseX -> ReverseY -> ReverseXBack)
                                        skip: false, // When false - scroll will be disabled, true - for final animation, if you want to allow scroll
                                        next: false, // Last frame/limit of frames
                                        then: false, // Function which will performs, after end of current function
                                        wheel: true // When true - horizontal mouse tracing (mousemove) will be disabled
                                    });
                                }
                                else {
                                    ReverseX({
                                        step: 1, // Number in sequence of animations (example: ReverseX -> ReverseY -> ReverseXBack)
                                        skip: false, // When false - scroll will be disabled, true - for final animation, if you want to allow scroll
                                        next: false, // Last frame/limit of frames
                                        then: false, // Function which will performs, after end of current function
                                        wheel: true // When true - horizontal mouse tracing (mousemove) will be disabled
                                    });
                                }
                            break;
                        case 1:
                            if (!reverseWork.work)
                                ReverseY({
                                    step: 2,
                                    skip: true,
                                    next: false,
                                    then: false,
                                    wheel: true
                                });
                            break;
                    }

                    /*----------Delay/pause on mousewheel----------*/
                    // clearTimeout($.data(this, "timer"));
                    // $.data(this, "timer", setTimeout(function () {
                    //
                    // }, 10));

                    if (tmpStep < 3 && !skipSteps) {
                        // Todo or not) ev.preventDefault();
                    }
                }
                /*----------SCROLL UP----------*/
                else if (ev.originalEvent.deltaY <= 0 && $(window).scrollTop() <= (renderAreaBottom - canvas.height / 4)) {
                    if (!reverseWork.work && wheelWork)
                        ReverseYBack({
                            step: 0,
                            skip: false,
                            next: false,
                            fromX: renderParams.countFramesX,
                            then: function () {
                                ReverseXBack({
                                    step: 0,
                                    skip: false,
                                    next: tmpFrameX,
                                    then: false,
                                    wheel: false
                                })
                            },
                            wheel: true
                        });
                }
                // AnimateVertical($(this).scrollTop);
            }
        });

        /**
         * @return {boolean}
         */
        function CheckStatus() {
            if (renderParams.playHorizontal && preRenderFinish === true && clickCheck === true) {
                return true;
            }
        }

        function AnimateHorizontal(mousePositionX) {
            if (!reverseWork.work && !wheelWork) {
                activeImgHorizontal = Math.round(mousePositionX / partsHorizontal);
                Render(activeImgHorizontal, "ih");
            }
        }

        // function AnimateVertical(documentPositionTop) {
        //     if (clickCheck) {
        //         // Todo Continue
        //     }
        // }

        /*----------Reverse on scroll----------*/
        function ReverseX(params) {
            Log("ReverseX");
            // Checks Start
            reverseWork.work = true;
            if (params.next === false)
                params.next = renderParams.countFramesX;

            console.log(activeImgHorizontal + " : " + params.next);
            if (activeImgHorizontal < params.next) {
                let timer = setInterval(function () {
                    if (activeImgHorizontal < params.next) {
                        activeImgHorizontal += autoplaySpeed;
                        Render(activeImgHorizontal, "ih");
                    }
                    else {
                        // Checks End
                        reverseWork.work = false;
                        tmpStep = params.step;
                        skipSteps = params.skip;
                        wheelWork = params.wheel;
                        activeImgHorizontal = params.next;
                        activeImgVertical = 1;
                        clearInterval(timer);
                    }
                }, 24);
            }
            else {
                activeImgHorizontal = params.next;
                activeImgVertical = 1;
            }
        }

        function ReverseY(params) {
            Log("ReverseY");
            // Checks Start
            reverseWork.work = true;
            if (params.next === false)
                params.next = renderParams.countFramesY;

            if (activeImgVertical < params.next) {
                let timer = setInterval(function () {
                    if (activeImgVertical < params.next) {
                        activeImgVertical += autoplaySpeed;
                        Render(activeImgVertical, "iv");
                    }
                    else {
                        // Checks End
                        reverseWork.work = false;
                        tmpStep = params.step;
                        skipSteps = params.skip;
                        activeImgVertical = params.next;
                        clearInterval(timer);
                    }
                }, 24)
            }
            else {
                activeImgVertical = params.next;
            }
        }

        function ReverseXBack(params) {
            Log("ReverseXBack");
            // Checks Start
            reverseWork.work = true;
            if (params.next === false)
                params.next = 0;

            let timer = setInterval(function () {
                if (activeImgHorizontal > params.next) {
                    activeImgHorizontal -= autoplaySpeed;
                    Render(activeImgHorizontal, "ih");
                }
                else {
                    console.log(tmpFrameX + " / " + activeImgHorizontal);
                    // Checks End
                    reverseWork.work = false;
                    tmpStep = params.step;
                    skipSteps = params.skip;
                    activeImgHorizontal = params.next;
                    wheelWork = params.wheel;
                    activeImgVertical = 1;
                    clearInterval(timer);
                }
            }, 24);
        }

        function ReverseYBack(params) {
            Log("ReverseYBack");
            // Checks Start
            reverseWork.work = true;
            if (params.next === false)
                params.next = 0;

            let timer = setInterval(function () {
                if (activeImgVertical > params.next) {
                    activeImgVertical -= autoplaySpeed;
                    Render(activeImgVertical, "iv");
                }
                else {
                    // Checks End
                    reverseWork.work = false;
                    tmpStep = params.step;
                    skipSteps = params.skip;
                    activeImgVertical = params.next;
                    activeImgHorizontal = params.fromX;
                    wheelWork = params.wheel;
                    clearInterval(timer);
                    if (typeof params.then === "function")
                        params.then();
                }
            }, 24);
        }


        /*----------Render----------*/
        function InsertImages() {
            let i;
            for (i = 1; i <= renderParams.countFramesX; i++) {
                PreRender(i, "ih");
            }
            for (i = 1; i <= renderParams.countFramesY; i++) {
                PreRender(i, "iv");
            }
        }

        function DisplayCanvas() {
            Render(activeImgHorizontal, "ih");

            preloader.remove();
            renderArea.fadeIn();
            renderAreaTop = renderArea.offset().top;
            renderAreaBottom = renderArea.offset().top + renderArea.height();
            preRenderFinish = true;
        }

        let imageBuffer = {
            iv: [],
            ih: []
        };

        function PreRender(num, selector) {
            console.log(selector);
            switch (selector) {
                case "ih":
                    limitFrames = renderParams.countFramesX;
                    break;
                case "iv":
                    limitFrames = renderParams.countFramesY;
                    break;
                default:
                    limitFrames = renderParams.countFramesX;
            }
            if (num <= limitFrames && num > 0) {
                let canvasImg = new Image();
                canvasImg.src = renderParams.pathToFrames + "/" + selector + "/(" + num + ").jpg?dir=" + selector;
                canvasImg.onload = () => {
                    imageBuffer[selector][num] = canvasImg;
                    loadingProgress++;
                    if (loadingProgress >= renderParams.countFramesX && !preRenderFinish) {
                        DisplayCanvas();
                    }
                }
            }
        }

        function Render(num, selector) {
            switch (selector) {
                case "ih":
                    limitFrames = renderParams.countFramesX;
                    break;
                case "iv":
                    limitFrames = renderParams.countFramesY;
                    break;
                default:
                    limitFrames = renderParams.countFramesX;
            }
            if (num <= limitFrames && num > 0) {
                let canvasImg = imageBuffer[selector][num];
                canvasContext.drawImage(canvasImg, 0, 0);
            }
        }
    };
}