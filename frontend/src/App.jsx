import React, { useEffect, useState } from 'react';
import StudySession from './components/StudySession';
import AuthForm from './components/AuthForm';
import { api } from './api';

export default function App() {
  const [decks, setDecks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const d = await api('/api/v1/decks', token);
        if (d && d.length) {
          setDecks(d);
          setSelected(d[0].id);
        } else {
          throw new Error('No decks');
        }
      } catch (e) {
        // Mode démo statique si l’API est inaccessible
        const mockDecks = [
          { id: 1, name: 'Démo Français', description: 'Deck de démonstration' },
          { id: 2, name: 'Demo English', description: 'Demo deck' }
        ];
        setDecks(mockDecks);
        setSelected(mockDecks[0].id);
      }
    }
    load();
  }, [token]);

  function handleAuth(newToken, user) {
    setToken(newToken);
    setUser(user);
    localStorage.setItem('token', newToken);
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  }

  if (!token) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="container">
      <header>
        <h1>Cosy Flashcards</h1>
        {user && <button onClick={handleLogout}>Déconnexion</button>}
      </header>
      <main>
        <aside className="sidebar">
          <h3>Decks</h3>
          <ul>
            {decks.map(deck => (
              <li key={deck.id}>
                <button onClick={() => setSelected(deck.id)} className={selected === deck.id ? 'active' : ''}>
                  {deck.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="content">
          {selected ? <StudySession deckId={selected} token={token} demo={!user} /> : <div>Sélectionnez un deck</div>}
        </section>
      </main>
      <footer style={{marginTop:32, textAlign:'center', fontSize:'0.9em'}}>
        <p>Mode démo statique : certaines fonctionnalités sont désactivées sur GitHub Pages.<br/>Pour l’expérience complète, déployez le backend et configurez l’URL dans le frontend.</p>
      </footer>
    </div>
  );
}
