import { create } from 'zustand';
import { load, Store } from '@tauri-apps/plugin-store';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  date: string; // YYYY-MM-DD 格式
}

// 获取日期字符串（YYYY-MM-DD）
export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

// 获取今日字符串
export function getTodayString(): string {
  return getDateString();
}

// 获取昨日字符串
export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateString(yesterday);
}

// 获取明日字符串
export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateString(tomorrow);
}

// 日期分组
export type DateGroup = 'yesterday' | 'today' | 'tomorrow' | 'other';

export function getDateGroup(dateStr: string): DateGroup {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const tomorrow = getTomorrowString();

  if (dateStr === today) return 'today';
  if (dateStr === yesterday) return 'yesterday';
  if (dateStr === tomorrow) return 'tomorrow';
  return 'other';
}

interface TodoStore {
  todos: Todo[];
  store: Store | null;
  init: () => Promise<void>;
  addTodo: (text: string, date?: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

let storeInstance: Store | null = null;

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await load('todos.json', {
      defaults: { todos: [] },
      autoSave: 300
    });
  }
  return storeInstance;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  store: null,

  init: async () => {
    const store = await getStore();
    const todos = await store.get<Todo[]>('todos') || [];
    set({ store, todos });
  },

  addTodo: async (text: string, date?: string) => {
    const { store, todos } = get();
    if (!store || !text.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      date: date || getTodayString(),
    };

    const newTodos = [newTodo, ...todos];
    await store.set('todos', newTodos);
    set({ todos: newTodos });
  },

  toggleTodo: async (id: string) => {
    const { store, todos } = get();
    if (!store) return;

    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    await store.set('todos', newTodos);
    set({ todos: newTodos });
  },

  deleteTodo: async (id: string) => {
    const { store, todos } = get();
    if (!store) return;

    const newTodos = todos.filter(todo => todo.id !== id);
    await store.set('todos', newTodos);
    set({ todos: newTodos });
  },
}));