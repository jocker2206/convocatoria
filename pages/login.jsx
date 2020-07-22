import React, { Component } from 'react';
import { Form, Card, Button } from 'semantic-ui-react';

export default class Login extends Component 
{

    static getInitialProps = (ctx) => {
        let { query, pathname } = ctx;
        return { query, pathname };
    }

    state = {
        email: ""
    }   

    componentDidMount = () => {
        this.config();
    }

    config = () => {
        this.setState((state, props) => {
            let { query } = props;
            state.email = query.email || state.email;
            return { email: state.email };
        })
    }

    handleInput = ({ name, value }) => {
        this.setState({ [name]: value });
    }

    render () {

        let { state, props } = this;

        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Card fluid>
                            <Card.Header>
                                <div className="card-body text-center">
                                    <h3 className="">Iniciar Sesión</h3>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <Form>
                                    <div className="row mt-4 justify-content-center pb-5 mb-5">
                                        
                                        <div className="col-md-12 text-center">
                                            <div className="row justify-content-center">
                                                <div style={{ 
                                                    width: "150px", 
                                                    height: "150px", 
                                                    background: "rgba(0,0,0,.1)", 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center",
                                                    borderRadius: "50%",
                                                    color: "#37474f"
                                                }}>
                                                    <i className="fas fa-user" style={{ fontSize: "4em" }}></i>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-10 mb-2 mt-3">
                                            <div className="row justify-content-center">
                                                <div className="col-md-12 mb-2">
                                                    <Form.Field>
                                                        <label className="text-muted">Correo Electrónico</label>
                                                        <input type="text"
                                                            name="email"
                                                            value={state.email || ""}
                                                            onChange={(e) => this.handleInput(e.target)}
                                                        />
                                                    </Form.Field>
                                                </div>

                                                <div className="col-md-12 mb-2 text-right">
                                                    <Button>
                                                        Generar Código
                                                    </Button>
                                                </div>
                                            </div>
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