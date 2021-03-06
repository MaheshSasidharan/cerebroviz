// Sub-application/main Level State
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider        
        .state('cerebro.home', {
            url: '/home',
            templateUrl: 'templates/app/home.tpl.html',
            //templateUrl: 'templates/app/home.html',
            controller: 'HomeCtrl as ge'
        })
        .state('cerebro.about', {
            url: '/about',
            templateUrl: 'templates/main/about.tpl.html'
        })
        .state('cerebro.contact', {
            url: '/contact',
            templateUrl: 'templates/main/contact.tpl.html'
        });
    $urlRouterProvider.otherwise('/home');
}]);
