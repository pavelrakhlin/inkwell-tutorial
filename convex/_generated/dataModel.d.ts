/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { DataModelFromSchemaDefinition } from "convex/server";
import type schema from "../schema.js";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = "documents" | "knowledge" | "messages";

/**
 * The type of a document stored in Convex.
 */
export type Doc<TableName extends TableNames> =
  DocumentByName<DataModel, TableName>;

/**
 * An identifier for a document in Convex.
 */
export type Id<TableName extends TableNames> =
  GenericId<TableName>;

/**
 * A type describing your Convex data model.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

import type { DocumentByName, GenericId } from "convex/server";
