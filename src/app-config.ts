import { moduleRegistry } from '@/lib/module-system';
import { flashcardsModule } from '@/modules/course-types/flashcards';
import { markdownInfoModule } from '@/modules/course-types/markdown-info';
import { quizModule } from '@/modules/course-types/quiz';

// Root-Konfiguration der App (Konzept Abschnitt 2). Modul-Registrierung ist bewusst
// unbedingt (kein Ein/Ausschalten hier) — das konfigurationsbasierte Laden folgt in
// T031. `getConfig()`/`getCourseTypeModule()` sind der einzige Weg, an die aufgelöste
// Gesamt-Konfiguration bzw. einen einzelnen Course-Type-Eintrag zu kommen — ersetzt
// das alte `courseTypeRegistry` (T018).
moduleRegistry.register(markdownInfoModule);
moduleRegistry.register(flashcardsModule);
moduleRegistry.register(quizModule);

export function getConfig() {
  return moduleRegistry.getConfig();
}

export function getCourseTypeModule(key: string) {
  return getConfig().courseTypes.find((courseType) => courseType.key === key);
}
