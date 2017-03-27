var app = angular.module('app', ['ngAnimate', 'ui.router', 'ui.bootstrap', 'ui-notification']);

app
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 3000,
            startTop: 65,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    })

.config([
    '$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }
])

.controller('AppCtrl', function($scope) {});