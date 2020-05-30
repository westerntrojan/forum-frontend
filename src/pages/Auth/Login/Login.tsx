import React, {useState, useEffect, useCallback} from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import {useSnackbar} from 'notistack';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';

import CodeForm from './components/CodeForm';
import {ILoginInputs} from '@pages/Auth/types';

const useStyles = makeStyles(() => ({
	input: {
		marginBottom: 20,
	},
	actions: {
		display: 'flex',
		justifyContent: 'flex-start',
		marginBottom: 20,
	},
}));

type Props = {
	submit: (user: ILoginInputs) => any;
};

const Login: React.FC<Props> = ({submit}) => {
	const classes = useStyles();

	const [userLink, setUserLink] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [disabledButton, setDisabledButton] = useState(true);
	const [twoFactorAuth, setTwoFactorAuth] = useState(false);

	const {enqueueSnackbar} = useSnackbar();

	const validate = useCallback(() => {
		if (userLink.trim() && password.trim()) {
			setDisabledButton(false);
		} else {
			setDisabledButton(true);
		}
	}, [userLink, password]);

	useEffect(() => {
		validate();
	}, [validate]);

	const handleClickShowPassword = (): void => setShowPassword(!showPassword);

	const handleMouseDownPassword = (e: React.MouseEvent): void => e.preventDefault();

	const _handleChangeUserLink = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setUserLink(e.target.value);
	};

	const _handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setPassword(e.target.value);
	};

	const _handleSubmit = async (): Promise<void> => {
		if (disabledButton) {
			return;
		}

		setLoading(true);

		const data: any = await submit({userLink, password});

		if (!data.success) {
			if (data.twoFactorAuth) {
				setTwoFactorAuth(true);
			} else {
				enqueueSnackbar(data.message, {variant: 'error'});
			}

			setLoading(false);
		}
	};

	const _handlePressKeyInput = (target: React.KeyboardEvent): void => {
		if (target.charCode === 13) {
			_handleSubmit();
		}
	};

	return (
		<section className='login'>
			{twoFactorAuth && <CodeForm />}

			{!twoFactorAuth && (
				<div className='form'>
					<TextField
						label='Email or username'
						variant='outlined'
						value={userLink}
						className={classes.input}
						onChange={_handleChangeUserLink}
						onKeyPress={_handlePressKeyInput}
						autoFocus
					/>

					<TextField
						label='Password'
						variant='outlined'
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={_handleChangePassword}
						onKeyPress={_handlePressKeyInput}
						className={classes.input}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<div className={classes.actions}>
						<Link to='/password_reset/email'>Forgot password ?</Link>
					</div>

					<Button
						color='primary'
						variant='contained'
						disabled={disabledButton || loading}
						onClick={_handleSubmit}
						fullWidth
					>
						Submit
					</Button>
				</div>
			)}
		</section>
	);
};

export default Login;