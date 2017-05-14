window.mainApp = angular.module("mainApp", ['ngRoute', 'ngSanitize'/*, 'ui.bootstrap'*/]);
window.mainApp
.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);

        for (var i=0; i<total; i++) {
          input.push(i);
      }

      return input;
    };
})
.filter('sortBy', function(F_Sort){
    return function(items, search, searchType) {
        if(!items) return [];
        if (!search) return items;
        var sort = F_Sort.sortBy(items, search, searchType);
        return sort;

    };
})
.run(['$rootScope', '$config', '$q', function($rootScope, $config, $q) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title? current.$$route.title : '';
    });
}])
.factory('global_configuration', function(){
    var config = {}
    config.namespace_sudo = 'sudo';
    config.namespace_admin = 'admin';
    config.namespace_public = 'public';
    return config;
});


window.mainApp.run(['$tools', '$q','$rootScope', '$location', '$routeParams','$config','F_Config', '$owner', '$authorize', function ($tools,$q,$rootScope, $location, $routeParams, $config, F_Config, $owner, $authorize) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if(!next.$$route.resolve){next.$$route.resolve = {}}
        // when data configuration don't loaded yet.
        //////////////////////////////////////////////////////////////////////
        if(!$config.processing_server)
        {
            next.$$route.resolve.__configuration = function()
            {
                var defer = $q.defer();
                $.post('blog/configuration', function(res){
                    if($tools.isJson(res))
                    {
                        res = JSON.parse(res);
                        defer.resolve(res); 
                    }
                    $config.initialize_configuration(res);
                    F_Config.initialize_configuration(res);
                }) 
                return defer.promise;
            }
        }
        //////////////////////////////////////////////////////////////////////

        // Configuration to check is authentication or no.
        //////////////////////////////////////////////////////////////////////
        $rootScope.is_auth = 0;
        $rootScope.style_main_panel= 'width:100%';
        $rootScope.sidebar= false
        var need_login = next.$$route.need_login;
        if(need_login)
        {
            if(!$authorize.is_login())
            {
                event.preventDefault();
                $location.path('/login');
            }else
            {

                $rootScope.is_auth = 1;
                $rootScope.sidebar= true
                $rootScope.style_main_panel= '';
                $rootScope.base_url = $config.base_url;
            }
        }
        //////////////////////////////////////////////////////////////////////
    });
}]);