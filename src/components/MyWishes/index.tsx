import React from 'react';
import { Grid, CircularProgress, useMediaQuery } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import useStyles from './styles';
import UserWishes from '../UserWishes';
import { useNetlifyUser } from '../../hooks/netlifyUser';

const MyWishes = () => {
	const isMobile = useMediaQuery('(max-width:555px)');
	const classes = useStyles(isMobile);
	const { user, loading, error } = useNetlifyUser();

	return (
		<Grid item container direction="column" justifyContent="space-between" className={classes.description}>
			<Helmet>
				<title>Ma liste - Caudex</title>
				<meta name="description" content="My wishes - Caudex" />
			</Helmet>
			{
				!loading && !error && user != null ? (
					<UserWishes user={user.email} />
				) : (
					<Grid container justifyContent="center" alignItems="center" className={classes.fallback}>
						<CircularProgress color="secondary" />
					</Grid>
				)
			}
		</Grid>
	);
};

export default MyWishes;
