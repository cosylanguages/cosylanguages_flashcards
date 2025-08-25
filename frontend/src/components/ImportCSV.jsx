import React, { useRef } from 'react';

export default function ImportCSV({ deckId, token, onImport }) {
  const fileRef = useRef();
  const [error, setError] = React.useState('');

  async function handleImport(e) {
    e.preventDefault();
    setError('');
    const file = fileRef.current.files[0];
    if (!file) return setError('Sélectionnez un fichier CSV');
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const [front, back, mediaUrl] = line.split(',');
      try {
        await fetch(`/api/v1/decks/${deckId}/cards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ front, back, mediaUrl })
        });
      } catch (e) {
        setError('Erreur lors de l’import');
        break;
      }
    }
    if (onImport) onImport();
  }

  return (
    <form onSubmit={handleImport} className="import-csv">
      <h3>Importer des cartes (CSV)</h3>
      <input type="file" accept=".csv" ref={fileRef} />
      {error && <div className="error">{error}</div>}
      <button type="submit">Importer</button>
    </form>
  );
}
