import React, { Component } from 'react';
import btoa from 'btoa';
import { Form, Button, List, Card, CardContent, CardHeader, CardMeta } from 'semantic-ui-react';
import ListOferta from '../components/listOferta';

export default class Index extends Component
{

    static getInitialProps = (ctx) => {
        let { query, pathname } = ctx;
        query.sede_id = query.sede_id ? query.sede_id : btoa(1);
        return { query, pathname };
    }

    render() {

        let { query, pathname } = this.props;

        return (
            <div className="container mt-5">
                <Form>
                    <div className="row">
                        <div className="col-md-9 col-12 mb-1">
                            <select className="select-convocatoria">
                                <option value="">Seleccionar convocatoria</option>
                            </select>
                        </div>

                        <div className="col-md-3 mb-1">
                            <Button className="btn-convocatoria" fluid>
                                <i className="fas fa-search"></i> Buscar
                            </Button>
                        </div>

                        <div className="col-md-12 mt-5 pt-5">
                            <Card fluid>
                                <CardHeader>
                                    <CardContent>
                                        <h3 className="py-3 pl-3">
                                            <CardMeta>Lista de Ofertas laborales</CardMeta>
                                        </h3>
                                    </CardContent>
                                </CardHeader>
                                <CardContent>
                                    <List divided>
                                        <ListOferta/>
                                        <ListOferta/>
                                    </List>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }

}