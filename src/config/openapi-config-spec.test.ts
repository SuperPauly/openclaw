import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { OpenClawSchema } from "./zod-schema.js";

type OpenApiSpec = {
  openapi?: string;
  components?: { schemas?: { OpenClawConfig?: unknown } };
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
};

describe("openclaw config OpenAPI spec", () => {
  it("keeps docs/gateway/openclaw-config.openapi.json in sync with OpenClawSchema", () => {
    const specPath = resolve(process.cwd(), "docs/gateway/openclaw-config.openapi.json");
    expect(existsSync(specPath), `Missing generated OpenAPI spec at ${specPath}`).toBe(true);
    const spec = JSON.parse(readFileSync(specPath, "utf8")) as OpenApiSpec;

    expect(spec.openapi).toBe("3.1.0");
    const getResponseSchemaRef =
      spec.paths?.["/openclaw.json"]?.get?.responses?.["200"]?.content?.["application/json"]?.schema
        ?.$ref;
    expect(getResponseSchemaRef).toBe("#/components/schemas/OpenClawConfig");
    expect(spec.components?.schemas?.OpenClawConfig).toEqual(
      OpenClawSchema.toJSONSchema({
        target: "draft-07",
        unrepresentable: "any",
      }),
    );
  });
});
