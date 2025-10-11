import { useState } from "react";
import { Badge, Form } from "react-bootstrap";
import type { ITag } from "../../../utils/interfaces/tag-interface";
import { useRecoilValue } from "recoil";
import { tagsAtom } from "../../../recoil/tags-atom";

export const TagsFilterComponent = ({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: ITag[];
  setSelectedTags: any;
}) => {
  const tags = useRecoilValue(tagsAtom);
  const [tagFilter, setTagFilter] = useState("");

  const filteredTags = tags.filter((tag) =>
    tag?.title?.toLowerCase().includes(tagFilter.toLowerCase())
  );

  return (
    <div style={{ maxHeight: "300px", overflow: "auto" }}>
      <Form.Control
        type="text"
        placeholder="Filter tags..."
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
        className="mb-3 shadow-sm"
        style={{
          maxWidth: "300px",
          borderRadius: "20px",
          fontSize: "14px",
        }}
      />

      {/* 💡 عرض التاجز */}
      <div className="d-flex flex-wrap gap-2">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => {
            const isSelected = selectedTags.some((t) => t._id === tag._id);
            return (
              <Badge
                key={tag._id}
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
                    setSelectedTags((prev: any) =>
                      prev.filter((t: any) => t._id !== tag._id)
                    );
                  } else {
                    setSelectedTags((prev: any) => [...prev, tag]);
                  }
                }}
              >
                #{tag.title}
              </Badge>
            );
          })
        ) : (
          <p className="text-muted">No tags found</p>
        )}
      </div>
    </div>
  );
};
