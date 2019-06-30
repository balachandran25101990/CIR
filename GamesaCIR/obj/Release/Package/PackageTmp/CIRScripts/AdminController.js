app.controller('Admin_OperController', function ($scope, CIR_OperationService) {

    $scope.OldPassword = "";
    $scope.NewPassword = "";
    $scope.RepeatPassword = "";
    $scope.Page = "0";
    $scope.Description = "";
    $scope.KMPGroup = "";

    $scope.Save = function () {

        if ($scope.OldPassword == "") {
            SetErrorMessage("Ensure Old Password!");
            $("#txtOldPassword").focus();
            return false;
        }
        if ($scope.NewPassword == "") {
            SetErrorMessage("Ensure New Password!");
            $("#txtNewPassword").focus();
            return false;
        }
        if ($scope.RepeatPassword == "") {
            SetErrorMessage("Ensure Repeat Password!");
            $("#txtConfirmPassword").focus();
            return false;
        }
        if ($scope.NewPassword != $scope.RepeatPassword) {
            SetErrorMessage("New Password and Repeat Password should be same!");
            $("#txtNewPassword").focus();
            return false;
        }
        fnLoadGif();
        var Data = {
            oldPassword: $scope.OldPassword,
            newPassword: $scope.NewPassword
        }
        var promisePost = CIR_OperationService.postCommonService(SetChangePasswordUrl, Data);
        promisePost.then(function (pl) {
            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                $scope.Clear();
            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in saving the password" + err);
        });

        $scope.Clear = function () {
            $scope.OldPassword = "";
            $scope.NewPassword = "";
            $scope.RepeatPassword = "";
        }
    };

    function fnLoadPagesArray() {
        fnLoadGif();
        var PageModel = {
            PgeId: "21",
            View: "1"
        };

        var promisePost = CIR_OperationService.postCommonService(GetPageUrl, PageModel);
        promisePost.then(function (pl) {
            $scope.PageArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the Pages" + err);
        });
    };

    fnLoadPagesArray();

    $scope.SaveFile = function () {
        if ($scope.Page == "0") {
            SetErrorMessage("Ensure Page!");
            return false;
        }
        if ($("#hdnKMPGroup").text() == "0") {
            SetErrorMessage("Ensure KMP Group!");
            return false;
        }
        if ($("#fuImageForFile").val() == "") {
            SetErrorMessage("Ensure File!");
            return false;
        }
        fnLoadGif();
        var Data = {
            pageName: $("#ddlPage > option:selected").text(),
            pageId: $scope.Page,
            kgId: $("#hdnKMPGroup").text()
        };

        var promisePost = CIR_OperationService.postCommonService(SaveFilesUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "False") {
                SetErrorMessage(pl.data.result.Msg);
            }
            else {
                SetSuccessMessage(pl.data.result.Msg);
                $("#fuImageForFile").val("");
                $scope.Description = "";
                $scope.GetKMPFiles();
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in saving the KMP File group" + err);
        });
    };

    $scope.DeleteFiles = function (row) {
        fnLoadGif();
        $("html, body").animate({ scrollTop: 0 }, "slow");
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
                $("#fuImageForFile").val("");
                $scope.Description = "";
                $scope.GetKMPFiles();
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in deleting the KMP group Files" + err);
        });
    }

    $scope.GetKMPFiles = function () {

        if ($scope.Page != "0") {
            fnLoadGif();
            var Data = {
                pageId: $scope.Page,
                kgId: $("#hdnKMPGroup").text()
            };

            var promisePost = CIR_OperationService.postCommonService(GetFilesUrl, Data);
            promisePost.then(function (pl) {
                $scope.PageDetailsArray = pl.data.result;
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in loading the KMP file details" + err);
            });
        }
        else {
            $scope.PageDetailsArray = [];
        }
    };

    $scope.ClearFiles = function () {
        $scope.PageDetailsArray = [];
        $scope.Page = "0";
        $("#hdnKMPGroup").val("");
        $("#txtKMPGroup").val("");
        $("#fuImageForFile").val("");
        $scope.Description = "";
    };

});

