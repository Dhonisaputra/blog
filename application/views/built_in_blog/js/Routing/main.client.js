

window.mainApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
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
			title: '',
			templateUrl: 'templates/clients/post.opened.html',
			controller: 'post.opened'
		})
		.otherwise({
			redirectTo: 'home' 
		});
		// use the HTML5 History API
		// $locationProvider.html5Mode(true);
});

