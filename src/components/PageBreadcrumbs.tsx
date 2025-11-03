"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PageBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = decodeURIComponent(seg).replace(/-/g, " ");
    const isLast = idx === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <Breadcrumb className="px-6 py-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {items.length > 0 && <BreadcrumbSeparator />}
        {items.map((item, idx) => (
          <div key={item.href} className="contents">
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage className="capitalize">{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href} className="capitalize">
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
