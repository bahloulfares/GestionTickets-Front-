import React, {Component} from 'react';
import PosteGrid from './PosteGrid';
import PosteAside from './PosteAside';
import Impression from "../ComponentTable/Impression";
import ModalConfirmation from '../ComponentHelper/ModalConfirmation';

/**
 * PostePage
 */
export class PostePage extends Component {
    render() {
        return (
            <div>
                <PosteGrid/>
                <PosteAside/> 
                <ModalConfirmation reducer = "PosteAsideReducer"/>
                <Impression/>
                
            </div>
        );
    }
}

export default PostePage;