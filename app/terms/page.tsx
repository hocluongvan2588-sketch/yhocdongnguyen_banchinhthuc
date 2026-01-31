import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Điều khoản dịch vụ | Mai Hoa Tâm Pháp',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ Mai Hoa Tâm Pháp',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Mai Hoa Tâm Pháp" subtitle="梅花心法" showBackButton backUrl="/" />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Điều khoản dịch vụ
          </h1>
          
          <p className="mb-8 text-pretty text-lg text-muted-foreground">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">1. Chấp nhận điều khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Bằng việc truy cập và sử dụng dịch vụ Mai Hoa Tâm Pháp, bạn đồng ý tuân thủ các điều khoản 
                  và điều kiện được quy định trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của 
                  các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">2. Mô tả dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Mai Hoa Tâm Pháp cung cấp dịch vụ chẩn đoán và tư vấn sức khỏe dựa trên phương pháp 
                  Mai Hoa Dịch Số - một hệ thống lý thuyết kết hợp giữa Dịch học cổ truyền và Y học Đông phương.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-foreground">Lập quẻ Mai Hoa:</strong> Tính toán quẻ Tiên thiên dựa trên thời gian.
                  </li>
                  <li>
                    <strong className="text-foreground">Phân tích sức khỏe:</strong> Đánh giá tình trạng sức khỏe qua Bát Quái và Ngũ Hành.
                  </li>
                  <li>
                    <strong className="text-foreground">Gợi ý điều trị:</strong> Đề xuất phương pháp điều trị theo Y học cổ truyền.
                  </li>
                  <li>
                    <strong className="text-foreground">Lưu trữ lịch sử:</strong> Quản lý và xem lại các lần lập quẻ trước đó.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">3. Tài khoản người dùng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <h4 className="font-semibold text-foreground">3.1. Đăng ký tài khoản</h4>
                <p>
                  Để sử dụng đầy đủ các tính năng của dịch vụ, bạn cần tạo tài khoản bằng email và mật khẩu. 
                  Bạn cam kết cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký.
                </p>
                
                <h4 className="font-semibold text-foreground">3.2. Bảo mật tài khoản</h4>
                <p>
                  Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình và chịu trách nhiệm về mọi 
                  hoạt động diễn ra dưới tài khoản của bạn. Vui lòng thông báo ngay cho chúng tôi nếu 
                  phát hiện bất kỳ truy cập trái phép nào.
                </p>

                <h4 className="font-semibold text-foreground">3.3. Giới hạn sử dụng</h4>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Người dùng miễn phí: 3 lượt lập quẻ mỗi ngày.</li>
                  <li>Gói Cơ bản: Không giới hạn số lượt lập quẻ trong thời hạn gói.</li>
                  <li>Gói Nâng cao: Tất cả tính năng không giới hạn, kèm tư vấn chuyên sâu.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">4. Quy định sử dụng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Khi sử dụng dịch vụ Mai Hoa Tâm Pháp, bạn cam kết KHÔNG:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Sử dụng dịch vụ cho mục đích bất hợp pháp hoặc vi phạm quy định pháp luật.</li>
                  <li>Cố gắng truy cập trái phép vào hệ thống, tài khoản của người dùng khác.</li>
                  <li>Sử dụng bot, script hoặc công cụ tự động để truy cập dịch vụ mà không được phép.</li>
                  <li>Sao chép, phân phối, hoặc sử dụng nội dung của dịch vụ cho mục đích thương mại mà không có sự đồng ý bằng văn bản.</li>
                  <li>Gửi spam, virus, hoặc bất kỳ mã độc nào có thể gây hại cho hệ thống.</li>
                  <li>Mạo danh người khác hoặc cung cấp thông tin sai lệch.</li>
                  <li>Quấy rối, lạm dụng, hoặc gây hại cho người dùng khác.</li>
                </ul>
                <p className="pt-4">
                  Vi phạm bất kỳ quy định nào trên có thể dẫn đến việc tạm ngừng hoặc chấm dứt tài khoản của bạn 
                  mà không cần thông báo trước.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">5. Thanh toán và hoàn tiền</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <h4 className="font-semibold text-foreground">5.1. Phương thức thanh toán</h4>
                <p>
                  Chúng tôi chấp nhận thanh toán qua chuyển khoản ngân hàng. Thông tin thanh toán sẽ được 
                  cung cấp rõ ràng trong quá trình mua gói dịch vụ.
                </p>

                <h4 className="font-semibold text-foreground">5.2. Kích hoạt gói dịch vụ</h4>
                <p>
                  Sau khi thanh toán thành công, gói dịch vụ sẽ được kích hoạt tự động hoặc trong vòng 24 giờ 
                  (đối với thanh toán chuyển khoản thủ công). Bạn sẽ nhận được email xác nhận khi gói được kích hoạt.
                </p>

                <h4 className="font-semibold text-foreground">5.3. Chính sách hoàn tiền</h4>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-foreground">Hoàn tiền 100%:</strong> Nếu gói dịch vụ chưa được sử dụng 
                    và yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày mua.
                  </li>
                  <li>
                    <strong className="text-foreground">Không hoàn tiền:</strong> Sau 7 ngày hoặc nếu gói đã được sử dụng.
                  </li>
                  <li>
                    Thời gian xử lý hoàn tiền: 5-10 ngày làm việc kể từ khi yêu cầu được chấp nhận.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">6. Tuyên bố từ chối trách nhiệm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    ⚠️ QUAN TRỌNG: Tuyên bố từ chối trách nhiệm y tế
                  </p>
                </div>
                <ul className="list-disc space-y-3 pl-6">
                  <li>
                    Dịch vụ của Mai Hoa Tâm Pháp mang tính chất <strong className="text-foreground">tham khảo</strong> dựa trên 
                    lý thuyết Dịch học và Y học cổ truyền. Đây <strong className="text-foreground">KHÔNG PHẢI</strong> là chẩn đoán 
                    y khoa chính thức.
                  </li>
                  <li>
                    Kết quả phân tích không thay thế cho việc khám bệnh, chẩn đoán, hoặc điều trị của các chuyên gia y tế 
                    có chứng chỉ hành nghề.
                  </li>
                  <li>
                    Nếu bạn có vấn đề về sức khỏe, vui lòng <strong className="text-foreground">tham khảo ý kiến của bác sĩ 
                    hoặc thầy thuốc Đông y có chuyên môn</strong> trước khi áp dụng bất kỳ phương pháp điều trị nào.
                  </li>
                  <li>
                    Mai Hoa Tâm Pháp không chịu trách nhiệm về bất kỳ hậu quả nào phát sinh từ việc sử dụng thông tin 
                    được cung cấp bởi dịch vụ.
                  </li>
                  <li>
                    Trong trường hợp khẩn cấp, vui lòng liên hệ với dịch vụ y tế khẩn cấp địa phương ngay lập tức.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">7. Quyền sở hữu trí tuệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Tất cả nội dung, thiết kế, logo, mã nguồn, và tài liệu liên quan đến dịch vụ Mai Hoa Tâm Pháp 
                  đều thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép của chúng tôi, và được bảo vệ bởi 
                  luật sở hữu trí tuệ.
                </p>
                <p>
                  Bạn được cấp quyền sử dụng dịch vụ cho mục đích cá nhân, phi thương mại. Bạn không được sao chép, 
                  chỉnh sửa, phân phối, hoặc khai thác nội dung của dịch vụ cho mục đích thương mại mà không có 
                  sự đồng ý bằng văn bản của chúng tôi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">8. Giới hạn trách nhiệm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Trong phạm vi tối đa được pháp luật cho phép, Mai Hoa Tâm Pháp không chịu trách nhiệm về:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt, hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.</li>
                  <li>Sự gián đoạn, lỗi, hoặc mất mát dữ liệu trong quá trình sử dụng dịch vụ.</li>
                  <li>Hành vi của bên thứ ba hoặc nội dung do người dùng khác tạo ra.</li>
                  <li>Việc truy cập trái phép vào máy chủ hoặc dữ liệu của chúng tôi.</li>
                </ul>
                <p className="pt-4">
                  Chúng tôi không đảm bảo rằng dịch vụ sẽ luôn khả dụng, không bị gián đoạn, an toàn, hoặc không có lỗi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">9. Chấm dứt dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Chúng tôi có quyền tạm ngừng hoặc chấm dứt quyền truy cập của bạn vào dịch vụ bất kỳ lúc nào, 
                  với hoặc không có thông báo trước, nếu:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Bạn vi phạm bất kỳ điều khoản nào trong tài liệu này.</li>
                  <li>Chúng tôi nghi ngờ hoạt động gian lận hoặc lạm dụng dịch vụ.</li>
                  <li>Theo yêu cầu của pháp luật hoặc cơ quan chức năng.</li>
                  <li>Chúng tôi quyết định ngừng cung cấp dịch vụ.</li>
                </ul>
                <p className="pt-4">
                  Bạn cũng có thể yêu cầu xóa tài khoản bất kỳ lúc nào bằng cách liên hệ với chúng tôi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">10. Thay đổi điều khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Mai Hoa Tâm Pháp có quyền cập nhật hoặc sửa đổi các Điều khoản dịch vụ này bất kỳ lúc nào. 
                  Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng qua email hoặc thông báo trên website.
                </p>
                <p>
                  Việc bạn tiếp tục sử dụng dịch vụ sau khi các điều khoản được cập nhật đồng nghĩa với việc 
                  bạn chấp nhận các thay đổi đó. Nếu bạn không đồng ý với các điều khoản mới, vui lòng ngừng 
                  sử dụng dịch vụ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">11. Luật áp dụng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Các Điều khoản dịch vụ này được điều chỉnh và giải thích theo pháp luật Việt Nam. 
                  Mọi tranh chấp phát sinh từ hoặc liên quan đến việc sử dụng dịch vụ sẽ được giải quyết 
                  tại các tòa án có thẩm quyền tại Việt Nam.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">12. Liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                  <p><strong className="text-foreground">Email:</strong> support@maihoatamphat.com</p>
                  <p><strong className="text-foreground">Hotline:</strong> 1900-xxxx</p>
                  <p><strong className="text-foreground">Địa chỉ:</strong> Việt Nam</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Mai Hoa Tâm Pháp. Mọi quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}
