// Executa uma lista de módulos em ordem. Cada um roda isolado: se um falhar, os outros continuam.
export async function boot(modules) {
  for (const [name, init] of modules) {
    try {
      await init();
    } catch (error) {
      console.error(`[boot] Falha ao iniciar "${name}":`, error);
    }
  }
}
