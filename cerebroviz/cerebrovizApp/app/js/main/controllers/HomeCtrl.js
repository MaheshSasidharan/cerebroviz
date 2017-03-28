app.controller('NavCtrl', ['$scope', function($scope) {
    var vm = this;
    vm.Helper = {
        UpdateTabActive: function(sTab) {
            return window.location.hash && window.location.hash.toLowerCase() == ("#/" + sTab).toLowerCase() ? 'active' : '';
        }
    }
}]);

app.controller('HomeCtrl', ['$scope', 'Factory_Constants', 'Factory_CommonRoutines', 'Factory_DataService', function($scope, Constants, CommonFactory, DataService) {
    //app.controller('HomeCtrl', ['$scope', 'Factory_Constants', 'Factory_DataService', function($scope, Constants, DataService) {
    var ge = this;
    //ge.retrievedData = [{ "entrez_id": 0000, "gene_symbol": "Type in a gene!", "ensembl_gene_id": "ENSG00000000000", "json": "[[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]]" }];

    ge.oGeneManager = {
        Genes: new CommonFactory.Constructors.Genes(),
        GenesSearchPool: new CommonFactory.Constructors.Genes(),
        GenesCalcPool: new CommonFactory.Constructors.Genes(),
        oGeneToRender: null
    }


    ge.oService = {
        GetGene: function(sSearchText) {
            // return DataService.GetGene(sSearchText).then(function(data) {
            //     return data;
            // });

            d3.json('http://128.255.84.11:3000/getgene')
                .header("Content-type", "application/x-www-form-urlencoded")
                .post("id=" + sSearchText, function(error, data) {
                    $scope.$apply(function() {
                        if (data && data.length) {
                            ge.Helper.InitCerebro(data[0]);
                            ge.sSearchText = null;
                        } else {
                            CommonFactory.Notification.error(Constants.Gene.GeneExistsNot);
                        }
                    });
                });
        }
    }

    ge.Helper = {
        GetGene: function() {
            ge.sSearchText = ge.sSearchText.trim();
            if (ge.sSearchText && ge.sSearchText !== "") {
                if (!ge.oGeneManager.Genes.CheckIfExists(ge.sSearchText)) {
                    ge.oService.GetGene(ge.sSearchText);
                } else {
                    ge.sSearchText = null;
                    CommonFactory.Notification.error(Constants.Gene.GeneExists);
                    //ge.Helper.RefreshCerebro(ge.oGeneManager.Genes.GetGene('byName', ge.sSearchText)[0]);
                }

            } else {
                CommonFactory.Notification.error(Constants.Gene.IncorrectGene);
            }
        },
        InitCerebro: function(oGeneToRender) {
            var oGene = new CommonFactory.Constructors.Gene(oGeneToRender);
            ge.oGeneManager.Genes.AddGene(oGene);
            ge.oGeneManager.GenesSearchPool.AddGene(oGene);
            //ge.oGeneManager.oGeneToRender = ge.oGeneManager.Genes.GetGene();
        },
        RefreshCerebro: function(oGeneToRender) {
            ge.oGeneManager.oGeneToRender = oGeneToRender;
        },
        AddToGenesCalcPool: function(oGene) {
            var poppedGene = ge.oGeneManager.GenesSearchPool.RemoveGene(oGene);
            ge.oGeneManager.GenesCalcPool.AddGene(oGene);
            ge.oGeneManager.oGeneToRender = ge.oGeneManager.GenesCalcPool.GetSubtractedGene();
        },
        RemoveGenesFromCalcPool: function(oGene) {
            var poppedGene = ge.oGeneManager.GenesCalcPool.RemoveGene(oGene);
            ge.oGeneManager.GenesSearchPool.AddGene(oGene);
            ge.oGeneManager.oGeneToRender = ge.oGeneManager.GenesCalcPool.GetSubtractedGene();
        }
    }

    ge.sSearchText = "Pef1";
    ge.Helper.GetGene();
    ge.sSearchText = "foxp2";
    ge.Helper.GetGene();
    ge.sSearchText = "";

    // $timeout(function () {
    //         ge.oService.GetGene("PEF1");
    // }, 1000); 

    // ge.oService.GetGene(ge.sSearchText).then(function(data) {
    //     if (data) {
    //         ge.retrievedData = data;
    //     }
    // });
}]);
