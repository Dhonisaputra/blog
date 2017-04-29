<?php
/**
* 
*/
class Built_in_blog extends CI_Controller
{
	
	function __construct()
	{
		# code...
		parent::__construct();
	}

	public function index()
	{
		$this->load->view('built_in_blog/index.html');
	}

	public function index()
	{
		$this->load->view('built_in_blog/administrator.html');
	}
}