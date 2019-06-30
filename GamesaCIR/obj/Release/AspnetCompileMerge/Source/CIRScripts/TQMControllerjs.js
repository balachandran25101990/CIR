
app.controller('QITProject_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.TurbineType = "0";
    $scope.MasterCategory = "0";
    $scope.SubCategory = "0";
    $scope.Category = "0";

    LoadTurbineType();

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
            pageName: "QIT Project"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    function LoadTurbineType() {
        fnLoadGif();
        var CollectionModel = {
            RefId: "0",
            View: "5"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.TurbineTypeArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.GetMasterCategory = function () {
        $scope.MasterCategory = $scope.SubCategory = $scope.Category = "0";
        $scope.LoadGridDetails();
        if ($scope.TurbineType != "0") {
            fnLoadGif();
            var CollectionModel = {
                RefId: $scope.TurbineType,
                View: "6"
            }

            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {

                $scope.MasterCategoryArray = pl.data.result;
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.MasterCategory = "0";
            $scope.Category = "0";
            $scope.SubCategory = "0";
            $scope.QITProjectArray = "";
        }

    }

    $scope.GetCategory = function () {
        $scope.SubCategory = $scope.Category = "0";
        $scope.LoadGridDetails();
        if ($scope.MasterCategory != "0") {
            fnLoadGif();
            var CategoryDetails = {
                refId: $scope.MasterCategory,
                categoryId: "0",
                view: "2"
            }

            var promisePost = CIR_OperationService.postCommonService(GetCategoryDetailsUrl, CategoryDetails);
            promisePost.then(function (pl) {
                $scope.CategoryArray = pl.data.result;
                $scope.Category = "0";
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.Category = "0";
            $scope.SubCategory = "0";
            $scope.QITProjectArray = "";
        }

    }

    $scope.GetSubCategory = function () {
        $scope.SubCategory = "0";
        $scope.LoadGridDetails();
        if ($scope.Category != "0") {

            fnLoadGif();
            var CategoryDetails = {
                refId: $scope.MasterCategory,
                categoryId: $scope.Category,
                view: "3"
            }

            var promisePost = CIR_OperationService.postCommonService(GetCategoryDetailsUrl, CategoryDetails);
            promisePost.then(function (pl) {
                $scope.SubCategoryArray = pl.data.result;
                $scope.SubCategoryGridArray = pl.data.result;
                $scope.SubCategory = "0";
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.SubCategory = "0";
            $scope.QITProjectArray = "";
        }

    }

    $scope.SetQITProject = function () {
        if ($scope.TurbineType == "0") {
            SetErrorMessage("Ensure Turbine Type!");
            $("#ddlTurbineType").focus();
            return false;
        }

        if ($("#fuImage").val() == "") {
            SetErrorMessage("Please upload image/pdf files!");
            return false;
        }

        if ($("#txtTitle").val() == "0") {
            SetErrorMessage("Ensure Title!");
            $("#txtTitle").focus();
            return false;
        }

        if ($("#txtTagTitle").val() == "0") {
            SetErrorMessage("Ensure Tag Title!");
            $("#txtTagTitle").focus();
            return false;
        }

        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            title: $("#txtTitle").val(),
            tagTitle: $("#txtTagTitle").val(),
            delFlag: "0"
        }

        var promisePost = CIR_OperationService.postCommonService(SetQITProjectUrl, Data);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.LoadGridDetails();
                $("#txtTitle").val("");
                $("#hdnTitle").val("0");
                $("#txtTagTitle").val("");
                $("#hdnTagTitle").val("0");
                $("#fuImage").val("");
                $scope.LoadGridDetails();
            }
            else {
                SetErrorMessage($scope.Message.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadGridDetails = function () {
        $scope.QITProjectArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetQITProjectUrl, Data);
        promisePost.then(function (pl) {
            $scope.QITProjectArray = pl.data.result;
            if ($scope.QITProjectArray != null) {
                for (var i = 0; i < $scope.QITProjectArray.length; i++) {
                    $scope.QITProjectArray[i].FileName1 = $scope.QITProjectArray[i].Filname;
                }
                for (var i = 0; i < $scope.QITProjectArray.length; i++) {
                    $scope.QITProjectArray[i].FileName1 = $scope.QITProjectArray[i].FileName1.substring($scope.QITProjectArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteQITProject = function (Id) {
        var Data = {
            delFlag: "1",
            QITProjectId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteQITProjectUrl, Data);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.LoadGridDetails();
            }
            else {
                SetErrorMessage($scope.Message.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });

    }

    $scope.Clear = function () {
        $scope.TurbineType = "0";
        $scope.MasterCategory = "0";
        $scope.MasterCategoryArray = "";
        $scope.Category = "0";
        $scope.CategoryArray = "";
        $scope.SubCategory = "0";
        $scope.SubCategoryArray = "";
        $scope.QITProjectArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});

app.controller('TQMReliabilityReport_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.TurbineType = "0";
    $scope.MasterCategory = "0";
    $scope.SubCategory = "0";
    $scope.Category = "0";

    LoadTurbineType();

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
            pageName: "TQM Reliability Report"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    function LoadTurbineType() {
        fnLoadGif();
        var CollectionModel = {
            RefId: "0",
            View: "5"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.TurbineTypeArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.GetMasterCategory = function () {
        $scope.MasterCategory = $scope.SubCategory = $scope.Category = "0";
        $scope.LoadGridDetails();
        if ($scope.TurbineType != "0") {
            fnLoadGif();
            var CollectionModel = {
                RefId: $scope.TurbineType,
                View: "6"
            }

            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {

                $scope.MasterCategoryArray = pl.data.result;
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.MasterCategory = "0";
            $scope.Category = "0";
            $scope.SubCategory = "0";
            $scope.TQMReliabiityReportArray = "";
        }

    }

    $scope.GetCategory = function () {
        $scope.SubCategory = $scope.Category = "0";
        $scope.LoadGridDetails();
        if ($scope.MasterCategory != "0") {
            fnLoadGif();
            var CategoryDetails = {
                refId: $scope.MasterCategory,
                categoryId: "0",
                view: "2"
            }

            var promisePost = CIR_OperationService.postCommonService(GetCategoryDetailsUrl, CategoryDetails);
            promisePost.then(function (pl) {
                $scope.CategoryArray = pl.data.result;
                $scope.Category = "0";
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.Category = "0";
            $scope.SubCategory = "0";
            $scope.TQMReliabiityReportArray = "";
        }

    }

    $scope.GetSubCategory = function () {
        $scope.SubCategory = "0";
        $scope.LoadGridDetails();
        if ($scope.Category != "0") {

            fnLoadGif();
            var CategoryDetails = {
                refId: $scope.MasterCategory,
                categoryId: $scope.Category,
                view: "3"
            }

            var promisePost = CIR_OperationService.postCommonService(GetCategoryDetailsUrl, CategoryDetails);
            promisePost.then(function (pl) {
                $scope.SubCategoryArray = pl.data.result;
                $scope.SubCategoryGridArray = pl.data.result;
                $scope.SubCategory = "0";
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.SubCategory = "0";
            $scope.TQMReliabiityReportArray = "";
        }

    }

    $scope.SetTQMReliabilityReport = function () {
        if ($scope.TurbineType == "0") {
            SetErrorMessage("Ensure Turbine Type!");
            $("#ddlTurbineType").focus();
            return false;
        }

        if ($("#fuImage").val() == "") {
            SetErrorMessage("Please upload image/pdf files!");
            return false;
        }

        if ($("#txtTitle").val() == "0") {
            SetErrorMessage("Ensure Title!");
            $("#txtTitle").focus();
            return false;
        }

        if ($("#txtTagTitle").val() == "0") {
            SetErrorMessage("Ensure Tag Title!");
            $("#txtTagTitle").focus();
            return false;
        }

        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            title: $("#txtTitle").val(),
            tagTitle: $("#txtTagTitle").val(),
            delFlag: "0"
        }

        var promisePost = CIR_OperationService.postCommonService(SetTQMReliabilityReportUrl, Data);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.LoadGridDetails();
                $("#txtTitle").val("");
                $("#hdnTitle").val("0");
                $("#txtTagTitle").val("");
                $("#hdnTagTitle").val("0");
                $("#fuImage").val("");
                $scope.LoadGridDetails();
            }
            else {
                SetErrorMessage($scope.Message.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadGridDetails = function () {
        $scope.TQMReliabiityReportArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetTQMReliabilityReportUrl, Data);
        promisePost.then(function (pl) {
            $scope.TQMReliabiityReportArray = pl.data.result;
            if ($scope.TQMReliabiityReportArray != null) {
                for (var i = 0; i < $scope.TQMReliabiityReportArray.length; i++) {
                    $scope.TQMReliabiityReportArray[i].FileName1 = $scope.TQMReliabiityReportArray[i].Filname;
                }
                for (var i = 0; i < $scope.TQMReliabiityReportArray.length; i++) {
                    $scope.TQMReliabiityReportArray[i].FileName1 = $scope.TQMReliabiityReportArray[i].FileName1.substring($scope.TQMReliabiityReportArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteTQMReliabilityReport = function (Id) {
        var Data = {
            delFlag: "1",
            TQMReliabilityrptId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteTQMReliabilityReportUrl, Data);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.LoadGridDetails();
            }
            else {
                SetErrorMessage($scope.Message.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });

    }

    $scope.Clear = function () {
        $scope.TurbineType = "0";
        $scope.MasterCategory = "0";
        $scope.MasterCategoryArray = "";
        $scope.Category = "0";
        $scope.CategoryArray = "";
        $scope.SubCategory = "0";
        $scope.SubCategoryArray = "";
        $scope.TQMReliabiityReportArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});

app.controller('SCMReport_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.TurbineType = "0";
    $scope.MasterCategory = "0";
    $scope.SubCategory = "0";
    $scope.Category = "0";

    LoadTurbineType();

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
            pageName: "SCM Report"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    function LoadTurbineType() {
        fnLoadGif();
        var CollectionModel = {
            RefId: "0",
            View: "5"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.TurbineTypeArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.GetMasterCategory = function () {
        $scope.MasterCategory = $scope.SubCategory = $scope.Category = "0";
        $scope.LoadGridDetails();
        if ($scope.TurbineType != "0") {
            fnLoadGif();
            var CollectionModel = {
                RefId: $scope.TurbineType,
                View: "6"
            }

            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {

                $scope.MasterCategoryArray = pl.data.result;
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.MasterCategory = "0";
            $scope.Category = "0";
            $scope.SubCategory = "0";
            $scope.SCMReportArray = "";
        }

    }

    $scope.GetCategory = function () {
        $scope.SubCategory = $scope.Category = "0";
        $scope.LoadGridDetails();
        if ($scope.MasterCategory != "0") {
            fnLoadGif();
            var CategoryDetails = {
                refId: $scope.MasterCategory,
                categoryId: "0",
                view: "2"
            }

            var promisePost = CIR_OperationService.postCommonService(GetCategoryDetailsUrl, CategoryDetails);
            promisePost.then(function (pl) {
                $scope.CategoryArray = pl.data.result;
                $scope.Category = "0";
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.Category = "0";
            $scope.SubCategory = "0";
            $scope.SCMReportArray = "";
        }

    }

    $scope.GetSubCategory = function () {
        $scope.SubCategory = "0";
        $scope.LoadGridDetails();
        if ($scope.Category != "0") {

            fnLoadGif();
            var CategoryDetails = {
                refId: $scope.MasterCategory,
                categoryId: $scope.Category,
                view: "3"
            }

            var promisePost = CIR_OperationService.postCommonService(GetCategoryDetailsUrl, CategoryDetails);
            promisePost.then(function (pl) {
                $scope.SubCategoryArray = pl.data.result;
                $scope.SubCategoryGridArray = pl.data.result;
                $scope.SubCategory = "0";
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.SubCategory = "0";
            $scope.SCMReportArray = "";
        }

    }

    $scope.SetSCMReport = function () {
        if ($scope.TurbineType == "0") {
            SetErrorMessage("Ensure Turbine Type!");
            $("#ddlTurbineType").focus();
            return false;
        }

        if ($("#fuImage").val() == "") {
            SetErrorMessage("Please upload image/pdf files!");
            return false;
        }

        if ($("#txtTitle").val() == "0") {
            SetErrorMessage("Ensure Title!");
            $("#txtTitle").focus();
            return false;
        }

        if ($("#txtTagTitle").val() == "0") {
            SetErrorMessage("Ensure Tag Title!");
            $("#txtTagTitle").focus();
            return false;
        }

        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            title: $("#txtTitle").val(),
            tagTitle: $("#txtTagTitle").val(),
            delFlag: "0"
        }

        var promisePost = CIR_OperationService.postCommonService(SetSCMReportUrl, Data);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.LoadGridDetails();
                $("#txtTitle").val("");
                $("#hdnTitle").val("0");
                $("#txtTagTitle").val("");
                $("#hdnTagTitle").val("0");
                $("#fuImage").val("");
                $scope.LoadGridDetails();
            }
            else {
                SetErrorMessage($scope.Message.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadGridDetails = function () {
        $scope.SCMReportArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetSCMReportUrl, Data);
        promisePost.then(function (pl) {
            $scope.SCMReportArray = pl.data.result;
            if ($scope.SCMReportArray != null) {
                for (var i = 0; i < $scope.SCMReportArray.length; i++) {
                    $scope.SCMReportArray[i].FileName1 = $scope.SCMReportArray[i].Filname;
                }
                for (var i = 0; i < $scope.SCMReportArray.length; i++) {
                    $scope.SCMReportArray[i].FileName1 = $scope.SCMReportArray[i].FileName1.substring($scope.SCMReportArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteSCMReport = function (Id) {
        var Data = {
            delFlag: "1",
            SCMRptId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteSCMReportUrl, Data);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.LoadGridDetails();
            }
            else {
                SetErrorMessage($scope.Message.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });

    }

    $scope.Clear = function () {
        $scope.TurbineType = "0";
        $scope.MasterCategory = "0";
        $scope.MasterCategoryArray = "";
        $scope.Category = "0";
        $scope.CategoryArray = "";
        $scope.SubCategory = "0";
        $scope.SubCategoryArray = "";
        $scope.SCMReportArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});