chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "search-with-gpt",
		title: "Search with GPT",
		contexts: ["selection"]
	});
});


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === "search-with-gpt" && info.selectionText) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['content.js']
		}, async () => {
			if (chrome.runtime.lastError) {
				console.error("Erreur d'injection du content script:", chrome.runtime.lastError.message);
				return;
			}
			chrome.tabs.sendMessage(tab.id, { action: "startLoading" }, () => {
				if (chrome.runtime.lastError) {
					console.error("Erreur envoi startLoading:", chrome.runtime.lastError.message);
				}
			});

			const selectedText = info.selectionText;
			chrome.storage.sync.get({
				apiKey: '',
				maxTokens: 150,
				contextPrompt: "Contexte : Je veux que m'explique à quoi correspond ce mot ou cette phrase ou bien réponds à cette question. Je ne veux pas que tu fasses de mises en forme du style markdown, fais des phrases courtes en moins de 150 token de l'api openai, réponds en français. Sujet : ",
				model: "gpt-3.5-turbo"
			}, async (items) => {
				const apiKey = items.apiKey;
				const maxTokens = items.maxTokens;
				const contextPrompt = items.contextPrompt;
				const model = items.model;
				const prompt = contextPrompt + selectedText;

				async function fetchWithRetry(url, options, retries = 1) {
					try {
						return await fetch(url, options);
					} catch (error) {
						if (retries > 0) {
							console.warn("Nouvelle tentative...", error);
							return await fetchWithRetry(url, options, retries - 1);
						} else {
							throw error;
						}
					}
				}

				try {
					const response = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + apiKey
						},
						body: JSON.stringify({
							model: model,
							messages: [{ role: "user", content: prompt }],
							max_tokens: maxTokens
						})
					});
					const data = await response.json();
					console.log("Réponse API:", data);
					if (response.ok && data.choices && data.choices.length > 0) {
						const reply = data.choices[0].message.content;
						chrome.tabs.sendMessage(tab.id, { action: "showPopup", status: "success", reply: reply }, () => {
							if (chrome.runtime.lastError) {
								console.error("Erreur envoi showPopup:", chrome.runtime.lastError.message);
							}
						});
					} else {
						const errorMsg = data.error ? data.error.message : "Réponse non valide de l'API";
						chrome.tabs.sendMessage(tab.id, { action: "showPopup", status: "error", error: errorMsg }, () => {
							if (chrome.runtime.lastError) {
								console.error("Erreur envoi showPopup:", chrome.runtime.lastError.message);
							}
						});
					}
				} catch (error) {
					chrome.tabs.sendMessage(tab.id, { action: "showPopup", status: "error", error: error.message }, () => {
						if (chrome.runtime.lastError) {
							console.error("Erreur envoi showPopup:", chrome.runtime.lastError.message);
						}
					});
				}
			});
		});
	}
});
