chrome.runtime.onInstalled.addListener(() => {
    console.log('URLify extension instalada');
  });
  
  chrome.action.onClicked.addListener((tab) => {
    console.log(`URL activa: ${tab.url}`);
  });