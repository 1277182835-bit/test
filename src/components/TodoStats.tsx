import { useMemo } from 'react';
import { useTodoStore, getTodayString, getYesterdayString } from '../store/todoStore';

export function TodoStats() {
  const todos = useTodoStore(state => state.todos);
  const todayStr = getTodayString();
  const yesterdayStr = getYesterdayString();

  const stats = useMemo(() => {
    const todayTodos = todos.filter(t => t.date === todayStr);
    const yesterdayTodos = todos.filter(t => t.date === yesterdayStr);
    const todayCompleted = todayTodos.filter(t => t.completed).length;
    const yesterdayCompleted = yesterdayTodos.filter(t => t.completed).length;

    return {
      todayTotal: todayTodos.length,
      todayCompleted,
      todayRemaining: todayTodos.length - todayCompleted,
      yesterdayTotal: yesterdayTodos.length,
      yesterdayCompleted,
      yesterdayRemaining: yesterdayTodos.length - yesterdayCompleted,
      total: todos.length,
      totalCompleted: todos.filter(t => t.completed).length,
    };
  }, [todos, todayStr, yesterdayStr]);

  return (
    <div className="todo-stats">
      <div className="stats-section">
        <span className="stats-label today">今日</span>
        <span className="stats-num">{stats.todayCompleted}/{stats.todayTotal}</span>
      </div>
      <span className="stats-separator">|</span>
      <div className="stats-section">
        <span className="stats-label yesterday">昨日</span>
        <span className="stats-num">{stats.yesterdayCompleted}/{stats.yesterdayTotal}</span>
      </div>
    </div>
  );
}