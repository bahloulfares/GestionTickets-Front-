import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import '../../assests/css/modals.css';
import {
    handleCloseModal
} from "../../Redux/Actions/ComponentTable/ModalImpression";

/*Modal Impression*/

const Impression = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    const isOpen = useSelector(state => state.ModalReducerImpression.isOpen);
    return (
        <Modal
        className="modal-impression"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            isOpen={isOpen}
            style={{ direction: direction }}
        >
            <ModalBody>
                <iframe id="iframe_content" height="500px" width="100%" src=""></iframe>
            </ModalBody>
            <ModalFooter>
            <Button className="btn btn-danger" onClick={() => {dispatch(handleCloseModal())}}>{messages.close}</Button>
            </ModalFooter>
        </Modal>

    )

}

export default Impression