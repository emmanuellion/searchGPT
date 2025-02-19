document.addEventListener('DOMContentLoaded', () => {
	const apiKeyInput = document.getElementById('apiKey');
	const maxTokensInput = document.getElementById('maxTokens');
	const modelSelect = document.getElementById('modelSelect');
	const contextPromptInput = document.getElementById('contextPrompt');
	const saveBtn = document.getElementById('saveBtn');
	const statusEl = document.getElementById('status');

	chrome.storage.sync.get({
		apiKey: '',
		maxTokens: 150,
		contextPrompt: "Contexte : Je veux que m'explique à quoi correspond ce mot ou cette phrase ou bien réponds à cette question. Je ne veux pas que tu fasses de mises en forme du style markdown, fais des phrases courtes en moins de 150 token de l'api openai, réponds en français. Sujet : ",
		model: ''
	}, (items) => {
		apiKeyInput.value = items.apiKey;
		maxTokensInput.value = items.maxTokens;
		modelSelect.value = items.model;
		contextPromptInput.value = items.contextPrompt;
	});

	saveBtn.addEventListener('click', () => {
		const apiKey = apiKeyInput.value.trim();
		const maxTokens = parseInt(maxTokensInput.value, 10) || 150;
		const contextPrompt = contextPromptInput.value;
		const model = modelSelect.value;

		chrome.storage.sync.set({
			apiKey: apiKey,
			maxTokens: maxTokens,
			contextPrompt: contextPrompt,
			model: model
		}, () => {
			statusEl.textContent = 'Options enregistrées.';
			setTimeout(() => { statusEl.textContent = ''; }, 1500);
		});
	});
});
