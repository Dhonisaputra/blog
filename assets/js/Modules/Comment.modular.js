function Comment()
{

}

Comment.prototype = 
{
	getComment: function(url, data)
	{
		return $.post(url, data)
	},

	
}

window.mainApp
.factory('F_Comment', function(F_Config){
   
    var $this = {}
    var recordsObject = {
    	records: [],

    }
    $this.records = {}

    $this.setNewCommentSection = function(name)
    {

    }
    // get comment


    return $this;
})