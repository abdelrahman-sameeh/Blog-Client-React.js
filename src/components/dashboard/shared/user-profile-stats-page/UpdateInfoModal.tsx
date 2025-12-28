import { Button, Modal, Form } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { userProfileStatsAtom } from "../../../../recoil/user-profile-stats.atom";
import { LoadingButton } from "../../../utils/LoadingButton";
import authAxios from "../../../../api/auth-axios";
import { ApiEndpoints } from "../../../../api/api-endpoints";
import { useState } from "react";

export const UpdateInfoModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  const [userProfileStats, setUserProfileStats] =
    useRecoilState(userProfileStatsAtom);

  const [loadings, setLoadings] = useState<Map<string, boolean>>(new Map());

  const handleUpdate = async () => {
    const data = {
      firstName: userProfileStats?.user?.firstName,
      lastName: userProfileStats?.user?.lastName,
      bio: userProfileStats?.user?.bio,
    };

    setLoadings((prev) => {
      const newMap = new Map(prev);
      newMap.set("update", true);
      return newMap;
    });

    await authAxios(
      true,
      ApiEndpoints.updateProfileInfo,
      "PATCH",
      data
    );

    setLoadings((prev) => {
      const newMap = new Map(prev);
      newMap.delete("update");
      return newMap;
    });

  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* First Name */}
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              maxLength={25}
              minLength={2}
              type="text"
              className="shadow-none"
              placeholder="Enter first name"
              value={userProfileStats.user?.firstName || ""}
              onChange={(e) =>
                setUserProfileStats((prev) => ({
                  ...prev,
                  user: { ...prev.user, firstName: e.target.value },
                }))
              }
            />
          </Form.Group>

          {/* Last Name */}
          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              maxLength={25}
              type="text"
              className="shadow-none"
              placeholder="Enter last name"
              value={userProfileStats.user?.lastName || ""}
              onChange={(e) =>
                setUserProfileStats((prev) => ({
                  ...prev,
                  user: { ...prev.user, lastName: e.target.value },
                }))
              }
            />
          </Form.Group>

          {/* Bio */}
          <Form.Group className="mb-3" controlId="bio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              maxLength={200}
              as="textarea"
              className="shadow-none"
              rows={4}
              placeholder="Write something about yourself..."
              value={userProfileStats.user?.bio || ""}
              onChange={(e) =>
                setUserProfileStats((prev) => ({
                  ...prev,
                  user: { ...prev.user, bio: e.target.value },
                }))
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClose}>
          Close
        </Button>
        <LoadingButton
          loading={loadings.has("update")}
          variant="outline-dark"
          onClick={handleUpdate}
        >
          Update
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
