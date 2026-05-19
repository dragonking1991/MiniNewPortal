<template>
  <section class="mx-auto max-w-7xl space-y-4">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Layered Architecture</h1>
      <p class="text-sm text-slate-600 sm:text-base">
        The system is separated into Transport, Service, and Persistence layers.
      </p>
      <NuxtLink to="/erd" class="inline-flex text-sm font-medium text-blue-700 hover:text-blue-800">Back to Diagram Center</NuxtLink>
    </header>

    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div ref="diagramContainer" class="min-h-[420px] min-w-[860px]"></div>
    </div>

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
  subgraph T[Transport Layer: REST API + Pagination]
    T1[GET /api/news?page&limit]
    T2[POST /api/admin/news]
    T3[PUT /api/admin/news/:id]
    T4[Parse and validate input]
    T1 --> T4
    T2 --> T4
    T3 --> T4
  end

  subgraph S[Service Layer: Business Rules]
    S1[NewsService list/create/update]
    S2[AuthService verify JWT for admin APIs]
    S3[View counter increments and daily aggregation]
    S4[Domain checks and decisions]
    S1 --> S3
    S2 --> S4
  end

  subgraph P[Persistence Layer: Database]
    P1[(categories)]
    P2[(news)]
    P3[(news_view_daily)]
    P4[Repository operations + transactions]
    P4 --> P1
    P4 --> P2
    P4 --> P3
  end

  T4 --> S1
  T4 --> S2
  S1 --> P4
  S3 --> P4
`;

onMounted(async () => {
  if (!diagramContainer.value) {
    return;
  }

  try {
    const mermaid = (await import("mermaid")).default;
    mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });

    const { svg } = await mermaid.render("layered-architecture", definition);
    diagramContainer.value.innerHTML = svg;
  } catch {
    renderError.value = "Unable to render diagram. Please refresh and try again.";
  }
});
</script>
