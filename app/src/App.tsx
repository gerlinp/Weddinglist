import { useEffect, useReducer, useRef } from 'react';
import type { AppState, Filters, Person, Status, Tag } from './types';
import { genId, PALETTE, STORAGE_KEY, tint } from './utils';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { LoginScreen } from './LoginScreen';
import { Header } from './components/Header';
import { ViewSwitcher } from './components/ViewSwitcher';
import { Toolbar } from './components/Toolbar';
import { FiltersPanel } from './components/FiltersPanel';
import { CountsBar } from './components/CountsBar';
import { Board } from './components/Board';
import { AddGuestsModal } from './components/AddGuestsModal';
import { AddFamilyModal } from './components/AddFamilyModal';
import { TagModal } from './components/TagModal';

const DEFAULT_STATE: AppState = {
  eventTitle: 'Our Wedding Guest List',
  eventSubtitle: '',
  statuses: [
    { id: 'status_guaranteed', name: 'Guaranteed', color: 'oklch(52% 0.18 264)' },
    { id: 'status_invited', name: 'Invited', color: 'oklch(58% 0.16 45)' },
    { id: 'status_maybe', name: 'Maybe', color: 'oklch(65% 0.03 60)' },
  ],
  tags: [],
  people: [],
  sides: [
    { id: 'side_his', name: 'His' },
    { id: 'side_hers', name: 'Hers' },
  ],
  activeSideView: 'combined',
  filters: {
    statusIds: ['status_guaranteed', 'status_invited', 'status_maybe'],
    tagIds: ['none'],
    onlyChildren: false,
    onlyMinors: false,
  },
  drag: null,
  dragOverStatusId: null,
  openMenuId: null,
  ui: {
    showAddModal: false,
    showTagModal: false,
    showFamilyModal: false,
    showFilters: false,
    showExportMenu: false,
    editingTagId: null,
    newTagName: '',
    newTagColor: PALETTE[0],
    pasteText: '',
    pasteTargetStatusId: '',
    pasteTargetTagId: '',
    pasteTargetSideId: '',
    pasteWithPlusOne: false,
    familyName: '',
    familyColor: PALETTE[0],
    familyStatusId: '',
    familySideId: '',
    familyAdult1: '',
    familyAdult2: '',
    familyChildren: [''],
  },
};

