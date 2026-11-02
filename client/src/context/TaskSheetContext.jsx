import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TaskFormSheet from '../components/TaskFormSheet';

// One shared add/edit sheet that any screen (home, week cards, search) can open.
const TaskSheetContext = createContext(null);

export function TaskSheetProvider({ children }) {
  const [state, setState] = useState({ open: false, task: null, defaultDate: null });

  const openCreate = useCallback((defaultDate) => setState({ open: true, task: null, defaultDate }), []);
  const openEdit = useCallback((task) => setState({ open: true, task, defaultDate: null }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit]);

  return (
    <TaskSheetContext.Provider value={value}>
      {children}
      {state.open && <TaskFormSheet task={state.task} defaultDate={state.defaultDate} onClose={close} />}
    </TaskSheetContext.Provider>
  );
}

export function useTaskSheet() {
  const ctx = useContext(TaskSheetContext);
  if (!ctx) throw new Error('useTaskSheet must be used inside <TaskSheetProvider>');
  return ctx;
}
