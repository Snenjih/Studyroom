import 'server-only';

import { randomUUID } from 'node:crypto';

import { Client } from 'minio';

const BUCKET = process.env.MINIO_BUCKET ?? 'studyroom-uploads';
const LOGO_URL_EXPIRY_SECONDS = 60 * 60;
const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;
const LOGO_KEY_PREFIX = 'org-logos/';

let client: Client | null = null;

function getClient(): Client {
  if (client) return client;

  const endpoint = new URL(process.env.MINIO_ENDPOINT ?? 'http://minio:9000');
  client = new Client({
    endPoint: endpoint.hostname,
    port: endpoint.port ? Number(endpoint.port) : undefined,
    useSSL: endpoint.protocol === 'https:',
    accessKey: process.env.MINIO_ROOT_USER ?? '',
    secretKey: process.env.MINIO_ROOT_PASSWORD ?? '',
  });
  return client;
}

// Nur das Dateiformat (Extension) aus dem Client-Dateinamen übernehmen, nie den Namen
// selbst — sonst könnte `file.name` (z.B. "../../x") den Object-Key aus dem
// `org-logos/`-Präfix heraus manipulieren (Path Traversal im Object Store).
function safeExtension(filename: string): string {
  const match = /\.([a-zA-Z0-9]{1,10})$/.exec(filename);
  return match ? `.${match[1].toLowerCase()}` : '';
}

// Speichert den Object-Key, nicht die öffentliche URL — der Bucket ist nicht
// öffentlich, Anzeige erfolgt über eine zeitlich begrenzte presigned URL
// (siehe getOrgLogoUrl).
export async function uploadOrgLogo(orgId: string, file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Logo muss ein Bild sein.');
  }
  if (file.size > MAX_LOGO_SIZE_BYTES) {
    throw new Error('Logo darf maximal 5 MB groß sein.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${LOGO_KEY_PREFIX}${orgId}-${randomUUID()}${safeExtension(file.name)}`;
  await getClient().putObject(BUCKET, key, buffer, buffer.length, {
    'Content-Type': file.type,
  });
  return key;
}

// Verteidigung in der Tiefe: ein Logo-Key muss immer zur eigenen Org gehören (Präfix
// `org-logos/<orgId>-`) — verhindert, dass über einen manipulierten Key eine
// presigned URL für ein FREMDES Objekt im (geteilten) Bucket ausgestellt wird.
export function isOwnOrgLogoKey(key: string, orgId: string): boolean {
  return key.startsWith(`${LOGO_KEY_PREFIX}${orgId}-`);
}

export async function getOrgLogoUrl(key: string): Promise<string> {
  return getClient().presignedGetObject(BUCKET, key, LOGO_URL_EXPIRY_SECONDS);
}
