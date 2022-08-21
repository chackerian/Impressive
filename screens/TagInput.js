import { TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import React, { Component, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { GrFormClose } from 'react-icons/gr'

import './settings.css'

const TagInput = ({ tags, handleDelete, handleAddition }) => {
  const [tagData, setTagData] = useState(tags);

  useEffect(() => {
    setTagData(tags)
  }, [tags])

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const removeTagData = indexToRemove => {
    setTagData([...tagData.filter((_, index) => index !== indexToRemove)]);
    handleDelete(indexToRemove)
  };
  const addTagData = event => {
    if (event.target.value !== '') {
      var value = capitalizeFirstLetter(event.target.value)
      setTagData([...tagData, value]);
      handleAddition(value)
      event.target.value = '';
    }
  };
  return (
    <div className="tag-input">
      <ul className="tags">
        {tagData.map((tag, index) => (
          <li key={index} className="tag">
            <span className="tag-title">{tag}</span>
            <span
              className="tag-close-icon"
              onClick={() => removeTagData(index)}
            >
              <GrFormClose />
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyUp={event => (event.key === 'Enter' ? addTagData(event) : null)}
        placeholder="Press enter to add a tag"
      />
    </div>
  );
};

export default TagInput