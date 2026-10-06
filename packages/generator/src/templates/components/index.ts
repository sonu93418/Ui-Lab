import type { UIGenConfig } from '@uigen/config';
import {
  buttonTemplate,
  inputTemplate,
  badgeTemplate,
  cardTemplate,
  avatarTemplate,
  skeletonTemplate,
  spinnerTemplate,
  modalTemplate,
  tabsTemplate,
  toastTemplate,
  dropdownTemplate,
  tableTemplate,
  statsCardTemplate,
  sidebarTemplate,
  selectTemplate,
} from './templates.js';

export type ComponentTemplate = string | ((config: UIGenConfig) => string);

export const COMPONENT_TEMPLATES: Record<string, ComponentTemplate> = {
  button: buttonTemplate,
  input: inputTemplate,
  badge: badgeTemplate,
  card: cardTemplate,
  avatar: avatarTemplate,
  skeleton: skeletonTemplate,
  spinner: spinnerTemplate,
  modal: modalTemplate,
  tabs: tabsTemplate,
  toast: toastTemplate,
  dropdown: dropdownTemplate,
  table: tableTemplate,
  'stats-card': statsCardTemplate,
  sidebar: sidebarTemplate,
  select: selectTemplate,
};
