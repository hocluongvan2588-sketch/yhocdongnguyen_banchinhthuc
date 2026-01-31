import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Điều khoản dịch vụ" subtitle="Terms of Service" showBackButton backUrl="/" />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Điều khoản sử dụng dịch vụ</h1>
          <p className="text-muted-foreground">Cập nhật lần cuối: Tháng 1 năm 2026</p>
        </div>

        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <AlertDescription className="text-amber-900 dark:text-amber-200">
            <strong>Lưu ý quan trọng:</strong> Dịch vụ này cung cấp tham khảo về sức khỏe dựa trên 
            Dịch học cổ truyền và không thay thế cho chẩn đoán hoặc điều trị y tế chuyên nghiệp. 
            Luôn tham khảo ý kiến bác sĩ cho các vấn đề sức khỏe nghiêm trọng.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Chấp nhận điều khoản</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bằng việc truy cập và sử dụng dịch vụ Mai Hoa Tâm Pháp (sau đây gọi là "Dịch vụ"), 
                bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản sử dụng này. Nếu bạn không 
                đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng Dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Mô tả dịch vụ</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Mai Hoa Tâm Pháp cung cấp nền tảng tham vấn sức khỏe dựa trên:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                <li>Phương pháp Mai Hoa Dịch Số (梅花易数) theo truyền thống Thiệu Khang Tiết</li>
                <li>Hệ thống Bát Quái (八卦) và Ngũ Hành (五行)</li>
                <li>Lý thuyết Dịch học cổ truyền Trung Quốc</li>
                <li>Công nghệ AI và mô hình ngôn ngữ lớn để phân tích và tư vấn</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Dịch vụ này mang tính chất <strong className="text-foreground">tham khảo và hỗ trợ</strong>, 
                không phải là dịch vụ y tế chính thống.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Tài khoản người dùng</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-foreground">3.1. Đăng ký tài khoản</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Để sử dụng một số tính năng của Dịch vụ, bạn cần tạo tài khoản. Bạn cam kết:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                  <li>Duy trì bảo mật thông tin đăng nhập của bạn</li>
                  <li>Chịu trách nhiệm cho tất cả hoạt động diễn ra dưới tài khoản của bạn</li>
                  <li>Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ vi phạm bảo mật nào</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mt-4">3.2. Giới hạn sử dụng</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Người dùng miễn phí được giới hạn <strong className="text-foreground">3 lượt hỏi quẻ mỗi ngày</strong>. 
                  Các gói dịch vụ trả phí sẽ có giới hạn khác nhau tùy theo gói đã đăng ký.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Quy tắc sử dụng</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Khi sử dụng Dịch vụ, bạn cam kết <strong className="text-foreground">KHÔNG</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                <li>Vi phạm bất kỳ luật lệ hoặc quy định nào</li>
                <li>Sử dụng Dịch vụ cho mục đích bất hợp pháp hoặc gian lận</li>
                <li>Gieo quẻ bừa bãi hoặc lạm dụng hệ thống</li>
                <li>Cố gắng truy cập trái phép vào hệ thống hoặc dữ liệu của người dùng khác</li>
                <li>Sử dụng bot, script, hoặc công cụ tự động để truy cập Dịch vụ</li>
                <li>Can thiệp hoặc làm gián đoạn hoạt động của Dịch vụ</li>
                <li>Sao chép, phân phối, hoặc sử dụng nội dung của Dịch vụ cho mục đích thương mại mà không được phép</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Tính chất tham khảo - Tuyên bố từ chối trách nhiệm y tế</h2>
              <div className="bg-amber-500/5 border border-amber-500/30 p-4 rounded-lg mb-3">
                <p className="text-foreground font-semibold mb-2">QUAN TRỌNG - VUI LÒNG ĐỌC KỸ:</p>
                <p className="text-muted-foreground leading-relaxed">
                  Dịch vụ Mai Hoa Tâm Pháp cung cấp thông tin và tư vấn dựa trên Dịch học cổ truyền, 
                  <strong className="text-foreground"> KHÔNG PHẢI</strong> là dịch vụ y tế, chẩn đoán bệnh, 
                  hoặc điều trị y khoa. Thông tin được cung cấp chỉ mang tính chất tham khảo.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Bạn thừa nhận và đồng ý rằng:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                <li>Dịch vụ không thay thế cho lời khuyên, chẩn đoán, hoặc điều trị y tế chuyên nghiệp</li>
                <li>Bạn nên luôn tham khảo ý kiến bác sĩ hoặc chuyên gia y tế cho các vấn đề sức khỏe</li>
                <li>Không bao giờ bỏ qua lời khuyên y tế hoặc trì hoãn việc tìm kiếm sự chăm sóc y tế vì thông tin từ Dịch vụ</li>
                <li>Trong trường hợp khẩn cấp y tế, hãy liên hệ ngay với dịch vụ y tế khẩn cấp</li>
                <li>Chúng tôi không chịu trách nhiệm cho bất kỳ quyết định y tế nào bạn đưa ra dựa trên thông tin từ Dịch vụ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Thanh toán và hoàn tiền</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-foreground">6.1. Gói dịch vụ trả phí</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chúng tôi cung cấp các gói dịch vụ trả phí với nhiều mức độ truy cập khác nhau. 
                  Tất cả các khoản phí được hiển thị bằng VND và có thể thay đổi theo thông báo trước.
                </p>

                <h3 className="text-xl font-medium text-foreground mt-4">6.2. Chính sách hoàn tiền</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Các gói dịch vụ đã thanh toán có thể được hoàn tiền trong vòng <strong className="text-foreground">7 ngày</strong> kể 
                  từ ngày mua nếu bạn chưa sử dụng quá 50% số lượt truy vấn trong gói. 
                  Để yêu cầu hoàn tiền, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.
                </p>

                <h3 className="text-xl font-medium text-foreground mt-4">6.3. Gia hạn tự động</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Một số gói dịch vụ có thể tự động gia hạn. Bạn có thể hủy gia hạn tự động bất kỳ lúc nào 
                  trong cài đặt tài khoản. Việc hủy sẽ có hiệu lực vào cuối chu kỳ thanh toán hiện tại.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Quyền sở hữu trí tuệ</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Tất cả nội dung, thiết kế, văn bản, đồ họa, giao diện, mã nguồn, và phần mềm liên quan 
                đến Dịch vụ thuộc quyền sở hữu của Mai Hoa Tâm Pháp hoặc các bên cấp phép của chúng tôi 
                và được bảo vệ bởi luật bản quyền và sở hữu trí tuệ.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Bạn được cấp giấy phép hạn chế, không độc quyền, không thể chuyển nhượng để sử dụng 
                Dịch vụ cho mục đích cá nhân, phi thương mại. Bạn không được sao chép, sửa đổi, phân phối, 
                hoặc tạo ra các sản phẩm phái sinh từ Dịch vụ mà không có sự cho phép bằng văn bản của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Giới hạn trách nhiệm</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                TRONG PHẠM VI TỐI ĐA ĐƯỢC PHÁP LUẬT CHO PHÉP:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                <li>
                  Dịch vụ được cung cấp "NGUYÊN TRẠNG" và "KHẢ DỤNG" mà không có bất kỳ đảm bảo nào, 
                  dù rõ ràng hay ngụ ý
                </li>
                <li>
                  Chúng tôi không đảm bảo rằng Dịch vụ sẽ không bị gián đoạn, không có lỗi, 
                  hoặc không có vi-rút hoặc thành phần có hại khác
                </li>
                <li>
                  Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, 
                  ngẫu nhiên, đặc biệt, hoặc hệ quả phát sinh từ việc sử dụng hoặc không thể sử dụng Dịch vụ
                </li>
                <li>
                  Tổng trách nhiệm của chúng tôi đối với bạn sẽ không vượt quá số tiền bạn đã trả 
                  cho Dịch vụ trong 3 tháng gần nhất
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. Quyền chấm dứt</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn vào Dịch vụ 
                bất cứ lúc nào, với hoặc không có lý do, với hoặc không có thông báo trước, 
                bao gồm nhưng không giới hạn ở việc vi phạm các Điều khoản này. 
                Bạn cũng có thể chấm dứt tài khoản của mình bất kỳ lúc nào bằng cách liên hệ với chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">10. Luật áp dụng và giải quyết tranh chấp</h2>
              <p className="text-muted-foreground leading-relaxed">
                Các Điều khoản này được điều chỉnh và hiểu theo luật pháp Việt Nam. 
                Mọi tranh chấp phát sinh từ hoặc liên quan đến Điều khoản này hoặc Dịch vụ 
                sẽ được giải quyết thông qua thương lượng thiện chí. Nếu không thể giải quyết, 
                tranh chấp sẽ được đưa ra tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">11. Thay đổi điều khoản</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi có quyền sửa đổi các Điều khoản này bất kỳ lúc nào. Các thay đổi quan trọng 
                sẽ được thông báo qua email hoặc thông báo trên Dịch vụ. Việc tiếp tục sử dụng Dịch vụ 
                sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các Điều khoản mới.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">12. Điều khoản khác</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-foreground">12.1. Tính độc lập</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nếu bất kỳ điều khoản nào trong Điều khoản này bị coi là không hợp lệ hoặc không thể thi hành, 
                  các điều khoản còn lại vẫn có hiệu lực đầy đủ.
                </p>

                <h3 className="text-xl font-medium text-foreground mt-4">12.2. Toàn bộ thỏa thuận</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Điều khoản này cùng với Chính sách bảo mật cấu thành toàn bộ thỏa thuận giữa bạn và 
                  Mai Hoa Tâm Pháp liên quan đến việc sử dụng Dịch vụ.
                </p>

                <h3 className="text-xl font-medium text-foreground mt-4">12.3. Không chuyển nhượng</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bạn không được chuyển nhượng hoặc chuyển giao quyền và nghĩa vụ của mình theo Điều khoản này 
                  mà không có sự đồng ý trước bằng văn bản của chúng tôi.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">13. Liên hệ</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi:
              </p>
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Email:</strong> support@ydichdongnguyen.com
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">Website:</strong> https://www.ydichdongnguyen.com
                </p>
              </div>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                Bằng việc sử dụng Dịch vụ Mai Hoa Tâm Pháp, bạn xác nhận rằng bạn đã đọc, hiểu, 
                và đồng ý bị ràng buộc bởi các Điều khoản sử dụng này.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
