window.mainApp
.controller('home_controller', function($scope) {	
	$scope.message = "Click on the hyper link to view the students list.";
})

.controller('administrator_dashboard', function($scope, $config, $posts, $pagination){

	$scope.article = [];
	$scope.initialize_posts = function()
	{
		$posts.get({}, function(res){
			$posts.set_data(res)
			$scope.article = res;
			$scope.$apply();
		});
	}
	$scope.initialize_posts()
	$scope.post_with_tag = function(categories)
	{

	}

	$scope.remove_articles = function(article)
	{
		$posts.delete({id_post: article.id_post}, function(res){
			$scope.initialize_posts();
			$pagination.set_records($scope.article);
			$pagination.refresh();
		})

	}
	$scope.open_article = function(article)
	{
		return $config.web_url+'/#/open/article/'+article.id_post;

	}

})
.controller('controller.post.new', function($scope, $config, $posts, $routeParams){
	if($routeParams.post)
	{

	}
	var config = {
		codeSnippet_theme: 'monokai_sublime',
		uploadUrl: $config.base_url('files/upload_file'),
		filebrowserUploadUrl: $config.base_url('files/ckeditor_upload_file'),
		filebrowserBrowseUrl: '../templates/administrator/files/files.browser.html',

	};
	$('[name="content"]').ckeditor(config).on( 'fileUploadResponse', function( evt ) {
	    // Prevent the default response handler.
	    evt.stop();

	    // Get XHR and response.
	    var data = evt.data,
	        xhr = data.fileLoader.xhr,
	        response = xhr.responseText.split( '|' );

	} );
	$scope.newpost = {}
	$scope.components = {categories:[], tagSelected: [] };
	$scope.submited_new_post = function() 
	{
		$scope.schedule_publish 	= $('#set_schedule_date').val()+' '+$('#set_schedule_time').val()+':00';
		$scope.newpost.content 		= $('[name="content"]').val();
		$scope.newpost.categories 	= $('.checkbox .category:checked').serializeArray().map(function(res){return res.value});
		$scope.newpost.tag 			= $scope.components.tagSelected.join(',');
		$scope.newpost.post_status 	= $scope.post_status
		$scope.newpost.schedule_publish 	= $scope.schedule_publish
		
		var data = {
			categories 			: $scope.newpost.categories,
			content 			: $scope.newpost.content,
			tag 				: $scope.newpost.tag,
			title 				: $scope.newpost.title? $scope.newpost.title : '',
			post_status 		: $scope.post_status,
			schedule_publish 	: $scope.schedule_publish,
			set_schedule 		: $scope.set_schedule,
		}
		console.log(data)

		if(data.title == '')
		{
			alert('title cannot be empty');
			return false;
		}
		if(!data.post_status || data.post_status == '')
		{
			alert('Post status cannot be empty');
			return false;	
		}

		$posts.insert(data, function(res){
			$scope.components.id_post = res.insertId;
			var redirect = '#/articles/edit?id='+res.insertId;
			window.location.href = redirect;
		})

	}

	$scope.get_categories = function()
	{
		$posts.components.get_categories(function(res){
			
			angular.forEach(res, function(value, key){
				this.push(value)
			}, $scope.components.categories)
			$scope.$apply();
		})
	}

	$scope.add_categories = function()
	{
		var data = {
			name: $scope.components.new_category,
		}
		$posts.components.add_category(data, function(res){
			data.id_category = res.insertId;
			$scope.components.categories.push(data)
			$scope.components.new_category = '';
			$scope.$apply();
		})
	}
	
	$scope.search_trend = function()
	{
		$posts.components.search_trend($scope.newpost.tag, function(res){
			$scope.components.tagsResult = res.relatedQueries.default.rankedList[1].rankedKeyword.filter(function(res){
				var isExist = $scope.components.tagSelected.indexOf(res.query);
				if(isExist < 0)
				{
					return res;
				}
			})
			$scope.$apply();
		})
	}

	$scope.select_all_tag = function()
	{
		var isCheck = $('.select_all_tag').prop('checked');
		isCheck = isCheck?true:false;
		$('[name="tag[]"]').prop('checked',isCheck)
	}
	$scope.add_selected_tag = function()
	{
		$scope.components.tagSelected = $('[name="tag[]"]:checked').serializeArray().map(function(res){return res.value})
		$('[name="tag[]"]:checked').parents('.checkbox').remove()
		$scope.$apply();

	}
	$scope.removeTagSelected = function(index)
	{
		$('#tag-selected-'+index).remove();
		$scope.components.tagSelected.splice(index, 1);
	}

	$scope.add_tag = function()
	{
		var isExist = $scope.components.tagSelected.indexOf($scope.newpost.tag);
		if(isExist < 0)
		{
			$scope.components.tagSelected.push($scope.newpost.tag);
			$scope.newpost.tag = '';
		}else
		{
			alert('Tag has been exist');
		}

	}

})
.controller('controller.post.edit', function($scope, $config, $posts, $routeParams){
	if(!$routeParams.id)
	{
		window.location.href = '#/articles';
		return false;
	}
	$scope.datapost = {}
	$scope.components = {categories:[], newTag: []}

	$scope.update_post = function()
	{
		var data = {
			update: {
				article: {
					title: $scope.datapost.title,
					content: $('[name="content"]').val(),
					post_status: $scope.datapost.post_status,
					post_tag: $scope.datapost.tag_item.join(','),
				},
				categories: $('.checkbox .category').serializeArray().map(function(res){return res.value}),
			},
			where: {
				id_post: $scope.datapost.id_post	
			}

		}

		$posts.update(data, function(res){
			Snackbar.show('Post telah diupdate');
		})
	}

	$scope.get_categories = function()
	{
		var Def = $.Deferred();
		$posts.components.get_categories(function(res){
			Def.resolve(res);
			angular.forEach(res, function(value, key){
				this.push(value)
			}, $scope.components.categories)
			$scope.$apply();
		})
		return $.when(Def.promise())
	}
	$scope.add_categories = function()
	{
		var data = {
			name: $scope.components.new_category,
		}
		$posts.components.add_category(data, function(res){
			// console.log(res)
			data.id_category = res.insertId;
			$scope.components.categories.push(data)
			$scope.components.new_category = '';
			$scope.$apply();
		})
	}

	$scope.get_post = function()
	{
		$posts.get('posts.id_post ='+ $routeParams.id, function(res){
			$posts.set_data(res)
			var post = res[0]
			$scope.datapost = post;
			// console.log($scope.datapost)

			// config CKEDITOR
			var config = {
				codeSnippet_theme: 'monokai_sublime',
				uploadUrl: $config.base_url('files/upload_file'),
				filebrowserUploadUrl: $config.base_url('files/ckeditor_upload_file'),
				filebrowserBrowseUrl: '../templates/administrator/files/files.browser.html',
			};
			$('[name="content"]').ckeditor(config);
			
			// get categories
			$scope.get_categories()
			.done(function(res){
				$.each(post.categories_id, function(a,b){
					$('.components--category-'+b).prop('checked',true);
				})
			})
			$('[name="post_status"][value="'+post.post_status+'"]').prop('checked',true);
			$scope.$apply();


		});
	}

	$scope.search_trend = function()
	{
		$posts.components.search_trend($scope.components.newTag, function(res){
			var result = res.relatedQueries.default.rankedList[1].rankedKeyword;
				// console.log(result, $scope.tag_item); return false;
			$scope.components.tagsResult = result.filter(function(res){
				var isExist = $scope.datapost.tag_item.indexOf(res.query);
				if(isExist < 0)
				{
					return res;
				}
			})
			$scope.$apply();
		})
	}

	$scope.select_all_tag = function()
	{
		var isCheck = $('.select_all_tag').prop('checked');
		isCheck = isCheck?true:false;
		$('[name="tag[]"]').prop('checked',isCheck)
	}
	$scope.add_selected_tag = function()
	{
		var tagSelected = $('[name="tag[]"]:checked').serializeArray().map(function(res){return res.value})
		angular.forEach(tagSelected, function(value, key){
			this.push(value)
		}, $scope.datapost.tag_item)
		$('[name="tag[]"]:checked').parents('.checkbox').remove()
		$scope.$apply();

	}
	$scope.removeTagSelected = function(index)
	{
		$('#tag-selected-'+index).remove();
		$scope.datapost.tag_item.splice(index, 1);
	}
	
})

