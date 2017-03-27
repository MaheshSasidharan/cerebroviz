app.factory('Factory_CommonRoutines', ['Notification', CommonRoutines])

function CommonRoutines(Notification) {

    var oCommonRoutine = {
        Notification: Notification,
        FindItemInArray: function(array, keyName, keyVal, returnType) {
            var found = false;
            if (undefined === keyVal || null === keyVal) {
                return null;
            }
            for (var i in array) {
                if (array[i][keyName] == keyVal) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return null;
            }
            if (returnType === "index") {
                return i;
            } else {
                return array[i];
            }
        },
        TryConvertStringToDate: function(sDate) {
            if (this.ValidDate(sDate)) {
                return new Date(sDate);
            } else {
                return null;
            }
        },
        ConvertDateToString: function(date) {
            return this.LessThan10(date.getMonth() + 1) + '/' + this.LessThan10(date.getDate()) + '/' + date.getFullYear();
        },
        ConvertDateAndTimeToString: function(date) {
            return this.LessThan10(date.getMonth() + 1) + '/' + this.LessThan10(date.getDate()) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        },
        FormatDateProperties: function(oObject, sDateFormat) {
            for (var a in oObject) {
                var tempDate = this.DateFromDotNetJson(oObject[a]);
                if (tempDate !== null) { // Dateformat or String format
                    oObject[a] = sDateFormat === 'Date' ? tempDate : this.ConvertDateToString(tempDate);
                }
            }
            return oObject;
        },
        StringifyDateProperties: function(oObject) {
            for (var a in oObject) {
                var tempDate = this.IsDateObject(oObject[a]);
                if (tempDate) { // Dateformat or String format
                    oObject[a] = this.ConvertDateToString(oObject[a]);
                }
            }
            return oObject;
        },
        DateFromDotNetJson: function(jsonStr) {
            // Return null on a bad string
            if (jsonStr == null || typeof(jsonStr) != 'string')
                return null;
            // To prevent regular digits from getting converted to date
            if (jsonStr.indexOf("/") === -1)
                return null;
            // Return null if we do not have a date value
            var res = jsonStr.match(/(-?\d+)/);
            if (res == null)
                return null;
            return new Date(parseInt(res[0]));
        },
        FormatDate: function(value) {
            if (value) {
                var sDate = new Date(+value.replace(/\/Date\((\d+)\)\//, '$1'));
                var sFormattedDate = this.ConvertDateToString(sDate);
                if ("NaN-NaN-NaN" == sFormattedDate || "Invalid Date" === sDate) {
                    sFormattedDate = Constants.Miscellaneous.InvalidDate;
                }
                return [sDate, sFormattedDate];
            } else {
                return null;
            }
        },
        FormatDate2: function(date, type) {
            if (!date || typeof(new Date(date).getMonth()) !== "number") {
                return null;
            }
            if (type === "monthYear") {
                return { month: Constants.Miscellaneous.month[new Date(date).getMonth()], year: new Date(date).getFullYear() };
            }
        },
        LessThan10: function(num) {
            return num < 10 ? '0' + num : num;
        },
        Log: function(msg, color) {
            color = color || "black";
            bgc = "White";
            switch (color) {
                case "success":
                    color = "Green";
                    bgc = "LimeGreen";
                    break;
                case "info":
                    color = "DodgerBlue";
                    bgc = "Turquoise";
                    break;
                case "error":
                    color = "Red";
                    bgc = "Black";
                    break;
                case "start":
                    color = "OliveDrab";
                    bgc = "PaleGreen";
                    break;
                case "warning":
                    color = "Tomato";
                    bgc = "Black";
                    break;
                case "end":
                    color = "Orchid";
                    bgc = "MediumVioletRed";
                    break;
                default:
                    color = color;
            }

            if (typeof msg == "object") {
                console.log(msg);
            } else if (typeof color == "object") {
                console.log("%c" + msg, "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;");
                console.log(color);
            } else {
                console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
            }
        },
        ValidDate: function(sDate) {
            if (!sDate) {
                return false;
            }
            var dDate = new Date(sDate);
            return Object.prototype.toString.call(dDate) === "[object Date]" && !isNaN(dDate.getTime()) ? true : false;
        },
        IsDateObject: function(dDate) {
            return Object.prototype.toString.call(dDate) === "[object Date]" && !isNaN(dDate.getTime()) ? true : false;
        },
        GetCurrentTabOnLoad: function(tabs, oDefaultTab) {
            if ($location.$$url.indexOf("/") >= 0) {
                var sTab = $location.$$url.split("/")[1];
                if (sTab) {
                    sTab = sTab.toLowerCase();
                } else {
                    return oDefaultTab;
                }
                for (var i = 0; i < tabs.length; i++) {
                    if (sTab === tabs[i].link.toLowerCase().split("/")[1]) {
                        return tabs[i];
                    }
                };
                return oDefaultTab;
            } else {
                return oDefaultTab;
            }
        },
        TabClass: function(selectedTab, tab) {
            if (selectedTab == tab) {
                return "active";
            } else {
                return "";
            }
        },
        LoadingNew: {
            bShow: false,
            bShowSmall: false,
            ShowLoading: function(bShow, sType) {
                if (sType === 's') {
                    this.bShowSmall = bShow;
                } else {
                    this.bShow = bShow;
                }
            }
        },
        Loading: {
            loadCount: 0,
            loadingShow: function() {
                var bReturn = this.loadCount === 0 ? true : false;
                this.loadCount++;
                return bReturn;
            },
            loadingHide: function() {
                if (this.loadCount > 0) {
                    this.loadCount--;
                    bShow: false,
                        bShowSmall = false,
                        ShowLoading = function(bShow, sType) {
                            if (sType === 's') {
                                this.bShowSmall = bShow;
                            } else {
                                this.bShow = bShow;
                            }
                            return this.loadCount === 0 ? false : true;
                        }

                }
            }
        },
        Popup: {
            bShow: false,
            sType: null,
            sTitle: null,
            ShowPopup: function(bShow, sType, sTitle) {
                this.bShow = bShow;
                this.sType = sType;
                this.sTitle = sTitle;
            }
        },
        BlobToBase64: function(blob, cb) {
            var reader = new FileReader();
            reader.onload = function() {
                var dataUrl = reader.result;
                var base64 = dataUrl.split(',')[1];
                cb(base64);
            };
            reader.readAsDataURL(blob);
        },
        GetRandomCharacter: function() {
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return possible.charAt(Math.floor(Math.random() * possible.length));
        },
        GetProgressType: function(nMinValue, nMaxVal) {
            var type;
            var value = (nMinValue / nMaxVal) * 100;
            if (value < 25) {
                type = 'success';
            } else if (value < 50) {
                type = 'info';
            } else if (value < 75) {
                type = 'warning';
            } else {
                type = 'danger';
            }
            return type;
        },
        RandomizeSolutionSet: function(array, sType) {
            if (sType === "matrix") {
                array.forEach(function(oItem) {
                    oCommonRoutine.RandomizeArray(oItem.solutionSets.arroPics);
                });
            }else if(sType === "PicturePrompt"){
                array.forEach(function(oItem) {
                    oCommonRoutine.RandomizeArray(oItem.arroPics);
                });
            }
            return array;
        },
        RandomizeArray: function(array) {
            var nNewIndex, temp;
            for (var i = 0; i < array.length; i++) {
                nNewIndex = Math.floor((Math.random() * (i + 1)));
                temp = array[i];
                array[i] = array[nNewIndex];
                array[nNewIndex] = temp;
            }
        }
    }
    return oCommonRoutine;
}
