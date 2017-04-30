window.mainApp
.factory('facebookService', function($q) {
    var $this = {}
    $this.initialize = function()
    {
        FB.init({ 
          appId: '{your-app-id}',
          status: true, 
          cookie: true, 
          xfbml: true,
          version: 'v2.4'
        });
    }

    $this.getMyLastName = function() {
        var deferred = $q.defer();
        FB.api('/me', {
            fields: 'last_name'
        }, function(response) {
            if (!response || response.error) {
                deferred.reject('Error occured');
            } else {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }

    return $this;

});