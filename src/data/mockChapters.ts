import type { Chapter } from "@/types/book";

/**
 * Mock data 4 chương sách Y Học Cổ Truyền Việt Nam
 * Dùng để test vertical scroll reader với scrollspy
 */
export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "chuong-1",
    title: "Chương 1: Tổng quan về Y Học Cổ Truyền Việt Nam",
    content: `
      <p>Y Học Cổ Truyền (YHCT) Việt Nam là một hệ thống y học lâu đời, được hình thành và phát triển qua hàng nghìn năm lịch sử. Nền y học này kết hợp giữa tri thức bản địa của người Việt với những ảnh hưởng từ y học cổ truyền Trung Hoa, tạo nên một hệ thống chẩn trị độc đáo mang đậm bản sắc dân tộc.</p>

      <p>Từ thời Hùng Vương, ông cha ta đã biết sử dụng các loại thảo dược tự nhiên để phòng và chữa bệnh. Trầu cau không chỉ là phong tục mà còn mang ý nghĩa y học — giúp tiêu hóa, diệt khuẩn. Gừng, tỏi, nghệ được dùng phổ biến trong đời sống hàng ngày vừa là gia vị vừa là thuốc.</p>

      <p>Đến thời kỳ Bắc thuộc và các triều đại phong kiến, YHCT Việt Nam tiếp thu có chọn lọc lý luận Âm Dương — Ngũ Hành, học thuyết Tạng Phủ, Kinh Lạc từ Trung y. Tuy nhiên, các danh y Việt Nam như Tuệ Tĩnh, Hải Thượng Lãn Ông đã sáng tạo và phát triển thêm nhiều phương pháp điều trị phù hợp với thể trạng và khí hậu Việt Nam.</p>

      <p>Ngày nay, YHCT Việt Nam được Nhà nước công nhận và phát triển song song với y học hiện đại. Nhiều bệnh viện YHCT được thành lập trên cả nước, kết hợp Đông — Tây y trong chẩn đoán và điều trị, mang lại hiệu quả cao cho người bệnh.</p>
    `,
  },
  {
    id: "chuong-2",
    title: "Chương 2: Học thuyết Âm Dương và Ngũ Hành",
    content: `
      <p>Học thuyết Âm Dương là nền tảng triết học cốt lõi của YHCT. Theo học thuyết này, mọi sự vật hiện tượng trong vũ trụ đều tồn tại hai mặt đối lập nhưng thống nhất: Âm và Dương. Trong cơ thể con người, Âm đại diện cho vật chất (huyết, tân dịch), Dương đại diện cho chức năng (khí, nhiệt).</p>

      <p>Sự cân bằng Âm Dương là trạng thái khỏe mạnh. Khi mất cân bằng — Âm thịnh Dương suy hoặc Dương thịnh Âm suy — bệnh tật phát sinh. Nguyên tắc điều trị cơ bản là "Hàn giả nhiệt chi, nhiệt giả hàn chi" (bệnh hàn thì dùng thuốc nhiệt, bệnh nhiệt thì dùng thuốc hàn), nhằm khôi phục lại sự cân bằng.</p>

      <p>Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ) mô tả năm loại vận động cơ bản của vật chất. Trong YHCT, Ngũ Hành được ứng dụng để giải thích mối quan hệ giữa các tạng phủ: Can (Mộc), Tâm (Hỏa), Tỳ (Thổ), Phế (Kim), Thận (Thủy). Các tạng tương sinh tương khắc lẫn nhau, tạo nên sự cân bằng sinh lý.</p>

      <p>Ví dụ, Thận Thủy sinh Can Mộc — nghĩa là Thận nuôi dưỡng Can. Khi Thận hư, Can cũng bị ảnh hưởng, gây ra các triệu chứng như chóng mặt, ù tai, mắt mờ. Hiểu được quy luật này giúp thầy thuốc không chỉ chữa triệu chứng mà còn điều trị tận gốc.</p>
    `,
  },
  {
    id: "chuong-3",
    title: "Chương 3: Phương pháp chẩn đoán Tứ Chẩn",
    content: `
      <p>Tứ Chẩn là bốn phương pháp khám bệnh cơ bản trong YHCT, bao gồm: Vọng (nhìn), Văn (nghe/ngửi), Vấn (hỏi), Thiết (sờ/bắt mạch). Bốn phương pháp này được sử dụng kết hợp để thu thập thông tin toàn diện về tình trạng bệnh nhân.</p>

      <p><strong>Vọng chẩn</strong> — quan sát thần sắc, hình thể, cử chỉ, đặc biệt là lưỡi. Lưỡi phản ánh tình trạng các tạng phủ: rêu lưỡi trắng dày gợi ý hàn thấp, rêu vàng khô gợi ý nhiệt. Chất lưỡi nhợt nhạt cho thấy huyết hư, chất lưỡi đỏ sẫm cho thấy nhiệt thịnh.</p>

      <p><strong>Văn chẩn</strong> — lắng nghe giọng nói, hơi thở, tiếng ho; ngửi mùi cơ thể, mùi hơi thở. Giọng nói yếu, thở ngắn gợi ý khí hư. Ho có đờm vàng đặc là dấu hiệu phong nhiệt. Mùi hôi tanh thường liên quan đến thấp nhiệt.</p>

      <p><strong>Vấn chẩn</strong> — hỏi bệnh nhân về triệu chứng, tiền sử, thói quen sinh hoạt. Thập vấn (10 câu hỏi kinh điển) bao gồm: hàn nhiệt, mồ hôi, đầu thân, tiểu tiện, đại tiện, ăn uống, ngực bụng, tai mắt, giấc ngủ, tiền sử bệnh.</p>

      <p><strong>Thiết chẩn</strong> — bắt mạch và sờ nắn. Mạch chẩn là kỹ thuật đặc trưng nhất của YHCT. Thầy thuốc đặt ba ngón tay lên động mạch quay ở cổ tay (vị trí Thốn, Quan, Xích) để cảm nhận tần số, lực, độ sâu của mạch. Có 28 loại mạch cơ bản, mỗi loại phản ánh một trạng thái bệnh lý khác nhau.</p>
    `,
  },
  {
    id: "chuong-4",
    title: "Chương 4: Các vị thuốc Nam thường dùng",
    content: `
      <p>Thuốc Nam là những vị thuốc có nguồn gốc từ thảo dược bản địa Việt Nam. Đại danh y Tuệ Tĩnh (thế kỷ XIV) là người đặt nền móng cho nền Thuốc Nam với câu nói nổi tiếng: "Nam dược trị Nam nhân" — thuốc Nam chữa bệnh người Nam. Ông đã nghiên cứu và hệ thống hóa hàng trăm vị thuốc từ cây cỏ Việt Nam.</p>

      <p><strong>Gừng (Sinh khương)</strong> — vị cay, tính ấm, quy kinh Phế, Tỳ, Vị. Tác dụng giải biểu tán hàn, ôn trung chỉ ẩu, hóa đờm chỉ ho. Dùng khi cảm lạnh, buồn nôn, đầy bụng. Gừng khô (Can khương) tính nhiệt hơn, dùng khi tỳ vị hư hàn.</p>

      <p><strong>Nghệ (Khương hoàng)</strong> — vị cay đắng, tính ấm, quy kinh Can, Tỳ. Tác dụng hoạt huyết, hành khí, giảm đau, tiêu viêm. Nghiên cứu hiện đại chứng minh curcumin trong nghệ có tác dụng chống oxy hóa, kháng viêm mạnh. Dân gian dùng nghệ chữa đau dạ dày, vết thương, làm đẹp da.</p>

      <p><strong>Atiso (Actiso)</strong> — được du nhập vào Việt Nam từ thời Pháp thuộc, trồng nhiều ở Đà Lạt, Sa Pa. Vị đắng, tính mát, tác dụng thanh nhiệt, lợi gan mật, lợi tiểu. Dùng trong các trường hợp viêm gan, vàng da, tiêu hóa kém, cholesterol cao.</p>

      <p><strong>Diệp hạ châu (Cây chó đẻ)</strong> — vị đắng, tính mát, quy kinh Can, Phế. Tác dụng thanh nhiệt giải độc, lợi tiểu, bảo vệ gan. Nghiên cứu cho thấy hiệu quả hỗ trợ điều trị viêm gan B. Đây là một trong những vị thuốc Nam quý, được sử dụng rộng rãi trong dân gian.</p>
    `,
  },
];
