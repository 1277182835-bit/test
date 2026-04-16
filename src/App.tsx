import { useEffect } from 'react';
import { useTodoStore } from './store/todoStore';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';
import './App.css';

function App() {
  const init = useTodoStore(state => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <main className="container">
      <header className="app-header">
        <h1>待办事项</h1>
      </header>
      <TodoInput />
      <TodoStats />
      <TodoList />
    </main>
  );
}

export default App;