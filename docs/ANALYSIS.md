# SDK Analysis

## MVP Specification

### Overview
A secure, extensible plugin architecture for web applications that enables dynamic client-side extension through sandboxed plugins. Designed for a sandbox game where players can extend their client experience by joining servers with custom plugins.

### Core Components

**1. Bootloader (Host Application)**
- Main application entry point
- Manages plugin registry and routing
- Handles inter-plugin communication
- Validates origins and routes messages
- Provides app-level request handlers

**2. PCR (Plugin Container Runtime)**
- Runs in an iframe separate from the bootloader
- Receives plugin configuration from bootloader
- Manages plugin lifecycle and loading
- Listens to app-level events

**3. Plugins**
- Sandboxed iframe-based extensions
- Namespace-scoped communication
- Support for dependencies on other plugins
- Framework-agnostic (can use any web technology)

### Key Features

**Communication Model**
- Request/Response: RPC-style calls between plugins and app
- Event System: Pub/sub for plugin-to-plugin and plugin-to-app events
- Type-safe: Full TypeScript support across all SDKs

**Security**
- Origin validation for all postMessage communication
- Sandboxed plugin execution (iframe isolation)
- Namespace-based request routing

**Plugin Management**
- Dependency resolution (planned: topological sorting)
- Plugin manifest with metadata (name, version, dependencies)
- Dynamic plugin loading

### MVP Scope

**Implemented**
- ✅ Core plugin loading and iframe creation
- ✅ Request/response messaging system
- ✅ Event broadcasting system
- ✅ Origin validation
- ✅ TypeScript type definitions
- ✅ Basic plugin manifest structure

**In Progress**
- 🚧 Plugin dependency resolution and loading order
- 🚧 Permission system for events and requests
- 🚧 Enhanced security measures

**Planned**
- 📋 Server SDK for plugin distribution
- 📋 Plugin marketplace
- 📋 Plugin signing and verification
- 📋 Plugin version validation

---

## Technical Analysis

### Architecture

**Monorepo Structure**
- Workspace-based monorepo using Bun
- Packages: `bootloader-sdk`, `pcr-sdk`, `plugin-sdk`, `shared-sdk`
- Examples: Reference implementations for each component
- TypeScript-first with shared type definitions

**Communication Flow**

```
┌─────────────┐
│ Bootloader  │ (Main App - Port 5173)
└──────┬──────┘
       │ postMessage
       │
┌──────▼──────┐
│     PCR     │ (Iframe - Port 5174)
└──────┬──────┘
       │
       ├───┐
       │   │
┌──────▼───▼──────┐
│ Plugin (iframe) │
└─────────────────┘
```

**Message Types**
1. **Request**: `{ type: 'request', id, requestType, payload }`
   - Namespace-scoped (e.g., `pluginName.action`)
   - Returns promise with response
   - 5-second timeout

2. **Response**: `{ type: 'response', id, payload?, error? }`
   - Matches request by ID
   - Handles errors gracefully

3. **Event**: `{ type: 'event', eventType, payload, namespace? }`
   - Broadcast to all registered plugins
   - App can listen to plugin events

### Implementation Details

**Bootloader SDK** (`packages/bootloader-sdk`)
- Central message router
- Maintains plugin registry (currently commented out)
- Routes requests to appropriate handlers (app or plugin)
- Broadcasts events to all plugins
- Origin whitelist: `["http://localhost:5174"]`

**PCR SDK** (`packages/pcr-sdk`)
- Minimal event listener for app-to-PCR communication
- Uses SolidJS for UI (context provider commented out)
- Receives plugin list via `runtimeReady` event
- Plugin manager with dependency resolution (incomplete)

**Plugin SDK** (`packages/plugin-sdk`)
- Creates plugin instance with namespace
- Handles incoming requests, responses, and events
- Provides `handle()`, `request()`, `emit()`, `on()`, `off()` API
- Automatic namespace prefixing for requests

**Shared SDK** (`packages/shared-sdk`)
- Common type definitions
- Message type unions
- Handler function types

### Current Limitations

1. **Plugin Registration**: Bootloader's `registerPlugin` is commented out - plugins cannot be dynamically registered
2. **Dependency Resolution**: Plugin manager's `loadPlugins` is incomplete - topological sorting exists but not fully integrated
3. **Security**: Basic origin validation only; no permission system
4. **Error Handling**: Basic timeout and error propagation, but no retry logic
5. **Plugin Lifecycle**: No explicit unload/cleanup mechanisms

### Technology Stack

- **Runtime**: Bun (package manager and runtime)
- **Language**: TypeScript 5.9.3
- **UI Framework**: SolidJS (used in examples)
- **Build Tool**: Vite (for examples)
- **Dependency Sorting**: `@n1ru4l/toposort`

### Design Patterns

1. **Message Passing**: PostMessage API for cross-origin communication
2. **Registry Pattern**: Plugin registry for routing (partially implemented)
3. **Observer Pattern**: Event system with listener management
4. **Factory Pattern**: `createBootloader()`, `createCPR()`, `createPlugin()`

### Strengths

- Clean separation of concerns (bootloader, PCR, plugins)
- Type-safe communication layer
- Framework-agnostic plugin development
- Sandboxed execution model
- Extensible architecture

### Areas for Improvement

- Complete plugin registration and lifecycle management
- Implement full dependency resolution
- Add permission system for fine-grained access control
- Enhance error handling and recovery
- Add plugin versioning and compatibility checks
- Implement plugin signing/verification
- Add comprehensive logging and debugging tools


