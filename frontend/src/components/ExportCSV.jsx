import React from 'react';

export default function ExportCSV({ deckId, token }) {
  async function handleExport() {
    const res = await fetch(`/api/v1/decks/${deckId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok || !data.cards) return alert('Erreur export');
    const csv = data.cards.map(card => [card.front, card.back, card.media?.url || ''].join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deck_${deckId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return <button onClick={handleExport}>Exporter CSV</button>;
}
