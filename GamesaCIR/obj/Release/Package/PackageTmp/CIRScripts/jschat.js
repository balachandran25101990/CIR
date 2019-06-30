var chat = $.connection.chatHub;

app.controller('C_ChatController', function ($scope, CIR_OperationService) {

    LoadEmployee();

    function LoadEmployee() {
        var EmployeeModel = {
            EmpId: "0",
            View: "0",
            Text: ""
        };
        var promisePost = CIR_OperationService.postCommonService(GetEmployeeUrl, EmployeeModel);
        promisePost.then(function (pl) {
            $scope.EmployeeSelect = pl.data.result;
    
        }, function (err) {
        });
    };

});