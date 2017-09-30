angular.module('leth.services')
.factory('StoresService', function ($q, $http) {
  var storesJson = '';

  return {
    getBitAseanStores: function(){
      var q = $q.defer();
      $http({
        method: 'GET',
        url: 'http://128.199.118.37/stores.php'
      }).then(function(response) {
        q.resolve(response.data);
      }, function(response) {
        q.reject(response);
      });
      return q.promise;
    }
  };
})
