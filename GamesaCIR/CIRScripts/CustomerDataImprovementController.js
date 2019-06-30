app.controller('DMMaster_OperController', function ($scope, CIR_OperationService, $filter) {

    fnLoadGif();

    // Role Access Initial
    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;

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
            pageName: "DM Master"
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

    $scope.Initializtion = function () {
        $scope.ddlAddNew = "0";
        $scope.Active = "1";
        $scope.txtTDNo = $scope.txtMENNo = $scope.txtName = $scope.txtCode = $scope.txtDesc = "";
        $scope.DMId = "0";
        binddata();
        binddataSelect();
        $scope.UpdateOnly = false;
        fnRemoveGif();
    }

    function binddataSelect() {
        var DMModel = {
            View: "0",
            RefId: "0"
        }
        var promisePost = CIR_OperationService.postCommonService(GetDMMasterUrl, DMModel);
        promisePost.then(function (pl) {
            $scope.CollectionSelect = pl.data.result;
        });
    }

    function binddata() {
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchDMMaster = '';
        $scope.curPage = 0;
        var DMModel = {
            View: "1",
            RefId: "0"
        }
        var promisePost = CIR_OperationService.postCommonService(GetDMMasterUrl, DMModel);
        promisePost.then(function (pl) {
            $scope.DMMasterGridArray = pl.data.result;
            $scope.DMMasterGridArrayFiltered = $scope.DMMasterGridArray;
        });
    }

    $scope.ddlAddNewChange = function () {
        $scope.UpdateOnly = false;
        var DMModel = {
            View: "1",
            RefId: $scope.ddlAddNew
        }
        var promisePost = CIR_OperationService.postCommonService(GetDMMasterUrl, DMModel);
        promisePost.then(function (pl) {
            $scope.DMMasterGridArray = "";
            $scope.DMMasterGridArray = pl.data.result;
        });
    }

    $scope.SaveData = function () {
        if ($scope.txtName == "") {
            SetErrorMessage("Ensure the name");
            $('#txtName').focus(); return false;
        }
        if ($scope.txtCode == "") {
            SetErrorMessage("Ensure the code");
            $('#txtCode').focus(); return false;
        }
        fnLoadGif();
        var DMModel = {
            DMId: $scope.DMId,
            RefId: $scope.ddlAddNew,
            Title: $scope.txtName,
            TDNo: $scope.txtTDNo,
            SBNo: $scope.txtCode,
            MENNo: $scope.txtMENNo,
            Desc: $scope.txtDesc,
            Active: $scope.Active,
            Delflag: "0"
        }

        var promisePost = CIR_OperationService.postCommonService(SetDMMasterUrl, DMModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.Message = pl.data.result.message;
            $scope.DMMasterGridArray = pl.data.result.DMMasterDetailArray;
            if ($scope.Message.Clear == "True") {
                $scope.sortType = ''; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.searchDMMaster = '';
                $scope.curPage = 0;
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                clearsavedata(); binddataSelect();
            }
            if ($scope.Message.Clear == "False") {
                SetErrorMessage($scope.Message.Msg);
            }
        });
    }

    $scope.EditDMMaster = function (items) {
        $scope.UpdateOnly = true;
        $('#btnsave').text('Modify');
        $scope.DMId = items.DMId;
        $scope.txtTDNo = items.TDNo;
        $scope.txtName = items.Title;
        $scope.txtCode = items.SBNo;
        $scope.txtMENNo = items.MENNo;
        $scope.txtDesc = items.Desc;
        $scope.Active = items.Active == "True" ? "1" : "0";
    }

    $scope.DeleteDMMaster = function (items) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var DMModel = {
            DMId: items.DMId,
            RefId: $scope.ddlAddNew,
            Title: "",
            TDNo: "",
            SBNo: "",
            MENNo: "",
            Desc: "",
            Active: "0",
            Delflag: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(SetDMMasterUrl, DMModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.Message = pl.data.result.message;
            $scope.DMMasterGridArray = pl.data.result.DMMasterDetailArray;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                binddataSelect();
            }
            if ($scope.Message.Clear == "False") {
                SetErrorMessage($scope.Message.Msg);
            }
        });
    }

    $scope.Clear = function () {
        $scope.UpdateOnly = false;
        clearsavedata();
        $scope.ddlAddNew = "0"; binddata();
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchDMMaster = '';
        $scope.curPage = 0;
    }

    function clearsavedata() {
        $scope.DMId = "0"; $scope.Active = "1"; $('#btnsave').text('Save');
        $scope.txtTDNo = $scope.txtMENNo = $scope.txtName = $scope.txtCode = $scope.txtDesc = "";
    }

    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchDMMaster = "";

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.DMMasterGridArray != undefined)
            return Math.ceil($scope.DMMasterGridArray.length / $scope.pageSize);
    };

    $scope.$watch('searchDMMaster', function (val) {
        $scope.DMMasterGridArray = $filter('filter')($scope.DMMasterGridArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.DMMasterGridArray != undefined)
            $scope.curPage = (Math.ceil($scope.DMMasterGridArray.length / $scope.pageSize) - 1);
    }

});

