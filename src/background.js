// this isn't necessarily good practice; one should have a more sophisticated differentiation
// of these messages.
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  const grayIcon = msg.grayIcon;
  if (grayIcon === undefined) {
    return;
  }

  console.log(`Setting gray icon: ${grayIcon}`)
  await chrome.browserAction.setIcon({ path: grayIcon ? '/icons/gray_icon.png' : '/icons/icon128.png' });
  return true;
});