<?php
/**
* 
*/
class Event extends CI_Controller
{
	
	function __construct()
	{
		# code...
		parent::__construct();
		require_once(APPPATH.'libraries/profiling/Pengguna.php');
		$this->auth = new Pengguna;
	}

	public function create_event()
	{
		$this->load->model('model_post');
		$this->load->model('files_model');

		$data = $this->input->post();
		$id_user = $this->session->userdata('id_user');
		$config['upload_path'] 		= 'locker/files/';
		$config['encrypt_name']		= TRUE;
		$config['allowed_types'] 	= '*';
		$response = $this->files_model->upload($config, $_FILES)[0];

		// Check the $_FILES array and save the file. Assign the correct path to a variable ($url).
		$url = base_url('locker/files/'.$response['file_name']);

		// save to article too~
		$this->model_post->insert_post(array(
				'id_user' 	=> $id_user,
				'title' 	=> $data['name'],
				'content' 	=> @$data['description'],
				'post_tag' 	=> @$data['keywords'],
				'post_status' => 'publish',
				'published_time' => date('Y-m-d H:i:s'),
				'article_type' => 'event',
			)
		);
		$id_article = $this->db->insert_id();
		$datasave = array(
			'event_start' => strtotime($data['start_date'].' '.$data['start_time']),
			'event_end' => strtotime($data['end_date'].' '.$data['end_time']),
			'event_photo' => $response['id_files'],
			'event_photo_url' => $url,
			'event_ticket_url' => @$data['ticket_url'],
			'event_created_by' => $id_user,
			'id_article' => $id_article
		);

		$datasave['event_location'] = $data['location'];
		
		if($data['use_latlng'] === 'true')
		{
			$datasave['event_location_lat'] = $data['lat'];
			$datasave['event_location_lng'] = $data['lng'];
		}

		
		$this->db->insert('events', $datasave);
	}

	public function update_event()
	{
		$this->load->model('model_post');
		$this->load->model('files_model');

		$data = $this->input->post();

		if(isset($_FILES) && count($_FILES) > 0)
		{
			$id_user = $this->session->userdata('id_user');
			$config['upload_path'] 		= 'locker/files/';
			$config['encrypt_name']		= TRUE;
			$config['allowed_types'] 	= '*';
			$response = $this->files_model->upload($config, $_FILES)[0];
			$url = base_url('locker/files/'.$response['file_name']);
		}

		// Check the $_FILES array and save the file. Assign the correct path to a variable ($url).
		$where = array('id_article' => $data['id_article']);

		// save to article too~
		$this->model_post->update_post(array(
				'title' 	=> $data['title'],
				'content' 	=> @$data['content'],
				'post_tag' 	=> @$data['post_tag'],
				'post_status' => $data['post_status'],
			), 
			$where
		);
		$id_article = $this->db->insert_id();
		$datasave = array(
			'event_photo' => isset($response['id_files'])? $response['id_files'] : $data['event_photo'],
			'event_photo_url' => isset($url)? $url : $data['event_photo_url'],
			'event_ticket_url' => @$data['ticket_url'],
		);
		$datasave['event_location'] = $data['location'];

		
		if(isset($data['use_latlng']) && $data['use_latlng'] === 'true')
		{
			$datasave['event_location_lat'] = $data['lat'];
			$datasave['event_location_lng'] = $data['lng'];
		}

		
		$this->db->where($where);
		$this->db->update('events', $datasave);
	}

	public function remove_event()
	{
		$this->load->model('model_post');
		$post = $this->input->post();

		$this->db->delete('articles', $post['where']); 
		$this->db->delete('events', $post['where']); 
	}
}