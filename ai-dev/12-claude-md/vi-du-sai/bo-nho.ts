// Ví dụ MỘT đoạn code mà AI (hay người mới) hay viết, nhưng Node không chạy được ở chế độ strip-only.
class BoNho {
  constructor(private ttl: number) {}
  lay() {
    return this.ttl;
  }
}
enum Muc {
  Thap,
  Cao,
}
console.log(new BoNho(5).lay(), Muc.Cao);
