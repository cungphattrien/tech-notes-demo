import { chayAgent, type KetQuaAgent, type TinNhan } from "./agent.ts";
import { SYSTEM_V4 } from "./prompts.ts";

export type TuyChonPhien = {
  // Chọn phần lịch sử sẽ gửi cho mô hình. Mặc định: gửi tất cả.
  chonLichSu?: (lichSu: TinNhan[]) => TinNhan[];
  // Soạn system prompt cho lần gọi này từ toàn bộ lịch sử. Mặc định: prompt cố định của quán.
  soanSystem?: (lichSu: TinNhan[]) => string;
};

// Một phiên là một cuộc trò chuyện với một khách. Phiên giữ toàn bộ lịch sử trong bộ nhớ của tiến trình.
export function taoPhien({ chonLichSu = (lichSu) => lichSu, soanSystem = () => SYSTEM_V4 }: TuyChonPhien = {}) {
  let lichSu: TinNhan[] = [];
  return {
    async nhan(tinNhan: string): Promise<KetQuaAgent> {
      const gui = chonLichSu(lichSu);
      const kq = await chayAgent(gui, tinNhan, soanSystem(lichSu));
      // Phần mới của lượt này là những tin nhắn nằm sau phần đã gửi; nối nó vào lịch sử ĐẦY ĐỦ.
      lichSu = [...lichSu, ...kq.lichSu.slice(gui.length)];
      return kq;
    },
    get lichSu() {
      return lichSu;
    },
  };
}
