var ngX;
(function (ngX) {
    ngX.componentStyles = {};
    ngX.isBootstrapped = false;
})(ngX || (ngX = {}));
try {
    angular.module("ngRoute");
    angular.module("ngX", ["ngRoute"]);
}
catch (error) {
    angular.module("ngX", []);
}

//# sourceMappingURL=ngX.module.js.map

var ngX;
(function (ngX) {
    "use strict";
    /**
     * @name ApiEndpointProvider
     */
    var ApiEndpointProvider = (function () {
        function ApiEndpointProvider() {
            var _this = this;
            this.config = {
                getBaseUrl: function (name) {
                    var baseUrl = "";
                    if (name) {
                        _this.config.baseUrls.forEach(function (endpointDefinition) {
                            if (name === endpointDefinition.name) {
                                baseUrl = endpointDefinition.url;
                            }
                        });
                    }
                    if (!name || baseUrl === "") {
                        _this.config.baseUrls.forEach(function (endpointDefinition) {
                            if (!endpointDefinition.name && baseUrl === "") {
                                baseUrl = endpointDefinition.url;
                            }
                        });
                    }
                    return baseUrl;
                },
                baseUrls: [],
                configure: function (baseUrl, name) {
                    var self = this;
                    self.baseUrls.push({ url: baseUrl, name: name });
                }
            };
        }
        ApiEndpointProvider.prototype.configure = function (baseUrl, name) {
            this.config.baseUrls.push({ url: baseUrl, name: name });
        };
        ApiEndpointProvider.prototype.$get = function () {
            return this.config;
        };
        return ApiEndpointProvider;
    })();
    ngX.ApiEndpointProvider = ApiEndpointProvider;
    angular.module("ngX").provider("apiEndpoint", ApiEndpointProvider);
})(ngX || (ngX = {}));

//# sourceMappingURL=apiEndpointProvider.js.map

var ngX;
(function (ngX) {
    "use strict";
    var $q = angular.injector(['ng']).get("$q");
    /**
     * @name appendToBodyAsync
     * @module ngX
     */
    ngX.appendToBodyAsync = function (options) {
        var deferred = $q.defer();
        document.body.appendChild(options.nativeElement);
        setTimeout(function () { deferred.resolve(); }, options.wait || 100);
        return deferred.promise;
    };
    angular.module("ngX").value("appendToBodyAsync", ngX.appendToBodyAsync);
})(ngX || (ngX = {}));

//# sourceMappingURL=appendToBodyAsync.js.map

var ngX;
(function (ngX) {
    ngX.appModuleName = "app";
})(ngX || (ngX = {}));

//# sourceMappingURL=appModuleName.js.map

var ngX;
(function (ngX) {
    "use strict";
    var AuthorizationInterceptor = (function () {
        function AuthorizationInterceptor(securityStore) {
            var _this = this;
            this.securityStore = securityStore;
            this.request = function (config) {
                if (_this.securityStore.token) {
                    config.headers.Authorization = "Bearer " + _this.securityStore.token;
                }
                return config;
            };
        }
        AuthorizationInterceptor.instance = function (securityStore) {
            return new AuthorizationInterceptor(securityStore);
        };
        return AuthorizationInterceptor;
    })();
    angular.module("ngX")
        .factory("authorizationInterceptor", ["securityStore", AuthorizationInterceptor.instance])
        .config([
        "$httpProvider", function ($httpProvider) {
            $httpProvider.interceptors.push("authorizationInterceptor");
        }
    ]);
})(ngX || (ngX = {}));

//# sourceMappingURL=authorizationInterceptor.js.map

