import React from 'react';
import { useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Chart, {
  CommonSeriesSettings,
  Series,
  ValueAxis,
  Export,
  Title,
  Legend,
  Tooltip,
  Grid,
  ArgumentAxis,
  Label
} from 'devextreme-react/chart';
import '../../assests/css/lineChart.css';


const LineChart = (obj) => {
  const messages = useSelector(state => state.intl.messages);
  const Reducer = useSelector(state => state[obj.reducer])

  let { isChartOpen, parametres } = Reducer;
   function customizeTooltip(pointInfo) {
    return {
      text: `${messages.date} :${pointInfo.argumentText}<br/>${pointInfo.seriesName} :${pointInfo.valueText}`
    };
  } 
 
  return (
    <Modal
      className="modal-chart"
      zIndex="9999!important"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      isOpen={isChartOpen}
    >
      <ModalHeader>{messages.courbeHistorique}</ModalHeader>
      <ModalBody>
        {isChartOpen && <React.Fragment>
          <Chart
            id="chart"
            palette="Vintage"
            dataSource={parametres.dataToDraw}
          >
            <Title
              text={parametres.subtitle}
              font={{ color: "#b74e14", size: "14" }}>

            </Title>
            <CommonSeriesSettings
              argumentField="annee"
              type="spline"
            />

            {parametres.series.map((serie, key) => {
              return (<Series key={key}
                {...serie}
              >
              </Series>)
            }
            )}
            {parametres.valuesAxis.map((valueAxis, key) => {
              return (<ValueAxis key={key}
                {...valueAxis}
              >
                <Label format={valueAxis.format}
                >
                </Label>
                <Grid visible={true} />
              </ValueAxis>)
            }
            )}
            <ArgumentAxis
              valueMarginsEnabled={false}
              discreteAxisDivisionMode="crossLabels">
              <Label format={
                { type: 'decimal' }
              }>
              </Label>
              <Grid visible={true} />
            </ArgumentAxis>
            <Legend
              verticalAlignment="bottom"
              horizontalAlignment="center"
              itemTextPosition="center"
            />
            <Export enabled={true} />
            <Tooltip
              enabled={true}
              zIndex="5555555555"
              format={{ type: "fixedPoint", precision: 2 }}
              customizeTooltip={customizeTooltip}
            >
            </Tooltip>
          </Chart>
        </React.Fragment>}

      </ModalBody>
      <ModalFooter>
        <Button className="btn btn-danger" onClick={() => { parametres.handleBtnFermerModalChart() }}>{messages.close}</Button>
      </ModalFooter>
    </Modal>

  );

}

export default LineChart
