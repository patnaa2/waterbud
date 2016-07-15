import React, {PropTypes} from 'react';
import ReactModal from 'react-modal';
import './style.less';

const Modal = (props) => {

  const {
    children,
    isOpen,
    handleModalCloseRequest,
    handleSaveClicked,
    title
  } = props;

  return (
    <ReactModal
      className="Modal__Bootstrap modal-dialog"
      closeTimeoutMS={150}
      isOpen={isOpen}
      onRequestClose={handleModalCloseRequest}
    >
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" onClick={handleModalCloseRequest}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
          <h4 className="modal-title">{title}</h4>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={handleModalCloseRequest}>Close</button>
          <button type="button" className="btn btn-primary" onClick={handleSaveClicked}>Save changes</button>
        </div>
      </div>
    </ReactModal>
  );
};

Modal.propTypes = {
  children: PropTypes.element,
  isOpen: PropTypes.bool,
  handleModalCloseRequest: PropTypes.func,
  handleSaveClicked: PropTypes.func,
  title: PropTypes.string
};

export default Modal;
