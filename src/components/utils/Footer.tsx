import { FaGithub } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import { TbBrandLinkedin } from "react-icons/tb";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary py-3 text-light">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">Get connected with us on social networks:</p>
          <ul className="mb-0 social-links d-flex list-unstyled gap-1 flex-wrap">
            <a
              className="text-light ms-2"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/abdelrahman-sameeh-384508231/"
            >
              <TbBrandLinkedin className="fs-4" />
            </a>
            <a
              className="text-light ms-2"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/abdelrahman-sameeh"
            >
              <FaGithub className="fs-4" />
            </a>
            <a
              className="text-light ms-2"
              target="_blank"
              rel="noopener noreferrer"
              href="https://wa.me/+201556577857"
            >
              <FaWhatsapp className="fs-4" />
            </a>
          </ul>
        </div>
        <Link
          style={{ width: "fit-content" }}
          to={"/support"}
          className="my-1 d-block text-light"
        >
          If you have any question or issue:
          <strong className="mx-1">Contact Us</strong>
        </Link>
        <div className="d-flex justify-content-between align-items-center">
          <div className="copy">© 2025 All rights reserved</div>
          <p className="mb-0">
            Created by
            <strong>
              <a
                className="text-light ms-1"
                href="https://www.linkedin.com/in/abdelrahman-sameeh-384508231/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abdelrahman Sameeh
              </a>
            </strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
