import 'server-only';

import { Client } from 'minio';

const BUCKET = process.env.MINIO_BUCKET ?? 'studyroom-uploads';
const LOGO_URL_EXPIRY_SECONDS = 60 * 60;

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

// Speichert den Object-Key, nicht die öffentliche URL — der Bucket ist nicht
// öffentlich, Anzeige erfolgt über eine zeitlich begrenzte presigned URL
// (siehe getOrgLogoUrl).
export async function uploadOrgLogo(orgId: string, file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `org-logos/${orgId}-${Date.now()}-${file.name}`;
  await getClient().putObject(BUCKET, key, buffer, buffer.length, {
    'Content-Type': file.type || 'application/octet-stream',
  });
  return key;
}

export async function getOrgLogoUrl(key: string): Promise<string> {
  return getClient().presignedGetObject(BUCKET, key, LOGO_URL_EXPIRY_SECONDS);
}
