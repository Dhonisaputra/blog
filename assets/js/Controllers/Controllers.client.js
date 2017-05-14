window.mainApp
.controller('home_controller', function($scope,$config, $posts) {	
	// console.log($config.base_url('posts/get_post')); return false;
	
	$scope.club_slide_params = {
		slidesToShow: 5,
		slidesToScroll: 5,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: false,   
		dots: true,
		infinite: true,
		// speed: 1000,
		// fade: true,
		cssEase: 'linear',
		pauseOnHover:false,
		responsive: [
		{
			breakpoint: 1025,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
				infinite: true,
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}]
	}

	$scope.event_slick_params = {
		slidesToShow: 4,
	    slidesToScroll: 4,
	    arrows: false,
	    infinite: false,
	    dots: true,
	  	responsive: [
	      {
	        breakpoint: 1280,
	        settings: {
	          slidesToShow: 4,
	          slidesToScroll: 4,
	        }
	      },
	      {
	        breakpoint: 600,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 2
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1
	        }
	      }]
	}
	$scope.event_slick_socialfeed = {
		slidesToShow: 4,
	    slidesToScroll: 4,
	    arrows: false,
	    dots:true,
	    infinite: false,
	  	responsive: [
	      {
	        breakpoint: 1280,
	        settings: {
	          slidesToShow: 3,
	          slidesToScroll: 3,
	        }
	      },
	      {
	        breakpoint: 600,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 2
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1
	        }
	      }
	      // You can unslick at a given breakpoint now by adding:
	      // settings: "unslick"
	      // instead of a settings object
	    ]
	}

	var socialfeed_fb_event = {
		facebook:{
	        accounts: ['@redelephantaus'],  //Array: Specify a list of accounts from which to pull wall posts
	        limit: 15,                                   //Integer: max number of posts to load
	        access_token: '1519286481659615|f107fae6b7e7e763dace587c6685d9a6',  //String: "APP_ID|APP_SECRET"
	        overwrite_fields: true,
	        fields: {
	        	posts: {
	        		parameters: ['comments, permalink_url, full_picture','id','from','name','message','created_time','story','description','link'],
	        		limit: 15
	        	}
	        },
	    },

        // GENERAL SETTINGS,
        length:50, //Integer: For posts with text longer than this length, show an ellipsis.
        callback: function(data) // fire function when all data completely collected
        {
        	$scope.socialfeed_fb_event = data;
        	$scope.$apply();
        	setTimeout(function(){
        		$('#slick_socialfeed').slick($scope.event_slick_socialfeed)
        	})
        },
    }

    $.fn.socialfeed(socialfeed_fb_event)


})
.controller('controller.event.index', function($scope,$config, $posts) {
	
})

.controller('post.opened', function($scope,$config, $posts, $routeParams, $blogconfig, $sce, F_Comment,F_Tools ){
	$scope.params = $routeParams;

	$scope.comment = {}
	$scope.comment.comment_content = '';

	/*$posts.get('posts.id_post ='+$routeParams.id, function(res){
		$scope.post = res[0]
		$scope.title = $scope.post.title;
		$scope.comment.id_post = parseInt($scope.post.id_post);

		$scope.post.content = $("<textarea/>").html($scope.post.content).val()
		var $trusted = $sce.trustAsHtml($scope.post.content);
		$scope.post.trusted_content = $trusted;
		// $scope.post.comments = F_Tools.sort_comment($scope.post.comments, '');
		$posts.update_viewer($scope.post.id_post, parseInt($scope.post.counter_post) );
		$scope.$apply();
		$scope.init_ads();
		$('[xss] iframe').each(function(a,b){
			$(b).css({position:'inherit'})
		})
	});*/

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
			id_post: $scope.comment.id_post,
			comment_content: F_Comment.get_comment_content(),
			id_comment_reference: F_Comment.get_comment_id(),
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
	$scope.parseTimeToMiliseconds = function(time)
	{
		console.log(time, moment(time, 'YYYY-MM-DD HH:mm:ss').unix())
		return moment(time, 'YYYY-MM-DD HH:mm:ss').unix()
	}
	$scope.reply_comment = function(id_comment)
	{
		$scope.comment.id_comment = id_comment;
		F_Comment.show_reply_comment_section($routeParams.id, id_comment)
	}

	$scope.commentLoginAuth = function()
	{
		F_Comment.login(
			F_Comment.fnHelper.credential_input,
			function(res){
            	F_Comment.comment_credential.set(res.credential)
            	$scope.$apply();
			}
		)
	}

	$scope.openReplyComment = function(id_post, id_comment)
	{
		console.log($scope)
		F_Comment.show_reply_comment_section(id_post, id_comment)
	}

	$scope.filteringCommentOfComment = function(items, id_comment)
	{
		console.log($scope)
		var data = items.filter(function(res){
			return res.id_comment_reference == id_comment;
		})
		return data;
	}

	$scope.CommentLogout = function()
	{
		F_Comment.comment_credential.logout();
	}
});
