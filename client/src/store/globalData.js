export default function(state = [], action) {
  switch (action.type) {
    case "GLOBAL_DATA":
      return action.payload;
      break;
    default:
      return state;
  }
}
