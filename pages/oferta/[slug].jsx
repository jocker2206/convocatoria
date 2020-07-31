import React, { Component, Fragment } from 'react';
import { Button, Table, Tab } from 'semantic-ui-react';
import { findStaff } from '../../services/request/staff';
import Show from '../../components/show';
import { authentication, recursoshumanos } from '../../services/apis';
import Swal from 'sweetalert2';
import Router from 'next/router';
import { Confirm } from '../../services/utils';

export default class Oferta extends Component
{

    static getInitialProps = async (ctx) => {
        let { query, pathname } = ctx;
        let { staff, success } = await findStaff(ctx);
        return { query, pathname, staff, success };
    }

    state = {
        sede: {},
        dependencia: {},
        requisitos: [],
        actividades: [],
        etapa: {},
        etapas: [
            'CURRICULAR',
            'CONOCIMIENTO',
            'ENTREVISTA',
            'GANADOR'
        ]
    };  

    componentDidMount = async () => {
        let { success } = this.props;
        if (success) {
            // validar login
            this.getEtapa();
            this.getSede();
            this.getDependencia();
            this.getRequisitos();
            this.getActividades();
        }
    }

    getDependencia = async () => {
        let { staff } = this.props;
        await recursoshumanos.get(`public/staff_requirement/${staff.slug || '_error'}/dependencia`)
        .then(res => {
            let { dependencia, success, message } = res.data;
            if (!success) throw new Error(message);
            this.setState({ dependencia })
        }).catch(err => console.log(err.message));
    }

    getRequisitos = async () => {
        let { staff } = this.props;
        await recursoshumanos.get(`public/staff_requirement/${staff.slug || '_error'}/requisitos`)
        .then(res => {
            let { requisitos, success, message } = res.data;
            if (!success) throw new Error(message);
            this.setState({ requisitos })
        }).catch(err => console.log(err.message));
    }

    getActividades = async () => {
        let { staff } = this.props;
        await recursoshumanos.get(`public/convocatoria/${staff.convocatoria_id || '_error'}/actividades`)
        .then(res => {
            let { actividades, success, message } = res.data;
            if (!success) throw new Error(message);
            this.setState({ actividades })
        }).catch(err => console.log(err.message));
    }

    getSede = async () => {
        let { staff } = this.props;
        await authentication.get(`sede/${staff.sede_id || '_error'}`)
        .then(res => {
            let { sede, success, message } = res.data;
            if (!success) throw new Error(message);
            this.setState({ sede })
        }).catch(err => console.log(err.message));
    }

    handleLogin = async () => {
        let answer = await Confirm('warning', `¿Deseas iniciar sesión?`, 'Iniciar Sesión');
        if (answer) {
            let { push } = Router;
            let { staff } = this.props;
            let href = `/oferta/${staff.slug}`;
            push({ pathname: '/login', query: { href } })
        }
    }

    getEtapa = async () => {
        let { isLoggin, staff } = this.props;
        if (isLoggin) {
            this.props.setLoading(true);
            await recursoshumanos.get(`auth/etapa/${staff.slug}`)
            .then(res => {
                let { success, message, etapa } = res.data;
                if (!success) throw new Error(message);
                this.setState({ etapa });
            }).catch(err => console.log(err.message));
            this.props.setLoading(false);
        }
    }

    postular = async () => {
        let answer = await Confirm('warning', `¿Estas seguro en postular?`, 'Postular')
        if (answer) {
            let { staff } = this.props;
            this.props.setLoading(true);
            await recursoshumanos.get(`auth/postular/${staff.id}`)
            .then(async res => {
                this.props.setLoading(false);
                let { success, message } = res.data;
                if (!success) throw new Error(message);
                await Swal.fire({ icon: 'success', text: message });
                await this.getEtapa();
            }).catch(err => {
                Swal.fire({ icon: 'error', text: err.message });
            });
            this.props.setLoading(false);
        }
    }

