import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { handleClose, handleOpenModalConfirmation, handleCloseModalConfirmation } from "../../Redux/Actions/Module/ModuleAside";
import { addNewModule, editModule, deleteModule } from "../../Redux/Actions/Module/Module";
import notify from "devextreme/ui/notify";
import { notifyOptions } from '../../Helper/Config';
import '../../assests/css/modals.css';

const ModuleAside = () => {
    const dispatch = useDispatch();
    const ModuleAsideReducer = useSelector(state => state.ModuleAsideReducer);
    const messages = useSelector(state => state.intl.messages);
    const direction = useSelector(state => state.intl.direction);
    
    const { isOpen, modeAside, selectedModule, successCallback } = ModuleAsideReducer;
    
    const [formData, setFormData] = useState({
        idModule: '',
        designation: '',
        actif: true
    });
    
    useEffect(() => {
        if (selectedModule) {
            setFormData({
                idModule: selectedModule.idModule || '',
                designation: selectedModule.designation || '',
                actif: selectedModule.actif !== undefined ? selectedModule.actif : true
            });
        } else {
            setFormData({
                idModule: '',
                designation: '',
                actif: true
            });
        }
    }, [selectedModule]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    const onClickBtnClose = () => {
        dispatch(handleClose());
    };
    
    const getTitle = () => {
        switch (modeAside) {
            case 'add':
                return (
                    <>
                        <i className="fas fa-plus-circle mr-2 text-success"></i>
                        {messages.addModule || "Add Module"}
                    </>
                );
            case 'EDIT':
                return (
                    <>
                        <i className="fas fa-edit mr-2 text-primary"></i>
                        {messages.editModule || "Edit Module"}
                    </>
                );
            case 'DELETE':
                return (
                    <>
                        <i className="fas fa-trash-alt mr-2 text-danger"></i>
                        {messages.deleteModule || "Delete Module"}
                    </>
                );
            case 'CONSULT':
                return (
                    <>
                        <i className="fas fa-eye mr-2 text-secondary"></i>
                        {messages.consultModule || "View Module"}
                    </>
                );
            default:
                return (
                    <>
                        <i className="fas fa-puzzle-piece mr-2 text-info"></i>
                        {messages.module || "Module"}
                    </>
                );
        }
    };
    
    const renderFooterButtons = () => {
        switch (modeAside) {
            case 'add':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                            <i className="fas fa-times mr-2"></i>
                            {messages.cancel || "Cancel"}
                        </Button>
                        <Button color="success" onClick={handleSubmit} className="px-4">
                            <i className="fas fa-plus-circle mr-2"></i>
                            {messages.save || "Save"}
                        </Button>
                    </>
                );
            case 'EDIT':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                            <i className="fas fa-times mr-2"></i>
                            {messages.cancel || "Cancel"}
                        </Button>
                        <Button color="primary" onClick={handleSubmit} className="px-4">
                            <i className="fas fa-save mr-2"></i>
                            {messages.save || "Save"}
                        </Button>
                    </>
                );
            case 'DELETE':
                return (
                    <>
                        <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                            <i className="fas fa-times mr-2"></i>
                            {messages.cancel || "Cancel"}
                        </Button>
                        <Button color="danger" onClick={handleSubmit} className="px-4">
                            <i className="fas fa-trash-alt mr-2"></i>
                            {messages.delete || "Delete"}
                        </Button>
                    </>
                );
            case 'CONSULT':
                return (
                    <Button color="secondary" onClick={onClickBtnClose} className="px-4">
                        <i className="fas fa-times mr-2"></i>
                        {messages.close || "Close"}
                    </Button>
                );
            default:
                return null;
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Only validate ID for edit/delete/consult modes, not for add mode
        if (modeAside !== 'add' && (!formData.idModule || formData.idModule.toString().trim() === '')) {
            notify(messages.idRequired || "ID is required", "error", notifyOptions);
            return;
        }
        
        if (!formData.designation || formData.designation.trim() === '') {
            notify(messages.nameRequired || "Name is required", "error", notifyOptions);
            return;
        }
        
        // Create a clean copy of the data
        const moduleData = {
            // Only include ID for non-add modes
            ...(modeAside !== 'add' && { idModule: formData.idModule }),
            designation: formData.designation.trim(),
            actif: formData.actif
        };
        
        if (modeAside === 'add') {
            dispatch(addNewModule(moduleData))
                .then(() => {
                    notify(messages.addSuccess || "Module added successfully", "success", notifyOptions);
                    dispatch(handleClose());
                    if (successCallback) successCallback();
                })
                .catch((error) => {
                    notify(messages.addFailed || "Failed to add module", "error", notifyOptions);
                    console.error("Add module error:", error);
                });
        } else if (modeAside === 'EDIT') {
            // Use the confirmation modal for edit
            //const handleBtnConfirmerModalConfirmation = () => {
                // dispatch(handleCloseModalConfirmation());
                dispatch(editModule(moduleData))
                    .then(() => {
                        notify(messages.editSuccess || "Module updated successfully", "success", notifyOptions);
                        dispatch(handleClose());
                        if (successCallback) successCallback();
                    })
                    .catch((error) => {
                        notify(messages.editFailed || "Failed to update module", "error", notifyOptions);
                        console.error("Edit module error:", error);
                    });
            //};
            
            // const handleBtnCancelModalConfirmation = () => {
            //     dispatch(handleCloseModalConfirmation());
            // };
            
            // dispatch(handleOpenModalConfirmation(
            //     messages.confirmEdit || "Are you sure you want to update this module?",
            //     handleBtnCancelModalConfirmation,
            //     handleBtnConfirmerModalConfirmation
            // ));
        } else if (modeAside === 'DELETE') {
            // Use the confirmation modal for delete
            const handleBtnConfirmerModalConfirmation = () => {
                dispatch(handleCloseModalConfirmation());
                dispatch(deleteModule(formData.idModule))
                    .then(() => {
                        notify(messages.deleteSuccess || "Module deleted successfully", "success", notifyOptions);
                        dispatch(handleClose());
                        if (successCallback) successCallback();
                    })
                    .catch((error) => {
                        notify(messages.deleteFailed || "Failed to delete module", "error", notifyOptions);
                        console.error("Delete module error:", error);
                    });
            };
            
            const handleBtnCancelModalConfirmation = () => {
                dispatch(handleCloseModalConfirmation());
            };
            
            dispatch(handleOpenModalConfirmation(
                messages.confirmDelete || "Are you sure you want to delete this module?",
                handleBtnCancelModalConfirmation,
                handleBtnConfirmerModalConfirmation
            ));
        }
    };
    
    return (
        <>
            <Modal isOpen={isOpen} toggle={onClickBtnClose} className="module-modal" style={{ direction: direction }}>
                <ModalHeader toggle={onClickBtnClose}>
                    {getTitle()}
                </ModalHeader>
                <ModalBody>
                    {modeAside === 'DELETE' && (
                        <div className="alert alert-danger mb-4 d-flex align-items-center">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            <div>{messages.deleteWarning || "Attention ! Cette action est irréversible. Toutes les données associées à ce module seront supprimées."}</div>
                        </div>
                    )}
                    <Form>
                        {/* Remove or hide ID field in add mode since it's auto-incremented */}
                        {modeAside !== 'add' && (
                            <FormGroup>
                                <Label for="idModule" className="d-flex align-items-center">
                                    <i className="fas fa-hashtag mr-2 text-muted"></i>
                                    {messages.id || "ID"}
                                </Label>
                                <Input
                                    type="text"
                                    name="idModule"
                                    id="idModule"
                                    placeholder={messages.id || "ID"}
                                    value={formData.idModule}
                                    disabled={true} // Always disabled since it's auto-generated
                                    readOnly
                                    className="bg-light"
                                />
                            </FormGroup>
                        )}
                        
                        <FormGroup>
                            <Label for="designation" className="d-flex align-items-center font-weight-bold">
                                {/* <i className="fas fa-puzzle-piece mr-2 text-primary"></i> */}
                                {messages.name || "Name"} <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="designation"
                                id="designation"
                                placeholder={messages.name || "Name"}
                                value={formData.designation}
                                onChange={handleChange}
                                disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                            />
                        </FormGroup>
                        
                        <FormGroup check className="mt-3">
                            <Label check className="d-flex align-items-center">
                                <Input
                                    type="checkbox"
                                    name="actif"
                                    checked={formData.actif}
                                    onChange={handleChange}
                                    disabled={modeAside === "CONSULT" || modeAside === "DELETE"}
                                    className="mr-2"
                                />
                                {/* <i className="fas fa-toggle-on mr-2 text-success"></i> */}
                                {messages.actif || "Active"}
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {renderFooterButtons()}
                </ModalFooter>
            </Modal>

            {/* Modal de confirmation */}
            <Modal
                isOpen={ModuleAsideReducer.isOpenModalConfirmation}
                toggle={() => dispatch(handleCloseModalConfirmation())}
                className="modal-confirmation"
                size="sm"
            >
                <ModalHeader toggle={() => dispatch(handleCloseModalConfirmation())} className="bg-warning text-white">
                    <i className="fas fa-question-circle mr-2"></i>
                    {messages.confirmation || "Confirmation"}
                </ModalHeader>
                <ModalBody className="p-4">
                    <p className="mb-0">{ModuleAsideReducer.messageToShow}</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="secondary"
                        onClick={() => {
                            if (ModuleAsideReducer.handleBtnCancelModalConfirmation) {
                                ModuleAsideReducer.handleBtnCancelModalConfirmation();
                            } else {
                                dispatch(handleCloseModalConfirmation());
                            }
                        }}
                        className="px-3"
                    >
                        <i className="fas fa-times mr-2"></i>
                        {messages.cancel || "Annuler"}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            if (ModuleAsideReducer.handleBtnConfirmerModalConfirmation) {
                                ModuleAsideReducer.handleBtnConfirmerModalConfirmation();
                            } else {
                                dispatch(handleCloseModalConfirmation());
                            }
                        }}
                        className="px-3"
                    >
                        <i className="fas fa-check mr-2"></i>
                        {messages.confirm || "Confirmer"}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ModuleAside;