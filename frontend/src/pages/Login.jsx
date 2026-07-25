import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCode, adminLogin } from '../api'; // добавим adminLogin

export default function Login() {
  const [mode, setMode] = useState('user'); // 'user' или 'admin'
  const [code, setCode] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return alert('Введите код');
    setLoading(true);
    try {
      const res = await loginWithCode({ code });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/editor');
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!login.trim() || !password.trim()) return alert('Введите логин и пароль');
    setLoading(true);
    try {
      const res = await adminLogin({ login, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/editor');
    } catch (err) {
      alert('Ошибка входа: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>JsonMaster</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: 30 }}>
        <button
          onClick={() => setMode('user')}
          style={{ padding: '10px 30px', background: mode === 'user' ? '#007bff' : '#ccc' }}
        >
          Пользователь
        </button>
        <button
          onClick={() => setMode('admin')}
          style={{ padding: '10px 30px', background: mode === 'admin' ? '#28a745' : '#ccc' }}
        >
          Admin
        </button>
      </div>

      {mode === 'user' && (
        <form onSubmit={handleUserSubmit}>
          <p>Введите код, полученный от бота</p>
          <input
            type="text"
            placeholder="Например: a1b2c3d4"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ padding: '10px', width: '250px', fontSize: '16px' }}
          />
          <br />
          <button type="submit" disabled={loading} style={{ marginTop: '15px', padding: '10px 30px' }}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
          <p style={{ marginTop: 20, fontSize: '14px', color: '#888' }}>
            Напишите боту <strong>@JsonMasterRubot</strong> команду <strong>/start</strong>
          </p>
        </form>
      )}

      {mode === 'admin' && (
        <form onSubmit={handleAdminSubmit}>
          <p>Вход для администратора</p>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{ padding: '10px', width: '250px', fontSize: '16px', marginBottom: 10 }}
          />
          <br />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', width: '250px', fontSize: '16px', marginBottom: 10 }}
          />
          <br />
          <button type="submit" disabled={loading} style={{ padding: '10px 30px' }}>
            {loading ? 'Вход...' : 'Войти как Admin'}
          </button>
        </form>
      )}
    </div>
  );
}
