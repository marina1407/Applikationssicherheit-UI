import React, { ChangeEvent, PureComponent, Fragment } from "react";
import { FormControl } from "react-bootstrap";

import {
  getSemesterMarks,
  getSemesters
} from "../../../shared/util/apiConnector";
import { getUserId } from "../../../shared/util/userHandler";
import SubjectSelector from "../subject-selector/subjectSelector";
import { SemesterModel, SubjectModel } from "../../../shared/util/appContent";

export interface SemesterSelectorState {
  semesterId: number;
  semesters: SemesterModel[];
  subjects: SubjectModel[];
}

export class SemesterSelector extends PureComponent<{}, SemesterSelectorState> {
  state: Readonly<SemesterSelectorState> = {
    semesterId: 0,
    semesters: [],
    subjects: [],
  };

  handleSemesterSelect = async (semester: number) => {
    const subjects = await getSemesterMarks(semester);
    this.setState({subjects});
  }

  componentDidMount = async () => {
    const semesters = await getSemesters(getUserId());
    if (semesters.length !== 0) {
      this.setState({ semesterId: semesters[0].id });
      this.handleSemesterSelect(semesters[0].id);
    }
    this.setState({ semesters });
  };

  render() {
    const { semesterId, semesters, subjects } = this.state;

    return (
      <div id="semester-selector">
        <h1 className="heading">Noten Übersicht</h1>
        {semesters.length !== 0 ?
          <Fragment>
            <FormControl
              className="semester-selector-form"
              as="select"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                this.handleSemesterSelect(+event.target.value);
                this.setState({ semesterId: +event.target.value });
              }}
              selected={this.state.semesterId}
            >
              {semesters.map(sem => (
                <option value={sem.id}>{sem.bezeichnung}</option>
              ))}
            </FormControl>

            <SubjectSelector subjects={subjects} />
          </Fragment>
          : <p className="align-left">Um Ihre noten einsehen zu können, müssen Sie zuerst ein Semester erstellen.</p>}
      </div>
    );
  }
}
