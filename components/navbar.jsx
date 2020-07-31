import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Show from '../components/show';

export default class Navbar extends Component {

    logout = async () => {
        await Cookies.remove('convocatoria_auth');
        // history.go('/');
        alert('remove');
    }

    render() {


        let { app, isLoggin } = this.props;

        return (
            <nav className={`navbar navbar-expand-md navbar-dark fixed-top`}>
                <a className="navbar-brand" href="#">
                    <img src={app.icon || '/img/logo.png'} alt="Logo" className="logo"/>
                    {app.name || 'Convocatorias'}
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link href="/">
                                <a className="nav-link">Inicio</a>
                            </Link>
                        </li>

                        <Show condicion={isLoggin}>
                            <li className="nav-item active">
                                <Link href="/my_postulacion">
                                    <a className="nav-link">Mis Postulaciones</a>
                                </Link>
                            </li>
                        </Show>
                    </ul>
                    <div className="form-inline mt-2 mt-md-0">
                        <Show condicion={!isLoggin}>
                            <Link href="/login">
                                <a className="mr-3"><i className="fas fa-sign-in-alt"></i> <b>Entrar</b></a>
                            </Link>
                            <button className="btn btn-outline"
                                onClick={(e) => Router.push('/register')}
                            >
                                Regístrate
                            </button>
                        </Show>
                        <Show condicion={isLoggin}>
                            <button className="btn btn-outline"
                                onClick={this.props.logout}
                            >
                                <i className="fas fa-times"></i> Cerrar Sesión
                            </button>
                        </Show>
                    </div>
                </div>
            </nav>
        );
    }

}