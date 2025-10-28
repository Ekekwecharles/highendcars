import React from "react";
import styled from "styled-components";

const StyledPagination = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 28px 0 10px;

  button {
    color: ${({ theme }) => theme.colors.text};
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: ${({ theme }) => theme.colors.gray};
    }
  }

  .active {
    background: #d4af37;
    color: white;
  }
`;

export default function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null; // If only one page, don't render anything

  const maxPagesToShow = 5;
  let start = Math.max(1, page - 2);
  const end = Math.min(total, start + maxPagesToShow - 1);

  // Adjust start if we don't have enough pages at the end
  start = Math.max(1, end - maxPagesToShow + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <StyledPagination>
      {/* Prev button - hide if on first page */}
      {page > 1 && <button onClick={() => onChange(page - 1)}>&lt;</button>}

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={p === page ? "active" : ""}
        >
          {p}
        </button>
      ))}

      {/* Next button - hide if on last page */}
      {page < total && <button onClick={() => onChange(page + 1)}>&gt;</button>}
    </StyledPagination>
  );
}
