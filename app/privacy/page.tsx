import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Chính sách bảo mật" subtitle="Privacy Policy" showBackButton backUrl="/" />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Chính sách bảo mật</h1>
          <p className="text-muted-foreground">Cập nhật lần cuối: Tháng 1 năm 2026</p>
        </div>

        <Card className="mb-6">
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Giới thiệu</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mai Hoa Tâm Pháp cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng. 
                Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, và bảo vệ thông tin 
                của bạn khi sử dụng dịch vụ tham vấn sức khỏe dựa trên Dịch học cổ truyền của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Thông tin chúng tôi thu thập</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-foreground">2.1. Thông tin cá nhân</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Khi bạn sử dụng dịch vụ của chúng tôi, chúng tôi có thể thu thập:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>Địa chỉ email (khi đăng ký tài khoản)</li>
                  <li>Thông tin sinh học cơ bản: tuổi, giới tính</li>
                  <li>Thông tin thời gian: ngày, tháng, năm, giờ sinh hoặc thời điểm hỏi quẻ</li>
                  <li>Câu hỏi và mục đích tham vấn sức khỏe</li>
                  <li>Lịch sử truy vấn và kết quả chẩn đoán</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mt-4">2.2. Thông tin tự động</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chúng tôi tự động thu thập một số thông tin khi bạn truy cập website:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>Địa chỉ IP và vị trí địa lý</li>
                  <li>Loại trình duyệt và thiết bị</li>
                  <li>Thời gian truy cập và trang được xem</li>
                  <li>Cookies và công nghệ theo dõi tương tự</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Cách chúng tôi sử dụng thông tin</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Chúng tôi sử dụng thông tin được thu thập để:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                <li>Cung cấp dịch vụ tham vấn sức khỏe dựa trên Mai Hoa Dịch Số</li>
                <li>Tạo và lưu trữ lịch sử truy vấn của bạn</li>
                <li>Cải thiện chất lượng dịch vụ và thuật toán phân tích</li>
                <li>Gửi thông báo về tài khoản và dịch vụ</li>
                <li>Ngăn chặn gian lận và đảm bảo an toàn hệ thống</li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Bảo mật thông tin</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ 
                thông tin cá nhân của bạn khỏi truy cập trái phép, mất mát, hoặc tiết lộ. 
                Dữ liệu được mã hóa khi truyền tải và lưu trữ trên máy chủ an toàn. 
                Tuy nhiên, không có phương thức truyền tải qua internet nào là 100% an toàn.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Chia sẻ thông tin</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Chúng tôi <strong className="text-foreground">không bán, cho thuê, hoặc chia sẻ</strong> thông tin 
                cá nhân của bạn với bên thứ ba vì mục đích thương mại. Thông tin của bạn chỉ được chia sẻ trong các trường hợp:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                <li>Với sự đồng ý rõ ràng của bạn</li>
                <li>Với các nhà cung cấp dịch vụ hỗ trợ vận hành hệ thống (ví dụ: hosting, thanh toán)</li>
                <li>Khi pháp luật yêu cầu hoặc để bảo vệ quyền lợi hợp pháp của chúng tôi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Quyền của người dùng</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Bạn có các quyền sau đây liên quan đến thông tin cá nhân:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                <li><strong className="text-foreground">Quyền truy cập:</strong> Yêu cầu bản sao thông tin cá nhân của bạn</li>
                <li><strong className="text-foreground">Quyền sửa đổi:</strong> Yêu cầu chỉnh sửa thông tin không chính xác</li>
                <li><strong className="text-foreground">Quyền xóa:</strong> Yêu cầu xóa thông tin cá nhân trong một số trường hợp nhất định</li>
                <li><strong className="text-foreground">Quyền từ chối:</strong> Từ chối việc xử lý dữ liệu cho mục đích tiếp thị</li>
                <li><strong className="text-foreground">Quyền di chuyển:</strong> Nhận dữ liệu của bạn ở định dạng có cấu trúc</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi sử dụng cookies và công nghệ tương tự để cải thiện trải nghiệm người dùng, 
                phân tích lưu lượng truy cập, và cá nhân hóa nội dung. Bạn có thể kiểm soát cookies 
                thông qua cài đặt trình duyệt của mình, nhưng việc vô hiệu hóa cookies có thể ảnh 
                hưởng đến chức năng của website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Lưu trữ dữ liệu</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi lưu trữ thông tin cá nhân của bạn chỉ trong thời gian cần thiết để đạt được 
                các mục đích đã nêu trong chính sách này, hoặc theo yêu cầu của pháp luật. Lịch sử 
                truy vấn được lưu trữ để bạn có thể xem lại, và sẽ bị xóa khi bạn yêu cầu xóa tài khoản.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. Trẻ em</h2>
              <p className="text-muted-foreground leading-relaxed">
                Dịch vụ của chúng tôi không nhắm đến trẻ em dưới 16 tuổi. Chúng tôi không cố ý thu thập 
                thông tin cá nhân từ trẻ em. Nếu bạn là phụ huynh và phát hiện con bạn đã cung cấp 
                thông tin cho chúng tôi, vui lòng liên hệ để chúng tôi có thể xóa thông tin đó.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">10. Thay đổi chính sách</h2>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Bất kỳ thay đổi nào 
                sẽ được đăng trên trang này với ngày cập nhật mới. Chúng tôi khuyến khích bạn xem xét 
                định kỳ để biết về bất kỳ thay đổi nào. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi 
                có hiệu lực đồng nghĩa với việc bạn chấp nhận chính sách mới.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">11. Liên hệ</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Chính sách bảo mật này, 
                hoặc muốn thực hiện các quyền của mình, vui lòng liên hệ với chúng tôi:
              </p>
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Email:</strong> privacy@ydichdongnguyen.com
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">Website:</strong> https://www.ydichdongnguyen.com
                </p>
              </div>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                Chính sách bảo mật này được soạn thảo để tuân thủ các quy định về bảo vệ dữ liệu cá nhân 
                tại Việt Nam và các tiêu chuẩn quốc tế về quyền riêng tư.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
