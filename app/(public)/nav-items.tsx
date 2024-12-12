"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Thống kê",
    href: "/statistical",
  },
];

export default function NavItems({ className }: { className?: string }) {
  const router = useRouter();

  return menuItems.map((item) => {
    const handleClick = (e: React.MouseEvent) => {
      if (item.href === "/") {
        e.preventDefault();
        router.push("/");
        router.refresh();
      }
    };

    return (
      <Link
        href={item.href}
        key={item.href}
        className={className}
        onClick={handleClick}
      >
        {item.title}
      </Link>
    );
  });
}
