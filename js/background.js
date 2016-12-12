var last_update={player1:null,player2:null};
var p1_button=null;
var p2_button=null;
var p1_center=document.createElement('center');
var p2_center=document.createElement('center');
var p1_div=document.createElement('div');
var p2_div=document.createElement('div');
var p1_link=document.createElement('a');
var p2_link=document.createElement('a');
p1_link.innerHTML='Link';
p2_link.innerHTML='Link';
var p1_text=document.createTextNode('');
var p2_text=document.createTextNode('');
init();
function init()
{
	p1_button=document.getElementById('player1');
	p2_button=document.getElementById('player2');
	if(!p1_button||!p2_button)
	{
		setTimeout(init,100);
		return;
	}
	p1_button.parentNode.appendChild(document.createElement('br'));
	p2_button.parentNode.appendChild(document.createElement('br'));
	p1_button.parentNode.appendChild(p1_center);
	p2_button.parentNode.appendChild(p2_center);
	p1_center.appendChild(p1_div);
	p2_center.appendChild(p2_div);
	p1_div.appendChild(p1_link);
	p2_div.appendChild(p2_link);
	p1_div.appendChild(p1_text);
	p2_div.appendChild(p2_text);
	setInterval(update,1000);
}
function update()
{
	var player1=p1_button.value;
	var player2=p2_button.value;
	if(player1!=last_update.player1||player2!=last_update.player2)
		xhr(player1,player2,function(data)
		{
			if(data&&data.fighters)
				for(var ii=0;ii<data.fighters.length;++ii)
				{
					var text_value=' (W:'+data.fighters[ii].wins+'/L:'+data.fighters[ii].losses+')';
					var link_value='';
					var url='https://salty.manly.parts/search/?fighter='+
						encodeURIComponent('\''+data.fighters[ii].fighter+'\'');
					if(data.fighters[ii].fighter==player1)
					{
						p1_text.nodeValue=text_value;
						p1_link.href=url;
					}
					else if(data.fighters[ii].fighter==player2)
					{
						p2_text.nodeValue=text_value;
						p2_link.href=url;
					}
				}
		});
}
function xhr(player1,player2,callback)
{
	var req={fighters:[]};
	if(player1)
		req.fighters.push('\''+player1+'\'');
	if(player2)
		req.fighters.push('\''+player2+'\'');
	if(req.fighters.length>0)
	{
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function()
		{
			if(this.readyState==4&&this.status==200)
				callback(JSON.parse(xhr.responseText));
		}
		xhr.open('POST','https://salty.manly.parts/',true);
		xhr.send(JSON.stringify(req));
	}
}