.controller('controller.administrator.logout', function($scope, $owner, $posts, $routeParams){
	$owner.reset_credential()
	
	window.location.reload();

})
.controller('controller.login', function($scope, $config, $posts, $routeParams, $authorize, global_configuration){
	$scope.login_components = {}
	if($authorize.is_login())
	{
		window.location.href = '#/home';
	}
	$scope.alert = {}

	$scope.login = function()
	{
		// console.log($scope.login_components)
		var res = !$config.double_server ? $.post($config.server_url('users/login?dblServer=0'), $scope.login_components) : window.node.send('owner/login', $scope.login_components);
		res.done(function(res){
			res = !$config.double_server ? JSON.parse(res) : res;
			switch(res.code)
			{
				case 200:
					$authorize.set_auth_data(res);
					window.location.href = '#/home';
					
					break;
				case 404: 
					$scope.alert.login = res.message;
					$scope.$apply();
					break;
				case 500: 
					$scope.alert.login = res.message;
					$scope.$apply();
					break;
			}
		})
	}
})
.controller('controller.index.ads', function($scope, $config, $sce, $ads){
	$scope.update_auto_ads = function()
	{
		if($scope.auto_ads == 1)
		{
			$ads.toggling_auto_ads({auto_ads: 1}, function(){
				Snackbar.show('Auto ads telah di aktifkan');
			})
		}else
		{
			$ads.toggling_auto_ads({auto_ads: 0}, function(){
				Snackbar.show('Auto ads telah di nonaktifkan');
			})
		}
	}

	$scope.update_shuffle_ads = function()
	{
		var isCheck = $('#shuffle-ads').is(':checked')? 1 : 0;
		if(isCheck == 1)
		{
			$ads.toggling_shuffle_ads({shuffle_ads: 1}, function(){
				Snackbar.show('Shuffle ads telah di aktifkan');
			})
		}else
		{
			$ads.toggling_shuffle_ads({shuffle_ads: 0}, function(){
				Snackbar.show('Shuffle ads telah di nonaktifkan');
			})
		}
	}

	$scope.is_auto_ads = function()
	{

		$scope.auto_ads = $ads.configuration.auto_ads? $ads.configuration.auto_ads : 0
		// $scope.$apply();
	}
});
