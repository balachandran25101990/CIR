app.controller('CIM_OperController', function ($scope, CIR_OperationService) {

    $scope.DateOfFailure = "";
    $scope.AlarmCode = "";
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
    $scope.StateId = "";
    $scope.TurbineName = "";
    $scope.CIMNumber = "";
    $scope.CIMNumberId = "0";
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
    $scope.Status = "0";
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
    $scope.DescriptionForSuggestion = "";
    $scope.WTGTypeId = "";
    $scope.SFileName = "";
    $scope.SDesc = "";
    $scope.AlarmDescription = "";
    $scope.SoftwareVersionId = "0";
    $scope.FwVersionId = "0";
    $scope.AlarmDescription = "";
    $scope.TDOC = "";

    $scope.StateId = "0";
    $scope.SiteId = "0";
    $scope.TurbineId = "0";
    $scope.AlarmCodeId = "0";
    $scope.CustomerId = "0";
    $scope.WtgTypeIdsId = "0";
    $scope.TempIdsId = "0";
    $scope.DustIdsId = "0";
    $scope.CorrosionIdsId = "0";
    $scope.THeightIdsId = "0";
    $scope.BladeIdsId = "0";
    $scope.GeneratorIdsId = "0";
    $scope.FOMNameIdsId = "0";
    $scope.StateValue = "";
    $scope.TurbineNameValue = "";
    $scope.SiteValue = "";
    $scope.ActionPerformedArray = [];
    $scope.IsMyPending = true;
    $scope.AssignTo = "0";
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
            pageName: "FSR"
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

    $scope.ClearState = function () {

        if ($("#txtState").val() == "")
            $("#hdnState").val("0");
        else {
            $scope.StateValue = $("#txtState").val();
        }
    }

    $scope.LoadStateBasedOnSite = function () {
        $scope.ApprovalStatus = "Open";
        if ($("#hdnSite").val() != "") {
            $scope.SiteValue = $("#txtSite").val()
            var CollectionModel = {
                RefId: $("#hdnSite").val(),
                View: "3"
            };
            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {

                if (pl.data.result[0] != undefined) {
                    $scope.State = pl.data.result[0].Name;
                    $("#hdnState").val(pl.data.result[0].MCId);

                }
            }, function (err) {
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in loading the state based on the site : " + err);
            });
            $("#hdnTurbine").text("0");
            $scope.TurbineName = "";
            $("#txtSiteName").text($("#txtSite").text());

            if ($scope.CIMNumberId == "0") {
                var promisePost = CIR_OperationService.postCommonService(GetUniqieNumberGenerationUrl, "");
                promisePost.then(function (pl) {
                    if (pl.data.result.CIMNumber != undefined) {
                        $scope.CIMNumber = pl.data.result.CIMNumber.UniqueNo;
                    }
                }, function (err) {
                    fnRemoveGif();
                    SetWarningMessage("Transaction Issue. Please try again.");
                    $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                });
            }

        }
    };

    function ddlFomNameLoads() {
        var CollectionModel = {
            TbnId: $("#hdnTurbine").text()
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
            console.log("Error in loading the Component group details : " + err);
        });
    }

    $scope.LoadCIRDetails = function () {
        var Data = {
            cimId: $("#hdnCIRNumber").val()
        };
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetCIMDetailsUrl, Data);
        promisePost.then(function (pl) {
            if (pl.data.result.CIRDetail != undefined) {

                $scope.CIMNumberId = pl.data.result.CIRDetail.CIMId;
                $scope.CIMNumber = pl.data.result.CIRDetail.CIMNumber;

                $scope.State = pl.data.result.CIRDetail.StateName;
                $scope.StateValue = pl.data.result.CIRDetail.StateName;
                $scope.StateId = pl.data.result.CIRDetail.StateId;
                $("#hdnState").val(pl.data.result.CIRDetail.StateId);

                $scope.Site = pl.data.result.CIRDetail.TSite;
                $scope.SiteValue = pl.data.result.CIRDetail.TSite;
                $scope.SiteId = pl.data.result.CIRDetail.SiteID;
                $("#hdnSite").val(pl.data.result.CIRDetail.SiteID);

                $scope.TurbineName = pl.data.result.CIRDetail.Turbine;
                $scope.TurbineNameValue = pl.data.result.CIRDetail.Turbine;
                $("#hdnTurbine").text(pl.data.result.CIRDetail.TbnId);

                $scope.TurbineId = pl.data.result.CIRDetail.TbnId;

                $scope.DateOfFailure = pl.data.result.CIRDetail.DateOfFailure;

                $scope.ACode = pl.data.result.CIRDetail.ACode;
                $("#hdnAlarmCode").text(pl.data.result.CIRDetail.AlarmCode);
                $scope.AlarmCodeId = pl.data.result.CIRDetail.AlarmCode;
                $scope.AlarmCode = pl.data.result.CIRDetail.AlarmCode;
                $scope.AlarmDescription = pl.data.result.CIRDetail.AlarmDesc;

                $scope.SoftwareVersion = pl.data.result.CIRDetail.SwVersion;
                $scope.SoftwareVersionId = pl.data.result.CIRDetail.SWVersionId;

                $scope.FwVersion = pl.data.result.CIRDetail.HwVersion;
                $scope.FwVersionId = pl.data.result.CIRDetail.HwVersionId;

                $scope.WtgStatus = pl.data.result.CIRDetail.WTGStatusId;

                if (pl.data.result.CIRDetail.WTGStartTime != "") {
                    $scope.WtgRunTime = pl.data.result.CIRDetail.WTGStartTime.split(' ')[0];
                    $scope.WtgRunTimeTimer = pl.data.result.CIRDetail.WTGStartTime.split(' ')[1];
                }
                if (pl.data.result.CIRDetail.WTGStopTime != "") {
                    $scope.WtgStopTime = pl.data.result.CIRDetail.WTGStopTime.split(' ')[0];
                    $scope.WtgStopTimeTimer = pl.data.result.CIRDetail.WTGStopTime.split(' ')[1];
                }
                //$scope.WtgRunTime = pl.data.result.CIRDetail.WTGStartTime;
                //$scope.WtgStopTime = pl.data.result.CIRDetail.WTGStopTime;
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
                $scope.WONumber = pl.data.result.CIRDetail.WONumber;
                $scope.SFileName = pl.data.result.CIRDetail.SFilename;
                $scope.SDesc = pl.data.result.CIRDetail.SDesc;
                $scope.MobileNo = pl.data.result.CIRDetail.FEMobileNo;
                $scope.Customer = pl.data.result.CIRDetail.Customer;
                $scope.MobileNo = pl.data.result.CIRDetail.FEMobileNo;
                if (pl.data.result.CIRDetail.CmrId != "0") {
                    $("#hdnCustomer").text(pl.data.result.CIRDetail.CmrId);
                    $scope.CustomerId = pl.data.result.CIRDetail.CmrId;
                }

                $scope.State = pl.data.result.CIRDetail.StateName;

                $scope.Site = pl.data.result.CIRDetail.TSite;

                $scope.TDOC = pl.data.result.CIRDetail.TDOC;

                $scope.WtgType = pl.data.result.CIRDetail.WTGTypeName;
                if (pl.data.result.CIRDetail.WTGTypeID != "0") {
                    $("#hdnWtgType").text(pl.data.result.CIRDetail.WTGTypeID);
                    $scope.WtgTypeIdsId = pl.data.result.CIRDetail.WTGTypeID;
                }

                $scope.Temp = pl.data.result.CIRDetail.TempName;
                if (pl.data.result.CIRDetail.TempId != "0") {
                    $("#hdnTemp").text(pl.data.result.CIRDetail.TempId);
                    $scope.TempIdsId = pl.data.result.CIRDetail.TempId;
                }

                $scope.Dust = pl.data.result.CIRDetail.DustName;
                if (pl.data.result.CIRDetail.DustId != "0") {
                    $("#hdnDust").text(pl.data.result.CIRDetail.DustId);
                    $scope.DustIdsId = pl.data.result.CIRDetail.DustId;
                }

                $scope.Corrosion = pl.data.result.CIRDetail.CorrosionName;
                if (pl.data.result.CIRDetail.CorrosionId != "0") {
                    $("#hdnCorrosion").text(pl.data.result.CorrosionId);
                    $scope.CorrosionIdsId = pl.data.result.CorrosionId;
                }

                $scope.THeight = pl.data.result.CIRDetail.THeightName;
                if (pl.data.result.CIRDetail.THeightId != "0") {
                    $("#hdnTHeight").text(pl.data.result.CIRDetail.THeightId);
                    $scope.THeightIdsId = pl.data.result.CIRDetail.THeightId;
                }

                $scope.Blade = pl.data.result.CIRDetail.BladetName;
                if (pl.data.result.CIRDetail.BladeId != "0") {
                    $("#hdnBlade").text(pl.data.result.CIRDetail.BladeId);
                    $scope.BladeIdsId = pl.data.result.CIRDetail.BladeId;
                }

                $scope.Generator = pl.data.result.CIRDetail.GeneratorName;
                if (pl.data.result.CIRDetail.GRId != "0") {
                    $("#hdnGenerator").text(pl.data.result.CIRDetail.GRId);
                    $scope.GeneratorIdsId = pl.data.result.CIRDetail.GRId;
                }

                $scope.GearBox = pl.data.result.CIRDetail.GearBoxName;
                if (pl.data.result.CIRDetail.GBId != "0") {
                    $("#hdnGearBox").text(pl.data.result.CIRDetail.GBId);
                    $scope.GearBoxIdsId = pl.data.result.CIRDetail.GBId;
                }

                //$scope.ddlFomName = pl.data.result.CIRDetail.FOMName;
                ddlFomNameLoadsnew();
                $scope.MobileNo = pl.data.result.CIRDetail.FOMMobileNo;
                $scope.ddlFomName = pl.data.result.CIRDetail.FOM;
                $scope.EmailId = pl.data.result.CIRDetail.FOMEmail;
                $scope.LoadTurbineDetails();
                if (pl.data.result.CIRDetail.FOM != "0") {
                    $("#hdnFomName").text(pl.data.result.CIRDetail.FOM);
                    $scope.FOMNameIdsId = pl.data.result.CIRDetail.FOM;
                }
                if (pl.data.result.CIRDetail.TbnId != "0") {
                    fnDisabledProperty(true);
                  //  $scope.LoadTurbineDetails();
                }
                else {
                    fnDisabledProperty(false);
                }
            }
            if (pl.data.result.CIRFileDetail != undefined) {

                $scope.CIRFilesArray = pl.data.result.CIRFileDetail;

            }
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
    };

    function ddlFomNameLoadsnew() {
        var CollectionModel = {
            TbnId: $("#hdnTurbine").text()
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

    $scope.LoadFOMDetails = function () {
        var EmployeeModel = {
            EmpId: $scope.FOMNameIdsId,
            View: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmployeeDetailsUrl, EmployeeModel);
        promisePost.then(function (pl) {

            if (pl.data.result[0] != undefined) {
                $scope.EmailId = pl.data.result[0].Email;

            }
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

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

    $scope.LoadTurbineDetails = function () {

        if ($("#hdnTurbine").text() != "0") {
            if ($("txtTurbine").val() != "") {
                $scope.TurbineNameValue = $("#txtTurbine").val();
                fnLoadGif();
                var TurbineModel = {
                    Site: $("#hdnSite").val(),
                    TurbineId: $("#hdnTurbine").text(),
                    View: "1",
                    Text: "",
                    formType: "2"
                };
                var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
                promisePost.then(function (pl) {

                    if (pl.data.result.TurbineDetails != undefined) {
                        console.log(pl.data.result.TurbineDetails);
                        $scope.TurbineName = pl.data.result.TurbineDetails.TurbineId;
                        $scope.TurbineNameValue = pl.data.result.TurbineDetails.TurbineId;

                        $scope.Customer = pl.data.result.TurbineDetails.CustomerName;
                        $scope.CustomerId = pl.data.result.TurbineDetails.CmrId;
                        $("#hdnCustomer").text($scope.CustomerId);

                        $scope.State = pl.data.result.TurbineDetails.StateName;
                        $scope.StateValue = pl.data.result.TurbineDetails.StateName;
                        $scope.StateId = pl.data.result.TurbineDetails.StateId;
                        $("#hdnState").val(pl.data.result.TurbineDetails.StateId);

                        $scope.Site = pl.data.result.TurbineDetails.SiteName;
                        $scope.SiteValue = pl.data.result.TurbineDetails.SiteName;
                        $scope.SiteId = pl.data.result.TurbineDetails.TSite;
                        $("#hdnSite").val(pl.data.result.TurbineDetails.TSite);

                        $scope.DOC = pl.data.result.TurbineDetails.DOC;
                        $scope.TDOC = pl.data.result.TurbineDetails.DOC;
                        $("#txtDOC").text($scope.TDOC);

                        $scope.WtgType = pl.data.result.TurbineDetails.WTGTypeName;
                        $scope.WtgTypeIdsId = pl.data.result.TurbineDetails.WTGType;
                        $("#hdnWtgType").text($scope.WtgTypeIdsId);

                        $scope.Temp = pl.data.result.TurbineDetails.Tempname;
                        $scope.TempIdsId = pl.data.result.TurbineDetails.Temp;
                        $("#hdnTemp").text($scope.TempIdsId);

                        $scope.Dust = pl.data.result.TurbineDetails.DustName;
                        $scope.DustIdsId = pl.data.result.TurbineDetails.Dust;
                        $("#hdnDust").text($scope.DustIdsId);

                        $scope.Corrosion = pl.data.result.TurbineDetails.Corrosion;
                        $scope.CorrosionIdsId = pl.data.result.TurbineDetails.CorrosionId;
                        $("#hdnCorrosion").text($scope.CorrosionIdsId);

                        $scope.THeight = pl.data.result.TurbineDetails.TowerHeightName;
                        $scope.THeightIdsId = pl.data.result.TurbineDetails.THeight;
                        $("#hdnTHeight").text($scope.THeightIdsId);

                        $scope.Blade = pl.data.result.TurbineDetails.BladeName;
                        $scope.BladeIdsId = pl.data.result.TurbineDetails.Blade;
                        $("#hdnBlade").text($scope.BladeIdsId);

                        $scope.Generator = pl.data.result.TurbineDetails.Generator;
                        $scope.GeneratorIdsId = pl.data.result.TurbineDetails.GRId;
                        $("#hdnGenerator").text($scope.GeneratorIdsId);

                        $scope.GearBox = pl.data.result.TurbineDetails.GearBox;
                        $scope.GearBoxIdsId = pl.data.result.TurbineDetails.GBId;
                        $("#hdnGearBox").text($scope.GearBoxIdsId);

                        $scope.EngineerName = pl.data.result.TurbineDetails.Employee;
                        $scope.EngineerSapId = pl.data.result.TurbineDetails.EngineerSapId;
                        
                        $scope.ApprovalStatus = $scope.CStatus == "" ? "Open" : $scope.CStatus;
                        $scope.WTGTypeId = pl.data.result.TurbineDetails.WTGType;
                        $("#hdnWtgTypeId").val(pl.data.result.TurbineDetails.WTGType);

                        
                        ddlFomNameLoadsnew();

                        if ($scope.ddlFomName != "0") {
                            var EmployeeModel = {
                                EmpId: $scope.ddlFomName,
                                View: "1",
                                Text: ""
                            };
                            var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, EmployeeModel);
                            promisePost.then(function (pl) {
                                $scope.EmailId = pl.data.result.EmployeeDetail[0].Email
                                $scope.MobileNo = pl.data.result.EmployeeDetail[0].OMobile;;
                            }, function (err) {
                                SetWarningMessage("Transaction Issue. Please try again.");
                                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                            });
                        }
                        //}
                    }
                    if ($("#hdnCIRNumber").val() == "0") {
                        if (pl.data.result.CIMNumber != undefined) {
                            $scope.CIMNumber = pl.data.result.CIMNumber.UniqueNo;
                        }
                    }
                    fnRemoveGif();
                    var date = new Date();

                    if ($scope.WtgRunTimeTimer == "")
                        $scope.WtgRunTimeTimer = date.getHours() + ":" + (((parseInt(date.getMinutes())).toString().length != 1) ? (parseInt(date.getMinutes())) : '0' + (parseInt(date.getMinutes())));
                    if ($scope.WtgStopTimeTimer == "")
                        $scope.WtgStopTimeTimer = date.getHours() + ":" + (((parseInt(date.getMinutes())).toString().length != 1) ? (parseInt(date.getMinutes())) : '0' + (parseInt(date.getMinutes())));

                    fnDisabledProperty(true);

                }, function (err) {
                    fnRemoveGif();
                    SetWarningMessage("Transaction Issue. Please try again.");
                    $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                });
            }
            else {
                fnDisabledProperty(false);
                $("#hdnTurbine").text("0");
            }
        }

    };

    $scope.LoadFOMNameDetails = function (ddlFomName) {

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

    function fnDisabledProperty(isDisable) {
        $("#txtCustomer").prop("disabled", isDisable);
        $("#txtCustomer").val("");
        $("#hdnCustomer").val("0");

        $("#txtDOC").prop("disabled", isDisable);

        $("#txtWTGType").prop("disabled", isDisable);
        $("#hdnWtgType").val("0");
        $("#txtWTGType").val("");

        $("#txtTemp").prop("disabled", isDisable);
        $("#hdnTemp").val("0");
        $("txtTemp").val("");

        $("#txtDust").prop("disabled", isDisable);
        $("#txtDust").val("");
        $("#hdnDust").val("0");

        $("#txtCorrosion").prop("disabled", isDisable);
        $("#txtCorrosion").val("");
        $("#hdnCorrosion").val("0");

        $("#txtTHeight").prop("disabled", isDisable);
        $("#txtTHeight").val("");
        $("#hdnTHeight").val("0");

        $("#txtGenerator").prop("disabled", isDisable);
        $("#txtGenerator").val("");
        $("#hdnGenerator").val("0");

        $("#txtBlade").prop("disabled", isDisable);
        $("#txtBlade").val("");
        $("#hdnBlade").val("0");

        $("#txtGearBox").prop("disabled", isDisable);
        $("#txtGearBox").val("");
        $("#hdnGearBox").val("0");

        $("#txtFOMName").prop("disabled", isDisable);
        $("#txtFOMName").val("");
        $("#hdnFOMName").val("0");

    }

    $scope.LoadEmployeeDetails = function () {
        var EmployeeModel = {
            EmpId: $("#hdnEngineerSapId").val(),
            View: "1",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, EmployeeModel);
        promisePost.then(function (pl) {
            $scope.EngineerName = pl.data.result[0].Employee;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.SaveCIR = function () {

        if ($scope.CIMNumber == "") {
            SetErrorMessage("Ensure FSR number!");
            return false;
        }
        if ($("#hdnState").val() == "" || $("#hdnState").val() == "0") {
            SetErrorMessage("Ensure State!");
            return false;
        }
        if ($("#hdnSite").val() == "" || $("#hdnSite").val() == "0") {
            SetErrorMessage("Ensure Site!");
            return false;
        }

        if ($("#hdnAlarmCode").text() == "0") {
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
            CIMId: $scope.CIMNumberId,
            CIMNumber: $scope.CIMNumber,
            TbnId: $("#hdnTurbine").text(),
            DateOfFailure: $scope.DateOfFailure,
            AlarmCode: $("#hdnAlarmCode").text(),
            EmpId: $scope.EngineerSapId,
            SwVersion: $scope.SoftwareVersionId,
            HwVersion: $scope.FwVersionId,
            WTGStatus: $scope.WtgStatus,
            WTGStartTime: $scope.WtgRunTime + " " + ($scope.WtgRunTimeTimer == undefined ? "00:00" : $scope.WtgRunTimeTimer),
            WTGStopTime: $scope.WtgStopTime + " " + ($scope.WtgStopTimeTimer == undefined ? "00:00" : $scope.WtgStopTimeTimer),
            Production: $scope.Production,
            RunHrs: $scope.RunHours,
            FuncSystem: $scope.FunctionalSystem,
            ComponentGroup: $scope.ComponentGroup,
            PartCode: $scope.GamesaPartCode,
            ComponentMake: $scope.ComponentMake,
            FailureDuring: $scope.FailureDuring,
            SerialNumber: $scope.SerialNumber,
            WONumber: $scope.WONumber,
            TSite: $("#hdnSite").val(),
            TTurbine: $scope.TurbineName,
            DOC: $scope.TDOC,
            Customer: $("#hdnCustomer").text() == "0" ? $scope.Customer : "",
            CmrId: $("#hdnCustomer").text(),
            WTGType: $("#hdnWtgType").text() == "0" ? $scope.WtgType : "",
            WTGTypeID: $("#hdnWtgType").text(),
            TempName: $("#hdnTemp").text() == "0" ? $scope.Temp : "",
            TempId: $("#hdnTemp").text(),
            Dust: $("#hdnDust").text() == "0" ? $scope.Dust : "",
            DustId: $("#hdnDust").text(),
            Corrosion: $("#hdnCorrosion").text() == "0" ? $scope.Corrosion : "",
            CorrosionId: $("#hdnCorrosion").text(),
            THeightName: $("#hdnTHeight").text() == "0" ? $scope.THeight : "",
            THeightId: $("#hdnTHeight").text(),
            Blade: $("#hdnBlade").text() == "0" ? $scope.Blade : "",
            BladeId: $("#hdnBlade").text(),
            Generator: $("#hdnGenerator").text() == "0" ? $scope.Generator : "",
            GrId: $("#hdnGenerator").text(),
            GearBox: $("#hdnGearBox").text() == "0" ? $scope.GearBox : "",
            GBId: $("#hdnGearBox").text(),
            AlarmDesc: $scope.AlarmDescription,
            FOM: $scope.ddlFomName

        };

        var promisePost = CIR_OperationService.postCommonService(SaveCIMUrl, CIRModel);
        promisePost.then(function (pl) {

            if (pl.data.result.MessageInfo.Clear == "True") {
                SetSuccessMessage(pl.data.result.MessageInfo.Msg);
                $("#liTurbineData").removeClass("active");
                $("#liProblem").addClass("active");
                $("#turbineData").removeClass("tab-pane fade in active");
                $("#turbineData").addClass("tab-pane fade");
                $("#problem").removeClass("tab-pane fade");
                $("#problem").addClass("tab-pane fade in active");
                $scope.CIMNumberId = pl.data.result.CIRData.CIMId;
                LoadStatus();
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

    $scope.ClearCIR = function () {
        $scope.DateOfFailure = "";
        $scope.AlarmCode = "";
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
        $scope.CIMNumber = "";
        $scope.CIMNumberId = "0";
        $scope.SoftwareVersionId = "0";
        $scope.FwVersionId = "0";
        $scope.StateValue = "";
        $scope.TurbineNameValue = "";
        $scope.SiteValue = "";
        $scope.ddlFomName = "0";
        $scope.ddlFomNameLoadArray = "";
        $("#hdnCIRNumber").val("0");
        $("#hdnState").val("0");
        $("#hdnSite").val("0");
        $("#hdnTurbine").val("0");
        LoadFunctionalSystem();
        LoadComponentGroup();
        LoadFailureDuring();
        LoadSoftwareVersion();
        LoadHardwareVersion();
        LoadStatus();
    };

    $scope.SaveProblem = function () {
        if ($scope.Problem == "") {
            SetErrorMessage("Ensure problem!");
            return false;
        }
        var CIRProblem = {
            Problem: $scope.Problem,
            CIMId: $scope.CIMNumberId
        }
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(SaveCIMProblemUrl, CIRProblem);
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
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.ClearProblem = function () {
        $scope.Problem = "";
    };

    $scope.SaveAction = function () {
        if ($.trim($scope.ActionDesc) == "") {
            SetErrorMessage("Ensure description!");
            return false;
        }
        fnLoadGif();
        var ActionModel = {
            CIMId: $scope.CIMNumberId,
            ActionDesc: $scope.ActionDesc,
            DelFlag: "0",
            CAId: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIMActionUrl, ActionModel);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
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
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            SetWarningMessage("Transaction Issue. Please try again.");
        });
    };

    function LoadActionPerformed() {
        var Data = {
            cimId: $scope.CIMNumberId
        };
        var promisePost = CIR_OperationService.postCommonService(GetCIMDetailsUrl, Data);
        promisePost.then(function (pl) {

            $scope.ActionPerformedArray = pl.data.result.CIRActionDetail;

        }, function (err) {
            fnRemoveGif();
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            SetWarningMessage("Transaction Issue. Please try again.");
        });
    }

    $scope.DeleteAction = function (CAId) {
        fnLoadGif();
        var CIRAction = {
            CAId: CAId,
            CIRId: $scope.CIMNumberId,
            ActionDesc: "",
            DelFlag: "1"
        }
        var promisePost = CIR_OperationService.postCommonService(SaveCIMActionUrl, CIRAction);
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
        $scope.ActionDesc = "";
    };

    $scope.SaveFullAction = function () {

        if ($scope.ActionPerformedArray.length == 0) {
            SetErrorMessage("Ensure Atleaset One Action Performed!");
            return false;
        }
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
            CIMId: $scope.CIMNumberId
        }
        var promisePost = CIR_OperationService.postCommonService(SaveCIMConsequentialUrl, CIRConsequence);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
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
            CIMId: $scope.CIMNumberId
        }
        var promisePost = CIR_OperationService.postCommonService(SaveCIM5W2HUrl, CIR5W2H);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
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
        $scope.What = "";
        $scope.Where = "";
        $scope.When = "";
        $scope.Who = "";
        $scope.Why = "";
        $scope.HowToDo = "";
        $scope.HowMuch = "";
    };

    $scope.SaveFiles = function () {
        if ($("#fuFile").val() == "") {
            SetErrorMessage("Ensure File!");
            return false;
        }
        fnLoadGif();
        var Data = {
            cimId: $scope.CIMNumberId,
            description: $scope.DescriptionForFile,
            cimNumber: $scope.CIMNumber
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIRFilesOnlyUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.MessageInfo.Clear == "True") {
                SetSuccessMessage(pl.data.result.MessageInfo.Msg);
                $scope.LoadCIRFileDetails();

            }
            else {
                SetErrorMessage(pl.data.result.MessageInfo.Msg);
            }
            $scope.ClearFiles();
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    fnLoadCIRDetails();
    fnDisabledProperty(false);
    LoadFunctionalSystem();
    LoadComponentGroup();
    LoadFailureDuring();
    LoadWtgStatus();
    LoadStatus();
    LoadSoftwareVersion();
    LoadHardwareVersion();

    $scope.SaveImages = function () {
        if ($("#fuImage").val() == "") {
            SetErrorMessage("Ensure File!");
            return false;
        }
        fnLoadGif();
        var Data = {
            cimId: $scope.CIMNumberId,
            description: $scope.Description,
            cimNumber: $scope.CIMNumber
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIMFilesUrl, Data);
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

    $scope.ClearFiles = function () {
        $("#fuFile").val("");
        $scope.DescriptionForFile = "";
    };

    $scope.LoadCIRFileDetails = function () {
        fnLoadGif();
        var Data = {
            cimId: $scope.CIMNumberId
        };
        var promisePost = CIR_OperationService.postCommonService(GetCIMDetailsUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.CIRFileDetail != undefined) {
                $scope.CIRFilesArray = pl.data.result.CIRFileDetail;

            }
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.DeleteCIRDoc = function (CFId, FileName) {
        fnLoadGif();
        var Data = {
            cimId: $scope.CIMNumberId,
            CFId: CFId,
            fileName: FileName,
            CIMNumber: $scope.CIMNumber
        };
        var promisePost = CIR_OperationService.postCommonService(DeleteCIMFilesUrl, Data);
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

    $scope.SaveFilesFull = function () {
        $("#liFiles").removeClass("active");
        $("#liComments").addClass("active");
        $("#files").removeClass("tab-pane fade in active");
        $("#files").addClass("tab-pane fade");
        $("#Comments").removeClass("tab-pane fade");
        $("#Comments").addClass("tab-pane fade in active");
    };

    $scope.SaveImagesFull = function () {
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
    }

    $scope.SaveComments = function () {
        debugger
        if ($scope.Comments == "") {
            SetErrorMessage("Ensure Comments!");
            return false;
        }
        if ($scope.Status == "0") {
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
        var cAId = "0";
        if ($scope.CIRCommentsArray != undefined) {
            if ($scope.CIRCommentsArray.length != 0) {
                var CommentsArray = $scope.CIRCommentsArray;
                cAId = CommentsArray[CommentsArray.length - 1].CAId;
            }
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
            cimId: $scope.CIMNumberId,
            crId: cAId,
            comments: $scope.Comments,
            assignedTo: assignTo,
            toDpt: "0",
            cStatus: $scope.Status,
            delFlag: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIMCommentsUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
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

    $scope.SaveSuggestion = function () {
        fnLoadGif();
        var Data = {
            cimId: $scope.CIMNumberId,
            description: $scope.DescriptionForSuggestion,
            cimNumber: $scope.CIMNumber
        };
        var promisePost = CIR_OperationService.postCommonService(SaveSuggestionUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.Clear == "True") {
                $("#liSuggestion").removeClass("active");
                $("#liComments").addClass("active");
                $("#Suggestion").removeClass("tab-pane fade in active");
                $("#Suggestion").addClass("tab-pane fade");
                $("#Comments").removeClass("tab-pane fade");
                $("#Comments").addClass("tab-pane fade in active");
                SetSuccessMessage(pl.data.result.Msg);
                $scope.LoadCIRDetails();
            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
            $scope.ClearSugegstion();
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            SetWarningMessage("Transaction Issue. Please try again.");
        });

    };

    $scope.ClearSugegstion = function () {
        $("#fuImageForSuggestion").val("");
        $scope.DescriptionForSuggestion = "";
    }

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

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });

        if ($scope.Status != "6" && $scope.Status != "9") {
            $("#divAssignTo").css("display", "");
            fnLoadGif();
            var StatusModel = {
                Id: $scope.CIMNumberId,
                StsId: $scope.Status,
                IDType: "2",
                view: "3"
            };

            var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
            promisePost.then(function (pl) {
                $scope.AssignToArray = pl.data.result.StatusModels;
                fnRemoveGif();
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            $("#divAssignTo").css("display", "none");

        }

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

    $scope.DeleteComments = function () {

        var Data = {
            cimId: $scope.CIMNumberId,
            crId: "",
            comments: $("#txtDeleteComments").val(),
            assignedTo: "0",
            toDpt: "0",
            cStatus: "0",
            convertToNCR: false,
            delFlag: "1",
        };
        var promisePost = CIR_OperationService.postCommonService(SaveCIMCommentsUrl, Data);
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

    $scope.ClearComments = function () {
        $scope.Status = "0";
        $scope.Comments = "";
        $scope.AssignTo = "0";
    }

});