type Action = { type: 'SET'; payload: Partial<AppState> } | { type: 'LOAD'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET':
      return { ...state, ...action.payload };
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDoneRef = useRef(false);

  const setState = (patchOrFn: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    if (typeof patchOrFn === 'function') {
      dispatch({ type: 'SET', payload: patchOrFn(state) });
    } else {
      dispatch({ type: 'SET', payload: patchOrFn });
    }
  };

  // Load from Supabase when user signs in, fall back to localStorage for offline dev
  useEffect(() => {
    initialLoadDoneRef.current = false;
    if (!user) return;
    supabase
      .from('lists')
      .select('data')
      .eq('owner_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('[weddinglist] load error', error);
          // fall back to localStorage so dev without a real project still works
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && Array.isArray(parsed.people)) {
                dispatch({ type: 'LOAD', payload: { ...DEFAULT_STATE, ...parsed, drag: null, dragOverStatusId: null, openMenuId: null } });
              }
            }
          } catch (_) {}
        } else if (data?.data && Array.isArray((data.data as AppState).people)) {
          dispatch({ type: 'LOAD', payload: { ...DEFAULT_STATE, ...(data.data as AppState), drag: null, dragOverStatusId: null, openMenuId: null } });
        }
        initialLoadDoneRef.current = true;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Debounced save to Supabase (1.5 s after last change)
  useEffect(() => {
    if (!user || !initialLoadDoneRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const { eventTitle, eventSubtitle, statuses, tags, people, filters, sides, activeSideView } = state;
      const payload = { eventTitle, eventSubtitle, statuses, tags, people, filters, sides, activeSideView };
      supabase
        .from('lists')
        .upsert({ owner_id: user.id, data: payload, updated_at: new Date().toISOString() }, { onConflict: 'owner_id' })
        .then(({ error }) => { if (error) console.error('[weddinglist] save error', error); });
    }, 1500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [state, user]);

  const closeAllMenus = () => {
    if (state.openMenuId !== null || state.ui.showExportMenu) {
      dispatch({ type: 'SET', payload: { openMenuId: null, ui: { ...state.ui, showExportMenu: false } } });
    }
  };

  // ---- people ----
  const updatePerson = (id: string, patch: Partial<Person>) => {
    setState(s => ({ people: s.people.map(p => p.id === id ? { ...p, ...patch } : p) }));
  };

  const removePerson = (id: string) => {
    setState(s => {
      const person = s.people.find(p => p.id === id);
      let people = s.people.filter(p => p.id !== id);
      if (person?.plusOneId) people = people.filter(p => p.id !== person.plusOneId);
      if (person?.isPlusOne && person.plusOneOf) {
        people = people.map(p => p.id === person.plusOneOf ? { ...p, hasPlusOne: false, plusOneId: null } : p);
      }
      return { people };
    });
  };

  const togglePlusOne = (id: string) => {
    setState(s => {
      const person = s.people.find(p => p.id === id);
      if (!person) return {};
      if (person.hasPlusOne && person.plusOneId) {
        const companionId = person.plusOneId;
        return {
          people: s.people
            .filter(p => p.id !== companionId)
            .map(p => p.id === id ? { ...p, hasPlusOne: false, plusOneId: null } : p),
        };
      } else {
        const cid = genId('p');
        const companion: Person = {
          id: cid,
          name: `${person.name}'s +1`,
          statusId: person.statusId,
          tagId: person.tagId,
          sideId: person.sideId,
          isChild: false,
          isMinor: false,
          isPlusOne: true,
          plusOneOf: id,
          hasPlusOne: false,
          plusOneId: null,
        };
        const idx = s.people.findIndex(p => p.id === id);
        const people = [...s.people];
        people[idx] = { ...person, hasPlusOne: true, plusOneId: cid };
        people.splice(idx + 1, 0, companion);
        return { people };
      }
    });
  };

  const toggleTagMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setState(s => ({ openMenuId: s.openMenuId === id ? null : id }));
  };

  // ---- statuses ----
  const addStatus = () => {
    const id = genId('status');
    const color = PALETTE[state.statuses.length % PALETTE.length];
    const newStatus: Status = { id, name: 'New Group', color };
    setState(s => ({
      statuses: [...s.statuses, newStatus],
      filters: { ...s.filters, statusIds: [...s.filters.statusIds, id] },
    }));
  };

  const renameStatus = (id: string, name: string) => {
    setState(s => ({ statuses: s.statuses.map(st => st.id === id ? { ...st, name } : st) }));
  };

  const deleteStatus = (id: string) => {
    setState(s => {
      const remaining = s.statuses.filter(st => st.id !== id);
      const fallbackId = remaining[0]?.id ?? '';
      return {
        statuses: remaining,
        people: s.people.map(p => p.statusId === id ? { ...p, statusId: fallbackId } : p),
        filters: { ...s.filters, statusIds: s.filters.statusIds.filter(x => x !== id) },
      };
    });
  };

  // ---- tags ----
  const openNewTagModal = () => {
    const color = PALETTE[state.tags.length % PALETTE.length];
    setState(s => ({ ui: { ...s.ui, showTagModal: true, editingTagId: null, newTagName: '', newTagColor: color } }));
  };

  const openEditTagModal = (tag: Tag) => {
    setState(s => ({ ui: { ...s.ui, showTagModal: true, editingTagId: tag.id, newTagName: tag.name, newTagColor: tag.color } }));
  };

  const closeTagModal = () => setState(s => ({ ui: { ...s.ui, showTagModal: false } }));

  const saveTag = () => {
    const name = state.ui.newTagName.trim();
    const color = state.ui.newTagColor;
    if (!name) return;
    if (state.ui.editingTagId) {
      setState(s => ({
        tags: s.tags.map(t => t.id === s.ui.editingTagId ? { ...t, name, color } : t),
        ui: { ...s.ui, showTagModal: false },
      }));
    } else {
      const id = genId('tag');
      setState(s => ({
        tags: [...s.tags, { id, name, color }],
        filters: { ...s.filters, tagIds: [...s.filters.tagIds, id] },
        ui: { ...s.ui, showTagModal: false },
      }));
    }
  };

  const deleteTag = () => {
    const id = state.ui.editingTagId;
    if (!id) return;
    setState(s => ({
      tags: s.tags.filter(t => t.id !== id),
      people: s.people.map(p => p.tagId === id ? { ...p, tagId: null } : p),
      filters: { ...s.filters, tagIds: s.filters.tagIds.filter(x => x !== id) },
      ui: { ...s.ui, showTagModal: false },
    }));
  };

  // ---- add family ----
  const openFamilyModal = () => {
    const color = PALETTE[state.tags.length % PALETTE.length];
    setState(s => ({
      ui: {
        ...s.ui,
        showFamilyModal: true,
        familyName: '',
        familyColor: color,
        familyStatusId: '',
        familySideId: '',
        familyAdult1: '',
        familyAdult2: '',
        familyChildren: [''],
      },
    }));
  };

  const closeFamilyModal = () => setState(s => ({ ui: { ...s.ui, showFamilyModal: false } }));

  const submitFamily = () => {
    const name = state.ui.familyName.trim();
    if (!name) return;
    const color = state.ui.familyColor;
    const statusId = state.ui.familyStatusId || state.statuses[0]?.id;
    const sideId = state.ui.familySideId || state.sides[0]?.id;
    const tagId = genId('tag');
    const tag: Tag = { id: tagId, name, color };
    const makePerson = (personName: string, isChild: boolean): Person => ({
      id: genId('p'),
      name: personName,
      statusId,
      tagId,
      sideId,
      isChild,
      isMinor: false,
      isPlusOne: false,
      plusOneOf: null,
      hasPlusOne: false,
      plusOneId: null,
    });
    const newPeople: Person[] = [];
    const adult1 = state.ui.familyAdult1.trim();
    const adult2 = state.ui.familyAdult2.trim();
    if (adult1) newPeople.push(makePerson(adult1, false));
    if (adult2) newPeople.push(makePerson(adult2, false));
    state.ui.familyChildren.forEach(childName => {
      const trimmed = childName.trim();
      if (trimmed) newPeople.push(makePerson(trimmed, true));
    });
    setState(s => ({
      tags: [...s.tags, tag],
      people: [...s.people, ...newPeople],
      filters: { ...s.filters, tagIds: [...s.filters.tagIds, tagId] },
      ui: { ...s.ui, showFamilyModal: false },
    }));
  };

  // ---- add guests modal ----
  const openAddModal = () => {
    setState(s => ({ ui: { ...s.ui, showAddModal: true, pasteText: '', pasteTargetStatusId: '', pasteTargetTagId: '', pasteTargetSideId: '', pasteWithPlusOne: false } }));
  };

  const closeAddModal = () => setState(s => ({ ui: { ...s.ui, showAddModal: false } }));

  const submitPaste = () => {
    const lines = state.ui.pasteText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const statusId = state.ui.pasteTargetStatusId || state.statuses[0]?.id;
    const tagId = state.ui.pasteTargetTagId || null;
    const sideId = state.ui.pasteTargetSideId ||
      (state.activeSideView !== 'combined' ? state.activeSideView : state.sides[0]?.id);
    const withPlusOne = state.ui.pasteWithPlusOne;
    const newPeople: Person[] = [];
    lines.forEach(name => {
      const pid = genId('p');
      const person: Person = { id: pid, name, statusId, tagId, sideId, isChild: false, isMinor: false, isPlusOne: false, plusOneOf: null, hasPlusOne: false, plusOneId: null };
      if (withPlusOne) {
        const cid = genId('p');
        person.hasPlusOne = true;
        person.plusOneId = cid;
        newPeople.push(person);
        newPeople.push({ id: cid, name: `${name}'s +1`, statusId, tagId, sideId, isChild: false, isMinor: false, isPlusOne: true, plusOneOf: pid, hasPlusOne: false, plusOneId: null });
      } else {
        newPeople.push(person);
      }
    });
    setState(s => ({ people: [...s.people, ...newPeople], ui: { ...s.ui, showAddModal: false, pasteText: '', pasteWithPlusOne: false } }));
  };

  // ---- filters ----
  const toggleStatusFilter = (id: string) => {
    setState(s => {
      const has = s.filters.statusIds.includes(id);
      return { filters: { ...s.filters, statusIds: has ? s.filters.statusIds.filter(x => x !== id) : [...s.filters.statusIds, id] } };
    });
  };

  const toggleTagFilter = (id: string) => {
    setState(s => {
      const has = s.filters.tagIds.includes(id);
      return { filters: { ...s.filters, tagIds: has ? s.filters.tagIds.filter(x => x !== id) : [...s.filters.tagIds, id] } };
    });
  };

  const toggleOnlyChildren = () => setState(s => ({ filters: { ...s.filters, onlyChildren: !s.filters.onlyChildren } }));
  const toggleOnlyMinors = () => setState(s => ({ filters: { ...s.filters, onlyMinors: !s.filters.onlyMinors } }));
  const resetFilters = () => {
    setState(s => ({
      filters: {
        statusIds: s.statuses.map(c => c.id),
        tagIds: [...s.tags.map(t => t.id), 'none'],
        onlyChildren: false,
        onlyMinors: false,
      },
    }));
  };

  // ---- sides ----
  const renameSide = (id: string, name: string) => {
    setState(s => ({ sides: s.sides.map(sd => sd.id === id ? { ...sd, name } : sd) }));
  };

  // ---- drag and drop ----
  const onDragStartPerson = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    dispatch({ type: 'SET', payload: { drag: { type: 'person', id } } });
  };

  const onDragStartGroup = (e: React.DragEvent, tagId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    dispatch({ type: 'SET', payload: { drag: { type: 'group', tagId } } });
  };

  const clearDrag = () => dispatch({ type: 'SET', payload: { drag: null, dragOverStatusId: null } });

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDragOverColumn = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (state.dragOverStatusId !== colId) dispatch({ type: 'SET', payload: { dragOverStatusId: colId } });
  };

  const onDropOn = (e: React.DragEvent, statusId: string, tagId: string | null) => {
    e.preventDefault();
    const drag = state.drag;
    if (!drag) return;
    if (drag.type === 'person') {
      setState(s => ({
        people: s.people.map(p => {
          if (p.id !== drag.id) return p;
          return { ...p, statusId, ...(tagId !== null ? { tagId } : {}) };
        }),
        drag: null,
        dragOverStatusId: null,
      }));
    } else if (drag.type === 'group') {
      setState(s => ({
        people: s.people.map(p => p.tagId === drag.tagId ? { ...p, statusId } : p),
        drag: null,
        dragOverStatusId: null,
      }));
    }
  };

  // ---- export / import ----
  const safeFileName = () => (state.eventTitle || 'guest-list').trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'guest-list';

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const { eventTitle, eventSubtitle, statuses, tags, people, sides, activeSideView } = state;
    downloadFile(`${safeFileName()}.json`, JSON.stringify({ eventTitle, eventSubtitle, statuses, tags, people, sides, activeSideView, exportedAt: new Date().toISOString() }, null, 2), 'application/json');
    setState(s => ({ ui: { ...s.ui, showExportMenu: false } }));
  };

  const exportCSV = () => {
    const { statuses, tags, people } = state;
    const statusById: Record<string, string> = {};
    statuses.forEach(st => (statusById[st.id] = st.name));
    const tagById: Record<string, string> = {};
    tags.forEach(t => (tagById[t.id] = t.name));
    const esc = (v: unknown) => {
      const str = String(v == null ? '' : v);
      return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
    };
    const rows = [['Name', 'Group', 'Family Tag', 'Child', 'Under 21', 'Plus One'].join(',')];
    people.forEach(p => {
      const parent = p.isPlusOne && p.plusOneOf ? people.find(x => x.id === p.plusOneOf) : null;
      const plusOneVal = parent ? `Yes (of ${parent.name})` : p.hasPlusOne ? 'Yes' : 'No';
      rows.push([esc(p.name), esc(statusById[p.statusId] || ''), esc(p.tagId ? tagById[p.tagId] || '' : ''), esc(p.isChild ? 'Yes' : 'No'), esc(p.isMinor ? 'Yes' : 'No'), esc(plusOneVal)].join(','));
    });
    downloadFile(`${safeFileName()}.csv`, rows.join('\n'), 'text/csv');
    setState(s => ({ ui: { ...s.ui, showExportMenu: false } }));
  };

  const triggerImport = () => fileInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data || !Array.isArray(data.people) || !Array.isArray(data.statuses)) {
          window.alert("That file doesn't look like a guest list export.");
          return;
        }
        if (state.people.length > 0) {
          const ok = window.confirm('Importing will replace your current guest list. Continue?');
          if (!ok) return;
        }
        const sides = Array.isArray(data.sides) && data.sides.length > 0 ? data.sides : [{ id: 'side_his', name: 'His' }, { id: 'side_hers', name: 'Hers' }];
        const tags = Array.isArray(data.tags) ? data.tags : [];
        const statuses: Status[] = data.statuses;
        dispatch({
          type: 'LOAD',
          payload: {
            ...DEFAULT_STATE,
            eventTitle: data.eventTitle || DEFAULT_STATE.eventTitle,
            eventSubtitle: data.eventSubtitle || '',
            statuses,
            tags,
            people: data.people,
            sides,
            activeSideView: data.activeSideView || 'combined',
            filters: { statusIds: statuses.map(st => st.id), tagIds: [...tags.map((t: Tag) => t.id), 'none'], onlyChildren: false, onlyMinors: false },
          },
        });
      } catch (_) {
        window.alert("Could not read that file. Make sure it's a guest list JSON export.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ---- derived ----
  const isVisible = (p: Person, filters: Filters, sideView: string) => {
    if (!filters.statusIds.includes(p.statusId)) return false;
    const tagKey = p.tagId || 'none';
    if (!filters.tagIds.includes(tagKey)) return false;
    if (filters.onlyChildren || filters.onlyMinors) {
      const matches = (filters.onlyChildren && p.isChild) || (filters.onlyMinors && p.isMinor);
      if (!matches) return false;
    }
    if (sideView && sideView !== 'combined') {
      const ps = p.sideId || state.sides[0]?.id;
      if (ps !== sideView) return false;
    }
    return true;
  };

  const sideColors = ['oklch(48% 0.18 264)', 'oklch(50% 0.16 45)'];

  const buildPersonVM = (p: Person) => {
    const resolvedSideId = p.sideId || state.sides[0]?.id || '';
    const sideIdx = Math.max(0, state.sides.findIndex(sd => sd.id === resolvedSideId));
    const assignedTag = state.tags.find(t => t.id === p.tagId);
    return {
      id: p.id,
      name: p.name,
      tagId: p.tagId || '',
      sideId: resolvedSideId,
      showSideDot: state.activeSideView === 'combined',
      sideDotColor: sideColors[sideIdx % sideColors.length],
      isPlusOne: !!p.isPlusOne,
      hasPlusOne: !!p.hasPlusOne,
      showPlusOneToggle: !p.isPlusOne,
      isChild: !!p.isChild,
      isMinor: !!p.isMinor,
      isMenuOpen: state.openMenuId === p.id,
      onToggleMenu: (e: React.MouseEvent) => toggleTagMenu(e, p.id),
      onDragStart: (e: React.DragEvent) => onDragStartPerson(e, p.id),
      onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => updatePerson(p.id, { name: e.target.value }),
      onToggleChild: () => updatePerson(p.id, { isChild: !p.isChild }),
      onToggleMinor: () => updatePerson(p.id, { isMinor: !p.isMinor }),
      onTogglePlusOne: () => togglePlusOne(p.id),
      onTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => updatePerson(p.id, { tagId: e.target.value || null }),
      onSideChange: (e: React.ChangeEvent<HTMLSelectElement>) => updatePerson(p.id, { sideId: e.target.value }),
      onDelete: () => removePerson(p.id),
      tagSelectBg: assignedTag ? tint(assignedTag.color, 0.3) : 'oklch(99% 0.003 80)',
      tagSelectBorder: assignedTag ? assignedTag.color : 'oklch(88% 0.008 80)',
      childBg: p.isChild ? 'oklch(70% 0.15 45 / 0.3)' : 'transparent',
      childBorder: p.isChild ? 'oklch(50% 0.16 45)' : 'oklch(85% 0.01 80)',
      childColor: p.isChild ? 'oklch(36% 0.14 45)' : 'oklch(58% 0.01 80)',
      minorBg: p.isMinor ? 'oklch(68% 0.16 264 / 0.3)' : 'transparent',
      minorBorder: p.isMinor ? 'oklch(48% 0.18 264)' : 'oklch(85% 0.01 80)',
      minorColor: p.isMinor ? 'oklch(36% 0.16 264)' : 'oklch(58% 0.01 80)',
    };
  };

  const allVisible = state.people.filter(p => isVisible(p, state.filters, state.activeSideView));
  const filtersActive =
    state.filters.onlyChildren ||
    state.filters.onlyMinors ||
    state.filters.statusIds.length !== state.statuses.length ||
    state.filters.tagIds.length !== state.tags.length + 1;

  const tagOptions = [{ id: '', name: 'No tag' }, ...state.tags.map(t => ({ id: t.id, name: t.name }))];
  const sideOptions = state.sides.map(sd => ({ id: sd.id, name: sd.name }));

  const statusColumns = state.statuses.map(col => {
    const colVisible = state.people.filter(p => p.statusId === col.id && isVisible(p, state.filters, state.activeSideView));
    const tagById: Record<string, Tag> = {};
    state.tags.forEach(t => (tagById[t.id] = t));

    const groups: Array<{
      key: string;
      isTagGroup: boolean;
      isLoose: boolean;
      tagId?: string;
      tagName?: string;
      tagColor?: string;
      tintBg?: string;
      memberCount?: number;
      members: ReturnType<typeof buildPersonVM>[];
      onDragStart?: (e: React.DragEvent) => void;
      onDragOver?: (e: React.DragEvent) => void;
      onDrop?: (e: React.DragEvent) => void;
    }> = [];

    state.tags.forEach(t => {
      const members = colVisible.filter(p => p.tagId === t.id).map(p => buildPersonVM(p));
      if (members.length > 0) {
        groups.push({
          key: 'tag_' + t.id,
          isTagGroup: true,
          isLoose: false,
          tagId: t.id,
          tagName: t.name,
          tagColor: t.color,
          tintBg: tint(t.color, 0.38),
          memberCount: members.length,
          members,
          onDragStart: (e: React.DragEvent) => onDragStartGroup(e, t.id),
          onDragOver: allowDrop,
          onDrop: (e: React.DragEvent) => onDropOn(e, col.id, t.id),
        });
      }
    });

    const looseMembers = colVisible.filter(p => !p.tagId || !tagById[p.tagId]).map(p => buildPersonVM(p));
    if (looseMembers.length > 0) {
      groups.push({ key: 'loose', isTagGroup: false, isLoose: true, members: looseMembers });
    }

    return {
      id: col.id,
      name: col.name,
      color: col.color,
      count: colVisible.length,
      isEmpty: colVisible.length === 0,
      canDelete: state.statuses.length > 1,
      groups,
      bodyBg: state.dragOverStatusId === col.id ? tint(col.color, 0.08) : 'transparent',
      onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => renameStatus(col.id, e.target.value),
      onDelete: () => deleteStatus(col.id),
      onDragOver: (e: React.DragEvent) => onDragOverColumn(e, col.id),
      onDrop: (e: React.DragEvent) => onDropOn(e, col.id, null),
    };
  });

  const statusFilterChips = state.statuses.map(col => ({
    id: col.id,
    name: col.name,
    color: col.color,
    active: state.filters.statusIds.includes(col.id),
    onToggle: () => toggleStatusFilter(col.id),
  }));

  const tagFilterChips = [
    ...state.tags.map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
      active: state.filters.tagIds.includes(t.id),
      onToggle: () => toggleTagFilter(t.id),
    })),
    {
      id: 'none',
      name: 'No family tag',
      color: 'oklch(70% 0.01 80)',
      active: state.filters.tagIds.includes('none'),
      onToggle: () => toggleTagFilter('none'),
    },
  ];

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'oklch(98% 0.008 80)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid oklch(85% 0.01 80)', borderTopColor: 'oklch(52% 0.18 264)', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div
      onClick={closeAllMenus}
      style={{ minHeight: '100vh', background: 'oklch(98% 0.008 80)', color: 'oklch(24% 0.015 80)', fontFamily: "'Jost', sans-serif" }}
    >
      <Header
        title={state.eventTitle}
        subtitle={state.eventSubtitle}
        onTitleChange={e => dispatch({ type: 'SET', payload: { eventTitle: e.target.value } })}
        onSubtitleChange={e => dispatch({ type: 'SET', payload: { eventSubtitle: e.target.value } })}
        onSignOut={signOut}
        userEmail={user.email}
      />

      <ViewSwitcher
        sides={state.sides}
        activeSideView={state.activeSideView}
        onSelectSide={id => dispatch({ type: 'SET', payload: { activeSideView: id } })}
        onSelectCombined={() => dispatch({ type: 'SET', payload: { activeSideView: 'combined' } })}
        onRenameSide={renameSide}
      />

      <Toolbar
        tags={state.tags}
        ui={state.ui}
        filtersActive={filtersActive}
        onOpenAddModal={openAddModal}
        onAddStatus={addStatus}
        onOpenNewTagModal={openNewTagModal}
        onOpenFamilyModal={openFamilyModal}
        onEditTag={openEditTagModal}
        onToggleExportMenu={() => setState(s => ({ ui: { ...s.ui, showExportMenu: !s.ui.showExportMenu } }))}
        onExportJSON={exportJSON}
        onExportCSV={exportCSV}
        onTriggerImport={triggerImport}
        onToggleFilters={() => setState(s => ({ ui: { ...s.ui, showFilters: !s.ui.showFilters } }))}
        fileInputRef={fileInputRef}
        onImportFile={handleImportFile}
      />

      {state.ui.showFilters && (
        <FiltersPanel
          statusFilterChips={statusFilterChips}
          tagFilterChips={tagFilterChips}
          onlyChildren={state.filters.onlyChildren}
          onlyMinors={state.filters.onlyMinors}
          onToggleOnlyChildren={toggleOnlyChildren}
          onToggleOnlyMinors={toggleOnlyMinors}
          onResetFilters={resetFilters}
        />
      )}

      <CountsBar
        total={allVisible.length}
        adults={allVisible.filter(p => !p.isChild).length}
        children={allVisible.filter(p => p.isChild).length}
        minors={allVisible.filter(p => p.isMinor).length}
        filtersActive={filtersActive}
        statusColumns={state.statuses.map(col => ({
          id: col.id,
          name: col.name,
          color: col.color,
          count: state.people.filter(p => p.statusId === col.id && isVisible(p, state.filters, state.activeSideView)).length,
        }))}
      />

      <Board
        statusColumns={statusColumns}
        tagOptions={tagOptions}
        sideOptions={sideOptions}
        isEmpty={state.people.length === 0}
        onAddStatus={addStatus}
        onClearDrag={clearDrag}
      />

      {state.ui.showAddModal && (
        <AddGuestsModal
          statuses={state.statuses}
          tagOptions={tagOptions}
          sideOptions={sideOptions}
          ui={state.ui}
          onClose={closeAddModal}
          onSubmit={submitPaste}
          onUiChange={patch => setState(s => ({ ui: { ...s.ui, ...patch } }))}
        />
      )}

      {state.ui.showFamilyModal && (
        <AddFamilyModal
          statuses={state.statuses}
          sideOptions={sideOptions}
          ui={state.ui}
          palette={PALETTE}
          onClose={closeFamilyModal}
          onSubmit={submitFamily}
          onUiChange={patch => setState(s => ({ ui: { ...s.ui, ...patch } }))}
        />
      )}

      {state.ui.showTagModal && (
        <TagModal
          ui={state.ui}
          palette={PALETTE}
          onClose={closeTagModal}
          onSave={saveTag}
          onDelete={deleteTag}
          onUiChange={patch => setState(s => ({ ui: { ...s.ui, ...patch } }))}
        />
      )}
    </div>
  );
}
