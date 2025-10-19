import React from 'react';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderBottom:'1px solid #f1f3f7'}}>
      <label style={{display:'flex', alignItems:'center', gap:10}}>
        <input type="checkbox" checked={!!todo.completed} onChange={onToggle} />
        <div style={{textDecoration: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.6 : 1}}>
          <div style={{fontWeight:600}}>{todo.text}</div>
          <div style={{fontSize:12, color:'#6b7280'}}>{new Date(todo.date).toLocaleDateString()}</div>
        </div>
      </label>
      <div>
        <button onClick={onDelete} style={{border:'none', background:'transparent', color:'#ef4444', cursor:'pointer'}}>Delete</button>
      </div>
    </div>
  );
}
