import React, {useState} from 'react'
import Autocomplete from './components/Autocomplete';
import Error from './components/Error';
import { isEmpty } from './utils/utils';
const API_URL = 'http://localhost:3001/shipping-code/';
const INPUT_LENGTH_MIN = 2;

function App() {

  const [records, setRecords] = useState([]); // array of records that match
  const [found, setFound] = useState({}); // the record that matches exactly
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const inputFilter = (dirtyText) => {
    // allow only numbers and hyphens
    return dirtyText.replace(/[^0-9-]/g, '');
  }

  const fetchRecords = (labelId) => {
    setLoading(true);
    const options = { mode: 'cors'};
    fetch(API_URL + labelId, options)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        clearError();
        setRecords(data.data);
      }).catch((error) => {
        setLoading(false);
        setError(error);
      })
  };

  const onSubmit = (searchText) => {
    const record = records.find((item) => item.label_id === searchText);
    setFound(record ? record : {});
    setShowSearchResult(true);
  }

  const onChange = () => {
    setFound({});
    setShowSearchResult(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <Error message={error.message} clearError={clearError}/>}
      <h3>Track your shipment</h3>
      <Autocomplete
        getSuggestions={fetchRecords}
        suggestions={records.map((item) => item?.label_id)}
        placeholder="Enter label id"
        onSubmit={onSubmit}
        loading={loading}
        inputFilter={inputFilter}
        onChange={onChange}
        inputLengthMin={INPUT_LENGTH_MIN}
      />

      {showSearchResult &&
        <div className="search-result">
          {isEmpty(found)
            ? (<div>No record found</div>)
            : (<>
                <div>Id: {found.id}</div>
                <div>Label Id: {found.label_id}</div>
                <div>Shipping code: {found.shipping_tracking_code}</div>
            </>)
          }
       </div>
      }
    </div>
  );
}

export default App;

