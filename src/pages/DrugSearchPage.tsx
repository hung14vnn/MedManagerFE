import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { drugApi } from '@/lib/api';
import type { DrugSearchDto, DrugDetailDto } from '@/types/api';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DrugDetailCard } from '@/components/DrugDetailCard';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { debounce } from '@/lib/helpers';

export function DrugSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<DrugDetailDto | null>(null);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['drugs', 'search', debouncedTerm],
    queryFn: () => drugApi.search(debouncedTerm),
    enabled: debouncedTerm.length >= 1,
  });

  const { data: drugDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['drugs', selectedDrug?.id],
    queryFn: () => drugApi.getById(selectedDrug!.id),
    enabled: !!selectedDrug,
  });

  const handleSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedTerm(value);
    }, 300),
    []
  );

  useEffect(() => {
    return () => handleSearch.cancel?.();
  }, [handleSearch]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handleSearch(value);
    if (value.length < 1) {
      setSelectedDrug(null);
    }
  };

  const handleSelectDrug = (drug: DrugSearchDto) => {
    setSelectedDrug(drug as DrugDetailDto);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">Tra cứu thuốc</h1>
        <p className="text-muted-foreground">
          Tìm kiếm thuốc theo hoạt chất, tên thương mại hoặc nhóm dược lý
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm thuốc (vd: Aspirin, Ibuprofen)..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 text-lg"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          {searchTerm.length >= 1 && (
            <Card >
              <CardHeader>
                <CardTitle className="text-lg">Kết quả tìm kiếm</CardTitle>
              </CardHeader>
              <CardContent>
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((drug, index) => (
                      <motion.button
                        key={drug.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectDrug(drug)}
                        className={`cursor-pointer w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted ${selectedDrug?.id === drug.id ? 'border-primary bg-primary/5' : ''
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{drug.activeIngredient}</p>
                            <p className="text-sm text-muted-foreground">{drug.brandName}</p>
                            {drug.pharmacologicalGroup && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {drug.pharmacologicalGroup}
                              </Badge>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Không tìm thấy kết quả cho "{searchTerm}"
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {searchTerm.length < 1 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-sm text-muted-foreground">
                  Nhập ít nhất 1 ký tự để tìm kiếm
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          {isLoadingDetail ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : drugDetail ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <DrugDetailCard drug={drugDetail} />
            </motion.div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Chọn thuốc từ kết quả tìm kiếm để xem thông tin chi tiết
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
