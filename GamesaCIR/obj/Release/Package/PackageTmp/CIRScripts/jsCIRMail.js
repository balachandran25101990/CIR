app.controller('CIRMail_OperController', function ($scope, CIR_OperationService) {
    $scope.State = "";
    $scope.Site = "";
    $scope.TurbineType = "";
    $scope.FunctionalSystem = "";
    $scope.Status = "";
    $scope.DateTo = "";
    $scope.DateFrom = "";
    $scope.RptType = "";
    $scope.CIROrCIMNumber = "";
    $scope.IsFileHaving = false;
    $scope.WorkOrderNumber = "";
    $scope.Date = "";
    $scope.DateofFailure = "";
    $scope.Customer = "";
    $scope.Alarmcode = "";
    $scope.Site = "";
    $scope.EngineerSapId = "";
    $scope.Doc = "";
    $scope.SwVersion = "";
    $scope.WTGType = "";
    $scope.FwVersion = "";
    $scope.Temp = "";
    $scope.WtgStatus = "";
    $scope.Dust = "";
    $scope.Corrosion = "";
    $scope.WtgStopTime = "";
    $scope.WtgRunTime = "";
    $scope.Blade = "";
    $scope.RunHrs = "";
    $scope.Production = "";
    $scope.THeight = "";
    $scope.Generator = "";
    $scope.FunctionalSystem = "";
    $scope.Gearbox = "";
    $scope.FomName = "";
    $scope.ComponentGroup = "";
    $scope.GamesaPartCode = "";
    $scope.ComponentMake = "";
    $scope.ApprovalStatus = "";
    $scope.FailureDuring = "";
    $scope.MobileNo = "";
    $scope.SerialNumber = "";
    $scope.EmailId = "";
    $scope.Problem = "";
    $scope.EngineerName = "";
    $scope.ConsequentialProblem = "";
    $scope.CIRNumberId = "";
    $scope.What = "";
    $scope.When = "";
    $scope.Who = "";
    $scope.Where = "";
    $scope.Why = "";
    $scope.HowToDo = "";
    $scope.HowMuch = "";
    $scope.CIMNumberId = "";
    $scope.WONumber = "";
    $scope.CIMNumber = "";
    $scope.CIRNumber = "";
    $scope.Date = new Date();
    LoadCIRDetails();

    function LoadCIRDetails() {
        
        var Data = {
            encodeCirId: CirIdEncoded
        };
        var promisePost = CIR_OperationService.postCommonService(GetDetailUrl, Data);
        promisePost.then(function (pl) {
            
            if (pl.data.result.CIRDetail != undefined) {
                $("#hdnCIRId").val(pl.data.result.CIRDetail.CIRId);
                $scope.CIRNumberId = pl.data.result.CIRDetail.CIRId;
                $scope.CIRNumber = pl.data.result.CIRDetail.CIRNumber;
                $("#hdnCIMId").val(pl.data.result.CIRDetail.CIMId);
                $scope.CIMNumberId = pl.data.result.CIRDetail.CIMId;
                $scope.CIMNumber = pl.data.result.CIRDetail.CIMNumber;
                $scope.Alarmcode = pl.data.result.CIRDetail.ACode;
                $scope.Site = pl.data.result.CIRDetail.TSite;
                $scope.TurbineName = pl.data.result.CIRDetail.Turbine;
                $scope.TbnId = pl.data.result.CIRDetail.TbnId;
                $scope.DateofFailure = pl.data.result.CIRDetail.DateOfFailure;
                $scope.TSiteID = pl.data.result.CIRDetail.TSiteID;
                $scope.SwVersion = pl.data.result.CIRDetail.SwVersion;
                $scope.FwVersion = pl.data.result.CIRDetail.HwVersion;
                $scope.WtgStatus = pl.data.result.CIRDetail.WTGStatus;
                $scope.WtgRunTime = pl.data.result.CIRDetail.WTGStartTime;
                $scope.WtgStopTime = pl.data.result.CIRDetail.WTGStopTime;
                $scope.Production = pl.data.result.CIRDetail.Production;
                $scope.RunHrs = pl.data.result.CIRDetail.RunHrs;
                $scope.EngineerName = pl.data.result.CIRDetail.EName;
                $scope.EngineerSapId = pl.data.result.CIRDetail.EngineerSapId;
                $scope.FunctionalSystem = pl.data.result.CIRDetail.FuncSystem;
                $scope.ComponentGroup = pl.data.result.CIRDetail.ComponentGroup;
                $scope.GamesaPartCode = pl.data.result.CIRDetail.PartCode;
                $scope.ComponentMake = pl.data.result.CIRDetail.ComponentMake;
                $scope.FailureDuring = pl.data.result.CIRDetail.FailureDuring;
                $scope.SerialNumber = pl.data.result.CIRDetail.SerialNumber;
                $scope.Problem = pl.data.result.CIRDetail.ProblemDesc;
                $scope.WONumber = pl.data.result.CIRDetail.WONumber;
                $scope.MobileNo = pl.data.result.CIRDetail.FOMMobileNo;
                $scope.FomName = pl.data.result.CIRDetail.FOMName;
                $scope.EmailId = pl.data.result.CIRDetail.FOMEmail;
                $scope.ConsequentialProblem = pl.data.result.CIRDetail.Consequence;
                $scope.FOM = pl.data.result.CIRDetail.FOM;
                $scope.What = pl.data.result.CIRDetail.What;
                $scope.When = pl.data.result.CIRDetail.When1;
                $scope.Who = pl.data.result.CIRDetail.Who;
                $scope.Where = pl.data.result.CIRDetail.Where1;
                $scope.Why = pl.data.result.CIRDetail.Why;
                $scope.HowToDo = pl.data.result.CIRDetail.HowTodo;
                $scope.HowMuch = pl.data.result.CIRDetail.Howmuch;
                $scope.ApprovalStatus = pl.data.result.CIRDetail.CStatus;

                if ($scope.TbnId != "0") {
                    var TurbineModel = {
                        Site: $scope.TSiteID,
                        TurbineId: $scope.TbnId,
                        View: "1",
                        Text: ""
                    };
                    var promisePost = CIR_OperationService.postCommonService(GetTurbineDetailsUrl, TurbineModel);
                    promisePost.then(function (pl) {

                        if (pl.data.result.TurbineDetail[0] != undefined) {
                            $scope.Customer = pl.data.result.TurbineDetail[0].CustomerName;
                            $scope.Site = pl.data.result.TurbineDetail[0].SiteName;
                            $scope.Doc = pl.data.result.TurbineDetail[0].DOC;
                            $scope.WTGType = pl.data.result.TurbineDetail[0].WTGTypeName;
                            $scope.Temp = pl.data.result.TurbineDetail[0].Tempname;
                            $scope.Dust = pl.data.result.TurbineDetail[0].Dustname;
                            $scope.Corrosion = "";
                            $scope.THeight = pl.data.result.TurbineDetail[0].THeight;
                            $scope.Blade = pl.data.result.TurbineDetail[0].BladeName;
                            $scope.Generator = pl.data.result.TurbineDetail[0].Generator;
                            $scope.Gearbox = pl.data.result.TurbineDetail[0].GearBox;
                            //$scope.FomName = pl.data.result[0].FOM;
                            //$scope.EmailId = pl.data.result[0].EMAIL;
                            
                        }

                    }, function (err) {
                        console.log("Err" + err);
                    });
                }
                else {
                    $scope.Customer = pl.data.result.CIRDetail.Customer;
                    $scope.Site = pl.data.result.CIRDetail.TSite;
                    $scope.Doc = pl.data.result.CIRDetail.TDOC;
                    $scope.WTGType = pl.data.result.CIRDetail.WTGType;
                    $scope.Temp = pl.data.result.CIRDetail.TempName;
                    $scope.Dust = pl.data.result.CIRDetail.DustName;
                    $scope.Corrosion = pl.data.result.CIRDetail.CorrosionName;
                    $scope.THeight = pl.data.result.CIRDetail.THeightName;
                    $scope.Blade = pl.data.result.CIRDetail.BladetName;
                    $scope.Generator = pl.data.result.CIRDetail.GeneratorName;
                    $scope.Gearbox = pl.data.result.CIRDetail.GearBoxName;

                    $scope.FomName = pl.data.result.CIRDetail.FOMName;
                    
                 
                    
                }
            }
            if ($scope.IsFileHaving == true) {
                if (pl.data.result.CIRFileDetail != undefined) {
                    $scope.CIRFilesArray = pl.data.result.CIRFileDetail;
                }
            }

            if (pl.data.result.CIRComments != undefined) {
                $scope.CIRCommentsArray = pl.data.result.CIRComments;
            }
            LoadActionPerformed();
            $scope.LoadFOMDetails();
            //LoadIsAutoAssignOrNot();
        }, function (err) {
            console.log("Err" + JSON.stringify(err));
        });
    }

    $scope.LoadFOMDetails = function () {
        var EmployeeModel = {
            EmpId: $scope.FOM,
            View: "1"
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmployeeDetailsUrl, EmployeeModel);
        promisePost.then(function (pl) {

            if (pl.data.result.EmployeeDetail[0] != undefined) {
                $scope.EmailId = pl.data.result.EmployeeDetail[0].Email;
                $scope.MobileNo = pl.data.result.EmployeeDetail[0].OMobile;

            }
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the employee details based on the empId : " + err);
        });
    }

    function LoadActionPerformed() {
        var Data = {
            encodeCirId: CirIdEncoded
        };
        var promisePost = CIR_OperationService.postCommonService(GetDetailUrl, Data);
        promisePost.then(function (pl) {

            $scope.ActionPerformedArray = pl.data.result.CIRActionDetail;

        }, function (err) {
            console.log("Err" + err);
        });
    }

});