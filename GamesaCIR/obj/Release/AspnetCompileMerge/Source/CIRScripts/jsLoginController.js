app.controller('Login_OperController', function ($scope, CIR_OperationService) {

    $scope.ICHCode = ""; $scope.SapCode = ""; $scope.attemptfailure = "";

    $.cookie('UId', null);

    $scope.Login = function () {
        if ($.trim($scope.UserName) == "") {
            SetErrorMessage("Ensure User Name!");
            $("#txtUserName").focus();
            return false;
        }
        if ($.trim($scope.Password) == "") {
            SetErrorMessage("Ensure Password!");
            $("#txtPassword").focus();
            return false;
        }
        var LoginModel = {
            UserName: $scope.UserName,
            Password: $scope.Password
        };
        var promisePost = CIR_OperationService.postCommonService(LoginCredentialsUrl, LoginModel);
        promisePost.then(function (pl) {
           
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True" || $scope.Message.Clear == "1") {
                window.location.href = DashBoardUrl;
            }
            if ($scope.Message.Clear == "False" || $scope.Message.Clear == "0") {
                SetErrorMessage($scope.Message.Msg);
            }
            if (pl.data.result.Flag != null) {
                if (pl.data.result.logindetail != null) {
                    $scope.UId = $.cookie('UId', pl.data.result.logindetail.EmpID);
                }
                if (pl.data.result.Flag.LoginFlag == true) {
                    window.location.href = ChangePwdUrl;
                }
                if (pl.data.result.Flag.ExpiryFlag == true) {
                    window.location.href = ChangePwdUrl;
                }

            }
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in validating the login credetials  : " + err);
        });
    };

    $scope.SendMail = function () {

        if ($scope.ICHCode == "") {
            clearTimeout(test);
            $.noty.clearQueue();
            $.noty.closeAll();
            generate('error', "Ensure ICH Code!");
            test = setTimeout(function () {
                $.noty.clearQueue();
                $.noty.closeAll();
            }, 7000);
            return false;
        }

        if ($scope.SapCode == "") {
            clearTimeout(test);
            $.noty.clearQueue();
            $.noty.closeAll();
            generate('error', "Ensure SAP Code!");
            test = setTimeout(function () {
                $.noty.clearQueue();
                $.noty.closeAll();
            }, 7000);
            return false;
        }

        var Data = {
            sapCode: $scope.SapCode,
            ichCode: $scope.ICHCode
        };

        var promisePost = CIR_OperationService.postCommonService(SetForgetPasswordUrl, Data);
        promisePost.then(function (pl) {
            $scope.Message = pl.data.result.message;
            if ($scope.Message.Clear == "True" || $scope.Message.Clear == "1") {
                SetSuccessMessage($scope.Message.Msg);
                $scope.SapCode = $scope.ICHCode = "";
            }
            else {
                SetErrorMessage($scope.Message.Msg);
            }

        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in sending the forget password details : " + err);
        });

    };
});

app.controller('ChangePwd_OperController', function ($scope, CIR_OperationService) {

    // Initialization..
    $scope.OldPassword = $scope.NewPassword = $scope.RepeatPassword = ''; $('#OldPassword').focus();
    $scope.UId = $.cookie('UId');

    if ($scope.UId == "null" || $scope.UId == "" || $scope.UId == null || $scope.UId == undefined) {
        window.location.href = LoginUrl;
    }
    $scope.Login = function () {
        if ($scope.OldPassword == '') {
            SetErrorMessage("Ensure Old Password!"); $('#OldPassword').focus(); return false;
        }
        if ($scope.NewPassword == '') {
            SetErrorMessage("Ensure New Password!"); $('#NewPassword').focus(); return false;
        }
        if ($scope.RepeatPassword == '') {
            SetErrorMessage("Ensure Repeat Password!"); $('#RepeatPassword').focus(); return false;
        }
        if ($scope.NewPassword != $scope.RepeatPassword) {
            SetErrorMessage("New Password and Repeat Password should be same!"); $('#NewPassword').focus(); return false;
        }
        var Data = {
            oldPassword: $scope.OldPassword,
            newPassword: $scope.NewPassword,
            flag: "0",
            UId: $scope.UId
        }
        var promisePost = CIR_OperationService.postCommonService(SetChangePasswordUrl, Data);
        promisePost.then(function (pl) {
            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                $scope.OldPassword = $scope.NewPassword = $scope.RepeatPassword = ''; $('#OldPassword').focus();
                window.location.href = LoginUrl;
            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in saving the password" + err);
        });
    }
    $scope.RepeatKeyPress = function (e) {
        var keycode = e.which;
        if (keycode == "13") {
            $scope.Login();
        }
    }
});

app.controller('ChangePwdAttempt_OperController', function ($scope, CIR_OperationService) {

    var UId = getUrlVars()['ref'];

    var Data = { UId: UId }

    var promisePost = CIR_OperationService.postCommonService(ValidUrll, Data);
    promisePost.then(function (pl) {
        $scope.FlagCheck = pl.data.result.ValidResetPwdUrlModel.AttemptFlag;
        if (pl.data.result.ValidResetPwdUrlModel.AttemptFlag == "False") {
            window.location.href = LoginUrl;
        }
    });

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    $scope.Login = function () {
        if ($scope.NewPassword == '') {
            SetErrorMessage("Ensure New Password!"); $('#NewPassword').focus(); return false;
        }
        if ($scope.RepeatPassword == '') {
            SetErrorMessage("Ensure Repeat Password!"); $('#RepeatPassword').focus(); return false;
        }
        if ($scope.NewPassword != $scope.RepeatPassword) {
            SetErrorMessage("New Password and Repeat Password should be same!"); $('#NewPassword').focus(); return false;
        }
        var Data = {
            oldPassword: "",
            newPassword: $scope.NewPassword,
            flag: "1",
            UId: UId
        }
        var promisePost = CIR_OperationService.postCommonService(SetChangePasswordUrl, Data);
        promisePost.then(function (pl) {
            if (pl.data.result.Clear == "True") {
                SetSuccessMessage(pl.data.result.Msg);
                $scope.NewPassword = $scope.RepeatPassword = '';
                window.location.href = LoginUrl;
            }
            else {
                SetErrorMessage(pl.data.result.Msg);
            }
        }, function (err) {
            SetWarningMessage("Transaction Issue. Please try again.");
            console.log("Error in saving the password" + err);
        });
    }
    $scope.RepeatKeyPress = function (e) {
        var keycode = e.which;
        if (keycode == "13") {
            $scope.Login();
        }
    }
});

$(document).ready(function () {
    $("#txtUserName").focus();
    $("#txtUserName").keypress(function (e) {
        var keycode = e.which;
        if (keycode == 13) {
            if ($.trim($("#txtUserName").val()) == "") {
                SetErrorMessage("Ensure User Name!");
                $("#txtUserName").focus();
                return false;
            }
            else
                $("#txtPassword").focus();
        }
    });

    $("#txtPassword").keypress(function (e) {
        var keycode = e.which;
        if (keycode == 13) {
            if ($.trim($("#txtPassword").val()) == "") {
                SetErrorMessage("Ensure Password!");
                $("#txtPassword").focus();
                return false;
            }
            else
                $("#btnLogin").click();
        }
    });

});
