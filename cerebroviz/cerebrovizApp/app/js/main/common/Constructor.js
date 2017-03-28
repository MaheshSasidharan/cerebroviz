app.factory('Factory_Constructors', [Constructors])

function Constructors(Notification) {
    var Gene = function(oItem) {
        this.gene_symbol = oItem.gene_symbol;
        this.ensembl_id = oItem.ensembl_id;
        this.entrez_id = oItem.entrez_id;
        this.json = JSON.parse(oItem.json)[0];
        this.selected = oItem.selected ? oItem.selected : false;
    }
    var Genes = function() {
        this.arrGenes = [];
    }
    Genes.prototype.GetGene = function(sType, sVal) {
        switch (sType) {
            case 'byName':
                return this.GetGeneByGeneSymbol(sVal);
                break;
            default:
                if (this.arrGenes.length) {
                    return this.arrGenes[this.arrGenes.length - 1];
                } else {
                    return null;
                }
        }
    }
    Genes.prototype.AddGene = function(oGene) {
        if (!this.CheckIfExists(oGene.gene_symbol)) {
            this.arrGenes.push(oGene);
        }
    }
    Genes.prototype.RemoveGene = function(oGene) {
        var nIndex = this.arrGenes.findIndex(function(x) {
            return x.gene_symbol.toLowerCase() === oGene.gene_symbol.toLowerCase();
        });
        if (nIndex >= 0) {
            var poppedGene = this.arrGenes[nIndex];
            this.arrGenes.splice(nIndex, 1);
            return poppedGene;
        } else {
            return null;
        }
    }
    Genes.prototype.GetGeneByGeneSymbol = function(gene_symbol) {
        return this.arrGenes.filter(function(e) {
            return e.gene_symbol.toLowerCase() === gene_symbol.toLowerCase()
        });
    }
    Genes.prototype.CheckIfExists = function(gene_symbol) {
        return this.arrGenes.filter(function(e) {
            return e.gene_symbol.toLowerCase() === gene_symbol.toLowerCase()
        }).length > 0;
    }
    Genes.prototype.GetSubtractedGene = function() {
        var oSubtractedGene = null;
        var bFoundNone = false;
        if (this.arrGenes.length) {
            this.arrGenes.forEach(function(oGene) {
                if (oSubtractedGene === null) {
                    bFoundNone = true;
                    oSubtractedGene = angular.copy(oGene);
                } else {
                    bFoundNone = false;
                    for (var i = 0; i < oSubtractedGene.json.length; i++) {
                        for (var j = 0; j < oSubtractedGene.json[i].length; j++) {
                            oSubtractedGene.json[i][j] -= oGene.json[i][j];
                        }
                    }
                }
            });
        }
        if (oSubtractedGene) {
            if (!bFoundNone) {
                oSubtractedGene.gene_symbol = "Resultant";
            }
            oSubtractedGene.selected = true;
        }
        return oSubtractedGene;
    }

    return {
        Gene: Gene,
        Genes: Genes
    }
}
