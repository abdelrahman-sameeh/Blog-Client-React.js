import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { CiPlay1 } from "react-icons/ci";
import { useRecoilState, useSetRecoilState } from "recoil";
import { categoriesAtom } from "../../../../recoil/categories-atoms";
import authAxios from "../../../../api/auth-axios";
import { ApiEndpoints } from "../../../../api/api-endpoints";
import { FaPlus } from "react-icons/fa";
import { AddBlockModal } from "../../../../components/dashboard/owner/articles/AddBlockModal";
import { articleBlocksAtom } from "../../../../recoil/articles/article-blocks-atom";
import { IoCreateOutline } from "react-icons/io5";
import notify from "../../../../components/utils/Notify";
import type { IArticleBlock } from "../../../../utils/interfaces/article-block-interface";
import { tagsAtom } from "../../../../recoil/tags-atom";
import Select from "react-select";
import { AddTagModal } from "../../../../components/dashboard/owner/articles/AddTagModal";
import { PreviewModal } from "../../../../components/dashboard/owner/articles/PreviewModal";
import { articleAtom } from "../../../../recoil/articles/article-atom";
import { useLoggedInUser } from "../../../../hooks/useGetLoggedInUser";
import { useModal } from "../../../../hooks/useModal";
import type { ITag } from "../../../../utils/interfaces/tag-interface";

const validation = (
  title: string,
  category: string,
  articleBlocks: IArticleBlock[],
  setErrors: (errors: Map<any, string>) => void
) => {
  const existErrors = new Map();
  if (!title) {
    notify("Title is required", "warning");
    existErrors.set("title", "Title is required");
  }
  if (!category) {
    notify("Category is required", "warning");
    existErrors.set("category", "Category is required");
  }
  if (!articleBlocks.length) {
    notify("Must have at least one block", "warning");
    existErrors.set("blocks", "Must have at least one block");
  }

  if (!title || !category || !articleBlocks.length) {
    setErrors(existErrors);
    return false;
  }
  
  return true
};

