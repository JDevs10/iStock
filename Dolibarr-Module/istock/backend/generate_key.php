<?php

class GenerateKey {
	private $num_segments = 5;
	private $segment_chars = 5;
	private $elements = 'abcdefghijklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	private $license_string = '';

	function __construct(){
		
	}
	
	/**
	* Generate a License Key.
	* Optional Suffix can be an integer or valid IPv4, either of which is converted to Base36 equivalent
	* If Suffix is neither Numeric or IPv4, the string itself is appended
	*
	* @param   string  $suffix Append this to generated Key.
	* @return  string
	*/
	public function makeKey(){
		// Build License String
		for ($i = 0; $i < $this->num_segments; $i++) {
			$segment = '';
			for ($j = 0; $j < $this->segment_chars; $j++) {
				$segment .= $this->elements[rand(0, strlen($this->elements)-1)];
			}
			$this->license_string .= $segment;
			if ($i < ($this->num_segments - 1)) {
				$this->license_string .= '-';
			}
		}
	}
	
	public function getKey(){
		return $this->license_string;
	}
}
?>