var ngX;
(function (ngX) {
    /**
    * @name Component
    * @description syntax sugar to ease transition to angular 2
    * @requires App.Common.RouteResolverServiceProvider
    */
    ngX.Component = function (options) {
        if (!ngX.isBootstrapped) {
            var ngScopes = document.querySelectorAll('[ng-app]');
            if (ngScopes.length < 1)
                ngScopes = document.querySelectorAll('[data-ng-app]');
            if (ngScopes.length < 1) {
                angular.module("app", ["ngX"]);
            }
            else {
                ngX.isBootstrapped = true;
            }
        }
        options.module = options.module || "app";
        /* supoort for polymer syntax*/
        options.selector = options.selector || options.is;
        if (options.selector) {
            var componentNameCamelCase = options.selector.replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase();
            });
            if (options.is)
                options.transclude = "element";
            var directiveDefinitionObject = {
                restrict: options.restrict || "E",
                template: angular.isArray(options.template) ? options.template.join(" \n ") : options.template,
                templateUrl: options.templateUrl,
                replace: options.replace || true,
                scope: options.scope || {},
                bindToController: options.bindToController || {},
                transclude: options.transclude
            };
            if (options.component) {
                directiveDefinitionObject.controllerAs = "vm";
                directiveDefinitionObject.controller = options.componentName || componentNameCamelCase + "Component";
                options.component.$inject = options.providers;
            }
            else {
                directiveDefinitionObject.controllerAs = "vm";
                directiveDefinitionObject.controller = function () { };
            }
            if (options.inputs && options.inputs.length > 0) {
                for (var i = 0; i < options.inputs.length; i++) {
                    directiveDefinitionObject.bindToController[options.inputs[i]] = "=";
                }
            }
            if (options.properties) {
                for (var prop in options.properties) {
                    if (options.properties[prop].type && options.properties[prop].type === Object) {
                        directiveDefinitionObject.bindToController[prop] = "=";
                    }
                    else {
                        directiveDefinitionObject.bindToController[prop] = "@";
                    }
                }
            }
            if ((options.component && options.component.styles) || options.styles) {
                var styles = options.styles ? options.styles : options.component.styles;
                styles = angular.isArray(styles) ? styles.join(" \n ") : styles;
                directiveDefinitionObject.compile = function () {
                    return {
                        pre: function (scope, element, attributes, controller, transcludeFn) {
                            if (options.transclude)
                                transcludeFn(scope, function (clone) {
                                });
                            if (!ngX.componentStyles[options.selector]) {
                                ngX.componentStyles[options.selector] = true;
                                function addStyleTagToHead() {
                                    var style = document.createElement("style");
                                    style.setAttribute("data-selector", options.selector);
                                    style.appendChild(document.createTextNode(styles));
                                    document.head.appendChild(style);
                                }
                                if (document.readyState === "complete" || document.readyState === 'interactive') {
                                    addStyleTagToHead();
                                }
                                else {
                                    function onDocumentLoad() {
                                        addStyleTagToHead();
                                        window.removeEventListener("DOMContentLoaded", onDocumentLoad);
                                    }
                                    window.addEventListener("DOMContentLoaded", onDocumentLoad);
                                }
                            }
                        },
                        post: function (scope) {
                            var $injector = angular.element(document.getElementsByTagName("body")[0]).injector();
                            var debounce = $injector.get("debounce");
                            var securityStore = $injector.get("securityStore");
                            if (scope && scope.vm) {
                                scope.vm.currentUser = securityStore.currentUser;
                            }
                            window.addEventListener("resize", function () {
                                if (scope.vm && scope.vm.onResize) {
                                    debounce(function () {
                                        scope.vm.onResize();
                                    }, 1000)();
                                }
                            });
                            if (options.properties) {
                                for (var prop in options.properties) {
                                    if (options.properties[prop].value)
                                        scope[prop] = options.properties[prop].value();
                                }
                            }
                            if (options.transclude && scope.vm.$transclude) {
                                scope.vm.$transclude(scope, function (clone) {
                                    scope.vm.clone = clone;
                                });
                            }
                            if (scope.vm && scope.vm.onInit)
                                scope.vm.onInit();
                            scope.$on("$routeUpdate", function () {
                                if (scope.vm && scope.vm.onRouteUpdate)
                                    scope.vm.onRouteUpdate();
                            });
                            if (scope.vm && scope.vm.onStoreUpdate)
                                scope.$on("STORE_UPDATE", scope.vm.onStoreUpdate);
                            if (scope.vm && scope.vm.onKeyDown) {
                                document.addEventListener("keydown", scope.vm.onKeyDown);
                                scope.$on("$destroy", function () {
                                    document.removeEventListener("keydown", scope.vm.onKeyDown);
                                });
                            }
                            scope.$on("$locationChangeSuccess", function () {
                                if (scope.vm && scope.vm.onLocationChangeSuccess)
                                    scope.vm.onLocationChangeSuccess();
                            });
                            if (scope.vm && scope.vm.onVmUpdate) {
                                document.addEventListener("vmUpdate", scope.vm.onVmUpdate);
                                scope.$on("$destroy", function () {
                                    document.removeEventListener("vmUpdate", scope.vm.onVmUpdate);
                                });
                            }
                            if (scope.vm.dispose) {
                                scope.$on("$destroy", function () {
                                    scope.vm.dispose();
                                });
                            }
                        }
                    };
                };
            }
            angular.module(options.module).directive(componentNameCamelCase, [function () { return directiveDefinitionObject; }]);
            angular.module(options.module).controller(options.componentName || componentNameCamelCase + "Component", options.component);
        }
        else if (options.dynamic) {
            options.component.$inject = options.providers;
            angular.module(options.module).service(options.componentName, options.component);
        }
        else {
            options.component.$inject = options.providers;
            angular.module(options.module)
                .controller(options.componentName || ngX.getFunctionName(options.component), options.component);
            try {
                angular.module("ngRoute");
                if (options.template || options.templateUrl) {
                    angular.module(options.module).config(["$routeProvider", function ($routeProvider) {
                            var length = ngX.routeConfigs.length;
                            for (var i = 0; i < length; i++) {
                                var componentName = options.componentName || ngX.getFunctionName(options.component);
                                if (ngX.routeConfigs[i].config.componentName && ngX.routeConfigs[i].config.componentName === componentName) {
                                    ngX.routeConfigs[i].config.templateUrl = options.templateUrl;
                                    ngX.routeConfigs[i].config.template = angular.isArray(options.template) ? options.template.join(" \n ") : options.template;
                                    $routeProvider.when(ngX.routeConfigs[i].when, ngX.routeConfigs[i].config);
                                }
                            }
                        }]);
                }
                if (options.component.canActivate)
                    angular.module(options.module)
                        .config([
                        "routeResolverServiceProvider", function (routeResolverServiceProvider) {
                            routeResolverServiceProvider.configure({
                                route: options.route,
                                routes: options.routes,
                                key: options.key,
                                promise: options.component.canActivate()
                            });
                        }
                    ]);
            }
            catch (error) {
            }
        }
        if (!ngX.isBootstrapped) {
            angular.bootstrap(document, [options.module || "app"]);
        }
    };
})(ngX || (ngX = {}));

//# sourceMappingURL=component.js.map

var ngX;
(function (ngX) {
    ngX.Configure = function (options) {
        if (options.templateMappingFn)
            ngX.getTemplateUrlFromComponentName = options.templateMappingFn;
        if (options.appModuleName)
            ngX.appModuleName = options.appModuleName;
    };
})(ngX || (ngX = {}));

//# sourceMappingURL=configure.js.map

