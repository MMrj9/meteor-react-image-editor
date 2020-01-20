import { createMuiTheme } from '@material-ui/core/styles';

export default theme = createMuiTheme({
    overrides: {
        MuiInputLabel: {
            root: {
                fontSize: "22px",
                color: "#fff",
            }
        },
        MuiSelect: {
            root: {
                marginTop: "10px",
                color: "#fff",
            }
        },
        MuiAutocomplete: {
            inputRoot: {
                color: "#fff",
            }
        }
    }
});