
export default function StudySession({deckId, demo}) {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [token] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    async function load() {
      if (demo) {
        setQueue([
          { id: 1, front: 'Bonjour', back: 'Hello', media: { url: '', type: 'external' } },
          { id: 2, front: 'Merci', back: 'Thank you', media: { url: '', type: 'external' } }
        ]);
        setIndex(0);
        setShowBack(false);
        return;
      }
      const q = await api(`/api/v1/study/queue?deckId=${deckId}`, token);
      setQueue(q || []);
      setIndex(0);
      setShowBack(false);
    }
    load();
  }, [deckId, token, demo]);

  function handleCardAdded() {
    async function reload() {
      const q = await api(`/api/v1/study/queue?deckId=${deckId}`, token);
      setQueue(q || []);
      setIndex(0);
      setShowBack(false);
    }
    reload();
  }

  function handleImport() {
    handleCardAdded();
  }

  if (!queue.length) return (
    <div className="empty">
      No cards due — try adding cards to the deck.
      <CardEditor deckId={deckId} token={token} onCardAdded={handleCardAdded} />
      <ImportCSV deckId={deckId} token={token} onImport={handleImport} />
      <ExportCSV deckId={deckId} token={token} />
    </div>
  );
  const card = queue[index];

  async function submitQuality(q) {
    if (demo) {
      const next = index + 1;
      if (next >= queue.length) {
        setIndex(0);
        setShowBack(false);
      } else {
        setIndex(next);
        setShowBack(false);
      }
      return;
    }
    await api('/api/v1/study/review', { method: 'POST', headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({ cardId: card.id, quality: q }) });
    const next = index + 1;
    if (next >= queue.length) {
      const q2 = await api(`/api/v1/study/queue?deckId=${deckId}`, token);
      setQueue(q2 || []);
      setIndex(0);
      setShowBack(false);
    } else {
      setIndex(next);
      setShowBack(false);
    }
  }

  return (
    <div className="study">
      <div className="card">
        <div className="front">{card.front}</div>
        {card.media && card.media.url && (
          <div className="media">
            {card.media.type === 'external' && card.media.url.match(/\.(jpg|jpeg|png|gif)$/i) && (
              <img src={card.media.url} alt="media" style={{maxWidth: '100%'}} />
            )}
            {card.media.type === 'external' && card.media.url.match(/\.(mp3|wav)$/i) && (
              <audio controls src={card.media.url} />
            )}
            {card.media.type === 'external' && card.media.url.match(/\.(mp4|webm)$/i) && (
              <video controls src={card.media.url} style={{maxWidth: '100%'}} />
            )}
          </div>
        )}
        {showBack && <div className="back">{card.back}</div>}
      </div>
  {!demo && <CardEditor deckId={deckId} token={token} onCardAdded={handleCardAdded} />}
  {!demo && <ImportCSV deckId={deckId} token={token} onImport={handleImport} />}
  {!demo && <ExportCSV deckId={deckId} token={token} />}
      <div className="controls">
        <button onClick={() => setShowBack(s => !s)}>{showBack ? 'Hide' : 'Show answer'}</button>
        {showBack && (
          <div className="ratings">
            <button onClick={() => submitQuality(0)}>Again</button>
            <button onClick={() => submitQuality(3)}>Hard</button>
            <button onClick={() => submitQuality(4)}>Good</button>
            <button onClick={() => submitQuality(5)}>Easy</button>
          </div>
        )}
      </div>
      <div className="progress">{index + 1} / {queue.length}</div>
    </div>
  );
}
