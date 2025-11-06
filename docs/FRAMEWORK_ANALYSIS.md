# Framework Analysis

## Overview

This is an **experimental framework for extensible web applications** that enables secure plugin architecture for web-based applications. The framework is designed to solve the problem of closed web applications by allowing dynamic plugin loading and secure communication between host applications and plugins.

## Core Architecture

### 1. Plugin System Architecture

The framework implements a **sandboxed plugin architecture** where:

- **Plugins run in isolated iframes** - Each plugin is loaded in its own iframe for security isolation
- **Type-safe communication** - Full TypeScript support across the entire system
- **Dependency resolution** - Automatic dependency loading using topological sorting
- **Framework agnostic** - Plugins can be built with any web technology (React, Vue, SolidJS, etc.)

### 2. Three-Layer SDK Structure

The framework consists of three main SDK packages:

#### **App SDK** (`packages/app-sdk/`)
- **Purpose**: Provides tools for host applications to manage and communicate with plugins
- **Key Components**:
  - `AppPluginManager`: Core plugin loading and management logic
  - `PluginManagerContext`: React/SolidJS context for plugin state management
  - `loadPlugins()`: Function to load plugins with dependency resolution
- **Features**:
  - Automatic dependency resolution using topological sorting
  - Plugin registration and communication
  - Event emission to plugins
  - Origin validation for security

#### **Plugin SDK** (`packages/plugin-sdk/`)
- **Purpose**: Provides tools for plugins to communicate with the host application
- **Key Components**:
  - `createPlugin()`: Factory function to create plugin SDK instances
  - Message handling system for request/response/event communication
  - Namespace-based routing for plugin isolation
- **Features**:
  - Request/response pattern for API calls
  - Event listening and emission
  - Automatic message routing and validation
  - Built-in logging system

#### **Shared SDK** (`packages/shared-sdk/`)
- **Purpose**: Common types and utilities shared between app and plugin SDKs
- **Key Components**:
  - Type definitions for messages and communication protocols
  - Common utility types and interfaces
- **Features**:
  - Type-safe message definitions
  - Shared interfaces for plugin metadata

## Communication Protocol

### Message Types

The framework uses a structured message protocol for communication:

1. **Request Messages**: Plugin → Host (API calls)
2. **Response Messages**: Host → Plugin (API responses)
3. **Event Messages**: Bidirectional (event emission/listening)

### Security Model

- **Origin Validation**: All messages are validated against allowed origins
- **Namespace Isolation**: Each plugin operates in its own namespace
- **Sandboxed Execution**: Plugins run in isolated iframes
- **Message Validation**: All incoming messages are validated for structure and origin

## Plugin Lifecycle

### 1. Plugin Discovery
- Plugins are defined by URLs in the host application
- Each plugin must expose a `plugin.json` manifest file

### 2. Dependency Resolution
- Plugin dependencies are automatically resolved using topological sorting
- Dependencies are loaded in the correct order to ensure proper initialization

### 3. Plugin Loading
- Plugins are loaded into iframes with proper sandboxing
- Each plugin gets its own SDK instance with namespace isolation

### 4. Plugin Registration
- Host application registers plugins for communication
- Plugins can register handlers for incoming requests
- Event listeners are set up for bidirectional communication

## Example Implementation

### Host Application (App SDK Usage)

```typescript
import { createApp, loadPlugins } from "app-sdk";

const app = createApp({
  allowedOrigins: ["http://localhost:5174", "http://localhost:5175"]
});

// Load plugins with dependency resolution
await loadPlugins(PLUGINS_TO_INSTALL, {
  onLoadPlugin: (plugin) => {
    app.registerPlugin(plugin.name, plugin.iframe.contentWindow!, plugin.url);
  }
});
```

### Plugin Implementation (Plugin SDK Usage)

```typescript
import { createPlugin } from "plugin-sdk";

const plugin = createPlugin({ 
  namespace: 'my-plugin', 
  parentOrigin: 'http://localhost:5173' 
});

// Handle incoming requests
plugin.handle('getData', () => {
  return { data: 'some data' };
});

// Listen to events
plugin.on('themeChange', (theme) => {
  console.log('Theme changed to:', theme);
});

// Emit events
plugin.emit('dataUpdated', { newData: 'updated' });
```

## Plugin Manifest System

Plugins are defined by a `plugin.json` manifest:

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Author Name",
  "license": "MIT",
  "dependencies": {
    "other-plugin": "^1.0.0"
  }
}
```

## Current Status & Roadmap

### ✅ Implemented Features
- Core plugin loading and communication
- Type-safe communication with full TypeScript support
- Secure origin validation and message isolation
- Dependency resolution with topological sorting
- Event system for bidirectional communication
- Request/response pattern for API calls

### 🚧 In Development
- Permission system for plugin fetch and event systems
- Enhanced security measures
- Improved type safety
- Plugin marketplace integration

### 📋 Planned Features
- Server SDK for backend plugin management
- Enhanced permission system with user configuration
- Plugin slot system for UI injection
- CDN deployment for plugin SDK

## Technical Stack

- **Runtime**: Bun (package manager and runtime)
- **Frontend**: SolidJS (reactive framework)
- **Build**: Vite (build tool)
- **Type Safety**: TypeScript throughout
- **Communication**: PostMessage API with structured protocols
- **Dependency Resolution**: Topological sorting algorithm

## Security Considerations

1. **Iframe Sandboxing**: Plugins run in isolated iframes
2. **Origin Validation**: Strict origin checking for all communications
3. **Message Validation**: All messages are validated for structure and content
4. **Namespace Isolation**: Each plugin operates in its own namespace
5. **Permission System**: Planned permission system for fine-grained access control

## Use Cases

This framework is particularly suited for:

- **Gaming Applications**: Extensible game clients with mod support
- **Developer Tools**: Extensible IDEs and development environments
- **Content Management**: Extensible CMS with plugin support
- **Enterprise Applications**: Extensible business applications
- **Educational Platforms**: Extensible learning management systems

## Development Workflow

1. **Host Application**: Use App SDK to create the main application
2. **Plugin Development**: Use Plugin SDK to create individual plugins
3. **Dependency Management**: Define plugin dependencies in manifest files
4. **Testing**: Run plugins in development mode with hot reloading
5. **Deployment**: Deploy plugins as separate applications with proper CORS setup

## Conclusion

This framework provides a robust foundation for building extensible web applications with secure plugin architecture. The three-layer SDK approach ensures clear separation of concerns while maintaining type safety and security. The dependency resolution system and communication protocol make it easy to build complex plugin ecosystems while maintaining isolation and security.
