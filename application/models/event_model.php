<?php
/**
* 
*/
class Event_model extends CI_Model
{
	
	public function __construct()
	{
		parent::__construct();
		$this->tablename = 'events';
	}
	public function get_event($select='*', $where)
	{
		$this->db->select($select);
		$this->db->from($this->tablename);
		if(isset($where) && (is_array($where) || is_string($where)) )
		{
			$this->db->where($where);
		}
		return $this->db->get();
	}

	public function insert_event($data)
	{
		$this->db->insert($this->tablename, $data);
		return $this->db;
	}

	public function remove_event($table, $where)
	{
		$this->db->delete($this->tablename, $where); 
	}
}