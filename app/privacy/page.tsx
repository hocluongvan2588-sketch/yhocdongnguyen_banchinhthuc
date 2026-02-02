import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Chính sách bảo mật | Mai Hoa Tâm Pháp',
  description: 'Chính sách bảo mật và quyền riêng tư của Mai Hoa Tâm Pháp',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Mai Hoa Tâm Pháp" subtitle="梅花心法" showBackButton backUrl="/" />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Chính sách bảo mật
          </h1>
          
          <p className="mb-8 text-pretty text-lg text-muted-foreground">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">1. Thông tin chúng tôi thu thập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Mai Hoa Tâm Pháp thu thập các thông tin sau khi bạn sử dụng dịch vụ của chúng tôi:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-foreground">Thông tin tài khoản:</strong> Email, mật khẩu (được mã hóa), và thông tin đăng ký cơ bản.
                  </li>
                  <li>
                    <strong className="text-foreground">Thông tin lập quẻ:</strong> Thời gian (ngày, tháng, năm, giờ), tuổi, giới tính, đối tượng hỏi quẻ, và câu hỏi tư vấn.
                  </li>
                  <li>
                    <strong className="text-foreground">Thông tin sử dụng:</strong> Lịch sử truy cập, số lượt lập quẻ, và các tương tác với hệ thống.
                  </li>
                  <li>
                    <strong className="text-foreground">Thông tin thanh toán:</strong> Thông tin giao dịch khi mua gói dịch vụ (không lưu trữ thông tin thẻ tín dụng).
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">2. Cách chúng tôi sử dụng thông tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Thông tin của bạn được sử dụng cho các mục đích sau:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Cung cấp dịch vụ chẩn đoán và phân tích theo Mai Hoa Dịch Số.</li>
                  <li>Lưu trữ lịch sử truy vấn để bạn có thể xem lại các lần lập quẻ trước đó.</li>
                  <li>Quản lý tài khoản và xác thực người dùng.</li>
                  <li>Xử lý thanh toán và quản lý gói dịch vụ.</li>
                  <li>Cải thiện chất lượng dịch vụ và phát triển tính năng mới.</li>
                  <li>Gửi thông báo quan trọng về tài khoản và dịch vụ (nếu cần thiết).</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">3. Bảo mật thông tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật tiên tiến:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Mã hóa dữ liệu truyền tải bằng SSL/TLS.</li>
                  <li>Mật khẩu được mã hóa một chiều (bcrypt) trước khi lưu trữ.</li>
                  <li>Sử dụng cơ sở dữ liệu bảo mật với Row Level Security (RLS).</li>
                  <li>Giới hạn quyền truy cập dữ liệu chỉ cho nhân viên có thẩm quyền.</li>
                  <li>Thường xuyên sao lưu và kiểm tra hệ thống bảo mật.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">4. Chia sẻ thông tin với bên thứ ba</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Mai Hoa Tâm Pháp không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ các trường hợp sau:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-foreground">Nhà cung cấp dịch vụ:</strong> Chúng tôi sử dụng các nhà cung cấp đáng tin cậy 
                    (như Supabase, Vercel) để lưu trữ và xử lý dữ liệu. Các nhà cung cấp này tuân thủ nghiêm ngặt 
                    các tiêu chuẩn bảo mật và quyền riêng tư.
                  </li>
                  <li>
                    <strong className="text-foreground">Yêu cầu pháp lý:</strong> Khi có yêu cầu từ cơ quan chức năng 
                    theo quy định pháp luật.
                  </li>
                  <li>
                    <strong className="text-foreground">Bảo vệ quyền lợi:</strong> Khi cần thiết để bảo vệ quyền lợi, 
                    tài sản, hoặc an toàn của Mai Hoa Tâm Pháp và người dùng.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">5. Quyền của người dùng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Bạn có các quyền sau đây đối với thông tin cá nhân của mình:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-foreground">Quyền truy cập:</strong> Xem và tải xuống thông tin cá nhân của bạn.
                  </li>
                  <li>
                    <strong className="text-foreground">Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông tin không chính xác.
                  </li>
                  <li>
                    <strong className="text-foreground">Quyền xóa:</strong> Yêu cầu xóa tài khoản và toàn bộ dữ liệu cá nhân.
                  </li>
                  <li>
                    <strong className="text-foreground">Quyền từ chối:</strong> Từ chối nhận email marketing (nếu có).
                  </li>
                </ul>
                <p className="pt-4">
                  Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: <strong className="text-foreground">support@maihoatamphat.com</strong>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">6. Cookie và công nghệ theo dõi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Chúng tôi sử dụng cookie và các công nghệ tương tự để:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Duy trì phiên đăng nhập và xác thực người dùng.</li>
                  <li>Lưu trữ tùy chọn ngôn ngữ và giao diện.</li>
                  <li>Phân tích cách người dùng sử dụng dịch vụ để cải thiện trải nghiệm.</li>
                </ul>
                <p className="pt-4">
                  Bạn có thể cấu hình trình duyệt để từ chối cookie, tuy nhiên điều này có thể ảnh hưởng đến 
                  một số tính năng của dịch vụ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">7. Lưu trữ dữ liệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Thông tin của bạn được lưu trữ trên các máy chủ an toàn và được bảo vệ bởi các biện pháp 
                  bảo mật vật lý và kỹ thuật. Chúng tôi lưu trữ dữ liệu trong thời gian cần thiết để cung cấp 
                  dịch vụ hoặc theo yêu cầu của pháp luật.
                </p>
                <p>
                  Khi bạn yêu cầu xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin cá nhân của bạn 
                  trong vòng 30 ngày, trừ khi pháp luật yêu cầu lưu trữ lâu hơn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">8. Thay đổi chính sách</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Mai Hoa Tâm Pháp có quyền cập nhật Chính sách bảo mật này theo thời gian. Chúng tôi sẽ 
                  thông báo cho bạn về các thay đổi quan trọng qua email hoặc thông báo trên website.
                </p>
                <p>
                  Việc bạn tiếp tục sử dụng dịch vụ sau khi chính sách được cập nhật đồng nghĩa với việc 
                  bạn chấp nhận các thay đổi đó.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">9. Liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này hoặc cách chúng tôi xử lý 
                  thông tin cá nhân của bạn, vui lòng liên hệ:
                </p>
                <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                  <p><strong className="text-foreground">Email:</strong> support@maihoatamphat.com</p>
                  <p><strong className="text-foreground">Hotline:</strong> 0786779493</p>
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
            © 2026 Y Dịch Đồng Nguyên. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
