'use strict';
(function() {
	// global variables
	var _messages = [];
	var _curIndex = 0;
	var _delayTime;
	var _delayTimeout;
	var _max;
	var _chron;

	var $messageText = $('.message-text');
	var $messageContainer = $('.message-container');
	var $messageUser = $('.message-user');
	var $messageHed = $('.message-hed');
	var $messageOverline = $('.message-overline');
	var $messageUrl = $('.message-url');


	// called once on page load
	var init = function() {
		if (pymChild) {
			pymChild.onMessage('pong', setupGraphic);
			pymChild.sendMessage('ping', true);
		} else {
			setTimeout(init, 50);
		}
	};	

	// graphic code
	window.loadScribbleliveData = function(data) {
		if(data && data.Posts) {
			_messages = getMessages(data.Posts);
			
			if(_messages.length) {
				showMessage();
			} else {
				console.log('error: no messages');
			}
		} else {
			console.log('error: no data');
		}
	};

	var setupGraphic = function(str) {
		var data = JSON.parse(str);

		$.getJSON(data.jsonp);
		
		var overline = data.overline || 'Latest Updates';
		var hed = data.hed || 'Live from the newsroom';
		var url = data.url || 'http://live.bostonglobe.com';
		_max = data.max || 5;
		_delayTime = data.delay * 1000 || 10000;
		_chron = data.cron || false;

		$messageOverline.text(overline);
		$messageHed.text(hed);
		$messageUrl.attr('href', url); 
	};


	var getMessages = function(posts) {

		var messages = [];

		posts = posts.slice(0, _max);

		var dir = _chron ? 1 : -1;
		var start = _chron ? 0 : posts.length - 1;

		for(var i = 0; i < posts.length; i++) {

			var index = start + i * dir;
			
			var post = posts[index];
			
			//only get approved posts of the right "type"
			if(post.IsApproved === 1 && post.Type === 'TEXT') {
				// clean message extracting links and crap that scribblelive kindly adds
				var content = cleanContent(post.Content);
					
				var name = post.Creator.Name;

				var message = {
					content: content,
					name: name,
					id: post.Id,
					date: post.Created
				};

				messages.push(message);
			}
		}

		return messages;
	};

	var cleanContent = function(content) {
		var el = $('<div></div>');
		el.html(content);

		// el.find('img').each(function() {
			// $(this).remove();
		// });
		el.find('br').each(function() {
			$(this).remove();
		});

		el.find('a').each(function(e,i) {
			var text = $(this).text().toLowerCase();
			if(isImage(text)) {
				$(this).remove();
			}
		});

		var justText = el.html();
		justText = justText.replace(/&amp;/g, '&');
		justText = justText.replace(/&/g, 'and');

		return justText;
	};

	var showMessage = function() {
		var message = _messages[_curIndex];

		$messageContainer.fadeOut(function() {
			$messageText.html(message.content);
			$messageUser.html('&mdash;' + message.name);
			$messageContainer.fadeIn();
			timeoutAndNext();
		});
	};

	var timeoutAndNext = function() {
		clearTimeout(_delayTimeout);
		_delayTimeout = setTimeout(function() {
			_curIndex++;
			if(_curIndex >= _messages.length) {
				_curIndex = 0;
			}
			showMessage();
		}, _delayTime);
	};

	var isImage = function(text) {
		return (text.indexOf('.jpg')  > -1) || (text.indexOf('.png')  > -1) || (text.indexOf('.gif')  > -1) || (text.indexOf('http')  > -1);
	};

	// run code
	init();
})();
