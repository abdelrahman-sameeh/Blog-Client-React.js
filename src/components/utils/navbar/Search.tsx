import { Form, InputGroup } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { searchAtom } from "../../../recoil/search-atom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import notify from "../Notify";

export const Search = () => {
  const [search, setSearch] = useRecoilState(searchAtom);
  const navigate = useNavigate();
  const input = useRef(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasNotified = useRef(false);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() == "") {
      notify("Redirect stopped — search cleared.", "info", 2000);
      hasNotified.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (!hasNotified.current) {
      notify("Redirecting to the search page...", "info", 2000);
      hasNotified.current = true;
    }

    // Clear previous timeout (important!)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Wait 3 seconds after user stops typing
    timeoutRef.current = setTimeout(() => {
      (input?.current as any)?.classList.add("hide");
      navigate("/search");
      hasNotified.current = false;
    }, 3000);
  };

  return (
    <InputGroup
      className={`navbar-search ${
        window.location.pathname == "/search" ? "hide" : ""
      }`}
      ref={input}
    >
      <InputGroup.Text>
        <IoSearchOutline />
      </InputGroup.Text>
      <Form.Control
        type="search"
        value={search}
        onChange={handleChange}
        className={`shadow-none search-input`}
        placeholder="Search"
      />
    </InputGroup>
  );
};