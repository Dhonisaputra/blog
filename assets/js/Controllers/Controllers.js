window.mainApp
.controller('home_controller', function($scope) {	
	$scope.message = "Click on the hyper link to view the students list.";
})

.controller('administrator_dashboard', function($scope, $config, $posts, $pagination, F_Config){

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
		$posts.delete({id_article: article.id_article}, function(res){
			$scope.initialize_posts();
			$pagination.set_records($scope.article);
			$pagination.refresh();
		})

	}
	$scope.open_article = function(article)
	{
		return $config.blog_server+'#/open/article/'+article.id_article;

	}
})
.controller('controller.post.new', function($scope, $config, $posts, $routeParams, F_Config){
	if($routeParams.post)
	{

	}
	var config = {
		codeSnippet_theme: 'monokai_sublime',
		uploadUrl: F_Config.server_url('files/upload_file'),
		filebrowserUploadUrl: F_Config.server_url('files/ckeditor_upload_file'),
		filebrowserBrowseUrl: 'templates/administrator/files/files.browser.html',
	};
	$('[name="content"]').ckeditor(config).on( 'fileUploadResponse', function( evt ) {
	    // Prevent the default response handler.
	    evt.stop();

	    // Get XHR and response.
	    var data = evt.data,
	        xhr = data.fileLoader.xhr,
	        response = xhr.responseText.split('|');
	});
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
			$scope.components.id_article = res.insertId;
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
.controller('controller.post.edit', function($scope, $config, $posts, $routeParams, F_Config){
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
				id_article: $scope.datapost.id_article	
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
		$posts.get('articles.id_article ='+ $routeParams.id, function(res){
			$posts.set_data(res)
			var post = res[0]
			$scope.datapost = post;

			// karena ckeditor menyimpan embed menjadi htmlspecial_character, jadi gunakan $("<textarea/>").html($scope.datapost.content).val() untuk menjadikannya html tag standard
			$scope.datapost.content = $("<textarea/>").html($scope.datapost.content).val()
			// console.log($scope.datapost)

			// config CKEDITOR
			var config = {
				codeSnippet_theme: 'monokai_sublime',
				uploadUrl: F_Config.server_url('files/upload_file'),
				filebrowserUploadUrl: F_Config.server_url('files/ckeditor_upload_file'),
				filebrowserBrowseUrl: 'templates/administrator/files/files.browser.html',
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
// event
.controller('controller.post.new.event', function($scope, F_Config, $location){
	$scope.event_new = {}
	$scope.ext_source = []
	$scope.ext_attachment = []
	$scope.source = '';

	$scope.ckeditor_event = {
		codeSnippet_theme: 'monokai_sublime',
		uploadUrl: F_Config.server_url('files/upload_file'),
		filebrowserUploadUrl: F_Config.server_url('files/ckeditor_upload_file'),
		filebrowserBrowseUrl: 'templates/administrator/files/files.browser.html',
	};

	$('#event-upload-photo').on('change', function(event){
		var ui = $(this)
		$.Upload( ui )
		.done(function(res){
			// tulis data file uploaded
			$.Upload.read_image(ui[0])
			.done(function(resPrev){
				$scope.event_preview_photo = resPrev.target.result
				$scope.$apply();
			})

			// reset input type file
			ui.val('');
		})
	})
	$('#event-upload-attachment').on('change', function(event){
		var ui = $(this)
		$.Upload( ui, {name:'attach'} )
		.done(function(res){
			// tulis data file uploaded
			$scope.ext_attachment.push(res[0]);
			$scope.$apply()

			// reset input type file
			ui.val('');
		})
	})

	$('.event_time:nth(0)').datetimepicker({
	  datepicker:false,
	  format:'H:i',
	  step: 15,
	  formatTime: 'H:i',
	  minTime: 0,
	  onShow:function( ct ){
		   this.setOptions({
		   		maxTime: $('.event_time:nth(1)').val()? $('.event_time:nth(1)').val():false
		   })
	  	},
	});
	$('.event_time:nth(1)').datetimepicker({
	  datepicker:false,
	  format:'H:i',
	  step: 15,
	  formatTime: 'H:i',
	  onShow:function( ct ){
		   this.setOptions({
		   		minTime: $('.event_time:nth(0)').val()? $('.event_time:nth(0)').val().toString():0
		   })
	  	},
	});
	$('.event_date:nth(0)').datetimepicker({
	  	timepicker:false,
	  	format:'m/d/Y',
	  	formatDate: 'm/d/Y',
	  	onShow:function( ct ){
		   this.setOptions({
		   		maxDate: $('.event_date:nth(1)').val()? $('.event_date:nth(1)').val():false
		   })
	  	},
	});
	$('.event_date:nth(1)').datetimepicker({
	  	timepicker:false,
	  	format:'m/d/Y',
	  	formatDate: 'm/d/Y',
	  	onShow:function( ct ){
		   this.setOptions({
		   		minDate: $('.event_date:nth(0)').val()? $('.event_date:nth(0)').val():false
		   })
	  	},
	});

	$scope.create_event = function()
	{
		$scope.event_new.description = $scope.ckeditor['ckeditor_content'].val()
		$scope.event_new.external_source = $scope.ext_source
		$.Upload.submit({
			url: F_Config.server_url('event/create_event'),
			data: $scope.event_new
		})
		.done(function(res){
			Snackbar.show('Event has been created!');
			window.location.href ='#/event'
		})
		.fail(function(res){
			console.log(res)
		})
	}
	$scope.tambah_external_reference = function()
	{
		if($scope.source_label && $scope.source_link)
		{
			$scope.ext_source.push({label:$scope.source_label, reference: $scope.source_link});
			$scope.source_label = ''
			$scope.source_link = ''
		}
	}
	$scope.remove_external_reference = function(index)
	{
		removeArray($scope.ext_source, index)
	}
	$scope.remove_external_attachment = function(item, index)
	{
		removeArray($scope.ext_attachment, index)
		$.Upload.remove('event_attachment', item.key)
	}
})
.controller('controller.post.index.event', function($scope, F_Event, F_Config){
	$scope.remove_event = function(item)
	{
		swal({
		  title: "Are you sure?",
		  text: "You will not be able to recover this event!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes, delete it!",
		  closeOnConfirm: false
		},
		function(){
			$.post(F_Config.server_url('event/remove_event'), {where: {id_article: item.id_article}})
			.done(function(res){
				var index = $scope.article_event.map(function(res){return res.id_article}).indexOf(item.id_article)
				removeArray($scope.article_event, index);
				$scope.$apply();
		  		swal("Deleted!", "Event has successfully deleted.", "success");
			})
			.fail(function(res){
				console.log(res)
			})
		});

	}
})
.controller('controller.post.edit.event', function($scope, F_Event, F_Config){
	$scope.start_date = ''
	$scope.end_date = ''
	$scope.start_time = ''
	$scope.end_time = ''
	$scope.event_new = {}
	$scope.ext_source = []
	$scope.ext_attachment = []
	$scope.source = '';

	$('#event-upload-photo').on('change', function(event){
		var ui = $(this)
		$.Upload( ui )
		.done(function(res){
			// tulis data file uploaded
			$.Upload.read_image(ui[0])
			.done(function(resPrev){
				console.log(res, resPrev)
				$scope.event_preview_photo = resPrev.target.result
				$scope.$apply();
			})

			// reset input type file
			ui.val('');
		})
	})
	$('#event-upload-attachment').on('change', function(event){
		var ui = $(this)
		$.Upload( ui )
		.done(function(res){
			// tulis data file uploaded
			$scope.ext_attachment.push(res[0]);
			$scope.$apply()

			// reset input type file
			ui.val('');
		})
	})

	$('.event_time:nth(0)').datetimepicker({
	  datepicker:false,
	  format:'H:i',
	  step: 15,
	  formatTime: 'H:i',
	  minTime: 0,
	  onShow:function( ct ){
		   this.setOptions({
		   		maxTime: $('.event_time:nth(1)').val()? $('.event_time:nth(1)').val():false
		   })
	  	},
	});
	$('.event_time:nth(1)').datetimepicker({
	  datepicker:false,
	  format:'H:i',
	  step: 15,
	  formatTime: 'H:i',
	  onShow:function( ct ){
		   this.setOptions({
		   		minTime: $('.event_time:nth(0)').val()? $('.event_time:nth(0)').val().toString():0
		   })
	  	},
	});
	$('.event_date:nth(0)').datetimepicker({
	  	timepicker:false,
	  	format:'m/d/Y',
	  	formatDate: 'm/d/Y',
	  	onShow:function( ct ){
		   this.setOptions({
		   		maxDate: $('.event_date:nth(1)').val()? $('.event_date:nth(1)').val():false
		   })
	  	},
	});
	$('.event_date:nth(1)').datetimepicker({
	  	timepicker:false,
	  	format:'m/d/Y',
	  	formatDate: 'm/d/Y',
	  	onShow:function( ct ){
		   this.setOptions({
		   		minDate: $('.event_date:nth(0)').val()? $('.event_date:nth(0)').val():false
		   })
	  	},
	});

	$scope.ckeditor_event = {
		codeSnippet_theme: 'monokai_sublime',
		uploadUrl: F_Config.server_url('files/upload_file'),
		filebrowserUploadUrl: F_Config.server_url('files/ckeditor_upload_file'),
		filebrowserBrowseUrl: 'templates/administrator/files/files.browser.html',
	};

	$scope.update_event = function()
	{
		var data = {
			id_article 	: $scope.event_edit.id_article,
			title 		: $scope.event_edit.title,
			content 	: $scope.ckeditor['ckeditor_content'].val(),
			location 	: $scope.event_edit.related.event.event_location,
			id_event 	: $scope.event_edit.related.event.id_event,
			event_photo_url 	: $scope.event_edit.related.event.event_photo_url,
			event_photo 	: $scope.event_edit.related.event.event_photo,
			lat 		: $scope.event_edit.related.event.event_location_lat,
			lng 		: $scope.event_edit.related.event.event_location_lng,
			ticket_url 	: $scope.event_edit.related.event.event_ticket_url,
			post_tag 	: $scope.event_edit.post_tag,
			use_latlng 	: $scope.event_edit.use_latlng,
			event_start_date : $('.event_date:nth(0)').val(),
			event_start_time : $('.event_time:nth(0)').val(),
			event_end_date : $('.event_date:nth(1)').val(),
			event_end_time : $('.event_time:nth(1)').val(),
			post_status : 'publish',
		}
		data.external_source = $scope.event_edit.related.event.reference_link

		console.log(data, $scope)
		var sendData;
		sendData = $.Upload.submit({
			url: F_Config.server_url('event/update_event'),
			data: data
		})
		sendData.done(function(res){
			console.log(res)
			swal('Success', 'Event updated', 'success');
		})
		.fail(function(res){
			swal('Error', 'Event not updated', 'error');
			console.log(res)
		})
	}
	$scope.tambah_external_reference = function()
	{
		if($scope.source_label && $scope.source_link)
		{
			$scope.event_edit.related.event.reference_link.push({label:$scope.source_label, reference: $scope.source_link});
			$scope.source_label = ''
			$scope.source_link = ''
		}
	}

	$scope.remove_external_reference = function(index)
	{
		removeArray($scope.ext_source, index)
	}
	$scope.remove_external_attachment = function(item, index)
	{
		removeArray($scope.ext_attachment, index)
		$.Upload.remove('event_attachment', item.key)
	}
})
.controller('controller.administrator.logout', function($scope, $owner, $posts, $routeParams, F_Config){
    $.post(F_Config.server_url('users/logout'))
    .done(function(res){
		$owner.reset_credential()
		window.location.reload();
    })
    .fail(function(res){
    	console.log(res);
    })
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
.controller('controller.users.signup', function($scope){
	$scope.signup_name = ''
	$scope.signup_email = ''
	$scope.signup_password = ''
	$scope.signup_check_password = ''
	$scope.error_password = ''

	$scope.processing_signup = function()
	{
		if($scope.signup_check_password === $scope.signup_password)
		{
			$scope.error_password = 0;
		}else
		{
			$scope.error_password = 1;
		}
		var data = 
		{
			username: $scope.signup_name,
			email: $scope.signup_email,
			password: $scope.signup_password,
		}
	console.log(data, $scope)
	}
})
.controller('controller.index.ads', function($scope, $config, $sce, $ads){
	$scope.ads = {}
	$scope.ads.list = []
	$scope.new_ads = {}
	$scope.new_ads.ad_name = '';
	$scope.new_ads.ad_url = '';
	$scope.new_ads.ad_priority = 1;
	$scope.new_ads.ad_max_shown = null;
	$scope.new_ads.ad_min_time_show = null;
	$scope.new_ads.ad_max_time_show = null;

	$ads.get_components(function(conf, list){
		$scope.ads_configuration = conf;
		$scope.ad_list = list;
		$scope.$apply();
	});

	$scope.update_auto_ads = function()
	{
		if($scope.ads_configuration.auto_ads == 1)
		{
			$ads.toggling_auto_ads({auto_ads: 1}, function(res){
				console.log(res);
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

	$scope.update_ads_length = function()
	{

		$ads.update_ads_length($scope.ads_configuration.ads_length, function(){
			Snackbar.show('Ads length that will shown in page has been updated!');
		}, function(){
			alert('Error when updating ads length');
		})
	}
	$scope.remove_ads = function(item)
	{
		$ads.remove_ads({where:{id_ad: item.id_ad}}, function(){
			Snackbar.show('Ad has been removed!');
			$ads.get_components(function(conf, list){
				$scope.ad_list = list;
				$scope.$apply();
			});

		}, function(){
			alert('Error when updating ads length');
		})
	}

	$scope.add_new_ads = function()
	{
		$ads.add_new_ads(
			{data: $scope.new_ads}, 
			function(res){
				console.log(res)
				$('#form_new_ads')[0].reset()
			},
			function(res){
				console.log(res)
			}
		)
	} 
});
