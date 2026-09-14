import { useState, useEffect } from 'preact/hooks';
import Fuse from 'fuse.js';

interface SearchItem {
  title: string;
  slug: string;
  collection: string;
  dtc?: string[];
  brand?: string[];
}

export default function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [data, setData] = useState<SearchItem[]>([]);

  useEffect(() => {
    fetch('/api/search.json')
      .then(r => r.json())
      .then(d => setData(d));
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fuse = new Fuse(data, {
      keys: ['title', 'dtc', 'symptom', 'brand'],
      threshold: 0.3
    });
    setResults(fuse.search(query).map(res => res.item));
  }, [query, data]);

  return (
    <div class="max-w-2xl mx-auto w-full">
      <input 
        type="text" 
        value={query}
        onInput={e => setQuery(e.currentTarget.value)}
        placeholder="Rechercher (ex: P0335, Capteur PMH, Renault...)" 
        class="w-full bg-surface border border-slate-700 rounded-lg py-3 px-5 text-white focus:outline-none focus:border-accent-diagnostic transition-all mb-4" 
      />
      
      {results.length > 0 && (
        <div class="bg-surface border border-slate-700 rounded-lg overflow-hidden">
          {results.map((item, index) => (
             <a href={`/${['outils'].includes(item.collection) ? 'outils' : 'diagnostic'}/${item.collection}/${item.slug}`} class="block p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
               <h4 class="text-white font-bold">{item.title}</h4>
               {item.dtc && item.dtc.length > 0 && (
                 <span class="text-xs text-accent-diagnostic mr-2">DTC: {item.dtc.join(', ')}</span>
               )}
             </a>
          ))}
        </div>
      )}
    </div>
  );
}
