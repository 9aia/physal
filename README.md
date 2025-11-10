# SDK (experimental)

> **Experimental Framework for Extensible Web Applications**

## The Problem

Most web-based game clients today are closed systems: players can only use features that the original developers choose to implement. Adding new features or customizing the experience usually requires waiting for an official update and a full redeployment.

**This rigid model keeps players and community developers from freely extending, personalizing, or modding their gaming experiences.**

## Our Vision

A sandbox game where players can join servers that are not only extendable and customizable, but also the client itself. Players should automatically extend their client to play extensions of the sandbox game - seamlessly, securely, and independently.

## The Solution

SDK enables this through a secure plugin architecture:

- **Plugins run in sandboxed environments** - Each plugin is an iframe that is sandboxed and secure
- **Automatic dependency resolution** - Plugins can depend on other plugins
- **Type-safe communication** - Full TypeScript support across the system
- **Framework agnostic** - Plugins can be built with any Web technology

## Quick Start

```bash
# Install dependencies
bun install

# Start bootloader, CPR and plugins
bun dev
```

Visit `http://localhost:5173` to see the host application with loaded plugins.

Look at the examples in the `examples` folder to see how to use the SDK practically.

## Current Status

- ✅ **Functional**: Core plugin loading and communication works
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Secure**: Origin validation and message isolation
- 🚧 **In Development**: Permission system, enhanced security, enhanced type safety
- 📋 **Planned**: Server SDK, plugin marketplace

---

**Note**: This is an R&D project designed for our game sandbox vision. While optimized for our specific needs, it's built to be reusable.
