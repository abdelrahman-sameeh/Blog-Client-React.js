import React from "react";
import { Pagination } from "react-bootstrap";

interface Props {
  page?: number;
  pages?: number;
  setPage: (p: number) => void;
}

export const PaginationComp = React.memo(
  ({ page = 1, pages = 1, setPage }: Props) => {
    const items = [];

    for (let i = 1; i <= pages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          className="shadow-none"
          active={i === page}
          onClick={() => setPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <>
        {pages > 1 ? (
          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            />

            {items}

            <Pagination.Next
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
            />
          </Pagination>
        ) : (
          <></>
        )}
      </>
    );
  }
);