var ngX;
(function (ngX) {
    ngX.ConfigureRoutePromise = function (options) {
        if (angular.isFunction(options))
            options = { promise: options };
        var app = angular.module(options.module || "app");
        var promiseDefinition = options.providers ? options.providers : ngX.getParameterNames(options.promise);
        promiseDefinition.push(options.promise);
        app.config([
            "routeResolverServiceProvider", function (routeResolverServiceProvider) {
                routeResolverServiceProvider.configure({
                    priority: options.promise.priority || '0',
                    promise: promiseDefinition,
                    route: options.route,
                    routes: options.routes,
                    excludedRoutes: options.excludedRoutes
                });
            }
        ]);
    };
})(ngX || (ngX = {}));

//# sourceMappingURL=configureRoutePromise.js.map

var ngX;
(function (ngX) {
    var CurrentUser = (function () {
        function CurrentUser() {
        }
        return CurrentUser;
    })();
    angular.module("ngX").service("currentUser", [CurrentUser]);
})(ngX || (ngX = {}));

//# sourceMappingURL=currentUser.js.map

var ngX;
(function (ngX) {
    /**
     * @name DataService
     * @module ngX
     */
    var DataService = (function () {
        function DataService($http, $q) {
            var _this = this;
            this.$http = $http;
            this.$q = $q;
            this.inMemoryCache = {};
            this.fromServiceOrCache = function (options) {
                var deferred = _this.$q.defer();
                _this.$http({ method: options.method, url: options.url }).then(function (results) {
                    deferred.resolve(results);
                });
                return deferred.promise;
            };
            this.fromService = function (options) {
                var deferred = _this.$q.defer();
                _this.$http({ method: options.method, url: options.url, data: options.data, params: options.params }).then(function (results) {
                    deferred.resolve(results);
                });
                return deferred.promise;
            };
            this.invalidateCache = function () {
                _this.inMemoryCache = {};
            };
        }
        return DataService;
    })();
    ngX.DataService = DataService;
    angular.module("ngX").service("dataService", ["$http", "$q", DataService]);
})(ngX || (ngX = {}));

//# sourceMappingURL=dataService.js.map

var ngX;
(function (ngX) {
    "use strict";
    // Extracted from Underscore.js 1.5.2
    function debounce(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function () {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function () {
                var last = (new Date()) - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                }
                else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
            }
            return result;
        };
    }
    angular.module("ngX").value("debounce", debounce);
})(ngX || (ngX = {}));

//# sourceMappingURL=debounce.js.map

var ngX;
(function (ngX) {
    function eventEmitter(guid) {
        var self = this;
        self.listeners = [];
        self.addListener = function (options) {
            var id = guid();
            self.listeners.push({
                id: id,
                actionType: options.actionType,
                callback: options.callback
            });
            return id;
        };
        self.removeListener = function (options) {
            var length = self.listeners.length;
            for (var i = 0; i < length; i++) {
                if (self.listeners[i] && self.listeners[i].id === options.id) {
                    self.listeners.splice(i, 1);
                    i = length;
                }
            }
        };
        self.emit = function (options) {
            for (var i = 0; i < self.listeners.length; i++) {
                if (self.listeners[i].actionType === options.actionType) {
                    self.listeners[i].callback(options.options);
                }
            }
        };
        return self;
    }
    angular.module("ngX").service("dispatcher", ["guid", eventEmitter]);
})(ngX || (ngX = {}));

//# sourceMappingURL=dispatcher.js.map

var ngX;
(function (ngX) {
    //http://victorsavkin.com/post/99998937651/building-angular-apps-using-flux-architecture    
    function eventEmitter(guid) {
        var self = this;
        self.listeners = [];
        self.addListener = function (options) {
            var id = guid();
            self.listeners.push({
                id: id,
                actionType: options.actionType,
                callback: options.callback
            });
            return id;
        };
        self.removeListener = function (options) {
            for (var i = 0; i < self.listeners.length; i++) {
                if (self.listeners[i].id === options.id) {
                    self.listeners.slice(i, 1);
                }
            }
        };
        self.emit = function (options) {
            for (var i = 0; i < self.listeners.length; i++) {
                if (self.listeners[i].actionType === options.actionType) {
                    self.listeners[i].callback(options.options);
                }
            }
        };
        return self;
    }
    angular.module("ngX").service("dispatcher", ["guid", eventEmitter]);
})(ngX || (ngX = {}));

//# sourceMappingURL=eventEmitter.js.map

var ngX;
(function (ngX) {
    "use strict";
    var $q = angular.injector(['ng']).get("$q");
    /**
     * @name extendCssAsync
     * @module ngX
     */
    ngX.extendCssAsync = function (options) {
        return $q.when(angular.extend(options.nativeHTMLElement.style, options.cssObject));
    };
    angular.module("ngX").value("extendCssAsync", ngX.extendCssAsync);
})(ngX || (ngX = {}));

//# sourceMappingURL=extendCssAsync.js.map

var ngX;
(function (ngX) {
    /**
     * @name fetch
     * @module ngX
     */
    var fetch = (function () {
        function fetch($http, $q, localStorageManager) {
            var _this = this;
            this.$http = $http;
            this.$q = $q;
            this.localStorageManager = localStorageManager;
            this.inMemoryCache = {};
            this.fromService = function (options) {
                var deferred = _this.$q.defer();
                _this.$http({ method: options.method, url: options.url, data: options.data, params: options.params, headers: options.headers }).then(function (results) {
                    deferred.resolve(results);
                }).catch(function (error) {
                });
                return deferred.promise;
            };
            this.fromCacheOrService = function (options) {
                var deferred = _this.$q.defer();
                var cachedData = _this.localStorageManager.get({ name: options.url });
                if (!cachedData) {
                    _this.fromService(options).then(function (results) {
                        deferred.resolve(results);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });
                }
                else {
                    deferred.resolve(cachedData.value);
                }
                return deferred.promise;
            };
        }
        Object.defineProperty(fetch.prototype, "bodyNativeElement", {
            get: function () {
                return document.getElementsByTagName("body")[0];
            },
            enumerable: true,
            configurable: true
        });
        return fetch;
    })();
    angular.module("ngX").service("fetch", ["$http", "$q", "localStorageManager", fetch]);
})(ngX || (ngX = {}));

