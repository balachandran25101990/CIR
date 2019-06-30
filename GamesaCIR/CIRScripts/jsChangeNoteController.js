app.controller('ChangeNote_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    fnSetAccess();
    function fnSetAccess() {
        var Data = {
            pageName: "Change Note"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;

        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in getting the access details : " + err);
        });
    }

    function LoadPageContent() {
        if ($scope.Page != "0") {
            var Data = {
                pageId: "25",
                kgId: "0"
            };

            var promisePost = CIR_OperationService.postCommonService(GetFilesUrl, Data);
            promisePost.then(function (pl) {
                $scope.PageDetailsArray = pl.data.result;
            }, function (err) {
                console.log("Err" + err);
            });
        }
    };
    LoadPageContent();

    $scope.DeleteFiles = function (row) {
        var Data = {
            KFId: row.KFId,
            fileName: row.KFilename,
            iconName: row.IconName,
            pageName: row.KPage
        };
        var promisePost = CIR_OperationService.postCommonService(DeleteFilesurl, Data);
        promisePost.then(function (pl) {
            if (pl.data.result.Clear == "False") {
                SetErrorMessage(pl.data.result.Msg);
            }
            else {
                SetSuccessMessage(pl.data.result.Msg);
                LoadPageContent();
            }
        }, function (err) {
            console.log("Err" + err);
        });
    };

});