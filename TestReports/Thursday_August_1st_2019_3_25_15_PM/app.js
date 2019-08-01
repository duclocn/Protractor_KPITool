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
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 3660,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": [
            "Failed: element not interactable\n  (Session info: chrome=76.0.3809.87)\n  (Driver info: chromedriver=75.0.3770.140 (2d9f97485c7b07dc18a74666574f19176731995c-refs/branch-heads/3770@{#1155}),platform=Windows NT 10.0.17134 x86_64)"
        ],
        "trace": [
            "ElementNotVisibleError: element not interactable\n  (Session info: chrome=76.0.3809.87)\n  (Driver info: chromedriver=75.0.3770.140 (2d9f97485c7b07dc18a74666574f19176731995c-refs/branch-heads/3770@{#1155}),platform=Windows NT 10.0.17134 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error: \n    at ElementArrayFinder.applyAction_ (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at ActionSupport.<anonymous> (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\core_function\\actionSupport\\actionSupport.ts:20:19)\n    at step (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\core_function\\actionSupport\\actionSupport.ts:32:23)\n    at Object.next (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\core_function\\actionSupport\\actionSupport.ts:13:53)\n    at fulfilled (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\core_function\\actionSupport\\actionSupport.ts:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom asynchronous test: \nError: \n    at Suite.<anonymous> (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\Testcases\\Login-Logout.ts:57:5)\n    at addSpecsToSuite (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\ndloc\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\Testcases\\Login-Logout.ts:7:1)\n    at Module._compile (internal/modules/cjs/loader.js:776:30)\n    at Module.m._compile (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\node_modules\\ts-node\\src\\index.ts:439:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:787:10)\n    at Object.require.extensions.(anonymous function) [as .ts] (F:\\TESTING\\AUTOMATION\\Protractor\\Protractor_KPITool\\node_modules\\ts-node\\src\\index.ts:442:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/kpiauto/%7B%7BcurrentUser.smallImage%7D%7D - Failed to load resource: the server responded with a status of 404 (Not Found)",
                "timestamp": 1564647920442,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/kpiauto/%7B%7BcurrentUser.smallImage%7D%7D - Failed to load resource: the server responded with a status of 404 (Not Found)",
                "timestamp": 1564647924228,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/favicon.ico - Failed to load resource: the server responded with a status of 404 (Not Found)",
                "timestamp": 1564647926370,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://local.adguard.org/?ts=1564627511591&name=AdGuard%20Popup%20Blocker&name=AdGuard%20Assistant&name=Adguard%20Extra&type=user-script 2:334 \"[AdGuard Userscript Module] Page tries to run userscript second time\"",
                "timestamp": 1564647928131,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://local.adguard.org/?ts=1564627511591&name=AdGuard%20Popup%20Blocker&name=AdGuard%20Assistant&name=Adguard%20Extra&type=user-script 2:334 \"[AdGuard Userscript Module] Page tries to run userscript second time\"",
                "timestamp": 1564647928131,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "http://local.adguard.org/?ts=1564627511591&name=AdGuard%20Popup%20Blocker&name=AdGuard%20Assistant&name=Adguard%20Extra&type=user-script 2:334 \"[AdGuard Userscript Module] Page tries to run userscript second time\"",
                "timestamp": 1564647928131,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js 106:211 \"TypeError: Cannot read property 'KPIValueDto' of undefined\\n    at http://10.1.0.62/kpiauto/Frontend/shared/services/commonBusinessLogicService.js:215:41\\n    at Object.n [as forEach] (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:7:333)\\n    at http://10.1.0.62/kpiauto/Frontend/shared/services/commonBusinessLogicService.js:190:21\\n    at http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:119:129\\n    at r.$eval (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:133:313)\\n    at r.$digest (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:130:412)\\n    at r.$apply (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:134:78)\\n    at g (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:87:444)\\n    at T (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:92:50)\\n    at XMLHttpRequest.w.onload (http://10.1.0.62/kpiauto/Frontend/jsLib/angular/angular.min.js:93:78)\"",
                "timestamp": 1564647929415,
                "type": ""
            }
        ],
        "screenShotFile": "002a00ea-003a-0025-00fe-009400d10083.png",
        "timestamp": 1564647918746,
        "duration": 11975
    },
    {
        "description": "Login to KPI Dashboard without Username and Password|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 3660,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "00540086-0066-00dd-0018-003800b500ec.png",
        "timestamp": 1564647931239,
        "duration": 0
    },
    {
        "description": "Login to KPI Dashboard without Username|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 3660,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "008f0043-00ad-004d-0080-005900e800bc.png",
        "timestamp": 1564647931252,
        "duration": 0
    },
    {
        "description": "Login to KPI Dashboard without Password|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 3660,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "00c600fb-00f6-0032-00ab-004600cd0025.png",
        "timestamp": 1564647931263,
        "duration": 0
    },
    {
        "description": "Login to KPI Dashboard without un-existed user|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 3660,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "001e000b-00de-00de-000a-004300370017.png",
        "timestamp": 1564647931279,
        "duration": 0
    },
    {
        "description": "Login to KPI Dashboard successfully|Login page ",
        "passed": false,
        "pending": true,
        "os": "Windows NT",
        "instanceId": 3660,
        "browser": {
            "name": "chrome",
            "version": "76.0.3809.87"
        },
        "message": "Pending",
        "browserLogs": [],
        "screenShotFile": "006e00c2-0093-007d-0060-001a00790077.png",
        "timestamp": 1564647931293,
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

