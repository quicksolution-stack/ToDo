import React, { useEffect, useState } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api/api';
import TodoItem from '../components/TodoItem';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');
    loadTodos();
  }, []);

  async function loadTodos() {
  const todayISO = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  const data = await fetchTodos(todayISO);
  console.log("Fetched todos:", data);
  setTodos(data || []);
}


  async function onAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const payload = { text, date: date || new Date().toISOString().slice(0,10) };
    const newTodo = await createTodo(payload);
    setText(''); setDate('');
    setTodos(prev => [newTodo, ...prev]);
  }

  async function onToggle(todo) {
    const updated = await updateTodo(todo._id, { completed: !todo.completed });
    setTodos(prev => prev.map(t => t._id === updated._id ? updated : t));
  }

  async function onDelete(todo) {
    await deleteTodo(todo._id);
    setTodos(prev => prev.filter(t => t._id !== todo._1d && t._id !== todo._id));
  }

  function onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <div style={{minHeight:'100vh', background:'#f4f6fb'}}>
      <Header onLogout={onLogout} />
      <div style={{maxWidth:900, margin:'30px auto', padding:20}}>
        <div style={{display:'flex', gap:12, marginBottom:16}}>
          <form onSubmit={onAdd} style={{flex:1, display:'flex', gap:8}}>
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add today's target..." style={{flex:1, padding:12, borderRadius:8, border:'1px solid #e3e6ef'}}/>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{padding:10, borderRadius:8}} />
            <button style={{padding:'10px 14px', borderRadius:8, background:'#10b981', color:'white', border:'none'}}>Add</button>
          </form>
        </div>

        <div style={{background:'white', borderRadius:12, padding:16, boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
          {todos.length === 0 ? <div style={{padding:20, textAlign:'center', color:'#6b7280'}}>No targets yet — add one above</div>
          : todos.map(todo => <TodoItem key={todo._id} todo={todo} onToggle={() => onToggle(todo)} onDelete={() => onDelete(todo)} />)}
        </div>
      </div>
    </div>
  );
}
