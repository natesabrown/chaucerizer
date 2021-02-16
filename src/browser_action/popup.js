// define what needs to occur when popup pops up
window.onload = () => {
  // allow toggling of the on-off button
  document.getElementById('main_button').addEventListener('click', () => {
    toggleMainOn();
  });

  document.getElementById('book').addEventListener('click', openChaucerWebsite)

  addStatusText();

  loadFonts();

  loadButtonClass();
}

function toggleMainOn() {
  chrome.storage.sync.get(['main_on'], result => {
    let value = result.main_on;
    let new_value = !value;
    chrome.storage.sync.set({ 'main_on': new_value }, () => {
      // after has been toggled
      conditionallyReloadTab(); // reload tab if on Chaucer website
      changeButtonClass(new_value); // change button class to reflect status
      changeStatusText(new_value); // change 'on' or 'off' sign
    })
  })
}

// reloads tab if on Chaucer
function conditionallyReloadTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const CHAUCER_LINK = 'chaucer.fas.harvard.edu';
    let currentTab = tabs[0];
    let currentURL = currentTab.url;
    if (currentURL.includes(CHAUCER_LINK)) {
      chrome.tabs.reload(tabs[0].id);
    } 
  });
}

function changeButtonClass(new_value) {
  let buttonRef = document.getElementById('main_button');
  if (!new_value) { // if turned off
    buttonRef.classList.add('button_off');
  } else {
    buttonRef.classList.remove('button_off');
  }
}

function loadButtonClass() {
  chrome.storage.sync.get(['main_on'], result => {
    let value = result.main_on;
    changeButtonClass(value);
  })
}

function addStatusText() {
  let statusRef = document.getElementById('status_text');
  chrome.storage.sync.get(['main_on'], result => {
    let text = "";
    let main_on = result.main_on;
    if (main_on) {
      text = 'On';
    } else {
      text = 'Off';
    }
    statusRef.innerText = text;
  })
}

function changeStatusText(status) {
  let statusRef = document.getElementById('status_text');
  if (status) {
    statusRef.innerText = 'On';
  } else {
    statusRef.innerText = 'Off';
  }
}

function loadFonts() {
  let font = new FontFace("Medieval", "url('./fonts/MedievalSharp-Regular.ttf')");
  document.fonts.add(font);
}

function openChaucerWebsite() {
  const CHAUCER_URL = 'https://chaucer.fas.harvard.edu/pages/text-and-translations'
  chrome.tabs.create({ url: CHAUCER_URL });
}