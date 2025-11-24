import { z } from 'zod';

/**
 * Semver pattern: ^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$
 * Matches: major.minor.patch[-prerelease][+build]
 */
const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

type Permission = string;

function validatePermission(val: string): val is Permission {
  // Valid permission formats:
  //   <action>
  //   <resource>.<action>
  //   <plugin-name>:<resource>.<action>
  //   <plugin-name>:<resource>.<action>.<subaction>
  //   etc.
  // The general format is: (optional <plugin-name>:)?<resource>(.<subresource>)*
  // We'll check for a leading plugin-name (alphanumeric, dash/underscore allowed) and a colon, or just a resource[.resource...]
  // Examples:
  //   "fetch"
  //   "theme"
  //   "shop:create"
  //   "shop:buy
  //   "shop:cart.add-item"
  //   etc.
  return typeof val === 'string' && /^(?:[a-zA-Z0-9_-]+:)?[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(val);
}

/**
 * Schema for permissions.
 */
const permissionsSchema = z.array(z.string()
  .refine((val) => validatePermission(val), { message: 'Invalid permission format' })
  .transform((val) => val as Permission));

/**
 * Schema for plugin manifest files (plugin.json)
 * 
 * @example
 * {
 *   "name": "themed-button",
 *   "version": "1.0.0",
 *   "description": "A simple themed button plugin",
 *   "author": "John Doe",
 *   "license": "MIT",
 *   "dependencies": {
 *     "theme-toggle": "^1.0.0"
 *   }
 * }
 */
export const pluginManifestSchema = z.object({
  /**
   * Unique plugin name (namespace).
   */
  name: z.string().min(1),
  
  /**
   * Plugin version (semver).
   */
  version: z.string().regex(semverPattern).optional(),
  
  /**
   * Short description of the plugin.
   */
  description: z.string().optional(),
  
  /**
   * Author or organization name.
   */
  author: z.string().optional(),
  
  /**
   * License identifier (e.g. MIT).
   */
  license: z.string().optional(),
  
  /**
   * Map of plugin names to version ranges this plugin depends on.
   * Keys are plugin names (min length 1), values are semver ranges (min length 1).
   */
  dependencies: z.record(
    z.string().min(1), // plugin name
    z.string().min(1)  // semver range
  ).optional(),

  /**
   * Permissions this plugin needs to function.
   */
  permissions: permissionsSchema.optional(),
}).strict(); // additionalProperties: false

/**
 * Type inferred from the plugin manifest schema.
 */
export type PluginManifest = z.infer<typeof pluginManifestSchema>;

