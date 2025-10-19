import React from 'react';

export default function Header({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding: '18px 28px', background:'white', boxShadow:'0 2px 10px rgba(0,0,0,0.04)'}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{fontWeight:700, fontSize:20}}>ToDo</div>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        {user && <div style={{color:'#374151'}}>{user.name}</div>}
        <button onClick={onLogout} style={{padding:8, borderRadius:8, border:'1px solid #e5e7eb', background:'white'}}>Logout</button>
      </div>
    </header>
  );
}
