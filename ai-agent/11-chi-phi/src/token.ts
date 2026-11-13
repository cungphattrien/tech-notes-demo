// Ước lượng số token của một đoạn văn. Chỉ là ước lượng thô (3 ký tự một token) để so sánh các cách làm với nhau;
// số token thật do mô hình bạn dùng đếm, và tiếng Việt thường tốn token hơn tiếng Anh.
export const uocTinhToken = (van: string): number => Math.ceil(van.length / 3);
