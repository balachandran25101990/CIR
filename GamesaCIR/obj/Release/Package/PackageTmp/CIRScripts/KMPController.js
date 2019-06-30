app.controller('AlarmFAQ_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.WTGType = "0";

    fnSetAccess();
    LoadWTGType();

    function fnSetAccess() {
        var Data = {
            pageName: "Alarm FAQ"
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

    function LoadWTGType() {
        fnLoadGif();
        var CollectionModel = {
            RefId: "5",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.WTGTypeArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the WTG Type details  : " + err);
            fnRemoveGif();
        });
    };

    $scope.LoadGridDetails = function () {
        fnLoadGif();
        var Data = {
            alarmCode: $("#hdnAlarmCode").val()
        }
        var promisePost = CIR_OperationService.postCommonService(GetAlarmGridDetailsUrl, Data);
        promisePost.then(function (pl) {
            $scope.AlarmCodeDescriptionArray = pl.data.result.AlarmDetail;
            $scope.AlarmReasonArray = pl.data.result.AlarmReasonDetail;
            if ($scope.AlarmCodeDescriptionArray == null) {
                SetErrorMessage("No Result Found");
            }
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the Alram Code details  : " + err);
            fnRemoveGif();
        });
    };

    $scope.Clear = function () {
        $scope.AlarmCodeDescriptionArray = $scope.AlarmReasonArray = $scope.txtAlamCode = ""; $scope.WTGType = "0";
        $('#hdnAlarmCode').val("0");
    }
});

