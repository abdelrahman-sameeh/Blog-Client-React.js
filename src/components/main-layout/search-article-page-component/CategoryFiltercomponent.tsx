import { useState } from "react";
import type { ICategory } from "../../../utils/interfaces/category-interface";
import { Badge, Form } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { categoriesAtom } from "../../../recoil/categories-atoms";

export const CategoryFilterComponent = ({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: ICategory[];
  setSelectedCategories: any;
}) => {
  const categories = useRecoilValue(categoriesAtom);
  const [categoryFilter, setCategoryFilter] = useState("");

  // فلترة الكاتيجوريز حسب البحث
  const filteredCategories = categories.filter((category) =>
    category?.title?.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  return (
    <div className="mb-4" style={{ maxHeight: "300px", overflow: "auto" }}>
      {/* 🧠 حقل الفلترة */}
      <Form.Control
        type="text"
        placeholder="Filter categories..."
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="mb-3 shadow-sm"
        style={{
          borderRadius: "20px",
          fontSize: "14px",
        }}
      />

      {/* 💡 عرض الكاتيجوريز */}
      <div className="d-flex flex-wrap gap-2">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => {
            const isSelected = selectedCategories?.some(
              (t) => t._id === category._id
            );
            return (
              <Badge
                key={category._id}
                bg={"light"}
                text="dark"
                style={{
                  width: "fit-content",
                  cursor: "pointer",
                  border: isSelected ? "1px solid #0d6efd" : "1px solid #ccc",
                  boxShadow: isSelected
                    ? "0 0 6px rgba(13,110,253,0.5)"
                    : "0 0 4px rgba(0,0,0,0.1)",
                  marginRight: "8px",
                  marginBottom: "8px",
                  transition: "all 0.2s ease-in-out",
                }}
                className="user-select-none"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => {
                  if (isSelected) {
                    setSelectedCategories((prev: any) =>
                      prev.filter((t: any) => t._id !== category._id)
                    );
                  } else {
                    setSelectedCategories((prev: any) => [...prev, category]);
                  }
                }}
              >
                {category.title}
              </Badge>
            );
          })
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
};
