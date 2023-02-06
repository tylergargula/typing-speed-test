

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Forms.
		var $form = $('form');

		// Auto-resizing textareas.
			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');

				// Fix.
					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});

	// Menu.
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});


	        let inputText = document.getElementById("input_text");
            let resultDiv = document.getElementById("results");
            let testText = document.getElementsByClassName("rand-words")[0].innerText;
            let firstKeyPressed = false;
            let timeStamps = [];
            let userTexts = [];





            function captureKeyDown(event){
                let timestamp = (Date.now() / 1000);

                inputText.addEventListener("input", function() {

                    if (!firstKeyPressed && !event.repeat) {
                    firstKeyPressed = true;

                    console.log("First key pressed at:", timestamp);
                }
                userTexts.push(inputText.value);
                lastItem = userTexts[userTexts.length - 1]
                console.log(userTexts[userTexts.length - 1]);
                captureInputValue(inputText.value, timestamp);
                });
            }


            function captureInputValue(value, timestamp) {
                timeStamps.push(timestamp)
                let userArray = value.split(" ");
                let testArray = testText.split(" ");
                const newTimestamp = (Date.now() / 1000)

                timeElapsed = (timeStamps[timeStamps.length - 1] - timeStamps[0]).toFixed(2);
                if (userArray.length == testArray.length){
                console.log(timeElapsed);
                sendData(timeElapsed, userArray, testArray);

                }
            };

            function sendData(time, userArray, testArray) {
                finalText = userTexts[userTexts.length - 1];
                console.log(finalText)
                console.log("data sent: " + time + " " + finalText + " " + testArray)
                const xhrPost = new XMLHttpRequest();
                const data = {
                    time: time,
                    user: userArray,
                    test: testArray
                };
                xhrPost.open("POST", "/receive_data", true);
                xhrPost.setRequestHeader("Content-Type", "application/json");
                xhrPost.onload = function() {
                    if (this.status === 200) {
                    try {
                    const response = JSON.parse(this.responseText);
                    console.log(this.responseText);
                    console.log(response);
                    document.getElementById("results").innerHTML = response.values;
                    } catch(error) {
                    console.error(error);
                    }
                  }
                };
                console.log(JSON.stringify(data));
                xhrPost.send(JSON.stringify(data));



            };

            inputText.addEventListener("keydown", captureKeyDown);




})(jQuery);