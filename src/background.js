chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const grayIcon = msg.grayIcon;
  console.log(`Setting gray icon: ${grayIcon}`)
  chrome.browserAction.setIcon({ path: grayIcon ? '/icons/gray_icon.png' : '/icons/icon128.png' });
});