import * as migration_20260925_074113_initial from './20260925_074113_initial';
import * as migration_20260926_173225_blob_storage from './20260926_173225_blob_storage';
import * as migration_20261007_101955_footer_add_socials_legal from './20261007_101955_footer_add_socials_legal';
import * as migration_20261007_102016_footer_remove_old_fields from './20261007_102016_footer_remove_old_fields';

export const migrations = [
  {
    up: migration_20260925_074113_initial.up,
    down: migration_20260925_074113_initial.down,
    name: '20260925_074113_initial',
  },
  {
    up: migration_20260926_173225_blob_storage.up,
    down: migration_20260926_173225_blob_storage.down,
    name: '20260926_173225_blob_storage',
  },
  {
    up: migration_20261007_101955_footer_add_socials_legal.up,
    down: migration_20261007_101955_footer_add_socials_legal.down,
    name: '20261007_101955_footer_add_socials_legal',
  },
  {
    up: migration_20261007_102016_footer_remove_old_fields.up,
    down: migration_20261007_102016_footer_remove_old_fields.down,
    name: '20261007_102016_footer_remove_old_fields'
  },
];
