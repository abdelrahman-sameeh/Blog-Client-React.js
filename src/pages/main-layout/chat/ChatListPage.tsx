import { useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

const radios = [
  { name: "chats", value: "chats" },
  { name: "requests", value: "requests" },
];

export const ChatListPage = () => {
  const [radioValue, setRadioValue] = useState("chats");




  return (
    <main className="main-content">
      <div className="custom-container">
        <ButtonGroup style={{ marginBottom: "-20px" }}>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-dark"
              className={`border-0 rounded-0 bg-transparent fw-bold ms-2 text-capitalize ${
                radioValue === radio.value
                  ? "text-dark border-bottom border-dark"
                  : "text-secondary"
              }`}
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <hr style={{ border: "1px solid #cfcfcf" }} />
      </div>


      


    </main>
  );
};
