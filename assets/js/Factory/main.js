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
.factory('F_Sort', function(){
    var property = '';
    var type = 's';
    function set_sort_property(prop){property = prop;}
    function get_sort_property(){return property;}
    function set_sort_type(settype){type = settype? settype : 's';}
    function get_sort_type(){return type;}

    function compare(a,b) {
        var sortOrder = 1;
        var prop = get_sort_property()
        if(prop)
        {
            if(prop[0] === "-") {
                sortOrder = -1;
                prop = prop.substr(1);
            }

            var spl = prop.split('.');
            if(spl.length > 0)
            {
                $.each(spl, function(c,d){
                    a = a[d];
                    b = b[d];
                })
            }else
            {
                a = a[prop]
                b = b[prop]
            }
        }

        switch(get_sort_type())
        {
            case 'i':
                a = parseInt(a);       
                b = parseInt(b);       
                break;
            case 'b':
                a = JSON.parse(a);       
                b = JSON.parse(b);
                break;
            case 's':
            default:
                a = String(a);       
                b = String(b);
                break;
        }
        var result = (a < b) ? -1 : (a > b) ? 1 : 0;

        return result*sortOrder;
    }

    $this.sortBy = function(objs, prop, typeProp)
    {
        set_sort_property(prop);
        set_sort_type(typeProp);
        return objs.sort(compare);
    }
    return $this;
})
.factory('F_Users', function(F_Config){
   

    var $this = {}
    $this.registeringNewUser = function(str) {
        $.post(F_Config.server_url('users/signup'), {})
        .done(function(res){
            res = F_Tools.isJson(res)? JSON.parse(res) : res;
            $this.records = res;
            if(typeof success == 'function'){success(res);}
        })
        .fail(function(res){
            if(typeof fail == 'function'){fail(res);}
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
    $this.searchObjectString = function(obj, str) {
        var spl = str.split('.');
        if(spl.length > 0)
        {
            $.each(spl, function(c,d){
                obj = obj[d];
            })
        }
        return obj;
    }
    return $this;
})
.factory('F_Comment', function(F_Config, F_Tools){
    // function check login
    function check_login(cookies_name)
    {
        return Cookies.getJSON(cookies_name)? true : false;
    }
    var $this = {}
    $this.records = {};
    $this.fnHelper = {credential_input:{}};
    $this.components = {}
    $this.components.id_replying_comment = undefined;
    $this.components.cookies_name = '_comment_credential_';
    
    $this.components.object_components = {
        credential: {},
        records: [],
        isLogin: check_login($this.components.cookies_name),
        section:{},
    }

    $this.components.scope_name                                             = 'comment_components';
    $this.components.element_supports                                       = '';
    $this.components.object_components.section.main_comment                 = 'ng-comment';
    $this.components.object_components.section.credential                   = 'ng-comment-credential';
    $this.components.object_components.section.article_comment_form         = 'ng-comment-article-textarea';
    $this.components.object_components.section.article_comment_list         = 'ng-comment-article-comment-list';
    $this.components.object_components.section.reply_comment                = 'ng-comment-replying-comment';
    $this.components.object_components.section.replying_comment_list        = 'ng-comment-replying-comment-list';
    $this.components.object_components.section.attr_active_comment_editor   = 'ng-comment-editor-active';
    
    
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
    $this.set_comment_id = function(id)
    {
        if(!id)
        {
            alert('id not defined in factory.main.js ');
            return;
        }
        $this.components.id_replying_comment = id;
    }
    $this.get_comment_id = function()
    {
        return parseInt($this.components.id_replying_comment);
    }
    $this.get_comment_content = function()
    {
        return $('['+$this.components.object_components.section.attr_active_comment_editor+']').find('[ng-ckeditor]').val()
    }
    $this.show_reply_comment_section = function(id_post, id_comment)
    {
        // config CKEDITOR
        var config = {
            extraPlugins:'autogrow', 
            toolbar:[], 
            autoGrow_minHeight: 50,
            autoGrow_maxHeight: 200,
            height: 50
        }

        // hide all comment editor.
        $this.hide_reply_comment_section();

        // define element target
        var element = $('['+$this.components.object_components.section.reply_comment+'="'+id_post+'.'+id_comment+'"]')
        
        // show comment editor inside element.
        element
        .find('['+$this.components.object_components.section.replying_comment_list+']')
        .show();

        //unset other ckeditor
        if( $('['+$this.components.object_components.section.attr_active_comment_editor+']').length > 0 )
        {

            $('['+$this.components.object_components.section.attr_active_comment_editor+']')
            .find('[ng-ckeditor]')
            .ckeditor(function(){
                this.destroy();
            },config)
            .val('')

            $('['+$this.components.object_components.section.attr_active_comment_editor+']')
            .removeAttr($this.components.object_components.section.attr_active_comment_editor)

        }

        element
        // add variable on parent of textarea. as sign the textarea inside this element were an ckeditor.
        .attr($this.components.object_components.section.attr_active_comment_editor, 'true')
        // set CKEDITOR on textarea inside the "element"
        .find('[ng-ckeditor]')
        .ckeditor(config)
        .focus(); 

        // set id_comment
        $this.set_comment_id(id_comment);
        
    }
    $this.hide_reply_comment_section = function()
    {
        $('['+$this.components.object_components.section.replying_comment_list+']').hide();
    }

    $this.comment_credential = {} 
    $this.comment_credential.set = function(data_login)
    {
        Cookies.set($this.components.cookies_name, data_login);
        $this.components.object_components.isLogin = true;
    }
    $this.comment_credential.get = function()
    {
        return Cookies.get($this.components.cookies_name);
    }
    $this.comment_credential.isLogin = function()
    {
        return check_login($this.components.cookies_name)
    }
    $this.comment_credential.logout = function()
    {
        $this.comment_credential.set(undefined);
        Cookies.remove($this.components.cookies_name);
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
    $this.submit_comment = function(data_comment, success, fail)
    {
        return $.post(F_Config.server_url('comment/submit_comment'), {data:data_comment, credential: $this.comment_credential.get()})
    }

    $this.setRecords = function(name, data)
    {  
        data = F_Tools.isJson(data)? JSON.parse(data) : data;
        $this.components.object_components.records = data;

    }

    // function helper 
    $this.fnHelper.getParentName = function(e, $element)
    {
        console.log($element)
    }
    $this.fnHelper.isLogin = function()
    {
        return $this.comment_credential.isLogin();
    }
    $this.fnHelper.setLogin = function(value)
    {
        return $this.comment_credential.isLogin();
    }

    $this.components.element_supports += "<div "+$this.components.object_components.section.credential+" ng-if='!__comment.__helper.isLogin()'><ng-include src=\"'templates/others/comment/credential.html'\"></ng-include></div>"
    $this.components.element_supports += "<div "+$this.components.object_components.section.article_comment_form+" ng-if='__comment.__helper.isLogin()'><ng-include src=\"'templates/others/comment/comment.article.html'\"></ng-include></div>"
    $this.components.element_supports += "<div "+$this.components.object_components.section.article_comment_list+"><ng-include src=\"'templates/others/comment/comment.list.html'\"></ng-include></div>"


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
})
.factory('F_Moment', function(F_Tools, F_Config){
    var $this = {}
    $this.method = {}
    $this.method.format = function(origin, format, newFormat)
    {
        if(format)
        {
            return moment(origin, format).format(newFormat);
        }else{
            return moment(origin).format(newFormat);
        }

    }

    $this.method.formatUnix = function(origin, format, newFormat)
    {
        return $this.method.format(parseInt(origin), format, newFormat)

    }
    return $this.method;
})
.factory('F_Article', function(F_Tools, F_Config){
    $this = {fn:{}};
    $this.fn.get_article = function(where, callback, fail)
    {
        $.post(F_Config.server_url('article/get'), {where: where })
        .done(function(res){
            res = F_Tools.isJson(res)? JSON.parse(res) : res;
            if(typeof callback == 'function'){callback(res)}
        })
        .fail(function(res){
            console.log(res)
            if(typeof fail == 'function'){fail(res)}
        })
    }
    $this.fn.save_event = function(data, callback, fail)
    {
        $.post(F_Config.server_url('event/create_event'), {data: data })
        .done(function(res){
            res = F_Tools.isJson(res)? JSON.parse(res) : res;
            if(typeof callback == 'function'){callback(res)}
        })
        .fail(function(res){
            console.log(res)
            if(typeof fail == 'function'){fail(res)}
        })
    }

    $this.fn.update_viewer = function($id_article, $counter_post)
    {
        var data = {where: {id_article: $id_article}, update: {counter_post: $counter_post+1} };
        if(!F_Config.double_server)
        {
            $.post(F_Config.server_url('article/update_viewer'), data)
            .done(function(res){
                console.log(res)
                if(typeof callback == 'function'){callback(res)}
            })
            .fail(function(res){
                console.log(res)

            })
        }else
        {
            $config.node.send('article/update_viewer', data)
            .done(function(){

            })
        }
    }
    return $this.fn;
})
.factory('F_Event', function(F_Tools, F_Sort){
    function countDownNextEvent(event, current)
    {   
        // Update the count down every 1 second
        window.duration_interval = setInterval(function() {
        var countDownDate = new Date(event).getTime();

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            $('[ng-event-countdown-days]').text(days)
            $('[ng-event-countdown-hours]').text(hours)
            $('[ng-event-countdown-minutes]').text(minutes)
            $('[ng-event-countdown-seconds]').text(seconds)

            // If the count down is finished, write some text 
            if (distance < 0) {
                clearInterval(window.duration_interval);
            }
        }, 1000);
    }
    var $this = {}
    $this.method = {}
    $this.components = {}
    $this.components.nearly_hours = '';
    $this.components.event_nearby = {};
    $this.method.countdown = function(event_start)
    {
        countDownNextEvent(moment(parseInt(event_start)*1000).format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss'))
    }

    $this.method.set_nearly_event = function(records)
    {
        var sorted = F_Sort.sortBy(records, 'related.event.event_start', 'i');
        if(sorted.length > 0)
        {
            sorted = sorted[0]
            $this.method.countdown(sorted.related.event.event_start);
            $this.components.event_nearby = sorted;
        }
    }

    $this.method.get_nearby_event = function(name)
    {
        if(name)
        {
            return $this.components.event_nearby[name];
        }
        return $this.components.event_nearby;
    }

    return $this.method;
});