    render() {

        let { staff, isLoggin, success } = this.props;
        let { sede, dependencia, requisitos, actividades, etapa, etapas } = this.state;

        if (!success) return 'La pagina no está disponible'

        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <h3>
                            N° {staff.convocatoria && staff.convocatoria.numero_de_convocatoria} 
                            <i className="fas fa-arrow-right text-danger ml-2 mr-2"></i> 
                            {staff.perfil_laboral && staff.perfil_laboral.nombre}
                        </h3>
                        <div>
                            {staff.deberes}
                        </div>
                    </div>

                    <div className="col-md-9 mb-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <Show condicion={isLoggin && etapa && etapa.current == 1}>
                                        <div className="col-md-12 mb-4">
                                            <h4><i className="fas fa-clock"></i> Etapa</h4>
                                            <hr/>

                                            <dvi className="row">
                                                {etapas.map((e, i) => 
                                                    <div className="col-md-3" key={`etapa-${e}`}>
                                                        <div className="card-body">
                                                            <div className="row justify-content-center">
                                                                <div className="col-md-12 text-center" style={{ display: "flex", justifyContent: 'center' }}>
                                                                    <div className={`btn-etapa ${e == etapa.estado ? 'bg-theme' : ''}`}>
                                                                        {i + 1}
                                                                    </div>
                                                                </div>
                                                                <span>{e}</span>
                                                            </div>
                                                        </div>
                                                    </div>    
                                                )}
                                            </dvi>
                                        </div>
                                    </Show>

                                    <div className="col-md-12 mb-4">
                                        <h4><i className="fas fa-file-alt"></i> Requerimientos</h4>
                                        <hr/>
                                        <Table compact>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Descripción</Table.HeaderCell>
                                                    <Table.HeaderCell>Detalle</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            
                                            <Table.Body>
                                                {requisitos.map(req => 
                                                    <Table.Row key={`requisito-${req.id}`}>
                                                        <Table.Cell>
                                                            {req.descripcion}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <ul>
                                                                {req.body && req.body.map((b, indexB) =>
                                                                    <li key={`body-${indexB}`}>
                                                                        <b className="badge badge-dark">{b}</b>
                                                                        <br/> 
                                                                    </li>   
                                                                )}
                                                            </ul>
                                                        </Table.Cell>
                                                    </Table.Row>    
                                                )}
                                            </Table.Body>
                                        </Table>
                                    </div>

                                    <div className="col-md-12">
                                        <h4><i className="fas fa-users"></i> Actividades</h4>
                                        <hr/>

                                        <Table compact>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Descripción</Table.HeaderCell>
                                                    <Table.HeaderCell>F. Inicio</Table.HeaderCell>
                                                    <Table.HeaderCell>F. Final</Table.HeaderCell>
                                                    <Table.HeaderCell>Responsable</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            
                                            <Table.Body>
                                                {actividades.map(req => 
                                                    <Table.Row key={`actividad-${req.id}`}>
                                                        <Table.Cell>
                                                            {req.descripcion}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <b className="badge badge-dark">
                                                                {new Date(req.fecha_inicio).toLocaleDateString()}
                                                            </b>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <b className="badge badge-dark">
                                                                {new Date(req.fecha_final).toLocaleDateString()}
                                                            </b>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {req.responsable}
                                                        </Table.Cell>
                                                    </Table.Row>    
                                                )}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 ">
                        <Show condicion={!isLoggin}>
                            <Button fluid 
                                className={`${staff.estado == 'TERMINADO' ? 'btn-cancel' : 'btn-convocatoria'}`}
                                onClick={this.handleLogin}
                                disabled={staff.estado == 'TERMINADO'}
                            >
                                {staff.estado == 'TERMINADO' ? 'Terminado' : 'Inicia Sesión'}
                            </Button>
                        </Show>

                        <Show condicion={isLoggin}>
                            <Button fluid 
                                onClick={this.postular}
                                disabled={etapa && etapa.current || staff.estado == 'TERMINADO'}
                                className={staff.estado == 'TERMINADO' ? 'btn-cancel' : etapa && etapa.current == 1 ? 'btn-convocatoria' : 'btn-convocatoria bg-theme'}
                            >
                               {staff.estado == 'TERMINADO' ? 'Terminó' : etapa && etapa.current ? 'Postulando' : 'Postular'}
                            </Button>
                        </Show>

                        <div className="mt-3">
                            <hr/>
                            <i className="fas fa-info-circle"></i> <b>Información</b>
                            <hr/>
                            <div className="mt-3"></div>
                            <div className="mb-2">
                                <i className="fas fa-thumbtack"></i> Sede: <b className="ml-2">{sede.descripcion || ""}</b>
                            </div>
                            <div className="mb-2">
                                <i className="fas fa-building"></i> Dependencia/Oficina: <b className="ml-2">{dependencia.nombre || ""}</b>
                            </div>
                            <div className="mb-2">
                                <i className="fas fa-briefcase"></i> Perfil Laboral: <b className="ml-2">{staff.perfil_laboral && staff.perfil_laboral.nombre}</b>
                            </div>
                            <div className="mb-2">
                                <i className="fas fa-coins"></i> Honorarios: <b className="ml-2 badge badge-warning">S/. {staff.honorarios}</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}