app.controller('SpareParts_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Initializtion = function () {
        $scope.ddlDMTitle = $scope.ddlType = "0";
        $scope.txtName = $scope.FileName = "";
        $scope.DTId = "0";
        bindgriddata();
        loadsparedropdown();
        loadDMTitle();
        $scope.Add = true;
        $scope.View = true;
        $scope.Update = true;
        $scope.Delete = true;
        $scope.Download = true;
        $scope.AddOrUpdate = true;
        $scope.UpdateOnly = false;
    }

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
            pageName: "Spare Parts"
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

    function loadDMTitle() {
        var GetDMTitle = {
            View: "0",
            RefId: "0"
        }
        var promisePost = CIR_OperationService.postCommonService(GetDMMasterUrl, GetDMTitle);
        promisePost.then(function (pl) {
            $scope.DMTitleDropdownArray = pl.data.result;
        });
    }

    function loadsparedropdown() {
        var GetSpare = {
            View: "4",
            RefId: "0"
        }
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionSpareUrl, GetSpare);
        promisePost.then(function (pl) {
            $scope.SparePartsDropdownArray = pl.data.result;
        });
    }

    function bindgriddata() {
        var GetSparePartsModel = {
            DMId: $scope.ddlDMTitle,
            RefMCId: $scope.ddlType
        }
        var promisePost = CIR_OperationService.postCommonService(GetSparePartsUrl, GetSparePartsModel);
        promisePost.then(function (pl) {
            $scope.SparePartsArray = pl.data.result;
            $scope.SparePartsArrayFiltered = $scope.SparePartsArray;
        });
    }

    function clearsavedata() {
        fnLoadGif();
        $scope.ddlDMTitle = $scope.DTId = $scope.ddlType = "0"; $scope.FileName = $scope.txtName = "";
        $('#FileName').val("");
        bindgriddata();
        fnRemoveGif();
        $('#btnsave').text('Save');
    }

    function fileUpload() {
        var a = $("#FileName").val();
        $scope.FileName = a.replace("C:\\fakepath\\", "");
        var data = new FormData();
        var files = $("#FileName").get(0).files;
        if (files.length > 0) {
            data.append("UploadedImage", files[0]);
        }
        var ajaxRequest = $.ajax({
            type: "POST",
            url: "FileUploadSpareParts/CustomerDataImprovement",
            contentType: false,
            processData: false,
            data: data
        });

        ajaxRequest.done(function (xhr, textStatus) {
            // Do other operation
        });
    }

    $scope.ddlDMTitleChange = function () {
        $scope.UpdateOnly = false;
        var GetDMTitle = {
            DMId: $scope.ddlDMTitle,
            RefMCId: $scope.ddlType
        }
        var promisePost = CIR_OperationService.postCommonService(GetSparePartsUrl, GetDMTitle);
        promisePost.then(function (pl) {
            $scope.SparePartsArray = pl.data.result;
        });
    }

    $scope.SaveData = function () {
        if ($scope.ddlDMTitle == "0") {
            SetErrorMessage('Ensure the DMTitle'); return false;
        }
        if ($scope.txtName == "") {
            SetErrorMessage('Ensure the name'); $('#txtName').focus(); return false;
        }
        fnLoadGif();
        fileUpload();
        var SaveSparePartsModel = {
            DTId: $scope.DTId,
            DMId: $scope.ddlDMTitle,
            RefMCId: $scope.ddlType,
            ToolsPartsMaterials: $scope.txtName,
            FileName: $scope.FileName,
            Delflag: "0"
        }
        var promisePost = CIR_OperationService.postCommonService(SetSparePartsUrl, SaveSparePartsModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.Message = pl.data.result.message;
            $scope.SparePartsArray = pl.data.result.SparePartsArray;
            if ($scope.Message.Clear == "False") {
                SetErrorMessage($scope.Message.Msg);
            }
            if ($scope.Message.Clear == "True") {
                $scope.sortType = 'Slno'; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.SearchDMTools = '';
                $scope.curPage = 0;
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                clearsavedata();
            }
        });
    }

    $scope.EditDMMaster = function (item) {
        $scope.UpdateOnly = true;
        $('#btnsave').text('Modify');
        $scope.DTId = item.DTId;
        $scope.ddlDMTitle = item.DMId == null ? "0" : item.DMId;
        $scope.ddlType = item.TypeId == null ? "0" : item.TypeId;
        $scope.txtName = item.Tool;
    }

    $scope.DeleteDMMaster = function (item) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var SaveSparePartsModel = {
            DTId: item.DTId,
            DMId: $scope.ddlDMTitle,
            RefMCId: "0",
            ToolsPartsMaterials: "",
            FileName: "",
            Delflag: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(SetSparePartsUrl, SaveSparePartsModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.Message = pl.data.result.message;
            $scope.SparePartsArray = pl.data.result.SparePartsArray;
            if ($scope.Message.Clear == "False") {
                SetErrorMessage($scope.Message.Msg);
            }
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
            }
        });
    }

    $scope.Clear = function () {
        $scope.sortType = 'Slno'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.SearchDMTools = '';
        $scope.curPage = 0;
        $scope.UpdateOnly = false;
        clearsavedata();
    }

    $scope.sortType = 'Slno'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.SearchDMTools = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.SparePartsArray != undefined)
            return Math.ceil($scope.SparePartsArray.length / $scope.pageSize);
    };

    $scope.$watch('SearchDMTools', function (val) {
        $scope.SparePartsArray = $filter('filter')($scope.SparePartsArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.SparePartsArray != undefined)
            $scope.curPage = (Math.ceil($scope.SparePartsArray.length / $scope.pageSize) - 1);
    }

});

