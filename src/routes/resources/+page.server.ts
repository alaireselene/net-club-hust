import type { PageServerLoad } from './$types';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  size: string;
  downloadCount: number;
  updatedAt: string;
  uploader: string;
  category: string;
}

const resources: Resource[] = [
  {
    id: 1,
    title: 'Hướng dẫn phương pháp nghiên cứu khoa học',
    description:
      'Tài liệu chi tiết về các phương pháp nghiên cứu phổ biến trong khoa học kỹ thuật, bao gồm các ví dụ thực tế và hướng dẫn thực hành. Phù hợp cho sinh viên và nghiên cứu viên mới.',
    type: 'PDF',
    size: '2.5 MB',
    downloadCount: 128,
    updatedAt: '2024-02-28',
    uploader: 'TS. Nguyễn Văn A',
    category: 'Tài liệu nghiên cứu'
  },
  {
    id: 2,
    title: 'Mẫu báo cáo nghiên cứu khoa học',
    description:
      'Template chuẩn cho việc viết báo cáo nghiên cứu khoa học, được thiết kế theo tiêu chuẩn quốc tế. Bao gồm hướng dẫn định dạng và cấu trúc nội dung.',
    type: 'DOCX',
    size: '1.2 MB',
    downloadCount: 256,
    updatedAt: '2024-02-25',
    uploader: 'ThS. Trần Thị B',
    category: 'Tài liệu nghiên cứu'
  },
  {
    id: 3,
    title: 'Bộ công cụ phân tích dữ liệu',
    description:
      'Tập hợp các công cụ hỗ trợ phân tích và xử lý dữ liệu nghiên cứu. Bao gồm scripts thống kê, visualization tools, và hướng dẫn sử dụng chi tiết.',
    type: 'ZIP',
    size: '45 MB',
    downloadCount: 75,
    updatedAt: '2024-02-20',
    uploader: 'TS. Lê Văn C',
    category: 'Công cụ và phần mềm'
  },
  {
    id: 4,
    title: 'Hướng dẫn sử dụng phòng thí nghiệm',
    description:
      'Quy trình và quy định về việc sử dụng các phòng thí nghiệm của trường. Bao gồm các biện pháp an toàn, quy trình vận hành thiết bị, và thủ tục đăng ký sử dụng.',
    type: 'PDF',
    size: '3.1 MB',
    downloadCount: 182,
    updatedAt: '2024-02-15',
    uploader: 'ThS. Phạm Thị D',
    category: 'Tài liệu hướng dẫn'
  },
  {
    id: 5,
    title: 'Quy trình đăng ký thiết bị',
    description:
      'Hướng dẫn chi tiết về quy trình đăng ký và sử dụng thiết bị nghiên cứu. Bao gồm mẫu đơn, thời gian xử lý, và các yêu cầu cần thiết.',
    type: 'PDF',
    size: '1.8 MB',
    downloadCount: 94,
    updatedAt: '2024-02-10',
    uploader: 'TS. Hoàng Văn E',
    category: 'Tài liệu hướng dẫn'
  }
];


export const load: PageServerLoad = async () => {
  // In the future, this will fetch from D1 database
  // For now, returning empty object since data is hardcoded in page component
  return { resources };
};

// Future implementation will include:
// - Resource download tracking
// - Permission checks
// - File type validation
// - R2 storage integration for file downloads