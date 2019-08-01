var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    }
    else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    }
    else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};


//</editor-fold>

app.controller('ScreenshotReportController', function ($scope, $http) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
    }

    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };

    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh === 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return true;
    };

    var results = [
    {
        "description": "Logout user|Login page ",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 13976,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/kpiauto/%7B%7BcurrentUser.smallImage%7D%7D - Failed to load resource: the server responded with a status of 404 (Not Found)",
                "timestamp": 1564648032379,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/kpiauto/%7B%7BcurrentUser.smallImage%7D%7D - Failed to load resource: the server responded with a status of 404 (Not Found)",
                "timestamp": 1564648033123,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/favicon.ico - Failed to load resource: the server responded with a status of 404 (Not Found)",
                "timestamp": 1564648036058,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://local.adguard.org/?ts=1564627511591&name=AdGuard%20Popup%20Blocker&name=AdGuard%20Assistant&name=Adguard%20Extra&type=user-script 2:334 \"[AdGuard Userscript Module] Page tries to run userscript second time\"",
                "timestamp": 1564648037616,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://local.adguard.org/?ts=1564627511591&name=AdGuard%20Popup%20Blocker&name=AdGuard%20Assistant&name=Adguard%20Extra&type=user-script 2:334 \"[AdGuard Userscript Module] Page tries to run userscript second time\"",
                "timestamp": 1564648037616,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://local.adguard.org/?ts=1564627511591&name=AdGuard%20Popup%20Blocker&name=AdGuard%20Assistant&name=Adguard%20Extra&type=user-script 2:334 \"[AdGuard Userscript Module] Page tries to run userscript second time\"",
                "timestamp": 1564648037616,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js 106:211 \"TypeError: Cannot read property 'KPIValueDto' of undefined\\n    at http://10.1.0.62/kpiauto/Frontend/shared/services/commonBusinessLogicService.js:215:41\\n    at Object.n [as forEach] (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:7:333)\\n    at http://10.1.0.62/kpiauto/Frontend/shared/services/commonBusinessLogicService.js:190:21\\n    at http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:119:129\\n    at r.$eval (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:133:313)\\n    at r.$digest (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:130:412)\\n    at r.$apply (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:134:78)\\n    at g (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:87:444)\\n    at T (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:92:50)\\n    at XMLHttpRequest.w.onload (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:93:78)\"",
                "timestamp": 1564648038489,
                "type": ""
            }
        ],
        "screenShotFile": "005d00be-0015-00fe-000d-001100d70010.png",
        "timestamp": 1564648029050,
        "duration": 12667
    },
    {
        "description": "Login to KPI Dashboard without Username and Password|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 13976,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "00310069-00e8-007b-00e2-000300fa0016.png",
        "timestamp": 1564648042070,
        "duration": 0
    },
    {
        "description": "Login to KPI Dashboard without Username|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 13976,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "00aa006d-0013-00eb-00e0-00c8004e002e.png",
        "timestamp": 1564648042079,
        "duration": 0
    },
    {
        "description": "Login to KPI Dashboard without Password|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 13976,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "00c30072-0060-00fd-00dc-00e500830078.png",
        "timestamp": 1564648042086,
        "duration": 1
    },
    {
        "description": "Login to KPI Dashboard without un-existed user|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 13976,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "00b00082-00d4-00d2-005e-009c00310079.png",
        "timestamp": 1564648042095,
        "duration": 0
    },
    {
        "description": "Login to KPI Dashboard successfully|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 13976,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "008600ed-001d-00bb-00e7-002b00d900ae.png",
        "timestamp": 1564648042104,
        "duration": 0
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    }
                    else
                    {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.sortSpecs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.sortSpecs();
    }


});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

