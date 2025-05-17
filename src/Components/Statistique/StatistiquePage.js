import React from 'react';
import StatistiqueChart from './StatistiqueChart';
import { Card, CardHeader, CardBody, Container, Row, Col } from 'reactstrap';

const StatistiquePage = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="shadow">
            <CardHeader className="border-3">
              <h3 className="mb-0">Statistiques</h3>
            </CardHeader>
            <CardBody>
              <StatistiqueChart/>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

 export default StatistiquePage;