# T042: Foren/Diskussionen — API und UI

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T041

## Kontext
Konzept Abschnitt 9: Foren pro Kurs. Nur eingeschriebene Learner und Trainer des Kurses
haben Zugriff auf das Kursforum.

## Ziel
Learner und Trainer können im Kurs-Forum Threads erstellen, lesen und antworten.
Die Forum-Seite ist direkt im Kurs-Layout zugänglich.

## Schritte
- [ ] `src/app/api/courses/[id]/forum/threads/route.ts` — GET, POST
- [ ] `src/app/api/courses/[id]/forum/threads/[threadId]/posts/route.ts` — GET, POST
- [ ] `src/app/api/forum/posts/[postId]/route.ts` — DELETE (Soft-Delete)
- [ ] `src/app/(app)/courses/[id]/forum/page.tsx` — Thread-Übersicht
- [ ] `src/app/(app)/courses/[id]/forum/[threadId]/page.tsx` — Thread-Ansicht mit Posts
- [ ] Zugriffs-Check: nur eingeschriebene User + Trainer/Admin des Kurses
- [ ] Trainer kann Threads pinnen und Posts löschen

## Abnahmekriterien
- [ ] Nicht-eingeschriebener Learner kann Forum nicht sehen (403)
- [ ] Thread anlegen, Post antworten, Post löschen funktioniert
- [ ] Gelöschter Post zeigt "[Gelöscht]" statt Inhalt
- [ ] Trainer kann beliebige Posts löschen (nicht nur eigene)

## Betroffene Dateien
- `src/app/api/courses/[id]/forum/` (neu)
- `src/app/(app)/courses/[id]/forum/` (neu)

## Notizen
