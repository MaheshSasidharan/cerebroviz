app.factory('Factory_DataService', ['$http', 'Factory_Constants', 'Factory_CommonRoutines', DataService])

function DataService($http, Constants, CommonFactory) {
    var Helper = {
        app: "http://128.255.84.11:3000/",
        Genes: {
            controller: "",
            GetGene: function(id) {
                return $http.post(Helper.app + Helper.Genes.controller, { id: id })
                    .then(
                        Helper.Miscellaneous.ReturnDataDotData,
                        Helper.Miscellaneous.FailedInService)

                // return $http.get(Helper.app + Helper.Genes.controller + 'getgene?id=' + id)
                //     .then(
                //         Helper.Miscellaneous.ReturnDataDotData,
                //         Helper.Miscellaneous.FailedInService)
            }
        },
        Miscellaneous: {
            ReturnDataDotData: function(data) {
                return data.data;
            },
            FailedInService: function(err) {
                console.log(err);
                CommonFactory.Notification.error(Constants.Miscellaneous.SomethingWentWrong);
                return { status: false };
            }
        }
    }

    var oService = {
        GetGene: Helper.Genes.GetGene
    }
    return oService;
}