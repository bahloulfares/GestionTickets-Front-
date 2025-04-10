import React from 'react';
import { connect } from "react-redux";
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import 'rc-tabs/assets/index.css';
import { addTab, changeTab, removeTab } from "../../Redux/Actions/MenuTabs/MenuTabs";
import Header from '../Header/Header';
import './MenuTabsAr.css';
 const elmTabsStyle ={
   position: 'absolute',
    /* cursor: 'pointer',
    fontSize: '12px',
    color: '#999',
    opacity: 1*/
}; 

/**
 * MenuTabs
 */
export class MenuTabs extends React.Component {
    componentDidMount() {
        window.addEventListener("keydown", function (event) {
            if (event.target.className.includes('rc-'))
                event.stopPropagation();
        }, true);
    }

    onTabChange = (activeKey) => {
        this.props.changeTab(activeKey);
    };

    construct() {
        const { tabs } = this.props.MenuTabsReducer;
        return tabs.map((t) => {
            return ( 
                <TabPane
                    tab={
                        <span>
{tabs.length > 1 &&t.key === "0" && <span className='addTab fas fa-plus'></span>}
                          
                            {t.key !== '0' && (
                                <span>
                            <span>{t.title}</span>
                                <span className="close"
                                    style={elmTabsStyle}
                                    onClick={(e) => {
                                        this.remove(t.key, e)
                                    }}
                                >
                                    <span className='closeTab fas fa-times fas-times' />
                                </span></span>
                            )
                            }
                        </span >}
                    key={t.key}
                >
                    <div style={{ display: 'block' }}>
                        {t.component}
                    </div>
                </TabPane>);
        });
    }

    remove = (key, e) => {
        let { tabs, activeKey } = this.props.MenuTabsReducer;
        e.stopPropagation();
        if (tabs.length === 1) {
            alert("Only one left, can't delete");
            return;
        }
        let foundIndex = 0;
        const newTabs = tabs.filter((t, i) => {
            if (t.key !== key)
                return true;
            foundIndex = i;
            return false;
        });
        if (activeKey === key) {
            if (foundIndex)
                foundIndex--;
            activeKey = newTabs[foundIndex].key;
        }
        this.props.removeTab(newTabs, activeKey);
    };

    render() {
        const { tabs, activeKey } = this.props.MenuTabsReducer;
        const tabStyle = {
            width: '100%',
        };

        return (
            <div>
                <Header />
                <div className="main">
                    <div style={tabStyle}>
                        <Tabs
                            renderTabBar={() => (
                                <ScrollableInkTabBar />
                            )}
                            renderTabContent={() => <TabContent animated={false} />}
                            activeKey={activeKey}
                            onChange={this.onTabChange}
                        >
                            {this.construct()}
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
    addTab: (tab) => dispatch(addTab(tab)),
    removeTab: (newTabs, activeKey) => dispatch(removeTab(newTabs, activeKey)),
    changeTab: (activeKey) => dispatch(changeTab(activeKey))
});
const ReduxMenuTabsContainer = connect(mapStateToProps, mapDispatchToProps)(MenuTabs);
export default () => (<ReduxMenuTabsContainer />)