app.controller('Page_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.PgeId = "0";
    $scope.Name = "";
    $scope.Url = "";
    $scope.Menu = "1";
    $scope.Active = "1";
    $scope.Action = "";
    $scope.Controller = "";
    LoadMasterPage();
    $scope.RefId = "0";
    LoadPageGrid();

    $scope.LogFile = function (errorData) {
        var Data = {
            errorData: errorData
        }
        var promisePost = CIR_OperationService.postCommonService(GetLogFileUrl, Data);
        promisePost.then(function () {
        });
    }

    $scope.LoadPageAccess = function () {
        var Data = {
            pageName: "Page Master"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.AddOrUpdate = $scope.Add ? true : $scope.Update ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    $scope.SetPage = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($.trim($scope.Name) == "") {
            SetErrorMessage("Ensure Page Name!");
            $("#txtPageName").focus();
            return false;
        }
        if ($scope.RefId != "0") {
            if ($.trim($scope.Action) == "") {
                SetErrorMessage("Ensure Action!");
                $("#txtPageAction").focus();
                return false;
            }
            if ($.trim($scope.Controller) == "") {
                SetErrorMessage("Ensure Controller!");
                $("#txtPageController").focus();
                return false;
            }
        }

        var PageModel = {
            PgeId: $scope.PgeId,
            RefId: $scope.RefId,
            Name: $scope.Name,
            Action: $scope.Action,
            Controller: $scope.Controller,
            Menu: $scope.Menu,
            Active: $scope.Active
        };

        var promisePost = CIR_OperationService.postCommonService(SetPageUrl, PageModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.pagedetails = pl.data.result.pagedetails;
            
            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                LoadPageGrid();
                if ($scope.RefId == "0")
                    LoadMasterPage();
                $scope.PgeId = "0";
                $scope.Name = "";
                $scope.Url = "";
                $scope.Menu = "1";
                $scope.Active = "1";
                $scope.Action = "";
                $scope.Controller = "";
            }
            else
                SetErrorMessage($scope.Message.Msg);

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.GetPage = function () {
        LoadPageGrid();
        $scope.UpdateOnly = false;
    };

    $scope.EditPage = function (row) {
        $scope.UpdateOnly = true;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        //var row = $scope.PageGridArray[Index]
        $scope.PgeId = row.MdlId;
        $scope.Name = row.Module;
        $scope.Action = row.Action;
        $scope.Controller = row.Controller;
        $scope.Menu = (row.Menu == "True" ? "1" : "0");
        $scope.Active = (row.Active == "True" ? "1" : "0");
        console.log(row.SlNo);
    };

    function LoadMasterPage() {
        var PageModel = {
            PgeId: "0",
            View: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(GetPageUrl, PageModel);
        promisePost.then(function (pl) {
            $scope.MasterSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadPageGrid() {
        var PageModel = {
            PgeId: $scope.RefId,
            View: "1"
        };

        var promisePost = CIR_OperationService.postCommonService(GetPageUrl, PageModel);
        promisePost.then(function (pl) {
            $scope.PageGridArray = pl.data.result;
            $scope.PageGridArrayFiltered = $scope.PageGridArray;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.sortType = 'Role'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchPage = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.PageGridArray != undefined)
            return Math.ceil($scope.PageGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchPage', function (val) {
        $scope.PageGridArray = $filter('filter')($scope.PageGridArrayFiltered, val);
    });
    
});

angular.module('CIRModule').filter('pagination', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    };
});