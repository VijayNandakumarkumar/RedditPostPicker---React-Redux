import { combineReducers } from "redux";
import InitialState from "./reducers_initial_state";
import ReducedState from "./reducer_for_actions";

const allReducers = combineReducers({
    initial_state: InitialState,
    reduced_state: ReducedState
});

export default allReducers;