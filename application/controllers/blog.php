<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Blog extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('authentication');

	}

	public function ping()
	{
		echo json_encode($_SERVER);
	}

	public function configuration()
	{
		include(APPPATH.'config/server.php');
		
		$this->load->library('curl');
		
		$data = $this->curl->simple_post($server['remote_server'].'blog/component_json_client?using_auth=0', array('token' => $server['blog_key']) );
		echo $data;
		// echo json_encode($server);

	}

	public function uninstall()
	{
		$post = $this->input->post();
		if(!isset($post['token']))
		{
			show_error('Insufficient parameters!', 500, 'Please check the documentation!');
		}
		include(APPPATH.'config/server.php');
		$this->load->helper('file');
		$this->load->helper('directory');
		$this->load->library('curl');
		// check token in server_sudo
		$dataauth['key'] = $server['blog_key'];
		$dataauth['token'] = $post['token'];
		$web = $post['server'].'authentication/token';
		$isAuth = $this->curl->simple_post($web, $dataauth);
		$isAuth = json_decode($isAuth,true);
		if($isAuth['status_code'] == 200)
		{

			if($post['type'] == 'reset')
			{
				unlink(BASEPATH.'certificate/server.cert');
			}else
			{
				// scan FC path
				$dir = directory_map(FCPATH,1);
				foreach ($dir as $key => $value) {
					// read is directory
					delete_files($value, TRUE);
				}
				foreach ($dir as $key => $value) {
					// read is directory
					unlink($value);
				}
			}
		}else
		{
			echo json_encode(array('code'=>500, 'message' => 'Token Mismatch!'));
		}
	}
}
/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */