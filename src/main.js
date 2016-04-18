'use strict';
(function() {
	var _opts;

	var init = function() {
		if (window.pymChild) {
			pymChild.onMessage('pong', setupGraphic);
			pymChild.sendMessage('ping', true);
		} else {
			setTimeout(init, 50);
		}
		
		setupResize();
	};	

	var setupResize = function() {
		window.addEventListener('resize', onResize, false);
		onResize();
	};

	window.onLoadData = function(data) {
		if(data && data.Posts) {
			var posts = getPosts(data.Posts);
			if (posts.length) {
				showPosts(posts);
			} else {
				console.error('error: no posts');
			}
		} else {
			console.error('error: no data');
		}
	};

	var setupGraphic = function(str) {
		_opts = JSON.parse(str);
		
		_opts.overline = _opts.overline || 'Latest Updates';
		_opts.hed = _opts.hed || 'Live from the newsroom';
		_opts.url = _opts.url || 'http://live.bostonglobe.com';
		_opts.button = _opts.button || 'LIVE coverage';
		_opts.max = _opts.max || 5;
		_opts.delay = _opts.delay * 1000 || 8000;
		_opts.chron = _opts.chron || false;
		_opts.truncate = _opts.truncate || 150;

		setText();

		var timestamp = new Date().getTime()
		loadJS(_opts.data + '?v='+ timestamp +'&callback=?');
	};

	var setText = function() {
		document.getElementsByClassName('post-overline')[0].innerHTML = _opts.overline;
		document.getElementsByClassName('post-hed')[0].innerHTML = _opts.hed;
		document.getElementsByClassName('post-button')[0].setAttribute('href',  _opts.url);
		document.getElementsByClassName('post-button')[0].innerHTML = _opts.button + ' &rarr;';
	};

	var getPosts = function(posts) {
		var filteredPosts = posts.filter(function(post) {
			return post.IsApproved === 1 && post.Type === 'TEXT';
		});

		var cleanPosts = filteredPosts.map(function(post) {
			return {
				id: post.Id,
				content: cleanContent(post.Content),
				name: post.Creator.Name
			};
		});

		var slicedPosts = cleanPosts.slice(0, _opts.max);

		if (_opts.chron) {
			return slicedPosts.reverse();
		}

		return slicedPosts;
	};

	var cleanContent = function(content) {
		console.log(content)
		content = content.replace(/<img[^>]*>/g, '');
		content = content.replace(/<br>/g, '');
		content = content.replace(/<br\/>/g, '');
		content = content.replace(/&#35;/g, '#')
		content = content.replace(/&amp;/g, '&');
		content = content.replace(/&/g, 'and');

		var div = document.createElement('div');
		div.innerHTML = content;

		var links = div.querySelectorAll('a');

		for (var i = 0; i < links.length; i++) {
			links[i].setAttribute('target', '_blank');
		}

		return div.innerHTML;
	};

	var showPosts = function(posts) {
		var container = document.getElementsByClassName('post-container')[0];
		var text = document.getElementsByClassName('post-text')[0];
		var user = document.getElementsByClassName('post-user')[0];
		var transitionEvent = whichTransitionEvent();
		var index = 0;
		var post;
		var delayTimeout;

		var delay = function() {
			clearTimeout(delayTimeout);
			delayTimeout = setTimeout(function() {
				index++;
				if(index >= posts.length) { index = 0; }
				
				next();
			}, _opts.delay);
		};

		var fadeOutComplete = function() {
			container.removeEventListener(transitionEvent, fadeOutComplete);
			text.innerHTML = post.content;
			user.innerHTML = '&mdash;' + post.name;
			container.classList.remove('hide');

			delay();
		};

		var next = function() {
			post = posts[index];
			container.addEventListener(transitionEvent, fadeOutComplete);
			container.classList.add('hide');
		};

		next();
	};

	var whichTransitionEvent = function(){
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};

		for (t in transitions){
			if (el.style[t] !== undefined){
				return transitions[t];
			}
		}
	};

	var truncate = function(str) {
		// TODO

		return str;
	};

	var onResize = function() {
		var minWidth = 150;
		var maxHeight = 180;
		var minHeight = 60;
		var factor = 28;
		var w = window.innerWidth;
		var h = Math.max(minHeight, maxHeight - (w / minWidth * factor));
		var el = document.querySelector('.post-container');
		el.style.height = h + 'px';
	};

	init();
})();
