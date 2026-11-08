import * as migration_20260925_074113_initial from './20260925_074113_initial';
import * as migration_20260926_173225_blob_storage from './20260926_173225_blob_storage';
import * as migration_20261007_101955_footer_add_socials_legal from './20261007_101955_footer_add_socials_legal';
import * as migration_20261007_102016_footer_remove_old_fields from './20261007_102016_footer_remove_old_fields';
import * as migration_20261014_123000_header_nav_figma from './20261014_123000_header_nav_figma';
import * as migration_20261014_130000_work_page from './20261014_130000_work_page';
import * as migration_20261108_074726_services from './20261108_074726_services';
import * as migration_20261108_085042_service_menu_icon from './20261108_085042_service_menu_icon';
import * as migration_20261108_091013_about_page from './20261108_091013_about_page';
import * as migration_20261108_093455_contact_careers from './20261108_093455_contact_careers';
import * as migration_20261108_094006_case_study_details from './20261108_094006_case_study_details';
import * as migration_20261109_120000_clear_dev_push_marker from './20261109_120000_clear_dev_push_marker';

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
    name: '20261007_102016_footer_remove_old_fields',
  },
  {
    up: migration_20261014_123000_header_nav_figma.up,
    down: migration_20261014_123000_header_nav_figma.down,
    name: '20261014_123000_header_nav_figma',
  },
  {
    up: migration_20261014_130000_work_page.up,
    down: migration_20261014_130000_work_page.down,
    name: '20261014_130000_work_page',
  },
  {
    up: migration_20261108_074726_services.up,
    down: migration_20261108_074726_services.down,
    name: '20261108_074726_services',
  },
  {
    up: migration_20261108_085042_service_menu_icon.up,
    down: migration_20261108_085042_service_menu_icon.down,
    name: '20261108_085042_service_menu_icon',
  },
  {
    up: migration_20261108_091013_about_page.up,
    down: migration_20261108_091013_about_page.down,
    name: '20261108_091013_about_page',
  },
  {
    up: migration_20261108_093455_contact_careers.up,
    down: migration_20261108_093455_contact_careers.down,
    name: '20261108_093455_contact_careers',
  },
  {
    up: migration_20261108_094006_case_study_details.up,
    down: migration_20261108_094006_case_study_details.down,
    name: '20261108_094006_case_study_details',
  },
  {
    up: migration_20261109_120000_clear_dev_push_marker.up,
    down: migration_20261109_120000_clear_dev_push_marker.down,
    name: '20261109_120000_clear_dev_push_marker',
  },
];
