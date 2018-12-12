export enum AuthStateEnum {
    signedIn = 'signedIn',
    signedUp = 'signedUp',
    signedOut = 'signedOut',
    signIn = 'signIn',
    signUp = 'signUp',
    signOut = 'signOut',
    signInFailure = 'signIn_failure',
    signUpFailure = 'signUp_failure',
    confirmSignInFailure = 'confirmSignIn_failure',
    setupMFA = 'setupMFA',
    confirmSignUp = 'confirmSignUp',
    confirmSignIn = 'confirmSignIn',
    newPasswordRequired = 'newPasswordRequired',
    completeNewPasswordFailure = 'completeNewPassword_failure',
    cognitoHostedUI = 'cognitoHostedUI',
    unknown = 'unknown'
}

export interface IAuthState {
    state: AuthStateEnum;
    user?: any;
    mfaType?: string;
    err?: any;
}

export class AuthState {
    state: AuthStateEnum;
    user?: any;
    mfaType?: string;
    err?: any;
    /**
     *
     */
    constructor(evt: IAuthState) {
        this.state = evt.state;
        this.user = evt.user || undefined;
        this.mfaType = evt.mfaType || undefined;
        this.err = evt.err || undefined;
    }

    static unauthenticatedStates(): AuthStateEnum[] {
        return [AuthStateEnum.signIn,
        AuthStateEnum.signInFailure,
        AuthStateEnum.signedOut,
        AuthStateEnum.signUp,
        AuthStateEnum.signedUp,
        AuthStateEnum.signUpFailure,
        AuthStateEnum.confirmSignIn,
        AuthStateEnum.confirmSignInFailure,
        AuthStateEnum.confirmSignUp,
        AuthStateEnum.setupMFA,
        AuthStateEnum.newPasswordRequired,
        AuthStateEnum.completeNewPasswordFailure,
        AuthStateEnum.unknown];
    }
}
