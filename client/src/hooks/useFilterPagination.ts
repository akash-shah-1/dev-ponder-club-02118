import { useState, useMemo } from "react";

export type FilterType = "newest" | "active" | "unanswered" | "solved";

interface UseFilterPaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
  filterFn?: (item: T, filter: FilterType) => boolean;
}

interface UseFilterPaginationReturn<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  currentFilter: FilterType;
  setCurrentPage: (page: number) => void;
  setCurrentFilter: (filter: FilterType) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function useFilterPagination<T>({
  items,
  itemsPerPage = 10,
  filterFn,
}: UseFilterPaginationProps<T>): UseFilterPaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("newest");

  // Apply filter
  const filteredItems = useMemo(() => {
    if (!filterFn) return items;
    return items.filter((item) => filterFn(item, currentFilter));
  }, [items, currentFilter, filterFn]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    currentFilter,
    setCurrentPage,
    setCurrentFilter: handleFilterChange,
    goToNextPage,
    goToPreviousPage,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
  };
}
