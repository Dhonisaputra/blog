

window.mainApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			title: 'Home',
			templateUrl: 'templates/cplusco_global_client/index.html',
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
		.when('/event', {
			title: 'Event',
			templateUrl: 'templates/clients/event/post.index.event.html',
			controller: 'controller.event.index'
		})
		.when('/open/article/:article_type/:id_article', {
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

