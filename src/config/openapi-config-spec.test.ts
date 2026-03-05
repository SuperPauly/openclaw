import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { OpenClawSchema } from "./zod-schema.js";

describe("openclaw config OpenAPI spec", () => {
  it("keeps docs/gateway/openclaw-config.openapi.json in sync with OpenClawSchema", () => {
    const specPath = resolve(process.cwd(), "docs/gateway/openclaw-config.openapi.json");
    const spec = JSON.parse(readFileSync(specPath, "utf8")) as {
      openapi?: string;
      components?: { schemas?: { OpenClawConfig?: unknown } };
    };

    expect(spec.openapi).toBe("3.1.0");
    const getResponseSchema = (
      spec as {
        paths?: {
          "/openclaw.json"?: {
            get?: {
              responses?: {
                "200"?: {
                  content?: {
                    "application/json"?: {
                      schema?: { $ref?: string };
                    };
                  };
                };
              };
            };
          };
        };
      }
    ).paths?.["/openclaw.json"]?.get?.responses?.["200"]?.content?.["application/json"]?.schema
      ?.$ref;
    expect(getResponseSchema).toBe("#/components/schemas/OpenClawConfig");
    expect(spec.components?.schemas?.OpenClawConfig).toEqual(
      OpenClawSchema.toJSONSchema({
        target: "draft-07",
        unrepresentable: "any",
      }),
    );
  });
});
