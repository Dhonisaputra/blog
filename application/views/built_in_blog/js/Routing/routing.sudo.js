
window.mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'templates/sudo/sudo.home.html',
			controller: 'sudo.home'
		})
		.when('/new', {
			templateUrl: 'templates/sudo/sudo.owner.new.html',
			controller: 'sudo.owner.new'
		})
		.when('/preview/:ownerkey', {
			templateUrl: 'templates/sudo/sudo.owner.preview.html',
			controller: 'sudo.owner.preview'
		})
		.when('/login', {
			templateUrl: 'templates/sudo/sudo.login',
			controller: 'sudo.login'
		})
		.otherwise({
			redirectTo: '/home'
		});
});

