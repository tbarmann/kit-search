import React, {useState} from 'react'

function Autocomplete({
  suggestions,
  getSuggestions,
  placeholder,
  onSubmit,
  inputFilter,
  loading,
  onChange,
  inputLengthMin = 2
  }) {

    const [textInput, setTextInput] = useState(''); // search text
    const [showSuggestions, setShowSuggestions] = useState(false); // show/hide suggestions

    const handleOnChange = (event) => {
      const input = event.target.value;
      const filteredInput = inputFilter ? inputFilter(input) : input;
      setTextInput(filteredInput);
      // get suggestions only if user enters 2 or more characters
      if (filteredInput.length >= inputLengthMin) {
        getSuggestions(filteredInput);
        setShowSuggestions(true);
      }
      else {
        setShowSuggestions(false);
      }
      onChange();
    };

  const handleOnSubmit = (event) => {
    // keep page from reloading if user hits enter
    event.preventDefault();
    setShowSuggestions(false);
    onSubmit(textInput);
  };

  const onClick = (event) => {
    const text = event.target.innerText;
    setTextInput(text);
    setShowSuggestions(false);
  };

  const clearForm = () => {
    setTextInput('');
    setShowSuggestions(false);
    onChange();
  };

  return (
    <form className="search-form" onSubmit={handleOnSubmit}>
      <input
        name="searchField"
        type="text"
        value={textInput}
        onChange={handleOnChange}
        placeholder={placeholder}
      />
      <input type="submit" value="Search" className="submit-button"/>
      <input type="reset" value="Clear" onClick={clearForm} className="clear-button"/>

      {/* {!!loading && <div className="loader"></div>} */}
      {showSuggestions && !!suggestions.length && <ul className="suggestions">
        {suggestions.map((suggestion) => (
          <li
            onClick = {onClick}
            key={suggestion}>{suggestion}</li>
        ))}
      </ul>}
      {textInput.length < inputLengthMin && <div className="no-matches">
          <div>Enter at least {inputLengthMin} digits to see matches</div>
        </div>
      }

    </form>
  )
}

export default Autocomplete