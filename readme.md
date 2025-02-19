# Search with GPT Extension

Cette extension Chrome permet d'envoyer du texte sélectionné à l'API ChatGPT via un menu contextuel, d'afficher la réponse dans une popup animée et de la copier automatiquement dans le presse-papier.

## Fonctionnalités

- **Option de menu contextuel**  
Lorsque l'utilisateur sélectionne du texte et effectue un clic droit, l'option "Search with GPT" apparaît. La requête est alors envoyée à l'API ChatGPT.

- **Popup de réponse animée**  
Une fois la réponse reçue, une popup s'affiche près du curseur avec une animation slide-in/slide-out. Un spinner animé indique le chargement.

- **Configuration personnalisable**  
La configuration se fait via une popup (accessible en cliquant sur l'icône de l'extension) qui permet de :
  - Saisir sa propre clé API.
  - Définir le nombre maximal de tokens (par défaut \`150\`).
  - Saisir un prompt de contexte.
  - Choisir le modèle souhaité (la liste des modèles est récupérée dynamiquement via l'appel à l'API OpenAI).

- **Accessibilité et internationalisation**  
L'interface est construite avec des attributs ARIA et est entièrement en français. La navigation au clavier est facilitée grâce aux attributs \`tabindex\`.

## Installation

1. Clonez le dépôt :

```bash
  git clone https://github.com/votreutilisateur/search-with-gpt-extension.git
```