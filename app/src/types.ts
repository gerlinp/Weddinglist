export interface Status {
  id: string;
  name: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Side {
  id: string;
  name: string;
}

export interface Person {
  id: string;
  name: string;
  statusId: string;
  tagId: string | null;
  sideId: string;
  isChild: boolean;
  isMinor: boolean;
  isPlusOne: boolean;
  plusOneOf: string | null;
  hasPlusOne: boolean;
  plusOneId: string | null;
}

export interface Filters {
  statusIds: string[];
  tagIds: string[];
  onlyChildren: boolean;
  onlyMinors: boolean;
}

export interface UIState {
  showAddModal: boolean;
  showTagModal: boolean;
  showFamilyModal: boolean;
  showFilters: boolean;
  showExportMenu: boolean;
  editingTagId: string | null;
  newTagName: string;
  newTagColor: string;
  pasteText: string;
  pasteTargetStatusId: string;
  pasteTargetTagId: string;
  pasteTargetSideId: string;
  pasteWithPlusOne: boolean;
  familyName: string;
  familyColor: string;
  familyStatusId: string;
  familySideId: string;
  familyAdult1: string;
  familyAdult2: string;
  familyChildren: string[];
}

export interface AppState {
  eventTitle: string;
  eventSubtitle: string;
  statuses: Status[];
  tags: Tag[];
  people: Person[];
  sides: Side[];
  activeSideView: string;
  filters: Filters;
  drag: { type: 'person'; id: string } | { type: 'group'; tagId: string } | null;
  dragOverStatusId: string | null;
  openMenuId: string | null;
  ui: UIState;
}
