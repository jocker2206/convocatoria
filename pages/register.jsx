import React, { Component } from 'react';
import { Form, Card, Button } from 'semantic-ui-react';
import { authentication, recursoshumanos } from '../services/apis';
import Swal from 'sweetalert2';
import { RequestParse } from 'validator-error-adonis';
import Router from 'next/router';

export default class Register extends Component 
{

    state = {
        block: false,
        loading: false,
        document_types: [],
        departamentos: [],
        provincias: [],
        distritos: [],
        cod_dep: "",
        cod_pro: "",
        cod_dis: "", 
        errors: {},
        form : {
            condicion: false
        }
    }   

    componentDidMount = () => {
        this.getDocumentType();
        this.getDepartamentos();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        let { state, props } = this;
        if (prevState.cod_dep != state.cod_dep) await this.getProvincias(state.cod_dep);
        if (prevState.cod_pro != state.cod_pro) await this.getDistritos(state.cod_dep, state.cod_pro);
    }

    getDocumentType = async () => {
        this.setState({ block: true });
        await authentication.get('get_document_type')
        .then(res => this.setState({ document_types: res.data || [] }))
        .catch(err => console.log(err.message));
        this.setState({ block: false });
    }

    getDepartamentos = async () => {
        this.setState({ block: true });
        await authentication.get('badge')
        .then(res => this.setState({ departamentos: res.data }))
        .catch(err => console.log(err.message));
        this.setState({ block: false });
    }

    getProvincias = async (cod_dep) => {
        this.setState(state => {
            state.provincias = [];
            state.cod_pro = "";
            for(let dep of state.departamentos) {
                if (dep.cod_dep == cod_dep) {
                    state.provincias = dep.provincias;
                    break;
                }
            }
            // response
            return { provincias: state.provincias || [], cod_pro: state.cod_pro };
        });
    }

    getDistritos = async (cod_dep, cod_pro) => {
        this.setState({ block: true });
        let datos = await authentication.get(`get_distritos/${cod_dep}/${cod_pro}`)
            .then(res => res.data)
            .catch(err => []);
        this.setState({ distritos: datos, cod_dis: "", block: false });
    }

    handleSelect = ({ name, value }) => {
        this.setState({ [name]: value });
    }

    handleInput = ({ name, value }) => {
        this.setState(state => {
            state.form[name] = value;
            state.errors[name] = "";
            return { form: state.form, errors: state.errors };
        });
    }

    save = async () => {
        this.setState({ loading: true });
        let { state } = this;
        let form = Object.assign({}, state.form);
        form.ubigeo_id = `${state.cod_dep}${state.cod_pro}${state.cod_dis}`;
        form.redirect = `${location.origin}/verify`;
        // send form
        await recursoshumanos.post('postulante', form)
        .then(async res => {
            let { success, message, postulante } = res.data;
            if (!success) throw new Error(message);
            await Swal.fire({ icon: 'success', text: message });
            let { push } = Router;
            await push({ pathname: '/login', query: { email: postulante.email } });
        })
        .catch(async err => {
            try {
                let response = JSON.parse(err.message);
                Swal.fire({ icon: 'warning', text: response.message });
                this.setState({ errors: response.errors });
            } catch (error) {
                Swal.fire({ icon: 'error', text: err.message });
            }
        });
        this.setState({ loading: false });
    }

