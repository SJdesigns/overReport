<?php
$json = json_decode(file_get_contents('https://ow-api.com/v1/stats/pc/eu/SJalvarez99-2930/complete'),1);

echo '<pre>';
print_r($json);
echo '<pre>';

?>

<script src="js/jquery-3.2.1.min.js"></script>
<script type="text/javascript">
	$(function() {
		$.get('https://ow-api.com/v1/stats/pc/eu/SJalvarez99-2930/complete').done(function( data ) {
			console.log(JSON.parse(data));
			localStorage.setItem('ow',data);
		});
	});
</script>
<div id="json"></div>