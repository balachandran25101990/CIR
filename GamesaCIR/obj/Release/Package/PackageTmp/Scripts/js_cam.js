$(document).ready(function () {
    // assigning properties and adding callback fuctions
    $("#cameraArea").webcam({
        width: 250,
        height: 160,
        mode: "save",
        swffile: "/Scripts/jscam.swf",
        onTick: function () { },
        onSave: function () {

        },
        onCapture: function () {

            var url = "/CIR/Capture";
            webcam.save(url);

        },
        debug: function (type, message) {
            if (message === "Camera started") { window.webcam.started = true; }
        },
        onLoad: function () { }
    });
    $("#btnCaptureSave").click(function () {
        webcam.capture();
        
    });

});