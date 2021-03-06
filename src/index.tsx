import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline, ThemeProvider, Theme, createMuiTheme, IconButton } from '@material-ui/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import netlifyIdentity from 'netlify-identity-widget';
import Home from './components/Home';
import './styles.css';
import ProvideAuth from './components/Auth/provide-auth';
import { SnackbarProvider } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
// import reportWebVitals from './reportWebVitals';

global.installAppEvent = undefined;
netlifyIdentity.init({ locale: "fr" });

const theme: Theme = createMuiTheme({
	palette: {
		primary: {
			main: "#e8272c",
			contrastText: "#ffffff"
		},
		secondary: {
			main: "#ffffff",
			contrastText: "#13aa52"
		}
	}
});

const queryClient = new QueryClient();

const notistackRef = React.createRef<SnackbarProvider>();
const onClickDismiss = (key: string | number) => () => {
	notistackRef.current?.closeSnackbar(key);
}

ReactDOM.render(
	<React.Fragment>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SnackbarProvider
					ref={notistackRef}
					maxSnack={2}
					preventDuplicate
					autoHideDuration={3000}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					action={(key) => (
						<IconButton onClick={onClickDismiss(key)} color="secondary">
							<CloseIcon />
						</IconButton>
					)}
				>
					<ProvideAuth>
						<Router>
							<Route path="/:slug?" component={Home} />
						</Router>
					</ProvideAuth>
				</SnackbarProvider>
			</ThemeProvider>
			{
				process.env.NODE_ENV === "development" ? (
					<ReactQueryDevtools initialIsOpen />
				) : ("")
			}
		</QueryClientProvider>
	</React.Fragment>,
	document.getElementById('root')
);

// reportWebVitals();
