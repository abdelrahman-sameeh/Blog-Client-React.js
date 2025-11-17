import { useRecoilState } from "recoil";
import { categoriesAtom } from "../../../../recoil/categories-atoms";
import { useEffect, useState } from "react";
import authAxios from "../../../../api/auth-axios";
import { ApiEndpoints } from "../../../../api/api-endpoints";
import { useLoggedInUser } from "../../../../hooks/useGetLoggedInUser";
import { Badge, Form } from "react-bootstrap";
import { LoadingButton } from "../../../../components/utils/LoadingButton";
import notify from "../../../../components/utils/Notify";

export const PreferencesPage = () => {
  const { user, setUser } = useLoggedInUser(true);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [categories, setCategories] = useRecoilState(categoriesAtom);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loadings, setLoadings] = useState<any>({});

  const filteredCategories = categories.filter((category) =>
    category?.title?.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  useEffect(() => {
    authAxios(false, ApiEndpoints.getCategories).then((response) => {
      setCategories(response?.data?.data);
    });
  }, []);

  useEffect(() => {
    if (user?._id) {
      setSelectedCategories(user.preferences || []);
    }
  }, [user]);

  const handleSave = async () => {
    if (!selectedCategories.length) {
      notify("must have at least one category selected", "warning");
      return;
    }
    const data = {
      categories: selectedCategories,
    };
    setLoadings((prev: any) => ({ ...prev, save: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.preferences,
      "PATCH",
      data
    );

    setLoadings((prev: any) => {
      const updated = { ...prev };
      delete updated.save;
      return updated;
    });

    if (response.status === 200) {
      notify("Your preferences have been saved successfully.", "success");
      sessionStorage.setItem("user", JSON.stringify(response?.data?.data?.user))
    } else {
      notify("Something went wrong. Please try again later.", "error");
    }
  };

  const handlePickRandomly = async () => {
    const data = { random: true };

    setLoadings((prev: any) => ({ ...prev, random: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.preferences,
      "PATCH",
      data
    );

    setLoadings((prev: any) => {
      const updated = { ...prev };
      delete updated.random;
      return updated;
    });

    if (response.status === 200) {
      notify("Your preferences have been saved successfully.", "success");
      setSelectedCategories(response?.data?.data?.preferences);
      setUser(response?.data?.data);
      sessionStorage.setItem("user", JSON.stringify(response?.data?.data))
    } else {
      notify("Something went wrong. Please try again later.", "error");
    }
  };

  return (
    <div>
        <h3 className="text-capitalize mb-3">Your preferences</h3>

      <div className="d-flex gap-2 justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Filter categories..."
          value={categoryFilter}
          className="shadow-none"
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
        <div className="btn-group">
          <LoadingButton
            loading={loadings["save"]}
            onClick={handleSave}
            variant="outline-dark"
          >
            Save
          </LoadingButton>
          {!user.preferences?.length ? (
            <LoadingButton
              onClick={handlePickRandomly}
              loading={loadings["random"]}
              variant="outline-primary"
              style={{ width: "320px" }}
            >
              Skip and pick random categories
            </LoadingButton>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        style={{ maxHeight: "560px", overflow: "auto" }}
        className="d-flex gap-2 flex-wrap border p-4 rounded"
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => {
            const isSelected = selectedCategories.includes(cat._id as string);
            return (
              <Badge
                onClick={() => {
                  if (isSelected) {
                    setSelectedCategories((prev: any) =>
                      prev.filter((c: string) => c != cat._id)
                    );
                  } else {
                    setSelectedCategories((prev: any) => [...prev, cat._id]);
                  }
                }}
                key={cat._id}
                bg={"light"}
                text={"dark"}
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
              >
                {cat.title}
              </Badge>
            );
          })
        ) : (
          <p className="flex-1 text-center mb-0">No categories found.</p>
        )}
      </div>
    </div>
  );
};
