import { TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import React, { Component, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { GrFormClose } from 'react-icons/gr'

import './settings.css'

const TagInput = ({ tags, handleDelete, handleAddition }) => {
  const [tagData, setTagData] = useState(tags);
  const removeTagData = indexToRemove => {
    setTagData([...tagData.filter((_, index) => index !== indexToRemove)]);
    handleDelete(indexToRemove)
  };
  const addTagData = event => {
    if (event.target.value !== '') {
      setTagData([...tagData, event.target.value]);
      handleAddition(event.target.value)
      event.target.value = '';
      handleAddition(event.target.value)
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