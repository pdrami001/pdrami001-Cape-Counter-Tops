import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { defaultHomepage } from "@/lib/homepage-content";

const db = new PGlite();
const admin = "00000000-0000-0000-0000-000000000001";
const other = "00000000-0000-0000-0000-000000000002";
const path = `homepage/${admin}.jpg`;
const migration = readFileSync("supabase/migrations/20260927173535_homepage_content.sql", "utf8");
async function as(role: "anon" | "authenticated", id: string, query: string) {
  await db.exec(`set role ${role}; set request.jwt.claim.sub = '${id}';`);
  try { return await db.query(query); } finally { await db.exec("reset role;"); }
}

beforeAll(async () => {
  // Local PostgreSQL-compatible runtime only. Stub Supabase-owned schemas,
  // then execute the repository's existing policies and the actual new migration.
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth, storage, public to anon, authenticated;
    create table public.products(id uuid primary key);
    create table storage.buckets(id text primary key, name text, public boolean);
    create table storage.objects(id integer generated always as identity primary key, bucket_id text, name text);
    create function storage.extension(name text) returns text language sql as $$ select regexp_replace(name, '^.*\\.', '') $$;
    alter table storage.objects enable row level security;
    grant select, insert, update, delete on storage.objects to anon, authenticated;
    grant usage on all sequences in schema storage to authenticated;
    insert into auth.users values ('${admin}'), ('${other}');
  `);
  await db.exec(readFileSync("supabase/migrations/202609060002_authorization.sql", "utf8"));
  await db.exec(readFileSync("supabase/migrations/202609060003_storage.sql", "utf8"));
  await db.exec(`insert into public.admin_users(user_id) values ('${admin}');`);
  await db.exec(migration);
}, 30000);
afterAll(async () => { await db.close(); });

describe.sequential("unapplied homepage migration in local SQL runtime", () => {
  it("seeds the exact current homepage and permits anonymous reads", async () => {
    const result = await as("anon", "", "select content, revision from public.homepage_content");
    expect(result.rows).toEqual([{ content: defaultHomepage, revision: 0 }]);
  });
  it("denies anonymous writes and non-admin publication", async () => {
    await expect(as("anon", "", "update public.homepage_content set content = content")).rejects.toThrow();
    const result = await as("authenticated", other, "update public.homepage_content set content = content returning id");
    expect(result.rows).toEqual([]);
  });
  it("publishes atomically, persists edits and rejects stale revisions", async () => {
    const draft = structuredClone(defaultHomepage); draft.hero.title = "Edited heading"; draft.materials.quartz.image.x = 80;
    const result = await as("authenticated", admin, `update public.homepage_content set content = '${JSON.stringify(draft)}'::jsonb where revision = 0 returning revision`);
    expect(result.rows).toEqual([{ revision: 1 }]);
    const refreshed = await as("anon", "", "select content from public.homepage_content where id=1");
    expect(refreshed.rows).toEqual([{ content: draft }]);
    expect((await as("authenticated", admin, "update public.homepage_content set content=content where revision=0 returning id")).rows).toEqual([]);
  });
  it("prevents deletes, extra rows, revision tampering and malformed content", async () => {
    await expect(as("authenticated", admin, "delete from public.homepage_content")).rejects.toThrow();
    await expect(as("authenticated", admin, "update public.homepage_content set revision=99")).rejects.toThrow();
    await expect(as("authenticated", admin, "insert into public.homepage_content (id,content) values (1, '{}')")).rejects.toThrow();
    await expect(as("authenticated", admin, "update public.homepage_content set content='{}'")).rejects.toThrow();
  });
  it("allows only admin uploads and retains homepage objects on replace/remove", async () => {
    await expect(as("authenticated", other, `insert into storage.objects(bucket_id,name) values ('product-images','${path}')`)).rejects.toThrow();
    await expect(as("anon", "", `insert into storage.objects(bucket_id,name) values ('product-images','${path}')`)).rejects.toThrow();
    await as("authenticated", admin, `insert into storage.objects(bucket_id,name) values ('product-images','${path}')`);
    expect((await as("authenticated", admin, `delete from storage.objects where name='${path}' returning id`)).rows).toEqual([]);
    expect((await as("authenticated", admin, `update storage.objects set name='replacement.jpg' where name='${path}' returning id`)).rows).toEqual([]);
    await as("authenticated", admin, "insert into storage.objects(bucket_id,name) values ('product-images','ordinary-product.jpg')");
    expect((await as("authenticated", admin, "delete from storage.objects where name='ordinary-product.jpg' returning id")).rows).toHaveLength(1);
  });
});