app.controller('CustomerInfo_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.TurbineType = "0";
    $scope.MasterCategory = "0";
    $scope.SubCategory = "0";
    $scope.Category = "0";

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
            pageName: "Customer Info Document"
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

    LoadTurbineType();

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
            $scope.CustomerInfoArray = "";
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
            $scope.CustomerInfoArray = "";
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
            $scope.CustomerInfoArray = "";
        }

    }

    $scope.SetCustomerInfo = function () {
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
            tagTitle: $("#txtTagTitle").val()
        }

        var promisePost = CIR_OperationService.postCommonService(SetCustomerInfoUrl, Data);
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
        $scope.CustomerInfoArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetCustomerInfoUrl, Data);
        promisePost.then(function (pl) {
            $scope.CustomerInfoArray = pl.data.result;
            if ($scope.CustomerInfoArray != null && $scope.CustomerInfoArray.length > 0) {
                for (var i = 0; i < $scope.CustomerInfoArray.length; i++) {
                    $scope.CustomerInfoArray[i].FileName1 = $scope.CustomerInfoArray[i].Filname;
                }
                for (var i = 0; i < $scope.CustomerInfoArray.length; i++) {
                    $scope.CustomerInfoArray[i].FileName1 = $scope.CustomerInfoArray[i].FileName1.substring($scope.CustomerInfoArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteCustomerInfo = function (Id) {
        var Data = {
            delFlag: "1",
            fieldAlertDocumentId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteCustomerInfoUrl, Data);
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
        $scope.CustomerInfoArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});

app.controller('FieldAlert_OperController', function ($scope, CIR_OperationService) {
    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    fnSetAccess();
    function fnSetAccess() {
        var Data = {
            pageName: "Field Alert"
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
                pageId: "23",
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

app.controller('FieldAlertDoc_OperController', function ($scope, CIR_OperationService) {

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
            pageName: "Field Alert Document"
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
            $scope.FieldAlertDocumentArray = "";
        }

    }

    $scope.GetCategory = function () {
        $scope.Category = $scope.SubCategory = "0";
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
            $scope.FieldAlertDocumentArray = "";
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
            $scope.FieldAlertDocumentArray = "";
        }

    }

    $scope.SetFieldAlertDocument = function () {
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

        var promisePost = CIR_OperationService.postCommonService(SetFieldAlertDocumentUrl, Data);
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
        $scope.FieldAlertDocumentArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetFieldAlertDocumentUrl, Data);
        promisePost.then(function (pl) {
            $scope.FieldAlertDocumentArray = pl.data.result;
            if ($scope.FieldAlertDocumentArray != null && $scope.FieldAlertDocumentArray.length > 0) {
                for (var i = 0; i < $scope.FieldAlertDocumentArray.length; i++) {
                    $scope.FieldAlertDocumentArray[i].FileName1 = $scope.FieldAlertDocumentArray[i].Filname;
                }
                for (var i = 0; i < $scope.FieldAlertDocumentArray.length; i++) {
                    $scope.FieldAlertDocumentArray[i].FileName1 = $scope.FieldAlertDocumentArray[i].FileName1.substring($scope.FieldAlertDocumentArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteFieldAlertDocument = function (Id) {
        var Data = {
            delFlag: "1",
            fieldAlertDocumentId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteFieldAlertDocumentUrl, Data);
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
        $scope.FieldAlertDocumentArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});

app.controller('FieldEngChat_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    fnSetAccess();
    LoadPageContent();

    function fnSetAccess() {
        var Data = {
            pageName: "Field Eng Chat"
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
                pageId: "28",
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

app.controller('SafetyAlert_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
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
            pageName: "Safety Alert"
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
            $scope.SafetyAlertArray = "";
        }
    }

    $scope.GetCategory = function () {
        $scope.Category = $scope.SubCategory = "0";
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
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                console.log("Error in loading the Category details:" + err);
            });
        }
        else {
            $scope.Category = "0";
            $scope.SubCategory = "0";
            $scope.SafetyAlertArray = "";
        }
    }

    $scope.GetSubCategory = function () {
        $scope.SubCategory = "0";
        $scope.LoadGridDetails();
        if ($scope.Category != "0") {
            $scope.LoadGridDetails();
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
            $scope.SafetyAlertArray = "";
        }
    }

    $scope.SetSafetyAlert = function () {
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
            tagTitle: $("#txtTagTitle").val()
        }

        var promisePost = CIR_OperationService.postCommonService(SetSafetyAlertUrl, Data);
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
        $scope.SafetyAlertArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetSafetyAlertUrl, Data);
        promisePost.then(function (pl) {
            $scope.SafetyAlertArray = pl.data.result;
            if ($scope.SafetyAlertArray != null && $scope.SafetyAlertArray.length > 0) {
                for (var i = 0; i < $scope.SafetyAlertArray.length; i++) {
                    $scope.SafetyAlertArray[i].FileName1 = $scope.SafetyAlertArray[i].Filname;
                }
                for (var i = 0; i < $scope.SafetyAlertArray.length; i++) {
                    $scope.SafetyAlertArray[i].FileName1 = $scope.SafetyAlertArray[i].FileName1.substring($scope.SafetyAlertArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteSafetyAlert = function (Id) {
        var Data = {
            delFlag: "1",
            fieldAlertDocumentId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteSafetyAlertUrl, Data);
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
        $scope.SafetyAlertArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});

app.controller('Service_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
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
            pageName: "Service BulletIn"
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
            $scope.ServiceBulletInArray = "";
        }
    }

    $scope.GetCategory = function () {
        $scope.Category = $scope.SubCategory = "0";
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
            $scope.ServiceBulletInArray = "";
        }
    }

    $scope.GetSubCategory = function () {
        $scope.SubCategory = "0";
        $scope.LoadGridDetails();
        if ($scope.Category != "0") {
            $scope.LoadGridDetails();
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
            $scope.ServiceBulletInArray = "";
        }
    }

    $scope.SetServiceBulletIn = function () {
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
            tagTitle: $("#txtTagTitle").val()
        }

        var promisePost = CIR_OperationService.postCommonService(SetServiceBulletInUrl, Data);
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
        $scope.ServiceBulletInArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetServiceBulletInUrl, Data);
        promisePost.then(function (pl) {

            $scope.ServiceBulletInArray = pl.data.result;
            if ($scope.ServiceBulletInArray != null && $scope.ServiceBulletInArray.length > 0) {
                for (var i = 0; i < $scope.ServiceBulletInArray.length; i++) {
                    $scope.ServiceBulletInArray[i].FileName1 = $scope.ServiceBulletInArray[i].Filname;
                }
                for (var i = 0; i < $scope.ServiceBulletInArray.length; i++) {
                    $scope.ServiceBulletInArray[i].FileName1 = $scope.ServiceBulletInArray[i].FileName1.substring($scope.ServiceBulletInArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteServiceBulletIn = function (Id) {
        var Data = {
            delFlag: "1",
            fieldAlertDocumentId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteBulletInUrl, Data);
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
        $scope.ServiceBulletInArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});

app.controller('WTG_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
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
            pageName: "WTG S/W & F/W Download"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            debugger
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
            $scope.WTGSoftwareHardwareArray = "";
        }
    }

    $scope.GetCategory = function () {
        $scope.Category = $scope.SubCategory = "0";
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
            $scope.WTGSoftwareHardwareArray = "";
        }
    }

    $scope.GetSubCategory = function () {
        $scope.SubCategory = "0";
        $scope.LoadGridDetails();
        if ($scope.Category != "0") {
            $scope.LoadGridDetails();
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
            $scope.WTGSoftwareHardwareArray = "";
        }
    }

    $scope.SetWTGSoftwareHardware = function () {
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
            tagTitle: $("#txtTagTitle").val()
        }

        var promisePost = CIR_OperationService.postCommonService(SetWTGSoftwareHardwareUrl, Data);
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
        $scope.WTGSoftwareHardwareArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetWTGSoftwareHardwareUrl, Data);
        promisePost.then(function (pl) {
            $scope.WTGSoftwareHardwareArray = pl.data.result;
            if ($scope.WTGSoftwareHardwareArray != null && $scope.WTGSoftwareHardwareArray.length > 0) {
                for (var i = 0; i < $scope.WTGSoftwareHardwareArray.length; i++) {
                    $scope.WTGSoftwareHardwareArray[i].FileName1 = $scope.WTGSoftwareHardwareArray[i].Filname;
                }
                for (var i = 0; i < $scope.WTGSoftwareHardwareArray.length; i++) {
                    $scope.WTGSoftwareHardwareArray[i].FileName1 = $scope.WTGSoftwareHardwareArray[i].FileName1.substring($scope.WTGSoftwareHardwareArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteWTGSoftwareHardware = function (Id) {
        var Data = {
            delFlag: "1",
            fieldAlertDocumentId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteWTGSoftwareHardwareUrl, Data);
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
        $scope.WTGSoftwareHardwareArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});

app.controller('IECStandard_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.DownLoadFile = "";

    fnSetAccess();
    LoadPageContent();

    function fnSetAccess() {
        var Data = {
            pageName: "IEC Standards"
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
                pageId: "31",
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

app.controller('CustomerChat_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    fnSetAccess();
    LoadPageContent();

    function fnSetAccess() {
        var Data = {
            pageName: "CustomerChat"
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
                pageId: "27",
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

app.controller('CustomerSuggestion_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    fnSetAccess();
    LoadPageContent();

    function fnSetAccess() {
        var Data = {
            pageName: "Customer Suggestion"
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
                pageId: "29",
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

app.controller('ChangeNote_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
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
            pageName: "Change Note"
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
            $scope.ChangeNoteArray = "";
        }
    }

    $scope.GetCategory = function () {
        $scope.Category = $scope.SubCategory = "0";
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
            $scope.ChangeNoteArray = "";
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
            $scope.ChangeNoteArray = "";
        }

    }

    $scope.SetChangeNote = function () {
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

        var promisePost = CIR_OperationService.postCommonService(SetChangeNoteUrl, Data);
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
        $scope.ChangeNoteArray = "";
        var Data = {
            categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
            refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
            viewType: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(GetChangeNoteUrl, Data);
        promisePost.then(function (pl) {
            $scope.ChangeNoteArray = pl.data.result;
            if ($scope.ChangeNoteArray != null && $scope.ChangeNoteArray.length > 0) {
                for (var i = 0; i < $scope.ChangeNoteArray.length; i++) {
                    $scope.ChangeNoteArray[i].FileName1 = $scope.ChangeNoteArray[i].Filname;
                }
                for (var i = 0; i < $scope.ChangeNoteArray.length; i++) {
                    $scope.ChangeNoteArray[i].FileName1 = $scope.ChangeNoteArray[i].FileName1.substring($scope.ChangeNoteArray[i].FileName1.lastIndexOf('/')).replace('/', '');
                }
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteChangeNote = function (Id) {
        var Data = {
            delFlag: "1",
            ChangeNoteId: Id
        }
        var promisePost = CIR_OperationService.postCommonService(DeleteChangeNoteUrl, Data);
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
        $scope.ChangeNoteArray = "";
        $("#fuImage").val("");
        $("#txtTitle").val("");
        $("#txtTagTitle").val("");
        $("#hdnTitle").val("0");
        $("#hdnTagTitle").val("0");
    }

});