//# sourceMappingURL=fetch.js.map

var ngX;
(function (ngX) {
    "use strict";
    /**
    * @name fetchCounter
    * @module ngX
    */
    var fetchCounter = (function () {
        function fetchCounter() {
        }
        return fetchCounter;
    })();
    ngX.fetchCounter = fetchCounter;
    angular.module("ngX").service("fetchCounter", ["$q", fetchCounter])
        .run(["fetchCounter", function (fetchCounter) { }]);
})(ngX || (ngX = {}));

//# sourceMappingURL=fetchCounter.js.map

var ngX;
(function (ngX) {
    "use strict";
    angular.module("ngX").value("fire", function (target, type, properties) {
        var htmlEvent = document.createEvent("HTMLEvents");
        htmlEvent.initEvent(type, true, true);
        for (var j in properties) {
            htmlEvent[j] = properties[j];
        }
        target.dispatchEvent(htmlEvent);
    });
})(ngX || (ngX = {}));

//# sourceMappingURL=fire.js.map

var ngX;
(function (ngX) {
    angular.module("ngX").run(["$injector", "$rootScope", function ($injector, $rootScope) {
            $rootScope.$on("$viewContentLoaded", function () {
                var $route = $injector.get("$route");
                var instance = $route.current.scope[$route.current.controllerAs];
                if (instance && instance.onStoreUpdate) {
                    $route.current.scope.$on("STORE_UPDATE", instance.onStoreUpdate);
                }
            });
        }]);
})(ngX || (ngX = {}));

//# sourceMappingURL=flux.js.map

var ngX;
(function (ngX) {
    "use strict";
    var formEncode = function (data) {
        var pairs = [];
        for (var name in data) {
            pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        return pairs.join('&').replace(/%20/g, '+');
    };
    angular.module("ngX").value("formEncode", formEncode);
})(ngX || (ngX = {}));

//# sourceMappingURL=formEncode.js.map

var ngX;
(function (ngX) {
    (function (formFactor) {
        formFactor[formFactor["mobile"] = 0] = "mobile";
        formFactor[formFactor["smallTablet"] = 1] = "smallTablet";
        formFactor[formFactor["tablet"] = 2] = "tablet";
        formFactor[formFactor["desktop"] = 3] = "desktop";
    })(ngX.formFactor || (ngX.formFactor = {}));
    var formFactor = ngX.formFactor;
})(ngX || (ngX = {}));

//# sourceMappingURL=formFactor.js.map

var ngX;
(function (ngX) {
    "use strict";
    var getFormFactor = function () {
        var width = window.innerWidth;
        if (width <= 768)
            return ngX.formFactor.mobile;
        if (width <= 1064)
            return ngX.formFactor.tablet;
        return ngX.formFactor.desktop;
    };
    angular.module("ngX").value("getFormFactor", getFormFactor);
})(ngX || (ngX = {}));

//# sourceMappingURL=getFormFactor.js.map

var ngX;
(function (ngX) {
    "use strict";
    ngX.getFromUrlSync = function (options) {
        var responseText = "";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", options.url, false);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    responseText = xhr.responseText;
                }
                else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.send(null);
        return responseText;
    };
    angular.module("ngX").value("getFromUrlSync", ngX.getFromUrlSync);
})(ngX || (ngX = {}));

//# sourceMappingURL=getFromUrlSync.js.map

var ngX;
(function (ngX) {
    ngX.getFunctionName = function (fun) {
        var ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret[0].toLowerCase() + ret.substr(1);
    };
})(ngX || (ngX = {}));

//# sourceMappingURL=getFunctionName.js.map

var ngX;
(function (ngX) {
    "use strict";
    var getHtml = function (who, deep) {
        if (!who || !who.tagName)
            return '';
        var txt, ax, el = document.createElement("div");
        el.appendChild(who.cloneNode(false));
        txt = el.innerHTML;
        if (deep) {
            ax = txt.indexOf('>') + 1;
            txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
        }
        el = null;
        return txt;
    };
    angular.module("ngX").value("getHtml", getHtml);
})(ngX || (ngX = {}));

//# sourceMappingURL=getHtml.js.map

//http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
var ngX;
(function (ngX) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    ngX.getParameterNames = function (func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    };
})(ngX || (ngX = {}));

//# sourceMappingURL=getParameterNames.js.map

var ngX;
(function (ngX) {
    ngX.getTemplateUrlFromComponentName = function (options) {
        if (options.componentName.length > 9) {
            if (options.componentName.substr(options.componentName.length - 9) === "Component") {
                var componentTemplateFileName = options.componentName.substr(0, options.componentName.length - 9) + ".component.html";
                if (options.moduleName)
                    return "/src/" + options.moduleName + "/components/" + componentTemplateFileName;
                return "/src/" + ngX.appModuleName + "/components/" + componentTemplateFileName;
            }
        }
        return "";
    };
})(ngX || (ngX = {}));

//# sourceMappingURL=getTemplateUrlFromComponentName.js.map

