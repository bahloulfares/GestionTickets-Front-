import React from 'react';

import { Button } from 'devextreme-react/button';
import { LoadPanel } from 'devextreme-react/load-panel';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadPanelVisible: false,
      showIndicator: true,
      shading: true,
      showPane: true,
      closeOnOutsideClick: false
    };

    this.onClick = this.onClick.bind(this);
    this.hideLoadPanel = this.hideLoadPanel.bind(this);
    this.onShowIndicatorChange = this.onShowIndicatorChange.bind(this);
    this.onShadingChange = this.onShadingChange.bind(this);
    this.onShowPaneChange = this.onShowPaneChange.bind(this);
    this.onCloseOnOutsideClickChange = this.onCloseOnOutsideClickChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Button text="Load Data" onClick={this.onClick}></Button>

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          position={position}
          onHiding={this.hideLoadPanel}
          visible={this.state.loadPanelVisible}
          showIndicator={this.state.showIndicator}
          shading={this.state.shading}
          showPane={this.state.showPane}
          closeOnOutsideClick={this.state.closeOnOutsideClick}
        />
      </React.Fragment>
    );
  }
}

export default App;
