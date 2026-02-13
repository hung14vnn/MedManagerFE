import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DrugDetailDto } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/helpers';
import { Pill, Syringe, Calendar, Code } from 'lucide-react';

interface DrugDetailCardProps {
  drug: DrugDetailDto;
}

export function DrugDetailCard({ drug }: DrugDetailCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Deprecated':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-xl md:text-2xl mb-2">{drug.name}</CardTitle>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Code className="h-3 w-3 md:h-4 md:w-4" />
                <span>Mã: {drug.code}</span>
              </div>
            </div>
            <Badge className={`${getStatusColor(drug.status)} shrink-0`}>
              {drug.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info" className="text-xs md:text-sm">Thông tin</TabsTrigger>
              <TabsTrigger value="references" className="text-xs md:text-sm">Tham khảo</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 md:space-y-6 mt-4">
              {/* Ingredients Section */}
              <div>
                <h3 className="mb-2 md:mb-3 text-sm md:text-base font-semibold flex items-center gap-2">
                  <Pill className="h-3 w-3 md:h-4 md:w-4" />
                  Hoạt chất
                </h3>
                {drug.ingredients?.length > 0 ? (
                  <div className="space-y-2">
                    {drug.ingredients.map((di) => (
                      <div
                        key={di.id}
                        className="rounded-lg border p-2 md:p-3 bg-muted/30"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm md:text-base truncate">{di.ingredient.name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Mã: {di.ingredient.code}
                            </p>
                          </div>
                          {(di.strength || di.unit) && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {di.strength} {di.unit}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs md:text-sm text-muted-foreground italic">
                    Không có thông tin hoạt chất
                  </p>
                )}
              </div>

              {/* Dosage Form & Route Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Dạng bào chế</h3>
                  {drug.dosageForm ? (
                    <div className="rounded-lg border p-2 md:p-3 bg-muted/30">
                      <p className="font-medium text-sm">{drug.dosageForm.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Mã: {drug.dosageForm.code}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm text-muted-foreground italic">
                      Không có thông tin
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold flex items-center gap-2">
                    <Syringe className="h-3 w-3 md:h-4 md:w-4" />
                    Đường dùng
                  </h3>
                  {drug.route ? (
                    <div className="rounded-lg border p-2 md:p-3 bg-muted/30">
                      <p className="font-medium text-sm">{drug.route.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Mã: {drug.route.code}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm text-muted-foreground italic">
                      Không có thông tin
                    </p>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="pt-3 md:pt-4 border-t">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Tạo: {formatDate(drug.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Cập nhật: {formatDate(drug.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="references">
              {drug.references?.length > 0 ? (
                <div className="space-y-2 md:space-y-3 mt-4">
                  {drug.references.map((ref) => (
                    <motion.div
                      key={ref.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border p-2 md:p-3"
                    >
                      <h4 className="font-medium text-sm">{ref.title}</h4>
                      {ref.authors && (
                        <p className="text-xs md:text-sm text-muted-foreground">{ref.authors}</p>
                      )}
                      {ref.source && (
                        <p className="text-xs md:text-sm text-muted-foreground">{ref.source}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {ref.publicationDate && <span>{formatDate(ref.publicationDate)}</span>}
                        {ref.doi && <span>DOI: {ref.doi}</span>}
                      </div>
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs md:text-sm text-primary hover:underline inline-block mt-1"
                        >
                          Xem nguồn
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-xs md:text-sm text-muted-foreground mt-4">Không có tài liệu tham khảo</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
