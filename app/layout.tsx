import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ResearchLoop",
    template: "%s · ResearchLoop"
  },
  description: "Turn research-writing feedback into vocabulary, grammar practice, and spaced review."
};

const navItems = [
  ["/", "闭环仪表盘"],
  ["/writing", "科研英语闭环"],
  ["/review", "今日复习"],
  ["/words", "词库"],
  ["/grammar", "语法训练"],
  ["/daily", "每日一句"],
  ["/listening", "听力训练"],
  ["/settings", "设置"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <Link className="brand" href="/">
              ResearchLoop
              <span>科研英语学习闭环</span>
            </Link>
            <nav className="nav" aria-label="主要导航">
              {navItems.map(([href, label]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
