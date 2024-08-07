import Link from 'next/link';
import { cn } from '@/src/utils/cn';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  photographyType?: string;
  className?: string;
};

export default function Pagination({ currentPage, totalPages, photographyType, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex justify-center items-center space-x-2", className)}>
      {pages.map((page) => (
        <Link
          key={page}
          href={{
            pathname: '/discover',
            query: { ...(photographyType && { photographyType }), page },
          }}
          className={cn(
            "px-3 py-2 rounded",
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 hover:bg-blue-100"
          )}
        >
          {page}
        </Link>
      ))}
    </div>
  );
}