app.controller('Email_OperController', function ($scope, CIR_OperationService, $timeout, $filter) {

    $scope.Status = "0";
    $scope.DptId = "0";
    $scope.RleId = "0";
    $scope.FunctionalSystem = "0";
    LoadDepartment();
    LoadRole();
    LoadStatus();
    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.AddOrUpdate = true;

    var ArrayUsed = new Array();

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
            pageName: "Email"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;

            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.AddOrUpdate = $scope.Add ? true : $scope.Update ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            fnRemoveGif();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    $scope.Search = function () {
        fnLoadGif();
        ArrayUsed = new Array();
        $scope.curPage = 0;
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchEmail = '';
        var EmailModel = {
            DepartmentId: $scope.DptId,
            RoleId: $scope.RleId,
            FunctionalSystem: $scope.FunctionalSystem,
            CStatus: $scope.Status
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmailDetailsUrl, EmailModel);
        promisePost.then(function (pl) {
            $scope.EmailDetailsArray = pl.data;
            $scope.EmailDetailsArrayFiltered = $scope.EmailDetailsArray;
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.ClearSearch = function () {
        $scope.FunctionalSystem = "0";
        $scope.RleId = "0";
        $scope.DptId = "0";
        $scope.EmailDetailsArray = [];
        $scope.curPage = 0;
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchEmail = '';
        $scope.Status = "0";
        ArrayUsed = new Array();
        $scope.ClearSearchDetails();
    };

    $scope.ClearSearchDetails = function () {
        $scope.EmailDetailsArray = [];
        $scope.EmailDetailsArrayFiltered = [];

    };

    function LoadFunctionalSystem() {
        fnLoadGif();
        var CollectionModel = {
            RefId: "10",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.FunctionalSystemArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    LoadFunctionalSystem();

    $scope.Check = function (row) {
        var isItemExists = false;
        for (var j = 0; j < ArrayUsed.length; j++) {
            if (row.EmpId == ArrayUsed[j].EmpId) {
                isItemExists = true;
            }
        }
        if (!isItemExists) {
            ArrayUsed.push(row);
        }
    }

    $scope.Save = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");

        if ($scope.EmailDetailsArray == undefined) {
            SetErrorMessage("Ensure Email Recipents!");
            return false;
        }
        if ($scope.Status == "" || $scope.Status == "0") {

            SetErrorMessage("Ensure Status!");
            $("#ddlStatus").focus();
            return false;
        }

        fnLoadGif();
        var EmailModelResult = {
            EmployeeEmailDetails: ArrayUsed,
            CStatus: $scope.Status
        };
        var promisePost = CIR_OperationService.postCommonService(SetEmailDetailsUrl, EmailModelResult);
        promisePost.then(function (pl) {
            fnRemoveGif();
            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                $scope.Search();
            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadDepartment() {
        fnLoadGif();
        var DepartmentModel = {
            DptId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetdepartmentUrl, DepartmentModel);
        promisePost.then(function (pl) {
            $scope.DepartmentArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadRole() {
        fnLoadGif();
        var RoleModel = {
            RleId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetRoleAccessUrl, RoleModel);
        promisePost.then(function (pl) {
            $scope.RoleArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadStatus() {
        fnLoadGif();
        var StatusModel = {
            StsId: "0",
            view: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.StatusArray = pl.data.result.StatusModelsWithDelete;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchEmail = '';
    
    $scope.$watch('searchEmail', function (val) {
        $scope.EmailDetailsArray = $filter('filter')($scope.EmailDetailsArrayFiltered, val);
    });

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.EmailDetailsArray != undefined)
            return Math.ceil($scope.EmailDetailsArray.length / $scope.pageSize);
    };

    $scope.LastPage = function(){
        if ($scope.EmailDetailsArray != undefined)
            $scope.curPage = (Math.ceil($scope.EmailDetailsArray.length / $scope.pageSize) - 1);
    }

});

app.controller('Hierarchy_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.FromDesignationId = "0";
    $scope.ToDesignationId = "0";
    $scope.AutoAssigned = "";
    $scope.Status = "0";
    $scope.CHId = "";
    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.AddOrUpdate = true;
    LoadFromDesignation();
    LoadStatus();

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
            pageName: "Hierarchy"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.AddOrUpdate = $scope.Add ? true : $scope.Update ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;

        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    function LoadFromDesignation() {
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetDesignationUrl, "");
        promisePost.then(function (pl) {
            $scope.FromDesignationArray = pl.data.result.HierarchyDetails;
            $scope.ToDesignationArray = pl.data.result.HierarchyDetails;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.Save = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($scope.FromDesignationId == "0") {
            SetErrorMessage("Ensure From Designation!");
            $("#ddlFromDesignation").focus();
            return false;
        }

        if ($scope.Status == "0") {
            SetErrorMessage("Ensure Status!");
            $("#ddlStatus").focus();
            return false;
        }
        if ($scope.ToDesignationId == "0") {
            SetErrorMessage("Ensure To Designation!");
            $("#ddlToDesignation").focus();
            return false;
        }

        fnLoadGif();
        var HierarchyModel = {
            FromDesignation: $scope.FromDesignationId,
            ToDesignation: $scope.ToDesignationId,
            DelFlag: "0",
            CHId: "0",
            AutoAssigned: $scope.AutoAssigned == "" ? "0" : "1",
            Status: $scope.Status,
        };

        var promisePost = CIR_OperationService.postCommonService(SetHierarchyDetailsUrl, HierarchyModel);
        promisePost.then(function (pl) {
            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                LoadHierachy();
                $("#aSave").css("display", "");
                $("#aUpdate").css("display", "none");
                $scope.Clear();
            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });

    };

    $scope.UpdateHierarchy = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($scope.FromDesignationId == "0") {
            SetErrorMessage("Ensure From Designation!");
            $("#ddlFromDesignation").focus();
            return false;
        }

        if ($scope.Status == "0") {
            SetErrorMessage("Ensure Status!");
            $("#ddlStatus").focus();
            return false;
        }

        if ($scope.ToDesignationId == "0") {
            SetErrorMessage("Ensure To Designation!");
            $("#ddlToDesignation").focus();
            return false;
        }
        fnLoadGif();
        var HierarchyModel = {
            FromDesignation: $scope.FromDesignationId,
            ToDesignation: $scope.ToDesignationId,
            DelFlag: "0",
            CHId: $scope.CHId,
            AutoAssigned: $scope.AutoAssigned == "" ? "0" : $scope.AutoAssigned,
            Status: $scope.Status,
        };

        var promisePost = CIR_OperationService.postCommonService(SetHierarchyDetailsUrl, HierarchyModel);
        promisePost.then(function (pl) {
            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                LoadHierachy();
                $("#aSave").css("display", "");
                $("#aUpdate").css("display", "none");
                $scope.Clear();
            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });

    };

    $scope.Edit = function (row) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.FromDesignationId = row.Frmdsg;
        $scope.ToDesignationId = row.Todsg;
        $scope.AutoAssigned = row.AutoAssign == "True" ? "1" : "0";
        $scope.Status = row.CStatus;
        $scope.CHId = row.CHId;
        $("#aSave").css("display", "none");
        $("#aUpdate").css("display", "");

    };

    $scope.DeleteHierarchy = function (CHId) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        fnLoadGif();
        var HierarchyModel = {
            FromDesignation: "",
            ToDesignation: "",
            DelFlag: "1",
            CHId: "0",
            AutoAssigned: "0",
            Status: "0",
            CHId: CHId
        };

        var promisePost = CIR_OperationService.postCommonService(SetHierarchyDetailsUrl, HierarchyModel);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                LoadHierachy();

            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.Clear = function () {
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchHierachy = '';
        $scope.curPage = 0;
        $("#aSave").css("display", "");
        $("#aUpdate").css("display", "none");
        $scope.FromDesignationId = "0";
        $scope.ToDesignationId = "0";
        $scope.AutoAssigned = "";
        $scope.Status = "0";
        $scope.CHId = "";
    };

    LoadHierachy();

    function LoadHierachy() {
        $scope.curPage = 0;
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchHierachy = '';
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetHierarchyDetailsUrl, "");
        promisePost.then(function (pl) {
            $scope.HierarchyArray = pl.data.result.HierarchyDetail;
            $scope.HierarchyArrayFiltered = $scope.HierarchyArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadStatus() {
        fnLoadGif();
        var StatusModel = {
            StsId: "0",
            view: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.StatusArray = pl.data.result.StatusModels;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchHierachy = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.HierarchyArray != undefined)
            return Math.ceil($scope.HierarchyArray.length / $scope.pageSize);
    };

    $scope.$watch('searchHierachy', function (val) {
        $scope.HierarchyArray = $filter('filter')($scope.HierarchyArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.HierarchyArray != undefined)
            $scope.curPage = (Math.ceil($scope.HierarchyArray.length / $scope.pageSize) - 1);
    }

});

app.controller('KMPFileApproval_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.TurbineType = "0";
    $scope.MasterCategory = "0";
    $scope.SubCategory = "0";
    $scope.Category = "0";
    $scope.Page = "0";
    $scope.status = "0";
    $scope.Status = "0";
    fnSetAccess();
    fnLoadPages();
    LoadTurbineType();

    function fnSetAccess() {
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

        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in getting the access details : " + err);
        });
    }

    function fnLoadPages() {
        fnLoadGif();
        var PageModel = {
            PgeId: "0",
            View: "2"
        };

        var promisePost = CIR_OperationService.postCommonService(GetPageUrl, PageModel);
        promisePost.then(function (pl) {
            $scope.PageArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the Pages" + err);
        });
    };

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
            console.log("Error in loading the Turbine Type : " + err);
        });
    }

    $scope.GetMasterCategory = function () {
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
                console.log("Error in loading the Master Category Details: " + err);
            });
        }
        else {
            $scope.MasterCategory = "0";
            $scope.Category = "0";
            $scope.SubCategory = "0";
        }
    }

    $scope.GetCategory = function () {

        if ($scope.MasterCategory != "0") {
            $scope.LoadGridDetails();
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
                console.log("Error in loading the Category details:" + err);
            });
        }
        else {
            $scope.Category = "0";
            $scope.SubCategory = "0";
        }
    }

    $scope.GetSubCategory = function () {
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
                console.log("Error in loading the Sub Category details:" + err);
            });
        }
        else {
            $scope.SubCategory = "0";
        }
    }

    $scope.LoadGridDetails = function () {
        if ($scope.Page != "0" && $scope.TurbineType != "0") {
            var Data = {
                categoryId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType : $scope.MasterCategory : $scope.Category : $scope.SubCategory,
                refId: $scope.SubCategory == "0" ? $scope.Category == "0" ? $scope.MasterCategory == "0" ? $scope.TurbineType == "0" ? "0" : "1" : "2" : "3" : "4",
                status: $scope.Status,
                viewType: $("#ddlPage option:selected").text() == "Customer Info Document" ? "1" : $("#ddlPage option:selected").text() == "Field Alert Document" ? "2" : $("#ddlPage option:selected").text() == "Safety Alert" ? "3" : $("#ddlPage option:selected").text() == "Service Bulletin" ? "4" : $("#ddlPage option:selected").text() == "WTG S/W & F/W Download" ? "5" : $("#ddlPage option:selected").text() == "Alarm FAQ" ? "6" : $("#ddlPage option:selected").text() == "Change Note" ? "7" : "0"
            }

            var promisePost = CIR_OperationService.postCommonService(GetKMPFileApprovaUrl, Data);
            promisePost.then(function (pl) {
                $scope.KMPFileApprovalArray = pl.data.result;
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in saving the Field alert document details:" + err);
            });
        }
    }

    $scope.SetKMPFileApproval = function () {
        var Data = {
            fileDetails: $scope.KMPFileApprovalArray,
            viewType: $("#ddlPage option:selected").text() == "Customer Info Document" ? "1" : $("#ddlPage option:selected").text() == "Field Alert Document" ? "2" : $("#ddlPage option:selected").text() == "Safety Alert" ? "3" : $("#ddlPage option:selected").text() == "Service Bulletin" ? "4" : $("#ddlPage option:selected").text() == "WTG S/W & F/W Download" ? "5" : $("#ddlPage option:selected").text() == "Alarm FAQ" ? "6" : $("#ddlPage option:selected").text() == "Change Note" ? "7" : "0"
        }
        var promisePost = CIR_OperationService.postCommonService(SetKMPFileApprovalUrl, Data);
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
            console.log("Error in saving the Field alert document details:" + err);
        });
    }

    $scope.Clear = function () {
        $scope.Page = "0";
        $scope.TurbineType = "0";
        $scope.MasterCategory = "0";
        $scope.MasterCategoryArray = "";
        $scope.CategoryArray = "";
        $scope.Category = "0";
        $scope.SubCategory = "0";
        $scope.SubCategoryArray = "";
        $scope.KMPFileApprovalArray = "";
    }

    $scope.LoadPageDetails = function () {
        $scope.TurbineType = "0";
        $scope.MasterCategory = "0";
        $scope.MasterCategoryArray = "";
        $scope.CategoryArray = "";
        $scope.Category = "0";
        $scope.SubCategory = "0";
        $scope.SubCategoryArray = "";
        $scope.KMPFileApprovalArray = "";
    }

    $scope.sortType = 'Slno'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchImages = "";     // set the default search/filter term

});

