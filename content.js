if (!window.__gptExtensionInjected) {
	window.__gptExtensionInjected = true;

	let lastMouseX = 0;
	let lastMouseY = 0;

	document.addEventListener("mousemove", (e) => {
		lastMouseX = e.clientX;
		lastMouseY = e.clientY;
	});

	function createSpinner() {
		const spinner = document.createElement("div");
		spinner.setAttribute("role", "status");
		spinner.setAttribute("aria-label", "Chargement");
		spinner.style.position = "fixed";
		spinner.style.left = lastMouseX + 10 + "px";
		spinner.style.top = lastMouseY + 10 + "px";
		spinner.style.width = "24px";
		spinner.style.height = "24px";
		spinner.style.border = "4px solid #ccc";
		spinner.style.borderTop = "4px solid #007bff";
		spinner.style.borderRadius = "50%";
		spinner.style.animation = "spin 1s linear infinite";
		spinner.style.zIndex = "10000";
		return spinner;
	}

	const style = document.createElement('style');
	style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
	document.head.appendChild(style);

	let spinnerElement = null;

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.action === "startLoading") {
			document.body.style.cursor = "wait";
			spinnerElement = createSpinner();
			document.body.appendChild(spinnerElement);
			sendResponse();
		} else if (message.action === "showPopup") {
			document.body.style.cursor = "default";
			if (spinnerElement) {
				spinnerElement.remove();
				spinnerElement = null;
			}
			const popup = document.createElement("div");
			popup.setAttribute("role", "alert");
			popup.style.position = "fixed";
			popup.style.backgroundColor = "transparent";
			popup.style.zIndex = "10000";
			popup.style.fontSize = "20px";
			popup.style.transition = "transform 0.3s ease, opacity 0.3s ease";

			if (message.status === "success") {
				popup.textContent = "✅";
				navigator.clipboard.writeText(message.reply)
				.then(() => console.log("Texte copié"))
				.catch(err => console.error("Erreur de copie :", err));
			} else {
				popup.textContent = "❌ " + (message.error || "Erreur lors de la requête.");
			}

			popup.style.left = lastMouseX + 10 + "px";
			popup.style.top = lastMouseY + 10 + "px";
			popup.style.transform = "translateY(-10px)";
			popup.style.opacity = "0";

			const updatePopupPosition = (event) => {
				popup.style.left = event.clientX + 10 + "px";
				popup.style.top = event.clientY + 10 + "px";
			};
			document.addEventListener("mousemove", updatePopupPosition);

			document.body.appendChild(popup);
			void popup.offsetWidth;

			requestAnimationFrame(() => {
				popup.style.transform = "translateY(0)";
				popup.style.opacity = "1";
			});
			setTimeout(() => {
				popup.style.transform = "translateY(-10px)";
				popup.style.opacity = "0";
				setTimeout(() => {
					document.removeEventListener("mousemove", updatePopupPosition);
					popup.remove();
				}, 300);
			}, 3000);
			sendResponse();
		}
	});
}
