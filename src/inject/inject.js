chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
		chrome.storage.sync.get(['main_on'], result => {
			let main_on = result.main_on;
			// console.log(`Got result: ${main_on}`);
			if (main_on) {
				addTooltips();
			} else {
				console.log('No running for the script!')
			}
		})
	}
	}, 10);
});

function getContentDiv() {
	const MAIN_DIV_NAME = 'field-item';
	let field_items = document.getElementsByClassName(MAIN_DIV_NAME);
	let item = field_items[0];
	let children = item.children;
	return children;
}

function getRelevantParagraphs(paragraphs) {
	const FIRST_IND = 2;
	let SECOND_IND;
	for (let i = FIRST_IND; i < paragraphs.length; ++i) {
		let par = paragraphs[i]
		let par_text = par.textContent;
		// handle edge case
		if (!par_text || (par_text == " ")) {
			// console.log('Found last paragraph!')
			SECOND_IND = i;
			break;
		}
	}
	let return_arr = []
	// add to return array
	for (let i = FIRST_IND; i < SECOND_IND; ++i) {
		return_arr.push(paragraphs[i]);
	}
	return return_arr;
}

// adds Modern English tooltips
function addTooltips() {
	const content = getContentDiv();
	const paragraphs = getRelevantParagraphs(content);

	for (let paragraph of paragraphs) {
		let spans = paragraph.querySelectorAll('span');

		for (let i = 0; i < spans.length; i++) {
			if (i % 2 == 1) {
				let element = spans[i];
				let raw_text = element.textContent.trim();

				let previousElement = spans[i - 1];
				previousElement.classList.add('verse');

				addTooltipToVerse(previousElement, raw_text);

				element.remove();
			}
		}

		// remove the <br> elements from the paragraph for cosmetic purposes
		removeBrsFromParagraph(paragraph);		
	}
}

// removes break child elements from paragraph according
// to a pattern
function removeBrsFromParagraph(paragraph) {
	let br_del_arr = []
	let brs = paragraph.getElementsByTagName('br');
	let i = 0;
	for (let item of brs) {
		if (i % 2 == 1) {
			br_del_arr.push(item);
		}
		i++;
		// br_del_arr.push(item);
	}
	for (let item of br_del_arr) {
		item.remove();
	}
}

// adds tooltip construct to verse
function addTooltipToVerse(verse, text) {
	// console.log(verse);
	const CLASS_NAME = 'tooltip';
	let tooltip = document.createElement('span');
	tooltip.classList.add(CLASS_NAME);
	tooltip.innerHTML = text;
	verse.appendChild(tooltip);
}