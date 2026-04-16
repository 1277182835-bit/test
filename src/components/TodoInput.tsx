import { useState } from 'react';
import { useTodoStore, getTodayString } from '../store/todoStore';

export function TodoInput() {
  const [text, setText] = useState('');
  const [date, setDate] = useState(getTodayString());
  const addTodo = useTodoStore(state => state.addTodo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addTodo(text, date);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="添加新待办..."
        className="todo-input-field"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="todo-date-picker"
      />
      <button type="submit" className="todo-add-btn">
        添加
      </button>
    </form>
  );
}