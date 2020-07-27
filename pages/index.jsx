import React, { Component } from 'react';
import { Form, Button, List, Card, CardContent, CardHeader, CardMeta } from 'semantic-ui-react';
import ListOferta from '../components/listOferta';
import { recursoshumanos } from '../services/apis';
import Show from '../components/show';

export default class Index extends Component
{

    static getInitialProps = async (ctx) => {
        let { query, pathname } = ctx;
        return { query, pathname };
    }

    state = {
        convocatorias: [],
        convocatoria_id: "",
        staff: {
            total: 0,
            page: 1,
            lastPage: 1,
            data: []
        }
    };

    componentDidMount = () => {
        this.getConvocatoria();
    }

    getConvocatoria = async (page = 1) => {
        this.props.setLoading(true);
        await recursoshumanos.get(`public/convocatoria?page=${page}`)
        .then(res => {
            let { success, convocatoria, message } = res.data;
            if (!success) throw new Error(message);
            // update convocatorias
            this.setState(state => {
                state.convocatorias = [...state.convocatorias, ...convocatoria.data];
                return { convocatorias: state.convocatorias };
            }); 
        })
        .catch(err => this.setState({ convocatorias: [] }));
        this.props.setLoading(false);
    }

    getStaff = async (changed = false) => {
        let { convocatoria_id } = this.state;
        if (convocatoria_id) {
            await recursoshumanos.get(`public/convocatoria/${convocatoria_id}/staff_requirement`)
            .then(res => {
                let { success, message, staff } = res.data;
                if (!success) throw new Error(message);
                this.setState(state => {
                    state.staff.total = staff.total;
                    state.staff.lastPage = staff.lastPage;
                    state.staff.page = staff.page;
                    state.staff.data = changed ? staff.data : [...state.staff.data, ...staff.data];
                    return { staff: state.staff };
                });
            }).catch(err => console.log(err));
        } else {
            this.setState({ staff: { page: 1, total: 0, lastPage: 1, data: [] } });
        }
    }

    render() {

        let { query, pathname } = this.props;
        let { convocatorias, convocatoria_id, staff } = this.state;

        return (
            <div className="container mt-5">
                <Form>
                    <div className="row">
                        <div className="col-md-9 col-12 mb-1">
                            <select className="select-convocatoria"
                                name="convocatoria_id"
                                value={convocatoria_id}
                                onChange={({ target }) => this.setState({ [target.name]: target.value })}
                            >
                                <option value="">Seleccionar convocatoria</option>
                                {convocatorias.map(con => 
                                    <option key={`conv-${con.id}`} value={con.id}>{con.numero_de_convocatoria}</option>    
                                )}
                            </select>
                        </div>

                        <div className="col-md-3 mb-1">
                            <Button className="btn-convocatoria" fluid
                                onClick={(e) => this.getStaff(true)}
                            >
                                <i className="fas fa-search"></i> Buscar
                            </Button>
                        </div>

                        <Show condicion={staff.total}>
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
                                            {staff.data.map(sta => 
                                                <ListOferta key={`staff-${sta.id}`}
                                                    slug={sta.slug}
                                                    titulo={sta.perfil_laboral}
                                                    dependencia={sta.dependencia}
                                                    honorarios={sta.honorarios}
                                                    money="S./"
                                                />    
                                            )}
                                        </List>
                                    </CardContent>
                                </Card>
                            </div>
                        </Show>

                        <Show condicion={!staff.total}>
                            <div className="col-md-12 mt-5 text-center mb-5 pt-5">
                                <h4>No hay registros encontrados</h4>
                            </div>
                        </Show>
                    </div>
                </Form>
            </div>
        )
    }

}