var ngX;
(function (ngX) {
    ngX.getX = function (element) {
        var transform = angular.element(element).css("transform");
        if (transform === "none")
            return 0;
        var result = JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"));
        return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[4];
    };
    angular.module("ngX").value("getX", ngX.getX);
})(ngX || (ngX = {}));

//# sourceMappingURL=getX.js.map

var ngX;
(function (ngX) {
    //http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    ngX.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    angular.module("ngX").value("guid", ngX.guid);
})(ngX || (ngX = {}));

//# sourceMappingURL=guid.js.map

var ngX;
(function (ngX) {
    "use strict";
    var dispatcher = null;
    var $q = null;
    var invokeAsync = function (options) {
        if (!dispatcher) {
            dispatcher = angular.element(document.body).injector().get("dispatcher");
        }
        if (!$q) {
            $q = angular.element(document.body).injector().get("$q");
        }
        if (angular.isFunction(options)) {
            options = { action: options };
        }
        ;
        var deferred = $q.defer();
        var actionId = options.params ? options.action(options.params) : options.action();
        var listenerId = dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (callbackOptions) {
                if (actionId === callbackOptions.id) {
                    dispatcher.removeListener({ id: listenerId });
                    deferred.resolve();
                }
            }
        });
        return deferred.promise;
    };
    angular.module("ngX").value("invokeAsync", invokeAsync);
})(ngX || (ngX = {}));

//# sourceMappingURL=invokeAsync.js.map

var ngX;
(function (ngX) {
    var LocalStorageManager = (function () {
        function LocalStorageManager($window) {
            var _this = this;
            this.id = "ngX";
            this._items = null;
            this.get = function (options) {
                var storageItem = null;
                for (var i = 0; i < _this.items.length; i++) {
                    if (options.name === _this.items[i].name)
                        storageItem = _this.items[i].value;
                }
                return storageItem;
            };
            this.put = function (options) {
                var itemExists = false;
                _this.items.forEach(function (item) {
                    if (options.name === item.name) {
                        itemExists = true;
                        item.value = options.value;
                    }
                });
                if (!itemExists) {
                    var items = _this.items;
                    items.push({ name: options.name, value: options.value });
                    _this.items = items;
                    items = null;
                }
            };
            this.clear = function () {
                _this._items = [];
            };
            $window.onbeforeunload = function () {
                localStorage.setItem(_this.id, JSON.stringify(_this.items));
            };
        }
        Object.defineProperty(LocalStorageManager.prototype, "items", {
            get: function () {
                if (this._items === null) {
                    var storageItems = localStorage.getItem(this.id);
                    if (storageItems === "null") {
                        storageItems = null;
                    }
                    this._items = JSON.parse(storageItems || "[]");
                }
                return this._items;
            },
            set: function (value) {
                this._items = value;
            },
            enumerable: true,
            configurable: true
        });
        return LocalStorageManager;
    })();
    angular.module("ngX").service("localStorageManager", ["$window", LocalStorageManager]);
})(ngX || (ngX = {}));

//# sourceMappingURL=localStorageManager.js.map

var ngX;
(function (ngX) {
    "use strict";
    var LoginRedirectProvider = (function () {
        function LoginRedirectProvider() {
            var _this = this;
            this.loginUrl = "/login";
            this.defaultPath = "/";
            this.setLoginUrl = function (value) {
                _this.loginUrl = value;
            };
            this.setDefaultUrl = function (value) {
                _this.defaultPath = value;
            };
            this.$get = ["$q", "$location", function ($q, $location) {
                    return {
                        responseError: function (response) {
                            if (response.status == 401) {
                                _this.lastPath = $location.path();
                                $location.path(_this.loginUrl);
                            }
                            return $q.reject(response);
                        },
                        redirectToLogin: function () {
                            _this.lastPath = $location.path();
                            $location.path(_this.loginUrl);
                        },
                        redirectPreLogin: function () {
                            if (_this.lastPath) {
                                $location.path(_this.lastPath);
                                _this.lastPath = "";
                            }
                            else {
                                $location.path(_this.defaultPath);
                            }
                        }
                    };
                }];
        }
        return LoginRedirectProvider;
    })();
    angular.module("ngX").provider("loginRedirect", [LoginRedirectProvider])
        .config(["$httpProvider", config]);
    function config($httpProvider) {
        $httpProvider.interceptors.push("loginRedirect");
    }
})(ngX || (ngX = {}));

//# sourceMappingURL=loginRedirectProvider.js.map

// add model registration with change notifications firing after save method or update method  

//# sourceMappingURL=model.js.map

var ngX;
(function (ngX) {
    var navigation = (function () {
        function navigation($location, $rootScope, localStorageManager) {
            var _this = this;
            this.$location = $location;
            this.$rootScope = $rootScope;
            this.localStorageManager = localStorageManager;
            this.urls = [];
            this.goBack = function () {
                _this.$location.path(_this.urls.pop());
            };
            this.hasHistory = function () {
                return _this.urls.length > 0;
            };
            this.setTitle = function (options) {
                document.title = options.title;
            };
            this.setMetaTag = function (options) {
                angular.element("meta[name=" + options.name + "]").remove();
                angular.element('head').append("<meta name='" + options.name + "' content='" + options.value + "'>");
            };
            $rootScope.$on("$locationChangeSuccess", function () {
                _this.urls.push($location.path());
            });
        }
        return navigation;
    })();
    ngX.navigation = navigation;
    angular.module("ngX")
        .service("navigation", ["$location", "$rootScope", "localStorageManager", navigation])
        .run(["navigation", function (navigation) { }]);
})(ngX || (ngX = {}));

//# sourceMappingURL=navigation.js.map

var ngX;
(function (ngX) {
    function once() {
    }
    angular.module("ngX").service("once", [once]);
})(ngX || (ngX = {}));

