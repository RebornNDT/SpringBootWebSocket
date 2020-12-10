 
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('#connecting');
 
var stompClient = null;
var username = null;

$(document).ready(function(){
	$('#action_menu_btn').click(function(){
		$('.action_menu').toggle();
	});
		});
 
function connect() {
    username = document.querySelector('#username').innerText.trim();
      
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
 
    stompClient.connect({}, onConnected, onError);
}
 
// Connect to WebSocket Server.
connect();
 
function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/publicChatRoom', onMessageReceived);
 
    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )
 
    connectingElement.classList.add('hidden');
}
 
 
function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}
 
 
function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}
 
 
function onMessageReceived(payload) {
	
    var message = JSON.parse(payload.body);
 
    var messageElement = document.createElement('li');
 
    
    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' đã tham gia!';
        userJoin = '';
        userJoin += '<div><small>' + message.content + '</small></div><br/>';
        $("#messageArea").append(userJoin);
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' đã rời đi!';
        userLeft = '';
        userLeft += '<div><small>' + message.content + '</small></div><br/>';
        $("#messageArea").append(userLeft);
    } else {

    	var html ='';
    	var now = new Date();
    	var outStr = now.getHours()+':'+now.getMinutes();
    	html += '<div  class="d-flex justify-content-start mb-4">';
		html +=	'<div class="img_cont_msg">';
		html += '<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">';
		html += '</div>';
		html += '<div class="msg_cotainer">' + message.sender + ' :  ' + message.content;
		html += '<span class="msg_time">' + outStr + '</span>';
		html += '</div></div>';
		
		 $('#messageArea').append(html);
    }
}

function tai_lai_trang(){
    location.reload();
}

messageForm.addEventListener('submit', sendMessage, true);