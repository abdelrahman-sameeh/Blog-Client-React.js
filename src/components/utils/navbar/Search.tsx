import { Form, InputGroup } from "react-bootstrap";
import style from "./style.module.css"
import { IoSearchOutline } from "react-icons/io5";


export const Search = () => {
  return (
    <InputGroup>
      <InputGroup.Text>
      <IoSearchOutline />
      </InputGroup.Text>
      <Form.Control className={`shadow-none ${style.searchInput}` } placeholder="Search" />
    </InputGroup>
  );
};
