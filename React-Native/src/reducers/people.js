const people = (state = { people: [], peopleLen: 0, isLoading: false }, action) => {

    switch (action.type) {
        case 'RESET_PEOPLE':
            return { people: [], peopleLen: 0, isLoading: true };
        case "REQUEST_PEOPLE":
            return { ...state, isLoading: true };
        case "RECEIVE_PEOPLE":
            return { ...state, people: state.people.concat(action.data), isLoading: false, peopleLen: state.people.concat(action.data).length };
        default: return state;
    }
}
export default people;
