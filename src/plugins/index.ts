import pinia from "./pinia";
import type { App } from "vue";

export async function plugins(app: App) {
  app.use(pinia);
}