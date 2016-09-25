angular
  .module('app')
    .controller('HomeController', ['$scope', '$rootScope', 'browser', function($scope, $rootScope, browser) {
    $scope.isChrome = browser() == 'chrome';
    $rootScope.isChrome = $scope.isChrome ;
  }])
  .controller('AllEventsController', ['$scope', '$rootScope', 'Event', function($scope, $rootScope,
      Event) {
    $rootScope.currentPage = 'all-events';
    $scope.events = Event.find({
      filter: {
        order: 'startDate'
      }
    });

  }])
    .controller('MyEventsController', ['$scope', 'Event', '$rootScope',
      function($scope, Event, $rootScope) {

    $rootScope.currentPage = 'my-events';
    $scope.events = Event.find({
      filter: {
        where: {
          publisherId: $rootScope.currentUser.id
        },
        order: 'updatedDate DESC',
        include: [
          'author'
        ]
      }
    });
  }])
    
  .controller('AddEventController', ['$scope', '$rootScope',  'Event',
      '$state', function($scope, $rootScope,  Event, $state) {
    
    $scope.currentPage = $rootScope.currentPage;

    $scope.pageTitle = 'Add Event' ;
    $scope.action = 'Add';
    $scope.myEvent = {};
    $scope.isDisabled = false;

    $scope.initEvent = function() {
      if ($rootScope.isChrome) {
        $scope.dateType = 'datetime-local' ;
      } else {
        $scope.dateType = 'datetime' ;
      }
    };

    $scope.initEvent();

   $scope.checkErr = function(startDate,endDate) {
        $rootScope.errorExists = false;
        $scope.errMessageStartDate = '';
        $scope.errMessageEndDate = '' ;

        var curDate = new Date();
        
        if(new Date(startDate) > new Date(endDate)){
          $scope.errMessageEndDate = 'End Date should be greater than start date';
        $rootScope.errorExists = true;
          return false;
        }
        if(new Date(startDate) < curDate){
           $scope.errMessageStartDate = 'Start date should not be before today.';
           $rootScope.errorExists = true;         
           return false;
        }
    };

    $scope.submitEvent = function() {
      $scope.errMessage = '';
      if(!$rootScope.errorExists) {
        Event
          .create({
            startDate: $scope.myEvent.startDate,
            endDate: $scope.myEvent.endDate,
            name: $scope.myEvent.name,
            city: $scope.myEvent.city,
            country: $scope.myEvent.country,
            address1: $scope.myEvent.address1,
            zipcode: $scope.myEvent.zipcode,
            ageGroup: $scope.myEvent.ageGroup,
            shortDesc: $scope.myEvent.shortDesc,
            longDesc: $scope.myEvent.longDesc,
            contactWebsite: $scope.myEvent.contactWebsite,
            contactEmail: $scope.myEvent.contactEmail,
            contactPhone: $scope.myEvent.contactPhone,
            createdDate: $scope.myEvent.createdDate,
            updatedDate: $scope.myEvent.updatedDate
          })
          .$promise
          .then(function() {
            $state.go($rootScope.currentPage);
          });
      }
      else {
             $scope.errMessage = 'Correct above errors before saving the event';
      };
        
    };

  }]) 
  .controller('DeleteEventController', ['$scope', 'Event', '$state',
      '$stateParams', function($scope, Event, $state, $stateParams) {
    Event
      .deleteById({ id: $stateParams.id })
      .$promise
      .then(function() {
          $state.go('my-events');
      });
  }])
  .controller('DisplayEventController', ['$scope', '$rootScope', '$filter', '$q', 'Event', 
      '$stateParams', '$state', function($scope, $rootScope, $filter, $q, Event,
      $stateParams, $state) {
    $scope.pageTitle = 'Event Information' ;
    $scope.action = 'Display';
    $scope.myEvent = {};

    $q
      .all([
        Event.findById({ id: $stateParams.id }).$promise
      ])
      .then(function(data) {
        $scope.myEvent = data[0];

        $scope.myEvent.startDate = $filter('date')($scope.myEvent.startDate , 'MMM d, y h:mm:ss a');
        $scope.myEvent.endDate = $filter('date')($scope.myEvent.endDate , 'MMM d, y h:mm:ss a');       
      });     

  }])
  .controller('EditEventController', ['$scope', '$q', 'Event', '$rootScope',
      '$stateParams', '$state', function($scope, $q, Event, $rootScope ,
      $stateParams, $state) {
    $scope.pageTitle = 'Edit Event' ;
    $scope.action = 'Edit';
    $scope.myEvent = {};

    $scope.initEvent = function() {
      if ($rootScope.isChrome) {
        $scope.dateType = 'datetime-local' ;
      } else {
        $scope.dateType = 'datetime' ;
      }
    };

    $scope.initEvent();

   $scope.checkErr = function(startDate,endDate) {
        $rootScope.errorExists = false;
        $scope.errMessageStartDate = '';
        $scope.errMessageEndDate = '' ;

        var curDate = new Date();
        
        if(new Date(startDate) > new Date(endDate)){
          $scope.errMessageEndDate = 'End Date should be greater than start date';
        $rootScope.errorExists = true;
          return false;
        }
        if(new Date(startDate) < curDate){
           $scope.errMessageStartDate = 'Start date should not be before today.';
           $rootScope.errorExists = true;         
           return false;
        }
    };

    $q
      .all([
        Event.findById({ id: $stateParams.id }).$promise
      ])
      .then(function(data) {
        $scope.myEvent = data[0];
        if ($rootScope.isChrome) {
          $scope.myEvent.startDate = new Date($scope.myEvent.startDate);
          $scope.myEvent.endDate = new Date($scope.myEvent.endDate);
        }
      });

    $scope.submitEvent = function() {
      $scope.errMessage = '';
      if(!$rootScope.errorExists) {
        $scope.myEvent
          .$save()
          .then(function(event) {
            $state.go('my-events');
          });
      }
      else {
             $scope.errMessage = 'Correct above errors before saving the event';
      };        

    };
  }]);
