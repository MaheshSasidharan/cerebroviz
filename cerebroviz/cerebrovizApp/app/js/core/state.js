// Application Level State
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('cerebro', {
      abstract: true,
      url: '',
      controller: 'AppCtrl',
      views: {
        'navbar': {
          templateUrl: 'js/core/templates/navbar.tpl.html'          
        },
        'main': {
          templateUrl: 'js/core/templates/main.tpl.html'
        }
      }
    });
    $urlRouterProvider.when('/', '/cerebro');
}]);