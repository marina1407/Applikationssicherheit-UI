import React, { PureComponent } from "react";

import Navigation from "../components/navigation";

export class PageLayout extends PureComponent {
  render() {
    return (
      <div id="page-layout">
        <Navigation />
        <div id="page-content">{this.props.children}</div>
      </div>
    );
  }
}
