import React, { useState, useEffect } from 'react';
import { getSubscriptionStatus } from '../api';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [status, setStatus] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSubscriptionStatus();
        setStatus(res.data);
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2>Профиль</h2>
      <p>Telegram ID: {user?.telegramId}</p>
      <p>Имя: {user?.firstName} {user?.lastName}</p>
      <p>Подписка: {status.subscription}</p>
      {status.subscription === 'trial' && <p>Осталось дней: {status.trialDaysLeft}</p>}
      {status.premiumUntil && <p>Действительно до: {new Date(status.premiumUntil).toLocaleDateString()}</p>}
      <Link to="/editor">Назад</Link>
    </div>
  );
}