import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithTelegram } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const containerRef = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'JsonMasterRubot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', 'http://localhost:5000/api/auth/telegram-login');
    script.setAttribute('data-request-access', 'write');
    containerRef.current.appendChild(script);

    window.onTelegramAuth = async (user) => {
      try {
        const res = await loginWithTelegram(user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/editor');
      } catch (e) {
        alert('Ошибка авторизации');
      }
    };
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>JsonMaster</h1>
      <p>Войдите через Telegram</p>
      <div ref={containerRef}></div>
    </div>
  );
}