app.factory('Factory_Constants', [Constants])

function Constants() {
    var oConstants = {
        Miscellaneous: {
            SomethingWentWrong: "Sorry something went wrong"
        },
        Gene: {
        	IncorrectGene: "Please enter a valid gene name",
            GeneExists: "This Gene is already present",
            GeneExistsNot: "Sorry, no such gene found. Please try again"
        }
    }
    return oConstants;
}
