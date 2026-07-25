import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCode } from '../api';

export default function Login() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>JsonMaster</h1>
      <p>Введите код, полученный от бота</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Например: a1b2c3d4"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: '10px', width: '250px', fontSize: '16px' }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '15px', padding: '10px 30px', fontSize: '16px' }}
        >
          {loading ? 'Проверка...' : 'Войти'}
        </button>
      </form>
      <p style={{ marginTop: 20, fontSize: '14px', color: '#888' }}>
        Напишите боту <strong>@JsonMasterRubot</strong> команду <strong>/start</strong>
      </p>
    </div>
  );
}
