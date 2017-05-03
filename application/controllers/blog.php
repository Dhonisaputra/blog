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
		// print_r($_POST);
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
		$this->load->helper('file');
		$this->load->helper('directory');
		$data = $this->input->post();
		if($data['type'] == 'reset')
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
	}
}
/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */