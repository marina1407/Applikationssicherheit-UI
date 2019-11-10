import { PureComponent } from "react";
import React from "react";

import { PageLayout } from "../shared/layout/pageLayout";
import CreateMarkForm from "./components/create-mark-form/createMarkForm";

export class CreateMarkPage extends PureComponent {
    render() {
        return (
            <PageLayout>
                <CreateMarkForm />
            </PageLayout>
        );
    }
}
