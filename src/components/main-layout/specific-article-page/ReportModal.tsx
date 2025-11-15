import { Button, Form, Modal } from "react-bootstrap";
import { LoadingButton } from "../../utils/LoadingButton";
import React, { useEffect, useState } from "react";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IReportReason } from "../../../utils/interfaces/report-interface";
import { useParams } from "react-router-dom";
import notify from "../../utils/Notify";

type ReportModalType = {
  show: boolean;
  handleClose: () => void;
};

export const ReportModal = React.memo(
  ({ show, handleClose }: ReportModalType) => {
    const { id } = useParams();
    const [reportReasons, setReportReasons] = useState<IReportReason[]>([]);

    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchReportReasons = async () => {
        const response = await authAxios(true, ApiEndpoints.getReportReasons);
        setReportReasons(response?.data?.data);
        setReason(response?.data?.data[0]["_id"]);
      };

      fetchReportReasons();
    }, []);

    const handleReport = async () => {
      const data = {
        reason,
        description,
      };

      setLoading(true);

      const response = await authAxios(
        true,
        ApiEndpoints.createReport(id as string),
        "POST",
        data
      );

      setLoading(false);

      if (response.status === 201) {
        notify("Your report has been submitted. Thank you!");
        setDescription("");
        setReason(reportReasons[0]["_id"] as string);
        handleClose();
      } else {
        notify("Unable to submit the report at the moment.", "error");
      }
    };

    return (
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mt-2">
            <Form.Label className="mb-1"> Reason </Form.Label>
            <Form.Select
              className="shadow-none"
              onChange={(e) => setReason(e.target.value)}
            >
              {reportReasons?.map((r) => (
                <option key={r?._id} value={r?._id}>
                  {r?.reason}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label className="mb-1"> Report Description </Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              as="textarea"
              placeholder="Write your report here..."
              className="shadow-none"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton
            loading={loading}
            variant="outline-dark"
            onClick={handleReport}
          >
            Report
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    );
  }
);