export const CreateArticlePage = () => {
  const [categories, setCategories] = useRecoilState(categoriesAtom);
  const [tags, setTags] = useRecoilState(tagsAtom);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [errors, setErrors] = useState<
    Map<"title" | "blocks" | "category", string>
  >(new Map());
  const [articleBlocks, setArticleBlocks] = useRecoilState(articleBlocksAtom);
  const setArticle = useSetRecoilState(articleAtom);
  const { user } = useLoggedInUser();

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...articleBlocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // نتأكد إن المؤشر في حدود المصفوفة
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    // swap بين الاتنين
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];

    setArticleBlocks(newBlocks);
  };
  

  const handleDeleteBlock = (index: number) => {
    const newBlocks = [...articleBlocks];
    newBlocks.splice(index, 1);
    setArticleBlocks(newBlocks);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesRes, tagsRes] = await Promise.all([
        authAxios(false, ApiEndpoints.getCategories),
        authAxios(false, ApiEndpoints.listCreateTag),
      ]);

      setCategories(categoriesRes.data.data);

      const newTags = tagsRes.data.map((tag: ITag) => ({
        label: tag.title,
        value: tag._id,
      }));

      setTags(newTags);
    };

    fetchData();
  }, []);

  const blockModal = useModal();
  const tagModal = useModal();
  const previewModal = useModal();

  const handleChangeSelectedTags = (tags: any) => {
    setSelectedTags(tags);
  };

  const handleSaveArticle = async () => {
    if (!validation(title, category, articleBlocks, setErrors)) return false;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);

    articleBlocks.forEach((article: IArticleBlock, index) => {
      formData.append(`blocks[${index}].type`, article?.type as string);
      formData.append(`blocks[${index}].data`, article?.data as string);
      formData.append(`blocks[${index}].order`, `${index + 1}`);
    });

    selectedTags.forEach((tag) => {
      formData.append(`tags[]`, tag.label);
    });
    const response = await authAxios(
      true,
      ApiEndpoints.listCreateArticle(),
      "POST",
      formData,
      "multipart/form-data"
    );

    if (response.status == 201) {
      notify("Article Created Successfully.");
    } else {
      notify("Something went wrong, try again.", "error");
    }
  };

  const handlePreview = () => {
    previewModal.open();

    const articleData = {
      title,
      category: {
        _id: category,
        title: categories.find((cat) => cat._id == category)?.title,
      },
      tags: selectedTags.map((tag) => ({ title: tag.label, _id: tag.label })),
      blocks: articleBlocks,
      user,
      likes: [],
      comments: []
    };

    setArticle(articleData);
  };

  return (
    <>
      <div className="d-flex align-items-start justify-content-between">
        <h3 className="text-capitalize mb-3">create new article</h3>
        <div className="d-flex gap-1">
          <Button onClick={handlePreview} variant={"outline-dark"}>
            <CiPlay1 className="fs-5 mb-1" />
            Preview
          </Button>
          <Button onClick={handleSaveArticle} variant={"outline-success"}>
            <IoCreateOutline className="fs-5 mb-1" />
            Save
          </Button>
        </div>
      </div>
      <form className="m-0 w-100 p-3 rounded border border-secondary">
        <Row className="mx-0 mb-3">
          <Col xs={12} sm={12} md={6}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Article Title </Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  errors.has("title") && errors.delete("title");
                }}
                className="shadow-none focus-border-secondary"
                type="text"
                placeholder="Article Title"
                isInvalid={errors.has("title")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.get("title")}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Form.Label>Category </Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                errors.has("category") && errors.delete("category");
              }}
              className="shadow-none focus-border-secondary"
              isInvalid={errors.has("category")}
            >
              <option>Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.get("category")}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <div className="px-3 d-flex gap-2 flex-wrap">
          <Select
            onChange={handleChangeSelectedTags}
            closeMenuOnSelect={false}
            isMulti
            name="colors"
            options={tags || []}
            className="basic-multi-select flex-1 rounded"
            classNamePrefix="select"
          />
          <Button
            onClick={tagModal.open}
            type={"button"}
            className="text-capitalize border"
            variant="outline-dark"
          >
            Add new tag
            <FaPlus />
          </Button>
        </div>

        <div className="px-3 my-3 d-flex gap-1 align-items-center">
          <Button
            type={"button"}
            onClick={() => {
              blockModal.open();
              errors.has("blocks") && errors.delete("blocks");
            }}
            className={`text-capitalize border ${
              errors.get("blocks") ? "border-danger" : ""
            }`}
            variant="outline-dark"
          >
            add new block
            <FaPlus />
          </Button>
          {errors.has("blocks") && (
            <p className="small m-0 text-danger"> {errors.get("blocks")} </p>
          )}
        </div>

        <div className="accordion px-3 mt-2" id="articleBlocksAccordion">
          {articleBlocks.map((block, index) => (
            <div key={index} className="accordion-item shadow-sm shadow-none">
              <h2 className="accordion-header " id={`heading-${index}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="accordion-button shadow-none collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${index}`}
                  >
                    {(block.type?.[0]?.toUpperCase() as any) +
                      block?.type?.slice(1)}
                  </button>

                  {/* أزرار التحكم */}
                  <div className="btn-group me-2">
                    <button
                      title={"Up"}
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => moveBlock(index, "up")}
                    >
                      ↑
                    </button>
                    <button
                      title={"Down"}
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => moveBlock(index, "down")}
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger me-3"
                    onClick={() => handleDeleteBlock(index)}
                  >
                    x
                  </button>
                </div>
              </h2>

              <div
                id={`collapse-${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#articleBlocksAccordion"
              >
                <div className="accordion-body">
                  {block.type == "code" || block.type == "text" ? (
                    <p className="mb-0">{block.data}</p>
                  ) : block.type == "image" ? (
                    <img
                      width={250}
                      src={URL.createObjectURL(block.data)}
                      alt=""
                    />
                  ) : (
                    <video
                      controls
                      width={250}
                      src={URL.createObjectURL(block.data)}
                    ></video>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
      <AddBlockModal show={blockModal.isOpen} handleClose={blockModal.close} />
      <AddTagModal show={tagModal.isOpen} handleClose={tagModal.close} />
      <PreviewModal
        isOpen={previewModal.isOpen}
        handleClose={previewModal.close}
      />
    </>
  );
};
