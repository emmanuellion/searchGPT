# SearchGPT Extension

This extension allows sending selected text to ChatGPT via a context menu, displaying an animated popup with the answer, and automatically copying the answer to the clipboard.

## Features

- **Context Menu Integration**: When text is selected and you right-click, the option "Search with GPT" appears and sends the text to the OpenAI API.
- **Animated Popup Response**: Displays a slide-in/slide-out popup near the cursor with the result, accompanied by a spinner during loading.
- **Customizable Settings**: Configure your API key, maximum tokens (default `150`), a context prompt, and choose the model. The model list is dynamically loaded from the OpenAI API once a valid API key is provided.
- **Accessibility**: Includes ARIA attributes and keyboard navigation support.
- **Internationalization**: The interface is available in French.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/emmanuellion/searchGPT.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" (top right).

4. Click on "Load unpacked" and select the project directory.

## Project Structure

```plaintext
searchGPT/
   ├── background.js              - Service worker for background processing
   ├── content.js                 - Script injected into web pages
   ├── manifest.json              - Extension configuration file
   └── options/
      ├── options.html           - Popup configuration UI (styled with Tailwind)
      ├── options.js             - Handles settings storage and dynamic model loading
      └── tailwind.min.js        - Local Tailwind CSS script
```

## Usage

1. **Contextual Search**:  
   Select text on any webpage, right-click, and choose **"Search with GPT"**. A spinner will indicate loading, and a popup will display the result. The result is automatically copied to your clipboard.

2. **Configuration**:  
   Click the extension icon to open the configuration popup. Enter your OpenAI API key, set your desired maximum tokens, update the context prompt, and choose a model (which will be loaded dynamically). Click **"Save"** to store your settings.

## Default Configuration

- **Max Tokens**: `150`
- **Context Prompt**:

  ```
  Contexte : Je veux que tu m'expliques à quoi correspond ce mot ou cette phrase ou bien réponds à cette question. Je ne veux pas que tu fasses de mises en forme du style markdown, fais des phrases courtes en moins de 150 token de l'api openai, réponds en français. Sujet :
  ```

## Troubleshooting

- **Service Worker Registration Error**:  
  Ensure that `background.js` is correctly located and free of syntax errors or unsupported imports.
- **Content Script Issues**:  
  Some pages may restrict content script injection. Verify the target pages.
- **API Errors**:  
  Check that your API key is valid and that `https://api.openai.com/` is included in the `host_permissions` of the manifest.

## Contributions

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## License

This project is licensed under the MIT License.
