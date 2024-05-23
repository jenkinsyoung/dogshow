import React from 'react';
import Select, { components } from 'react-select';
import './MultiSelectCheckbox.css'

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '350px',
    height: 'minmax(40px, max-content)',
    border: 'none',
    borderBottom: '2px solid rgb(255, 181, 167)',
    borderRadius: '3px',
    background: 'rgb(248, 237, 235)',
    boxShadow: 'none',
    color: 'rgb(98, 90, 87)',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '400',
    '&:hover': {
      border: '2px solid rgb(255, 181, 167)',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    backgroundColor: state.isSelected ? 'rgb(248, 237, 235)' : state.isFocused ? '#FFB5A7' : 'rgb(248, 237, 235)',
    color: 'rgb(98, 90, 87)',
    '&:hover': {
      backgroundColor: '#FFB5A7',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: 'rgb(98, 90, 87)',
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: 0,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#FFB5A7',
    color: 'rgb(98, 90, 87)',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'rgb(98, 90, 87)',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'rgb(98, 90, 87)',
    '&:hover': {
      backgroundColor: '#FFB5A7',
      color: 'rgb(98, 90, 87)',
    },
  }),
};

const Option = (props) => {
  return (
    <components.Option {...props}>
      <input
      style={{width: '18px', height: '18px', paddingRight: '6px', marginTop: '28px'}}
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
      />{" "}
      <label>{props.label}</label>
    </components.Option>
  );
};

const MultiSelectCheckbox = ({ options, onChange, placeholder, noOption }) => {
  return (
    <Select
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isMulti
      onChange={onChange}
      options={options}
      styles={customStyles}
      components={{ Option }}
      placeholder={placeholder}
      noOptionsMessage={()=> `${noOption}`}
    />
  );
};

export default MultiSelectCheckbox;
