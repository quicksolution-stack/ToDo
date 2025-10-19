import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/api';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function onChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const resp = isRegister ? await register({ name: form.name, email: form.email, password: form.password }) : await login({ email: form.email, password: form.password });
      if (resp.token) {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
        navigate('/dashboard');
      } else {
        setError(resp.message || 'Auth failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{marginBottom:10}}>ToDo</h1>
        <p style={{opacity:0.7}}>{isRegister ? 'Create an account' : 'Login to continue'}</p>
        <form onSubmit={onSubmit} style={{display:'grid', gap:8, width: '100%', marginTop: 10}}>
          {isRegister && <input name="name" placeholder="Name" value={form.name} onChange={onChange} style={styles.input}/>}
          <input name="email" placeholder="Email" value={form.email} onChange={onChange} style={styles.input}/>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} style={styles.input}/>
          <button style={styles.button}>{isRegister ? 'Create account' : 'Login'}</button>
          {error && <div style={{color:'red'}}>{error}</div>}
        </form>
        <div style={{marginTop: 10}}>
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} style={styles.link}>
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f8fb' },
  card: { width: 360, padding: 24, borderRadius: 12, boxShadow:'0 6px 20px rgba(0,0,0,0.08)', background: 'white', textAlign:'center' },
  input: { padding: 10, borderRadius: 8, border: '1px solid #e1e4ee' },
  button: { padding: 10, borderRadius: 8, border: 'none', background:'#2563eb', color:'white', fontWeight:600 },
  link: { marginTop:8, background:'none', border:'none', color:'#2563eb', cursor:'pointer' }
};
