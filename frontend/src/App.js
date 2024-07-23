

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [editedStep, setEditedStep] = useState([]);
  const [showGlobalDropdown, setShowGlobalDropdown] = useState(false);
  const [globalDropdownPosition, setGlobalDropdownPosition] = useState({ x: 0, y: 0 });
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const dropdownRef = useRef(null);
  const globalDropdownRef = useRef(null);

  const steps = ['Click on text', 'Click on Text after Text', 'Click on Text for Text'];
  const globalVariables = [''];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (globalDropdownRef.current && !globalDropdownRef.current.contains(event.target)) {
        setShowGlobalDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  function selectStep(step) {
    setSelectedStep(step);
    setEditedStep(step.split(' ').map(word => ({ word, edited: false })));
    setShowDropdown(false);
  }

  function handleWordDoubleClick(index, event) {
    setSelectedWordIndex(index);
    setGlobalDropdownPosition({ x: event.clientX, y: event.clientY });
    setShowGlobalDropdown(true);
  }

  function selectGlobalVariable(variable) {
    const newEditedStep = [...editedStep];
    newEditedStep[selectedWordIndex] = { word: variable, edited: true };
    setEditedStep(newEditedStep);
    setShowGlobalDropdown(false);
  }

  function handleCustomInput() {
    const newWord = prompt("Enter new word:");
    if (newWord) {
      selectGlobalVariable(newWord);
    }
  }

  return (
    <div className="App">
      <div id='step' onClick={toggleDropdown}>Step</div>
      {showDropdown && (
        <div ref={dropdownRef} className="dropdown">
          {steps.map((step, i) => (
            <div key={i} className="dropdown-item" onClick={() => selectStep(step)}>
              {step}
            </div>
          ))}
        </div>
      )}
      {selectedStep && (
        <div className="step-editor">
          <h3>Step Editor</h3>
          <div className="editable-step">
            {editedStep.map((item, index) => (
              <span 
                key={index} 
                className={item.edited ? 'edited-word' : `word-${index % 3}`}
                onDoubleClick={(e) => handleWordDoubleClick(index, e)}
              >
                {item.word}{' '}
              </span>
            ))}
          </div>
        </div>
      )}
      {showGlobalDropdown && (
        <div 
          ref={globalDropdownRef} 
          className="global-dropdown"
          style={{ position: 'absolute', left: globalDropdownPosition.x, top: globalDropdownPosition.y }}
        >
          {globalVariables.map((variable, i) => (
            <div key={i} className="dropdown-item" onClick={() => selectGlobalVariable(variable)}>
              {variable}
            </div>
          ))}
          <div className="dropdown-item" onClick={handleCustomInput}>
            Custom Input
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
