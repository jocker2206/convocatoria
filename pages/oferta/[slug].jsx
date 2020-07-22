import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';


export default class Oferta extends Component
{

    render() {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <h3>Nombre de la Oferta laboral</h3>
                        <div>
                        La Organización Internacional de Policía Criminal es la mayor organización de policía internacional, con 194 países miembros, por lo cual es una de las organizaciones internacionales más grandes del mundo, superando en uno, la cifra de países unidos a las
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4><i className="fas fa-clock"></i> Etapa</h4>
                                        <hr/>
                                    </div>

                                    <div className="col-md-12 mt-4">
                                        <h4><i className="fas fa-file-alt"></i> Requerimientos</h4>
                                        <hr/>
                                    </div>

                                    <div className="col-md-12 mt-4">
                                        <h4><i className="fas fa-users"></i> Actividades</h4>
                                        <hr/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <Button fluid className="btn-convocatoria">
                            Postular
                        </Button>

                        <div className="mt-3">
                            <hr/>
                            <i className="fas fa-info-circle"></i> <b>Información</b>
                            <hr/>
                            <div className="mt-3"></div>
                            <div className="mb-2">
                                <b><i className="fas fa-thumbtack"></i> Sede:</b>
                            </div>
                            <div className="mb-2">
                                <b><i className="fas fa-building"></i> Dependencia/Oficina:</b>
                            </div>
                            <div className="mb-2">
                                <b><i className="fas fa-briefcase"></i> Perfil Laboral</b>
                            </div>
                            <div className="mb-2">
                                <b><i className="fas fa-coins"></i> Honorarios:</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}