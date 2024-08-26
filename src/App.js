import { useEffect, useState, useContext } from 'react';
import './App.css';
import Card from './Card/Card';
import { userNameContext } from './Card/Card.jsx';


function App() {
  const [cardList, setCardList] = useState(
    [
      {key: 1, id: 1, onDelete: (() => onRemoveCard(1))},
      {key: 2, id: 2, onDelete: (() => onRemoveCard(2))},
      {key: 3, id: 3, onDelete: (() => onRemoveCard(3))}
    ]);

  function onRemoveCard(id) {
    setCardList(c => c.filter((card, index) => card.key != id));
  }

  function onAddCard() {
    let uid = Math.floor(Math.random() * 10000000000);
    const newCard = {key: uid, id: uid, onDelete: (() => onRemoveCard(uid))};

    setCardList(c => ([
      ...cardList, newCard
    ]));
  }

  return (
    <div className="app-container">
      {
        cardList.map((card) => (
          <Card key={card.key} id={card.id} onDelete={card.onDelete} />
        ))
      }
      <div>
        <button className='button-create-card' onClick={onAddCard}>New Card</button>
      </div>
    </div>
  );
}

export default App;
