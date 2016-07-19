import React, {PropTypes} from 'react';
import {retrieveTipImage} from '../../helpers/tipHelpers';
import Modal from '../Modal';

import lightbulb from '../../assets/new.png';

const TipModal = (props) => {
  const {
    isOpen,
    handleNextClicked,
    handleModalCloseRequest,
    handlePrevClicked,
    handleSaveClicked,
    showPrev,
    showNext,
    title,
    tip
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      handleModalCloseRequest={handleModalCloseRequest}
      handleSaveClicked={handleSaveClicked}
      showFooter={false}
      title={title}
      footer={<div className="modal-footer">
        {showPrev && <button type="button" className="btn btn-default" onClick={handlePrevClicked}>Previous</button>}
        {showNext && <button type="button" className="btn btn-default" onClick={handleNextClicked}>Next</button>}
      </div>}
    >
      <div className="container-fluid">
        <div className="col-md-4">
          <img className="tip_image" src={retrieveTipImage(tip.get('image'))} />
        </div>
        <div className="col-md-8">
          <div className="row tip_title">
            <span>{tip.get('short')}</span>
            {!tip.get('read') && <img className="tip_lightbulb" src={lightbulb} />}
          </div>
          <div className="row tip_description">
            <span>{tip.get('msg')}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TipModal;
