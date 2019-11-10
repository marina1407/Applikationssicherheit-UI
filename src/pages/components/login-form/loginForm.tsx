import "../../../App.css";

import { Field, FieldProps, Form, Formik } from "formik";
import { PureComponent } from "react";
import React from "react";
import {
  Button,
  FormControl,
  FormText,
  InputGroup,
  Jumbotron,
  Alert
} from "react-bootstrap";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import { object, string } from "yup";

import { verifyUser } from "../../../shared/util/apiConnector";
import { getUser, saveUser } from "../../../shared/util/userHandler";

interface FormData {
  email: string;
  password: string;
}

const initialValues: FormData = {
  email: "",
  password: ""
};

export const schema = () =>
  object<FormData>().shape({
    email: string().email("Bitte geben Sie eine gültige E-Mail Adresse an.").required("Bitte geben Sie Ihre E-Mail Adresse ein."),
    password: string().required("Bitte geben Sie Ihr Passwort ein.")
  });

export interface LoginFormState {
  showWrongCredentialsError: boolean;
}

export class LoginForm extends PureComponent<RouteComponentProps, LoginFormState> {

  state = {
    showWrongCredentialsError: false,
  }

  handleSubmit = async (values: FormData) => {
    const user = await verifyUser({ ...values });
    if (user) {
      saveUser(user);
      this.forceUpdate();
    }
    else {
      this.setState({ showWrongCredentialsError: true });
    }
  };

  render() {
    const user = getUser();
    if (user) {
      return <Redirect to="/overview" />;
    }

    return (
      <Jumbotron className="card">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={({ isValid, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <h1>Anmelden</h1>
              {this.state.showWrongCredentialsError && <Alert id="errorAlert" variant="danger" dismissible={true}>
                Die E-Mail Adresse und das Password stimmen nicht überein
              </Alert>}
              <Field
                name="email"
                render={({ form, field }: FieldProps<FormData>) => (
                  <InputGroup>
                    <FormControl
                      name={field.name}
                      type="email"
                      value={field.value.email}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Email"
                    />
                    <FormText>
                      {form.touched.email && form.errors.email}
                    </FormText>
                  </InputGroup>
                )}
              />
              <Field
                name="password"
                render={({ form, field }: FieldProps<FormData>) => (
                  <InputGroup>
                    <FormControl
                      name={field.name}
                      type="password"
                      value={field.value.password}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Password"
                    />
                    <FormText>
                      {form.touched.password && form.errors.password}
                    </FormText>
                  </InputGroup>
                )}
              />
              <p>
                Haben Sie noch kein Konto?
                <a href="/registration"> Hier registrieren!</a>
              </p>
              <Button disabled={!isValid} type="submit" variant="primary">
                Anmelden
              </Button>
            </Form>
          )}
        />
      </Jumbotron>
    );
  }
}
export default withRouter(LoginForm);
