# Manage People profile photo fallback — implementation plan

## Current behavior

- The create form starts with a hard-coded Unsplash portrait in `EMPTY_MEMBER.image`, so it appears to have a photo before anyone uploads one.
- The edit form passes `member.image` directly to `ImageManagerField`. The field previews every nonempty value with `next/image` and has no image-load fallback.
- `savePersonAction` writes the portrait fallback path when no photo is supplied. The current database schema requires `profile_photo_url` to be non-null, so that fallback path can also appear in an existing person's record.
- The list and grid already use `PersonCircleAvatar`, which handles missing or failed images. The requested change concerns the add/edit photo manager.

## Proposed changes

| Change Description | Route | Files Affected | Type |
| --- | --- | --- | --- |
| Start new people with an empty `image`, and treat empty values and the stored portrait fallback path as “no uploaded photo” when passing images to the photo manager. Keep the member record's actual value intact until the user changes it. | `/admin/people` (linked from `/admin/dashboard`) | `src/app/admin/people/AdminPeopleClient.tsx` | MODIFY |
| Add an optional empty-state fallback to the shared image manager. In the single-photo mode, show the existing portrait fallback inside the upload area when there is no uploaded photo. Keep click, drag-and-drop, and replacement available. If an existing photo URL fails to load, show the fallback instead of a broken image. Leave gallery behavior unchanged. | `/admin/people` | `src/components/admin/ImageManagerField.tsx` | MODIFY |
| Use the existing `FALLBACK_AVATAR_PORTRAIT` asset for the empty photo manager. Preserve the server's fallback value on save because `profile_photo_url` is currently non-null in the schema; recognize that value as an empty upload on later edits. | `/admin/people` | `src/app/admin/people/AdminPeopleClient.tsx`; `src/app/actions/admin-mutations.ts` (only if save normalization needs adjustment) | MODIFY |

## Verification

1. Open **Add Person**: the portrait area shows the fallback avatar and upload control, with no request for the old Unsplash default.
2. Open **Edit Person** for records with a null or empty photo value, and for records storing the fallback path: each shows the fallback and upload control.
3. Open **Edit Person** with a valid uploaded photo: it previews the photo. Replace and remove it, then confirm the fallback appears after removal and the change saves correctly.
4. Open a record with an inaccessible photo URL: the preview switches to the fallback without a broken-image icon, and replace/remove still work.
5. Run TypeScript/lint checks and verify the photo manager still works for project galleries.
