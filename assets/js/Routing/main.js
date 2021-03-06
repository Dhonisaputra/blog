
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

