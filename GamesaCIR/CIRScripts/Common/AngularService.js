app.service('CIR_OperationService', function ($http) {

    //Get Method Service All
    this.getService = function (Url) {
        return $http.get(Url);
    }

    //Get Method Service Id
    this.getService = function (Url, Id) {
        return $http.get(Url + "/" + Id);
    }

    //Get Common Service
    this.getCommonService = function (Url, Data) {
        var request = $http({
            method: "get",
            url: Url,
            data: Data
        });
        return request;
    }

    //Post Common Service
    this.postCommonService = function (Url, Data) {
        var request = $http({
            method: "post",
            url: Url,
            data: Data
        });
        return request;
    }

});