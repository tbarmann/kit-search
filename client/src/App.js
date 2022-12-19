import React, {useState} from 'react'
import Autocomplete from './components/Autocomplete';
import Error from './components/Error';
import { isEmpty } from './utils/utils';
const API_URL = 'http://localhost:3001/shipping-code/';

function App() {

  const [textInput, setTextInput] = useState(''); // search text
  const [matches, setMatches] = useState([]); // array of records that match

  const [target, setTarget] = useState({}); // the record that matches exactly
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOnchange = (event) => {
    // allow only numbers and hyphens
    const cleanedInput = event.target.value.replace(/[^0-9-]/g, '');
    setTextInput(cleanedInput);
    // fetch matches only if user enters 2 or more characters
    if (cleanedInput.length > 1) {
      fetchMatches(cleanedInput);
    } else {
      // user has deleted all input, clear matches and target
      setMatches([]);
      setTarget({});
    }
  };

  const fetchMatches = (labelId) => {
    setLoading(true);
    const options = { mode: 'cors'};
    fetch(API_URL + labelId, options)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        clearError();
        setMatches(data.data);
        // unless we have 1 match, clear the target
        if (data.data.length !== 1) {
          setTarget({});
        }
      }).catch((error) => {
        setLoading(false);
        setError(error);
      })
  };

  const handleOnClick = (event) => {
    const labelId = event.target.innerText;
    setTextInput(labelId);
    const target = matches.find((item) => item.label_id === labelId);
    setTarget(target);
    setMatches([]);
  };

  const onSubmit = (event) => {
    // keep page from reloading if user hits enter
    event.preventDefault();
  }

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <Error message={error.message} clearError={clearError}/>}
      <h3>Track your shipment</h3>
      <Autocomplete
        suggestions={matches.map((item) => item?.label_id)}
        placeholder="Enter label id"
        textInput={textInput}
        handleOnChange={handleOnchange}
        handleOnClick={handleOnClick}
        onSubmit={onSubmit}
        loading={loading}
      />
      {matches.length === 0 && textInput.length < 2 && <div className="no-matches">
          <div>Enter at least two label digits to see matches</div>
        </div>
      }
      {matches.length !== 0 && textInput.length > 2 && <div className="no-matches">
          <div>No matches</div>
        </div>
      }
      {!isEmpty(target) && <div className="target">
          <div>Id: {target.id}</div>
          <div>Label Id: {target.label_id}</div>
          <div>Shipping code: {target.shipping_tracking_code}</div>
        </div>
      }
    </div>
  );
}

export default App;

