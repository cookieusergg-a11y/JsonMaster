import React, { useState, useEffect } from 'react';
import { getEditorConfig, exportProject } from '../api';
import Timeline from '../components/Timeline';
import EffectsPanel from '../components/EffectsPanel';
import WatermarkOverlay from '../components/WatermarkOverlay';
import { Link } from 'react-router-dom';

export default function Editor() {
  const [showWatermark, setShowWatermark] = useState(true);
  const [user, setUser] = useState(null);

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

  return (
    <div style={{ position: 'relative', padding: 20 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <h1>JsonMaster — Редактор</h1>
        <Link to="/profile">Профиль</Link>
        {user?.isAdmin && <Link to="/admin">Админка</Link>}
      </div>
      <p>Подписка: {user?.subscription || '—'}</p>
      <Timeline />
      <EffectsPanel />
      <button onClick={handleExport}>Экспортировать</button>
      {showWatermark && <WatermarkOverlay />}
    </div>
  );
}