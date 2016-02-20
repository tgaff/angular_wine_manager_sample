var app = angular.module("wineManager", ['ngRoute', 'ngAnimate', 'ngResource'])
  .controller('WinesController', WinesController)
  .controller('WineController', WineController)
  .factory('Wine', Wine);

app.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/index.html",
            controller: "WinesController as winesC"
        })
        .when("/edit/:id", {
          templateUrl: "templates/edit.html",
          controller: 'WineController as vm'
        })
        .otherwise({
            redirectTo: "/"
        });
}]);

Wine.$inject = ['$resource'];
function Wine(   $resource  ) {
    return $resource('https://super-crud.herokuapp.com/wines/:id',
                   { id: '@_id'},
                   {  update: { method: 'PUT'},
                      query: { isArray: false } // the super-crud api returns {wines: []}
                    }
  );
}


WinesController.$inject = ['Wine'];
function WinesController(Wine) {
  var vm = this;
  console.log('ok WinesController');
  vm.createWine = createWine;


  var updateWines = function() {
    Wine.query(function(data) {
      console.log(data);
      vm.wines = data.wines;

    }, function() {
      alert('cant get the wines');
    });
  };


  function createWine() {
    console.log(vm.newWine);
    Wine.save(vm.newWine, function(data) {
        console.log('received: ', data);
        updateWines();
      }, function() {
        alert('failed to save');
      });
  }

  // on initialization
  updateWines();

}

WineController.$inject = [ '$routeParams', '$location', 'Wine'];
function WineController(    $routeParams,   $location,   Wine ) {
  console.log('WineController');
  var vm = this;
  vm.wineID = $routeParams.id;

  vm.updateWine = updateWine;
  vm.deleteWine = deleteWine;
  getWine();



  function getWine() {
    console.log('getting wine ', vm.wineID);
    Wine.get({ id: vm.wineID }, function(wine) {
        vm.wine = wine;
      }, function() {
        alert('failed to get wine with id ', vm.wineID);
      }
    );
  }

  function updateWine() {
    console.log('updateWine()');
    Wine.update( { id: vm.wineID }, vm.wine,
      function(wine) {
        console.log('it worked');
        $location.path('/');

      }, function() {
        alert('failed to save');
      });
  }

  function deleteWine() {
    console.log('destroy ', vm.wineID);
    Wine.delete({id: vm.wineID}, function() {
      console.log('destroyed');
      $location.path('/');
    });
  }

}
