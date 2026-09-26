import * as migration_20260925_074113_initial from './20260925_074113_initial';
import * as migration_20260926_173225_blob_storage from './20260926_173225_blob_storage';

export const migrations = [
  {
    up: migration_20260925_074113_initial.up,
    down: migration_20260925_074113_initial.down,
    name: '20260925_074113_initial',
  },
  {
    up: migration_20260926_173225_blob_storage.up,
    down: migration_20260926_173225_blob_storage.down,
    name: '20260926_173225_blob_storage'
  },
];
