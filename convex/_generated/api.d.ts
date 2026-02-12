/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules } from "convex/server";
import type * as documents from "../documents.js";
import type * as knowledge from "../knowledge.js";
import type * as messages from "../messages.js";
import type * as ai from "../ai.js";
import type * as http from "../http.js";

/**
 * A utility for referencing Convex functions in your app's API.
 */
declare const fullApi: ApiFromModules<{
  documents: typeof documents;
  knowledge: typeof knowledge;
  messages: typeof messages;
  ai: typeof ai;
  http: typeof http;
}>;
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;

import type { FilterApi, FunctionReference } from "convex/server";
