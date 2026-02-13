import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export function ImportantInfo() {
    return (
        <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-green-900">Lưu ý quan trọng</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="text-sm text-green-800">
                <ul className="list-disc space-y-2 pl-5">
                    <li>
                        Thông tin được tổng hợp từ các nguồn tài liệu và hướng dẫn chuyên môn đáng tin cậy phục vụ thực hành điều trị và hỗ trợ quyết định sử dụng thuốc an toàn, hiệu quả.
                    </li>
                    <li>
                        Nội dung đăng tải nhằm mục đích tham khảo chuyên môn, không thay thế cho việc chẩn đoán, chỉ định hoặc tư vấn của nhân viên y tế.
                    </li>
                    <li>
                        Chúng tôi sẽ liên tục cập nhật và có thể điều chỉnh nội dung theo thời gian dựa trên tài liệu chuyên môn mới nhất.
                    </li>
                    <li>
                        Việc áp dụng thông tin cần được cân nhắc trên từng người bệnh và cần có sự tham khảo ý kiến từ nhân viên y tế.
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
}
