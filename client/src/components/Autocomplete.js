import React from 'react'

function Autocomplete({
  suggestions,
  placeholder,
  textInput,
  handleOnChange,
  handleOnClick,
  onSubmit,
  loading
  }) {

  return (
    <form className="search-form" onSubmit={onSubmit}>
      <input
        type="text"
        value={textInput}
        onChange={handleOnChange}
        placeholder={placeholder}
      />
      {!!loading && <div className="loader"></div>}
      {!!suggestions.length && <ul className="suggestions">
        {suggestions.map((suggestion) => (
          <li
            onClick = {handleOnClick}
            key={suggestion}>{suggestion}</li>
        ))}
      </ul>}

    </form>
  )
}

export default Autocomplete