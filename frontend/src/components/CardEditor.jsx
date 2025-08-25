import React, { useState } from 'react';

export default function CardEditor({ deckId, token, onCardAdded }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [error, setError] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`/api/v1/decks/${deckId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ front, back, mediaUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setFront('');
      setBack('');
      setMediaUrl('');
      if (onCardAdded) onCardAdded(data);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form onSubmit={handleAdd} className="card-editor">
      <h3>Ajouter une carte</h3>
      <input
        type="text"
        placeholder="Recto"
        value={front}
        onChange={e => setFront(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Verso"
        value={back}
        onChange={e => setBack(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="URL média (image, audio, vidéo)"
        value={mediaUrl}
        onChange={e => setMediaUrl(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Ajouter</button>
    </form>
  );
}
