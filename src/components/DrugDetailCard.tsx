import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DrugDetailDto } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/helpers';

interface DrugDetailCardProps {
  drug: DrugDetailDto;
}

export function DrugDetailCard({ drug }: DrugDetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{drug.activeIngredient}</CardTitle>
              <p className="text-sm text-muted-foreground">{drug.brandName}</p>
            </div>
            {drug.pharmacologicalGroup && (
              <Badge variant="secondary">{drug.pharmacologicalGroup}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="indications">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="indications" className='cursor-pointer'>Chỉ định</TabsTrigger>
              <TabsTrigger value="dosage" className='cursor-pointer'>Liều lượng</TabsTrigger>
              <TabsTrigger value="precautions" className='cursor-pointer'>Cảnh báo</TabsTrigger>
              <TabsTrigger value="adverse" className='cursor-pointer'>Tác dụng phụ</TabsTrigger>
              <TabsTrigger value="references" className='cursor-pointer'>Tham khảo</TabsTrigger>
            </TabsList>

            <TabsContent value="indications" className="space-y-4">
              <Section title="Chỉ định" content={drug.indications} />
              <Section title="Chống chỉ định" content={drug.contraindications} />
            </TabsContent>

            <TabsContent value="dosage" className="space-y-4">
              <Section title="Người lớn" content={drug.dosageAdults} />
              <Section title="Trẻ em" content={drug.dosageChildren} />
              <Section title="Suy gan" content={drug.dosageHepaticImpairment} />
              <Section title="Suy thận" content={drug.dosageRenalImpairment} />
            </TabsContent>

            <TabsContent value="precautions" className="space-y-4">
              <Section title="Mang thai" content={drug.pregnancyPrecautions} />
              <Section title="Cho con bú" content={drug.breastfeedingPrecautions} />
              <Section title="Lưu ý khác" content={drug.otherPrecautions} />
            </TabsContent>

            <TabsContent value="adverse">
              <Section title="Tác dụng phụ" content={drug.adverseEffects} />
            </TabsContent>

            <TabsContent value="references">
              {drug.references.length > 0 ? (
                <div className="space-y-3">
                  {drug.references.map((ref) => (
                    <motion.div
                      key={ref.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border p-3"
                    >
                      <h4 className="font-medium">{ref.title}</h4>
                      {ref.authors && (
                        <p className="text-sm text-muted-foreground">{ref.authors}</p>
                      )}
                      {ref.source && (
                        <p className="text-sm text-muted-foreground">{ref.source}</p>
                      )}
                      <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                        {ref.publicationDate && <span>{formatDate(ref.publicationDate)}</span>}
                        {ref.doi && <span>DOI: {ref.doi}</span>}
                      </div>
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Xem nguồn
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Không có tài liệu tham khảo</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Section({ title, content }: { title: string; content?: string | null }) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      {content ? (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      ) : (
        <p className="text-sm text-muted-foreground italic">Không có thông tin</p>
      )}
    </div>
  );
}