    render () {

        let { form, block, loading, document_types, departamentos, provincias, distritos, errors } = this.state;

        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <Card fluid>
                            <Card.Header>
                                <div className="card-body">
                                    <h3 className="">Regístro del postulante</h3>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <Form>
                                    <div className="row mt-4">
                                        <div className="col-md-6 mb-1">
                                            <Form.Field error={errors.tipo_de_documento && errors.tipo_de_documento[0]}>
                                                <label className="text-muted">Tip. Documento <b className="text-danger">*</b></label>
                                                <select name="tipo_de_documento" value={form.tipo_de_documento || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading || block}
                                                >
                                                    <option value="">Seleccionar Tip. Documento</option>
                                                    {document_types.map(ty => 
                                                        <option value={ty.value} key={`docs-${ty.key}`}>{ty.text}</option>    
                                                    )}
                                                </select>
                                                <label>{errors.tipo_de_documento && errors.tipo_de_documento[0]}</label>
                                            </Form.Field>
                                        </div>
                                        
                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.numero_de_documento && errors.numero_de_documento[0]}>
                                                <label className="text-muted">N° de Documento <b className="text-danger">*</b></label>
                                                <input type="text"
                                                    name="numero_de_documento"
                                                    value={form.numero_de_documento || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.numero_de_documento && errors.numero_de_documento[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.ape_paterno && errors.ape_paterno[0]}>
                                                <label className="text-muted">Apellido Paterno <b className="text-danger">*</b></label>
                                                <input type="text"
                                                    name="ape_paterno"
                                                    value={form.ape_paterno || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.ape_paterno && errors.ape_paterno[0]}</label>
                                            </Form.Field>
                                        </div>
                                        
                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.ape_materno && errors.ape_materno[0]}>
                                                <label className="text-muted">Apellido Materno <b className="text-danger">*</b></label>
                                                <input type="text"
                                                    name="ape_materno"
                                                    value={form.ape_materno || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.ape_materno && errors.ape_materno[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-12 mb-2">
                                            <Form.Field error={errors.nombres && errors.nombres[0]}>
                                                <label className="text-muted">Nombres <b className="text-danger">*</b></label>
                                                <input type="text"
                                                    name="nombres"
                                                    value={form.nombres || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.nombres && errors.nombres[0]}</label>
                                            </Form.Field>
                                        </div>
                                        
                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.fecha_de_nacimiento && errors.fecha_de_nacimiento[0]}>
                                                <label className="text-muted">Fecha de Nacimiento <b className="text-danger">*</b></label>
                                                <input type="date"
                                                    name="fecha_de_nacimiento"
                                                    value={form.fecha_de_nacimiento || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.fecha_de_nacimiento && errors.fecha_de_nacimiento[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.genero && errors.genero[0]}>
                                                <label className="text-muted">Género <b className="text-danger">*</b></label>
                                                <select name="genero"
                                                    value={form.genero || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                >
                                                    <option value="">Seleccionar Género</option>
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Femenino</option>
                                                    <option value="I">No Binario</option>
                                                </select>
                                                <label>{errors.genero && errors.genero[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-12 mt-4">
                                            <hr/>
                                            <h4><i className="fas fa-thumbtack"></i> Ubicación</h4>
                                            <hr/>
                                        </div>

                                        <div className="col-md-12 mb-2">
                                            <Form.Field error={errors.ubigeo_id && errors.ubigeo_id[0]}>
                                                <label className="text-muted">Departamento <b className="text-danger">*</b></label>
                                                <select name="cod_dep"
                                                    value={this.state.cod_dep || ""}
                                                    onChange={(e) => this.handleSelect(e.target)}
                                                    disabled={loading || block}
                                                >
                                                    <option value="">Seleccionar Departamento</option>
                                                    {departamentos.map(dep => 
                                                        <option value={dep.cod_dep}
                                                            key={`dep-${dep.cod_dep}`}
                                                        >
                                                            {dep.departamento}
                                                        </option>    
                                                    )}
                                                </select>
                                                <label>{errors.ubigeo_id && errors.ubigeo_id[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.ubigeo_id && errors.ubigeo_id[0]}>
                                                <label className="text-muted">Provincia <b className="text-danger">*</b></label>
                                                <select name="cod_pro"
                                                    value={this.state.cod_pro || ""}
                                                    onChange={(e) => this.handleSelect(e.target)}
                                                    disabled={!this.state.cod_dep || loading || block}
                                                >
                                                    <option value="">Seleccionar Provincias</option>
                                                    {provincias.map(pro => 
                                                        <option value={pro.cod_pro}
                                                            key={`pro-${pro.cod_pro}`}
                                                        >
                                                            {pro.provincia}
                                                        </option>    
                                                    )}
                                                </select>
                                                <label>{errors.ubigeo_id && errors.ubigeo_id[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.ubigeo_id && errors.ubigeo_id[0]}>
                                                <label className="text-muted">Distrito <b className="text-danger">*</b></label>
                                                <select name="cod_dis"
                                                    value={this.state.cod_dis || ""}
                                                    onChange={(e) => this.handleSelect(e.target)}
                                                    disabled={!this.state.cod_pro || loading || block}
                                                >
                                                    <option value="">Seleccionar Distrito</option>
                                                    {distritos.map(dis => 
                                                        <option value={dis.cod_dis}
                                                            key={`dis-${dis.cod_dis}`}
                                                        >
                                                            {dis.distrito}
                                                        </option>    
                                                    )}
                                                </select>
                                                <label>{errors.ubigeo_id && errors.ubigeo_id[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-12 mb-2">
                                            <Form.Field error={errors.direccion && errors.direccion[0]}>
                                                <label className="text-muted">Dirección <b className="text-danger">*</b></label>
                                                <input type="text"
                                                    name="direccion"
                                                    value={form.direccion || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.direccion && errors.direccion[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-12 mt-4">
                                            <hr/>
                                            <h4><i className="fas fa-phone-alt"></i> Contacto</h4>
                                            <hr/>
                                        </div>

                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.email && errors.email[0]}>
                                                <label className="text-muted">Correo Electrónico <b className="text-danger">*</b></label>
                                                <input type="email"
                                                    name="email"
                                                    value={form.email || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.email && errors.email[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-6 mb-2">
                                            <Form.Field error={errors.phone && errors.phone[0]}>
                                                <label className="text-muted">Teléfono <b className="text-danger">*</b></label>
                                                <input type="tel"
                                                    name="phone"
                                                    value={form.phone || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                                <label>{errors.phone && errors.phone[0]}</label>
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-12 mt-3">
                                            <b>
                                                <input type="checkbox" className="mt-1 mr-2"
                                                    name="condicion"
                                                    onChange={(e) => {
                                                        let { checked, name } = e.target;
                                                        this.handleInput({ name, value: checked });
                                                    }}
                                                    checked={form.condicion}
                                                    disabled={loading}
                                                /> 
                                                <a href="/terminos" target="_blank"><u>Acepto los términos y condiciones</u></a>
                                            </b>
                                        </div>

                                        <div className="col-md-12">
                                            <hr/>
                                        </div>

                                        <div className="col-md-12 mt-4 text-right">
                                            <Button className="btn-mas-info"
                                                disabled={!form.condicion || loading}
                                                onClick={this.save}
                                            >
                                                <i className="fas fa-save"></i> Guardar Datos
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

}