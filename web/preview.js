$(document).ready(function() {

	$.getJSON("json/program.json", function(data){
		
		//compile template
		var template = _.template($("#preview-template").html());

		//adding to DOM
		$("#preview-container").html(template({data: data}));

	});
});



