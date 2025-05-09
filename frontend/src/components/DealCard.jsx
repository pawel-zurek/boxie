// src/components/DealCard.jsx
import React, { useEffect, useState } from 'react';
import Tag from './Tag';
import { Draggable } from '@hello-pangea/dnd';
import './DealCard.css';

const API_URL = import.meta.env.VITE_API_URL;

function DealCard({ deal, index, onDealClick }) {
  const [personName, setPersonName] = useState('');

  useEffect(() => {
    const fetchPerson = async () => {
      const token = localStorage.getItem("token");
      if (!deal.raw?.person_id) return;

      try {
        const response = await fetch(`${API_URL}/api/persons/${deal.raw.person_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const person = await response.json();
          setPersonName(person.name);
        }
      } catch (err) {
        console.warn(`Could not fetch person for job ${deal.id}`, err);
      }
    };

    fetchPerson();
  }, [deal.raw?.person_id, deal.id]);

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided) => (
        <div
          className="deal-card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => onDealClick(deal.id)}
        >
          <div className="deal-header">
            <div className="deal-title">{deal.title}</div>
            <div className="deal-value">€{deal.raw?.value?.toLocaleString() ?? '0'}</div>
          </div>

          <div className="deal-tags">
            {deal.tags && deal.tags.map(tagText => (
              <Tag key={tagText} text={tagText} color={tagText} />
            ))}
          </div>

          <div className="deal-footer">
            <div className="deal-assignees">
              {personName && <p className="deal-subtitle">Client: {personName}</p>}
            </div>
            <div className="deal-due-date">Due {deal.dueDate}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default DealCard;
