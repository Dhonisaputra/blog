<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Install extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('authentication');

	}

	public function login()
	{
		include(APPPATH.'config/server.php');
		$this->load->view('install/login.php', $server);
	}
	public function setting_database()
	{
		include(APPPATH.'config/server.php');
		$this->load->view('install/install.php', $server);
	}
	public function create_user()
	{
		$this->load->view('install/create_user.php');
	}

	public function process_save_settings_database()
	{
		$this->load->library('curl');
		include(APPPATH.'config/server.php');
		require_once(APPPATH.'libraries/profiling/Pengguna.php');
		$this->auth = new Pengguna;
		// $_POST = json_decode('{"hostname":"localhost","blog_key":"a8aDoFFBgYfuVPEx4kyeJe1KnZUi4qtx8NBtYcQhY.Mgb6Eo6MX8G","processing_server":"http:\/\/localhost\/projects\/blog\/built_in_blog","blog_server":"http:\/\/localhost\/projects\/blog\/built_in_blog","username":"root","password":"toor","database":"blog_1","remote_server":"http:\/\/localhost\/projects\/blog\/server_sudo\/","version":"1.0"}',true);
		$post = $this->input->post();				
		$this->db = $this->authentication->set_db($post);
		$connected = $this->db->initialize();
		
		if($connected)
		{
			$text = '<?php'."\n";
			$text .= '$server["remote_server"] = "'.$post["remote_server"].'";'."\n";
			$text .= '$server["processing_server"] = "'.$post["processing_server"].'";'."\n";
			$text .= '$server["server_url"] = "'.base_url().'";'."\n";
			
			$text .='$server["hostname"] = "'.$post['hostname'].'";'."\n";
			$text .='$server["username"] = "'.$post['username'].'";'."\n";
			$text .='$server["password"] = "'.$post['password'].'";'."\n";
			$text .='$server["database"] = "'.$post['database'].'";'."\n";
			$text .='$server["blog_key"] = "'.$post['blog_key'].'";'."\n";

			file_put_contents(BASEPATH.'certificate/tester.server.cert', json_encode($post));
			$text = $this->auth->encrypt(json_encode($post), '@cert', '@blog', true);
			file_put_contents(BASEPATH.'certificate/server.cert', $text);

			// $this->curl->simple_post('install/');
			$this->install_database();
			echo json_encode(array('code'=>200));
		}else
		{
			echo json_encode(array('code'=>500));
		}
	}

	public function install_database()
	{
		// Temporary variable, used to store current query
		$templine = '';
		// Read in entire file
		$lines = file(APPPATH.'config/default.sql');
		// Loop through each line
		foreach ($lines as $line)
		{
			// Skip it if it's a comment
			if (substr($line, 0, 2) == '--' || $line == '')
			    continue;

			// Add this line to the current segment
			$templine .= $line;
			// If it has a semicolon at the end, it's the end of the query
			if (substr(trim($line), -1, 1) == ';')
			{
			    // Perform the query
			    $this->db->query($templine) or print('Error performing query \'<strong>' . $templine . '\': ' . mysql_error() . '<br /><br />');
			    // Reset temp variable to empty
			    $templine = '';
			}
		}
		
	}

	public function done(){
		echo 'Installing done!';
	}

	public function facebook()
	{
		define('FACEBOOK_SDK_V4_SRC_DIR', APPPATH.'libraries/Facebook/src/Facebook/');
		require_once(APPPATH.'libraries/Facebook/src/Facebook/autoload.php');
		$fb = new Facebook\Facebook([
		 'app_id' => '1065750993495095',
		 'app_secret' => '176a0f6e0ce71e0b7a9b595a77cf1458',
		 'default_graph_version' => 'v2.9',
		]);

		/*$linkData = [
		 'link' => 'www.yoururl.com',
		 'message' => 'Your message here'
		];
		$pageAccessToken ='yournonexpiringtoken';

		try {
		  // Returns a `Facebook\FacebookResponse` object
		  $response = $fb->post('/me/feed', $linkData, '1065750993495095|176a0f6e0ce71e0b7a9b595a77cf1458');
		} catch(Facebook\Exceptions\FacebookResponseException $e) {
		  echo 'Graph returned an error: ' . $e->getMessage();
		  exit;
		} catch(Facebook\Exceptions\FacebookSDKException $e) {
		  echo 'Facebook SDK returned an error: ' . $e->getMessage();
		  exit;
		}

		$graphNode = $response->getGraphNode();

		echo 'Posted with id: ' . $graphNode['id'];*/

		$helper = $fb->getRedirectLoginHelper();

		$permissions = ['publish_action', 'user_posts', 'manage_pages', 'publish_pages']; // Optional permissions
		$loginUrl = $helper->getLoginUrl(base_url('install/facebook'), $permissions);

		echo '<a href="' . htmlspecialchars($loginUrl) . '">Log in with Facebook!</a>';
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */