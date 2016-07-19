import React, {PropTypes} from 'react';
import Modal from '../Modal';

const TipModal = (props) => {
  const {
    isOpen,
    handleNexClicked,
    handleModalCloseRequest,
    handlePrevClicked,
    handleSaveClicked,
    title,
    tips
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      handleModalCloseRequest={handleModalCloseRequest}
      handleSaveClicked={handleSaveClicked}
      showFooter={false}
      title={title}
    >
      <div>hi</div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" onClick={handlePrevClicked}>Previous</button>
        <button type="button" className="btn btn-default" onClick={handleNexClicked}>Next</button>
      </div>
    </Modal>
  );
};

export default TipModal;
