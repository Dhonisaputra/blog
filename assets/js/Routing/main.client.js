

window.mainApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			title: 'Home',
			templateUrl: 'templates/home.html',
			controller: 'home_controller'
		})
		.when('/home', {
			title: 'Home',
			templateUrl: 'templates/home.html',
			controller: 'home_controller'
		})
		.when('/articles', {
			title: 'Articles',
			templateUrl: 'templates/home.html',
			controller: 'home_controller'
		})
		.when('/open/article/:id', {
			title: 'Open Article',
			templateUrl: 'templates/clients/post.opened.html',
			controller: 'post.opened'
		})
		.when('/error/404', {
			title: 'Error 404',
			templateUrl: 'templates/others/404.html'
		})
		.otherwise({
			redirectTo: 'error/404' 
		});
		// use the HTML5 History API
		// $locationProvider.html5Mode(true);
});

