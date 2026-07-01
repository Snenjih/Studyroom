# T043: Benachrichtigungen-Modul (In-App)

**Phase:** 05-extensions
**Status:** offen
**Abhängig von:** T042

## Kontext
Konzept Abschnitt 9: "Benachrichtigungen (In-App, optional E-Mail) — neue Aufgabe,
Feedback erhalten, Deadline nah." Erstmal nur In-App, kein E-Mail für den Start.

## Ziel
User erhalten In-App-Benachrichtigungen für relevante Ereignisse (neuer Post im Forum,
Kursabschluss, Einschreibung). Ein Glocken-Icon in der Navbar zeigt ungelesene Anzahl.

## Schritte
- [ ] `src/db/schema/notifications.ts` — `id`, `user_id`, `type`, `payload JSONB`,
      `read_at TIMESTAMPTZ`, `created_at`
- [ ] Migration generieren und ausführen
- [ ] `src/lib/notifications.ts` — `createNotification()`, `markAsRead()`, `getUnreadCount()`
- [ ] `src/app/api/notifications/route.ts` — GET (Liste), PATCH (alle als gelesen markieren)
- [ ] `src/components/layout/NotificationBell.tsx` — Navbar-Icon mit Badge + Dropdown
- [ ] Hooks in Foren-Modul: `onNewPost → createNotification(threadAuthor)`
- [ ] `src/modules/notifications/index.ts` — `notificationsModule: AppModule`

## Abnahmekriterien
- [ ] Neuer Forum-Post → Benachrichtigung für Thread-Ersteller
- [ ] Glocken-Icon zeigt Anzahl ungelesener Benachrichtigungen
- [ ] "Alle lesen" markiert alle als gelesen, Badge verschwindet
- [ ] Modul deaktivierbar ohne Fehler

## Betroffene Dateien
- `src/db/schema/notifications.ts` (neu)
- `src/lib/notifications.ts`, `src/modules/notifications/index.ts` (neu)
- `src/components/layout/NotificationBell.tsx` (neu)

## Notizen
