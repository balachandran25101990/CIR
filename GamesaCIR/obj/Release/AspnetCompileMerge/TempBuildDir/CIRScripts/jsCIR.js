app.controller('CIR_OperController', function ($scope, CIR_OperationService) {

    $scope.DateOfFailure = "";
    $scope.AlarmCode = "";
    $scope.DescriptionForFile = "";
    $scope.ACode = "";
    $scope.EngineerSapId = "";
    $scope.SoftwareVersion = "";
    $scope.FwVersion = "";
    $scope.WtgStatus = "0";
    $scope.WtgStopTime = "";
    $scope.WtgRunTime = "";
    $scope.Production = "";
    $scope.RunHours = "";
    $scope.FunctionalSystem = "0";
    $scope.ComponentGroup = "0";
    $scope.GamesaPartCode = "";
    $scope.ComponentMake = "";
    $scope.FailureDuring = "0";
    $scope.SerialNumber = "";
    $scope.Customer = "";
    $scope.Site = "";
    $scope.Doc = "";
    $scope.WtgType = "";
    $scope.Temp = "";
    $scope.Dust = "";
    $scope.Corrosion = "";
    $scope.THeight = "";
    $scope.Blade = "";
    $scope.Generator = "";
    $scope.GearBox = "";
    $scope.FomName = "";
    $scope.EngineerName = "";
    $scope.ApprovalStatus = "";
    $scope.MobileNo = "";
    $scope.EmailId = "";
    $scope.TurbineId = "0";
    $scope.State = "";
    $scope.TurbineName = "";
    $scope.CIRNumber = "";
    $scope.CIRNumberId = "0";
    $scope.ConsequentialProblem = "";
    $scope.What = "";
    $scope.When = "";
    $scope.Who = "";
    $scope.Where = "";
    $scope.Why = "";
    $scope.HowToDo = "";
    $scope.HowMuch = "";
    $scope.Description = "";
    $scope.Problem = "";
    $scope.ActionDesc = "";
    $scope.CAId = "";
    $scope.Comments = "";
    $scope.Status = "";
    $scope.ShowAssign = true;
    $scope.divShowAssign = "";
    $scope.WtgRunTimeTimer = "";
    $scope.WtgStopTimeTimer = "";
    $scope.IsQuality = false;
    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.AddOrUpdate = true;
    $scope.UpdateOnly = false;
    $scope.CStatus = "";
    $scope.WTGTypeId = "";
    $scope.WONumber = "";
    $scope.SoftwareVersionId = "0";
    $scope.FwVersionId = "0";
    $scope.AlarmDescription = "";
    $scope.AssignTo = "0";
    $scope.Status = "0";
    $scope.IsMyPending = true;
    $scope.ddlFomName = "0";

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
            pageName: "CIR"
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

    function fnLoadCIRDetails() {
        if ($("#hdnCIRNumber").val() != "0") {
            $scope.LoadCIRDetails();
            $scope.IsMyPending = $("#hdnIsMyPending").val() != "1" ? true : false;
            $("#liTurbineData").removeClass("active");
            $("#liComments").addClass("active");
            $("#turbineData").removeClass("tab-pane fade in active");
            $("#turbineData").addClass("tab-pane fade");
            $("#Comments").removeClass("tab-pane fade");
            $("#Comments").addClass("tab-pane fade in active");
        }
    }

    $scope.LoadStateBasedOnSite = function () {
        $scope.UpdateOnly = false;
        if ($("#hdnSite").val() != "") {

            var CollectionModel = {
                RefId: $("#hdnSite").val(),
                View: "3"
            };
            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {

                if (pl.data.result[0].Name != undefined) {
                    $scope.State = pl.data.result[0].Name;
                    $("#hdnState").val(pl.data.result[0].MCId);

                }
            }, function (err) {
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
            $("#hdnTurbine").val("0");
            $scope.TurbineName = "";
        }
    };

    $scope.ClearState = function () {
        $scope.UpdateOnly = false;
        if ($("#txtState").val() == "")
            $("#hdnState").val("0");

    }

    $scope.LoadCIRDetails = function () {
        $scope.UpdateOnly = false;
        if ($("#hdnCIRNumber").val() != "0") {
            fnLoadGif();
            var Data = {
                cirId: $("#hdnCIRNumber").val()
            };
            var promisePost = CIR_OperationService.postCommonService(GetCIRDetailsUrl, Data);
            promisePost.then(function (pl) {

                if (pl.data.result.CIRDetail != undefined) {

                    $scope.CIRNumberId = pl.data.result.CIRDetail.CIRId;
                    $scope.CIRNumber = pl.data.result.CIRDetail.CIRNumber;
                    $scope.ACode = pl.data.result.CIRDetail.ACode;
                    $scope.State = pl.data.result.CIRDetail.StateName;
                    $scope.Site = pl.data.result.CIRDetail.TSite;
                    $scope.TurbineName = pl.data.result.CIRDetail.Turbine;
                    $("#hdnTurbine").val(pl.data.result.CIRDetail.TbnId);
                    $scope.DateOfFailure = pl.data.result.CIRDetail.DateOfFailure;
                    $("#hdnAlarmCode").val(pl.data.result.CIRDetail.AlarmCode);
                    $scope.AlarmCode = pl.data.result.CIRDetail.AlarmCode;
                    $scope.SoftwareVersion = pl.data.result.CIRDetail.SwVersion;
                    $scope.SoftwareVersionId = pl.data.result.CIRDetail.SWVersionId;
                    $scope.FwVersion = pl.data.result.CIRDetail.HwVersion;
                    $scope.FwVersionId = pl.data.result.CIRDetail.HwVersionId;
                    $scope.WtgStatus = pl.data.result.CIRDetail.WTGStatusId;
                    $scope.AlarmDescription = pl.data.result.AlarmDesc;

                    if (pl.data.result.CIRDetail.WTGStartTime != "") {
                        $scope.WtgRunTime = pl.data.result.CIRDetail.WTGStartTime.split(' ')[0];
                        $scope.WtgRunTimeTimer = pl.data.result.CIRDetail.WTGStartTime.split(' ')[1];
                    }
                    if (pl.data.result.CIRDetail.WTGStopTime != "") {
                        $scope.WtgStopTime = pl.data.result.CIRDetail.WTGStopTime.split(' ')[0];
                        $scope.WtgStopTimeTimer = pl.data.result.CIRDetail.WTGStopTime.split(' ')[1];
                    }
                    $scope.Production = pl.data.result.CIRDetail.Production;
                    $scope.RunHours = pl.data.result.CIRDetail.RunHrs;
                    $scope.EngineerName = pl.data.result.CIRDetail.Employee;
                    $scope.EngineerSapId = pl.data.result.CIRDetail.EngineerSapId;
                    $scope.FunctionalSystem = pl.data.result.CIRDetail.FSId;
                    $scope.ComponentGroup = pl.data.result.CIRDetail.CGId;
                    $scope.GamesaPartCode = pl.data.result.CIRDetail.PartCode;
                    $scope.ComponentMake = pl.data.result.CIRDetail.ComponentMake;
                    $scope.FailureDuring = pl.data.result.CIRDetail.FDId;
                    $scope.SerialNumber = pl.data.result.CIRDetail.SerialNumber;
                    $scope.Problem = pl.data.result.CIRDetail.ProblemDesc;
                    $scope.ConsequentialProblem = pl.data.result.CIRDetail.Consequence;
                    $scope.What = pl.data.result.CIRDetail.What;
                    $scope.When = pl.data.result.CIRDetail.When1;
                    $scope.Who = pl.data.result.CIRDetail.Who;
                    $scope.Where = pl.data.result.CIRDetail.Where1;
                    $scope.Why = pl.data.result.CIRDetail.Why;
                    $scope.HowToDo = pl.data.result.CIRDetail.HowTodo;
                    $scope.HowMuch = pl.data.result.CIRDetail.Howmuch;
                    $scope.ApprovalStatus = pl.data.result.CIRDetail.CStatus == "" ? "Open" : pl.data.result.CIRDetail.CStatus;
                    $scope.WONumber = pl.data.result.CIRDetail.WONumber;
                    $scope.AlarmDescription = pl.data.result.CIRDetail.AlarmDesc;
                    //$scope.MobileNo = pl.data.result.CIRDetail.FEMobileNo;

                    ddlFomNameLoadsnew();
                    $scope.MobileNo = pl.data.result.CIRDetail.FOMMobileNo;
                    $scope.ddlFomName = pl.data.result.CIRDetail.FOM;
                    $scope.EmailId = pl.data.result.CIRDetail.FOMEmail;
                    $scope.LoadTurbineDetails();
                }
                if (pl.data.result.CIRFileDetail != undefined) {

                    $scope.CIRFilesArray = pl.data.result.CIRFileDetail;

                }
                LoadStatus();
                if (pl.data.result.CIRComments != undefined) {
                    $scope.CIRCommentsArray = pl.data.result.CIRComments;
                }
                fnRemoveGif();
                LoadActionPerformed();


            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $scope.CIRNumberId = "0";
        }
    };

    function ddlFomNameLoads() {
        var CollectionModel = {
            TbnId: $("#hdnTurbine").val()
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionFomNameUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.ddlFomNameLoadArray = pl.data.result.lst1;
            if (pl.data.result.lst1.length > 0) {
                $scope.ddlFomName = pl.data.result.lst1[0].EmpId.toString();
                $scope.LoadFOMNameDetails(pl.data.result.lst1[0].EmpId.toString());
            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function ddlFomNameLoadsnew() {
        var CollectionModel = {
            TbnId: $("#hdnTurbine").val()
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionFomNameUrl, CollectionModel);
        promisePost.then(function (pl) {

            $scope.ddlFomNameLoadArray = pl.data.result.lst1;
            if (pl.data.result.lst1.length > 0) {
                $scope.ddlFomName = pl.data.result.lst1[0].EmpId.toString();
                $scope.LoadFOMNameDetails(pl.data.result.lst1[0].EmpId.toString());
            }
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.LoadFOMNameDetails = function (ddlFomName) {
        $scope.UpdateOnly = false;
        if (ddlFomName != "0") {
            var EmployeeModel = {
                EmpId: ddlFomName,
                View: "1",
                Text: ""
            };
            var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, EmployeeModel);
            promisePost.then(function (pl) {
                $scope.EmailId = pl.data.result.EmployeeDetail[0].Email;
                $scope.MobileNo = pl.data.result.EmployeeDetail[0].OMobile;
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

            });
        }
        else {
            $scope.EmailId = "";
            $scope.MobileNo = "";
        }
    }

    $scope.LoadTurbineDetails = function () {
        $scope.UpdateOnly = false;
        if ($("#hdnTurbine").val() != "0") {
            fnLoadGif();

            var TurbineModel = {
                Site: $("#hdnSite").val(),
                TurbineId: $("#hdnTurbine").val(),
                View: "1",
                Text: "",
                formType: "1"
            };
            var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
            promisePost.then(function (pl) {

                if (pl.data.result.TurbineDetails != undefined) {
                    $scope.TurbineName = $("#txtTurbine").val();
                    $scope.Customer = pl.data.result.TurbineDetails.CustomerName;
                    $scope.State = pl.data.result.TurbineDetails.StateName;
                    $scope.Site = pl.data.result.TurbineDetails.SiteName;
                    $scope.DOC = pl.data.result.TurbineDetails.DOC;
                    $scope.WtgType = pl.data.result.TurbineDetails.WTGTypeName;
                    $scope.Temp = pl.data.result.TurbineDetails.Tempname;
                    $scope.Dust = pl.data.result.TurbineDetails.DustName;
                    $scope.Corrosion = pl.data.result.TurbineDetails.Corrosion;
                    $scope.THeight = pl.data.result.TurbineDetails.TowerHeightName;
                    $scope.Blade = pl.data.result.TurbineDetails.BladeName;
                    $scope.Generator = pl.data.result.TurbineDetails.Generator;
                    $scope.GearBox = pl.data.result.TurbineDetails.GearBox;
                    if ($scope.EngineerName == "") {
                        $scope.EngineerName = pl.data.result.TurbineDetails.Employee;
                    }
                    if ($scope.EngineerSapId == "") {
                        $scope.EngineerSapId = pl.data.result.TurbineDetails.EngineerSapId;
                    }

                    // if ($scope.CIRNumber == "") {
                    //ddlFomNameLoads();
                    ddlFomNameLoadsnew();
                    if ($scope.ddlFomName != "0") {
                        var EmployeeModel = {
                            EmpId: $scope.ddlFomName,
                            View: "1",
                            Text: ""
                        };
                        var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, EmployeeModel);
                        promisePost.then(function (pl) {
                            $scope.EmailId = pl.data.result.EmployeeDetail[0].Email;
                            $scope.MobileNo = pl.data.result.EmployeeDetail[0].OMobile;
                        }, function (err) {
                            SetWarningMessage("Transaction Issue. Please try again.");
                            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                        });
                    }
                    //$scope.EmailId = pl.data.result.TurbineDetails.EMAIL;
                    //}
                        
                    $scope.ApprovalStatus = $scope.CStatus == "" ? "Open" : $scope.CStatus;
                    $scope.WTGTypeId = pl.data.result.TurbineDetails.WTGType;
                    $("#hdnWtgTypeId").val(pl.data.result.TurbineDetails.WTGType);
                }
                if ($("#hdnCIRNumber").val() == "0") {
                    if (pl.data.result.CIRNumber != undefined) {
                        $scope.CIRNumber = pl.data.result.CIRNumber.UniqueNo;
                    }
                }

                var date = new Date();

                if ($scope.WtgRunTimeTimer == "")
                    $scope.WtgRunTimeTimer = date.getHours() + ":" + (((parseInt(date.getMinutes())).toString().length != 1) ? (parseInt(date.getMinutes())) : '0' + (parseInt(date.getMinutes())));
                if ($scope.WtgStopTimeTimer == "")
                    $scope.WtgStopTimeTimer = date.getHours() + ":" + (((parseInt(date.getMinutes())).toString().length != 1) ? (parseInt(date.getMinutes())) : '0' + (parseInt(date.getMinutes())));


                fnRemoveGif();
            }, function (err) {
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }

    };

    $scope.LoadEmployeeDetails = function () {
        $scope.UpdateOnly = false;
        var EmployeeModel = {
            EmpId: $("#hdnEngineerSapId").val(),
            View: "1",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, EmployeeModel);
        promisePost.then(function (pl) {
            $scope.EngineerName = pl.data.result[0].Employee;
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the employee details : " + err);
        });
    };

    $scope.SaveCIR = function () {
        $scope.UpdateOnly = false;
        if ($scope.CIRNumber == "") {
            SetErrorMessage("Ensure CIR number!");
            return false;
        }

        if ($scope.TurbineName == "") {
            SetErrorMessage("Ensure Turbine!");
            return false;
        }
        if ($("#hdnAlarmCode").val() == "") {
            if ($scope.AlarmDescription == "") {
                SetErrorMessage("Ensure AlarmCode");
                return false;
            }
        }

        if ($scope.FunctionalSystem == "0") {
            SetErrorMessage("Ensure Functional System.");
            return false;
        }

        if ($scope.ComponentGroup == "0") {
            SetErrorMessage("Ensure Component Group.");
            return false;
        }

        if ($scope.FailureDuring == "0") {
            SetErrorMessage("Ensure Failure During.");
            return false;
        }
        fnLoadGif();
        var CIRModel = {
            CIRId: $scope.CIRNumberId,
            CIRNumber: $scope.CIRNumber,
            TbnId: $("#hdnTurbine").val(),
            DateOfFailure: $scope.DateOfFailure,
            AlarmCode: $("#hdnAlarmCode").val(),
            EmpId: $scope.EngineerSapId,
            SwVersion: $scope.SoftwareVersionId,
            HwVersion: $scope.FwVersionId,
            WTGStatus: $scope.WtgStatus,
            WTGStartTime: $scope.WtgRunTime + " " + ($scope.WtgRunTimeTimer == undefined ? "00:00" : $scope.WtgRunTimeTimer),
            WTGStopTime: $scope.WtgStopTime + " " + ($scope.WtgStopTimeTimer == undefined ? "00:00" : $scope.WtgStopTimeTimer),
            Production: $scope.Production == "" ? "0" : $scope.Production,
            RunHrs: $scope.RunHours == "" ? "0" : $scope.RunHours,
            FuncSystem: $scope.FunctionalSystem,
            ComponentGroup: $scope.ComponentGroup,
            PartCode: $scope.GamesaPartCode,
            ComponentMake: $scope.ComponentMake,
            FailureDuring: $scope.FailureDuring,
            SerialNumber: $scope.SerialNumber,
            WONumber: $scope.WONumber,
            AlarmDesc: $scope.AlarmDescription,
            FOM: $scope.ddlFomName
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIRUrl, CIRModel);
        promisePost.then(function (pl) {

            if (pl.data.result.MessageInfo.Clear == "True") {
                SetSuccessMessage(pl.data.result.MessageInfo.Msg);
                $("#liTurbineData").removeClass("active");
                $("#liProblem").addClass("active");
                $("#turbineData").removeClass("tab-pane fade in active");
                $("#turbineData").addClass("tab-pane fade");
                $("#problem").removeClass("tab-pane fade");
                $("#problem").addClass("tab-pane fade in active");
                $scope.CIRNumberId = pl.data.result.CIRData.CIRId;
                $scope.CIRNumber = pl.data.result.CIRData.CIRNumber;
                LoadStatus();
            }
            else {
                SetErrorMessage(pl.data.result.MessageInfo.Msg);
            }
            
            fnRemoveGif();
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.ClearCIR = function () {
        $scope.UpdateOnly = false;
        $scope.DateOfFailure = "";
        $scope.ACode = "";
        $scope.EngineerSapId = "";
        $scope.SoftwareVersion = "";
        $scope.FwVersion = "";
        $scope.WtgStatus = "0";
        $scope.WtgStopTime = "";
        $scope.WtgRunTime = "";
        $scope.Production = "";
        $scope.RunHours = "";
        $scope.FunctionalSystem = "0";
        $scope.ComponentGroup = "0";
        $scope.GamesaPartCode = "";
        $scope.ComponentMake = "";
        $scope.FailureDuring = "0";
        $scope.SerialNumber = "";
        $scope.Customer = "";
        $scope.Site = "";
        $scope.DOC = "";
        $scope.WtgType = "";
        $scope.Temp = "";
        $scope.Dust = "";
        $scope.Corrosion = "";
        $scope.THeight = "";
        $scope.Blade = "";
        $scope.Generator = "";
        $scope.GearBox = "";
        $scope.FomName = "";
        $scope.EngineerName = "";
        $scope.ApprovalStatus = "";
        $scope.MobileNo = "";
        $scope.EmailId = "";
        $scope.TurbineId = "0";
        $scope.State = "";
        $scope.TurbineName = "";
        $scope.CIRNumber = "";
        $scope.CIRNumberId = "0";
        $scope.WtgRunTimeTimer = "";
        $scope.WtgStopTimeTimer = "";
        $scope.WONumber = "";
        $("#hdnCIRNumber").val("0");
        $("#hdnState").val("0");
        $("#hdnSite").val("0");
        $("#hdnTurbine").val("0");
        $scope.SoftwareVersionId = "0";
        $scope.FwVersionId = "0";
        $scope.AlarmDescription = "";
        $scope.ddlFomName = "0";
        $scope.ddlFomNameLoadArray = "";
        LoadFunctionalSystem();
        LoadComponentGroup();
        LoadFailureDuring();
    };

    $scope.SaveProblem = function () {
        $scope.UpdateOnly = false;
        if ($scope.Problem == "") {
            SetErrorMessage("Ensure Problem.");
            return false;
        }
        fnLoadGif();
        var CIRProblem = {
            Problem: $scope.Problem,
            CIRId: $scope.CIRNumberId
        }
        var promisePost = CIR_OperationService.postCommonService(SaveCIRProblemUrl, CIRProblem);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                $("#liProblem").removeClass("active");
                $("#liAction").addClass("active");
                $("#problem").removeClass("tab-pane fade in active");
                $("#problem").addClass("tab-pane fade");
                $("#action").removeClass("tab-pane fade");
                $("#action").addClass("tab-pane fade in active");
                LoadActionPerformed();
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

    $scope.ClearProblem = function () {
        $scope.UpdateOnly = false;
        $scope.Problem = "";
    };

    $scope.SaveAction = function () {
        if ($scope.ActionDesc == "") {
            SetErrorMessage("Ensure description!");
            return false;
        }

        fnLoadGif();
        var ActionModel = {
            CIRId: $scope.CIRNumberId,
            ActionDesc: $scope.ActionDesc,
            DelFlag: "0",
            CAId: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIRActionUrl, ActionModel);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage(pl.data.result.Msg);
                LoadActionPerformed();
                $scope.ClearAction();
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

    function LoadActionPerformed() {
        var Data = {
            cirId: $scope.CIRNumberId
        };
        var promisePost = CIR_OperationService.postCommonService(GetCIRDetailsUrl, Data);
        promisePost.then(function (pl) {

            $scope.ActionPerformedArray = pl.data.result.CIRActionDetail;

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteAction = function (CAId) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var CIRAction = {
            CAId: CAId,
            CIRId: $scope.CIRNumberId,
            ActionDesc: "",
            DelFlag: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(SaveCIRActionUrl, CIRAction);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {

                SetSuccessMessage(pl.data.result.Msg);
                LoadActionPerformed();
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

    $scope.ClearAction = function () {
        $scope.UpdateOnly = false;
        $scope.ActionDesc = "";
    };

    $scope.SaveFullAction = function () {
        $scope.UpdateOnly = false;
        $("#liAction").removeClass("active");
        $("#liconsProblem").addClass("active");
        $("#action").removeClass("tab-pane fade in active");
        $("#action").addClass("tab-pane fade");
        $("#consProblem").removeClass("tab-pane fade");
        $("#consProblem").addClass("tab-pane fade in active");
    }

    $scope.SaveConsequence = function () {
        fnLoadGif();
        var CIRConsequence = {
            Consequence: $scope.ConsequentialProblem,
            CIRId: $scope.CIRNumberId
        }
        var promisePost = CIR_OperationService.postCommonService(SaveCIRConsequentialUrl, CIRConsequence);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage(pl.data.result.Msg);
                $("#liconsProblem").removeClass("active");
                $("#li5W2H").addClass("active");
                $("#consProblem").removeClass("tab-pane fade in active");
                $("#consProblem").addClass("tab-pane fade");
                $("#5W2H").removeClass("tab-pane fade");
                $("#5W2H").addClass("tab-pane fade in active");

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
    }

    $scope.ClearConsequence = function () {
        $scope.UpdateOnly = false;
        $scope.ConsequentialProblem = "";
    }

    $scope.Save5W2H = function () {
        fnLoadGif();
        var CIR5W2H = {
            What: $scope.What,
            Where: $scope.Where,
            When: $scope.When,
            Who: $scope.Who,
            Why: $scope.Why,
            HowToDo: $scope.HowToDo,
            Howmuch: $scope.HowMuch,
            CIRId: $scope.CIRNumberId
        }
        var promisePost = CIR_OperationService.postCommonService(SaveCIR5W2HUrl, CIR5W2H);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage(pl.data.result.Msg);
                $("#li5W2H").removeClass("active");
                $("#liPhotos").addClass("active");
                $("#5W2H").removeClass("tab-pane fade in active");
                $("#5W2H").addClass("tab-pane fade");
                $("#Photos").removeClass("tab-pane fade");
                $("#Photos").addClass("tab-pane fade in active");
                LoadActionPerformed();
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
    }

    $scope.Clear5W2H = function () {
        $scope.UpdateOnly = false;
        $scope.What = "";
        $scope.Where = "";
        $scope.When = "";
        $scope.Who = "";
        $scope.Why = "";
        $scope.HowToDo = "";
        $scope.HowMuch = "";
    };

    $scope.SaveFiles = function () {
        $scope.UpdateOnly = false;
        if ($("#fuFile").val() == "") {
            SetErrorMessage("Ensure File!");
            return false;
        }
        fnLoadGif();
        var Data = {
            cirId: $scope.CIRNumberId,
            description: $scope.DescriptionForFile,
            cirNumber: $scope.CIRNumber
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIRFilesOnlyUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.MessageInfo.Clear == "True") {
                SetSuccessMessage(pl.data.result.MessageInfo.Msg);
                $scope.LoadCIRFileDetails();
                $scope.ClearFiles();
            }
            else {
                SetErrorMessage(pl.data.result.MessageInfo.Msg);
            }

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.SaveImages = function () {
        $scope.UpdateOnly = false;
        if ($("#fuImage").val() == "") {
            SetErrorMessage("Ensure File!");
            return false;
        }
        fnLoadGif();
        var Data = {
            cirId: $scope.CIRNumberId,
            description: $scope.Description,
            cirNumber: $scope.CIRNumber
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIRFilesUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.MessageInfo.Clear == "True") {
                SetSuccessMessage(pl.data.result.MessageInfo.Msg);
                $scope.LoadCIRFileDetails();
                $scope.ClearImagesFull();
            }
            else {
                SetErrorMessage(pl.data.result.MessageInfo.Msg);
            }

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.LoadCIRFileDetails = function () {
        $scope.UpdateOnly = false;
        var Data = {
            cirId: $scope.CIRNumberId
        };
        var promisePost = CIR_OperationService.postCommonService(GetCIRDetailsUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.CIRFileDetail != undefined) {
                $scope.CIRFilesArray = pl.data.result.CIRFileDetail;

            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.DeleteCIRDoc = function (CFId, FileName) {
        $scope.UpdateOnly = false;
        fnLoadGif();
        var Data = {
            cirId: $scope.CIRNumberId,
            CFId: CFId,
            fileName: FileName,
            CIRNumber: $scope.CIRNumber
        };
        var promisePost = CIR_OperationService.postCommonService(DeleteCIRFilesUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                $scope.LoadCIRFileDetails();
                $scope.ClearFiles();
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

    $scope.ClearFiles = function () {
        $scope.UpdateOnly = false;
        $("#fuFile").val("");
        $scope.DescriptionForFile = "";
    };

    $scope.SaveFilesFull = function () {
        $scope.UpdateOnly = false;
        $("#liFiles").removeClass("active");
        $("#liComments").addClass("active");
        $("#files").removeClass("tab-pane fade in active");
        $("#files").addClass("tab-pane fade");
        $("#Comments").removeClass("tab-pane fade");
        $("#Comments").addClass("tab-pane fade in active");
    };

    $scope.SaveImagesFull = function () {
        $scope.UpdateOnly = false;
        $("#liPhotos").removeClass("active");
        $("#liFiles").addClass("active");
        $("#Photos").removeClass("tab-pane fade in active");
        $("#Photos").addClass("tab-pane fade");
        $("#files").removeClass("tab-pane fade");
        $("#files").addClass("tab-pane fade in active");
    };

    $scope.ClearImagesFull = function () {
        $("#fuImage").val("");
        $scope.Description = "";
        $scope.UpdateOnly = false;
    }

    $scope.SaveComments = function () {
        
        if ($scope.Comments == "") {
            SetErrorMessage("Ensure Comments!");
            return false;
        }
        if ($scope.Status == "") {
            SetErrorMessage("Ensure Status!");
            return false;
        }
        var assignTo = "0";
        if ($("#divAssignTo").css("display") != "none") {
            assignTo = $scope.AssignTo;
            if ($scope.AssignTo == "0") {
                SetErrorMessage("Ensure Assign To !");
                return false;
            }
        }
        if ($scope.Problem == "") {
            SetErrorMessage("Ensure problem in Problem Tab!");
            return false;
        }

        if ($scope.ActionPerformedArray == "") {
            SetErrorMessage("Ensure Action Perfromed!");
            return false;
        }
        fnLoadGif();
        var cAId = "0";
        if ($scope.CIRCommentsArray != undefined) {
            if ($scope.CIRCommentsArray.length != 0) {
                var CommentsArray = $scope.CIRCommentsArray;
                cAId = CommentsArray[CommentsArray.length - 1].CAId;
            }
        }

        var Data = {
            cirId: $scope.CIRNumberId,
            crId: cAId,
            comments: $scope.Comments,
            assignedTo: assignTo,
            toDpt: "0",
            cStatus: $scope.Status,
            convertToNCR: ($("#btnSaveComments").text() == "Convert To NCR" || $("#btnSaveComments").text() == "Completed") ? true : false,
            delFlag: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIRCommentsUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                $scope.UpdateOnly = false;
                SetSuccessMessage(pl.data.result.Msg);
                window.location.href = DashBoardUrl;
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

    $scope.ClearComments = function () {
        $scope.Status = "0";
        $scope.Comments = "";
        $scope.AssignTo = "0";
        $scope.UpdateOnly = false;
    }

    function LoadNotificationDetails() {
        var promisePost = CIR_OperationService.getService(NotificationDetailsUrl);
        promisePost.then(function (pl) {

            $scope.Notification = pl.data.result.NotificationDetails.MyPendings;
            $("#spnNotification").text(pl.data.result.NotificationDetails.MyPendings);

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

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
    };

    function LoadWtgStatus() {

        var CollectionModel = {
            RefId: "1360",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {

            $scope.WtgStatusArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadCIR() {
        var Data = {
            txt: "",
            refId: "0",
            viewType: "9"
        };
        var promisePost = CIR_OperationService.postCommonService(GetCIRUrl, Data);
        promisePost.then(function (pl) {
            $scope.CIRArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadComponentGroup() {
        var CollectionModel = {
            RefId: "9",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.ComponentGroupArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadFailureDuring() {
        var CollectionModel = {
            RefId: "19",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.FailureDuringArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadSoftwareVersion() {
        var CollectionModel = {
            RefId: "1368",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.SoftwareVersionArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadHardwareVersion() {
        var CollectionModel = {
            RefId: "1369",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.FwVersionArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
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
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.LoadIsAutoAssignOrNot = function () {
        debugger;
        fnLoadGif();
        var StatusModel = {
            Id: "0",
            StsId: $scope.Status,
            IDType: "0",
            view: "2"
        };

        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.ShowAssign = pl.data.result.Status.AutoAssign;
            if ($scope.ShowAssign == "True")
                $("#divAssignTo").css("display", "none");
            else
                $("#divAssignTo").css("display", "");
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        fnLoadGif();
        var StatusModel = {
            Id: $scope.CIRNumberId,
            StsId: $scope.Status,
            IDType: "1",
            view: "3"
        };

        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {

            $scope.AssignToArray = pl.data.result.StatusModels;

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the assigned to details : " + err);
        });

        fnLoadGif();
        var StatusModel = {
            Id: "0",
            StsId: $scope.Status,
            IDType: "0",
            view: "2"
        };

        var promisePost = CIR_OperationService.postCommonService(SetStatusBasedOnDesignationUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.IsQuality = pl.data.bIsQuality
            if ($("#ddlStatus").val() == "6") {
                $("#btnSaveComments").text("Convert To NCR");
                $("#divAssignTo").css("display", "none");
            } else if ($("#ddlStatus").val() == "9") {
                $("#btnSaveComments").text("Completed");
                $("#divAssignTo").css("display", "none");
            } else {
                $("#btnSaveComments").text("Submit");
                $("#divAssignTo").css("display", "");
            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });


    };

    $scope.DownloadFile = function (Index) {
        $scope.UpdateOnly = false;
        var row = $scope.CIRFilesArray[Index];
        var Data = {
            fileName: row.CFileName,
            cirNumber: $scope.CIRNumber
        };
        var promisePost = CIR_OperationService.postCommonService(DownloadFileUrl, Data);
        promisePost.then(function (pl) {
            var data = "";
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.DeleteComments = function () {
        $scope.UpdateOnly = false;
        var Data = {
            cirId: $scope.CIRNumberId,
            crId: "",
            comments: $("#txtDeleteComments").val(),
            assignedTo: "0",
            toDpt: "0",
            cStatus: "0",
            convertToNCR: false,
            delFlag: "1",
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIRCommentsUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                $("#myDeleteCIRModal").modal('hide');
                SetSuccessMessage(pl.data.result.Msg);
                window.location.href = DashBoardUrl;
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
    }

    fnLoadCIRDetails();
    LoadFunctionalSystem();
    LoadComponentGroup();
    LoadFailureDuring();
    LoadWtgStatus();
    LoadSoftwareVersion();
    LoadHardwareVersion();


});