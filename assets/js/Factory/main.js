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
    $this.isJson = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    return $this;
})
.factory('F_Comment', function(F_Config, F_Tools){
    var $this = {}
    $this.components = {}
    $this.components.object_components = {
        credential: {},
        records: [],
        isLogin: false,
        section:{},
    }

    $this.components.scope_name                                             = 'comment_components';
    $this.components.cookies_name                                           = '_comment_credential_';
    $this.components.element_supports                                       = '';
    $this.components.object_components.section.main_comment                 = 'ng-comment';
    $this.components.object_components.section.credential                   = 'ng-comment-credential';
    $this.components.object_components.section.reply_comment                = 'ng-article-comment-replying';
    $this.components.object_components.section.article_comment_form         = 'ng-comment-article-textarea';
    $this.components.object_components.section.article_comment_list         = 'ng-comment-article-comment-list';
    $this.components.object_components.section.replying_comment_list        = 'ng-comment-replying-comment-list';
    
    $this.components.element_supports += "<div "+$this.components.object_components.section.credential+" ng-if='!"+$this.components.scope_name+".isLogin'><ng-include src=\"'templates/others/comment/credential.html'\"></ng-include></div>"
    $this.components.element_supports += "<div "+$this.components.object_components.section.article_comment_form+" ng-if='"+$this.components.scope_name+".isLogin'><ng-include src=\"'templates/others/comment/comment.article.html'\"></ng-include></div>"
    $this.components.element_supports += "<div "+$this.components.object_components.section.article_comment_list+"><ng-include src=\"'templates/others/comment/comment.list.html'\"></ng-include></div>"


    $this.submit_comment = function(data_comment, success, fail)
    {
        return $.post(F_Config.server_url('comment/submit_comment'), {data:data_comment})
    }

    $this.get_comments = function(id_article, success, fail)
    {
        $.post(F_Config.server_url('comment/get_comment'), {})
        .done(function(res){
            res = F_Tools.isJson(res)? JSON.parse(res) : res;
            $this.records = res;
            if(typeof success == 'function'){success(res);}
        })
        .fail(function(res){
            if(typeof fail == 'function'){fail(res);}
        })
    }
    $this.show_reply_comment_section = function(id_post, id_comment)
    {
        $('['+$this.components.object_components.section.reply_comment+'="'+id_post+'.'+id_comment+'"]').show();
    }
    $this.hide_reply_comment_section = function()
    {
        $('['+$this.components.object_components.section.reply_comment+']').hide();
    }

    $this.comment_credential = {} 
    $this.comment_credential.set = function(data_login)
    {
        Cookies.set($this.components.cookies_name, data_login);
        $this.components.object_components.isLogin = true;
    }
    $this.comment_credential.isLogin = function()
    {
        return Cookies.getJSON($this.components.cookies_name)
    }
    $this.comment_credential.initialize = function()
    {
        
        if($this.comment_credential.isLogin())
        {
            // $('['+$this.components.object_components.section.credential+']').hide()
            $this.components.object_components.isLogin = true;
        }
    }

    $this.login = function(data, success, fail)
    {
        $.post(F_Config.server_url('comment/login'), {data: data})
        .done(function(res){
           res = F_Tools.isJson(res)? JSON.parse(res) : res;
           if(typeof success == 'function'){success(res)}
        })
        .fail(function(res){
            console.log(res)
        })
    }
    $this.records = [];
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