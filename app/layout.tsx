import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "My English Learning Website",
  description: "A personal AI-assisted English learning website."
};

const navItems = [
  ["/", "学习仪表盘"],
  ["/words", "词库"],
  ["/review", "今日复习"],
  ["/daily", "每日一句"],
  ["/grammar", "语法训练"],
  ["/writing", "科研写作"],
  ["/listening", "听力训练"],
  ["/settings", "设置"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">English Learning<br />Workspace</div>
            <nav className="nav">
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
