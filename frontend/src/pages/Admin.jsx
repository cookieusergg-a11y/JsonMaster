import React, { useState, useEffect } from 'react';
import { getUsers, grantSubscription } from '../api';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [targetId, setTargetId] = useState('');
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (e) {
        alert('Нет прав или ошибка');
      }
    };
    fetchUsers();
  }, []);

  const handleGrant = async () => {
    if (!targetId) return;
    try {
      await grantSubscription(targetId, days);
      alert(`Выдано ${days} дней пользователю ${targetId}`);
      const res = await getUsers();
      setUsers(res.data);
    } catch (e) {
      alert('Ошибка');
    }
  };

  return (
    <div>
      <h2>Админ-панель</h2>
      <Link to="/editor">Назад</Link>
      <div style={{ margin: '20px 0' }}>
        <input placeholder="Telegram ID" value={targetId} onChange={e => setTargetId(e.target.value)} />
        <input type="number" value={days} onChange={e => setDays(parseInt(e.target.value))} min="1" />
        <button onClick={handleGrant}>Выдать дни</button>
      </div>
      <h3>Пользователи</h3>
      <ul>
        {users.map(u => (
          <li key={u._id}>ID: {u.telegramId}, {u.firstName}, подписка: {u.subscription}, админ: {u.isAdmin ? 'да' : 'нет'}</li>
        ))}
      </ul>
    </div>
  );
}