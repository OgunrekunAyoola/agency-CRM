'use client';

import { useState } from 'react';
import { useTasks, Task } from '@/hooks/queries/useTasks';
import { useProjects } from '@/hooks/queries/useProjects';
import { useTimeTracking } from '@/hooks/queries/useTimeTracking';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Container, Section } from '@/components/ui/LayoutPrimitives';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { ErrorState } from '@/components/ui/StateVisuals';
import { EmptyState } from '@/components/ui/EmptyState';
import { Clock, Plus, AlertCircle, CheckSquare } from 'lucide-react';

// ─── Column config ────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: 'Todo', title: 'To Do', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'InProgress', title: 'In Progress', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'Done', title: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
] as const;

export default function TasksPage() {
  const { tasks, isLoading, error, createTask, isCreating } = useTasks();
  const { projects } = useProjects();
  const { logTime, isLoggingTime } = useTimeTracking();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedTaskForTime, setSelectedTaskForTime] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '' });
  const [newTime, setNewTime] = useState({
    hours: 1,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // ─── Derived helpers ───────────────────────────────────────────────────────
  const projectOptions = [
    { label: 'No project (standalone)', value: '' },
    ...projects.map((p) => ({ label: p.name, value: p.id })),
  ];

  const getProjectName = (projectId?: string): string => {
    if (!projectId) return '—';
    return projects.find((p) => p.id === projectId)?.name ?? '—';
  };

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      await createTask(newTask);
      toast.success('Task created successfully.');
      setNewTask({ title: '', description: '', projectId: '' });
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleLogTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForTime) return;
    try {
      await logTime({
        projectId: selectedTaskForTime.projectId ?? '',
        taskId: selectedTaskForTime.id,
        ...newTime,
      });
      setIsTimeModalOpen(false);
      setSelectedTaskForTime(null);
      setNewTime({ hours: 1, description: '', date: new Date().toISOString().split('T')[0] });
      toast.success('Time logged successfully.');
    } catch {
      toast.error('Failed to log time. Please try again.');
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Container>
      <Section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage workloads and log hours across active projects.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </Section>

      {error && <ErrorState reset={() => window.location.reload()} />}
      {!error && !isLoading && tasks.length === 0 && (
        <EmptyState 
           icon={CheckSquare}
           title="No tasks found"
           description="Your agency's workload is clear. Start by adding a task to a project."
           action={<Button onClick={() => setIsModalOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Your First Task</Button>}
        />
      )}

      {/* ── Kanban Board ─────────────────────────────────────────────── */}
      <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] w-full bg-muted/20 animate-pulse rounded-xl border-2 border-dashed"
            />
          ))
        ) : tasks.length > 0 && (
          COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => (t.status || 'Todo') === column.id);
            return (
              <div key={column.id} className="flex flex-col gap-4">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${column.color}`}
                >
                  <h3 className="font-bold text-sm uppercase tracking-wider">{column.title}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/50">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[500px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group bg-white p-4 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate max-w-[120px]">
                          {getProjectName(task.projectId)}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedTaskForTime(task);
                              setIsTimeModalOpen(true);
                            }}
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded"
                            title="Log Hours"
                            aria-label={`Log hours for task: ${task.title}`}
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">{task.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex -space-x-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold"
                            title="Unassigned"
                          >
                            ?
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority || 'Normal'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl opacity-30 capitalize">
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">No {column.title} tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </Section>

      {/* ── Create Task Modal ─────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement login flow"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <Select
            label="Project"
            options={projectOptions}
            value={newTask.projectId}
            onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">Description</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Task details..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Log Time Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={isTimeModalOpen}
        onClose={() => {
          setIsTimeModalOpen(false);
          setSelectedTaskForTime(null);
        }}
        title={`Log Hours: ${selectedTaskForTime?.title ?? ''}`}
      >
        <form onSubmit={handleLogTime} className="space-y-4">
          <Input
            label="Hours"
            type="number"
            step="0.5"
            min="0.5"
            value={newTime.hours}
            onChange={(e) => setNewTime({ ...newTime, hours: Number(e.target.value) })}
            required
          />
          <Input
            label="Date"
            type="date"
            value={newTime.date}
            onChange={(e) => setNewTime({ ...newTime, date: e.target.value })}
            required
          />
          <Input
            label="What did you do?"
            placeholder="Describe the work completed..."
            value={newTime.description}
            onChange={(e) => setNewTime({ ...newTime, description: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoggingTime}>
            Save Entry
          </Button>
        </form>
      </Modal>
    </Container>
  );
}