app.controller('SiteMap_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.State = "0"; $scope.EmpName = "";
    $scope.Site = "0";
    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.AddOrUpdate = true;
    LoadState();

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
            pageName: "Site Mapping"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.AddOrUpdate = $scope.Add ? true : $scope.Update ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    function LoadState() {
        fnLoadGif();
        var CollectionModel = {
            RefId: "3",
            View: "2"
        };
        var promisePost = CIR_OperationService.postCommonService(GetSubMasterCollectionSpecificationUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.StateArray = pl.data.result.CollectionDetailsSpecification;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.LoadSite = function () {
        $("#hdnEmployee").val("0"); $scope.EmpName = "";
        if ($scope.State != "0") {
            fnLoadGif();
            var CollectionModel = {
                RefId: $scope.State,
                View: "0"
            };
            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {
                $scope.SiteArray = pl.data.result;
                $scope.ClearOnBeforeSearch();
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            SetErrorMessage("Ensure State!");
            $scope.SiteArray = [];
            $scope.ClearOnBeforeSearch();
        }
    };

    $scope.ClearOnBeforeSearch = function () {
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchSiteMap = '';
        $scope.curPage = 0;
        $scope.SiteEmployeeArray = [];
        $scope.SiteEmployeeArrayFiltered = [];
        $('.demo2').bootstrapDualListbox('refresh', true);
        $("#divAssignEmployee").css("display", "none");
    }

    $scope.Search = function () {
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchSiteMap = '';
        $scope.curPage = 0; 
        if ($("#hdnEmployee").val() > 0 && $scope.State == "0" && $scope.Site == "0") {
            fnLoadGif();
            var SiteMapModelPopup = {
                StateId: $scope.State == "" ? "0" : $scope.State,
                SiteId: $scope.Site == "" ? "0" : $scope.Site,
                EmpId: $("#hdnEmployee").val()
            };
            var promisePost = CIR_OperationService.postCommonService(GetSiteMapModelPopupurl, SiteMapModelPopup);
            promisePost.then(function (pl) {
                if (pl.data.result.GetMessage[0].Msg == "") {
                    fnShowModal(this);
                    $scope.EmpNameDetails = pl.data.result.GetMessage[0].EMPLOYEE;
                    $scope.SiteGetEmployeeArray = pl.data.result.GetEmpSiteMapModel;
                }
                else {
                    SetErrorMessage("No records found!");
                }
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            if ($scope.State == "0") {
                SetErrorMessage("Ensure State!");
                $("#ddlState").focus();
                return false;
            }
            if ($scope.Site == "0") {
                SetErrorMessage("Ensure Site!");
                $("#ddlSite").focus();
                return false;
            }
        }
        fnLoadGif();
        var SiteMapModel = {
            View: "1",
            State: $scope.State == "" ? "0" : $scope.State,
            Site: $scope.Site == "" ? "0" : $scope.Site
        };

        fnLoadUnAssignEmployee();

        var promisePost = CIR_OperationService.postCommonService(GetEmployeeAssignedDetailsUrl, SiteMapModel);
        promisePost.then(function (pl) {
            $scope.SiteEmployeeArray = pl.data.result.SiteMapModels;
            $scope.SiteEmployeeArrayFiltered = $scope.SiteEmployeeArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.BindEmpdet = function (row) {
        $scope.State = row.StateId;
        $scope.EmpName = row.Employee;
        $("#ddlState").val(row.StateId);
        if ($scope.State != "0") {
            fnLoadGif();
            var CollectionModel = {
                RefId: $scope.State,
                View: "0"
            };
            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {
                $scope.SiteArray = pl.data.result;
                $scope.ClearOnBeforeSearch();
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            SetErrorMessage("Ensure State!");
            $scope.SiteArray = [];
            $scope.ClearOnBeforeSearch();
        }
        $scope.Site = row.SiteId;
        $("#ddlSite").val(row.SiteId);
        $("#myModal").modal("hide");
        //fnLoadGif();  
    }

    $scope.Submit = function () {

        var Employees = "";
        if ($('[name="duallistbox_demo2[]"]').val() == null) {
            SetErrorMessage("Please select anyone employee to map.");
            return false;
        }
        $.each($('[name="duallistbox_demo2[]"]').val(), function (key, value) {
            Employees += value + ",";
        });


        fnLoadGif();
        var SiteMapModel = {
            Site: $scope.Site,
            Employee: Employees.substring(0, Employees.length - 1)
        };
        var promisePost = CIR_OperationService.postCommonService(SetSiteMappingDetailsUrl, SiteMapModel);
        promisePost.then(function (pl) {
            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);

                var SiteMapModel = {
                    View: "1",
                    State: $scope.State,
                    Site: $scope.Site
                };

                var promisePost = CIR_OperationService.postCommonService(GetEmployeeAssignedDetailsUrl, SiteMapModel);
                promisePost.then(function (pl) {
                    $scope.SiteEmployeeArray = pl.data.result.SiteMapModels;
                }, function (err) {
                    SetWarningMessage("Transaction Issue. Please try again.");
                    $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                });
            }
            else
                SetErrorMessage(pl.data.result.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });


    };

    $scope.Clear = function () {
        $scope.StateArray = [];
        LoadState();
        $scope.State = "0";
        $scope.SiteArray = [];
        $scope.Site = "0";
        $scope.SiteEmployeeArray = [];
          $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchSiteMap = '';
        $scope.curPage = 0;
        $scope.SiteEmployeeArray = [];
        $scope.SiteEmployeeArrayFiltered = [];
        $("#btnClear").css("display", "none");
        $('.demo2').bootstrapDualListbox('refresh', true);
        $("#hdnEmployee").val("0");
        $("#divAssignEmployee").css("display", "none");
        $scope.EmpName = "";
    };

    $scope.sortType = ''; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchSiteMap = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.SiteEmployeeArray != undefined)
            return Math.ceil($scope.SiteEmployeeArray.length / $scope.pageSize);
    };

    $scope.$watch('searchSiteMap', function (val) {
        $scope.SiteEmployeeArray = $filter('filter')($scope.SiteEmployeeArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.SiteEmployeeArray != undefined)
            $scope.curPage = (Math.ceil($scope.SiteEmployeeArray.length / $scope.pageSize) - 1);
    }

});

app.controller('Version_OpenController', function ($scope, CIR_OperationService, $filter) {
    fnRemoveGif();
});

angular.module('CIRModule').filter('pagination', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    };
});
