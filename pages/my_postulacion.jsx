import React, { Component } from 'react';
import btoa from 'btoa';
import { Form, Button, List, Card, CardContent, CardHeader, CardMeta } from 'semantic-ui-react';
import ListOferta from '../components/listOferta';

export default class MyPostulacion extends Component
{

    static getInitialProps = (ctx) => {
        let { query, pathname } = ctx;
        query.sede_id = query.sede_id ? query.sede_id : btoa(1);
        return { query, pathname };
    }

    render() {

        let { query, pathname } = this.props;

        return (
            <div className="container mt-4">
                <Form>
                    <div className="row">
                        <div className="col-md-12 pt-5">
                            <Card fluid>
                                <CardHeader>
                                    <CardContent>
                                        <h3 className="py-3 pl-3">
                                            <CardMeta>Mis Postulaciones</CardMeta>
                                        </h3>
                                    </CardContent>
                                </CardHeader>
                                <CardContent>
                                    <List divided>
                                        <ListOferta slug="trabajo"/>
                                        <ListOferta slug="trabajo"/>
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