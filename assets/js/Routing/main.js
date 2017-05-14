
window.mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			title: 'Dashboard',
			templateUrl: 'templates/administrator/article/post.dashboard.html',
			controller: 'administrator_dashboard',
			need_login: true
		})
		.when('/login', {
			title: 'Login',
			templateUrl: 'templates/administrator/administrator.login.html',
			controller: 'controller.login',
			need_login: false
		})
		.when('/signup', {
			title: 'signup',
			templateUrl: 'templates/administrator/administrator.signup.html',
			controller: 'controller.users.signup',
			need_login: false
		})
		.when('/home', {
			title: 'Dashboard',
			templateUrl: 'templates/administrator/article/post.dashboard.html',
			controller: 'administrator_dashboard',
			need_login: true
		})
		.when('/articles', {
			title: 'Articles',
			templateUrl: 'templates/administrator/article/post.dashboard.html',
			controller: 'administrator_dashboard',
			need_login: true
		})
		.when('/articles/new', {
			title: 'Create new Articles',
			templateUrl: 'templates/administrator/article/post.new.html',
			controller: 'controller.post.new',
			need_login: true,
		})
		.when('/articles/edit', {
			title: 'Edit Articles',
			templateUrl: 'templates/administrator/article/post.edit.html',
			controller: 'controller.post.edit',
			need_login: true
		})
		.when('/event', {
			title: 'Event Dashboard',
			templateUrl: 'templates/administrator/event/post.index.event.html',
			controller: 'controller.post.index.event',
			need_login: true,
		})
		.when('/event/new', {
			title: 'Create new Event',
			templateUrl: 'templates/administrator/event/post.new.event.html',
			controller: 'controller.post.new.event',
			need_login: true,
		})
		.when('/articles/edit/:event_type/:id_article', {
			title: 'Edit event',
			templateUrl: 'templates/administrator/event/post.edit.event.html',
			controller: 'controller.post.edit.event',
			need_login: true,
		})
		.when('/ads', {
			title: 'Ads Dashboard',
			templateUrl: 'templates/administrator/iklan/index.iklan.html',
			controller: 'controller.index.ads',
			need_login: true
		})
		.when('/ads/new', {
			title: 'Ads new ads',
			templateUrl: 'new_ads.html',
			controller: 'controller.index.ads',
			need_login: true
		})
		.when('/page/new', {
			title: 'Add new page',
			templateUrl: 'templates/administrator/pages/index.page.new.html',
			controller: 'controller.index.pages.new',
			need_login: true
		})
		/*.when('/user', {
			title: 'User Dashboard',
			templateUrl: 'templates/administrator/iklan/index.users.html',
			controller: 'controller.index.user',
			need_login: true
		})
		.when('/user/new', {
			title: 'User Dashboard',
			templateUrl: 'templates/administrator/iklan/index.users.html',
			controller: 'controller.index.user',
			need_login: true
		})*/
		.when('/logout', {
			templateUrl: 'templates/administrator/administrator.logout.html',
			controller: 'controller.administrator.logout',
			need_login: true
		})
		.when('/error/404', {
			title: 'Error 404',
			templateUrl: 'templates/others/404.html'
		})
		.otherwise({
			redirectTo: function(){
				var cookies = Cookies.getJSON('user');
				if(cookies)
				{
					return (cookies.app_auth)? '/dashboard/post' : '/login'
				}else
				{
					return '/error/404'
				}
				
			}
		});
});

