# Admin image cleanup — implementation plan

## Findings

- Person and project deletion currently removes database rows but leaves their files in the `portfolio-media` Supabase Storage bucket. `project_media` rows cascade when a project is deleted, so their URLs must be captured first.
- Replacing a person’s portrait, editing a project gallery, and replacing CMS images update references without removing the previous files. `ImageManagerField` uploads immediately, so cancelling a form can also leave an unused file.
- Manage Content stores image references in `site_pages`, `navigation_cards`, `process_philosophies`, `service_offerings`, and `home_slides`. Homepage slides have a partial cancel cleanup, but their save/delete paths do not consistently remove obsolete files.
- Seed data reuses some project and CMS images across records. An image must be deleted only after checking all live references; local `/images/...` assets and external URLs must never be passed to Storage deletion.

## Proposed changes

| Change Description | Route | Files Affected | Type |
| --- | --- | --- | --- |
| Add server-only media helpers to parse and validate URLs for this Supabase project's `portfolio-media` bucket, collect references across all image-bearing tables, deduplicate candidate paths, and delete only paths with no remaining references. Treat unreadable reference queries as a reason to skip deletion and report an error. | Shared server actions | `src/lib/images/storage-cleanup.ts` | NEW |
| Capture the stored portrait URL before deleting a person or updating their photo. After the database mutation succeeds, remove the previous file if it is unreferenced. Keep the fallback avatar, external URLs, and other persons' images safe. | `/admin/people` | `src/app/actions/admin-mutations.ts` | MODIFY |
| Capture the project’s `project_media` URLs before deletion. On gallery edits, compare old and saved URLs and clean up only removed images after the new media rows are committed. Check every database error during gallery replacement before deleting any file. | `/admin/projects` | `src/app/actions/admin-mutations.ts` | MODIFY |
| Apply the same old-versus-new cleanup to Manage Content image updates and slide deletion. Include page heroes, navigation cards, process and service images, and home slides. Preserve images still referenced by other content, including seed and fallback content. | `/admin/content` | `src/app/actions/admin-mutations.ts` | MODIFY |
| Track files uploaded during an unsaved form session. On cancel, clean up only uploads created in that session that have no saved reference; on successful save, retain the selected upload and clean up superseded uploads. Make the existing home-slide flow await save success before clearing its temporary-upload list. | `/admin/people`, `/admin/projects`, `/admin/content` | `src/components/admin/ImageManagerField.tsx`; `src/app/admin/people/AdminPeopleClient.tsx`; `src/app/admin/projects/AdminProjectsClient.tsx`; `src/components/admin/cms/CmsLandingPagesTab.tsx`; `src/components/admin/cms/CmsHomeTab.tsx`; relevant CMS save hooks | MODIFY |
| Restrict the existing arbitrary-URL storage delete action to validated bucket paths and unreferenced files, using the shared helper. Ensure the server-side actions authorize the requested mutation before using the service-role client. | Admin image operations | `src/app/actions/admin-mutations.ts`; `src/lib/images/storage-cleanup.ts` | MODIFY |
| Add a dry-run report for existing unreferenced files in `portfolio-media`, with an explicit apply mode after review. Include references from every image-bearing table and JSON settings, plus code-level fallback assets, before proposing deletion. | Maintenance script | `scripts/audit-orphaned-media.ts` | NEW |

## Cleanup sequence

1. Read the existing database image URLs for the record being changed.
2. Perform and verify the database save or delete. For project galleries, ensure replacement rows are persisted before cleanup.
3. Compute removed URLs, normalize only owned `portfolio-media` URLs to storage paths, then check references across all image-bearing tables. Also preserve assets referenced by application fallbacks.
4. Remove truly unreferenced objects from Storage. Surface and log cleanup failures so they can be retried; do not claim full cleanup when Storage removal fails.

## Verification

1. Delete a person and a project; verify their unshared Storage objects disappear and the related database rows are gone.
2. Replace and remove a portrait; verify the previous uploaded image disappears only after the new profile saves. Confirm the default portrait remains available.
3. Remove and reorder project gallery images; only removed, unshared objects should be deleted. Verify a failed media save leaves previous objects intact.
4. Replace CMS images and delete a homepage slide; check shared seed images and other content still render. Cancel an upload in each editor and confirm no unused upload remains.
5. Exercise an external image URL, a local asset, a duplicate URL, and a shared Storage URL. None should cause an inappropriate delete.
6. Run TypeScript/build checks and inspect the audit script’s dry-run output before any historical cleanup.

## Scope note

This plan covers Supabase Storage objects, where the image bytes are stored. The database holds their URLs. Historical orphan cleanup should be reviewed separately from the automatic cleanup added to admin mutations.
