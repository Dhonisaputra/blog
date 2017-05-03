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
.controller('post.opened', function($scope,$config, $posts, $routeParams, $blogconfig, $sce ){
	$posts.get('posts.id_post ='+$routeParams.id, function(res){
		$scope.post = res[0]
		$scope.title = $scope.post.title
		$scope.post.trusted_content = $sce.trustAsHtml($scope.post.content);
		// console.log($scope.post)
		$posts.update_viewer($scope.post.id_post, parseInt($scope.post.counter_post) );
		$scope.$apply();
		$scope.init_ads();
	})

	$scope.init_ads = function()
	{
		var adsshown = 0;
		var adslist = $blogconfig.shuffle_ads();
		var everyNp = Math.floor( $('#list-post .body').children().length/adslist.length );
		var i = 1;
		$('#list-post .body').children().each(function(){

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
});
