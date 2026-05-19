<template>
  <section class="mx-auto max-w-7xl space-y-4">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Security: Stateless JWT Flow</h1>
      <p class="text-sm text-slate-600 sm:text-base">
        Backoffice routes use Bearer token verification with no server session state.
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
sequenceDiagram
  participant Admin as Backoffice Admin
  participant API as Auth API
  participant Middleware as Admin JWT Middleware
  participant Service as Auth Service
  participant Repo as Admin Store

  Admin->>API: POST /api/auth/login (username, password)
  API->>Service: validate credentials
  Service->>Repo: find admin user
  Repo-->>Service: user record
  Service-->>API: sign JWT (exp)
  API-->>Admin: 200 + access token

  Admin->>Middleware: Request /api/admin/* with Authorization: Bearer token
  Middleware->>Service: verify JWT signature and expiry
  alt token valid
    Service-->>Middleware: claims
    Middleware-->>Admin: allow request to continue
  else token invalid/expired/missing
    Service-->>Middleware: verification error
    Middleware-->>Admin: 401 Unauthorized
  end
`;

onMounted(async () => {
  if (!diagramContainer.value) {
    return;
  }

  try {
    const mermaid = (await import("mermaid")).default;
    mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });

    const { svg } = await mermaid.render("security-jwt", definition);
    diagramContainer.value.innerHTML = svg;
  } catch {
    renderError.value = "Unable to render diagram. Please refresh and try again.";
  }
});
</script>
