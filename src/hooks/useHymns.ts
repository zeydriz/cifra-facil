import { useState, useEffect } from 'react';
import { Hymn } from '@/types/hymn';
import { useLocalStorage } from './useLocalStorage';

const defaultHymns: Hymn[] = [
  {
    id: '1',
    title: 'Quão Grande És Tu',
    number: 43,
    category: 'harpa-crista',
    key: 'G',
    lyrics: `Senhor meu Deus! Quando eu, maravilhado,
Fico a pensar nas obras que criaste,
No céu azul, nas águas, no trovão,
Então minh'alma canta a Ti, Senhor:

Refrão:
Quão grande és Tu! Quão grande és Tu!
Então minh'alma canta a Ti, Senhor:
Quão grande és Tu! Quão grande és Tu!`,
    chords: `G                    C              G
Senhor meu Deus! Quando eu, maravilhado,
Em              D              G
Fico a pensar nas obras que criaste,
G                C              G
No céu azul, nas águas, no trovão,
Em              D              G
Então minh'alma canta a Ti, Senhor:

G              C              G
Quão grande és Tu! Quão grande és Tu!
Em              D              G
Então minh'alma canta a Ti, Senhor:
G              C              G
Quão grande és Tu! Quão grande és Tu!`,
    isFavorite: false,
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Eu Te Louvarei',
    category: 'louvores-gerais',
    key: 'C',
    lyrics: `Eu te louvarei, ó Senhor, meu Deus
Com todo o meu coração
E glorificarei o teu nome
Para sempre, Senhor

Tu tens feito tantas coisas
Por isso eu te louvo
Tu és digno de receber
Toda honra e glória`,
    chords: `C              F              G              C
Eu te louvarei, ó Senhor, meu Deus
F              G              C
Com todo o meu coração
C              F              G              C
E glorificarei o teu nome
F              G              C
Para sempre, Senhor`,
    isFavorite: true,
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function useHymns() {
  const [hymns, setHymns] = useLocalStorage<Hymn[]>('hymns', defaultHymns);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  const addHymn = (hymn: Omit<Hymn, 'id' | 'createdAt' | 'updatedAt'>): Hymn => {
    const newHymn: Hymn = {
      ...hymn,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setHymns(prev => [...prev, newHymn]);
    return newHymn;
  };

  const updateHymn = (id: string, updates: Partial<Hymn>) => {
    setHymns(prev => prev.map(hymn => 
      hymn.id === id 
        ? { ...hymn, ...updates, updatedAt: new Date() }
        : hymn
    ));
  };

  const deleteHymn = (id: string) => {
    setHymns(prev => prev.filter(hymn => hymn.id !== id));
    setFavorites(prev => prev.filter(fav => fav !== id));
  };

  const toggleFavorite = (id: string) => {
    const hymn = hymns.find(h => h.id === id);
    if (hymn) {
      updateHymn(id, { isFavorite: !hymn.isFavorite });
      if (hymn.isFavorite) {
        setFavorites(prev => prev.filter(fav => fav !== id));
      } else {
        setFavorites(prev => [...prev, id]);
      }
    }
  };

  const getHymnsByCategory = (category: string) => {
    return hymns.filter(hymn => hymn.category === category);
  };

  const getFavoriteHymns = () => {
    return hymns.filter(hymn => hymn.isFavorite);
  };

  const searchHymns = (query: string) => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return hymns.filter(hymn =>
      hymn.title.toLowerCase().includes(lowerQuery) ||
      hymn.number?.toString().includes(query) ||
      hymn.lyrics.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    hymns,
    addHymn,
    updateHymn,
    deleteHymn,
    toggleFavorite,
    getHymnsByCategory,
    getFavoriteHymns,
    searchHymns
  };
}