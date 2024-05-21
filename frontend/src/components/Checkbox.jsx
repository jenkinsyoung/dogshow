import React from 'react';
import style from './Checkbox.module.css';

const Checkbox = ({ index, onChange }) => {
  return (
    <label className={style.checkbox_container}>
      <input
        type="checkbox"
        onChange={() => onChange(index)}
      />
      <span className={style.custom_checkbox}></span>
    </label>
  );
};

export default Checkbox;