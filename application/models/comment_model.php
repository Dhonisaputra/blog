<?php
/**
* 
*/
class Comment_model extends CI_Model
{
	
	public function __construct()
	{
		parent::__construct();
	}
	public function get_comment($select='*', $where)
	{
		$this->db->select($select);
		$this->db->from('comments');
		if(isset($where) && (is_array($where) || is_string($where)) )
		{
			$this->db->where($where);
		}
		return $this->db->get();
	}

	public function insert_comment($data)
	{
		$this->db->insert('comments', $data);
		return $this->db;
	}

	public function remove_comment($table, $where)
	{
		$this->db->delete('comments', $where); 
	}
}