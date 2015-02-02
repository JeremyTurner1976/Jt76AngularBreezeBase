(function () {
    "use strict";

    //directives are strongly named data-id1-id2 and you name the directive id1Id1 (note caps)

    var app = angular.module("app");

    //formats dates, if not setting dtLocalCreated or using preset
    //preset = data-ng-bind-html="i.dtCreated | date: ' MMM d, yyyy h:mm:ss a'"
    app.directive("jt76Date", function () {
        //Usage:
        //<div data-jt76-date="{{m.dtCreated}}"></div>
        var directive = {
            link: link,
            restrict: "A"
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe("jt76Date", function (value) {
                //"\"2015-01-03T04:00:23.530Z\""
                var localValue = moment.utc(value, "YYYY-MM-DD HH:mm:ss").toDate();
                var formattedValue = moment(localValue).format("MMMM Do YYYY, h:mm:ss a");
                element[0].innerHTML = formattedValue;
            });
        }
    });

    app.directive("jt76Skycon", function () {
        //Usage:
        //<canvas data-jt76-skycon="{{item.strSkyconId}},{{item.icon}}" width="120" height="120"></canvas>
        var directive = {
            link: link,
            restrict: "A"
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe("jt76Skycon", function (value) {
                var icons = new Skycons({ "color": "white" });
                icons.set(element[0], value);
                icons.play();
            });
        }
    });

    //VALIDATION


    app.directive("jt76Stringvalidate", function () {
        //Usage:
        //<input name="strUserName" type="text" class="form-control"
        //placeholder="Your Callsign" data-ng-model="vm.email.strUserName"
        //data-jt76-stringvalidate 
        //required data-ng-minlength="5" data-ng-maxlength="100">
        var directive = {
            link: link,
            restrict: "A"
        };
        return directive;

        function link(scope, element, attrs) {
            var nMinLength = parseInt(element[0].dataset.ngMinlength);
            var nMaxLength = parseInt(element[0].dataset.ngMaxlength);

            scope.$watch(element[0].dataset.ngModel, function (newValue) {
                var self = element[0];
                var strValidationMessage = self.validationMessage;

                var strLastMessage = strValidationMessage;
                if (self.nextElementSibling) {
                    self.parentNode.removeChild(self.nextElementSibling);
                }

                var nInputLength = self.value.length;
                if (strValidationMessage.length === 0) {
                    if (nMinLength > nInputLength) {
                        strValidationMessage = "Minimum " + nMinLength + " Characters";
                    }
                    else if (nMaxLength <= nInputLength) {
                        strValidationMessage = "Maximum " + nMaxLength + " Characters";
                    } else {
                        return;
                    }
                }

                $(self).addClass("ng-invalid");
                $(self).after("<span class='jt76-error'>" + strValidationMessage + "<span>");
            });
        }

    });

})();