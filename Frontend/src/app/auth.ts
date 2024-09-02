export enum LogoutReason{
    LoggedOut = 'You logged out',
    NeverLoggedIn = 'You are logged out',
    Inactivity = 'You were logged out due to inactivity',
    TokenExpired = 'Your session has expired',
    AuthError = 'You were logged out due to an authentication error'
}