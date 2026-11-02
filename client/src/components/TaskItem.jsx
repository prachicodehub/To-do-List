import { useRef, useState } from 'react';
import Checkbox from './ui/Checkbox';
import { EditIcon, TrashIcon } from './ui/Icons';
import { useDeleteTask, useToggleStatus } from '../hooks/useTasks';
import { useTaskSheet } from '../context/TaskSheetContext';
import { formatTime } from '../utils/date';
import { STATUS, isDone, priorityMeta } from '../utils/task';

const REVEAL = 88; // width of the Delete action in px

// A task row: tap to edit, checkbox to complete, swipe left (or tap the bin) to reveal Delete.
export default function TaskItem({ task, showDate = false }) {
  const { openEdit } = useTaskSheet();
  const toggle = useToggleStatus();
  const del = useDeleteTask();
  const [offset, setOffset] = useState(0);
  const drag = useRef(null);
  const done = isDone(task);
  const priority = priorityMeta(task.priority);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, base: offset, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 8) return;
    if (!d.moved && Math.abs(e.clientY - d.y) > Math.abs(dx)) return (drag.current = null); // vertical scroll
    d.moved = true;
    setOffset(Math.min(0, Math.max(-REVEAL - 24, d.base + dx)));
  };
  const onPointerUp = () => {
    if (drag.current?.moved) setOffset((o) => (o < -REVEAL / 2 ? -REVEAL : 0));
    setTimeout(() => (drag.current = null));
  };

  const openEditor = () => {
    if (drag.current?.moved) return;
    if (offset) return setOffset(0);
    openEdit(task);
  };

  const meta = [showDate && new Date(task.dueAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), formatTime(task.dueAt)]
    .filter(Boolean)
    .join(' · ');

  return (
    <li className={`relative overflow-hidden border-b border-line last:border-0 ${del.isPending ? 'opacity-50' : ''}`}>
      <button
        onClick={() => del.mutate(task.id)}
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-danger text-sm font-medium text-white"
        style={{ width: REVEAL, visibility: offset ? 'visible' : 'hidden' }}
        tabIndex={offset ? 0 : -1}
      >
        Delete
      </button>

      <div
        className="relative flex touch-pan-y items-center gap-3 bg-white py-3.5 transition-transform duration-200 ease-out select-none"
        style={{ transform: `translateX(${offset}px)`, transitionDuration: drag.current?.moved ? '0ms' : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Checkbox
          checked={done}
          label={`Mark "${task.title}" as ${done ? 'in progress' : 'completed'}`}
          onChange={(v) => toggle.mutate({ id: task.id, status: v ? STATUS.DONE : STATUS.OPEN })}
        />

        <button onClick={openEditor} className="min-w-0 flex-1 text-left">
          <p className={`truncate text-sm font-medium ${done ? 'text-muted line-through' : 'text-ink'}`}>{task.title}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            {priority && <span className={`size-1.5 rounded-full ${priority.dot}`} title={`${priority.label} priority`} />}
            {meta}
          </p>
        </button>

        <div className="flex items-center gap-2.5 text-lg text-muted">
          <button aria-label="Delete task" className="hover:text-danger" onClick={() => setOffset(offset ? 0 : -REVEAL)}>
            <TrashIcon />
          </button>
          <button aria-label="Edit task" className="hover:text-brand" onClick={() => openEdit(task)}>
            <EditIcon />
          </button>
        </div>
      </div>
    </li>
  );
}
