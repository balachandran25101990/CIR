app.controller('AnalyticsReport_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.StateSelect = "0";
    $scope.SiteSelect = "0";
    $scope.WTGTypeSelect = "0";
    $scope.FilterSelect = "3";
    $scope.DateTo = "";
    $scope.DateFrom = "";
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
    $scope.DateTo = output;
    $scope.DateFrom = output;
    $("#txtDateFrom").val($scope.DateFrom);
    $("#txtDateTo").val($scope.DateTo);

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    LoadState();
    PrepareAnalyticsRpt();

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
            pageName: "CIR Analytics"
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

    function LoadState() {
        fnLoadGif();
        var CollectionModel = {
            RefId: "3",
            View: "2"
        };
        var promisePost = CIR_OperationService.postCommonService(LoadStateUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.StateArray = pl.data.result.CollectionDetailsSpecification;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
        $scope.StateSelect = $("#hdnDefaultStateId").val();
    };

    $scope.ChangeData = function () {
        $scope.ReportDetailsArray = [];
        $scope.DetailsArray = [];

        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";

        if (window.myBar != null)
            window.myBar.destroy();
    };

    $scope.ChangeActive = function (event) {
        $("#aDate,#aWeek,#aMonth").removeClass("active");
        $("#" + event.currentTarget.id).addClass("active");

        if (event.currentTarget.id == "aDate") {
            $scope.FilterSelect = "3";
        } else if (event.currentTarget.id == "aWeek") {
            $scope.FilterSelect = "2";
            $scope.DateTo = "";
        } else {
            $scope.FilterSelect = "1";
        }

        if ($scope.StateSelect == "" || $scope.StateSelect == "0") {
            SetErrorMessage("Ensure State!");
            $("#ddlState").focus();
            return false;
        }
        if ($scope.DateFrom == "") {
            SetErrorMessage("Ensure Date From!");
            $("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.FilterSelect != "2") {
            SetErrorMessage("Ensure Date To!");
            $("#txtDateTo").focus();
            return false;
        }
        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";
        PrepareAnalyticsRpt();
    };

    $scope.SelectLeftMenu = function (row) {
        if ($scope.SiteSelect == "0" && $scope.WTGTypeSelect == "0") {
            $scope.SiteSelect = row.Id;
            $("#bcSite").text(row.Text);
        } else if ($scope.SiteSelect != "0" && $scope.WTGTypeSelect == "0") {
            $scope.WTGTypeSelect = row.Id;
            $("#bcWTGType").text(row.Text);
        } else {
            return false;
        }
        PrepareAnalyticsRpt();
    };

    $scope.PickBreadcrumbs = function (_level) {
        if (_level == "0") {
            $scope.SiteSelect = "0";
            $scope.WTGTypeSelect = "0";
        }
        if (_level == "1") {
            $scope.WTGTypeSelect = "0";
        }
        PrepareAnalyticsRpt();
    };

    function randomColorFactor() {
        return Math.round(Math.random() * 255);
    };

    function randomColor() {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
    };

    function PrepareAnalyticsRpt() {
        $("#content").css('display', 'block');
        var heading = "";
        if ($scope.StateSelect == "" || $scope.StateSelect == "0") {
            SetErrorMessage("Ensure State!");
            $scope.StateSelect == "0";
            $("#ddlState").focus();
            return false;
        }
        $scope.DateFrom = $("#txtDateFrom").val();
        $scope.DateTo = $("#txtDateTo").val();
        if ($scope.DateFrom == "") {
            SetErrorMessage("Ensure Date From!");
            $("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.FilterSelect != "2") {
            SetErrorMessage("Ensure Date To!");
            $("#txtDateTo").focus();
            return false;
        }
        var date = $scope.DateFrom;
        var startDate = date.split("/").reverse().join("-");

        var date1 = $scope.DateTo;
        var endDate = date1.split("/").reverse().join("-");

        if ($scope.FilterSelect != "2" && (Date.parse(startDate) > Date.parse(endDate))) {
            SetErrorMessage("Ensure Date From and To!");
            $("#txtDateTo").focus();
            return false;
        }
        fnLoadGif();
        var ReportDetails = {
            DateFrm: $scope.DateFrom,
            DateTo: $scope.DateTo,
            Filter: $scope.FilterSelect == null ? "0" : $scope.FilterSelect,
            State: $scope.StateSelect == null ? "0" : $scope.StateSelect,
            Site: $scope.SiteSelect == null ? "0" : $scope.SiteSelect,
            WTGType: $scope.WTGTypeSelect == null ? "0" : $scope.WTGTypeSelect
        }

        var promisePost = CIR_OperationService.postCommonService(GetReportDetailUrl, ReportDetails);
        promisePost.then(function (pl) {

            if ($scope.StateSelect != "0" && $scope.SiteSelect == "0" && $scope.WTGTypeSelect == "0") {
                heading = $("#ddlState option:selected").text();

                if (heading == "" && $scope.StateSelect == $("#hdnDefaultStateId").val()) {
                    heading = "Tamilnadu";
                }

            } else if ($scope.SiteSelect != "0" && $scope.WTGTypeSelect == "0") {
                heading = $("#bcSite").text();

            } else {
                heading = $("#bcWTGType").text();
            }

            if (pl.data.result.AnalyticsPoint.length != 0) {
                $scope.ReportDetailsArray = [];
                $scope.DetailsArray = [];

                $scope.ReportDetailsArray = pl.data.result.AnalyticsPoint;

                var Data1 = "";
                Data1 = pl.data.result.AnalyticsPoint;

                var labelValue = [];
                var DataValue = [];
                var dataSetValue = [];
                for (var i = 0; i < Data1.length; i++) {
                    labelValue.push(Data1[i].Text);
                    DataValue.push(Data1[i].Count);
                }
                dataSetValue.push({ 'label': heading, 'backgroundColor': randomColor(), 'data': DataValue });
                barchartData = "";
                barChartData = {
                    labels: labelValue,
                    datasets: dataSetValue
                };

                config = {
                    type: 'bar',
                    data: barChartData,
                    options: {
                        elements: {
                            rectangle: {
                                borderWidth: 0,
                                borderColor: 'none',
                            },
                            tooltips: {
                                showTooltips: true,
                                tooltipEvents: ["mousemove", "touchstart", "touchmove"],
                                tooltipFillColor: "rgba(0,0,0,0.8)"
                            },
                        },
                        responsive: true,
                    }
                }
                if (window.myBar != null)
                    window.myBar.destroy();
                var ctx = document.getElementById("canvas").getContext("2d");
                window.myBar = new Chart(ctx, config);


                /*var labelValue = [];
                for (var i = 0; i < Data1.length; i++) {
                    labelValue.push(Data1[i].Text);
                }
                var pieChartDataSet = [];
                var DataValue = [];
                var BackgroundColor = [];
                for (var j = 0; j < Data1.length; j++) {
                    DataValue.push(Data1[j].Count);
                    BackgroundColor.push(randomColor());
                }
                
                pieChartDataSet.push({ 'data': DataValue, 'backgroundColor': BackgroundColor });
                
                config = {
                    type: 'bar',
                    data: {
                        datasets: pieChartDataSet,
                        labels: labelValue
                    }, options: {
                        responsive: true
                    }
                }
                if (window.myPie != null)
                    window.myPie.destroy();
                var ctx = document.getElementById("canvas").getContext("2d");
                window.myPie = new Chart(ctx, config);
                */
            }
            else {
                $scope.WTGTypeSelect = "0";
                SetErrorMessage("No Results Found!");
            }

            if ($scope.WTGTypeSelect != "" && $scope.WTGTypeSelect != "0") {
                $scope.DetailsArray = pl.data.result.AnalyticsPointDetails;
                paging();
            }
            fnRemoveGif();

        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.PrepareAnalyticsRpt = function () {
        PrepareAnalyticsRpt();
    }

    $scope.Clear = function () {
        $scope.StateSelect = "0";
        $scope.DateTo = "";
        $scope.DateFrom = "";

        $("#aDate,#aWeek,#aMonth").removeClass("active");
        $("#aDate").addClass("active");
        $scope.FilterSelect = "3";

        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";

        $scope.ReportDetailsArray = [];
        $scope.DetailsArray = [];

        if (window.myBar != null)
            window.myBar.destroy();
    }

    function paging() {
        $scope.currentPage = 0;
        $scope.range = function () {
            var rangeSize = 5;
            var ret = [];
            var start;

            start = $scope.currentPage;
            if (start > $scope.pageCount() - rangeSize) {
                start = $scope.pageCount() - rangeSize + 1;
            }

            for (var i = start; i < start + rangeSize; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.prevPageDisabled = function () {
            return $scope.currentPage === 0 ? "disabled" : "";
        };

        $scope.pageCount = function () {
            return Math.ceil($scope.DetailsArray.length / $scope.itemsPerPage) - 1;
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pageCount()) {
                $scope.currentPage++;
            }
        };

        $scope.nextPageDisabled = function () {
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        };

        $scope.setPage = function (n) {
            $scope.currentPage = n;
        };
    };

    $scope.DetailsArray = [];
    $scope.itemsPerPage = 10; // Per page items
});

app.controller('CIRPendingAnalyticsReport_OperController', function ($scope, CIR_OperationService) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;
    $scope.StateSelect = "0";
    $scope.SiteSelect = "0";
    $scope.WTGTypeSelect = "0";
    $scope.FilterSelect = "3";
    $scope.DateTo = "";
    $scope.DateFrom = "";
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
    $scope.DateTo = output;
    $scope.DateFrom = output;
    $("#txtDateFrom").val($scope.DateFrom);
    $("#txtDateTo").val($scope.DateTo);

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
            pageName: "CIR Usage Analytics"
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

    PrepareAnalyticsRpt();

    $scope.ChangeData = function () {
        $scope.ReportDetailsArray = [];
        $scope.DetailsArray = [];

        if (window.myPie != null)
            window.myPie.destroy();
    };

    $scope.ChangeActive = function (event) {
        $("#aDate,#aWeek,#aMonth").removeClass("active");
        $("#" + event.currentTarget.id).addClass("active");

        if (event.currentTarget.id == "aDate") {
            $scope.FilterSelect = "3";
        } else if (event.currentTarget.id == "aWeek") {
            $scope.FilterSelect = "2";
            $scope.DateTo = "";
        } else {
            $scope.FilterSelect = "1";
        }

        if ($scope.DateFrom == "") {
            SetErrorMessage("Ensure Date From!");
            $("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.FilterSelect != "2") {
            SetErrorMessage("Ensure Date To!");
            $("#txtDateTo").focus();
            return false;
        }
        $scope.StateSelect = "0";
        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";
        PrepareAnalyticsRpt();
    };

    $scope.SelectLeftMenu = function (row) {
        if ($scope.StateSelect == "0") {
            $scope.StateSelect = row.Id;
            $("#bcState").text(row.IText);
        } else if ($scope.StateSelect != "0" && $scope.SiteSelect == "0" && $scope.WTGTypeSelect == "0") {
            $scope.SiteSelect = row.Id;
            $("#bcSite").text(row.IText);
        } else if ($scope.StateSelect != "0" && $scope.SiteSelect != "0" && $scope.WTGTypeSelect == "0") {
            $scope.WTGTypeSelect = row.Id;
            $("#bcWTGType").text(row.IText);
        } else {
            return false;
        }
        PrepareAnalyticsRpt();
    };

    $scope.PickBreadcrumbs = function (_level) {
        if (_level == "0") {
            $scope.StateSelect = "0";
            $scope.SiteSelect = "0";
            $scope.WTGTypeSelect = "0";
        }
        if (_level == "1") {
            $scope.SiteSelect = "0";
            $scope.WTGTypeSelect = "0";
        }
        if (_level == "2") {
            $scope.WTGTypeSelect = "0";
        }
        PrepareAnalyticsRpt();
    };

    function randomColorFactor() {
        return Math.round(Math.random() * 255);
    };

    function randomColor() {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
    };

    $scope.PrepareAnalyticsRpt = function () {
        PrepareAnalyticsRpt();
    }

    function PrepareAnalyticsRpt() {
        $("#content").css('display', 'block');

        $scope.DateFrom = $("#txtDateFrom").val();
        $scope.DateTo = $("#txtDateTo").val();
        if ($scope.DateFrom == "") {
            SetErrorMessage("Ensure Date From!");
            $("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.FilterSelect != "2") {
            SetErrorMessage("Ensure Date To!");
            $("#txtDateTo").focus();
            return false;
        }
        var date = $scope.DateFrom;
        var startDate = date.split("/").reverse().join("-");

        var date1 = $scope.DateTo;
        var endDate = date1.split("/").reverse().join("-");

        if ($scope.FilterSelect != "2" && (Date.parse(startDate) > Date.parse(endDate))) {
            SetErrorMessage("Ensure Date From and To!");
            $("#txtDateTo").focus();
            return false;
        }
        var ReportDetails = {
            DateFrm: $scope.DateFrom,
            DateTo: $scope.DateTo,
            Filter: $scope.FilterSelect == null ? "0" : $scope.FilterSelect,
            State: $scope.StateSelect == null ? "0" : $scope.StateSelect,
            Site: $scope.SiteSelect == null ? "0" : $scope.SiteSelect,
            WTGType: $scope.WTGTypeSelect == null ? "0" : $scope.WTGTypeSelect
        }
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetReportDetailUrl, ReportDetails);
        promisePost.then(function (pl) {

            var Data1 = "";
            if (pl.data.result.AnalyticsPointDetails.length != 0) {

                $scope.ReportDetailsArray = [];
                $scope.DetailsArray = [];
                $scope.ReportDetailsArray = pl.data.result.AnalyticsPoint;

                Data1 = pl.data.result.AnalyticsPoint;

                var labelValue = [];
                var pieChartDataSet = [];
                var DataValue = [];
                var BackgroundColor = [];
                if (Data1.length > 0) {
                    labelValue.push("FEPending");
                    labelValue.push("FOMPending");
                    labelValue.push("PTSPending");
                    labelValue.push("FSLPending");
                    labelValue.push("FSSPending");
                    labelValue.push("QualityPending");
                    labelValue.push("DMPending");
                    labelValue.push("RCPending");

                    DataValue.push(Data1[0].FEPending);
                    BackgroundColor.push(randomColor());
                    DataValue.push(Data1[0].FOMPending);
                    BackgroundColor.push(randomColor());
                    DataValue.push(Data1[0].PTSPending);
                    BackgroundColor.push(randomColor());
                    DataValue.push(Data1[0].FSLPending);
                    BackgroundColor.push(randomColor());
                    DataValue.push(Data1[0].FSSPending);
                    BackgroundColor.push(randomColor());
                    DataValue.push(Data1[0].QualityPending);
                    BackgroundColor.push(randomColor());
                    DataValue.push(Data1[0].DMPending);
                    BackgroundColor.push(randomColor());
                    DataValue.push(Data1[0].RCPending);
                    BackgroundColor.push(randomColor());
                }
                pieChartDataSet.push({ 'data': DataValue, 'backgroundColor': BackgroundColor });

                config = {
                    type: 'pie',
                    data: {
                        datasets: pieChartDataSet,
                        labels: labelValue
                    }, options: {
                        responsive: true
                    }
                }
                if (window.myPie != null)
                    window.myPie.destroy();

                if (Data1.length > 0) {
                    if (Data1[0].FEPending != null || Data1[0].FOMPending != null || Data1[0].PTSPending != null || Data1[0].FSLPending != null || Data1[0].FSSPending != null || Data1[0].QualityPending != null || Data1[0].DMPending != null || Data1[0].RCPending != null) {
                        var ctx = document.getElementById("canvas").getContext("2d");
                        window.myPie = new Chart(ctx, config);
                    }
                }
            }
            else {
                SetErrorMessage("No Results Found!");
                if (window.myPie != null)
                    window.myPie.destroy(); $scope.DetailsArray = "";

            }

            if (pl.data.result.AnalyticsPointDetails.length != 0) {
                $scope.DetailsArray = pl.data.result.AnalyticsPointDetails;
                paging();
            }

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.Clear = function () {
        debugger;
        $scope.StateSelect = "0";
        $scope.DateTo = "";
        $scope.DateFrom = "";
        $scope.StateSelect = "0";
        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";

        $("#aDate,#aWeek,#aMonth").removeClass("active");
        $("#aDate").addClass("active");
        $scope.FilterSelect = "3";

        $scope.ReportDetailsArray = [];
        $scope.DetailsArray = [];

        if (window.myPie != null)
            window.myPie.destroy();
    }

    function paging() {
        $scope.currentPage = 0;
        $scope.range = function () {
            var rangeSize = 5;
            var ret = [];
            var start;

            start = $scope.currentPage;
            if (start > $scope.pageCount() - rangeSize) {
                start = $scope.pageCount() - rangeSize + 1;
            }

            for (var i = start; i < start + rangeSize; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.prevPageDisabled = function () {
            return $scope.currentPage === 0 ? "disabled" : "";
        };

        $scope.pageCount = function () {
            return Math.ceil($scope.DetailsArray.length / $scope.itemsPerPage) - 1;
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pageCount()) {
                $scope.currentPage++;
            }
        };

        $scope.nextPageDisabled = function () {
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        };

        $scope.setPage = function (n) {
            $scope.currentPage = n;
        };
    };

    $scope.DetailsArray = [];
    $scope.itemsPerPage = 10; // Per page items

});

app.controller('DetailReport_OperController', function ($scope, $filter, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    $scope.State = "";
    $scope.SiteSelect = "0";
    $scope.StateSelect = "0";
    $scope.TurbineTypeSelect = "0";
    $scope.FunctionalSystemSelect = "0";
    $scope.StatusSelect = "0";
    $scope.TurbineType = "";
    $scope.FunctionalSystem = "";
    $scope.Status = "";
    $scope.DateTo = "";
    $scope.DateFrom = "";
    $scope.RptType = "1";
    $scope.CIROrCIMNumber = "";
    $scope.IsFileHaving = false;
    $scope.WorkOrderNumber = "";
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
    $scope.FunctionalSystem = "0";
    $scope.DesignationSelect = "0";
    $scope.Department = "0";
    LoadState();
    LoadFunctionalSystem();
    LoadSite("4", "2");
    LoadTurbineTypeDetails();
    LoadStatus();
    LoadDesignation();

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
            pageName: "Detail Report"
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

    function LoadState() {
        var CollectionModel = {
            RefId: "3",
            View: "2"
        };
        var promisePost = CIR_OperationService.postCommonService(GetSubMasterCollectionSpecificationUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.StateArray = pl.data.result.CollectionDetailsSpecification;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.ChangeData = function () {
        fnLoadGif();
        $scope.ReportDetailsArray = [];
        $scope.ExcelReportArray = [];
        fnRemoveGif();
    };

    $scope.SiteDetails = function () {
        $scope.ChangeData();
        $('#hfTurbine').val('0');
        $scope.SiteSelect = "0";
        $scope.txtTurbine = "";
        if ($scope.StateSelect != "0") {
            var CollectionModel = {
                RefId: $scope.StateSelect,
                View: "1"
            };
            fnLoadGif();
            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {
                fnRemoveGif();
                $scope.SiteArray = pl.data.result;
            }, function (err) {
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            LoadSite("4", "2");
        }
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
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.TurbineDetails = function () {
        //LoadTurbine();
        $("#txtTurbine").val("");
        $("#hfTurbine").val("0");
        $scope.ChangeData();
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
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadTurbineTypeDetails() {
        var CollectionModel = {
            RefId: "5",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.TurbineTypeArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadFunctionalSystem() {
        var MasterCollectionModel = {
            refId: "10",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, MasterCollectionModel);
        promisePost.then(function (pl) {
            $scope.FunctionalSystemArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadDesignation() {
        fnLoadGif();
        var DesignationModel = {
            DsgId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetDesignationUrl, DesignationModel);
        promisePost.then(function (pl) {
            $scope.DesignationArray = pl.data.result;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);

        });
    };

    function LoadStatus() {

        var StatusModel = {
            StsId: "0",
            view: "0"
        };

        var promisePost = CIR_OperationService.postCommonService(GetStatusUrl, StatusModel);
        promisePost.then(function (pl) {
            $scope.StatusArray = pl.data.result.StatusModelsWithDelete;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.Search = function () {
        $scope.sortType = 'SlNo'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchDetail = '';
        $scope.curPage = 0;
        if ($scope.RptType == "") {
            SetErrorMessage("Ensure Report Type!");
            $("#ddlReportType").focus();
            return false;
        }
        $scope.DateFrom = $("#txtDateFrom").val();
        $scope.DateTo = $("#txtDateTo").val();
        if ($scope.DateFrom == "" && $scope.DateTo != "") {
            SetErrorMessage("Ensure Date From!");
            //$("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.DateFrom != "") {
            SetErrorMessage("Ensure Date To!");
            //$("#txtDateTo").focus();
            return false;
        }
        var date = $scope.DateFrom;
        var startDate = date.split("/").reverse().join("-");

        var date1 = $scope.DateTo;
        var endDate = date1.split("/").reverse().join("-");

        if (($scope.DateTo != "" && $scope.DateFrom != "") && (Date.parse(startDate) > Date.parse(endDate))) {
            SetErrorMessage("Ensure Date From and To!");
            //$("#txtDateTo").focus();
            return false;
        }
        fnLoadGif();

        var ReportDetails = {
            RptType: $scope.RptType,
            StateId: $scope.StateSelect == "" ? "0" : $scope.StateSelect,
            SiteId: $scope.SiteSelect == "" ? "0" : $scope.SiteSelect,
            TurbineTypeId: $scope.TurbineType == "" ? "0" : $scope.TurbineType,
            DptId: $scope.FunctionalSystemSelect == "" ? "0" : $scope.FunctionalSystemSelect,
            CStatusId: $scope.StatusSelect == "" ? "0" : $scope.StatusSelect,
            TbnId: $("#hfTurbine").val() == "" ? "0" : $("#hfTurbine").val(),
            State: $scope.State == "0" ? "1" : $scope.State == "" ? "1" : "0",
            Site: $scope.Site == "0" ? "1" : $scope.Site == "" ? "1" : "0",
            TurbineType: $scope.TurbineType == "0" ? "1" : $scope.TurbineType == "" ? "1" : "0",
            Dept: $scope.Department == "0" ? "1" : $scope.Department == "" ? "1" : "0",
            CStatus: $scope.StatusSelect == "0" ? "1" : $scope.StatusSelect == "" ? "1" : "0",
            Turbine: $("#hfTurbine").val() == "0" ? "1" : $("#hfTurbine").val() == "" ? "1" : "0",
            DateFrom: $scope.DateFrom,
            DateTo: $scope.DateTo,
            WONumber: $("#hdnWONumber").val(),
            CIROrCIMNumber: $("#hdnNumber").val(),
            DesignationId: $scope.DesignationSelect,
            File: $scope.IsFileHaving,
            EmployeeId: $("#hdnEmployeeId").val()
        }

        var promisePost = CIR_OperationService.postCommonService(GetDetailReportDetailsUrl, ReportDetails);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.ReportDetailsArray = [];
            if (pl.data.result.DetailReports.length != 0) {
                $scope.ReportDetailsArray = pl.data.result.DetailReports;
                $scope.ReportDetailsArrayLength = pl.data.result.DetailReports.length;
                //var i = 1;
                //angular.forEach($scope.ReportDetailsArray, function (value) {
                //    value.SlNo = i;
                //    i++;
                //})

                $scope.ReportDetailsArrayFiltered = $scope.ReportDetailsArray;
            }
            else
                SetErrorMessage("No Results Found!");
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.Clear = function () {
        $scope.sortType = 'SlNo'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchDetail = '';
        $scope.curPage = 0;
        LoadSite("4", "2");
        $scope.RptType = "1",
        $scope.State = "",
        $scope.Site = "0",
        $scope.TurbineType = "0",
        $scope.Department = "0",
        $scope.Status = "0",
        //$scope.Turbine = "0"
        $("#txtTurbine").val("");
        $("#hfTurbine").val("0");
        $scope.DateFrom = "";
        $scope.DateTo = "";
        $scope.CIROrCIMNumber = "";
        $("#hdnNumber").val("0");
        $scope.StateSelect = "0";
        $scope.SiteSelect = "0";
        $scope.DesignationSelect = "0";
        $scope.TurbineTypeSelect = "0";
        $scope.FunctionalSystemSelect = "0";
        $scope.ReportDetailsArray = [];
        $scope.ReportDetailsArrayFiltered = [];
        $scope.ExcelReportArray = [];
        $scope.Employee = "";
        $("#hdnEmployeeId").val("0");
        var clear = {
            Clear: ""
        }
        var promisePost = CIR_OperationService.postCommonService(GetClearDetailReptSession, clear);
        promisePost.then(function (pl) {
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    $scope.ViewDetail = function (cid, cimId, reportType) {
        //var row = $scope.ReportDetailsArray[Index];
        if (reportType == "1") {
            var Data = {
                cirId: cid
            };
            sessionStorage.setItem("FileHaving", $scope.IsFileHaving);
            sessionStorage.setItem("page1content", cid);
            sessionStorage.setItem("isCIR", true);
            window.open("../Report/ReportPrintDetails");
        }
        else {
            var Data = {
                cirId: cimId
            };
            sessionStorage.setItem("FileHaving", $scope.IsFileHaving);
            sessionStorage.setItem("page1content", cimId);
            sessionStorage.setItem("isCIR", false);
            window.open("../Report/ReportPrintDetails");
        }
    };

    function LoadCIRDetails() {
        var Data = {
            cirId: CIRorCIMId
        };
        var promisePost = CIR_OperationService.postCommonService(GetCIRDetailsUrl, Data);
        promisePost.then(function (pl) {
            if (pl.data.result.CIRDetail != undefined) {
                $("#hdnCIRorCIMId").val(pl.data.result.CIRDetail.CIRId);
                $scope.CIRNumberId = pl.data.result.CIRDetail.CIRId;
                $scope.Alarmcode = pl.data.result.CIRDetail.ACode;
                $scope.Site = pl.data.result.CIRDetail.TSite;
                $scope.TurbineName = pl.data.result.CIRDetail.Turbine;
                $scope.TbnId = pl.data.result.CIRDetail.TbnId;
                $scope.DateofFailure = pl.data.result.CIRDetail.DateOfFailure;
                $scope.TSiteID = pl.data.result.CIRDetail.TSiteID;
                $scope.SwVersion = pl.data.result.CIRDetail.SwVersion;
                $scope.FwVersion = pl.data.result.CIRDetail.HwVersion;
                $scope.WtgStatus = pl.data.result.CIRDetail.WTGStatusId;
                $scope.WtgRunTime = pl.data.result.CIRDetail.WTGStartTime;
                $scope.WtgStopTime = pl.data.result.CIRDetail.WTGStopTime;
                $scope.Production = pl.data.result.CIRDetail.Production;
                $scope.RunHrs = pl.data.result.CIRDetail.RunHrs;
                $scope.EngineerName = pl.data.result.CIRDetail.Employee;
                $scope.EngineerSapId = pl.data.result.CIRDetail.EngineerSapId;
                $scope.FunctionalSystem = pl.data.result.CIRDetail.FuncSystem;
                $scope.ComponentGroup = pl.data.result.CIRDetail.ComponentGroup;
                $scope.GamesaPartCode = pl.data.result.CIRDetail.PartCode;
                $scope.ComponentMake = pl.data.result.CIRDetail.ComponentMake;
                $scope.FailureDuring = pl.data.result.CIRDetail.FailureDuring;
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

                var TurbineModel = {
                    Site: $scope.TSiteID,
                    TurbineId: $scope.TbnId,
                    View: "1",
                    Text: ""
                };
                var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
                promisePost.then(function (pl) {

                    if (pl.data.result[0] != undefined) {
                        $scope.Customer = pl.data.result[0].CustomerName;
                        $scope.Site = pl.data.result[0].SiteName;
                        $scope.Doc = pl.data.result[0].DOC;
                        $scope.WTGType = pl.data.result[0].WTGTypeName;
                        $scope.Temp = pl.data.result[0].Tempname;
                        $scope.Dust = pl.data.result[0].Dustname;
                        $scope.Corrosion = "";
                        $scope.THeight = pl.data.result[0].THeight;
                        $scope.Blade = pl.data.result[0].BladeName;
                        $scope.Generator = pl.data.result[0].Generator;
                        $scope.Gearbox = pl.data.result[0].GearBox;
                        $scope.EngineerName = pl.data.result[0].Employee;
                        $scope.EngineerSapId = pl.data.result[0].EngineerSapId;
                    }

                }, function (err) {
                    fnRemoveGif();
                    $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
                    SetWarningMessage("Transaction Issue. Please try again.");
                });
            }
            if ($scope.IsFileHaving == true) {
                if (pl.data.result.CIRFileDetail != undefined) {
                    $scope.CIRFilesArray = pl.data.result.CIRFileDetail;

                }
            }

            if (pl.data.result.CIRComments != undefined) {
                $scope.CIRCommentsArray = pl.data.result.CIRComments;
            }
            //LoadActionPerformed();
            //LoadIsAutoAssignOrNot();
            fnNewWindow();
        }, function (err) {
            fnRemoveGif();
            console.log("Error in loading the CIr details  : " + err);
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    if (CIRorCIMId != "0") {
        LoadCIRDetails();
    }

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

    $scope.DownloadDetail = function () {
        var _Url = GetDownloadUrl;
        _Url = _Url.replace("DownloadExcel", "");
        fnLoadGif();
        var parameters = {
            //Data: JSON.stringify($scope.ExcelReportArray),
            SessionId: "DetailRpt"
        };
        var promisePost = CIR_OperationService.postCommonService(_Url + 'FillData', parameters);
        promisePost.then(function (pl) {
            if (pl.data == "OK") {
                var _downloadUrl = _Url + 'DownloadExcel/' + 'DetailRpt';
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

    $scope.ReportDetailsArray = [];

    $scope.sortType = 'Designation'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchDetail = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.ReportDetailsArray != undefined)
            return Math.ceil($scope.ReportDetailsArray.length / $scope.pageSize);
    };

    $scope.$watch('searchDetail', function (val) {
        $scope.ReportDetailsArray = $filter('filter')($scope.ReportDetailsArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.ReportDetailsArray != undefined)
            $scope.curPage = (Math.ceil($scope.ReportDetailsArray.length / $scope.pageSize) - 1);
    }

});

app.controller('Report_OperController', function ($scope, CIR_OperationService, $filter) {

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

    $scope.SlNo = "1"
    $scope.State = "0";
    $scope.Site = "0";
    $scope.TurbineType = "0";
    $scope.Department = "0";
    $scope.Status = "0";
    $scope.DateTo = "";
    $scope.DateFrom = "";
    $scope.RptType = "1";

    LoadState();
    LoadDepartment();
    LoadTurbineTypeDetails();
    LoadStatus();
    LoadSite("4", "2");

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
            pageName: "Summary"
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

    function LoadState() {
        var CollectionModel = {
            RefId: "3",
            View: "2"
        };
        var promisePost = CIR_OperationService.postCommonService(GetSubMasterCollectionSpecificationUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.StateArray = pl.data.result.CollectionDetailsSpecification;
        }, function (err) {
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadSite(refId, view) {
        var CollectionModel = {
            RefId: refId,
            View: view
        };
        var promisePost = CIR_OperationService.postCommonService(GetSubMasterCollectionSpecificationUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.SiteArray = pl.data.result.CollectionDetailsSpecification;
        }, function (err) {
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.SiteDetails = function () {
        $scope.ChangeData();
        $("#txtTurbine").val("");
        $("#hfTurbine").val("0");
        $scope.Site = "0";
        if ($scope.State != "0") {
            var CollectionModel = {
                RefId: $scope.State,
                View: "1"
            };
            var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
            promisePost.then(function (pl) {

                $scope.SiteArray = pl.data.result;
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
            });
        }
        else {
            LoadSite("4", "2");
        }
    };

    function LoadTurbineTypeDetails() {
        var CollectionModel = {
            RefId: "5",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetMasterCollectionUrl, CollectionModel);
        promisePost.then(function (pl) {
            $scope.TurbineTypeArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    }

    function LoadDepartment() {
        var DepartmentModel = {
            DptId: "0",
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetdepartmentUrl, DepartmentModel);
        promisePost.then(function (pl) {
            $scope.DepartmentArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    function LoadStatus() {

        var StatusModel = {
            StsId: "0",
            view: "0"
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

    function LoadTurbine() {
        var TurbineModel = {
            Site: $scope.Site == null ? "0" : $scope.Site,
            View: "0"
        };
        var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
        promisePost.then(function (pl) {
            $scope.TurbineArray = pl.data.result;
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.TurbineDetails = function () {
        //LoadTurbine();
        $("#txtTurbine").val("");
        $("#hfTurbine").val("0");
        $scope.ChangeData();
    }

    $scope.Search = function () {
        $scope.sortType = 'SlNo'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchSummary = '';
        $scope.curPage = 0;
        $scope.sortType = null;
        $scope.sortReverse = false;
        if ($scope.RptType == "") {
            SetErrorMessage("Ensure report Type!");
            return false;
        }
        $scope.DateFrom = $("#txtDateFrom").val();
        $scope.DateTo = $("#txtDateTo").val();
        if ($scope.DateFrom == "" && $scope.DateTo != "") {
            SetErrorMessage("Ensure Date From!");
            // $("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.DateFrom != "") {
            SetErrorMessage("Ensure Date To!");
            //$("#txtDateTo").focus();
            return false;
        }
        var date = $scope.DateFrom;
        var startDate = date.split("/").reverse().join("-");

        var date1 = $scope.DateTo;
        var endDate = date1.split("/").reverse().join("-");

        if (($scope.DateTo != "" && $scope.DateFrom != "") && (Date.parse(startDate) > Date.parse(endDate))) {
            SetErrorMessage("Ensure Date From and To!");
            //$("#txtDateTo").focus();
            return false;
        }
        fnLoadGif();
        var ReportDetails = {
            RptType: $scope.RptType,
            StateId: $scope.State,
            SiteId: $scope.Site,
            TurbineTypeId: $scope.TurbineType,
            DptId: $scope.Department,
            CStatusId: $scope.Status,
            TbnId: $("#hfTurbine").val() == null ? "0" : $("#hfTurbine").val(),
            State: $scope.State == "0" ? "1" : $scope.State == "" ? "1" : "0",
            Site: $scope.Site == "0" ? "1" : $scope.Site == "" ? "1" : "0",
            TurbineType: $scope.TurbineType == "0" ? "1" : $scope.TurbineType == "" ? "1" : "0",
            Dept: $scope.Department == "0" ? "1" : $scope.Department == "" ? "1" : "0",
            CStatus: $scope.Status == "0" ? "1" : $scope.Status == "" ? "1" : "0",
            Turbine: $("#hfTurbine").val() == "0" ? "1" : $("#hfTurbine").val() == "" ? "1" : "0",
            DateFrom: $scope.DateFrom,
            DateTo: $scope.DateTo
        }

        var promisePost = CIR_OperationService.postCommonService(GetSummaryReportDetailsUrl, ReportDetails);
        promisePost.then(function (pl) {
            fnRemoveGif();
            $scope.ReportDetailsArray = []; $scope.ReportDetailsArrayLength = "";
            if (pl.data.result.SummaryReports.length != 0) {
                $scope.ReportDetailsArray = pl.data.result.SummaryReports;
                $scope.ReportDetailsArrayLength = pl.data.result.SummaryReports.length;
                var i = 1;
                angular.forEach($scope.ReportDetailsArray, function (value) {
                    value.SlNo = i;
                    i++;
                })

                $scope.ReportDetailsArrayFiltered = $scope.ReportDetailsArray;
            }
            else {
                SetErrorMessage("No Results Found!");
            }
            paging();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.ChangeData = function () {
        $scope.ReportDetailsArray = [];
    };

    $scope.Clear = function () {
        LoadSite("4", "2");
        $scope.RptType = "1",
        $scope.State = "0",
        $scope.Site = "0",
        $scope.TurbineType = "0",
        $scope.Department = "0",
        $scope.Status = "0",
        $("#txtTurbine").val("");
        $("#hfTurbine").val("0");
        $scope.DateFrom = "";
        $scope.DateTo = "";
        $scope.sortType = ''; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchSummary = '';
        $scope.curPage = 0;
        $scope.ReportDetailsArray = [];
        $scope.ReportDetailsArrayFiltered = [];
    }

    $scope.Download = function () {
        var _Url = GetDownloadUrl;
        _Url = _Url.replace("DownloadExcelSumRpt", "");
        fnLoadGif();
        var parameters = {
            Data: JSON.stringify($scope.ReportDetailsArray),
            SessionId: "SummaryRpt"
        };
        var promisePost = CIR_OperationService.postCommonService(_Url + 'FillDataSumRpt', parameters);
        promisePost.then(function (pl) {
            if (pl.data == "OK") {
                var _downloadUrl = _Url + 'DownloadExcelSumRpt/' + 'SummaryRpt';
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


    $scope.sortType = 'SlNo'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchSummary = '';

    $scope.curPage = 0;
    $scope.pageSize = GetPageSize;

    $scope.numberOfPages = function () {
        if ($scope.ReportDetailsArray != undefined)
            return Math.ceil($scope.ReportDetailsArray.length / $scope.pageSize);
    };

    $scope.$watch('searchSummary', function (val) {
        $scope.ReportDetailsArray = $filter('filter')($scope.ReportDetailsArrayFiltered, val);
    });

    $scope.LastPage = function () {
        if ($scope.ReportDetailsArray != undefined)
            $scope.curPage = (Math.ceil($scope.ReportDetailsArray.length / $scope.pageSize) - 1);
    }


});

app.controller('ReportPrint_OperController', function ($scope, CIR_OperationService) {

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

    $scope.LoadCIRDetails();

    $scope.LoadCIRDetails = function () {
        debugger
        var Data = {
            cirId: CIRorCIMId
        };
        var promisePost = CIR_OperationService.postCommonService(GetDetailUrl, Data);
        promisePost.then(function (pl) {

            if (pl.data.result.CIRDetail != undefined) {
                $("#hdnCIRorCIMId").val(pl.data.result.CIRDetail.CIRId);
                $scope.CIRNumberId = pl.data.result.CIRDetail.CIRId;
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
                $scope.EngineerName = pl.data.result.CIRDetail.Employee;
                $scope.EngineerSapId = pl.data.result.CIRDetail.EngineerSapId;
                $scope.FunctionalSystem = pl.data.result.CIRDetail.FuncSystem;
                $scope.ComponentGroup = pl.data.result.CIRDetail.ComponentGroup;
                $scope.GamesaPartCode = pl.data.result.CIRDetail.PartCode;
                $scope.ComponentMake = pl.data.result.CIRDetail.ComponentMake;
                $scope.FailureDuring = pl.data.result.CIRDetail.FailureDuring;
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

                var TurbineModel = {
                    Site: $scope.TSiteID,
                    TurbineId: $scope.TbnId,
                    View: "1",
                    Text: ""
                };
                var promisePost = CIR_OperationService.postCommonService(GetTurbineDetailsUrl, TurbineModel);
                promisePost.then(function (pl) {

                    if (pl.data.result[0] != undefined) {
                        $scope.Customer = pl.data.result[0].CustomerName;
                        $scope.Site = pl.data.result[0].SiteName;
                        $scope.Doc = pl.data.result[0].DOC;
                        $scope.WTGType = pl.data.result[0].WTGTypeName;
                        $scope.Temp = pl.data.result[0].Tempname;
                        $scope.Dust = pl.data.result[0].Dustname;
                        $scope.Corrosion = "";
                        $scope.THeight = pl.data.result[0].THeight;
                        $scope.Blade = pl.data.result[0].BladeName;
                        $scope.Generator = pl.data.result[0].Generator;
                        $scope.Gearbox = pl.data.result[0].GearBox;
                        $scope.EngineerName = pl.data.result[0].Employee;
                        $scope.EngineerSapId = pl.data.result[0].EngineerSapId;
                    }

                }, function (err) {
                    console.log("Err" + err);
                });
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
            //LoadIsAutoAssignOrNot();
        }, function (err) {
            console.log("Err" + err);
        });
    }

    function LoadActionPerformed() {
        debugger;
        var Data = {
            cirId: $scope.CIRNumberId
        };
        var promisePost = CIR_OperationService.postCommonService(GetCIRDetailsUrl, Data);
        promisePost.then(function (pl) {

            $scope.ActionPerformedArray = pl.data.result.CIRActionDetail;

        }, function (err) {
            console.log("Err" + err);
        });
    }

});

app.controller('ReportPrintDetails_OperController', function ($scope, CIR_OperationService) {

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
    $scope.FileDownload = "";
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
    $scope.CIRNumber = "";
    $scope.WONumber = "";
    $scope.AlarmDescription = "";
    $scope.IsCIR = true;

    fnLoadGif();

    View();


    var DetailUrl;

    if (sessionStorage.getItem("isCIR") == "true") {
        DetailUrl = GetDetailUrl;// GetCIRDUrl;

    }
    else {
        $scope.IsCIR = false;
        DetailUrl = GetCIMDetailsUrl;// GetCIMDUrl;
    }

    var isFileHaving = sessionStorage.getItem("FileHaving");
    $scope.IsFileHaving = isFileHaving;

    function View() {
        var Data;
        var promisePost;
        if (sessionStorage.getItem("isCIR") == "true") {
            Data = {
                encodeCirId: sessionStorage.getItem("page1content")
            };
            var promisePost = CIR_OperationService.postCommonService(GetDetailUrl, Data);
        }
        else {
            Data = {
                cimId: sessionStorage.getItem("page1content")
            };
            var promisePost = CIR_OperationService.postCommonService(GetCIMDetailsUrl, Data);
        }
        //     var promisePost = CIR_OperationService.postCommonService(GetDetailUrl, Data);
        promisePost.then(function (pl) {
            if (pl.data.result.CIRDetail != undefined) {
                if (sessionStorage.getItem("isCIR") == "true") {
                    $("#hdnCIRorCIMId").val(pl.data.result.CIRDetail.CIRId);
                    $("#hdnCIRNumber").val(pl.data.result.CIRDetail.CIRId);
                    $("#hdnCIR").val(pl.data.result.CIRDetail.CIRId);
                    $("#hdnCIRNumberImages").val(pl.data.result.CIRDetail.CIRId);
                    $("#hdnCIRImages").val(pl.data.result.CIRDetail.CIRId);
                    $scope.CIRNumberId = pl.data.result.CIRDetail.CIRId;
                    $scope.CIRNumber = pl.data.result.CIRDetail.CIRNumber;
                }
                else {
                    $("#hdnCIRorCIMId").val(pl.data.result.CIRDetail.CIMId);
                    $("#hdnCIRNumber").val(pl.data.result.CIRDetail.CIMId);
                    $("#hdnCIR").val(pl.data.result.CIRDetail.CIMId);
                    $("#hdnCIRNumberImages").val(pl.data.result.CIRDetail.CIMId);
                    $("#hdnCIRImages").val(pl.data.result.CIRDetail.CIMId);
                    $scope.CIRNumberId = pl.data.result.CIRDetail.CIMId;
                    $scope.CIRNumber = pl.data.result.CIRDetail.CIMNumber;
                }
                $scope.Alarmcode = pl.data.result.CIRDetail.ACode;
                $scope.Site = pl.data.result.CIRDetail.TSite;
                $scope.TurbineName = pl.data.result.CIRDetail.Turbine;
                $scope.TbnId = pl.data.result.CIRDetail.TbnId;
                $scope.DateofFailure = pl.data.result.CIRDetail.PDateOfFailure;
                $scope.TSiteID = pl.data.result.CIRDetail.TSiteID;
                $scope.SwVersion = pl.data.result.CIRDetail.SwVersion;
                $scope.FwVersion = pl.data.result.CIRDetail.HwVersion;
                $scope.WtgStatus = pl.data.result.CIRDetail.WTGStatus;
                $scope.WtgRunTime = pl.data.result.CIRDetail.PWTGStartTime;
                $scope.WtgStopTime = pl.data.result.CIRDetail.PWTGStopTime;
                $scope.Production = pl.data.result.CIRDetail.Production;
                $scope.RunHrs = pl.data.result.CIRDetail.RunHrs;
                $scope.EngineerName = pl.data.result.CIRDetail.EName;

                $scope.FunctionalSystem = pl.data.result.CIRDetail.FuncSystem;
                $scope.ComponentGroup = pl.data.result.CIRDetail.ComponentGroup;
                $scope.GamesaPartCode = pl.data.result.CIRDetail.PartCode;
                $scope.ComponentMake = pl.data.result.CIRDetail.ComponentMake;
                $scope.FailureDuring = pl.data.result.CIRDetail.FailureDuring;
                $scope.SerialNumber = pl.data.result.CIRDetail.SerialNumber;
                $scope.Problem = pl.data.result.CIRDetail.ProblemDesc;
                $scope.WONumber = pl.data.result.CIRDetail.WONumber;
                $scope.AlarmDescription = pl.data.result.CIRDetail.AlarmDesc;
                $scope.ConsequentialProblem = pl.data.result.CIRDetail.Consequence;
                $scope.ApprovalStatus = pl.data.result.CIRDetail.CStatus;
                $scope.What = pl.data.result.CIRDetail.What;
                $scope.When = pl.data.result.CIRDetail.When1;
                $scope.Who = pl.data.result.CIRDetail.Who;
                $scope.Where = pl.data.result.CIRDetail.Where1;
                $scope.Why = pl.data.result.CIRDetail.Why;
                $scope.HowToDo = pl.data.result.CIRDetail.HowTodo;
                $scope.HowMuch = pl.data.result.CIRDetail.Howmuch;
                //$scope.MobileNo = pl.data.result.CIRDetail.FEMobileNo;
                $scope.MobileNo = pl.data.result.CIRDetail.FOMMobileNo;
                $scope.FomName = pl.data.result.CIRDetail.FOMName;
                $scope.EmailId = pl.data.result.CIRDetail.FOMEmail;
                if ($scope.TbnId != "0") {
                    var TurbineModel = {
                        Site: $scope.TSiteID,
                        TurbineId: $scope.TbnId,
                        View: "1",
                        Text: ""
                    };
                    var promisePost = CIR_OperationService.postCommonService(GetTurbineUrl, TurbineModel);
                    promisePost.then(function (pl) {
                        if (pl.data.result.TurbineDetail[0] != undefined) {
                            $scope.Customer = pl.data.result.TurbineDetail[0].CustomerName;
                            $scope.Site = pl.data.result.TurbineDetail[0].SiteName;
                            $scope.Doc = pl.data.result.TurbineDetail[0].PDOC;
                            $scope.WTGType = pl.data.result.TurbineDetail[0].WTGTypeName;
                            $scope.Temp = pl.data.result.TurbineDetail[0].Tempname;
                            $scope.Dust = pl.data.result.TurbineDetail[0].DustName;
                            $scope.Corrosion = pl.data.result.TurbineDetail[0].Corrosion;
                            $scope.THeight = pl.data.result.TurbineDetail[0].TowerHeightName;
                            

                            $scope.Blade = pl.data.result.TurbineDetail[0].BladeName;
                            $scope.Generator = pl.data.result.TurbineDetail[0].Generator;
                            $scope.Gearbox = pl.data.result.TurbineDetail[0].GearBox;
                            $scope.EngineerSapId = pl.data.result.TurbineDetail[0].EngineerSapId;

                        }

                    }, function (err) {
                        fnRemoveGif();
                        console.log("Err" + err);
                    });
                }
                else {
                    $scope.Customer = pl.data.result.CIRDetail.Customer;
                    $scope.Site = pl.data.result.CIRDetail.TSite;
                    $scope.Doc = pl.data.result.CIRDetail.PDOC;
                    $scope.WTGType = pl.data.result.CIRDetail.WTGType;
                    $scope.Temp = pl.data.result.CIRDetail.TempName;
                    $scope.Dust = pl.data.result.CIRDetail.DustName;
                    $scope.Corrosion = pl.data.result.CIRDetail.CorrosionName;
                    $scope.THeight = pl.data.result.CIRDetail.THeightName;
                    $scope.Blade = pl.data.result.CIRDetail.BladetName;
                    $scope.Generator = pl.data.result.CIRDetail.GeneratorName;
                    $scope.Gearbox = pl.data.result.CIRDetail.GearBoxName;
                    $scope.FomName = pl.data.result.CIRDetail.FOMName;
                    $scope.LoadFOMDetails = function () {
                        var EmployeeModel = {
                            EmpId: $scope.FOM,
                            View: "1"
                        };
                        var promisePost = CIR_OperationService.postCommonService(GetEmployeeDetailsUrl, EmployeeModel);
                        promisePost.then(function (pl) {
                            if (pl.data.result[0] != undefined) {
                                $scope.EmailId = pl.data.result[0].Email;
                                //$scope.MobileNo = pl.data.result[0].OMobile;
                            }
                        }, function (err) {
                            SetWarningMessage("Transaction Issue. Please try again.");
                            console.log("Error in loading the employee details based on the empId : " + err);
                        });
                    }
                }
            }
            if (pl.data.result.CIRFileDetail.length != 0) {
                debugger;
                $scope.CIRFilesArray = pl.data.result.CIRFileDetail;
            }
            if (pl.data.result.CIRComments != undefined) {
                $scope.CIRCommentsArray = pl.data.result.CIRComments;
            }
            $scope.ActionPerformedArray = pl.data.result.CIRActionDetail;

        }, function (err) {
            fnRemoveGif();
            console.log("Err" + err);
        });
    };

    function LoadActionPerformed() {
        if (sessionStorage.getItem("isCIR") == "true") {
            Data = {
                cirId: sessionStorage.getItem("page1content")
            };
        }
        else {
            Data = {
                cimId: sessionStorage.getItem("page1content")
            };

        }
        var promisePost = CIR_OperationService.postCommonService(DetailUrl, Data);
        promisePost.then(function (pl) {
            $scope.ActionPerformedArray = pl.data.result.CIRActionDetail;

        }, function (err) {
            fnRemoveGif();
            console.log("Err" + err);
        });
    }

    $scope.FileDownload = function () {

        var Data = {
            cirFileDetails: $scope.CIRFilesArray
        };
        var promisePost = CIR_OperationService.postCommonService(DownloadFilesUrl, Data);
        promisePost.then(function (pl) {

        }, function (err) {
            fnRemoveGif();
            console.log("Err" + err);
        });
    };
    fnRemoveGif();
});

app.controller('CIRStackedReport_OperController', function ($scope, CIR_OperationService, $filter) {

    fnLoadGif();

    $scope.StateSelect = "0";
    $scope.SiteSelect = "0";
    $scope.WTGTypeSelect = "0";
    $scope.FilterSelect = "1";
    $scope.DateTo = "";
    $scope.DateFrom = "";

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
    $scope.DateTo = output;
    $scope.DateFrom = output;
    $("#txtDateFrom").val($scope.DateFrom);
    $("#txtDateTo").val($scope.DateTo);

    $scope.Add = true;
    $scope.View = true;
    $scope.Update = true;
    $scope.Delete = true;
    $scope.Download = true;

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
            pageName: "State Wise Analytics Report"
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

    $scope.ChangeData = function () {
        $scope.DetailsArray = [];

        if (window.myBar != null)
            window.myBar.destroy();
    };

    $scope.ChangeActive = function (event) {
        $("#aDate,#aWeek,#aMonth").removeClass("active");
        $("#" + event.currentTarget.id).addClass("active");

        if (event.currentTarget.id == "aDate") {
            $scope.FilterSelect = "3";
        }/* else if (event.currentTarget.id == "aWeek") {
            $scope.FilterSelect = "2";
            $scope.DateTo = "";
        } */else {
            $scope.FilterSelect = "1";
        }

        if ($scope.DateFrom == "") {
            SetErrorMessage("Ensure Date From!");
            $("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.FilterSelect != "2") {
            SetErrorMessage("Ensure Date To!");
            $("#txtDateTo").focus();
            return false;
        }
        $scope.StateSelect = "0";
        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";
        $scope.PrepareAnalyticsRpt(false);
    };

    function randomColorFactor() {
        return Math.round(Math.random() * 255);
    };

    function randomColor() {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
    };

    $scope.PrepareAnalyticsRpt = function (isPageLoad) {
        $("#Maincontent").css('display', 'block');
        $("#content").css('display', 'block');

        $scope.DateFrom = $("#txtDateFrom").val();
        $scope.DateTo = $("#txtDateTo").val();
        if ($scope.DateFrom == "") {
            SetErrorMessage("Ensure Date From!");
            $("#txtDateFrom").focus();
            return false;
        }
        if ($scope.DateTo == "" && $scope.FilterSelect != "2") {
            SetErrorMessage("Ensure Date To!");
            $("#txtDateTo").focus();
            return false;
        }

        var date = $scope.DateFrom;
        var startDate = date.split("/").reverse().join("-");

        var date1 = $scope.DateTo;
        var endDate = date1.split("/").reverse().join("-");

        if ($scope.FilterSelect != "2" && (Date.parse(startDate) > Date.parse(endDate))) {
            SetErrorMessage("Ensure Date From and To!");
            $("#txtDateTo").focus();
            return false;
        }

        var ReportDetails = {
            DateFrm: $scope.DateFrom,
            DateTo: $scope.DateTo,
            Filter: $scope.FilterSelect == null ? "0" : $scope.FilterSelect,
            State: $scope.StateSelect == null ? "0" : $scope.StateSelect,
            Site: $scope.SiteSelect == null ? "0" : $scope.SiteSelect,
            WTGType: $scope.WTGTypeSelect == null ? "0" : $scope.WTGTypeSelect
        }
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetReportDetailUrl, ReportDetails);
        promisePost.then(function (pl) {
            var Data1 = "";
            if (window.myBar != null)
                window.myBar.destroy();

            if (pl.data.Data1 != "" && JSON.parse(pl.data.Data1) != null) {
                Data1 = JSON.parse(pl.data.Data1);

                if (Data1 != null && Data1.length > 0) {
                    var barChartData = {
                        labels: Data1[0].Data.split(','),
                        datasets: [
                            {
                                label: Data1[6].Label,
                                backgroundColor: "rgba(76,175,80,1)",
                                data: Data1[6].Data.split(',').map(Number)
                            }, {
                                label: Data1[1].Label,
                                backgroundColor: "rgba(51,122,183,0.8)",
                                data: Data1[1].Data.split(',').map(Number)
                            }, {
                                label: Data1[2].Label,
                                backgroundColor: "rgba(194,70,66,1)",
                                data: Data1[2].Data.split(',').map(Number)
                            }, {
                                label: Data1[3].Label,
                                backgroundColor: "rgba(205,220,57,1)",
                                data: Data1[3].Data.split(',').map(Number)
                            }, {
                                label: Data1[4].Label,
                                backgroundColor: "rgba(0,188,212,0.7)",
                                data: Data1[4].Data.split(',').map(Number)
                            }, {
                                label: Data1[5].Label,
                                backgroundColor: "rgba(209,84,230,0.8)",
                                data: Data1[5].Data.split(',').map(Number)
                            }, {
                                label: Data1[7].Label,
                                backgroundColor: "rgba(81,187,81,0.5)",
                                data: Data1[7].Data.split(',').map(Number)
                            }, {
                                label: Data1[8].Label,
                                backgroundColor: "rgba(158,158,158,0.5)",
                                data: Data1[8].Data.split(',').map(Number)
                            }]
                    };

                    config = {
                        type: 'bar',
                        data: barChartData,
                        options: {
                            tooltips: {
                                mode: 'label'
                            },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    stacked: true,
                                }],
                                yAxes: [{
                                    stacked: true
                                }]
                            }
                        }
                    }

                    var ctx = document.getElementById("canvas").getContext("2d");
                    window.myBar = new Chart(ctx, config);
                }
            }
            else {
                if (!isPageLoad)
                    SetErrorMessage("No Results Found!");
            }
            $scope.DetailsArray = [];
            if (pl.data.result.AnalyticsPointDetails.length != 0) {
                $scope.DetailsArray = pl.data.result.AnalyticsPointDetails;
            }

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            $scope.LogFile(err.config.url + " and the method is :" + err.config.method);
        });
    };

    $scope.Clear = function () {
        $scope.StateSelect = "0";
        $scope.DateTo = "";
        $scope.DateFrom = "";
        $scope.StateSelect = "0";
        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";

        $("#aDate,#aMonth").removeClass("active");
        $("#aMonth").addClass("active");
        $scope.FilterSelect = "1";

        $scope.DetailsArray = [];

        if (window.myBar != null)
            window.myBar.destroy();
    }

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
   
    $scope.PrepareAnalyticsRpt(true);
    fnRemoveGif();
});

app.controller('DMAnalytics_OperController', function ($scope, CIR_OperationService) {

    // Declaration

    fnLoadGif();

    $scope.ddlDMTitle = $scope.ddlStatus = "0";

    loadDMTitle(); LoadStatus();


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

    function randomColorFactor() {
        return Math.round(Math.random() * 255);
    };

    function randomColor() {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
    };

    $scope.DMAnalyticsRpt = function (isPageLoad) {
        $("#Maincontent").css('display', 'block');
        $("#content").css('display', 'block');
        var ReportDetails = {
            Title: $scope.ddlDMTitle,
            Status: $scope.ddlStatus
        }
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(DMAnalyticsUrl, ReportDetails);
        promisePost.then(function (pl) {
            var Data1 = "";
            if (window.myBar != null)
                window.myBar.destroy();

            if (pl.data.Data1 != "" && JSON.parse(pl.data.Data1) != null) {
                Data1 = JSON.parse(pl.data.Data1);
                $scope.DataDMArray = []; $scope.Completed = []; $scope.Pending = [];
                for (var i = 0; i < pl.data.result.DMAnalyticsDetail.length; i++) {
                    $scope.DataDMArray.push(pl.data.result.DMAnalyticsDetail[i].Title);
                }
                for (var i = 0; i < pl.data.result.DMAnalyticsDetail.length; i++) {
                    $scope.Completed.push(pl.data.result.DMAnalyticsDetail[i].Completed);
                }
                for (var i = 0; i < pl.data.result.DMAnalyticsDetail.length; i++) {
                    $scope.Pending.push(pl.data.result.DMAnalyticsDetail[i].Pending);
                }
                var DataArray = []; var DataValue = []; $scope.NewData = []; var cols = []; var NewData = [];
                DataValue.push($scope.Completed, $scope.Pending);
                cols = Object.keys(pl.data.result.DMAnalyticsDetail[0]);
                for (var i = 0; i < Data1.length; i++) {
                    NewData.push(Data1[i].Data);
                }
                $scope.DataArray1 = Data1[0].Data.split(',').map(Number);
                cols.splice(cols, 1);
                DataArray.push({ 'label': cols, 'backgroundColor': randomColor(), 'data': NewData });
                debugger;
                var barChartData = "";
                if (Data1 != null && Data1.length > 0) {
                     barChartData = {
                        labels: $scope.DataDMArray,
                        datasets: DataArray
                        //    [
                        //    {
                        //        label: $scope.cols,
                         //        backgroundColor:  "rgba(51,122,183,0.8)",
                        //        data: $scope.Completed
                        //    }
                        //    //, {
                        //    //    label: Data1[1].Label,
                        //    //    backgroundColor: "rgba(51,122,183,0.8)",
                        //    //    data: $scope.Pending
                        //    //}
                        //]
                    };

                    config = {
                        type: 'bar',
                        data: barChartData,
                        options: {
                            tooltips: {
                                mode: 'label'
                            },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    stacked: true,
                                }],
                                yAxes: [{
                                    stacked: true
                                }]
                            }
                        }
                    }

                    var ctx = document.getElementById("canvas").getContext("2d");
                    window.myBar = new Chart(ctx, config);
                }
            }
            else {
                if (!isPageLoad)
                    SetErrorMessage("No Results Found!");
            }
            //$scope.DetailsArray = [];
            //if (pl.data.result.AnalyticsPointDetails.length != 0) {
            //    $scope.DetailsArray = pl.data.result.AnalyticsPointDetails;
            //    paging();
            //}

            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in searching the Report details : " + err);
        });
    };

    $scope.Clear = function () {
        $scope.StateSelect = "0";
        $scope.DateTo = "";
        $scope.DateFrom = "";
        $scope.StateSelect = "0";
        $scope.SiteSelect = "0";
        $scope.WTGTypeSelect = "0";

        $("#aDate,#aMonth").removeClass("active");
        $("#aMonth").addClass("active");
        $scope.FilterSelect = "1";

        $scope.DetailsArray = [];

        if (window.myBar != null)
            window.myBar.destroy();
    }

    $scope.DetailsArray = [];
    $scope.itemsPerPage = 10; // Per page items

    function paging() {
        $scope.currentPage = 0;
        $scope.range = function () {
            var rangeSize = 5;
            var ret = [];
            var start;

            start = $scope.currentPage;
            if (start > $scope.pageCount() - rangeSize) {
                start = $scope.pageCount() - rangeSize + 1;
            }

            for (var i = start; i < start + rangeSize; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.prevPageDisabled = function () {
            return $scope.currentPage === 0 ? "disabled" : "";
        };

        $scope.pageCount = function () {
            return Math.ceil($scope.DetailsArray.length / $scope.itemsPerPage) - 1;
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pageCount()) {
                $scope.currentPage++;
            }
        };

        $scope.nextPageDisabled = function () {
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        };

        $scope.setPage = function (n) {
            $scope.currentPage = n;
        };
    };

    $scope.DMAnalyticsRpt(true);

    fnRemoveGif();

});

angular.module('CIRModule').filter('pagination', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    };
});


