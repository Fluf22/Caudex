import React from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Grid, Typography } from '@material-ui/core';
import { useAuth } from '../../hooks/auth';
import useStyles from './styles';

const Login = () => {
	const classes = useStyles();
	const location = useLocation();
	const { user, login } = useAuth();

	const { from }: any = location.state || { from: { pathname: "/" } };

	if (user === null) {
		login();
		return (
			<Grid item container direction="column" className={classes.description} justifyContent="space-around">
				<Helmet>
					<title>Home - Caudex</title>
					<meta name="description" content="Homepage of Caudex" />
				</Helmet>
				<Grid item container direction="column" justifyContent="space-evenly" className={classes.paragraph}>
					<Grid item>
						<Typography variant="h4">
							Connexion nécessaire
						</Typography>
					</Grid>
					<Grid item className={classes.paragraphText}>
						<Typography>
							Vous devez vous connecter pour accéder au site
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			);
	} else {
		return (
			<Redirect to={from} />
			);
	}
};

export default Login;
