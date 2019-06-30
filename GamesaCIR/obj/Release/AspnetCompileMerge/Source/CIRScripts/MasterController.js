app.controller('Category_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.TurbineType = "0";
    $scope.Category = "0";
    $scope.MasterCategory = "0";
    $scope.CategoryName = "";
    $scope.SubCategory = "0";
    $scope.SubCategoryName = "";

    $scope.CategoryOrSubCategory = "0";
    $scope.ActiveCategory = "1";
    $scope.ActiveSubCategory = "1";

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
            pageName: "Category Master"
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

        $scope.CategoryGridArray = [];
        $scope.CategoryGridArrayFiltered = [];
        $scope.UpdateOnly = false;
        $scope.MasterCategory = "0";
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
            $scope.CategoryName = "";
            $scope.SubCategoryName = "";
            $scope.ActiveCategory = "1";
            $scope.ActiveSubCategory = "1";
        }
    }

    $scope.GetCategory = function () {
        $scope.UpdateOnly = false;
        debugger
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
                $scope.CategoryGridArray = pl.data.result;
                $scope.CategoryName = "";
                $scope.Category = "0";
                $scope.LoadGridDetails($scope.MasterCategory, "0", "2");
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
            $scope.CategoryName = "";
            $scope.SubCategoryName = "";
            $scope.ActiveCategory = "1";
            $scope.ActiveSubCategory = "1";
            $scope.CategoryGridArray = [];
            $scope.CategoryGridArrayFiltered = [];
        }
    }

    $scope.GetSubCategory = function () {
        $scope.UpdateOnly = false;
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
                $scope.SubCategoryName = "";
                $scope.SubCategory = "0";
                $scope.LoadGridDetails($scope.MasterCategory, $scope.Category, "3");
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.SubCategory = "0";
            $scope.SubCategoryName = "";
            $scope.ActiveSubCategory = "1";
            $scope.LoadGridDetails($scope.MasterCategory, "0", "2");
        }
    }

    $scope.SetCategory = function () {
        if ($scope.MasterCategory == "0") {
            SetErrorMessage("Ensure Master Category!");
            $("#ddlMasterCategory").focus();
            return false;
        }

        if ($scope.Category == "0") {
            if ($scope.CategoryName == "") {
                SetErrorMessage("Ensure Category Name!");
                $("#txtCategoryName").focus();
                return false;
            }
        }
        if ($scope.Category != "0") {
            if ($scope.SubCategory == "0") {
                if ($scope.SubCategoryName == "") {
                    SetErrorMessage("Ensure Sub Category Name!");
                    $("#txtSubCategoryName").focus();
                    return false;
                }
            }
        }

        fnLoadGif();
        var CategoryDetails = {
            id: $scope.CategoryOrSubCategory,
            mcId: $scope.MasterCategory,
            refId: $scope.Category == "0" ? "0" : $scope.Category,
            category: $scope.Category == "0" ? $scope.CategoryName : $scope.SubCategoryName,
            active: $scope.Category == "0" ? $scope.ActiveCategory : $scope.ActiveSubCategory,
            delFlag: "0"
        }

        var promisePost = CIR_OperationService.postCommonService(SetCategoryDetailsUrl, CategoryDetails);
        promisePost.then(function (pl) {

            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.CategoryOrSubCategory = "0";
                if ($scope.Category == "0") {
                    $scope.LoadGridDetails($scope.MasterCategory, "0", "2");
                    $scope.GetCategory();
                }
                else {
                    $scope.LoadGridDetails($scope.MasterCategory, $scope.Category, "3");
                    $scope.GetSubCategory();
                }
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

    $scope.LoadGridDetails = function (masterCategory, categoryOrSubCategoryId, viewType) {
        fnLoadGif();
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchCategory = '';
        $scope.curPage = 0;
        var CategoryDetails = {
            refId: masterCategory,
            categoryId: categoryOrSubCategoryId,
            view: viewType
        }

        var promisePost = CIR_OperationService.postCommonService(GetCategoryDetailsUrl, CategoryDetails);
        promisePost.then(function (pl) {
            $scope.CategoryGridArray = pl.data.result;
            $scope.CategoryGridArrayFiltered = $scope.CategoryGridArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.EditCategory = function (row) {
        $scope.UpdateOnly = true;
        if ($scope.MasterCategory != "0") {
            if ($scope.Category != "0") {
                $scope.SubCategory = "0";
                $scope.SubCategoryName = row.Category;
                $scope.CategoryOrSubCategory = row.Id;
                $scope.ActiveSubCategory = (row.Active == "True" ? "1" : "0");
            }
            else {
                $scope.Category = "0";
                $scope.CategoryName = row.Category;
                $scope.CategoryOrSubCategory = row.Id;
                $scope.ActiveCategory = (row.Active == "True" ? "1" : "0");
            }
        }
    }

    $scope.DeleteCategory = function (CategoryOrSubCategoryId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var CategoryDetails = {
            id: CategoryOrSubCategoryId,
            mcId: "0",
            refId: "0",
            category: "",
            active: "0",
            delFlag: "1"
        }

        var promisePost = CIR_OperationService.postCommonService(SetCategoryDetailsUrl, CategoryDetails);
        promisePost.then(function (pl) {

            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.GetCategory();
                $scope.SubCategory();
                $scope.CategoryOrSubCategory = "0";
                if ($scope.Category == "0")
                    $scope.LoadGridDetails($scope.MasterCategory, "0", "2");
                else
                    $scope.LoadGridDetails($scope.MasterCategory, $scope.Category, "3");
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
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchCategory = '';
        $scope.curPage = 0;
        $scope.TurbineType = "0";
        $scope.Category = "0";
        $scope.SubCategory = "0";
        $scope.CategoryName = "";
        $scope.SubCategoryName = "";
        $scope.CategoryGridArray = "";
        $scope.UpdateOnly = false;
        $scope.CategoryGridArray = [];
        $scope.CategoryGridArrayFiltered = [];
    }

    $scope.GetSubSubCategory = function () {
        $scope.CategoryGridArray = "";
        if ($scope.SubCategory == "0") {
            $scope.LoadGridDetails($scope.MasterCategory, $scope.Category, "3");
        }
    }

    $scope.sortType = 'Slno'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchCategory = "";     // set the default search/filter term

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.CategoryGridArray != undefined)
            return Math.ceil($scope.CategoryGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchCategory', function (val) {
        $scope.CategoryGridArray = $filter('filter')($scope.CategoryGridArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.CategoryGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.CategoryGridArray.length / $scope.pageSize) - 1);
    }

});

app.controller('Department_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.SlNo = "1";
    $scope.DptId = "0";
    $scope.Name = "";
    $scope.Code = "";
    $scope.Desc = "";
    $scope.Active = "1";

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
            pageName: "Department"
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

    LoadDepartmentGrid();

    $scope.SetDepartment = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($.trim($scope.Name) == "") {
            SetErrorMessage("Ensure Department Name!");
            $("#txtDeptName").focus();
            return false;
        }
        if ($.trim($scope.Code) == "") {
            SetErrorMessage("Ensure Code!");
            $("#txtDeptCode").focus();
            return false;
        }
        fnLoadGif();
        var DepartmentModel = {
            DptId: $scope.DptId,
            Name: $scope.Name,
            Code: $scope.Code,
            Desc: $scope.Desc,
            Active: $scope.Active,
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetDepartmentUrl, DepartmentModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.DepartmentGridArray = pl.data.result.departmentdetails;
            $scope.SlNo = $scope.DepartmentGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.DptId = "0";
                $scope.Name = "";
                $scope.Code = "";
                $scope.Desc = "";
                $scope.Active = "1";
                $scope.sortType = 'SlNo'; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.searchDepartment = '';     // set the default search/filter term
                $scope.curPage = 0;
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.GetDepartment = function () {
        $scope.DptId = "0";
        $scope.Name = "";
        $scope.Code = "";
        $scope.Desc = "";
        $scope.Active = "1";
        $scope.UpdateOnly = false;
        LoadDepartmentGrid();

    };

    $scope.EditDepartment = function (row) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.UpdateOnly = true;
        $scope.SlNo = row.SlNo;
        $scope.DptId = row.DeptId;
        $scope.Name = row.Dept;
        $scope.Code = row.Code;
        $scope.Desc = row.Desc;
        $scope.Active = (row.Active == "True" ? "1" : "0");
    };

    $scope.DeleteDepartment = function (DeptId) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.UpdateOnly = false;
        fnLoadGif();
        var DepartmentModel = {
            DptId: DeptId,
            Name: "",
            Code: "",
            Desc: "",
            Active: "1",
            Delflag: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(SetDepartmentUrl, DepartmentModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.DepartmentGridArray = pl.data.result.departmentdetails;
            $scope.SlNo = $scope.DepartmentGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.DptId = "0";
                $scope.Name = "";
                $scope.Code = "";
                $scope.Desc = "";
                $scope.Active = "1";
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadDepartmentGrid() {
        fnLoadGif();
        $scope.sortType = 'SlNo'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchDepartment = '';     // set the default search/filter term
        $scope.curPage = 0;
        var DepartmentModel = {
            DptId: "0",
            View: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetdepartmentUrl, DepartmentModel);
        promisePost.then(function (pl) {
            $scope.DepartmentGridArray = pl.data.result;
            $scope.SlNo = $scope.DepartmentGridArray.length + 1;
            $scope.DepartmentGridArrayFiltered = $scope.DepartmentGridArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchDepartment = '';     // set the default search/filter term

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.DepartmentGridArray != undefined)
            return Math.ceil($scope.DepartmentGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchDepartment', function (val) {
        $scope.DepartmentGridArray = $filter('filter')($scope.DepartmentGridArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.DepartmentGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.DepartmentGridArray.length / $scope.pageSize) - 1);
    }


});

app.controller('Designation_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.SlNo = "1";
    $scope.DsgId = "0";
    $scope.Name = "";
    $scope.Code = "";
    $scope.Desc = "";
    $scope.Active = "1";

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
            pageName: "Designation"
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

    LoadDesignationGrid();

    $scope.SetDesignation = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($.trim($scope.Name) == "") {
            SetErrorMessage("Ensure Designation Name!");
            $("#txtDsgnName").focus();
            return false;
        }
        if ($.trim($scope.Code) == "") {
            SetErrorMessage("Ensure Code!");
            $("#txtDsgnCode").focus();
            return false;
        }
        fnLoadGif();
        var DesignationModel = {
            DsgId: $scope.DsgId,
            Name: $scope.Name,
            Code: $scope.Code,
            Desc: $scope.Desc,
            Active: $scope.Active,
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetDesignationUrl, DesignationModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.DesignationGridArray = pl.data.result.designationdetails;
            $scope.SlNo = $scope.DesignationGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.DsgId = "0";
                $scope.Name = "";
                $scope.Code = "";
                $scope.Desc = "";
                $scope.Active = "1";
                $scope.sortType = 'Designation'; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.searchDesignation = '';
                $scope.curPage = 0;
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
        return false;
    };

    $scope.GetDesignation = function () {
        $scope.DsgId = "0";
        $scope.Name = "";
        $scope.Code = "";
        $scope.Desc = "";
        $scope.Active = "1";
        LoadDesignationGrid();
        $scope.UpdateOnly = false;

    };

    $scope.EditDesignation = function (row) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.UpdateOnly = true;
        $scope.SlNo = row.SlNo;
        $scope.DsgId = row.DsgId;
        $scope.Name = row.Designation;
        $scope.Code = row.Code;
        $scope.Desc = row.Desc;
        $scope.Active = (row.Active == "True" ? "1" : "0");
    };

    $scope.DeleteDesignation = function (DsgId) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.UpdateOnly = false;
        fnLoadGif();
        var DesignationModel = {
            DsgId: DsgId,
            Name: "",
            Code: "",
            Desc: "",
            Active: "1",
            Delflag: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(SetDesignationUrl, DesignationModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.DesignationGridArray = pl.data.result.designationdetails;
            $scope.SlNo = $scope.DesignationGridArray.length + 1;

            if ($scope.Message.Clear == "True") {

                SetSuccessMessage($scope.Message.Msg);
                $scope.DsgId = "0";
                $scope.Name = "";
                $scope.Code = "";
                $scope.Desc = "";
                $scope.Active = "1";
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
    };

    function LoadDesignationGrid() {
        $scope.sortType = 'Designation'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchDesignation = '';
        $scope.curPage = 0;
        $scope.UpdateOnly = false;
        fnLoadGif();
        var DesignationModel = {
            DsgId: "0",
            View: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetDesignationUrl, DesignationModel);
        promisePost.then(function (pl) {
            $scope.DesignationGridArray = pl.data.result;
            $scope.SlNo = $scope.DesignationGridArray.length + 1;
            $scope.DesignationGridArrayFiltered = $scope.DesignationGridArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            SetWarningMessage("Transaction Issue. Please try again.");

        });
    };

    $scope.sortType = 'Designation'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchDesignation = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.DesignationGridArray != undefined)
            return Math.ceil($scope.DesignationGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchDesignation', function (val) {
        $scope.DesignationGridArray = $filter('filter')($scope.DesignationGridArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.DesignationGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.DesignationGridArray.length / $scope.pageSize) - 1);
    }

});

app.controller('Employee_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.btnName = "Save";
    $scope.EmpId = "0";
    $scope.EmpName = "";
    $scope.ICHCode = "";
    $scope.SAPCode = "";
    $scope.DptId = "0";
    $scope.DsgId = "0";
    $scope.OMobile = "";
    $scope.OEmail = "";
    $scope.RleId = "0";
    $scope.Pwd = "";
    $scope.Active = "1";
    $scope.EUId = "0";
    $scope.EFilename = "";
    $scope.EUNo = "0";
    $scope.Posted = "0";
    $scope.PostedBy = "";
    $scope.PostedOn = "";
    $scope.Remarks = "";
    $scope.UploadedBy = "";
    $scope.Total = "0";
    $scope.New = "0";
    $scope.Modified = "0";
    $scope.Invalid = "0";
    $scope.FnSystem = "0";
    $scope.WorkingAt = "0";

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;

    LoadDepartment();
    LoadDesignation();
    LoadRole();
    LoadFunctionalSystem();
    LoadEmployeeGrid();
    LoadEmployeeExcel("0");


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
            pageName: "Employee Master"
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

    $scope.LoadEmployeeDetails = function () {
        $scope.UpdateOnly = false;
        if ($("#hdnEmployee").val() != "0") {
            fnLoadGif();
            var employeeModel = {
                EmpId: $("#hdnEmployee").val(),
                View: 1
            };

            var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, employeeModel);
            promisePost.then(function (pl) {
                if (pl.data.result[0] != null) {
                    $scope.btnName = "Modify";

                    $scope.EmpId = pl.data.result[0].EmpId;
                    $scope.EmpName = pl.data.result[0].Employee;
                    $scope.ICHCode = pl.data.result[0].ICHCode;
                    $scope.SAPCode = pl.data.result[0].SAPCode;
                    $scope.DptId = pl.data.result[0].DptId;
                    $scope.DsgId = pl.data.result[0].DsgID;
                    $scope.OMobile = pl.data.result[0].OMobile;
                    $scope.OEmail = pl.data.result[0].Email;
                    $scope.RleId = pl.data.result[0].RleId;
                    $scope.Pwd = pl.data.result[0].Pwd;
                    $scope.Active = (pl.data.result[0].Active == "True" ? "1" : "0");
                    $scope.MultiSite = (pl.data.result[0].MultiSite == "True" ? "1" : "0");
                    $scope.FnSystem = pl.data.result[0].FnSystem;
                    $scope.WorkingAt = pl.data.result[0].WorkingAt == "Admin" ? "1" : "2";
                }
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

            });
        }
    }

    $scope.SetEmployee = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($.trim($scope.EmpName) == "") {
            SetErrorMessage("Ensure Name!");
            $("#txtEmployee").focus();
            return false;
        }
        if ($.trim($scope.ICHCode) == "") {
            SetErrorMessage("Ensure ICH Code!");
            $("#txtICHCode").focus();
            return false;
        }

        if ($.trim($scope.SAPCode) == "") {
            SetErrorMessage("Ensure SAP Code!");
            $("#txtSAPCode").focus();
            return false;
        }

        if ($.trim($scope.DptId) == "0") {
            SetErrorMessage("Ensure Department!");
            $("#ddlDepartment").focus();
            return false;
        }

        if ($.trim($scope.DsgId) == "0") {
            SetErrorMessage("Ensure Designation!");
            $("#ddlDesignation").focus();
            return false;
        }

        if ($.trim($scope.OEmail) == "") {
            SetErrorMessage("Ensure Email!");
            $("#txtEmail").focus();
            return false;
        }
        if ($scope.OEmail != "") {

            var bIsValidError = validateEmail($scope.OEmail);
            if (!bIsValidError) {
                SetErrorMessage("Please enter the valid MailId!");
                $("#txtEmail").focus();
                return false;

            }
        }

        if ($.trim($scope.RleId) == "0") {
            SetErrorMessage("Ensure Role!");
            $("#ddlRole").focus();
            return false;
        }

        if ($.trim($scope.Pwd) == "") {
            SetErrorMessage("Ensure Password!");
            $("#txtPassword").focus();
            return false;
        }
        if ($.trim($scope.WorkingAt) == "0") {
            SetErrorMessage("Ensure Working At!");
            $("#txtPassword").focus();
            return false;
        }
        fnLoadGif();
        var EmployeeModel = {
            EmpId: $scope.EmpId,
            EmpName: $scope.EmpName,
            ICHCode: $scope.ICHCode,
            SAPCode: $scope.SAPCode,
            DptId: $scope.DptId,
            DsgId: $scope.DsgId,
            OMobile: $scope.OMobile,
            OEmail: $scope.OEmail,
            RleId: $scope.RleId,
            Pwd: $scope.Pwd,
            Active: $scope.Active,
            MultiSite: $scope.MultiSite,
            FnSystem: $scope.FnSystem,
            Delflag: "0",
            WorkingAt: $scope.WorkingAt
        };

        var promisePost = CIR_OperationService.postCommonService(SetEmployeeUrl, EmployeeModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.EmployeeGridArray = pl.data.result.employeedetails;
            $scope.EmployeeArrayLength = pl.data.result.employeedetails.length;
            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.btnName = "Save";
                $scope.EmpId = "0";
                $scope.EmpName = "";
                $scope.ICHCode = "";
                $scope.SAPCode = "";
                $scope.DptId = "0";
                $scope.DsgId = "0";
                $scope.OMobile = "";
                $scope.OEmail = "";
                $scope.RleId = "0";
                $scope.Pwd = "";
                $scope.Active = "1";
                $scope.MultiSite = "0";
                $scope.FnSystem = "0";
                $scope.sortType = 'Slno';
                $scope.sortReverse = false;
                $scope.searchEmployee = '';     // set the default search/filter term
                $scope.curPage = 0;
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
            //   paging();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
        return false;
    };

    $scope.EditEmployee = function (row) {
        $scope.UpdateOnly = true;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.btnName = "Modify";
        $scope.EmpId = row.EmpId;
        $scope.EmpName = row.Employee;
        $scope.ICHCode = row.ICHCode;
        $scope.SAPCode = row.SAPCode;
        $scope.DptId = row.DptId;
        $scope.DsgId = row.DsgID;
        $scope.OMobile = row.OMobile;
        $scope.OEmail = row.Email;
        $scope.RleId = row.RleId;
        $scope.Pwd = row.Pwd;
        $scope.Active = (row.Active == "True" ? "1" : "0");
        $scope.MultiSite = (row.MultiSite == "True" ? "1" : "0");
        $scope.FnSystem = row.FnSystem;
        $scope.WorkingAt = row.WorkingAt == "Admin" ? "1" : "2";
    };

    $scope.DeleteEmployee = function (EmpId) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        fnLoadGif();
        var EmployeeModel = {
            EmpId: EmpId,
            EmpName: "",
            ICHCode: "",
            SAPCode: "",
            DptId: "0",
            DsgId: "0",
            OMobile: "",
            OEmail: "",
            RleId: "0",
            Pwd: "",
            Active: "0",
            FnSystem: "0",
            MultiSite: "0",
            Delflag: "1"
        };

        var promisePost = CIR_OperationService.postCommonService(SetEmployeeUrl, EmployeeModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.EmployeeGridArray = pl.data.result.employeedetails;

            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.btnName = "Save";
                $scope.EmpId = "0";
                $scope.EmpName = "";
                $scope.ICHCode = "";
                $scope.SAPCode = "";
                $scope.DptId = "0";
                $scope.DsgId = "0";
                $scope.OMobile = "";
                $scope.OEmail = "";
                $scope.RleId = "0";
                $scope.Pwd = "";
                $scope.Active = "1";
                $scope.MultiSite = "0";
                $scope.FnSystem = "0";
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
            // paging();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.ClearEmployee = function () {
        $scope.UpdateOnly = false;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.btnName = "Save";
        $scope.EmpId = "0";
        $scope.EmpName = "";
        $scope.ICHCode = "";
        $scope.SAPCode = "";
        $scope.DptId = "0";
        $scope.DsgId = "0";
        $scope.OMobile = "";
        $scope.OEmail = "";
        $scope.RleId = "0";
        $scope.Pwd = "";
        $scope.Active = "1";
        $scope.MultiSite = "0";
        $scope.FnSystem = "0";
        $scope.sortType = 'Slno';
        $scope.sortReverse = false;
        $scope.searchEmployee = '';     // set the default search/filter term
        $scope.curPage = 0;
    };

    $scope.FileNoChange = function (keyEvent) {
        $scope.UpdateOnly = false;
        if (keyEvent.which === 13)
            LoadEmployeeExcel($scope.EUNo);
    };

    $scope.UploadEmployeeExcel = function () {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var InputModel = {
            EUId: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetEmployeeExcelUploadUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.EUId = "0";
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                $("#btnSave").removeAttr("disabled");
                $scope.Total = $scope.Message.Total;
                $scope.New = $scope.Message.NewRecords;
                $scope.Modified = $scope.Message.ModifyRecords;
                $scope.Invalid = $scope.Message.InvalidRecords;
                $scope.EmployeeExcelGridArray = pl.data.result.employeeexceldetails;
            }
            else {
                SetErrorMessage($scope.Message.Message);
                $("#btnSave").attr("disabled", "disabled");
                $scope.Total = $scope.Message.Total;
                $scope.New = $scope.Message.NewRecords;
                $scope.Modified = $scope.Message.ModifyRecords;
                $scope.Invalid = $scope.Message.InvalidRecords;
                $scope.EmployeeExcelGridArray = pl.data.result.employeeexceldetails;
                $('#fuEmployee').val("");
            }

            fnRemoveGif();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
        return false;
    };

    $scope.SubmitEmployeeExcel = function () {
        $scope.UpdateOnly = false;
        if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }

        $('#fuEmployee').val("");
        fnLoadGif();
        var InputModel = {
            EUId: "0",
            Remarks: $scope.Remarks
        };

        var promisePost = CIR_OperationService.postCommonService(SetEmployeeExcelSubmitUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadEmployeeExcel($scope.EUNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
        return false;
    };

    $scope.ClearEmployeeExcel = function () {
        LoadEmployeeExcel("0");
        $scope.UpdateOnly = false;
    }

    $scope.PostEmployeeExcel = function () {
        $scope.UpdateOnly = false;
        if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        fnLoadGif();
        var EmployeeExcelModel = {
            FileName: $scope.EFilename,
            Remarks: $scope.Remarks,
            Submit: "0",
            EUId: $scope.EUId,
            RowId: "0",
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetEmployeeExcelUrl, EmployeeExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadEmployeeExcel("0");
                LoadEmployeeGrid();
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
        return false;
    };

    $scope.DeleteEmployeeExcel = function (RowId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var EmployeeExcelModel = {
            FileName: $scope.EFilename,
            Remarks: $scope.Remarks,
            Submit: "0",
            EUId: $scope.EUId,
            RowId: RowId,
            Delflag: RowId
        };

        var promisePost = CIR_OperationService.postCommonService(SetEmployeeExcelUrl, EmployeeExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadEmployeeExcel($scope.EUNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
        return false;
    };

    $scope.DownloadExcel = function () {
        $scope.UpdateOnly = false;
        var _Url = GetDownloadUrl;
        _Url = _Url.replace("DownloadExcelEmp", "");
        fnLoadGif();
        var parameters = {
            Data: JSON.stringify($scope.EmpExcelGridArray),
            SessionId: "Employee"
        };
        var promisePost = CIR_OperationService.postCommonService(_Url + 'FillDataEmp', parameters);
        promisePost.then(function (pl) {
            if (pl.data == "OK") {
                var _downloadUrl = _Url + 'DownloadExcelEmp/' + 'Employee';
                ko.utils.postJson(_downloadUrl);
            } else {
                SetWarningMessage("Unable to process your request, please try again!");
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        if ($scope.EUId == "0") {
            $(".ErrorMsg").css("display", "");
            $(".DelAction").css("display", "none");
        }
        else {
            $(".ErrorMsg").css("display", "none");
            $(".DelAction").css("display", "");
        }

        if ($scope.Posted == "True")
            $(".DelAction").css("display", "none");


    });

    function LoadDepartment() {
        var DepartmentModel = {
            DptId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetdepartmentUrl, DepartmentModel);
        promisePost.then(function (pl) {
            $scope.DepartmentSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
    };

    function LoadDesignation() {
        var DesignationModel = {
            DsgId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetDesignationUrl, DesignationModel);
        promisePost.then(function (pl) {
            $scope.DesignationSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
    };

    function LoadRole() {
        var RoleModel = {
            RleId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetRoleAccessUrl, RoleModel);
        promisePost.then(function (pl) {
            $scope.RoleSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadFunctionalSystem() {
        var CollectionModel = {
            RefId: "10",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.FunctionalSystemArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadEmployeeGrid() {
        $scope.sortType = 'Slno';
        $scope.sortReverse = false;
        $scope.searchEmployee = '';     // set the default search/filter term
        $scope.curPage = 0;
        var EmployeeModel = {
            EmpId: "0",
            View: "1",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, EmployeeModel);
        promisePost.then(function (pl) {
            $scope.EmployeeGridArray = pl.data.result.EmployeeDetail;
            $scope.EmployeeArrayLength = pl.data.result.EmployeeDetail.length;
            $scope.EmpExcelGridArray = pl.data.result.EmployeeExcelDownloadDetails;
            $scope.EmployeeGridArrayFiltered = $scope.EmployeeGridArray;
            //  paging();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
    };

    function LoadEmployeeExcel(EUNo) {

        var EmployeeExcelModel = {
            EUNo: EUNo,
            ViewType: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmployeeExcelUrl, EmployeeExcelModel);
        promisePost.then(function (pl) {

            $scope.EmployeeExcelHeader = pl.data.result.headerdetails;
            $scope.EmployeeExcelGridArray = pl.data.result.employeeexceldetails;
            fnRemoveGif();
            $scope.EUId = $scope.EmployeeExcelHeader.EUId;
            $scope.EFilename = $scope.EmployeeExcelHeader.EFilename;
            $scope.EUNo = $scope.EmployeeExcelHeader.EUNo;
            $scope.Posted = $scope.EmployeeExcelHeader.Posted;
            $scope.PostedBy = $scope.EmployeeExcelHeader.PostedBy;
            $scope.PostedOn = $scope.EmployeeExcelHeader.PostedOn;
            $scope.Remarks = $scope.EmployeeExcelHeader.Remarks;
            $scope.UploadedBy = $scope.EmployeeExcelHeader.UploadedBy;
            $scope.Total = $scope.EmployeeExcelHeader.Total;
            $scope.New = $scope.EmployeeExcelHeader.New;
            $scope.Modified = $scope.EmployeeExcelHeader.Modified;
            $scope.Invalid = $scope.EmployeeExcelHeader.Invalid;
            $("#btnSave").attr("disabled", "disabled");
            $("#btnPost").attr("disabled", "disabled");
            if ($scope.EUId == "0") {
                $("#uploadform").css("display", "");
                $("#txtFileName").css("display", "none");
                $("#btnUpload").removeAttr("disabled");

            }
            else {
                $("#uploadform").css("display", "none");
                $("#txtFileName").css("display", "");
                $("#btnUpload").attr("disabled", "disabled");
                if ($scope.Posted != "True")
                    $("#btnPost").removeAttr("disabled");
            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    // $scope.sortType = 'Employee'; // set the default sort type
    //$scope.sortReverse = false;  // set the default sort order
    $scope.sortType = 'Slno';
    $scope.sortReverse = false;
    $scope.searchEmployee = '';     // set the default search/filter term

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.EmployeeGridArray != undefined)
            return Math.ceil($scope.EmployeeGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchEmployee', function (val) {
        $scope.EmployeeGridArray = $filter('filter')($scope.EmployeeGridArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.EmployeeGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.EmployeeGridArray.length / $scope.pageSize) - 1);
    }

    //$scope.Test = function () {
    //    
    //    paging();
    //}

    //function paging() {
    //    $scope.currentPage = 0;
    //    $scope.range = function () {
    //        var rangeSize = 10;
    //        var ret = [];
    //        var start;

    //        start = $scope.currentPage;
    //        if (start > $scope.pageCount() - rangeSize) {
    //            start = $scope.pageCount() - rangeSize + 1;
    //        }

    //        for (var i = start; i < start + rangeSize; i++) {
    //            ret.push(i);
    //        }
    //        return ret;
    //    };

    //    $scope.prevPage = function () {
    //        if ($scope.currentPage > 0) {
    //            $scope.currentPage--;
    //        }
    //    };

    //    $scope.prevPageDisabled = function () {
    //        return $scope.currentPage === 0 ? "disabled" : "";
    //    };

    //    $scope.pageCount = function () {
    //        return Math.ceil($scope.EmployeeGridArray.length / $scope.itemsPerPage) - 1;
    //    };

    //    $scope.nextPage = function () {
    //        if ($scope.currentPage < $scope.pageCount()) {
    //            $scope.currentPage++;
    //        }
    //    };

    //    $scope.nextPageDisabled = function () {
    //        return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    //    };

    //    $scope.setPage = function (n) {
    //        $scope.currentPage = n;
    //    };

    //    $scope.FirstPage = function () {
    //        $scope.currentPage = 0;
    //    };

    //    $scope.LastPage = function () {
    //        $scope.currentPage = $scope.pageCount();
    //    };
    //};

    //$scope.EmployeeGridArray = [];
    //$scope.itemsPerPage = 20; // Per page items

});

app.controller('Collection_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.SlNo = "1";
    $scope.MCId = "0";
    $scope.Name = "";
    $scope.Desc = "";
    $scope.SubRefId = "0";
    $scope.Active = "1";
    LoadMasterName("0");
    $scope.RefId = "0";
    LoadCollectionGrid("0");

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
            pageName: "Master Collection"
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

    $scope.SetMasterCollection = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($.trim($scope.Name) == "") {
            SetErrorMessage("Ensure Name!");
            $("#txtMasterName").focus();
            return false;
        }
        if ($.trim($scope.Desc) == "") {
            SetErrorMessage("Ensure Description!");
            $("#txtMasterDesc").focus();
            return false;
        }

        var parentRefId = "";
        if ($scope.RefId == "2")
            parentRefId = $scope.SubRefId;
        else if ($scope.RefId == "3")
            parentRefId = $scope.SubRefId;
        else if ($scope.RefId == "4")
            parentRefId = $scope.SubRefId;
        else if ($scope.RefId == "22")
            parentRefId = $scope.SubRefId;
        else
            parentRefId = $scope.RefId;

        var referenceId = "";
        if ($scope.SubRefId == "0") {
            referenceId = $scope.RefId;
        }
        else
            referenceId = $scope.RefId != $scope.SubRefId ? $scope.SubRefId : $scope.RefId;


        fnLoadGif();
        var CollectionModel = {
            MCId: $scope.MCId,
            RefId: parentRefId == "" ? $scope.RefId : parentRefId,
            SubRefId: parentRefId != "" ? $scope.RefId : parentRefId,
            Name: $scope.Name,
            Desc: $scope.Desc,
            Active: $scope.Active,
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.CollectionGridArray = pl.data.result.collectiondetails;
            $scope.SlNo = $scope.CollectionGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.sortType = 'SlNo'; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.searchMasterCollection = '';
                $scope.curPage = 0;
                if ($scope.RefId == "0")
                    LoadMasterName("0");
                $scope.MCId = "0";
                $scope.Name = "";
                $scope.Desc = "";
                $scope.Active = "1";
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
        return false;
    };

    $scope.GetMasterCollection = function (item) {
        $scope.UpdateOnly = false;
        $scope.MCId = "0";
        $scope.Name = "";
        $scope.Desc = "";
        $scope.Active = "1";

        LoadCollectionGrid($scope.RefId);
        var parentRefId = "";
        if ($scope.RefId == "2")
            parentRefId = 1;

        if ($scope.RefId == "3")
            parentRefId = 2;
        if ($scope.RefId == "4")
            parentRefId = 3;
        if ($scope.RefId == "22")
            parentRefId = 5;
        if (parentRefId != "") {
            $("#ddlSubMaster").css("display", "");
            $("#spnSubMaster").css("display", "");
            CollectionGridArray = [];
            LoadCollectionGrid($scope.RefId);
            LoadSubMasterName(parentRefId);
        }
        else {
            $("#ddlSubMaster").css("display", "none");
            $("#spnSubMaster").css("display", "none");
        }
    };

    $scope.Clear = function () {
        $scope.RefId = "0";
        $scope.SubRefId = "0";
        $scope.GetMasterCollection(0);
        $scope.sortType = 'SlNo'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchMasterCollection = '';
        $scope.curPage = 0;

    }

    $scope.GetSubMasterCollection = function (item) {
        $scope.UpdateOnly = false;
        $scope.MCId = "0";
        $scope.Name = "";
        $scope.Desc = "";
        $scope.Active = "1";
        LoadCollectionGrid($scope.SubRefId == "" ? $scope.RefId : $scope.SubRefId);
    };

    $scope.EditMasterCollection = function (row) {
        $scope.UpdateOnly = true;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.SlNo = row.SlNo;
        $scope.MCId = row.MCId;
        $scope.Name = row.Name;
        $scope.Desc = row.Desc;
        $scope.Active = (row.Active == "True" ? "1" : "0");
        //$scope.SubRefId = row.SubRefId;
    };

    $scope.DeleteMasterCollection = function (row) {
        $scope.UpdateOnly = false;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        fnLoadGif();
        var parentRefId = "";
        if ($scope.RefId == "2")
            parentRefId = $scope.SubRefId;
        else if ($scope.RefId == "3")
            parentRefId = $scope.SubRefId;
        else if ($scope.RefId == "4")
            parentRefId = $scope.SubRefId;
        else if ($scope.RefId == "22")
            parentRefId = $scope.SubRefId;
        else
            parentRefId = $scope.RefId;

        var referenceId = "";
        if ($scope.SubRefId == "0") {
            referenceId = $scope.RefId;
        }
        else
            referenceId = $scope.RefId != $scope.SubRefId ? $scope.SubRefId : $scope.RefId;

        var CollectionModel = {
            MCId: row.MCId,
            RefId: parentRefId == "" ? $scope.RefId : parentRefId,
            SubRefId: parentRefId != "" ? $scope.RefId : parentRefId,
            Name: "",
            Desc: "",
            Active: "0",
            Delflag: "1"
        };

        var promisePost = CIR_OperationService.postCommonService(SetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.CollectionGridArray = pl.data.result.collectiondetails;
            $scope.SlNo = $scope.CollectionGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                if ($scope.RefId == "0")
                    LoadMasterName("0");
                $scope.MCId = "0";
                $scope.Name = "";
                $scope.Desc = "";
                $scope.Active = "1";
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    function LoadMasterName(refId) {
        fnLoadGif();
        var CollectionModel = {
            RefId: refId,
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            if (refId == "0")
                $scope.CollectionSelect = pl.data.result;
            else
                $scope.SubCollectionSelect = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadSubMasterName(refId) {
        fnLoadGif();
        var CollectionModel = {
            RefId: refId,
            View: "2"
        };
        var promisePost = CIR_OperationService.postCommonService(GetSubMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {

            console.log(pl.data.result);
            $scope.SubCollectionSelect = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadCollectionGrid(refId) {
        fnLoadGif();
        $scope.sortType = 'SlNo'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchMasterCollection = '';
        $scope.curPage = 0;
        var CollectionModel = {
            RefId: refId,
            View: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.CollectionGridArray = pl.data.result;
            $scope.SlNo = $scope.CollectionGridArray.length + 1;
            $scope.CollectionGridArrayFiltered = $scope.CollectionGridArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchMasterCollection = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.CollectionGridArray != undefined)
            return Math.ceil($scope.CollectionGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchMasterCollection', function (val) {
        $scope.CollectionGridArray = $filter('filter')($scope.CollectionGridArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.CollectionGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.CollectionGridArray.length / $scope.pageSize) - 1);
    }

});

app.controller('RoleAccess_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.RoleId = "0"
    $scope.PgeId = "0"
    $scope.SlNo = "1";
    $scope.RleId = "0";
    $scope.Name = "";
    $scope.Active = "1";

    LoadRoleGrid();
    LoadRoleSelect();
    LoadModuleSelect();

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
            pageName: "Role & Role Access"
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

    $scope.SetRole = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($.trim($scope.Name) == "") {
            SetErrorMessage("Ensure Role Name!");
            $("#txtRole").focus();
            return false;
        }
        fnLoadGif();
        var RoleModel = {
            RleId: $scope.RleId,
            Name: $scope.Name,
            Active: $scope.Active,
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetRoleUrl, RoleModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.RoleGridArray = pl.data.result.roledetails;
            $scope.SlNo = $scope.RoleGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.RleId = "0";
                $scope.Name = "";
                $scope.Active = "1";

                LoadRoleSelect();
                $scope.sortType = 'Slno'; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.searchRole = '';
                $scope.curPage = 0;
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            fnRemoveGif();
        });
        return false;
    };

    $scope.GetRole = function () {
        $scope.RleId = "0";
        $scope.Name = "";
        $scope.Active = "1";
        LoadRoleGrid();
        $scope.UpdateOnly = false;
    };

    $scope.EditRole = function (row) {
        $scope.UpdateOnly = true;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $scope.SlNo = row.Slno;
        $scope.RleId = row.RoleId;
        $scope.Name = row.Role;
        $scope.Active = (row.Active == "True" ? "1" : "0");
    };

    $scope.DeleteRole = function (RleId) {
        $scope.UpdateOnly = false;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        fnLoadGif();
        var RoleModel = {
            RleId: RleId,
            Name: "",
            Active: "1",
            Delflag: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(SetRoleUrl, RoleModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.RoleGridArray = pl.data.result.roledetails;
            $scope.SlNo = $scope.RoleGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.RleId = "0";
                $scope.Name = "";
                $scope.Active = "1";

                LoadRoleSelect();
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            fnRemoveGif();
        });
    };

    $scope.GetRoleAccess = function () {
        LoadRoleAccessGrid();
        $scope.UpdateOnly = false;
    };

    $scope.SetRoleAccess = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        var Access = "";
        var row;
        for (var i = 0; i < $scope.RoleAccessGridArray.length; i++) {
            Access += "<data>"
            row = $scope.RoleAccessGridArray[i]
            Access += "<RAId>" + row.RAId + "</RAId>";
            Access += "<PGEId>" + row.PgeID + "</PGEId>";
            Access += "<Access>" + row.View + "</Access>";
            Access += "<Add>" + row.Add + "</Add>";
            Access += "<Modify>" + row.Update + "</Modify>";
            Access += "<Delete>" + row.Delete + "</Delete>";
            Access += "<Download>" + row.Download + "</Download>";
            Access += "</data>";
        }

        if (Access == "")
            return false;
        fnLoadGif();
        var RoleAccessModel = {
            Rleid: $scope.RoleId,
            Access: Access
        };

        var promisePost = CIR_OperationService.postCommonService(SetRoleAccessUrl, RoleAccessModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result;
            if ($scope.Message.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                LoadRoleAccessGrid();
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in saving the role access details  : " + err);
            fnRemoveGif();
        });
        return false;
    };

    function LoadRoleGrid() {
        $scope.sortType = 'Slno'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchRole = '';
        $scope.curPage = 0;
        fnLoadGif();
        var RoleModel = {
            RleId: "0",
            View: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetRoleAcUrl, RoleModel);
        promisePost.then(function (pl) {
            $scope.RoleGridArray = pl.data.result;
            $scope.SlNo = $scope.RoleGridArray.length + 1;
            $scope.RoleGridArrayFiltered = $scope.RoleGridArray;
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            fnRemoveGif();
        });
    };

    function LoadRoleSelect() {
        fnLoadGif();
        var RoleModel = {
            RleId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetRoleAcUrl, RoleModel);
        promisePost.then(function (pl) {
            $scope.RoleId = pl.data.result[0].RoleId;
            $scope.RoleSelect = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            fnRemoveGif();
        });
    };

    function LoadModuleSelect() {
        fnLoadGif();
        var PageModel = {
            PgeId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetPageUrl, PageModel);
        promisePost.then(function (pl) {
            $scope.PgeId = pl.data.result[0].MdlId;
            $scope.ModuleSelect = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            fnRemoveGif();
        });
    };

    function LoadRoleAccessGrid() {
        if ($scope.RoleId != "0" && $scope.PgeId != "0") {
            fnLoadGif();
            var RoleAccessModel = {
                Rleid: $scope.RoleId,
                PgeId: $scope.PgeId
            };
            var promisePost = CIR_OperationService.postCommonService(GetRoleUrl, RoleAccessModel);
            promisePost.then(function (pl) {
                $scope.RoleAccessGridArray = pl.data.result;
                fnRemoveGif();
            }, function (err) {
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                fnRemoveGif();
            });
        }
    };

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //you also get the actual event object
        //do stuff, execute functions -- whatever...
        LoadRoleAccessGrid();
    });

    $scope.sortType = 'Slno'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchRole = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.RoleGridArray != undefined)
            return Math.ceil($scope.RoleGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchRole', function (val) {
        $scope.RoleGridArray = $filter('filter')($scope.RoleGridArrayFiltered, val);
    });

});

app.controller('Turbine_OperController', function ($scope, CIR_OperationService, $filter, $interval) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.btnName = "Save";
    $scope.TbnId = "0";
    $scope.TurbineId = "";
    $scope.CmrGroupId = "0";
    $scope.CmrId = "0";
    $scope.Site = "0";
    $scope.FnLoc = "";
    $scope.Capacity = "";
    $scope.THeight = "0";
    $scope.Blade = "0";
    $scope.GRId = "0";
    $scope.GRSlno = "";
    $scope.GBId = "0";
    $scope.DOC = "";
    $scope.Temp = "0";
    $scope.Dust = "0";
    $scope.GBSlno = "";
    $scope.Active = "1";
    $scope.Corrosion = "0";
    $scope.SWVersion = "0";
    $scope.HWVersion = "0";
    $scope.WTGType = "0";
    $scope.ScadaName = "";
    $scope.Location = "";

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
            pageName: "Turbine Master"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.AddOrUpdate = $scope.Add ? true : $scope.Update ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    fnLoadGif();
    LoadCustomer();
    LoadSite();
    LoadTowerHeight();
    LoadBlade();
    LoadGenerator();
    LoadGearBox();
    LoadTemprature();
    LoadDust();
    LoadTurbineGrid();
    LoadCorrosion();
    LoadSWVersion();
    LoadHWVersion();
    LoadWTGType();
    LoadTurbineExcel("0");
    LoadExcelDownload();

    $scope.SetTurbine = function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if ($.trim($scope.TurbineId) == "") {
            SetErrorMessage("Ensure Turbine Name!");
            $("#txtTurbineName").focus();
            return false;
        }

        if ($.trim($scope.CmrId) == "0") {
            SetErrorMessage("Ensure Customer!");
            $("#ddlCustomer").focus();
            return false;
        }

        if ($.trim($scope.DOC) == "") {
            SetErrorMessage("Ensure DOC!");
            $("#txtDOC").focus();
            return false;
        }

        if ($.trim($scope.Site) == "0") {
            SetErrorMessage("Ensure Site!");
            $("#ddlSite").focus();
            return false;
        }

        if ($.trim($scope.FnLoc) == "") {
            SetErrorMessage("Ensure Function Location!");
            $("#txtFunctionLocation").focus();
            return false;
        }

        if ($.trim($scope.Capacity) == "") {
            SetErrorMessage("Ensure Capacity!");
            $("#txtCapacity").focus();
            return false;
        }

        if ($.trim($scope.THeight) == "0") {
            SetErrorMessage("Ensure Tower Height!");
            $("#ddlTowerHeight").focus();
            return false;
        }

        if ($.trim($scope.Blade) == "0") {
            SetErrorMessage("Ensure Blade!");
            $("#ddlBlade").focus();
            return false;
        }

        if ($.trim($scope.GRId) == "0") {
            SetErrorMessage("Ensure Generator!");
            $("#ddlGenerator").focus();
            return false;
        }

        if ($.trim($scope.GRSlno) == "") {
            SetErrorMessage("Ensure Generator SlNo!");
            $("#txtGeneratorSlNo").focus();
            return false;
        }

        if ($.trim($scope.GBId) == "0") {
            SetErrorMessage("Ensure Gear Box!");
            $("#ddlGearBox").focus();
            return false;
        }

        if ($.trim($scope.GBSlno) == "") {
            SetErrorMessage("Ensure Gear Box SlNo!");
            $("#txtGearBoxSlNo").focus();
            return false;
        }

        if ($.trim($scope.Temp) == "0") {
            SetErrorMessage("Ensure Temprature!");
            $("#ddlTemprature").focus();
            return false;
        }

        if ($.trim($scope.Dust) == "0") {
            SetErrorMessage("Ensure Dust!");
            $("#ddlDust").focus();
            return false;
        }

        if ($.trim($scope.Corrosion) == "0") {
            SetErrorMessage("Ensure Corrosion!");
            $("#ddlCorrosion").focus();
            return false;
        }
        if ($.trim($scope.SWVersion) == "0") {
            SetErrorMessage("Ensure Software version!");
            $("#ddlSWVersion").focus();
            return false;
        }

        if ($.trim($scope.HWVersion) == "0") {
            SetErrorMessage("Ensure Hardware version!");
            $("#ddlHWVersion").focus();
            return false;
        }
        if ($.trim($scope.WTGType) == "0") {
            SetErrorMessage("Ensure WTG Type!");
            $("#ddlWTGType").focus();
            return false;
        }
        fnLoadGif();
        var TurbineModel = {
            TbnId: $scope.TbnId,
            TurbineId: $scope.TurbineId,
            CmrGroupId: $scope.CmrGroupId,
            CmrId: $scope.CmrId,
            Site: $scope.Site,
            FnLoc: $scope.FnLoc,
            Capacity: $scope.Capacity,
            THeight: $scope.THeight,
            Blade: $scope.Blade,
            GRId: $scope.GRId,
            GRSlno: $scope.GRSlno,
            GBId: $scope.GBId,
            GBSlno: $scope.GBSlno,
            DOC: $scope.DOC,
            Temp: $scope.Temp,
            Dust: $scope.Dust,
            Active: $scope.Active,
            Corrosion: $scope.Corrosion,
            WTGType: $scope.WTGType,
            SWVersion: $scope.SWVersion,
            HWVersion: $scope.HWVersion,
            ScadaName: $scope.ScadaName,
            Location: $scope.Location,
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbineUrl, TurbineModel);
        promisePost.then(function (pl) {
            $scope.sortType = 'Slno';
            $scope.sortReverse = false;
            $scope.searchTurbine = '';
            $scope.curPage = 0;
            $scope.Message = pl.data.result.message;
            $scope.TurbineGridArray = pl.data.result.turbinedetails;
            $scope.TurbineArrayLength = pl.data.result.turbinedetails.length;
            $scope.TurbineGridArrayFiltered = $scope.TurbineGridArray;
            if ($scope.Message.Clear == "True") {
                $scope.sortType = 'Slno';
                $scope.sortReverse = false;
                $scope.searchTurbine = '';
                $scope.curPage = 0;
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.btnName = "Save";
                $scope.TbnId = "0";
                $scope.TurbineId = "";
                $scope.CmrId = "0";
                $scope.Site = "0";
                $scope.FnLoc = "";
                $scope.Capacity = "";
                $scope.THeight = "0";
                $scope.Blade = "0";
                $scope.GRId = "0";
                $scope.GRSlno = "";
                $scope.GBId = "0";
                $scope.GBSlno = "";
                $scope.DOC = "";
                $scope.Temp = "0";
                $scope.Dust = "0";
                $scope.Active = "1";
                $scope.Corrosion = "0";
                $scope.WTGType = "0";
                $scope.HWVersion = "0";
                $scope.HWVersion = "0";
                $scope.ScadaName = "";
                $scope.Location = "";
                $scope.CmrGroupId = "0";
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.EditTurbine = function (row) {
        $scope.UpdateOnly = true;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        //  LoadCorrosion();
        $scope.btnName = "Modify";
        $scope.TbnId = row.TbnId;
        $scope.TurbineId = row.TurbineId;
        $scope.CmrGroupId = row.CmrGroupId;
        $scope.CmrId = row.CmrId;
        $scope.Site = row.TSite;
        $scope.FnLoc = row.FnLoc;
        $scope.Capacity = row.Capacity;
        $scope.THeight = row.THeight;
        $scope.Blade = row.Blade;
        $scope.GRId = row.GRId;
        $scope.GRSlno = row.GRSlno;
        $scope.GBId = row.GBId;
        $scope.GBSlno = row.GBSlno;
        $scope.DOC = row.DOC;
        $scope.Temp = row.Temp;
        $scope.Dust = row.Dust;
        $scope.Corrosion = row.CorrosionId;
        $scope.HWVersion = row.HwVersionID;
        $scope.SWVersion = row.SwVersionId;
        $scope.WTGType = row.WTGType;
        $scope.Location = row.Location;
        $scope.ScadaName = row.ScadaName;

        $scope.Active = (row.Active == "True" ? "1" : "0");
    };

    $scope.DeleteTurbine = function (TbnId) {
        $scope.UpdateOnly = false;
        $("html, body").animate({ scrollTop: 0 }, "slow");
        fnLoadGif();
        var TurbineModel = {
            TbnId: TbnId,
            TurbineId: "",
            CmrGroupId: "0",
            CmrId: "0",
            Site: "0",
            FnLoc: "",
            Capacity: "",
            THeight: "0",
            Blade: "0",
            GRId: "0",
            GRSlno: "",
            GBId: "0",
            GBSlno: "",
            DOC: "",
            Temp: "0",
            Dust: "0",
            Corrosion: "0",
            Active: "1",
            WTGType: "0",
            HWVersion: "0",
            SWVersion: "0",
            ScadaName: "",
            Location: "",
            Delflag: "1"
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbineUrl, TurbineModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.TurbineGridArray = pl.data.result.turbinedetails;

            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.btnName = "Save";
                $scope.TbnId = "0";
                $scope.TurbineId = "";
                $scope.CmrId = "0";
                $scope.Site = "0";
                $scope.FnLoc = "";
                $scope.Capacity = "";
                $scope.THeight = "0";
                $scope.Blade = "0";
                $scope.GRId = "0";
                $scope.GRSlno = "";
                $scope.GBId = "0";
                $scope.GBSlno = "";
                $scope.DOC = "";
                $scope.Temp = "0";
                $scope.Dust = "0";
                $scope.Active = "1";
                $scope.Corrosion = "0";
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
            // paging();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.ClearTurbine = function () {
        $scope.UpdateOnly = false;
        $scope.btnName = "Save";
        $scope.TbnId = "0";
        $scope.TurbineId = "";
        $scope.CmrGroupId = "0";
        $scope.CmrId = "0";
        $scope.Site = "0";
        $scope.FnLoc = "";
        $scope.Capacity = "";
        $scope.THeight = "0";
        $scope.Blade = "0";
        $scope.GRId = "0";
        $scope.GRSlno = "";
        $scope.GBId = "0";
        $scope.GBSlno = "";
        $scope.DOC = "";
        $scope.Temp = "0";
        $scope.Dust = "0";
        $scope.Active = "1";
        $scope.Corrosion = "0";
        $scope.WTGType = "0";
        $scope.HWVersion = "0";
        $scope.SWVersion = "0";
        $scope.sortType = 'Slno';
        $scope.sortReverse = false;
        $scope.searchTurbine = '';
        $scope.curPage = 0;
        $scope.Location = "";
        $scope.ScadaName = "";
        // LoadCorrosion();
    };

    $scope.FileNoChange = function (keyEvent) {
        $scope.UpdateOnly = false;
        if (keyEvent.which === 13)
            LoadTurbineExcel($scope.TUNo);
    };

    $scope.UploadTurbineExcel = function () {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var InputModel = {
            TUId: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbineExcelUploadUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.TUId = "0";
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                $("#btnSave").removeAttr("disabled");
                $scope.Total = $scope.Message.Total;
                $scope.New = $scope.Message.NewRecords;
                $scope.Modified = $scope.Message.ModifyRecords;
                $scope.Invalid = $scope.Message.InvalidRecords;
                $scope.TurbineExcelGridArray = pl.data.result.turbineexceldetails;
            }
            else {
                SetErrorMessage($scope.Message.Message);
                $("#btnSave").attr("disabled", "disabled");
                $scope.Total = $scope.Message.Total;
                $scope.New = $scope.Message.NewRecords;
                $scope.Modified = $scope.Message.ModifyRecords;
                $scope.Invalid = $scope.Message.InvalidRecords;
                $scope.TurbineExcelGridArray = pl.data.result.turbineexceldetails;

            }

            fnRemoveGif();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.SubmitTurbineExcel = function () {
        $scope.UpdateOnly = false;
        if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        fnLoadGif();
        var InputModel = {
            TUId: "0",
            Remarks: $scope.Remarks
        };

        var promisePost = CIR_OperationService.postCommonService(TurbineExcelSubmitUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadTurbineExcel($scope.TUNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.ClearTurbineExcel = function () {
        $scope.UpdateOnly = false;
        LoadTurbineExcel("0");
    }

    $scope.PostTurbineExcel = function () {
        $scope.UpdateOnly = false;
        if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        fnLoadGif();
        $('#fuTurbine').val("");
        var TurbineExcelModel = {
            FileName: $scope.EFilename,
            Remarks: $scope.Remarks,
            Submit: "0",
            TUId: $scope.TUId,
            RowId: "0",
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbineExcelUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadTurbineExcel("0");
                LoadTurbineGrid();
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.DeleteTurbineExcel = function (RowId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var TurbineExcelModel = {
            FileName: $scope.EFilename,
            Remarks: $scope.Remarks,
            Submit: "0",
            TUId: $scope.TUId,
            RowId: RowId,
            Delflag: RowId
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbineExcelUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadTurbineExcel($scope.TUNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        if ($scope.TUId == "0") {
            $(".ErrorMsg").css("display", "");
            $(".DelAction").css("display", "none");
        }
        else {
            $(".ErrorMsg").css("display", "none");
            $(".DelAction").css("display", "");
        }

        if ($scope.Posted == "True")
            $(".DelAction").css("display", "none");
    });

    function LoadCustomer() {
        var CollectionModel = {
            RefId: "20",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.CustomerSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadSite() {
        var CollectionModel = {
            RefId: "4",
            View: "2"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionSpecificationUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.SiteSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadTowerHeight() {
        var CollectionModel = {
            RefId: "16",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.TowerHeightSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadBlade() {
        var CollectionModel = {
            RefId: "14",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.BladeSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadGenerator() {
        var CollectionModel = {
            RefId: "11",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.GeneratorSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadGearBox() {
        var CollectionModel = {
            RefId: "12",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.GearBoxSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadTemprature() {
        var CollectionModel = {
            RefId: "6",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.TempratureSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadSWVersion() {
        var CollectionModel = {
            RefId: "1368",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.SWVersionSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadHWVersion() {
        var CollectionModel = {
            RefId: "1369",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.HWVersionSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadWTGType() {
        var CollectionModel = {
            RefId: "5",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.WTGTypeSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadDust() {
        var CollectionModel = {
            RefId: "18",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.DustSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadCorrosion() {
        var CollectionModel = {
            RefId: "21",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.CorrosionArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadTurbineGrid() {
        $scope.sortType = 'Slno';
        $scope.sortReverse = false;
        $scope.searchTurbine = '';
        $scope.curPage = 0;
        fnLoadGif();
        var TurbineModel = {
            Site: "0",
            View: "1",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
        promisePost.then(function (pl) {
            debugger;
            $scope.TurbineGridArray = pl.data.result.TurbineDetail;
            $scope.TurbineArrayLength = pl.data.result.TurbineDetail.length;
            $scope.TurbineGridArrayFiltered = $scope.TurbineGridArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadExcelDownload() {
        var TurbineModel = {
            Site: "0",
            View: "1",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetExcelDownloadUrl, TurbineModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.TurbineExcelDownload = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.DownloadExcel = function () {
        $scope.UpdateOnly = false;
        var _Url = GetDownloadUrl;
        _Url = _Url.replace("DownloadExcel", "");
        fnLoadGif();
        var parameters = {
            Data: JSON.stringify($scope.TurbineExcelDownload),
            SessionId: "TurbineMaster"
        };
        var promisePost = CIR_OperationService.postCommonService(_Url + 'FillData', parameters);
        promisePost.then(function (pl) {
            if (pl.data == "OK") {
                var _downloadUrl = _Url + 'DownloadExcel/' + 'TurbineMaster';
                ko.utils.postJson(_downloadUrl);
            } else {
                SetWarningMessage("Unable to process your request, please try again!");
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadTurbineExcel(TUNo) {
        $('#fuTurbine').val("");

        var TurbineExcelModel = {
            TUNo: TUNo,
            ViewType: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetTurbineExcelUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.TurbineExcelHeader = pl.data.result.headerdetails;
            $scope.TurbineExcelGridArray = pl.data.result.turbineexceldetails;

            $scope.TUId = $scope.TurbineExcelHeader.TUId;
            $scope.TFilename = $scope.TurbineExcelHeader.TFilename;
            $scope.TUNo = $scope.TurbineExcelHeader.TUNo;
            $scope.Posted = $scope.TurbineExcelHeader.Posted;
            $scope.PostedBy = $scope.TurbineExcelHeader.PostedBy;
            $scope.PostedOn = $scope.TurbineExcelHeader.PostedOn;
            $scope.Remarks = $scope.TurbineExcelHeader.Remarks;
            $scope.UploadedBy = $scope.TurbineExcelHeader.UploadedBy;
            $scope.Total = $scope.TurbineExcelHeader.Total;
            $scope.New = $scope.TurbineExcelHeader.New;
            $scope.Modified = $scope.TurbineExcelHeader.Modified;
            $scope.Invalid = $scope.TurbineExcelHeader.Invalid;
            $("#btnSave").attr("disabled", "disabled");
            $("#btnPost").attr("disabled", "disabled");
            if ($scope.TUId == "0") {
                $("#uploadform").css("display", "");
                $("#txtFileName").css("display", "none");
                $("#btnUpload").removeAttr("disabled");

            }
            else {
                $("#uploadform").css("display", "none");
                $("#txtFileName").css("display", "");
                $("#btnUpload").attr("disabled", "disabled");
                if ($scope.Posted != "True")
                    $("#btnPost").removeAttr("disabled");
            }

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.sortType = 'Slno';
    $scope.sortReverse = false;
    $scope.searchTurbine = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.TurbineGridArray != undefined)
            return Math.ceil($scope.TurbineGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchTurbine', function (val) {
        $scope.TurbineGridArray = $filter('filter')($scope.TurbineGridArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.TurbineGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.TurbineGridArray.length / $scope.pageSize) - 1);
    }

});

app.controller('Manufacturer_OperController', function ($scope, CIR_OperationService) {

    $scope.SlNo = "1";
    $scope.MfrId = "0";
    $scope.Name = "";
    $scope.Desc = "";
    $scope.Active = "1";
    $scope.MType = "0";

    LoadManufacturerType();
    LoadManufacturersGrid();

    $scope.SetManufacturers = function () {
        if ($.trim($scope.Name) == "") {
            SetErrorMessage("Ensure Name!");
            $("#txtManufacturerName").focus();
            return false;
        }
        if ($.trim($scope.Desc) == "") {
            SetErrorMessage("Ensure Description!");
            $("#txtManufacturerDesc").focus();
            return false;
        }
        var ManufacturerModel = {
            MfrId: $scope.MfrId,
            MType: $scope.MType,
            Name: $scope.Name,
            Desc: $scope.Desc,
            Active: $scope.Active,
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetManufacturersUrl, ManufacturerModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.ManufacturersGridArray = pl.data.result.manufacturerdetails;
            $scope.SlNo = $scope.ManufacturersGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                if ($scope.MType == "0")
                    LoadManufacturerType();
                $scope.MfrId = "0";
                $scope.Name = "";
                $scope.Desc = "";
                $scope.Active = "1";
            }
            else
                SetErrorMessage($scope.Message.Msg);

        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in saving the manufacturers details : " + err);
        });
        return false;
    };

    $scope.GetManufacturers = function () {
        $scope.MfrId = "0";
        $scope.Name = "";
        $scope.Desc = "";
        $scope.Active = "1";
        LoadManufacturersGrid();
    };

    $scope.EditManufacturers = function (Index) {
        var row = $scope.ManufacturersGridArray[Index]
        $scope.SlNo = row.SlNo;
        $scope.MfrId = row.MfrId;
        $scope.Name = row.Manufacturer;
        $scope.Desc = row.Desc;
        $scope.Active = (row.Active == "True" ? "1" : "0");
    };

    $scope.DeleteManufacturers = function (MfrId) {

        var ManufacturerModel = {
            MfrId: MfrId,
            MType: $scope.MType,
            Name: "",
            Desc: "",
            Active: "0",
            Delflag: "1"
        };

        var promisePost = CIR_OperationService.postCommonService(SetManufacturersUrl, ManufacturerModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            $scope.ManufacturersGridArray = pl.data.result.manufacturerdetails;
            $scope.SlNo = $scope.ManufacturersGridArray.length + 1;

            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                if ($scope.MType == "0")
                    LoadManufacturerType();
                $scope.MfrId = "0";
                $scope.Name = "";
                $scope.Desc = "";
                $scope.Active = "1";
            }
            else
                SetErrorMessage($scope.Message.Msg);

        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in deleting the manufactures details: " + err);
        });
        return false;
    };

    function LoadManufacturerType() {

        var ManufacturerModel = {
            MType: "0",
            Text: "",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetManufacturersUrl, ManufacturerModel);
        promisePost.then(function (pl) {
            $scope.ManufacturersSelect = pl.data.result;
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the manufacture type details  : " + err);
        });
    };

    function LoadManufacturersGrid() {

        var ManufacturerModel = {
            MType: $scope.MType,
            Text: "",
            View: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetManufacturersUrl, ManufacturerModel);
        promisePost.then(function (pl) {
            $scope.ManufacturersGridArray = pl.data.result;
            $scope.SlNo = $scope.ManufacturersGridArray.length + 1;
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the manufacture grid details  : " + err);
        });
    };

});

app.controller('TurbineVersionUpdate_OperController', function ($scope, CIR_OperationService, $filter, $interval) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.new_account = true;
    $scope.btnName = "Save";
    $scope.TStatus = "";
    $scope.PostFilename2 = $scope.PostFilename = "0";
    $scope.TUId = $scope.AssignTo = $scope.Status = $scope.AssignTo2 = $scope.Status2 = $scope.AssignTo3 = $scope.Status3 = "0";
    $scope.InstallationDate = "";
    $scope.Identify = "0";

    LoadTurbineVUExcel("0");
    //  $scope.SWVersion = "0";
    //  $scope.HWVersion = "0";
    $scope.TurbineExcelGridArray = "";

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
            pageName: "Turbine Version Update"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.AddOrUpdate = $scope.Add ? true : $scope.Update ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;

            IsTabAvailable();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    function IsTabAvailable() {

        $("#responsive-tabs-wrapper").ready(function () {
            if ($scope.Add) {
                $('#tablist1-tab1').addClass('responsive-tabs__list__item responsive-tabs__list__item--active');
                $('#tablist1-panel1').addClass('responsive-tabs__panel responsive-tabs__panel--active responsive-tabs__panel--closed-accordion-only');

            }
            else {
                $('#tablist1-tab1').css('display', 'none');
            }
            if ($scope.Update) {
                $('#tablist1-tab2').addClass('responsive-tabs__list__item responsive-tabs__list__item--active');
                if (!$scope.Add) $('#tablist1-panel2').addClass('responsive-tabs__panel responsive-tabs__panel--active responsive-tabs__panel--closed-accordion-only');
            }
            else {
                $('#tablist1-tab2').css('display', 'none');
            }
            if ($scope.Download) {
                $('#tablist1-tab3').addClass('responsive-tabs__list__item responsive-tabs__list__item--active');
                if (!$scope.Add && !$scope.Update) $('#tablist1-panel3').addClass('responsive-tabs__panel responsive-tabs__panel--active responsive-tabs__panel--closed-accordion-only');
            }
            else {
                $('#tablist1-tab3').css('display', 'none');
            }
        });
    }

    fnRemoveGif();
    LoadSWVersion();
    LoadHWVersion();
    LoadSub2FileName();
    LoadPostFileName();
    LoadStatus();

    function LoadSWVersion() {
        var CollectionModel = {
            RefId: "1368",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.SWVersionSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadHWVersion() {
        var CollectionModel = {
            RefId: "1369",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.HWVersionSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadSub2FileName() {
        var TurbineExcelModel = {
            TUNo: "0",
            ViewType: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(LoadFileNameUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.PostFilenameSelect = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            //  $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadPostFileName() {

        var TurbineExcelModel = {
            TUNo: "0",
            ViewType: "5"
        };
        var promisePost = CIR_OperationService.postCommonService(LoadFileNameUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.PostFilenameSelect2 = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            //  $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadStatus() {
        var StatusModel = {
            StsId: "0",
            view: "1"
        };

        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.StatusArray = pl.data.result.StatusModels;
            $scope.StatusArray2 = pl.data.result.StatusModels;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.LoadIsAutoAssignOrNot = function () {

        fnLoadGif();
        //var StatusModel = {
        //    Id: "0",
        //    StsId: $scope.Status,
        //    IDType: "1",
        //    view: "3"
        //};

        var TurbineExcelModel = {
            TUNo: "0",
            ViewType: "6"
        };

        var promisePost = CIR_OperationService.postCommonService(GetTurbineVerUpdateLoadStatusUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.AssignToArray = pl.data.result;

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the assigned to details : " + err);
        });



    };

    $scope.LoadIsAutoAssignOrNot2 = function () {

        fnLoadGif();
        var TurbineExcelModel = {
            TUNo: "0",
            ViewType: "2"
        };
        if ($scope.Status2 == "3") //reject
        {
            TurbineExcelModel = {
                TUNo: $scope.PostFilename,
                ViewType: "3"
            };

        }

        var promisePost = CIR_OperationService.postCommonService(GetTurbineVerUpdateLoadStatusUrl, TurbineExcelModel);
        promisePost.then(function (pl) {

            $scope.AssignToArray2 = pl.data.result;

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the assigned to details : " + err);
        });

    };

    $scope.LoadIsAutoAssignOrNot3 = function () {

        fnLoadGif();
        //var TurbineExcelModel = {
        //    TUNo: "0",
        //    ViewType: "2"
        //};
        if ($scope.Status3 == "3") //reject
        {

            var TurbineExcelModel = {
                TUNo: $scope.PostFilename2,
                ViewType: "4"
            };
            var promisePost = CIR_OperationService.postCommonService(GetTurbineVerUpdateLoadStatusUrl, TurbineExcelModel);
            promisePost.then(function (pl) {

                $scope.AssignToArray3 = pl.data.result;

                $("#ddlAssignedTo3").css("display", "block");
                $("#spnAssign").css("display", "block");
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in loading the assigned to details : " + err);
            });

        }
        else {

            $("#ddlAssignedTo3").css("display", "none");
            $("#spnAssign").css("display", "none");
            fnRemoveGif();
        }



    };

    $scope.FileNoChange = function (keyEvent) {
        $scope.UpdateOnly = false;
        if (keyEvent.which === 13) {
            fnLoadGif();
            LoadTurbineVUExcel($scope.TUNo);
            fnRemoveGif();
        }
    };

    $scope.UploadTurbineVersUpdateExcel = function () {
        $scope.UpdateOnly = false;

        if ($.trim($("#fuTurbine").val()) == "") {
            SetErrorMessage("Upload the file!");
            $("#fuTurbine").focus();
            return false;
        }
        fnLoadGif();
        try {
            var filename = $("#fuTurbine").val();
            if (navigator.userAgent.indexOf("Firefox") > -1) {
                $scope.TFilename = filename;
            }
            else {
                var lastIndex = filename.lastIndexOf("\\");
                if (lastIndex >= 0) {
                    filename = filename.substring(lastIndex + 1);
                    $scope.TFilename = filename;

                }
            }
        } catch (err) { fnRemoveGif(); }
        //alert($scope.TFilename);

        var InputModel = {
            FileName: $scope.TFilename,
            TUId: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbineExcelUploadUrl, InputModel);
        promisePost.then(function (pl) {


            $scope.Message = pl.data.result.message;
            $scope.TUId = "0";
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);

                $scope.Total = $scope.Message.Total;
                $scope.Modified = $scope.Message.Modified;
                $scope.Invalid = $scope.Message.Invalid;

                $scope.TurbineExcelGridArray = pl.data.result.turbineexceldetails;
                $scope.new_account = false;
                LoadPostFileName();
                $("#btnSave").removeAttr("disabled");

            }
            else {
                SetErrorMessage($scope.Message.Message);

                $scope.Total = $scope.Message.Total;
                $scope.Modified = $scope.Message.Modified;
                $scope.Invalid = $scope.Message.Invalid;
                $scope.TurbineExcelGridArray = pl.data.result.turbineexceldetails;
                $scope.new_account = false;
                $("#btnSave").removeAttr("disabled");

            }

            fnRemoveGif();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.SubmitTurbineVUExcel = function () {
        try {

            if ($scope.TurbineExcelGridArray != "" && $scope.TurbineExcelGridArray.length != "0") {
                for (var i = 0; i < $scope.TurbineExcelGridArray.length; i++) {
                    if ($scope.TurbineExcelGridArray[i].SwVersion == "0" || $scope.TurbineExcelGridArray[i].SwVersion == "") {
                        SetErrorMessage("Ensure Software version available!");
                        return false;
                    }
                }
            }
        }
        catch (ex) { }
        try {

            if ($scope.TurbineExcelGridArray != "" && $scope.TurbineExcelGridArray.length != "0") {
                for (var i = 0; i < $scope.TurbineExcelGridArray.length; i++) {
                    if ($scope.TurbineExcelGridArray[i].hwVersion == "0" || $scope.TurbineExcelGridArray[i].hwVersion == "") {
                        SetErrorMessage("Ensure CCU Firmware!");
                        return false;
                    }
                }
            }
        }
        catch (ex) { }
        try {

            if ($scope.TurbineExcelGridArray != "" && $scope.TurbineExcelGridArray.length != "0") {
                for (var i = 0; i < $scope.TurbineExcelGridArray.length; i++) {
                    if ($scope.TurbineExcelGridArray[i].InstallationDate == "") {
                        SetErrorMessage("Ensure Installation Date!");
                        return false;
                    }
                }
            }
        }
        catch (ex) { }
        var res = "";
        try {

            if ($scope.TurbineExcelGridArray != "" && $scope.TurbineExcelGridArray.length != "0") {
                var lim = $scope.TurbineExcelGridArray.length;
                debugger;
                for (var i = 0; i < lim; i++) {
                    if (res == "") { res = res + $scope.TurbineExcelGridArray[i]["TbnId"]; }
                    else { res = res + "," + $scope.TurbineExcelGridArray[i]["TbnId"]; }
                }
            }
        }
        catch (ex) { }
        if ($scope.TurbineExcelGridArray == "") {
            SetErrorMessage("Ensure Turbine Details!");
            return false;
        }
        else if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        else if ($.trim($scope.AssignTo) == "0") {
            SetErrorMessage("Ensure Assign To!");
            $("#ddlAssignedTo").focus();
            return false;
        }
        fnLoadGif();
        var InputModel = {
            dt: JSON.stringify($scope.TurbineExcelGridArray),
            FileName: $scope.TFilename,
            TUId: $scope.TUId,
            Remarks: $scope.Remarks,
            Status: $scope.Status,
            AssignTo: $scope.AssignTo,
            Submit: "1",
            TbnIds: res
        };

        var promisePost = CIR_OperationService.postCommonService(TurbineExcelSubmitUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                $scope.TUNo = "0";
                LoadTurbineVUExcel($scope.TUNo);
            }
            else {
                SetErrorMessage($scope.Message.Message);
                fnRemoveGif();
            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        fnRemoveGif();
        return false;
    };

    $scope.Submit2TurbineVUExcel = function () {

        if ($.trim($scope.PostFilename) == "0") {
            SetErrorMessage("Ensure choose Filename!");
            return false;
        }
        else if ($scope.TurbineExcelGridArray2 == "") {
            SetErrorMessage("Ensure Turbine Details!");
            return false;
        }
        else if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        else if ($.trim($scope.Status2) == "0") {
            SetErrorMessage("Ensure Status!");
            $("#ddlStatus2").focus();
            return false;
        }
        else if ($.trim($scope.AssignTo2) == "0") {
            SetErrorMessage("Ensure Assign To!");
            $("#ddlAssignedTo2").focus();
            return false;
        }
        fnLoadGif();

        var InputModel = {
            dt: JSON.stringify($scope.TurbineExcelGridArray2),
            FileName: $scope.TFilename,
            TUId: $scope.PostFilename,
            Remarks: $scope.Remarks,
            Status: $scope.Status2,
            AssignTo: $scope.AssignTo2,
            Submit: "2"
        };

        var promisePost = CIR_OperationService.postCommonService(TurbineExcelSubmitUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                $scope.TurbineExcelGridArray2 = "";
                $scope.Status2 = $scope.AssignTo2 = $scope.PostFilename = "0"; $scope.Remarks = "";
                LoadTurbineVUExcel("0");
                LoadSub2FileName();
            }
            else {
                SetErrorMessage($scope.Message.Message);
                fnRemoveGif();
            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        fnRemoveGif();
        return false;
    };

    $scope.ClearTurbineExcel = function () {
        $scope.UpdateOnly = false;
        $scope.PostFilename = "0";
        LoadTurbineVUExcel("0");
        $scope.TurbinePostExcelGridArray = "";

        $("#txtStatus").css("display", "none");
        $("#spnStatus").css("display", "");
        $("#spnMStatus").css("display", "");
        $("#ddlStatus").css("display", "");
        $("#spnAssign1").css("display", "");
        $("#spnMAssign1").css("display", "");
        $("#ddlAssignedTo").css("display", "");
        $("#txtRemarks").removeAttr("disabled");
        $("#ddlStatus").removeAttr("disabled");
        $("#ddlAssignedTo").removeAttr("disabled");
    }

    $scope.Clear2TurbineExcel = function () {
        $scope.UpdateOnly = false;
        LoadTurbineVUExcel("0"); $scope.TurbineExcelGridArray2 = "";
        $scope.Status2 = $scope.AssignTo2 = $scope.PostFilename = "0"; $scope.Remarks = "";
        LoadSub2FileName();
    }

    $scope.PostTurbineExcel = function () {
        if ($scope.TurbinePostExcelGridArray == "") {
            SetErrorMessage("Ensure Turbine Details!");
            return false;
        }
        else if ($scope.Status3 == "0") {
            SetErrorMessage("Ensure Status!");
            $("#ddlStatus3").focus();
            return false;
        } else if ($scope.Status3 == "3" && $scope.AssignTo3 == "0") {
            SetErrorMessage("Ensure AssignTo!");
            $("#ddlAssignedTo3").focus();
            return false;
        }

        else if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        fnLoadGif();
        $('#fuTurbine').val("");
        var TurbineExcelModel = {
            FileName: "",
            Remarks: $scope.Remarks,
            Submit: "3",
            TUId: $scope.PostFilename2,
            RowId: "0",
            Delflag: "0",
            Status: $scope.Status3,
            AssignTo: $scope.AssignTo3
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbinePostUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadTurbineVUExcel("0");
                $scope.PostFilename2 = "0"; $scope.TurbinePostExcelGridArray = "";
                LoadPostFileName();
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.ClearpostTurbineExcel = function () {
        $scope.UpdateOnly = false;
        $scope.PostFilename = "0";
        LoadTurbineVUExcel("0");
        $scope.TurbinePostExcelGridArray = "";
        LoadPostFileName();
    }

    $scope.DeleteTurbineExcel = function (RowId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var TurbineExcelModel = {
            //dt: JSON.stringify($scope.TurbineExcelGridArray),
            //RowId: RowId
            dt: JSON.stringify($scope.TurbineExcelGridArray),
            FileName: $scope.TFilename,
            Remarks: $scope.Remarks,
            Submit: "0",
            TUId: $scope.TUId,
            RowId: RowId,
            Delflag: "1",
            // Status: $scope.Status,
            //  AssignTo: $scope.AssignTo
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbineVUExcelUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage("Record deleted Successfully!");//$scope.Message.Message
                $scope.TurbineExcelGridArray = pl.data.result.turbineexceldetails;
                $("#btnSave").removeAttr("disabled");
                //  LoadTurbineVUExcel($scope.TUNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.DeleteTurbineExcel2 = function (RowId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var TurbineExcelModel = {
            FileName: "",
            Remarks: $scope.Remarks,
            Submit: "0",
            TUId: $scope.PostFilename,
            RowId: RowId,
            Delflag: "1",
            Status: $scope.Status2,
            AssignTo: $scope.AssignTo2
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbinePostUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                $scope.TurbineExcelGridArray2 = pl.data.result.turbineexceldetails;
                $("#btnSave").removeAttr("disabled");
                //  LoadTurbineVUExcel($scope.TUNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.DeleteTurbinePostExcel = function (RowId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var TurbineExcelModel = {
            FileName: "",
            Remarks: $scope.Remarks,
            Submit: "0",
            TUId: $scope.PostFilename2,
            RowId: RowId,
            Delflag: "1",
            Status: "0",
            AssignTo: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetTurbinePostUrl, TurbineExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                $scope.TurbinePostExcelGridArray = pl.data.result.turbineexceldetails;
                $("#btnSave").removeAttr("disabled");
                //  LoadTurbineVUExcel($scope.TUNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    $scope.CancelTurbineVUExcel = function () {

        // $scope.UpdateOnly = false;
        if ($.trim($scope.TUId) == "0") {
            SetErrorMessage("Ensure File No!");
            $("#txtFileNo").focus();
            return false;
        }
        if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        //else if ($.trim($scope.AssignTo) == "0") {
        //    SetErrorMessage("Ensure Assign To!");
        //    $("#ddlAssignedTo").focus();
        //    return false;
        //}
        fnLoadGif();

        var InputModel = {
            dt: JSON.stringify($scope.TurbineExcelGridArray),
            TUId: $scope.TUId,
            Remarks: $scope.Remarks,
            Status: $scope.Status,
            AssignTo: $scope.AssignTo,
            Submit: "4"
        };

        var promisePost = CIR_OperationService.postCommonService(TurbineExcelSubmitUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);
                LoadTurbineVUExcel($scope.TUNo);
            }
            else {
                SetErrorMessage($scope.Message.Message);
                fnRemoveGif();
            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        fnRemoveGif();
        return false;
    };

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        if ($scope.TUId == "0") {
            $(".ErrorMsg").css("display", "");
            //   $(".DelAction").css("display", "none");
        }
        else {
            $(".ErrorMsg").css("display", "none");
            $(".DelAction").css("display", "");
        }

        if ($scope.Posted == "True")
            $(".DelAction").css("display", "none");

        if ($scope.Cancel == "True")
            $(".DelAction").css("display", "none");
        if ($scope.Posted != "True" && $scope.Cancel != "True") {
            if ($scope.Identify == "1") $(".DelAction").css("display", "none");
            else $(".DelAction").css("display", "");
        }

    });

    $scope.PostFileNameChange = function () {
        $scope.UpdateOnly = false;
        LoadTurbineVUExcel($scope.PostFilename);
    };

    $scope.PostFileNameChange2 = function () {
        $scope.UpdateOnly = false;
        LoadTurbineVUExcel($scope.PostFilename2);
    };

    function LoadTurbineGrid() {
        $scope.sortType = 'Slno';
        $scope.sortReverse = false;
        $scope.searchTurbine = '';
        $scope.curPage = 0;
        fnLoadGif();
        var TurbineModel = {
            Site: "0",
            View: "1",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
        promisePost.then(function (pl) {
            $scope.TurbineGridArray = pl.data.result.TurbineDetail;
            $scope.TurbineArrayLength = pl.data.result.TurbineDetail.length;
            $scope.TurbineGridArrayFiltered = $scope.TurbineGridArray;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadExcelDownload() {
        var TurbineModel = {
            Site: "0",
            View: "1",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetExcelDownloadUrl, TurbineModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.TurbineExcelDownload = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.DownloadExcel = function () {
        $scope.UpdateOnly = false;
        var _Url = GetDownloadUrl;
        _Url = _Url.replace("DownloadExcel", "");
        fnLoadGif();
        var parameters = {
            Data: JSON.stringify($scope.TurbineExcelDownload),
            SessionId: "TurbineMaster"
        };
        var promisePost = CIR_OperationService.postCommonService(_Url + 'FillData', parameters);
        promisePost.then(function (pl) {
            if (pl.data == "OK") {
                var _downloadUrl = _Url + 'DownloadExcel/' + 'TurbineMaster';
                ko.utils.postJson(_downloadUrl);
            } else {
                SetWarningMessage("Unable to process your request, please try again!");
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadTurbineVUExcel(TUNo) {
        $('#fuTurbine').val("");
        var TurbineExcelModel = {
            TUNo: TUNo,
            ViewType: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetTurbineExcelUrl, TurbineExcelModel);
        promisePost.then(function (pl) {

            $scope.TurbineExcelHeader = pl.data.result.headerdetails;

            if ($scope.PostFilename != "0") {
                $scope.TurbineExcelGridArray2 = pl.data.result.turbineexceldetails;
                $("#btnSave2").removeAttr("disabled");
            }
            else if ($scope.PostFilename2 != "0")
            { $scope.TurbinePostExcelGridArray = pl.data.result.turbineexceldetails; }
            else {
                $scope.TurbineExcelGridArray = pl.data.result.turbineexceldetails;
                $scope.TurbineExcelHeader.Status = $scope.TurbineExcelHeader.Status == "3" ? "1" : $scope.TurbineExcelHeader.Status;
            }
            $scope.TUId = $scope.TurbineExcelHeader.TUId;
            $scope.TFilename = $scope.TurbineExcelHeader.TFilename;
            $scope.TUNo = $scope.TurbineExcelHeader.TUNo;
            $scope.Posted = $scope.TurbineExcelHeader.Posted;
            $scope.Cancel = $scope.TurbineExcelHeader.Cancel;
            $scope.PostedBy = $scope.TurbineExcelHeader.PostedBy;
            $scope.PostedOn = $scope.TurbineExcelHeader.PostedOn;
            $scope.Remarks = $scope.TurbineExcelHeader.Remarks;
            $scope.UploadedBy = $scope.TurbineExcelHeader.UploadedBy;
            $scope.Total = $scope.TurbineExcelHeader.Total;
            $scope.Modified = $scope.TurbineExcelHeader.Modified;
            $scope.Invalid = $scope.TurbineExcelHeader.Invalid;
            $scope.Status = $scope.TurbineExcelHeader.Status;

            $("#btnSave").attr("disabled", "disabled");
            $("#btnPost").attr("disabled", "disabled");
            if ($scope.TurbineExcelHeader.Pending != "" && $scope.TurbineExcelHeader.Pending != "0" && $scope.TurbineExcelHeader.Pending != undefined) {
                debugger;
                $scope.Pending = "Pending File No: " + $scope.TurbineExcelHeader.Pending;
            }
            else $scope.Pending = "";

            if ($scope.TUId == "0") {
                $("#uploadform").css("display", "");
                $("#txtFileName").css("display", "none");
                $("#btnUpload").removeAttr("disabled");
                $("#btnCancel").attr("disabled", "disabled");
                $("#txtStatus").css("display", "none");

                $("#spnStatus").css("display", "");
                $("#spnMStatus").css("display", "");
                $("#ddlStatus").css("display", "");
                $("#spnAssign1").css("display", "");
                $("#spnMAssign1").css("display", "");
                $("#ddlAssignedTo").css("display", "");
                $("#txtRemarks").removeAttr("disabled");
                $scope.Tstatus = "";
                $("#btnSave").attr("disabled", "disabled");
                $("#ddlStatus").removeAttr("disabled");
                $("#ddlAssignedTo").removeAttr("disabled");
            }
            else {
                $scope.LoadIsAutoAssignOrNot();
                $("#uploadform").css("display", "none");
                $("#txtFileName").css("display", "");
                $("#btnUpload").attr("disabled", "disabled");
                //not posted entry
                if ($scope.Posted != "True") {
                    $("#btnPost").removeAttr("disabled");
                    $("#btnCancel").removeAttr("disabled");
                    $(".DelAction").css("display", "");
                    //cancel entry validation
                    if ($scope.Cancel == "True") {
                        $("#btnCancel").attr("disabled", "disabled");
                        $("#btnSave").attr("disabled", "disabled");
                        $("#txtStatus").css("display", "");
                        $("#spnStatus").css("display", "");
                        $("#spnMStatus").css("display", "");
                        $("#ddlStatus").css("display", "none");
                        $("#spnAssign1").css("display", "none");
                        $("#spnMAssign1").css("display", "none");
                        $("#ddlAssignedTo").css("display", "none");
                        $("#txtRemarks").attr("disabled", "disabled");
                        $("#btnSave").attr("disabled", "disabled");
                        $scope.Tstatus = "Cancelled";

                        $scope.new_account = true;
                        try {//grid dropdown disabled

                            if ($scope.TurbineExcelGridArray != "" && $scope.TurbineExcelGridArray.length != "0") {
                                for (var i = 0; i < $scope.TurbineExcelGridArray.length; i++) {
                                    $scope.TurbineExcelGridArray[i].row.SwVersion.attr("disabled", "disabled");
                                    $scope.TurbineExcelGridArray[i].row.hwVersion.attr("disabled", "disabled");
                                    $scope.TurbineExcelGridArray[i].row.InstallationDate.attr("disabled", "disabled");

                                }
                            }
                        }
                        catch (ex) { }
                    }
                        //not cancel  not posted entry validation
                    else {
                        $("#txtStatus").css("display", "none");
                        $("#spnStatus").css("display", "");
                        $("#spnMStatus").css("display", "");
                        $("#ddlStatus").css("display", "");
                        $("#spnAssign1").css("display", "");
                        $("#spnMAssign1").css("display", "");
                        $("#ddlAssignedTo").css("display", "");
                        $("#txtRemarks").removeAttr("disabled");
                        $scope.Tstatus = "";
                        $("#btnSave").attr("disabled", "disabled");

                        //  $(".DelAction").css("display", "none");
                    }

                    try {
                        var aSplit = $scope.TurbineExcelHeader.Pending.split(',');
                        var oBit = "0";
                        for (var i = 0; i < aSplit.length; i++) {
                            //open pending no entry
                            if ($scope.TUNo == aSplit[i]) {
                                $("#btnSave").removeAttr("disabled");  //save button enabled
                                $scope.new_account = false;
                                oBit = "1";
                                $("#spnStatus").css("display", "");
                                $("#spnMStatus").css("display", "");
                                $("#ddlStatus").css("display", "");
                                $("#spnAssign1").css("display", "");
                                $("#spnMAssign1").css("display", "");
                                $("#ddlAssignedTo").css("display", "");
                                $("#ddlStatus").removeAttr("disabled");
                                $("#ddlAssignedTo").removeAttr("disabled");
                                $scope.Identify = "0";
                            }
                            else { //other than pending no entry
                                //  alert('pp');
                                //   $(".DelAction").css("display", "none");
                                if (oBit == "0") {
                                    $scope.Identify = "1";   //visible false delete button
                                    $("#btnSave").attr("disabled", "disabled");
                                    $scope.new_account = true;
                                    //open not assign, reject status
                                    if ($scope.TurbineExcelHeader.Status != "1") {
                                        $("#spnStatus").css("display", "none");
                                        $("#spnMStatus").css("display", "none");
                                        $("#ddlStatus").css("display", "none");
                                        $("#spnAssign1").css("display", "none");
                                        $("#spnMAssign1").css("display", "none");
                                        $("#ddlAssignedTo").css("display", "none");
                                    }
                                    else { //open  assign, reject status
                                        $("#ddlStatus").attr("disabled", "disabled");
                                        $("#ddlAssignedTo").attr("disabled", "disabled");
                                    }
                                }
                            }
                        }
                    }
                    catch (err) { }
                }
                    //[psted entry
                else {
                    $("#btnCancel").attr("disabled", "disabled");
                    $scope.new_account = true;
                    $("#txtStatus").css("display", "");
                    $("#spnStatus").css("display", "");
                    $("#spnMStatus").css("display", "");
                    $("#ddlStatus").css("display", "none");
                    $("#spnAssign1").css("display", "none");
                    $("#spnMAssign1").css("display", "none");
                    $("#ddlAssignedTo").css("display", "none");
                    $("#txtRemarks").attr("disabled", "disabled");
                    $scope.Tstatus = "Posted";
                    $("#btnSave").attr("disabled", "disabled");
                }
            }
            $scope.StartTimer();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });


    };



    //Timer start function.
    $scope.StartTimer = function () {
        //Set the Timer start message.
        $scope.Message = "Timer started. ";

        //Initialize the Timer to run every 1000 milliseconds i.e. one second.
        $scope.Timer = $interval(function () {

            $scope.AssignTo = $scope.TurbineExcelHeader.AssignTo;
            $scope.StopTimer();

        }, 2000);
    };

    //Timer stop function.
    $scope.StopTimer = function () {

        //Set the Timer stop message.
        $scope.Message = "Timer stopped.";

        //Cancel the Timer.
        if (angular.isDefined($scope.Timer)) {
            $interval.cancel($scope.Timer);
        }
    };

    $scope.sortType = 'Slno';
    $scope.sortReverse = false;
    $scope.searchTurbine = '';
    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.TurbineExcelGridArray != undefined)
            return Math.ceil($scope.TurbineExcelGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchTurbine', function (val) {
        $scope.TurbineExcelGridArray = $filter('filter')($scope.TurbineExcelGridArray, val);
    });

    $scope.LastPage = function () {
        if ($scope.TurbineExcelGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.TurbineExcelGridArray.length / $scope.pageSize) - 1);
    }

    $(document).ready(function () {
        $("#tablist1-tab2").click(function () {
            $('#tablist1-panel2').show();
            $('#tablist1-panel3').css('display', 'none');
            $('#tablist1-panel1').css('display', 'none');
        });
        $("#tablist1-tab1").click(function () {
            $('#tablist1-panel1').show();
            $('#tablist1-panel2').css('display', 'none');
            $('#tablist1-panel3').css('display', 'none');
        });
        $("#tablist1-tab3").click(function () {
            $('#tablist1-panel3').show();
            $('#tablist1-panel2').css('display', 'none');
            $('#tablist1-panel1').css('display', 'none');
        });
    });

});

app.controller('SMPData_OperController', function ($scope, CIR_OperationService, $filter, $interval) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    //$scope.AddOrUpdate = true;

    $scope.StatusSMPData = $scope.AssignedToSMPData = $scope.StatusVerify = $scope.AssignToVerify = $scope.StatsusApprove = $scope.AssignToApprove = $scope.StatusPost = $scope.AssignToPost = "0";

    $scope.VerifyFilename = $scope.ApproveFilename = $scope.PostFilename = "0";

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
            pageName: "SMP Data System"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add == "1" ? true : false;
            $scope.View = pl.data.result.View == "1" ? true : false;
            $scope.Update = pl.data.result.Update == "1" ? true : false;
            $scope.Delete = pl.data.result.Delete == "1" ? true : false;
            $scope.AddOrUpdate = $scope.Add ? true : $scope.Update ? true : false;
            $scope.Download = pl.data.result.Download == "1" ? true : false;

            IsTabAvailable();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadPageAccess();

    function IsTabAvailable() {

        $("#responsive-tabs-wrapper").ready(function () {
            if ($scope.Add) {
                $('#tablist1-tab1').addClass('responsive-tabs__list__item responsive-tabs__list__item--active');
                $('#tablist1-panel1').addClass('responsive-tabs__panel responsive-tabs__panel--active responsive-tabs__panel--closed-accordion-only');

            }
            else {
                $('#tablist1-tab1').css('display', 'none');
            }
            if ($scope.Update) {
                $('#tablist1-tab2').addClass('responsive-tabs__list__item responsive-tabs__list__item--active');
                if (!$scope.Add) $('#tablist1-panel2').addClass('responsive-tabs__panel responsive-tabs__panel--active responsive-tabs__panel--closed-accordion-only');
            }
            else {
                $('#tablist1-tab2').css('display', 'none');
            }
            if ($scope.Download) {
                $('#tablist1-tab3').addClass('responsive-tabs__list__item responsive-tabs__list__item--active');
                if (!$scope.Add && !$scope.Update) $('#tablist1-panel3').addClass('responsive-tabs__panel responsive-tabs__panel--active responsive-tabs__panel--closed-accordion-only');
            }
            else {
                $('#tablist1-tab3').css('display', 'none');
            }
        });
    }

    $scope.UploadSMPDataUpdateExcel = function () {
        $scope.UpdateOnly = false;

        if ($.trim($("#ExcelFileSMP").val()) == "") {
            SetErrorMessage("Upload the file!");
            $("#ExcelFileSMP").focus();
            return false;
        }
        fnLoadGif();
        try {
            var filename = $("#ExcelFileSMP").val();
            if (navigator.userAgent.indexOf("Firefox") > -1) {
                $scope.TFilename = filename;
            }
            else {
                var lastIndex = filename.lastIndexOf("\\");
                if (lastIndex >= 0) {
                    filename = filename.substring(lastIndex + 1);
                    $scope.TFilename = filename;

                }
            }
        } catch (err) { fnRemoveGif(); }


        var InputModel = {
            FileName: $scope.TFilename,
            SUId: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetSMPDataExcelUploadUrl, InputModel);
        promisePost.then(function (pl) {
            debugger;
            $scope.Message = pl.data.result.message;
            $scope.SUId = "0";
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Message);

                $scope.Total = $scope.Message.Total;
                $scope.Modified = $scope.Message.Modified;
                $scope.Invalid = $scope.Message.Invalid;

                $scope.SMPDataExcelGridArray = pl.data.result.SMPDataExcelDetails;
                //LoadPostFileName();
                //$("#btnSave").removeAttr("disabled");
            }
            else {
                SetErrorMessage($scope.Message.Message);

                $scope.Total = $scope.Message.Total;
                $scope.Modified = $scope.Message.Modified;
                $scope.Invalid = $scope.Message.Invalid;
                $scope.SMPDataExcelGridArray = pl.data.result.SMPDataExcelDetails;
                $scope.new_account = false;
                $("#btnSave").removeAttr("disabled");
            }

            fnRemoveGif();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        return false;
    };

    function LoadSMPDataExcel(SUNo) {
        $('#ExcelFileSMP').val("");
        var SMPDataExcelModel = {
            SUNo: SUNo,
            ViewType: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetSMPDataExcelUploadUrl, SMPDataExcelModel);
        promisePost.then(function (pl) {
            debugger;
            $scope.SMPDataExcelHeader = pl.data.result.headerdetails;

            $scope.txtFileName = $scope.SMPDataExcelHeader.Filename;
            $scope.Invalid = $scope.SMPDataExcelHeader.Invalid;
            $scope.Modified = $scope.SMPDataExcelHeader.Modify;
            $scope.Total = $scope.SMPDataExcelHeader.Total;
            $scope.UploadedBy = $scope.SMPDataExcelHeader.UploadedBy;
            $scope.SUNo = $scope.SMPDataExcelHeader.SUNo;
            $scope.SUId = $scope.SMPDataExcelHeader.SUId;
            $scope.Remarks = $scope.SMPDataExcelHeader.Remarks;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });


    };

    LoadSMPDataExcel("0");

    fnRemoveGif();

    $(document).ready(function () {
        $("#tablist1-tab2").click(function () {
            $('#tablist1-panel2').show();
            $('#tablist1-panel3').css('display', 'none');
            $('#tablist1-panel1').css('display', 'none');
        });
        $("#tablist1-tab1").click(function () {
            $('#tablist1-panel1').show();
            $('#tablist1-panel2').css('display', 'none');
            $('#tablist1-panel3').css('display', 'none');
        });
        $("#tablist1-tab3").click(function () {
            $('#tablist1-panel3').show();
            $('#tablist1-panel2').css('display', 'none');
            $('#tablist1-panel1').css('display', 'none');
        });
    });

});

angular.module('CIRModule').filter('pagination', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    };
});