//# sourceMappingURL=once.js.map

var ngX;
(function (ngX) {
    "use strict";
    /**
     * @name removeElement
     * @module ngX
     */
    ngX.removeElement = function (options) {
        if (options.nativeHTMLElement) {
            var $target = angular.element(options.nativeHTMLElement);
            options.nativeHTMLElement.parentNode.removeChild(options.nativeHTMLElement);
            $target.remove();
            delete options.nativeHTMLElement;
        }
    };
    angular.module("ngX").value("removeElement", ngX.removeElement);
})(ngX || (ngX = {}));

//# sourceMappingURL=removeElement.js.map

var ngX;
(function (ngX) {
    "use strict";
    /**
    * @name RenderedNodes
    * @module ngX
    * @description
    */
    var RenderedNodes = (function () {
        function RenderedNodes(getX) {
            var _this = this;
            this.getX = getX;
            this.createInstance = function (options) {
                var instance = new RenderedNodes(_this.getX);
                instance.containerNavtiveElement = options.containerNavtiveElement;
                return instance;
            };
            this.getAll = function (options) {
                var direction;
                switch (options.orientation) {
                    case "horizontal":
                        direction = "left";
                        break;
                    default:
                        direction = "top";
                        break;
                }
                switch (options.order) {
                    case "desc":
                        return _this.map.sort(function (a, b) {
                            return b[direction] - a[direction];
                        });
                    case "asc":
                        return _this.map.sort(function (a, b) {
                            return a[direction] - b[direction];
                        });
                }
            };
            this.getHead = function () {
                var map = _this.getAll({ order: "asc" });
                if (map.length < 1) {
                    return null;
                }
                return map[0];
            };
            this.getTail = function () {
                var map = _this.getAll({ order: "desc" });
                if (map.length < 1) {
                    return null;
                }
                return map[0];
            };
            this.getHeadAndTail = function () {
                var map = _this.getAll({ order: "asc" });
                if (map.length < 1) {
                    return null;
                }
                return {
                    head: map[0],
                    tail: map[map.length - 1]
                };
            };
        }
        Object.defineProperty(RenderedNodes.prototype, "nodes", {
            /** @internal */
            get: function () {
                return this.containerNavtiveElement.childNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderedNodes.prototype, "map", {
            get: function () {
                var map = [];
                var nodes = this.nodes;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    map.push({
                        left: this.getX(node) + node.offsetLeft,
                        node: node,
                        scope: angular.element(node).scope()
                    });
                }
                return map;
            },
            enumerable: true,
            configurable: true
        });
        return RenderedNodes;
    })();
    ngX.RenderedNodes = RenderedNodes;
    angular.module("ngX").service("renderedNodes", ["getX", RenderedNodes]);
})(ngX || (ngX = {}));

//# sourceMappingURL=renderedNodes.js.map

var ngX;
(function (ngX) {
    "use strict";
    /**
    * @name RequestCounter
    * @module ngX
    */
    var RequestCounter = (function () {
        function RequestCounter($q) {
            var _this = this;
            this.$q = $q;
            this.requests = 0;
            this.request = function (config) {
                _this.requests += 1;
                return _this.$q.when(config);
            };
            this.requestError = function (error) {
                _this.requests -= 1;
                return _this.$q.reject(error);
            };
            this.response = function (response) {
                _this.requests -= 1;
                return _this.$q.when(response);
            };
            this.responseError = function (error) {
                _this.requests -= 1;
                return _this.$q.reject(error);
            };
            this.getRequestCount = function () {
                return _this.requests;
            };
        }
        RequestCounter.createInstance = function ($q) { return new RequestCounter($q); };
        return RequestCounter;
    })();
    ngX.RequestCounter = RequestCounter;
    angular.module("ngX").factory("requestCounter", ["$q", RequestCounter.createInstance])
        .config([
        "$httpProvider", function ($httpProvider) {
            $httpProvider.interceptors.push("requestCounter");
        }
    ]);
})(ngX || (ngX = {}));

//# sourceMappingURL=requestCount.js.map

//http://odetocode.com/blogs/scott/archive/2014/03/24/dynamic-routes-with-angularjs.aspx
var ngX;
(function (ngX) {
    "use strict";
    ngX.routeConfigs = [];
    /**
    * @name RouteResolverServiceProvider
    * @module ngX
    * @description Collect and execute route promises that should be resolve before a route is loaded
    */
    var RouteResolverServiceProvider = (function () {
        function RouteResolverServiceProvider() {
            var _this = this;
            this.configure = function (routePromise) { _this._routePromises.push(routePromise); };
            this.$get = ["$injector", "$q", function ($injector, $q) {
                    return {
                        resolve: function (routeName, routeParams) {
                            _this.routeParams = routeParams;
                            var deferred = $q.defer();
                            var resolvedRouteData = {};
                            var routePromises = _this.getRoutePromisesByRouteName(routeName);
                            if (routePromises.length < 1)
                                return $q.when(true);
                            var prioritizedGroups = _this.reduceRoutePromisesByPriority(routePromises);
                            _this.invoke($injector, $q, prioritizedGroups, 0, function () {
                                deferred.resolve(resolvedRouteData);
                            }, resolvedRouteData);
                            return deferred.promise;
                        }
                    };
                }
            ];
            /* @internal */
            this._routePromises = [];
            /**
            * @name getRoutePromisesByRouteName
            * @description the route promises that will be resolved on an route
            * if the value of the route key matches the route definition '/foo/{id}' or '/foos'
            * include that routePromises
            * if they is no specific route mention, it's assumed you want that promise to be resolved on
            * every route
            */
            this.getRoutePromisesByRouteName = function (route) {
                return _this._routePromises.filter(function (routePromise) {
                    if (routePromise.route)
                        return routePromise.route === route;
                    if (routePromise.routes)
                        return routePromise.routes.indexOf(route) > -1;
                    return true;
                });
            };
            /**
             * Reduce RoutePromises into prioritized groups
             * Put the route promises with the same priority in the same group
             * Eventually will be resolve together asynchronously with $q.all
             */
            this.reduceRoutePromisesByPriority = function (routePromises) {
                var priorities = [];
                var routePromisesPrioritizedGroups = [];
                routePromises.forEach(function (promise) {
                    if (priorities.indexOf(promise.priority) < 0)
                        priorities.push(promise.priority);
                });
                priorities.forEach(function (priority, index) {
                    routePromisesPrioritizedGroups.push({
                        promises: routePromises.filter(function (promise) { return promise.priority == priority; }),
                        priority: priority,
                        isLast: index == priorities.length - 1
                    });
                });
                return routePromisesPrioritizedGroups;
            };
            /**
             * Invoke the grouped promises. Reducing the results into the resolvedRouteData object
             * If the route promise inside the group has a key defined, the result will be attached to the
             * resolved object (routeData) using that key
             * After you reach the last group, call the callback that will resolve the object that
             * will have a key value dictionary with the results of any promises with a key defined
             */
            this.invoke = function ($injector, $q, groups, currentGroupIndex, callback, resolvedRouteData) {
                var excutedPromises = [];
                var currentGroup = groups[currentGroupIndex];
                currentGroup.promises.forEach(function (statePromise) {
                    excutedPromises.push($injector.invoke(statePromise.promise));
                });
                $q.all(excutedPromises).then(function (results) {
                    results.forEach(function (result, index) {
                        if (currentGroup.promises[index].key)
                            resolvedRouteData[currentGroup.promises[index].key] = results[index];
                    });
                    currentGroup.isLast ? callback() : _this.invoke($injector, $q, groups, currentGroupIndex + 1, callback, resolvedRouteData);
                });
            };
        }
        Object.defineProperty(RouteResolverServiceProvider.prototype, "routePromises", {
            /**
             * get route promises ordered by priority (ASC)
             * priority 1 runs before priority 10
             */
            get: function () {
                return this._routePromises.sort(function (a, b) {
                    return a.priority - b.priority;
                });
            },
            enumerable: true,
            configurable: true
        });
        return RouteResolverServiceProvider;
    })();
    ngX.RouteResolverServiceProvider = RouteResolverServiceProvider;
    try {
        angular.module("ngRoute");
        angular.module("ngX")
            .provider("routeResolverService", [RouteResolverServiceProvider])
            .config(["$routeProvider", function ($routeProvider) {
                $routeProvider.buildFromUrl = function (options) {
                    var routes = JSON.parse(ngX.getFromUrlSync({ url: options.url }));
                    for (var i = 0; i < routes.length; i++) {
                        $routeProvider.when(routes[i].when, routes[i].config);
                    }
                };
                var whenFn = $routeProvider.when;
                $routeProvider.when = function () {
                    if (arguments[1] && arguments[0]) {
                        var path = arguments[0];
                        arguments[1].templateUrl = arguments[1].componentTemplateUrl || arguments[1].templateUrl;
                        arguments[1].controller = arguments[1].componentName || arguments[1].controller;
                        arguments[1].controllerAs = "vm";
                        arguments[1].reloadOnSearch = arguments[1].reloadOnSearch || false;
                        if (arguments[1].componentName && !arguments[1].templateUrl)
                            arguments[1].templateUrl = ngX.getTemplateUrlFromComponentName({
                                moduleName: arguments[1].moduleName,
                                componentName: arguments[1].componentName
                            });
                        arguments[1].resolve = arguments[1].resolve || {};
                        angular.extend(arguments[1].resolve, {
                            routeData: [
                                "routeResolverService", function (routeResolverService) {
                                    return routeResolverService.resolve(path);
                                }
                            ]
                        });
                    }
                    ngX.routeConfigs.push({
                        when: arguments[0],
                        config: arguments[1]
                    });
                    whenFn.apply($routeProvider, arguments);
                    return $routeProvider;
                };
            }])
            .run(["$injector", "$location", "$rootScope", "$route", "loginRedirect", "fire", "securityStore", function ($injector, $location, $rootScope, $route, loginRedirect, fire, securityStore) {
                $rootScope.$on("$viewContentLoaded", function () {
                    var debounce = $injector.get("debounce");
                    var $route = $injector.get("$route");
                    var instance = $route.current.scope[$route.current.controllerAs];
                    if (instance.onInit)
                        instance.onInit();
                    instance.onChildUpdated = function (event) {
                        fire(document, "vmUpdate", {
                            model: event.model,
                            action: event.action
                        });
                    };
                    window.addEventListener("resize", onResize);
                    function onResize() {
                        if (instance && instance.onResize) {
                            instance.onResize();
                        }
                    }
                    document.addEventListener("modelUpdate", instance.onChildUpdated);
                    $route.current.scope.$on("$destroy", function () {
                        document.removeEventListener("modelUpdate", instance.onChildrenUpdated);
                        window.removeEventListener("resize", onResize);
                    });
                });
                $rootScope.$on("$routeChangeStart", function (currentRoute, nextRoute) {
                    if (nextRoute.$$route.authorizationRequired && !securityStore.token) {
                        $rootScope.$evalAsync(function () {
                            loginRedirect.redirectToLogin();
                        });
                    }
                    if ($location.path() === "/login") {
                        securityStore.token = null;
                    }
                });
                $rootScope.$on("$routeChangeStart", function (event, next, current) {
                    $rootScope["isNavigating"] = true;
                    /**
                    * if routes contain /login then assume every route authorization is required except for /login
                    */
                    if ($location.path() === "/login") {
                        securityStore.token = null;
                    }
                    if ($route.routes["/login"]) {
                    }
                    else {
                    }
                    var instance = current && current.controllerAs && current.scope ? current.scope[current.controllerAs] : null;
                    if (instance && instance.canDeactivate && !instance.deactivated) {
                        event.preventDefault();
                        instance.canDeactivate().then(function (canDeactivate) {
                            if (canDeactivate) {
                                instance.deactivated = true;
                                $location.path(next.originalPath);
                            }
                        });
                    }
                    else {
                        if (instance && instance.deactivate)
                            instance.deactivate();
                    }
                });
            }]);
    }
    catch (error) {
    }
})(ngX || (ngX = {}));

//# sourceMappingURL=routeResolverServiceProvider.js.map

var ngX;
(function (ngX) {
    //http://victorsavkin.com/post/99998937651/building-angular-apps-using-flux-architecture
    var SecurityStore = (function () {
        function SecurityStore(dispatcher, localStorageManager) {
            this.dispatcher = dispatcher;
            this.localStorageManager = localStorageManager;
            this.emitChange = function () {
            };
        }
        Object.defineProperty(SecurityStore.prototype, "token", {
            get: function () {
                return this.localStorageManager.get({ name: "token" });
            },
            set: function (value) {
                this.localStorageManager.put({ name: "token", value: value });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SecurityStore.prototype, "currentUser", {
            get: function () {
                return this.localStorageManager.get({ name: "currentUser" });
            },
            set: function (value) {
                this.localStorageManager.put({ name: "currentUser", value: value });
            },
            enumerable: true,
            configurable: true
        });
        return SecurityStore;
    })();
    angular.module("ngX").service("securityStore", ["dispatcher", "localStorageManager", SecurityStore])
        .run(["securityStore", function (securityStore) {
        }]);
})(ngX || (ngX = {}));

//# sourceMappingURL=securityStore.js.map

var ngX;
(function (ngX) {
    "use strict";
    var $q = angular.injector(['ng']).get("$q");
    /**
     * @name setOpacityAsync
     * @module ngX
     */
    ngX.setOpacityAsync = function (options) {
        var deferred = $q.defer();
        if (options.nativeHtmlElement) {
            options.nativeHtmlElement.style.opacity = options.opacity;
            options.nativeHtmlElement.addEventListener('transitionend', resolve, false);
        }
        function resolve() {
            options.nativeHtmlElement.removeEventListener('transitionend', resolve);
            deferred.resolve();
        }
        return deferred.promise;
    };
    angular.module("ngX").value("setOpacityAsync", ngX.setOpacityAsync);
})(ngX || (ngX = {}));

//# sourceMappingURL=setOpacityAsync.js.map

var ngX;
(function (ngX) {
    var Store = (function () {
        function Store(dispatcher) {
            var _this = this;
            this.dispatcher = dispatcher;
            this.items = [];
            this.getById = function (id) {
                var item = null;
                for (var i = 0; i < _this.items.length; i++) {
                    if (_this.items[i].id === id) {
                        item = _this.items[i];
                    }
                }
                return item;
            };
            this.addOrUpdate = function (options) {
                var exists = false;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].id === options.data.id) {
                        exists = true;
                        this.items[i] = options.data;
                    }
                }
                if (!exists)
                    this.items.push(options.data);
            };
            this.emitChange = function (options) {
                this.dispatcher.emit({
                    actionType: "CHANGE", options: {
                        id: options ? options.id : null,
                        data: options ? options.data : null
                    }
                });
            };
        }
        Store.prototype.createInstance = function () { return new Store(this.dispatcher); };
        return Store;
    })();
    angular.module("ngX").service("store", ["dispatcher", Store]);
})(ngX || (ngX = {}));
var ngX;
(function (ngX) {
    ngX.Store = function (options) {
        options.module = options.module || "app";
        options.name = options.name || ngX.getFunctionName(options.store);
        options.providers.push(options.store);
        angular.module(options.module)
            .service(options.name, options.providers)
            .run([options.name, function (store) { }]);
    };
})(ngX || (ngX = {}));

