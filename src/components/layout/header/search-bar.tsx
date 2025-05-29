'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex">
        <input
          type="search"
          placeholder="Search for products, brands and more"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-l-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <Button 
          type="submit" 
          size="sm" 
          className="rounded-l-none border-l-0 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
