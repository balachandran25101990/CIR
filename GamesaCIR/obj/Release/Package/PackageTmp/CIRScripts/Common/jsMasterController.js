app.controller('Master_OperController', function ($scope, CIR_OperationService) {

    $scope.Notification = "0";

    function LoadMenuGrid() {
        var promisePost = CIR_OperationService.getService(DashBoardMenuUrl);
        promisePost.then(function (pl) {
            $scope.MenuGridArray = pl.data.result;
        }, function (err) {
            console.log("Err" + err);
        });
    };

    LoadNotificationDetails();

    function LoadNotificationDetails() {
        var promisePost = CIR_OperationService.getService(NotificationDetailsUrl);
        promisePost.then(function (pl) {
            
            $scope.Notification = pl.data.result.NotificationDetails.MyPendings;
            $("#spnNotification").text(pl.data.result.NotificationDetails.MyPendings);

        }, function (err) {
            console.log("Err" + err);
        });
    }

    $scope.GetDetailsForPendingForLayout = function () {
        
        var promisePost = CIR_OperationService.getService(NotificationDetailsUrl);
        promisePost.then(function (pl) {
            
            $scope.PendingDetailsArray = pl.data.result.PendingDetails;
        }, function (err) {
            console.log("Err" + err);
        });
    }

    $scope.LoadCIR = function (CIRID) {
        var Data = {
            CIRId: CIRID
        };
        var promisePost = CIR_OperationService.postCommonService(GetRedirectToCIRUrl, Data);
        promisePost.then(function (pl) {
            window.location.href = CIRDetailsUrl;
        }, function (err) {
            
            console.log("Err" + err);
        });
    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //you also get the actual event object
        //do stuff, execute functions -- whatever...
        $('.gw-nav > li > a').click(function () {
            var gw_nav = $('.gw-nav');
            gw_nav.find('li').removeClass('active');
            $('.gw-nav > li > ul > li').removeClass('active');

            var checkElement = $(this).parent();
            var ulDom = checkElement.find('.gw-submenu')[0];

            if (ulDom == undefined) {
                checkElement.addClass('active');
                $('.gw-nav').find('li').find('ul:visible').slideUp();
                return;
            }
            if (ulDom.style.display != 'block') {
                gw_nav.find('li').find('ul:visible').slideUp();
                gw_nav.find('li.init-arrow-up').removeClass('init-arrow-up').addClass('arrow-down');
                gw_nav.find('li.arrow-up').removeClass('arrow-up').addClass('arrow-down');
                checkElement.removeClass('init-arrow-down');
                checkElement.removeClass('arrow-down');
                checkElement.addClass('arrow-up');
                checkElement.addClass('active');
                checkElement.find('ul').slideDown(300);
            } else {
                checkElement.removeClass('init-arrow-up');
                checkElement.removeClass('arrow-up');
                checkElement.removeClass('active');
                checkElement.addClass('arrow-down');
                checkElement.find('ul').slideUp(300);

            }
        });
        $('.gw-nav > li > ul > li > a').click(function () {
            $(this).parent().parent().parent().removeClass('active');
            $('.gw-nav > li > ul > li').removeClass('active');
            $(this).parent().addClass('active')
        });

    });

});