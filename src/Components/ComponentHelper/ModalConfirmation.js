import React from 'react';
import { useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../assests/css/modals.css';

const ModalConfirmation = (obj) => {

  const messages = useSelector(state => state.intl.messages);
  const Reducer = useSelector(state => state[obj.reducer])

  let { isConfirmationOpen, messageToShow, actionBtnModalConfirmation } = Reducer;

  return (
    <Modal
      className="modal-confirmation"
      zIndex="9999!important"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      isOpen={isConfirmationOpen}
    >
      <ModalHeader>{messages.confirmDialogTitle}</ModalHeader>
      <ModalBody>
        {messageToShow}
      </ModalBody>
      <ModalFooter>
        <Button className="btn btn-success" onClick={() => { actionBtnModalConfirmation.handleBtnCancelModalConfirmation() }}>{messages.canceled}</Button>
        <Button className="btn btn-danger" onClick={() => { actionBtnModalConfirmation.handleBtnConfirmerModalConfirmation() }}>{messages.confirmed}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ModalConfirmation