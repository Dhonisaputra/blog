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

})
.factory('F_Config', function(global_configuration){
    var $this = {}
    $this.public_key = '';
    $this.source = undefined;

    $this.trends_url = function(url)
    {
        url = (!url)?'':url;
        return $this.trends+'/'+url;   
    }
    $this.server_url = function(url)
    {
        url = (!url)?'':url;
        return $this.processing_server+url;
    }
    $this.base_url = function(url)
    {
        url = (!url)?'':url;
        return $this.web_url+url;
    }
    $this.set_source = function(source)
    {
        $this.source = source;
    }
    $this.set_public_key = function(source)
    {
        $this.public_key = source;
    }
    $this.node = window.node;
    $this.initialize_configuration = function(config)
    {
        var _parents = $this;
        Cookies.set(global_configuration.namespace_public, config)
        $.each(config, function(a,b){
            _parents[a] = b;
        })
    }
    return $this;
})
.factory('F_Tools', function(F_Config){
    var $this = {}
    
    return $this;
})
.factory('F_Ads', function(F_Tools, F_Config){
    var $this = {options:{}}
    $this.auto_ads = function($data, success, error)
    {
        $.post(F_Config.server_url('ads/auto_ads'), $data)
        .done(success)
        .fail(error)
    }

    $this.shuffle_ads = function($data, success, error)
    {
        $.post(F_Config.server_url('ads/shuffle_ads'), $data)
        .done(success)
        .fail(error)
    }

    $this.get_options = function(success, error)
    {
        $.post(F_Config.server_url('ads/get_options'))
        .done(function(res){
            res = JSON.parse(res);
            if(typeof success == 'function')
            {
                success(res, $this)
            }
        })
        .fail(error)
    }
    $this.get_components = function(success, error)
    {
        $.post(F_Config.server_url('ads/get_ads_components'))
        .done(function(res){
            res = JSON.parse(res);
            if(typeof success == 'function')
            {
                success(res, $this)
            }
        })
        .fail(error)
    }
    $this.remove_ads = function($data, success, error)
    {
        $.post(F_Config.server_url('ads/remove_ads'), $data)
        .done(function(res){
            if(typeof success == 'function')
            {
                success(res)
            }
        })
        .fail(error)
    }
    $this.update_ads_length = function($data, success, error)
    {
        $.post(F_Config.server_url('ads/update_ads_length'), $data)
        .done(function(res){
            if(typeof success == 'function')
            {
                success(res, $this)
            }
        })
        .fail(error)
    }

    $this.add_new_ads = function($data, success, error)
    {
        $.post(F_Config.server_url('ads/add_new_ads'), $data)
        .done(function(res){
            if(typeof success == 'function')
            {
                success(res, $this)
            }
        })
        .fail(error)
    }
    return $this;
});