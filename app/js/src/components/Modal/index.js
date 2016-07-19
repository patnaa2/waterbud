import React, {PropTypes} from 'react';
import ReactModal from 'react-modal';
import './style.less';

const Modal = (props) => {

  const {
    children,
    closeText,
    isOpen,
    handleModalCloseRequest,
    handleSaveClicked,
    okText,
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
          <h4 className={props.titleClassName}>{title}</h4>
        </div>
        <div className={props.bodyClassName}>
          {children}
        </div>
        {
          props.showFooter &&
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={handleModalCloseRequest}>{closeText}</button>
            <button type="button" className={props.okClassName} onClick={handleSaveClicked}>{okText}</button>
          </div>
        }
        {props.footer}
      </div>
    </ReactModal>
  );
};

Modal.defaultProps = {
  bodyClassName: 'modal-body',
  closeText: 'Close',
  okClassName: 'btn btn-success',
  okText: 'Save Changes',
  showFooter: true,
  titleClassName: 'modal-title'
};

Modal.propTypes = {
  bodyClassName: PropTypes.string,
  children: PropTypes.element,
  isOpen: PropTypes.bool,
  handleModalCloseRequest: PropTypes.func,
  handleSaveClicked: PropTypes.func,
  okClassName: PropTypes.string,
  okText: PropTypes.string,
  showFooter: PropTypes.bool,
  title: PropTypes.string,
  titleClassName: PropTypes.string
};

export default Modal;
