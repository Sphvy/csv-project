import React, { useState } from 'react';
import Papa from 'papaparse';

const CsvToJsonConverter = () => {
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvText = reader.result;
        setCsvData(csvText);
      };
      reader.readAsText(file);
    }
  };

  const convertToJSON = () => {

    const csvDataWithAdditionalColumns = `ID\tNAME\t0_1\t0_2\t0_3\t0_4\t0_5\tempty\tX\tBRAND\tY\n${csvData}`;
  
    Papa.parse(csvDataWithAdditionalColumns, {
      delimiter: '\t', 
      header: true,
      skipEmptyLines: true, 
      trimHeaders: true,
      complete: (result) => {
        const jsonDataWithoutExtras = result.data.map((row) => {
          delete row.__parsed_extra;
          for (let num = 0; num < 6; num++) {
            const columnName = `0_${num}`;
            delete row[columnName];
          }
          return row;
        });
  
        setJsonData(jsonDataWithoutExtras);
      },
    });
  };

  const handleSearch = () => {
    if (!jsonData) {
      return;
    }

    const filteredData = jsonData.filter((row) =>
      row.NAME.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setJsonData(filteredData);
  };


  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={convertToJSON}>Convert to JSON</button>

      <div>
        <label htmlFor="searchInput">Search by Name:</label>
        <input
          type="text"
          id="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {jsonData && (
        <div>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CsvToJsonConverter;