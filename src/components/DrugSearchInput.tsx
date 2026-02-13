import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { drugApi } from '@/lib/api';
import type { DrugSearchDto } from '@/types/api';
import { debounce } from '@/lib/helpers';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

interface DrugSearchInputProps {
  onSelect: (drug: DrugSearchDto) => void;
  placeholder?: string;
  excludeIds?: number[];
}

export function DrugSearchInput({ onSelect, placeholder = 'Tìm kiếm thuốc...', excludeIds = [] }: DrugSearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DrugSearchDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchDrugs = debounce(async () => {
      setIsLoading(true);
      try {
        const data = await drugApi.search(query);
        const filtered = data.filter(drug => !excludeIds.includes(drug.id));
        setResults(filtered);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    searchDrugs();

    return () => searchDrugs.cancel?.();
  }, [query, excludeIds]);

  const handleSelect = (drug: DrugSearchDto) => {
    onSelect(drug);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 1 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full"
          >
            <Card className="max-h-60 overflow-auto bg-white">
              <div className="p-1">
                {results.map((drug, index) => (
                  <motion.button
                    key={drug.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelect(drug)}
                    className="w-full rounded-sm p-2 text-left text-sm hover:bg-muted cursor-pointer"
                  >
                    <div className="font-medium">{drug.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Mã: {drug.code} {drug.status && `• ${drug.status}`}
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
