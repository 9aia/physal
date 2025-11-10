# TODO

- Refactor event system to use our internal typed lib
  - Expose all the event emitters as a wrapper around that typed lib
- Pre-render bootloader static parts and then hydrate the dynamic parts

- Setup linter and formatter
- Setup typechecker
- Update docs and README.md

- Move app devtools to another repo

- Validating version already installed for joining a server that needs a specific version of a plugin
- Sign and verify plugins
- Create a plugin marketplace with rating and reviews

- Add permission system for plugin fetch and event systems
  - (only explicitly allowed plugins can fetch and emit certain events)
  - for e.g., the plugin hello-world can only listen to event 'theme-toggle.onThemeChange' (which can come from theme-toggle plugin), if the user configured explicitly app settings for hello-world to listen to events 'theme-toggle.onThemeChange' or 'theme-toggle'.
- Improve security on message
- Deploy plugin SDK as CDN

- Allow plugins to expose slots for other plugins to be injected into by the app.
