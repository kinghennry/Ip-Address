import React, { useState, useCallback, useRef } from "react";
import { ArrowRight } from "../icons";
import "../css/Form.css";
function Form({ placeholder, onSubmit, invalid }) {
  console.log("render form");
  const ref = useRef();
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (ref.current && ref.current.value) {
      onSubmit(ref.current.value);
    }
  }, []);

  return (
    <form
      className={`form ${invalid ? " form--invalid" : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="form__control"
        ref={ref}
        aria-label={placeholder}
        placeholder={placeholder}
      />
      <button id="search__btn" className="btn btn__dark">
        {ArrowRight}
      </button>
    </form>
  );
}

export default Form;
