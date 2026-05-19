<template>
  <section class="mx-auto max-w-7xl space-y-4">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Validation and Error Handling</h1>
      <p class="text-sm text-slate-600 sm:text-base">
        Create and edit news requests are validated with explicit status-code outcomes.
      </p>
      <NuxtLink to="/erd" class="inline-flex text-sm font-medium text-blue-700 hover:text-blue-800">Back to Diagram Center</NuxtLink>
    </header>

    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div ref="diagramContainer" class="min-h-[460px] min-w-[900px]"></div>
    </div>

    <ul class="list-disc space-y-1 pl-5 text-sm text-slate-700">
      <li>400 Bad Request: malformed payload (invalid JSON, invalid path params).</li>
      <li>401 Unauthorized: missing/invalid JWT for backoffice endpoints.</li>
      <li>404 Not Found: category or news item does not exist.</li>
      <li>409 Conflict: duplicate slug or unique constraint violation.</li>
      <li>422 Unprocessable Entity: schema validation failed (title/summary/content/categoryId).</li>
    </ul>

    <p v-if="renderError" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ renderError }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const diagramContainer = ref<HTMLElement | null>(null);
const renderError = ref("");

const definition = `
flowchart TB
  A[Client submits create or edit news] --> B[Parse request body and params]
  B --> C{JWT valid?}
  C -- No --> S401[401 Unauthorized]
  C -- Yes --> D[Schema validation]
  D --> E{Required fields present?}
  E -- No --> S422[422 Unprocessable Entity]
  E -- Yes --> F{Business checks pass?}
  F -- Category missing --> S404[404 Not Found]
  F -- Duplicate slug --> S409[409 Conflict]
  F -- Malformed request --> S400[400 Bad Request]
  F -- Pass --> G[Persist data]
  G --> S200[200 OK / 201 Created]
`;

onMounted(async () => {
  if (!diagramContainer.value) {
    return;
  }

  try {
    const mermaid = (await import("mermaid")).default;
    mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });

    const { svg } = await mermaid.render("error-validation", definition);
    diagramContainer.value.innerHTML = svg;
  } catch {
    renderError.value = "Unable to render diagram. Please refresh and try again.";
  }
});
</script>
