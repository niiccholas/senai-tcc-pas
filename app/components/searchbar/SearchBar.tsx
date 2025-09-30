"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import Form from 'next/form';
import './SearchBar.css';

export default function SearchBar() {
  const router = useRouter();

  return (
    <Form className="search-box" action="/pesquisar">
      <button 
        id="filter-btn" 
        type="button" 
        onClick={() => router.push('/filtro')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
             viewBox="0 0 24 24" fill="none" stroke="#ffffff" 
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
             className="lucide lucide-chevron-down">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      <input name="search-input" placeholder="Procure por uma unidade de saúde..." />

      <button
        id="filter-btn" 
        type="submit" 
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
             viewBox="0 0 24 24" fill="none" stroke="#ffffff" 
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
             className="lucide lucide-search">
          <path d="m21 21-4.34-4.34"/>
          <circle cx="11" cy="11" r="8"/>
        </svg>
      </button>
    </Form>
  )
}
