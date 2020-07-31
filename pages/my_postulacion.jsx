import React, { Component } from 'react';
import { AUTH } from '../services/auth';
import { Form, Button, List, Card, CardContent, CardHeader, CardMeta } from 'semantic-ui-react';
import ListOferta from '../components/listOferta';
import Show from '../components/show';
import { getMyPostulacion } from '../services/request/auth';

export default class MyPostulacion extends Component
{

    static getInitialProps = async (ctx) => {
        await AUTH(ctx);
        let { query, pathname } = ctx;
        query.page = query.page || 1;
        let { success, staff } = await getMyPostulacion(ctx); 
        return { query, pathname, success, staff };
    }

    render() {

        let { query, pathname, isLoggin, staff, success } = this.props;

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
                                            {staff && staff.data.map(sta => 
                                                <ListOferta key={`staff-${sta.id}`}
                                                    slug={sta.slug}
                                                    titulo={sta.perfil_laboral}
                                                    honorarios={sta.honorarios}
                                                    money="S./"
                                                    fecha_inicio={sta.fecha_inicio}
                                                    estado={sta.estado}
                                                />    
                                            )}
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