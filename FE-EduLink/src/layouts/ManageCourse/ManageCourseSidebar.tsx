'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  isOptional?: boolean;
  path: string;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

interface ManageCourseSidebarProps {
  courseId: string;
  currentStep?: string;
}

const ManageCourseSidebar = ({ courseId }: ManageCourseSidebarProps) => {
  const pathname = usePathname();

  // Hàm kiểm tra xem đường dẫn hiện tại có khớp với path của item không
  const isCurrentPath = (path: string) => {
    return pathname === path;
  };

  // Danh sách các bước cần hoàn thành
  const checklistSections: ChecklistSection[] = [
    {
      title: 'Lập kế hoạch khóa học',
      items: [
        {
          id: 'intended-learners',
          title: 'Đối tượng học viên',
          isCompleted: false,
          path: `/instructor/course/${courseId}/manage/goals`,
        },
      ],
    },
    {
      title: 'Tạo nội dung',
      items: [
        {
          id: 'curriculum',
          title: 'Nội dung khóa học',
          isCompleted: false,
          path: `/instructor/course/${courseId}/manage/curriculum`,
        },
      ],
    },
    {
      title: 'Xuất bản khóa học',
      items: [
        {
          id: 'course-landing-page',
          title: 'Thông tin khóa học',
          isCompleted: false,
          path: `/instructor/course/${courseId}/manage/basics`,
        },
        {
          id: 'pricing',
          title: 'Định giá',
          isCompleted: false,
          path: `/instructor/course/${courseId}/manage/pricing`,
        },
        {
          id: 'promotions',
          title: 'Khuyến mãi',
          isCompleted: false,
          path: `/instructor/course/${courseId}/manage/promotions`,
        },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {checklistSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="mb-6">
            <h2 className="text-gray-500 font-medium mb-2">{section.title}</h2>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = isCurrentPath(item.path);

                return (
                  <li key={item.id} className="relative">
                    <Link
                      href={item.path}
                      className={`flex items-center py-1 ${
                        isActive
                          ? 'text-green-600 font-medium'
                          : 'text-gray-700 hover:text-green-600'
                      } transition-colors`}
                    >
                      <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center`}>
                        {item.isCompleted && isActive && (
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>
                      {item.title}
                      {item.isOptional && (
                        <span className="text-gray-500 text-sm ml-1">(tùy chọn)</span>
                      )}
                    </Link>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mt-8">
          {/* <button
            onClick={handleSubmitForReview}
            disabled={!canSubmitForReview}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              canSubmitForReview
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-purple-300 cursor-not-allowed'
            }`}
          >
            Gửi để xét duyệt
          </button> */}
        </div>
      </div>
    </aside>
  );
};

export default ManageCourseSidebar;
