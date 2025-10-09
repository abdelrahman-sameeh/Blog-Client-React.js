import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (
  msg: string,
  type: "warning" | "success" | "error" | "info" = 'success',
  duration: number = 3000
) => {
  if (type === "info") toast.info(msg, { autoClose: duration });
  else if (type === "warning") toast.warn(msg, { autoClose: duration });
  else if (type === "success") toast.success(msg, { autoClose: duration });
  else if (type === "error") toast.error(msg, { autoClose: duration });
};

export default notify;
