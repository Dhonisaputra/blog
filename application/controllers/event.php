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

		$this->db->trans_begin();
		$response = $this->files_model->upload($config, $_FILES);
		$photo = $response['event_photo'][0];
		// Check the $_FILES array and save the file. Assign the correct path to a variable ($url).
		$url = base_url('locker/files/'.$photo['file_name']);
		
		if(isset($response['event_attachment']))
		{
			$attach = array_map(function($res){
				return $res['id_files'];
			}, $response['event_attachment']);
			$attach = implode(',', $attach);
		}


		// ------------------------------------------------------------------------------------------
		// save to article too~
		$this->model_post->insert_post(array(
				'id_user' 	=> $id_user,
				'title' 	=> $data['name'],
				'content' 	=> @$data['description'],
				'post_tag' 	=> @$data['keywords'],
				'post_status' => 'publish',
				'published_time' => date('Y-m-d H:i:s'),
				'article_type' => 'event',
				'article_attachment' => @$attach,
			)
		);
		$id_article = $this->db->insert_id();
		$article_hash 	= $this->auth->encrypt($id_article, 'hashing', 'articles', true);
		$this->model_post->update_post(
			array(
				'article_hash' => $article_hash,
				), 
			array(
				'id_article' => $id_article
				)
		);
		// ------------------------------------------------------------------------------------------
		
		// ------------------------------------------------------------------------------------------
		// save to event~
		$datasave = array(
			'event_start' => strtotime($data['start_date'].' '.$data['start_time']),
			'event_end' => isset($data['end_date']) && $data['end_date'] !== '' && !empty($data['end_date']) && !is_null($data['end_date'])? strtotime($data['end_date'].' '.$data['end_time']) : null,
			'event_photo' => @$photo['id_files'],
			'event_photo_url' => @$url,
			'event_ticket_url' => @$data['ticket_url'],
			'event_created_by' => $id_user,
			'id_article' => $id_article,
			'event_permalink' => base_url('#/open/article/event').'/'.$id_article,
			'event_attachment' => @$attach,
		);

		$datasave['event_location'] = $data['location'];
		
		if($data['use_latlng'] === 'true')
		{
			$datasave['event_location_lat'] = $data['lat'];
			$datasave['event_location_lng'] = $data['lng'];
		}
		$this->db->insert('events', $datasave);
		$id_event = $this->db->insert_id();
		// ------------------------------------------------------------------------------------------

		
		
		// ------------------------------------------------------------------------------------------
		// save external source~
		if(isset($data['external_source']))
		{
			
			$reference = json_decode($data['external_source'],true);
			if(count($reference) > 0)
			{
				foreach ($reference as $key => $value) {
					unset($reference[$key]['$$hashKey']);
					$reference[$key]['id_event'] = $id_event;
				}
				$this->db->insert_batch('event_reference_link', $reference);
			}
		}
		// ------------------------------------------------------------------------------------------

		// Transaction
		if ($this->db->trans_status() === FALSE)
		{
		    $this->db->trans_rollback();
		}
		else
		{
		    $this->db->trans_commit();
		}


	}

	public function update_event()
	{
		$this->load->model('model_post');
		$this->load->model('files_model');

		$data = $this->input->post();
		$data['external_source'] = json_decode($data['external_source'],true);
		$data['existed_attachment'] = json_decode($data['existed_attachment'],true);

		// Upload
		// ----------------------------------------------------------------------------------------
		$attach = array();
		$existed_attach = array();
		if(isset($_FILES) && count($_FILES) > 0)
		{
			$id_user = $this->session->userdata('id_user');
			$config['upload_path'] 		= 'locker/files/';
			$config['encrypt_name']		= TRUE;
			$config['allowed_types'] 	= '*';
			$response = $this->files_model->upload($config, $_FILES);
			if(isset($response['event_photo']))
			{
				$url = base_url('locker/files/'.$response['event_photo'][0]['file_name']);
			}
			if(isset($response['event_attachment']))
			{

				$attach = array_map(function($res){
					return $res['id_files'];
				}, $response['event_attachment']);
				
			}
		}
		if( isset($data['existed_attachment']) && 
			!empty($data['existed_attachment']) &&
			is_array($data['existed_attachment']) &&
			count($data['existed_attachment']) > 0
		)
		{
			$existed_attach = array_map(function($res){
				return $res['id_files'];
			}, $data['existed_attachment']);
		}

		$attach = array_merge($existed_attach, $attach);
		$attach = implode(',', $attach);
		
		// ----------------------------------------------------------------------------------------

		// Check the $_FILES array and save the file. Assign the correct path to a variable ($url).
		$where = array('id_article' => $data['id_article']);

		// save to article too~
		$this->model_post->update_post(array(
				'title' 	=> $data['title'],
				'content' 	=> @$data['content'],
				'post_tag' 	=> @$data['post_tag'],
				'post_status' => $data['post_status'],
				'article_attachment' => @$attach,
			), 
			$where
		);
		$id_article = $this->db->insert_id();
		$datasave = array(
			'event_photo' => isset($response['id_files'])? $response['id_files'] : $data['event_photo'],
			'event_photo_url' => isset($url)? $url : $data['event_photo_url'],
			'event_ticket_url' => @$data['ticket_url'],
			'event_start' => strtotime($data['event_start_date'].' '.$data['event_start_time']),
			'event_end' => isset($data['event_end_date']) && $data['event_end_date'] !== '' && !empty($data['event_end_date']) && !is_null($data['event_end_date'])? strtotime($data['event_end_date'].' '.$data['event_end_time']) : null,

		);
		$datasave['event_location'] = $data['location'];

		
		if(isset($data['use_latlng']) && $data['use_latlng'] === 'true')
		{
			$datasave['event_location_lat'] = $data['lat'];
			$datasave['event_location_lng'] = $data['lng'];
		}

		$this->db->where($where);
		$this->db->update('events', $datasave);
		
		$this->db->delete('event_reference_link', array('id_event' => $data['id_event'])); 

		foreach ($data['external_source'] as $key => $value) {
			unset($data['external_source'][$key]['$$hashKey']);
			$data['external_source'][$key]['id_event'] =  $data['id_event'];
		}
		$this->db->insert_batch('event_reference_link', $data['external_source']);

		
	}

	public function remove_event()
	{
		$this->load->model('model_post');
		$post = $this->input->post();

		$this->db->delete('articles', $post['where']); 
		$this->db->delete('events', $post['where']); 
	}
	public function remove_event_attachment()
	{
		$this->load->model('files_model');
		$this->load->model('model_post');
		$post = $this->input->post();

		$this->files_model->remove_files($post['where']);
	}

}