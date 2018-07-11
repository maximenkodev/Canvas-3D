import $ from 'jquery';
import Canvas3D from './renderframes';

$(function () {
    if ($(window).width() > 768) {
        let animationExample = new Canvas3D({
            countFramesHorizontal: 80,
            countFramesVertical: 81,
            pathToFrames: "frames/hand",
            activateFor: "#render-area",
            playHorizontal: true, // Turn on/off horizontal animations (mousemove) [true/false]
            playVertical: true, // Turn on/off vertical animations (scroll, mousewheel) [true/false]
            pageID: false, // Todo Will work, if Selector ID exist on page [#selector/false]
            clickSelector: false, // Will work if Selector has class 'active' [selector/false]
            listSelector: false // Class of list elements (<li>) [selector/false]
        });
        animationExample.InitRender({
            canvWidth: 1920,
            canvHeight: 700,
            autoplaySpeed: 3, // How fast will animate reverse animation (default: 3) [1 - 9]
            offsetToAnimateY: 200, // Position, where scroll will animation start. Difference between canvas top (default: 300) [0 - 999]
            startFromLast: false,
            preloader: "#canvas-preloader"
        });

        let animationExampleHelmet = new Canvas3D({
            countFramesHorizontal: 100,
            countFramesVertical: 100,
            pathToFrames: "frames/helmet",
            activateFor: "#render-area-helmet",
            playHorizontal: true,
            playVertical: true,
            pageID: false,
            clickSelector: false,
            listSelector: false
        });
        animationExampleHelmet.InitRender({
            canvWidth: 960,
            canvHeight: 700,
            autoplaySpeed: 3,
            offsetToAnimateY: 200,
            startFromLast: false,
            preloader: "#canvas-preloader-helmet"
        });

        let animationExampleClock = new Canvas3D({
            countFramesHorizontal: 101,
            countFramesVertical: 101,
            pathToFrames: "frames/clock",
            activateFor: "#render-area-clock",
            playHorizontal: true,
            playVertical: true,
            pageID: false,
            clickSelector: false,
            listSelector: false
        });
        animationExampleClock.InitRender({
            canvWidth: 720,
            canvHeight: 450,
            autoplaySpeed: 3,
            offsetToAnimateY: 200,
            startFromLast: false,
            preloader: "#canvas-preloader-clock"
        });

        let animationExampleEdu = new Canvas3D({
            countFramesHorizontal: 100,
            countFramesVertical: 101,
            pathToFrames: "frames/education",
            activateFor: "#render-area-edu",
            playHorizontal: true,
            playVertical: true,
            pageID: false,
            clickSelector: false,
            listSelector: false
        });
        animationExampleEdu.InitRender({
            canvWidth: 1920,
            canvHeight: 700,
            autoplaySpeed: 3,
            offsetToAnimateY: 200,
            startFromLast: false,
            preloader: "#canvas-preloader-edu"
        });
    }
});
