# @helpy/widget

AI-powered customer service chat widget for [Helpy](https://helpy.io).

## Installation

### CDN (Recommended)

Add the following script to your website:

```html
<script src="https://cdn.helpy.io/widget.js"></script>
<script>
  Helpy.init({
    projectId: 'your-project-id',
    apiKey: 'your-api-key'
  });
</script>
```

### npm

```bash
npm install @helpy/widget
```

```javascript
import Helpy from '@helpy/widget';

Helpy.init({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `projectId` | `string` | **required** | Your Helpy project ID |
| `apiKey` | `string` | **required** | Your Helpy API key |
| `apiUrl` | `string` | `https://api.helpy.io` | API endpoint URL |
| `position` | `'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Widget position |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color theme |
| `primaryColor` | `string` | `'#0891b2'` | Primary brand color |
| `welcomeMessage` | `string` | `'Hi! How can I help you today?'` | Welcome message |
| `placeholder` | `string` | `'Type a message...'` | Input placeholder |
| `zIndex` | `number` | `9999` | CSS z-index |

## API

### `Helpy.init(config)`

Initialize the widget with the given configuration.

### `Helpy.open()`

Programmatically open the chat window.

### `Helpy.close()`

Programmatically close the chat window.

### `Helpy.destroy()`

Remove the widget from the page.

### `Helpy.update(config)`

Update the widget configuration.

## Examples

### Custom Styling

```javascript
Helpy.init({
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  primaryColor: '#7c3aed', // Purple
  theme: 'dark',
  position: 'bottom-left',
  welcomeMessage: 'Hello! Need help with anything?'
});
```

### Open on Button Click

```html
<button onclick="Helpy.open()">Chat with us</button>
```

### Auto Theme Detection

```javascript
Helpy.init({
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  theme: 'auto' // Follows system preference
});
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## License

MIT