//# sourceMappingURL=store.js.map

var ngX;
(function (ngX) {
    ngX.translateX = function (element, value) {
        angular.element(element).css({
            "-moz-transform": "translateX(" + value + "px)",
            "-webkit-transform": "translateX(" + value + "px)",
            "-ms-transform": "translateX(" + value + "px)",
            "-transform": "translateX(" + value + "px)"
        });
        return element;
    };
    angular.module("ngX").value("translateX", ngX.translateX);
})(ngX || (ngX = {}));

//# sourceMappingURL=translateX.js.map

var ngX;
(function (ngX) {
    "use strict";
    var $q = angular.injector(['ng']).get("$q");
    ngX.translateXAsync = function (options) {
        var deferred = $q.defer();
        angular.element(options.element).css({
            "-moz-transform": "translateX(" + options.x + "px)",
            "-webkit-transform": "translateX(" + options.x + "px)",
            "-ms-transform": "translateX(" + options.x + "px)",
            "-transform": "translateX(" + options.x + "px)"
        });
        options.element.addEventListener('transitionend', resolve, false);
        function resolve() {
            options.element.removeEventListener('transitionend', resolve);
            deferred.resolve();
        }
        return deferred.promise;
    };
    angular.module("ngX").value("translateXAsync", ngX.translateXAsync);
})(ngX || (ngX = {}));

//# sourceMappingURL=translateXAsync.js.map
