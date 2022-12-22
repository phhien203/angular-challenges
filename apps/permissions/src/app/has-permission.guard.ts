// import { Injectable } from '@angular/core';
// import { CanMatch, Route, UrlTree } from '@angular/router';
// import { HasPermissionGuardActions } from '@elio/emanager-front/auth/action';
// import { UserPermission } from '@elio/emanager-front/auth/model';
// import { UserSelectors, UserService } from '@elio/emanager-front/auth/state';
// import { ElioTypedRouter } from '@elio/emanager-front/shared/tools/router';
// import { CallState, isErrorState, isLoadedOrInError } from '@elio/shared/models';
// import { LoggerService } from '@elio/shared/tools/logger';
// import { Store } from '@ngrx/store';
// import { catchError, concatMap, filter, first, map, mergeMap, Observable, of, timeout } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class HasPermissionGuard implements CanMatch {
//   private TIMEOUT_USER_LOADING = 5000;

//   constructor(
//     private store: Store,
//     private userService: UserService,
//     private logger: LoggerService,
//     private router: ElioTypedRouter
//   ) {}

//   canMatch(route: Route): Observable<boolean | UrlTree> {
//     const accessPermissionsList: UserPermission[] | undefined = route.data?.['permissions'];
//     return this.hasPermission$(route.toString(), accessPermissionsList);
//   }

//   private hasPermission$(routeName: string, accessPermissionsList?: UserPermission[]) {
//     this.store.dispatch(HasPermissionGuardActions.loadUser());
//     return this.waitUserIsLoaded().pipe(
//       catchError(() => {
//         this.logger.error(`Request timed out after: ${this.TIMEOUT_USER_LOADING}ms`);
//         return of(false);
//       }),
//       concatMap((isLoggedIn) => {
//         if (!isLoggedIn) {
//           this.logUserNeedToBeLoggedIn(routeName);
//           return of(this.router.parseUrl(['login']));
//         } else {
//           return this.store.select(UserSelectors.getUser).pipe(
//             first(),
//             map((user) => {
//               if (!user) {
//                 this.logUnexistingUser(routeName);
//                 return this.router.parseUrl(['login']);
//               }
//               const result =
//                 user.isSuperAdmin ||
//                 (!!accessPermissionsList &&
//                   accessPermissionsList.some((routePermission) =>
//                     this.userService.hasPermission(user, routePermission)
//                   ));
//               if (!result) {
//                 this.logger.warn(
//                   'Cannot active route because of missing permission or user is not super-admin:',
//                   accessPermissionsList,
//                   'user permission are:',
//                   user.permissions
//                 );
//                 return this.router.parseUrl(['403']);
//               }
//               return result;
//             })
//           );
//         }
//       })
//     );
//   }

//   private waitUserIsLoaded(): Observable<boolean> {
//     return this.store.select(UserSelectors.getUserCallState).pipe(
//       timeout(this.TIMEOUT_USER_LOADING),
//       filter((status: CallState) => isLoadedOrInError(status)), // wait for user to be loaded (connection or page refresh)
//       mergeMap((loadingState) => (isErrorState(loadingState) ? of(false) : this.store.select(UserSelectors.isLoggedIn)))
//     );
//   }

//   private logUnexistingUser(routeName: string): void {
//     this.logger.warn(`Route ${routeName} is not available to null (or undefined) user`);
//   }

//   private logUserNeedToBeLoggedIn(routeName: string): void {
//     this.logger.warn(`User must be logged in to access ${routeName}`);
//   }
// }
