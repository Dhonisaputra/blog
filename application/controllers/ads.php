<?php
/**
* 
*/
class Ads extends CI_Controller
{
	
	function __construct()
	{
		parent::__construct();
	}

	public function auto_ads()
	{
		$post = $this->input->post();
		$auto_ads = $post['auto_ads'];
		$this->db->where(array('name' => 'auto_ads'));
		$this->db->update('ads_options', array('value' => $auto_ads));
	}

	public function shuffle_ads()
	{
		$post = $this->input->post();
		$shuffle_ads = $post['shuffle_ads'];
		$this->db->where(array('name' => 'shuffle_ads'));
		$this->db->update('ads_options', array('value' => $shuffle_ads));
	}
	public function get_options()
	{
		$data = $this->db->get('ads_options')->result_array();
		echo json_encode($data);
	}
	public function get_ads_components()
	{
		$data['options'] = $this->db->get('ads_options')->result_array();
		$data['list'] = $this->db->get('ads_list')->result_array();
		echo json_encode($data);

	}

	public function update_ads_length()
	{
		$post = $this->input->post();
		$shuffle_ads = $post['ads_length'];
		$this->db->where(array('name' => 'ads_length'));
		$this->db->update('ads_options', array('value' => $shuffle_ads));
	}

	public function add_new_ads()
	{
		$post = $this->input->post();
		$this->db->insert('ads_list', array(
				'ad_name' => $post['data']['ad_name'],
				'ad_url' => $post['data']['ad_url'],
				'ad_priority' => $post['data']['ad_priority'],
				'ad_max_shown' => $post['data']['ad_max_shown'],
				'ad_min_time_show' => $post['data']['ad_min_time_show'] == ''? $post['data']['ad_min_time_show'] : null,
				'ad_max_time_show' => $post['data']['ad_max_time_show'] == ''? $post['data']['ad_max_time_show'] : null,
			)
		);
	}

	public function remove_ads()
	{
		$post = $this->input->post();
		$this->db->delete('ads_list', $post['where']); 

	}
}