window.mainApp
.controller('home_controller', function($scope,$config, $posts) {	
	// console.log($config.base_url('posts/get_post')); return false;
	
	$scope.init_data = function()
	{
		$posts.get({}, function(res){
			// console.log(res);
			$scope.posts = []
			$posts.set_data(res)
			$scope.initialize_posts()
		})
	}
	$scope.base_url = function(url)
	{
		return $config.base_url('lockers')
	}
	$scope.url_image = function(imagename)
	{
		return $config.base_url('locker/files/'+imagename)
	}
	$scope.initialize_posts = function()
	{
		$scope.posts = $posts.get_data().filter(function(res){
			return res.post_status == 'publish'
		});
		$scope.$apply();
	}

	$scope.search_category = function(options)
	{
		options = $.extend({
			name: 'result_search_category',
			limit: $config.length_post,
			search: undefined
		}, options)

		if(!options.search)
		{
			console.error('Error. No search defined!');
			return false;
		}
		$scope[options.name] = []

		var args = options.search.split(',')
		var data = []

		setTimeout(function(){

			$.each($scope.posts, function(a,b){
				var type = b.categories.map(function(res){return res.name});
				var isExist = [];
				$.each(type, function(c,d){
					isExist.push(args.indexOf(d) > -1? true : false);
				})
				if(isExist.indexOf(true) > -1)
				{
					if($scope[options.name].length < options.limit)
					{
						$scope[options.name].push(b);
					}
				}
			})
			$scope.$apply();			
		}, 1)
	}
})
.controller('post.opened', function($scope,$config, $posts, $routeParams, $blogconfig, $sce, F_Comment,F_Tools ){
	console.log($scope)
	$scope.comment = {}
	$scope.comment.comment_content = ''
	$posts.get('posts.id_post ='+$routeParams.id, function(res){
		$scope.post = res[0]
		$scope.title = $scope.post.title;
		$scope.comment.id_post = parseInt($scope.post.id_post);

		$scope.post.content = $("<textarea/>").html($scope.post.content).val()
		var $trusted = $sce.trustAsHtml($scope.post.content);
		$scope.post.trusted_content = $trusted;
		$posts.update_viewer($scope.post.id_post, parseInt($scope.post.counter_post) );
		$scope.$apply();
		$scope.init_ads();
		$('[xss] iframe').each(function(a,b){
			$(b).css({position:'inherit'})
		})
	})

	$scope.init_ads = function()
	{
		var adsshown = 0;
		var adslist = $blogconfig.shuffle_ads();
		var everyNp = Math.floor( $('[article-body]').children().length/adslist.length );
		var i = 1;
		$('[article-body]').children().each(function(){

			if(i == everyNp)
			{
				$(this).after(adslist.shift());
				i = 1;
			}else
			{
				i++;
			}

		})
	}

	$scope.submit_comment = function()
	{
		$scope.comment.id_comment = 0;
		F_Comment.submit_comment($scope.comment)
		.done(function(res){
			console.log(res)
			res = F_Tools.isJson(res)? JSON.parse(res): res;
			data.id_comment = res.id_comment;
			$scope.post.comments.push(data)
			F_Comment.hide_reply_comment_section()
		})
		.fail(function(res){
			console.log(res)
		})
	}
	$scope.submit_replying_comment = function(item)
	{
		var data = {
			comment_name: $scope.comment.comment_name,
			comment_email: $scope.comment.comment_email,
			id_post: $scope.comment.id_post,
			comment_content: $scope.comment.reply_comment_content,
			id_comment_reference: $scope.comment.id_comment,
		}
		F_Comment.submit_comment(data)
		.done(function(res){
			res = F_Tools.isJson(res)? JSON.parse(res): res;
			data.id_comment = res.id_comment;
			$scope.post.comments.push(data)
			$scope.comment.reply_comment_content = '';
			$scope.$apply();
		})
		.fail(function(res){
			console.log(res)
		})
	}

	$scope.parseCommentTimestamp = function(time)
	{
		return moment(time, 'YYYY-MM-DD HH:mm:ss').fromNow();
	}
	$scope.reply_comment = function(id_comment)
	{
		$scope.comment.id_comment = id_comment;
		F_Comment.show_reply_comment_section($routeParams.id, id_comment)
	}

	$scope.commentLoginAuth = function()
	{
		F_Comment.login(
			$scope.comment_components.credential,
			function(res){
            	F_Comment.comment_credential.set(res.credential)
            	$scope[F_Comment.components.scope_name].isLogin = true;
            	$scope.$apply();
			}
		)
	}
});
