export default function(state = null, action) {
    switch (action.type) {
        case 'loadPage':
            {
                return {
                    ...state,
                    files: action.payload.files,
                    subReddit: action.payload.subReddit,
                    page: action.payload.page
                }
            }
        case 'loadPageWithAfterBefore':
            {
                return {
                    ...state,
                    files: action.payload.files,
                    after: action.payload.after,
                    before: action.payload.before,
                }
            }
        case "setFilesEmpty":
            {
                return {
                    ...state,
                    files: action.payload.files
                }
            }
        default:
            return state
    }

}