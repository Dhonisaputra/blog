<?php
/**
* 
*/
class Comment extends CI_Controller
{
	
	function __construct()
	{
		# code...
		parent::__construct();
		require_once(APPPATH.'libraries/profiling/Pengguna.php');
		$this->auth = new Pengguna;
		$this->separated_login = '***';
		$this->encrypted_key_A = 'login';
		$this->encrypted_key_B = 'credential';
	}

	public function submit_comment()
	{
		$data = $this->input->post();
		$user = $this->authority_login($data['credential']);
		$save = array(
				'comment_name' => @$user['comment_name'],
				'comment_email' => @$user['comment_email'],
				'id_post' => $data['data']['id_post'],
				'comment_content' => @$data['data']['comment_content'],
				'id_comment_reference' => isset($data['data']['id_comment'])? $data['data']['id_comment'] : 0,
			);
		$this->db->insert('comments', $save);
		$id_comment = $this->db->insert_id();
		echo json_encode(array('id_comment' => $id_comment));

	}

	public function login()
	{
		$data = $this->input->post();
		$encrypted = $data['data']['comment_name'].$this->separated_login.$data['data']['comment_email'];
		$hash = $this->auth->encrypt($encrypted, $this->encrypted_key_A, $this->encrypted_key_B, true);
		echo json_encode(array('credential' => $hash));
	}

	private function authority_login($hash)
	{
		$hash = $this->auth->decrypt($hash, $this->encrypted_key_A, $this->encrypted_key_B, true);
		if($hash['status_code'] == 200)
		{
			header('http/1.0 500 Error on cheching your login authority. please re-login to comment!');
		}
		$hash = explode($this->separated_login, $hash['decrypted_text']);
		return array('comment_name' => $hash[0], 'comment_email' => $hash[1]);
	}
}