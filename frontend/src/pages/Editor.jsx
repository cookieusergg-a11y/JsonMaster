import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getEditorConfig, exportProject } from '../api';
import Timeline from '../components/Timeline';
import EffectsPanel from '../components/EffectsPanel';
import WatermarkOverlay from '../components/WatermarkOverlay';

export default function Editor() {
  const [showWatermark, setShowWatermark] = useState(true);
  const [user, setUser] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorUrl, setEditorUrl] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const config = await getEditorConfig();
        setShowWatermark(config.data.showWatermark);
        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleExport = async () => {
    try {
      const res = await exportProject({});
      alert(`Экспорт завершён: ${res.data.url}\nВодяной знак: ${res.data.watermark ? 'есть' : 'нет'}`);
    } catch (e) {
      alert('Ошибка экспорта');
    }
  };

  // Открыть редактор (локальный, из папки public/editor)
  const openEditor = () => {
    // Можно передать данные через URL-параметр, если редактор поддерживает
    const currentData = localStorage.getItem('currentAnimation') || '';
    const encoded = encodeURIComponent(currentData);
    // Используем локальный путь
    setEditorUrl(`/editor/index.html?data=${encoded}`);
    setShowEditor(true);
  };

  // Обработка сообщений от iframe (для сохранения)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'save') {
        localStorage.setItem('currentAnimation', event.data.payload);
        alert('Анимация сохранена!');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ position: 'relative', padding: 20 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <h1>JsonMaster — Редактор</h1>
        <Link to="/profile">Профиль</Link>
        {user?.isAdmin && <Link to="/admin">Админка</Link>}
        <button onClick={openEditor} style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Открыть редактор слоёв
        </button>
      </div>
      <p>Подписка: {user?.subscription || '—'}</p>

      {/* Заглушки редактора */}
      <Timeline />
      <EffectsPanel />
      <button onClick={handleExport}>Экспортировать</button>
      {showWatermark && <WatermarkOverlay />}

      {/* Iframe с локальным редактором */}
      {showEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            position: 'relative',
            width: '95%',
            height: '95%',
            background: '#fff',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setShowEditor(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10000,
                padding: '8px 16px',
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Закрыть
            </button>
            <iframe
              ref={iframeRef}
              src={editorUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>
      )}
    </div>
  );
}
