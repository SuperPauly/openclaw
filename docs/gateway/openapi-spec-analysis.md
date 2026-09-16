# OpenAPI Config Spec Maintenance

`docs/gateway/openclaw-config.openapi.json` exposes the OpenClaw configuration
schema as an OpenAPI 3.1 document. The source of truth is `OpenClawSchema` in
`src/config/zod-schema.ts` and its composed schema modules.

The checked-in `components.schemas.OpenClawConfig` value is generated with the
same conversion used by `src/config/openapi-config-spec.test.ts`:

```ts
OpenClawSchema.toJSONSchema({
  target: "draft-07",
  unrepresentable: "any",
});
```

When the configuration schema changes, regenerate that component and run the
focused test before committing:

```bash
pnpm exec vitest run src/config/openapi-config-spec.test.ts
```

Zod refinements that JSON Schema cannot represent remain runtime validation
rules. Do not manually add constraints to the generated component because the
focused test intentionally requires exact equality with `OpenClawSchema`.