app.controller('TurbineDataEntry_OperController', function ($scope, CIR_OperationService, $filter) {


    $scope.Initializtion = function () {
        $scope.Add = true;
        $scope.View = true;
        $scope.Update = true;
        $scope.Delete = true;
        $scope.Download = true;
        $scope.AddOrUpdate = true;
        $scope.UpdateOnly = false;
        $scope.ddlState = $scope.ddlSite = $scope.ddlTurbine = $scope.ddlDMTitle = $scope.ddlStatus = $scope.AnalyzingStatus = $scope.TDId = "0";
        $scope.txtDesc = $scope.txtTurbine = "";
        LoadSite("4", "2"); LoadState(); LoadStatus(); LoadTurbine(); loadDMTitle(); LoadGridata(); LoadAnalyzingstatus();
    }

    LoadDMExcel("0");

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
            pageName: "DM Status"
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

    function LoadDMExcel(DSNo) {
        var GetDMExcelModel = {
            DSNo: DSNo,
            ViewType: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetDMExcelUrl, GetDMExcelModel);
        promisePost.then(function (pl) {
            $scope.DMExcelHeader = pl.data.result.headerdetails;
            $scope.DMExcelGridArray = pl.data.result.DMExcelDetails;
            var i = 1;
            angular.forEach($scope.DMExcelGridArray, function (value) {
                value.SlNo = i;
                i++;
            })
            fnRemoveGif();
            $scope.DSId = $scope.DMExcelHeader.DSId;
            $scope.EFilename = $scope.DMExcelHeader.TFilename;
            $scope.DSNo = $scope.DMExcelHeader.DSNo;
            $scope.Posted = $scope.DMExcelHeader.Posted;
            $scope.PostedBy = $scope.DMExcelHeader.PostedBy;
            $scope.PostedOn = $scope.DMExcelHeader.PostedOn;
            $scope.Remarks = $scope.DMExcelHeader.Remarks;
            $scope.UploadedBy = $scope.DMExcelHeader.UploadedBy;
            $scope.Total = $scope.DMExcelHeader.Total;
            $scope.Invalid = $scope.DMExcelHeader.Invalid;
            $("#btnSave").attr("disabled", "disabled");
            $("#btnPost").attr("disabled", "disabled");
            if ($scope.DSId == "0") {
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
            console.log("Error in loading the employee excel details  : " + err);
        });
    };

    $scope.ddlSiteChange = function () {
        $scope.UpdateOnly = false;
        $("#hfTurbine").val("0");
        $scope.txtTurbine = "";
    }

    $scope.btnUpload = function () {
        $scope.UpdateOnly = false;
        var InputModel = {
            DSId: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(UploadExcelUrl, InputModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                $("#btnSave").removeAttr("disabled");
                $scope.Total = $scope.Message.Total;
                $scope.Invalid = $scope.Message.InvalidRecords;
                $scope.DMExcelGridArray = pl.data.result.DMSetExcelDetails;
            }
            else {
                SetErrorMessage($scope.Message.Msg);
                $("#btnSave").attr("disabled", "disabled");
                $scope.Total = $scope.Message.Total;
                $scope.Invalid = $scope.Message.InvalidRecords;
                $scope.DMExcelGridArray = pl.data.result.DMSetExcelDetails;
                $('#file').val("");
            }
            var i = 1;
            angular.forEach($scope.DMExcelGridArray, function (value) {
                value.SlNo = i;
                i++;
            })
        });
    }

    $scope.SubmitDMStatusExcel = function () {
        $scope.UpdateOnly = false;
        if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }

        $('#file').val("");
        fnLoadGif();
        var InputModel = {
            DSId: "0",
            Remarks: $scope.Remarks
        };

        var promisePost = CIR_OperationService.postCommonService(SubmitEmployeeExcelUrl, InputModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                LoadDMExcel($scope.DSNo);
            }
            else
                SetErrorMessage($scope.Message.Msg);

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in saving the employee excel details : " + err);

        });
        return false;
    };

    $scope.PostDMStatusExcel = function () {
        $scope.UpdateOnly = false;
        if ($.trim($scope.Remarks) == "") {
            SetErrorMessage("Ensure Remarks!");
            $("#txtRemarks").focus();
            return false;
        }
        fnLoadGif();
        var DMExcelModel = {
            FileName: $scope.EFilename,
            Remarks: $scope.Remarks,
            Submit: "0",
            DSId: $scope.DSId,
            RowId: "0",
            Delflag: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(SetDMExcel, DMExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                LoadDMExcel("0");
            }
            else
                SetErrorMessage($scope.Message.Msg);
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in posting the employee excel details  : " + err);
            fnRemoveGif();
        });
        return false;
    };

    $scope.DeleteDMStatusExcel = function (RowId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var DMExcelModel = {
            FileName: $scope.EFilename,
            Remarks: $scope.Remarks,
            Submit: "0",
            DSId: $scope.DSId,
            RowId: RowId,
            Delflag: RowId
        };

        var promisePost = CIR_OperationService.postCommonService(SetDMExcel, DMExcelModel);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
                LoadDMExcel($scope.DSNo);
            }
            else
                SetErrorMessage($scope.Message.Message);
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in deleting the employee excel details  : " + err);
            fnRemoveGif();
        });
        return false;
    };

    $scope.DSNoChange = function (keyEvent) {
        $scope.UpdateOnly = false;
        if (keyEvent.which === 13)
            LoadDMExcel($scope.DSNo);
    };

    $scope.ClearDMStatusExcel = function () {
        $scope.UpdateOnly = false;
        LoadDMExcel("0");
    }

    $scope.SaveData = function () {
     
        if ($scope.txtTurbine == "" && $("#hfTurbine").val() == "0") {
            SetErrorMessage("Ensure the turbine"); $('#txtTurbine').focus(); return false;
        }
        if ($scope.ddlDMTitle == "0") {
            SetErrorMessage("Ensure the DMTitle"); $('#ddlDMTitle').focus(); return false;
        }
        if ($scope.ddlStatus == "0") {
            SetErrorMessage("Ensure the status"); $('#ddlStatus').focus(); return false;
        }
        if ($scope.AnalyzingStatus == "0") {
            SetErrorMessage("Ensure the Analyzing Status"); $('#AnalyzingStatus').focus(); return false;
        }
        fnLoadGif();
        var SetTurnineDataEntryModel = {
            TStateId: $scope.ddlState,
            TSiteId: $scope.ddlSite,
            TbnId: $("#hfTurbine").val(),
            TDId: $scope.TDId,
            StsId: $scope.ddlStatus,
            DMId: $scope.ddlDMTitle,
            Desc: $scope.txtDesc,
            AnalyzingStatus: $scope.AnalyzingStatus,
            Delflag: "0"
        }
        var promisePost = CIR_OperationService.postCommonService(SetTurbineDataEntyurl, SetTurnineDataEntryModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.Message = pl.data.result.message;
            
            if ($scope.Message.Clear == "False") {
                SetErrorMessage($scope.Message.Msg);
            }
            if ($scope.Message.Clear == "True") {
                $scope.sortType = ''; // set the default sort type
                $scope.sortReverse = false;  // set the default sort order
                $scope.searchTurbine = '';
                $scope.curPage = 0;
                $scope.UpdateOnly = false;
                SetSuccessMessage($scope.Message.Msg);
                $scope.Clear();
                LoadGridata();
            }
        });
    }

    $scope.EditTurbineData = function (item) {
        $scope.UpdateOnly = true;
        $('#btnsave').text('Modify');
        $scope.TDId = item.TDId;
        $scope.txtDesc = item.Desc;
        $scope.ddlDMTitle = item.DMId;
        $scope.txtTurbine = item.TurbineId;
        $("#hfTurbine").val(item.TbnId);
        $scope.AnalyzingStatus = item.APStatusId;
        $scope.ddlStatus = item.TStatusId;
        $scope.ddlState = item.TStateId;
        $scope.ddlSite = item.TSiteId;
        $scope.UpdateOnly = true;
    }

    $scope.DeleteTurbineData = function (item) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var SetTurnineDataEntryModel = {
            TbnId: "0",
            TDId: item.TDId,
            DMId: "0",
            Desc: "",
            StsId: "0",
            AnalyzingStatus: "0",
            Delflag: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(SetTurbineDataEntyurl, SetTurnineDataEntryModel);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.Message = pl.data.result.message;
            LoadGridata();
            if ($scope.Message.Clear == "False") {
                SetErrorMessage($scope.Message.Msg);
            }
            if ($scope.Message.Clear == "True") {
                SetSuccessMessage($scope.Message.Msg);
            }
        });
    }

    $scope.Clear = function () {
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchTurbine = '';
        $scope.curPage = 0;
        $scope.UpdateOnly = false;
        $scope.ddlState = $scope.ddlSite = $scope.ddlTurbine = $scope.ddlDMTitle = $scope.ddlStatus = $scope.AnalyzingStatus = $scope.TDId = "0";
        $scope.txtDesc = $scope.txtTurbine = ""; $("#hfTurbine").val("0");
        $('#btnsave').text('Save');
        LoadSite("4", "2");
    }

    function loadDMTitle() {
        var GetDMTitle = {
            View: "0",
            RefId: "0"
        }
        var promisePost = CIR_OperationService.postCommonService(GetDMMasterUrl, GetDMTitle);
        promisePost.then(function (pl) {
            $scope.DMTitleDropdownArray = pl.data.result;
        });
    }

    function LoadSite(refId, view) {
        var CollectionModel = {
            RefId: refId,
            View: view
        };
        var promisePost = CIR_OperationService.postCommonService(GetSubMasterCollectionSpecificationUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.SiteArray = pl.data.result.CollectionDetailsSpecification;
        }, function (err) {
            console.log("Err", +err);
        });
    };

    function LoadState() {
        var CollectionModel = {
            RefId: "3",
            View: "2"
        };
        var promisePost = CIR_OperationService.postCommonService(GetSubMasterCollectionSpecificationUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.StateArray = pl.data.result.CollectionDetailsSpecification;
        }, function (err) {
            console.log("Err", +err);
        });
    };

    function LoadAnalyzingstatus() {
        var StatusModel = {
            RefId: "0",
            View: "8"
        };
        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.AnalyzingStatusArray = pl.data.result;
        }, function (err) {
            console.log("Err" + err);
        });
    }

    function LoadStatus() {

        var StatusModel = {
            RefId: "0",
            View: "7"
        };

        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.StatusArray = pl.data.result;
        }, function (err) {
            console.log("Err" + err);
        });
    };

    function LoadTurbine() {
        var TurbineModel = {
            Site: $scope.Site == null ? "0" : $scope.Site,
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
        promisePost.then(function (pl) {
            $scope.TurbineArray = pl.data.result;
        }, function (err) {
            console.log("Err" + err);
        });
    };

    function LoadGridata() {
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetTurbineDataEntyurl, '');
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.TurbineDataEntryArray = pl.data.result;
            $scope.TurbineDataEntryArrayFiltered = $scope.TurbineDataEntryArray;

        });
    }

    $scope.ddlStateChange = function () {
        $scope.UpdateOnly = false;
        $('#txtTurbine').val('');
        $('#hfTurbine').val('0');
        if ($scope.ddlState != "0") {
            var CollectionModel = {
                RefId: $scope.ddlState,
                View: "1"
            };
            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {

                $scope.SiteArray = pl.data.result;
            }, function (err) {
                console.log("Err" + err);
            });
        }
        else {
            LoadSite("4", "2");
        }
    }

    $scope.sortType = 'Tool'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        if ($scope.DSId == "0") {
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

    $scope.searchTurbine = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.TurbineDataEntryArray != undefined)
            return Math.ceil($scope.TurbineDataEntryArray.length / $scope.pageSize);
    };

    $scope.$watch('searchTurbine', function (val) {
        $scope.TurbineDataEntryArray = $filter('filter')($scope.TurbineDataEntryArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.TurbineDataEntryArray != undefined)
            $scope.curPage = (Math.ceil($scope.TurbineDataEntryArray.length / $scope.pageSize) - 1);
    }

});

angular.module('CIRModule').filter('pagination', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    };
});

