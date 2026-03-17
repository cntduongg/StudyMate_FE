export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  timeLimit: number; // seconds
}

export const gameQuestions: Question[] = [
  {
    id: 1,
    question: "Ngôn ngữ nào được sử dụng phổ biến nhất cho phát triển Web Frontend?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2,
    points: 100,
    timeLimit: 15
  },
  {
    id: 2,
    question: "Trong React, Hook nào được dùng để quản lý trạng thái (state)?",
    options: ["useEffect", "useContext", "useReducer", "useState"],
    correctAnswer: 3,
    points: 150,
    timeLimit: 10
  },
  {
    id: 3,
    question: "CSS là viết tắt của cụm từ nào?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 1,
    points: 100,
    timeLimit: 15
  },
  {
    id: 4,
    question: "Thẻ HTML nào dùng để tạo một liên kết (link)?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
    points: 100,
    timeLimit: 10
  },
  {
    id: 5,
    question: "Đâu là một Framework của JavaScript?",
    options: ["Django", "Laravel", "React", "Flask"],
    correctAnswer: 2,
    points: 150,
    timeLimit: 15
  },
  { id: 6, question: "Độ phức tạp của tìm kiếm nhị phân (Binary Search) là gì?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 7, question: "Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 8, question: "SQL dùng để làm gì?", options: ["Thiết kế UI", "Quản lý cơ sở dữ liệu", "Viết API", "Xử lý ảnh"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 9, question: "HTTP method nào dùng để tạo mới tài nguyên?", options: ["GET", "POST", "PUT", "DELETE"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 10, question: "Khóa chính (Primary Key) trong database có đặc điểm gì?", options: ["Có thể trùng", "Có thể null", "Không trùng và không null", "Chỉ là index"], correctAnswer: 2, points: 150, timeLimit: 15 },

  { id: 11, question: "Độ phức tạp của thuật toán Bubble Sort (worst case) là gì?", options: ["O(n)", "O(log n)", "O(n^2)", "O(n log n)"], correctAnswer: 2, points: 150, timeLimit: 15 },

  { id: 12, question: "Trong RESTful API, status code 404 có nghĩa là gì?", options: ["Success", "Unauthorized", "Not Found", "Server Error"], correctAnswer: 2, points: 100, timeLimit: 10 },

  { id: 13, question: "Ngôn ngữ nào là strongly typed?", options: ["JavaScript", "Python", "C#", "PHP"], correctAnswer: 2, points: 150, timeLimit: 15 },

  { id: 14, question: "Queue hoạt động theo nguyên tắc nào?", options: ["LIFO", "FIFO", "Random", "Priority"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 15, question: "JOIN trong SQL dùng để làm gì?", options: ["Xóa bảng", "Kết hợp dữ liệu từ nhiều bảng", "Tạo bảng", "Cập nhật dữ liệu"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 16, question: "Độ phức tạp truy cập phần tử trong mảng (array) là gì?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctAnswer: 2, points: 100, timeLimit: 10 },

  { id: 17, question: "HTTP method nào dùng để cập nhật toàn bộ tài nguyên?", options: ["PATCH", "POST", "PUT", "GET"], correctAnswer: 2, points: 150, timeLimit: 15 },

  { id: 18, question: "Thuật toán nào dùng để duyệt cây theo chiều rộng?", options: ["DFS", "BFS", "Binary Search", "Greedy"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 19, question: "Index trong database giúp gì?", options: ["Giảm dung lượng", "Tăng tốc truy vấn", "Xóa dữ liệu", "Backup dữ liệu"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 20, question: "Đâu là kiểu dữ liệu tham chiếu trong C#?", options: ["int", "double", "string", "bool"], correctAnswer: 2, points: 150, timeLimit: 15 },

  { id: 21, question: "Big-O của duyệt toàn bộ mảng là gì?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correctAnswer: 2, points: 100, timeLimit: 10 },

  { id: 22, question: "HTTP status code 500 có nghĩa là gì?", options: ["Client Error", "Success", "Server Error", "Redirect"], correctAnswer: 2, points: 100, timeLimit: 10 },

  { id: 23, question: "Linked List khác Array ở điểm nào?", options: ["Không lưu liên tục trong bộ nhớ", "Truy cập nhanh hơn", "Không cần con trỏ", "Luôn nhỏ hơn"], correctAnswer: 0, points: 200, timeLimit: 20 },

  { id: 24, question: "Normalization trong database nhằm mục đích gì?", options: ["Tăng tốc độ server", "Giảm dư thừa dữ liệu", "Tăng dung lượng", "Xóa bảng"], correctAnswer: 1, points: 200, timeLimit: 20 },

  { id: 25, question: "Độ phức tạp trung bình của Quick Sort là gì?", options: ["O(n^2)", "O(log n)", "O(n log n)", "O(n)"], correctAnswer: 2, points: 200, timeLimit: 20 },
  { id: 26, question: "Đâu là ví dụ của ngôn ngữ lập trình hướng đối tượng?", options: ["HTML", "CSS", "Java", "SQL"], correctAnswer: 2, points: 100, timeLimit: 10 },

  { id: 27, question: "Stack Overflow thường xảy ra khi nào?", options: ["Thiếu RAM", "Đệ quy không có điểm dừng", "Lỗi cú pháp", "Sai kiểu dữ liệu"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 28, question: "Trong SQL, câu lệnh nào dùng để lấy dữ liệu?", options: ["GET", "SELECT", "FETCH", "READ"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 29, question: "Độ phức tạp của truy cập phần tử trong Linked List là gì?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctAnswer: 2, points: 150, timeLimit: 15 },

  { id: 30, question: "HTTP method nào dùng để xóa tài nguyên?", options: ["GET", "POST", "DELETE", "PUT"], correctAnswer: 2, points: 100, timeLimit: 10 },

  { id: 31, question: "Thuật toán nào là Divide and Conquer?", options: ["Bubble Sort", "Quick Sort", "Linear Search", "Insertion Sort"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 32, question: "JSON là viết tắt của gì?", options: ["Java Standard Object Notation", "JavaScript Object Notation", "Java Source Open Network", "Joint System Object Notation"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 33, question: "Trong database, FOREIGN KEY dùng để làm gì?", options: ["Tạo index", "Liên kết giữa các bảng", "Xóa dữ liệu", "Tăng tốc truy vấn"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 34, question: "Đệ quy là gì?", options: ["Vòng lặp vô hạn", "Hàm gọi chính nó", "Hàm không trả về", "Hàm static"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 35, question: "Big-O của Linear Search là gì?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correctAnswer: 2, points: 100, timeLimit: 10 },

  { id: 36, question: "HTTP status code 201 có nghĩa là gì?", options: ["OK", "Created", "Accepted", "No Content"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 37, question: "Cấu trúc dữ liệu nào phù hợp để implement Queue?", options: ["Stack", "Array", "Linked List", "Tree"], correctAnswer: 2, points: 150, timeLimit: 15 },

  { id: 38, question: "Trong C#, từ khóa nào dùng để kế thừa?", options: ["implements", "extends", "inherits", ":"], correctAnswer: 3, points: 150, timeLimit: 15 },

  { id: 39, question: "RESTful API thường trả dữ liệu dưới dạng gì?", options: ["XML", "JSON", "HTML", "Binary"], correctAnswer: 1, points: 100, timeLimit: 10 },

  { id: 40, question: "Đâu là thuật toán sắp xếp ổn định (stable sort)?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], correctAnswer: 2, points: 200, timeLimit: 20 },

  { id: 41, question: "Index trong database hoạt động giống cấu trúc nào?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswer: 2, points: 200, timeLimit: 20 },

  { id: 42, question: "Trong REST, endpoint nên là gì?", options: ["Verb-based", "Noun-based", "Adjective-based", "Random"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 43, question: "Độ phức tạp của Merge Sort là gì?", options: ["O(n^2)", "O(n log n)", "O(log n)", "O(n)"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 44, question: "Trong C#, interface dùng để làm gì?", options: ["Lưu dữ liệu", "Định nghĩa hành vi", "Xử lý lỗi", "Tạo object"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 45, question: "ACID trong database đảm bảo điều gì?", options: ["Hiệu suất", "Tính toàn vẹn giao dịch", "Tốc độ truy vấn", "Dung lượng"], correctAnswer: 1, points: 200, timeLimit: 20 },

  { id: 46, question: "Graph có thể được duyệt bằng những thuật toán nào?", options: ["BFS và DFS", "Quick Sort", "Binary Search", "Merge Sort"], correctAnswer: 0, points: 150, timeLimit: 15 },

  { id: 47, question: "Trong HTTP, PUT và PATCH khác nhau ở điểm nào?", options: ["Không khác", "PUT update toàn bộ, PATCH update một phần", "PATCH nhanh hơn", "PUT chỉ dùng GET"], correctAnswer: 1, points: 200, timeLimit: 20 },

  { id: 48, question: "Deadlock xảy ra khi nào?", options: ["CPU quá tải", "Các tiến trình chờ nhau vô hạn", "Thiếu RAM", "Network lỗi"], correctAnswer: 1, points: 200, timeLimit: 20 },

  { id: 49, question: "Trong SQL, GROUP BY dùng để làm gì?", options: ["Sắp xếp", "Nhóm dữ liệu", "Xóa dữ liệu", "Tạo bảng"], correctAnswer: 1, points: 150, timeLimit: 15 },

  { id: 50, question: "Hash Table có độ phức tạp trung bình cho insert/search là gì?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctAnswer: 2, points: 200, timeLimit: 20 }
];
