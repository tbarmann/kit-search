import React, {useState} from 'react'

function Autocomplete({
  suggestions,
  getSuggestions,
  placeholder,
  onSubmit,
  inputFilter,
  onChange,
  inputLengthMin = 2
  }) {

    const [textInput, setTextInput] = useState(''); // search text
    const [showSuggestions, setShowSuggestions] = useState(false); // show/hide suggestions

    const handleOnChange = (event) => {
      const input = event.target.value;
      // if we were passed an inputFilter function, use it
      const filteredInput = inputFilter ? inputFilter(input) : input;
      setTextInput(filteredInput);
      // get suggestions only if user enters a minimum number of characters
      if (filteredInput.length >= inputLengthMin) {
        getSuggestions(filteredInput);
        setShowSuggestions(true);
      }
      else {
        setShowSuggestions(false);
      }
      onChange(); // parent component can do something when input changes
    };

  const handleOnSubmit = (event) => {
    // keep page from reloading if user hits enter
    event.preventDefault();
    setShowSuggestions(false);
    onSubmit(textInput);  // parent handles submit
  };

  const onClick = (event) => {
    // load input field with clicked suggestion
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

Autocomplete.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string),
  getSuggestions: PropTypes.func,
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  inputFilter: PropTypes.func,
  onChange: PropTypes.func,
  inputLengthMin: PropTypes.number
};

export default Autocomplete