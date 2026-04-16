import { useMemo } from 'react';
import { useTodoStore, getDateGroup, DateGroup, Todo } from '../store/todoStore';

interface GroupedTodos {
  yesterday: Todo[];
  today: Todo[];
  tomorrow: Todo[];
  other: Todo[];
}

function formatDateGroup(group: DateGroup): string {
  switch (group) {
    case 'yesterday': return '昨日';
    case 'today': return '今日';
    case 'tomorrow': return '明日';
    case 'other': return '其他';
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  return `${month}月${day}日 周${weekday}`;
}

export function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useTodoStore();

  const grouped = useMemo((): GroupedTodos => {
    const groups: GroupedTodos = { yesterday: [], today: [], tomorrow: [], other: [] };
    todos.forEach(todo => {
      const group = getDateGroup(todo.date);
      groups[group].push(todo);
    });
    // 按创建时间倒序
    Object.values(groups).forEach(list => list.sort((a: Todo, b: Todo) => b.createdAt - a.createdAt));
    return groups;
  }, [todos]);

  const renderGroup = (group: DateGroup, todos: Todo[]) => {
    if (todos.length === 0) return null;
    return (
      <div key={group} className="todo-group">
        <div className="todo-group-header">
          <span className={`todo-group-title ${group}`}>{formatDateGroup(group)}</span>
          <span className="todo-group-count">{todos.length}</span>
        </div>
        <ul className="todo-group-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label className="todo-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-checkmark"></span>
              </label>
              <span className="todo-text">{todo.text}</span>
              <span className="todo-date">{formatDate(todo.date)}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="todo-delete-btn"
                title="删除"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (todos.length === 0) {
    return (
      <div className="todo-empty">
        <p>暂无待办事项</p>
        <p className="todo-empty-hint">在上方添加你的第一个待办</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {renderGroup('today', grouped.today)}
      {renderGroup('tomorrow', grouped.tomorrow)}
      {renderGroup('yesterday', grouped.yesterday)}
      {renderGroup('other', grouped.other)}
    </div>
  );
}