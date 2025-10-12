import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import authAxios from "../../../../api/auth-axios";
import { ApiEndpoints } from "../../../../api/api-endpoints";
import { useRecoilState, useSetRecoilState } from "recoil";
import { articleAtom } from "../../../../recoil/articles/article-atom";
import { categoriesAtom } from "../../../../recoil/categories-atoms";
import { tagsAtom } from "../../../../recoil/tags-atom";
import { Button, Col, Form, Row } from "react-bootstrap";
import { CiPlay1 } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";
import Select from "react-select";
import { FaPlus } from "react-icons/fa";
import type { ITag } from "../../../../utils/interfaces/tag-interface";
import { useModal } from "../../../../hooks/useModal";
import { AddTagModal } from "../../../../components/dashboard/user/articles/AddTagModal";
import { AddBlockModal } from "../../../../components/dashboard/user/articles/update-article-page/AddBlockModal";
import { PreviewModal } from "../../../../components/dashboard/user/articles/PreviewModal";
import notify from "../../../../components/utils/Notify";
import { LoadingButton } from "../../../../components/utils/LoadingButton";
import { DeleteArticleBlockModal } from "../../../../components/dashboard/user/articles/update-article-page/DeleteArticleBlock";
import { articleBlockAtom } from "../../../../recoil/articles/article-blocks-atom";

export const UpdateArticlePage = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState<
    Map<"title" | "blocks" | "category", string>
  >(new Map());
  const [article, setArticle] = useRecoilState(articleAtom);
  const setArticleBlock = useSetRecoilState(articleBlockAtom);
  const [tags, setTags] = useRecoilState(tagsAtom);
  const [categories, setCategories] = useRecoilState(categoriesAtom);
  const [loadings, setLoadings] = useState<any>({});

  const tagModal = useModal();
  const createBlockModal = useModal();
  const previewModal = useModal();
  const deleteBlockModal = useModal();

  const fetchArticle = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.getDeleteArticle(id as string)
    );
    setArticle(response.data.data);
  };

  const fetchFilters = async () => {
    const response = await authAxios(false, ApiEndpoints.getFilters);
    if (response.status == 200) {
      setTags(
        response.data.tags.map((tag: ITag) => ({
          ...tag,
          label: tag.title,
          value: tag._id,
        }))
      );
      setCategories(response.data.categories);
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchFilters();
  }, []);

  const moveBlock = (index: number, direction: "up" | "down") => {
    let newBlocks = [...(article.blocks || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];
    setArticle((prev) => ({ ...prev, blocks: newBlocks }));
  };

  const handleUpdateArticle = async (e: FormEvent) => {
    e.preventDefault();
    // Validation
    const newErrors = new Map();
    if (!article.title) {
      newErrors.set("title", "Title is required");
    }

    if (!article.blocks?.length) {
      newErrors.set("title", "Title is required");
    }

    if (newErrors.size) {
      setErrors(newErrors);
      return;
    }

    // Send request
    const data: any = {};
    data["title"] = article.title;
    data["category"] = article.category?._id;
    data["blocks"] = article.blocks?.map((b, index) => ({
      _id: b._id,
      order: index,
    }));
    data["tags"] = article.tags?.map((t) => t.title);

    setLoadings((prev: any) => ({ ...prev, update: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.updateArticle(id as string),
      "PATCH",
      data
    );

    setLoadings((prev: any) => {
      const newState = { ...prev };
      delete newState["update"];
      return newState;
    });

    if (response.status == 200) {
      notify("updated successfully");
    }
  };

  return (
    <Form onSubmit={handleUpdateArticle}>
      <div className="d-flex align-items-start justify-content-between">
        <h3 className="text-capitalize mb-3">Update article</h3>
        <div className="d-flex gap-1">
          <Button
            type="button"
            onClick={previewModal.open}
            variant={"outline-dark"}
          >
            <CiPlay1 className="fs-5 mb-1" />
            Preview
          </Button>
          <LoadingButton
            type="submit"
            loading={loadings["update"]}
            variant={"outline-success"}
          >
            <IoCreateOutline className="fs-5 mb-1" />
            Update
          </LoadingButton>
        </div>
      </div>
      <div className="m-0 w-100 p-3 rounded border border-secondary">
        <Row className="mx-0 mb-3">
          <Col xs={12} sm={12} md={6}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Article Title </Form.Label>
              <Form.Control
                value={article.title || ""}
                onChange={(e) => {
                  setArticle((prev) => ({ ...prev, title: e.target.value }));
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
              value={article.category?._id || ""}
              onChange={(e) => {
                setArticle((prev) => ({
                  ...prev,
                  category: { ...prev.category, _id: e.target.value },
                }));
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
            onChange={(tags) =>
              setArticle((prev) => ({
                ...prev,
                tags: tags.map((t: any) => ({ _id: t.value, title: t.label })),
              }))
            }
            closeMenuOnSelect={false}
            isMulti
            name="colors"
            options={
              tags?.map((t) => ({
                value: t._id,
                label: t.title,
              })) || []
            }
            value={
              article.tags?.map((t) => ({ value: t._id, label: t.title })) || []
            }
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
              createBlockModal.open();
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
          {article.blocks?.map((block, index) => (
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
                      type="button"
                      title={"Down"}
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => moveBlock(index, "down")}
                    >
                      ↓
                    </button>
                  </div>
                  <div className="btn-group me-2">
                    {/* <button
                      type="button"
                      className="btn btn-sm btn-outline-dark d-flex justify-content-center align-items-center"
                      title={"Update"}
                    >
                      <IoCreateOutline />
                    </button> */}
                    <button
                      type="button"
                      title={"Delete"}
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setArticleBlock(block);
                        deleteBlockModal.open();
                      }}
                    >
                      x
                    </button>
                  </div>
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
                    <img width={250} src={block.data} alt="" />
                  ) : (
                    <video controls width={250} src={block.data}></video>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddTagModal show={tagModal.isOpen} handleClose={tagModal.close} />
      <AddBlockModal
        context={"update-page"}
        show={createBlockModal.isOpen}
        handleClose={createBlockModal.close}
      />
      <DeleteArticleBlockModal
        isOpen={deleteBlockModal.isOpen}
        handleClose={deleteBlockModal.close}
      />
      <PreviewModal
        isOpen={previewModal.isOpen}
        handleClose={previewModal.close}
      />
    </Form>
  );
};
