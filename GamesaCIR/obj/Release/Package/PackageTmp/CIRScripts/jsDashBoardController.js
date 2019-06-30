app.controller('DashBoard_OperController', function ($scope, CIR_OperationService) {

    $scope.Previous = "";
    $scope.Current = "";
    $scope.Next = "";
    $scope.DsgId = "";
    $scope.DashBoardType = "1";
    $scope.TypeOfCollection = "Monthly";
    $scope.IsMyPending = "0";
    $scope.Add = "1";
    $scope.View = "1";
    $scope.Update = "1";
    $scope.Download = "1";
    fnSetAccess();
    fnSetAccessVersionUpdate();

    function fnSetAccess() {
        var Data = {
            pageName: "Dashboard"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Add = pl.data.result.Add;
            $scope.View = pl.data.result.View;
            $scope.Update = pl.data.result.Update;

            $("#Maincontent").css('display', 'block');
            fnLoad();
        }, function (err) {
            $("#Maincontent").css('display', 'block');
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in accessing the Page details : " + err);
        });
    }

    function fnSetAccessVersionUpdate() {
        var Data = {
            pageName: "Turbine Version Update"
        };

        var promisePost = CIR_OperationService.postCommonService(GetAccessUrl, Data);
        promisePost.then(function (pl) {
            $scope.Download = pl.data.result.Download;
            $("#Maincontent").css('display', 'block');
            fnLoad();
        }, function (err) {
            $("#Maincontent").css('display', 'block');
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in accessing the Page details : " + err);
        });
    }

    function fnLoad() {

        fnLoadGif();
        var Data = fnDropDownData($("#ddlTypeForCollection").val(), $("#spnCurrent").text(), $("#spnNext").text(), $("#spnPrevious").text());

        var promisePost = CIR_OperationService.postCommonService(GetDashBoardDetailsFroFEUrl, Data);
        promisePost.then(function (pl) {
            $scope.DashBoardArray = pl.data.result.DashBoardData;
            $scope.DsgId = pl.data.result.DsgId;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            console.log("Error in loading the dashbard details for FE : " + err);
            SetWarningMessage("Transaction Issue. Please try again.");

        });
        fnLoadGif();
        var Data = fnDropDownData($("#ddlTypeForCollectionFORVersionUpdt").val(), $("#spnCurrentFORVersionUpdt").text(), $("#spnNextFORVersionUpdt").text(), $("#spnPreviousFORVersionUpdt").text());

        var promisePost = CIR_OperationService.postCommonService(GetPendingDetailsFoVersionUpdtEUrl, Data);
        promisePost.then(function (pl) {
            debugger;
            $scope.DashBoardArrayFORVersionUpdt = pl.data.result.DashBoardData;
          //  $scope.DsgId = pl.data.result.DsgId;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            console.log("Error in loading the dashbard details for FE : " + err);
            SetWarningMessage("Transaction Issue. Please try again.");

        });
        fnLoadGif();
        var Data1 = fnDropDownData($("#ddlTypeForCollectionFORFSR").val(), $("#spnCurrentFORFSR").text(), $("#spnNextFORFSR").text(), $("#spnPreviousFORFSR").text());
        var promisePost = CIR_OperationService.postCommonService(GetDashBoardDetailsForFSRUrl, Data1);
        promisePost.then(function (pl) {
            $scope.DashBoardArrayFORFSR = pl.data.result.DashBoardData;
            $scope.DsgId = pl.data.result.DsgId;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the dashboard details for FSR : " + err);

        });
        IsDashboardAvailable();
    }

    function IsDashboardAvailable() {
        $("#responsive-tabs-wrapper").ready(function () {
            if ($scope.Add == "1") { $('#tablist1-tab1').addClass('responsive-tabs__list__item responsive-tabs__list__item--active'); }
            else {  $('#tablist1-tab1').css('display', 'none');  }
             if ($scope.Update == "1") {$('#tablist1-tab2').addClass('responsive-tabs__list__item responsive-tabs__list__item--active'); }
             else { $('#tablist1-tab2').css('display', 'none');   }
             if ($scope.Download == "1") {  $('#tablist1-tab3').addClass('responsive-tabs__list__item responsive-tabs__list__item--active'); }
             else { $('#tablist1-tab3').css('display', 'none');}
        });
    }

    function fnDropDownData(ddlValue, current, next, previous) {
        var currentDate = new Date();
        var monthNames = ["Sam", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var twoDigitMonth = ((parseInt(currentDate.getMonth() + 1)).toString().length != 1) ? (parseInt(currentDate.getMonth() + 1)) : '0' + (parseInt(currentDate.getMonth() + 1));
        var MonthValue = current;
        var DateToValue = next;
        var monthInInteger;

        if (ddlValue == "Monthly") {
            switch (MonthValue.split(' ')[0]) {
                case "Jan":
                    monthInInteger = "01";
                    break;
                case "Feb":
                    monthInInteger = "02";
                    break;
                case "Mar":
                    monthInInteger = "03";
                    break;
                case "Apr":
                    monthInInteger = "04";
                    break;
                case "May":
                    monthInInteger = "05";
                    break;
                case "Jun":
                    monthInInteger = "06";
                    break;
                case "Jul":
                    monthInInteger = "07";
                    break;
                case "Aug":
                    monthInInteger = "08";
                    break;
                case "Sep":
                    monthInInteger = "09";
                    break;
                case "Oct":
                    monthInInteger = "10";
                    break;
                case "Nov":
                    monthInInteger = "11";
                    break;
                case "Dec":
                    monthInInteger = "12";
                    break;
            }
            var Data = {
                DType: "1",
                Month: monthInInteger,
                Year: MonthValue.split(' ')[1],
                DateFrm: "",
                DateTo: ""
            }
        }
        else if (ddlValue == "Yearly") {
            var Data = {
                DType: "3",
                Year: MonthValue,
                DateFrm: "",
                DateTo: "",
                Month: "0"
            }
        }
        else if (ddlValue == "Weekly") {
            var Data = {
                DateFrm: (((parseInt(MonthValue.split('-')[0])).toString().length != 1) ? (parseInt(MonthValue.split('-')[0])) : '0' + (parseInt(MonthValue.split('-')[0]))) + "/" + (((parseInt(MonthValue.split('-')[1])).toString().length != 1) ? (parseInt(MonthValue.split('-')[1])) : '0' + (parseInt(MonthValue.split('-')[1]))) + "/" + (MonthValue.split('-')[2]),
                DateTo: (((parseInt(MonthValue.split('-')[0])).toString().length != 1) ? (parseInt(MonthValue.split('-')[0])) : '0' + (parseInt(MonthValue.split('-')[0]))) + "/" + (((parseInt(DateToValue.split('-')[1])).toString().length != 1) ? (parseInt(DateToValue.split('-')[1])) : '0' + (parseInt(DateToValue.split('-')[1]))) + "/" + (DateToValue.split('-')[2]),
                DType: "2",
                Year: "0",
                Month: "0"
            }
        }

        return Data;
    }

    $scope.GetDetailsForFE = function () {
        var Data = fnDropDownData($("#ddlTypeForCollection").val(), $("#spnCurrent").text(), $("#spnNext").text(), $("#spnPrevious").text());
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetDashBoardDetailsFroFEUrl, Data);
        promisePost.then(function (pl) {
            $scope.DashBoardArray = pl.data.result.DashBoardData;
            $scope.DsgId = pl.data.result.DsgId;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in getting the details for FE : " + err);

        });

    };

    $scope.GetDetailsForFSR = function () {
        var Data = fnDropDownData($("#ddlTypeForCollectionFORFSR").val(), $("#spnCurrentFORFSR").text(), $("#spnNextFORFSR").text(), $("#spnPreviousFORFSR").text());
        fnLoadGif();
        var promisePost = CIR_OperationService.postCommonService(GetDashBoardDetailsForFSRUrl, Data);
        promisePost.then(function (pl) {
            $scope.DashBoardArrayFORFSR = pl.data.result.DashBoardData;
            $scope.DsgId = pl.data.result.DsgId;
            fnRemoveGif();
        }, function (err) {
            fnRemoveGif();
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error getting the details for FSR : " + err);
        });
    }

    $scope.ShowDsgId = function () {
        return ($scope.DsgId == 1 || $scope.DsgId == 2);
    }

    $scope.GetDetailsForPending = function (Desig) {
        var ddlValue = $("#ddlTypeForCollection").val();
        var Data = fnDropDownData(ddlValue, $("#spnCurrent").text(), $("#spnNext").text(), $("#spnPrevious").text());
        fnLoadGif();
        if (Desig == "0") {
            var promisePost = CIR_OperationService.postCommonService(GetPendingDetailsForFEUrl, Data);
            promisePost.then(function (pl) {
                fnRemoveGif();
                $scope.PendingDetailsArray = pl.data.result.PendingDetailsForFE;
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in getting details for Pending To FE : " + err);
            });
        }
        else {

            var currentDate = new Date();
            var monthNames = ["Sam", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var twoDigitMonth = ((parseInt(currentDate.getMonth() + 1)).toString().length != 1) ? (parseInt(currentDate.getMonth() + 1)) : '0' + (parseInt(currentDate.getMonth() + 1));
            var MonthValue = $("#spnCurrent").text();
            var DateToValue = $("#spnNext").text();
            var monthInInteger;

            if (ddlValue == "Monthly") {
                switch (MonthValue.split(' ')[0]) {
                    case "Jan":
                        monthInInteger = "01";
                        break;
                    case "Feb":
                        monthInInteger = "02";
                        break;
                    case "Mar":
                        monthInInteger = "03";
                        break;
                    case "Apr":
                        monthInInteger = "04";
                        break;
                    case "May":
                        monthInInteger = "05";
                        break;
                    case "Jun":
                        monthInInteger = "06";
                        break;
                    case "Jul":
                        monthInInteger = "07";
                        break;
                    case "Aug":
                        monthInInteger = "08";
                        break;
                    case "Sep":
                        monthInInteger = "09";
                        break;
                    case "Oct":
                        monthInInteger = "10";
                        break;
                    case "Nov":
                        monthInInteger = "11";
                        break;
                    case "Dec":
                        monthInInteger = "12";
                        break;
                }
                var Data = {
                    DType: "1",
                    Month: monthInInteger,
                    Year: MonthValue.split(' ')[1],
                    DateFrm: "",
                    DateTo: "",
                    Desig: Desig
                }
            }
            else if (ddlValue == "Yearly") {
                var Data = {
                    DType: "3",
                    Year: MonthValue,
                    DateFrm: "",
                    DateTo: "",
                    Month: "0",
                    Desig: Desig
                }
            }
            else if (ddlValue == "Weekly") {
                var Data = {
                    DateFrm: (((parseInt(MonthValue.split('-')[0])).toString().length != 1) ? (parseInt(MonthValue.split('-')[0])) : '0' + (parseInt(MonthValue.split('-')[0]))) + "/" + (((parseInt(MonthValue.split('-')[1])).toString().length != 1) ? (parseInt(MonthValue.split('-')[1])) : '0' + (parseInt(MonthValue.split('-')[1]))) + "/" + (MonthValue.split('-')[2]),
                    DateTo: (((parseInt(MonthValue.split('-')[0])).toString().length != 1) ? (parseInt(MonthValue.split('-')[0])) : '0' + (parseInt(MonthValue.split('-')[0]))) + "/" + (((parseInt(DateToValue.split('-')[1])).toString().length != 1) ? (parseInt(DateToValue.split('-')[1])) : '0' + (parseInt(DateToValue.split('-')[1]))) + "/" + (DateToValue.split('-')[2]),
                    DType: "2",
                    Year: "0",
                    Month: "0",
                    Desig: Desig
                }
            }

            var promisePost = CIR_OperationService.postCommonService(GetPendingDetailsForFEOthersUrl, Data);
            promisePost.then(function (pl) {
                fnRemoveGif();
                $scope.PendingDetailsArray = pl.data.result.PendingDetailsForFE;
                $scope.IsMyPending = pl.data.result.IsMyPending == "1" ? "1" : "0";
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in getting details for Pending To FE : " + err);
            });
        }
    }

    $scope.GetDetailsForPendingFORFSR = function (Desig) {
        debugger
        var ddlValue = $("#ddlTypeForCollectionFORFSR").val();
        var Data = fnDropDownData($("#ddlTypeForCollectionFORFSR").val(), $("#spnCurrentFORFSR").text(), $("#spnNextFORFSR").text(), $("#spnPreviousFORFSR").text());
        fnLoadGif();
        if (Desig == "0") {
            var promisePost = CIR_OperationService.postCommonService(GetPendingDetailsForFSRUrl, Data);
            promisePost.then(function (pl) {
                fnRemoveGif();
                $scope.PendingDetailsArray = pl.data.result.PendingDetailsForFE;
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in getting the details for pending FSR : " + err);
            });
        }
        else {
            var currentDate = new Date();
            var monthNames = ["Sam", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var twoDigitMonth = ((parseInt(currentDate.getMonth() + 1)).toString().length != 1) ? (parseInt(currentDate.getMonth() + 1)) : '0' + (parseInt(currentDate.getMonth() + 1));
            var MonthValue = $("#spnCurrentFORFSR").text();
            var DateToValue = $("#spnNextFORFSR").text();
            var monthInInteger;

            if (ddlValue == "Monthly") {
                switch (MonthValue.split(' ')[0]) {
                    case "Jan":
                        monthInInteger = "01";
                        break;
                    case "Feb":
                        monthInInteger = "02";
                        break;
                    case "Mar":
                        monthInInteger = "03";
                        break;
                    case "Apr":
                        monthInInteger = "04";
                        break;
                    case "May":
                        monthInInteger = "05";
                        break;
                    case "Jun":
                        monthInInteger = "06";
                        break;
                    case "Jul":
                        monthInInteger = "07";
                        break;
                    case "Aug":
                        monthInInteger = "08";
                        break;
                    case "Sep":
                        monthInInteger = "09";
                        break;
                    case "Oct":
                        monthInInteger = "10";
                        break;
                    case "Nov":
                        monthInInteger = "11";
                        break;
                    case "Dec":
                        monthInInteger = "12";
                        break;
                }
                var Data = {
                    DType: "1",
                    Month: monthInInteger,
                    Year: MonthValue.split(' ')[1],
                    DateFrm: "",
                    DateTo: "",
                    Desig: Desig
                }
            }
            else if (ddlValue == "Yearly") {
                var Data = {
                    DType: "3",
                    Year: MonthValue,
                    DateFrm: "",
                    DateTo: "",
                    Month: "0",
                    Desig: Desig
                }
            }
            else if (ddlValue == "Weekly") {
                var Data = {
                    DateFrm: (((parseInt(MonthValue.split('-')[0])).toString().length != 1) ? (parseInt(MonthValue.split('-')[0])) : '0' + (parseInt(MonthValue.split('-')[0]))) + "/" + (((parseInt(MonthValue.split('-')[1])).toString().length != 1) ? (parseInt(MonthValue.split('-')[1])) : '0' + (parseInt(MonthValue.split('-')[1]))) + "/" + (MonthValue.split('-')[2]),
                    DateTo: (((parseInt(MonthValue.split('-')[0])).toString().length != 1) ? (parseInt(MonthValue.split('-')[0])) : '0' + (parseInt(MonthValue.split('-')[0]))) + "/" + (((parseInt(DateToValue.split('-')[1])).toString().length != 1) ? (parseInt(DateToValue.split('-')[1])) : '0' + (parseInt(DateToValue.split('-')[1]))) + "/" + (DateToValue.split('-')[2]),
                    DType: "2",
                    Year: "0",
                    Month: "0",
                    Desig: Desig
                }
            }

            var promisePost = CIR_OperationService.postCommonService(GetPendingDetailsForFSROthersUrl, Data);
            promisePost.then(function (pl) {
                fnRemoveGif();
                $scope.PendingDetailsArray = pl.data.result.PendingDetailsForFE;
                $scope.IsMyPending = pl.data.result.IsMyPending == "1" ? "1" : "0";
            }, function (err) {
                fnRemoveGif();
                SetWarningMessage("Transaction Issue. Please try again.");
                console.log("Error in getting details for Pending To FE : " + err);
            });
        }
    }

    $scope.LoadCIR = function (CIRID) {
        var Data = {
            CIRId: CIRID,
            IsMyPending: $scope.IsMyPending
        };

        var promisePost = CIR_OperationService.postCommonService(GetRedirectToCIRUrl, Data);
        promisePost.then(function (pl) {

            window.location.href = CIRDetailsUrl;
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");

            console.log("Error in loading the CIR : " + err);
        });
    }

    $scope.LoadCIM = function (CIMID) {
        debugger
        var Data = {
            cimId: CIMID,
            IsMyPending: $scope.IsMyPending
        };
        var promisePost = CIR_OperationService.postCommonService(GetRedirectToCIMUrl, Data);
        promisePost.then(function (pl) {
            window.location.href = CIMDetailsUrl;
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in loading the FSr details : " + err);
        });
    }

    $(document).ready(function () {
        $("#tablist1-tab2").click(function () {
            $('#tablist1-panel2').show();
        });
        $("#tablist1-tab1").click(function () {
            $('#tablist1-panel1').show();    
        });
        $("#tablist1-tab3").click(function () {
            $('#tablist1-panel3').show();
        });
    });

});

app.controller('CIRPendingAnalyticsReport_OperController', function ($scope, CIR_OperationService) {
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
                paging();
            }

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

    $scope.PrepareAnalyticsRpt(true);

});

app.filter('offset', function () {
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});
