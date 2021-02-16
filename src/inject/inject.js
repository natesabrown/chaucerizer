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
			console.log(`Got result: ${main_on}`);
			if (main_on) {
				runMainScript();
			} else {
				console.log('No running for the script!')
			}
		})
	}
	}, 10);
});

function runMainScript() {
	let content = getContentDiv();
	let paragraphs = getRelevantParagraphs(content);
	let modernEnglishStrings = removeAndGetStrings(paragraphs);
	let verses = getVerses(paragraphs);
	addClassToVerses(verses);
	addChildrenToVerses(verses, modernEnglishStrings);
}

const MAIN_DIV_NAME = 'field-item';

function getContentDiv() {
	let field_items = document.getElementsByClassName(MAIN_DIV_NAME);
	let item = field_items[0];
	let children = item.children;
	return children;
}

// here is where we need to provide more validity for the paragraphs
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

// removes the 'New English' from the paragraphs and returns
// what was removed
// horrible code, let's make this better.
function removeAndGetStrings(paragraphs) {
	let del_arr = []
	let ret_arr = []
	for (let paragraph of paragraphs) {
		let children = paragraph.getElementsByTagName('span');
		for (let i = 0; i < children.length; i++) {
			if (i % 2 == 1) {
				let element = children[i];
				let raw_text = element.textContent.trim();
				ret_arr.push(raw_text);
				del_arr.push(element)
			}
		}
		removeBrsFromParagraph(paragraph);		
	}
	for (let item of del_arr) {
		item.remove();
	}
	return ret_arr;
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

function getVerses(paragraphs) {
	let verses = []
	for (let paragraph of paragraphs) {
		let children = paragraph.getElementsByTagName('span');
		verses.push(...children)
	}
	return verses;
}

function addClassToVerses(verses) {
	const CLASS_NAME = 'verse';
	for (let verse of verses) {
		verse.classList.add(CLASS_NAME);
	}
}

function addChildrenToVerses(verses, englishStrings) {
	for (let verse of verses) {
		let modernEnglishString = englishStrings.shift();
		addChildToVerse(verse, modernEnglishString);
	}
}

function addChildToVerse(verse, text) {
	const CLASS_NAME = 'tooltip';
	let tooltip = document.createElement('span');
	tooltip.classList.add(CLASS_NAME);
	tooltip.innerHTML = text;
	verse.appendChild(tooltip);
}