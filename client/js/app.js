angular
  .module('app', [
    'ui.router',
    'lbServices'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeController',        
      })    
      .state('add-event', {
        url: '/add-event',
        templateUrl: 'views/event-form.html',
        controller: 'AddEventController',
        authenticate: true
      })
      .state('display-event', {
        url: '/display-event/:id',
        templateUrl: 'views/event-form.html',
        controller: 'DisplayEventController'
      })      
      .state('edit-event', {
        url: '/edit-event/:id',
        templateUrl: 'views/event-form.html',
        controller: 'EditEventController',
        authenticate: true
      })
      .state('delete-event', {
        url: '/delete-event/:id',
        controller: 'DeleteEventController',
        authenticate: true
      })
      .state('all-events', {
        url: '/all-events',
        templateUrl: 'views/all-events.html',
        controller: 'AllEventsController'
      })                  
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'views/forbidden.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthLoginController'
      })
      .state('logout', {
        url: '/logout',
        controller: 'AuthLogoutController'
      })

      .state('my-events', {
        url: '/my-events',
        templateUrl: 'views/my-events.html',
        controller: 'MyEventsController',
        authenticate: true
      })      
      .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up-form.html',
        controller: 'SignUpController',
      })
      .state('sign-up-success', {
        url: '/sign-up/success',
        templateUrl: 'views/sign-up-success.html'
      });
    $urlRouterProvider.otherwise('home');
  }])
 .service('browser', ['$window', function($window) {

     return function() {

         var userAgent = $window.navigator.userAgent;

        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
       };

       return 'unknown';
    }

  }]) 
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
      // redirect to login page if not logged in
      if (next.authenticate && !$rootScope.currentUser) {
        event.preventDefault(); //prevent current page from loading
        $state.go('forbidden');
      }
    });
  }]);
